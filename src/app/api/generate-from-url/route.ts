import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { load as cheerioLoad } from "cheerio";
import {
  GENERATE_FROM_URL_SYSTEM_PROMPT,
  buildGenerateUserPrompt,
} from "@/lib/prompts/generate-from-url";
import { rateLimit } from "@/lib/rate-limit";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function parseJSON(text: string): Record<string, unknown> {
  const cleaned = text
    .replace(/^```(?:json)?\s*\n?/i, "")
    .replace(/\n?```\s*$/i, "")
    .trim();
  return JSON.parse(cleaned);
}

function isValidProductUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    if (!["http:", "https:"].includes(u.protocol)) return false;
    const hostname = u.hostname.toLowerCase();
    // Block internal/private addresses
    if (
      hostname === "localhost" ||
      hostname.startsWith("127.") ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      hostname.endsWith(".local")
    )
      return false;
    return true;
  } catch {
    return false;
  }
}

async function fetchPageHtml(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

interface ProductInfo {
  product_name: string;
  description: string;
  price: string;
  features: string;
  reviews: string;
}

function extractProductInfo(html: string, url: string): ProductInfo {
  const $ = cheerioLoad(html);

  // Remove noise
  $("script, style, noscript, svg, header, footer, nav").remove();

  // Product name — prefer h1, then OG title, then <title>
  const h1 = $("h1").first().text().trim();
  const ogTitle = $('meta[property="og:title"]').attr("content") ?? "";
  const titleTag = $("title").text().split(/[|–\-]/)[0].trim();
  const product_name = h1 || ogTitle || titleTag || new URL(url).hostname;

  // Meta description
  const metaDesc =
    $('meta[name="description"]').attr("content") ??
    $('meta[property="og:description"]').attr("content") ??
    "";

  // Product description — common selectors across platforms
  const descSelectors = [
    '[class*="product-description"]',
    '[class*="product__description"]',
    '[class*="ProductDescription"]',
    '[itemprop="description"]',
    "#product-description",
    ".description",
    '[data-testid*="description"]',
  ];
  let description = "";
  for (const sel of descSelectors) {
    const t = $(sel).first().text().trim();
    if (t && t.length > 30) {
      description = t;
      break;
    }
  }
  if (!description) description = metaDesc;
  if (!description) {
    // Last resort: grab first long paragraph
    $("p").each((_, el) => {
      const t = $(el).text().trim();
      if (t.length > 80 && !description) description = t;
    });
  }

  // Price — various patterns
  const priceSelectors = [
    '[itemprop="price"]',
    '[class*="product-price"]',
    '[class*="price--main"]',
    '[class*="price__current"]',
    ".price",
    "#price",
    '[data-price]',
  ];
  let price = "Not specified";
  for (const sel of priceSelectors) {
    const el = $(sel).first();
    const val =
      el.attr("content") ||
      el.attr("data-price") ||
      el.text().replace(/\s+/g, " ").trim();
    const match = val.match(/[\$£€¥₹][\d,]+\.?\d*/);
    if (match) {
      price = match[0];
      break;
    }
  }

  // Key features — bullet points and lists
  const featureTexts: string[] = [];
  $(
    '[class*="feature"] li, [class*="benefit"] li, [class*="highlight"] li, .product-features li, ul.features li'
  )
    .slice(0, 6)
    .each((_, el) => {
      const t = $(el).text().trim();
      if (t && t.length > 4 && t.length < 200) featureTexts.push(t);
    });
  const features = featureTexts.join("; ");

  // Reviews — snippets
  const reviewTexts: string[] = [];
  $('[class*="review-body"], [class*="review__body"], [itemprop="reviewBody"]')
    .slice(0, 2)
    .each((_, el) => {
      const t = $(el).text().trim().slice(0, 200);
      if (t) reviewTexts.push(t);
    });

  return {
    product_name: product_name.slice(0, 120),
    description: description.slice(0, 1500),
    price,
    features: features || metaDesc.slice(0, 300),
    reviews: reviewTexts.join(" | "),
  };
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 2/min (URL fetching is expensive)
    const {
      success: withinLimit,
      remaining,
      resetInSeconds,
    } = rateLimit(`generate:${user.id}`, { maxRequests: 2, windowMs: 60_000 });
    if (!withinLimit) {
      return NextResponse.json(
        { error: `Too many requests. Please wait ${resetInSeconds} seconds.` },
        {
          status: 429,
          headers: { "Retry-After": String(resetInSeconds) },
        }
      );
    }

    const { url, platforms, tone } = await request.json();

    if (!url || !platforms?.length || !tone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!isValidProductUrl(url)) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Credit check
    const { data: profile } = await supabase
      .from("profiles")
      .select("generations_remaining, subscription_status")
      .eq("id", user.id)
      .single();

    const isPro = profile?.subscription_status === "active";
    if (!isPro && (profile?.generations_remaining ?? 0) <= 0) {
      return NextResponse.json(
        { error: "No generations remaining" },
        { status: 403 }
      );
    }

    // Step 1: Fetch product page
    let productInfo: ProductInfo;
    let htmlFetchSuccess = true;

    try {
      const html = await fetchPageHtml(url);
      productInfo = extractProductInfo(html, url);
    } catch (fetchErr) {
      console.warn("URL fetch failed, using URL-only fallback:", fetchErr);
      htmlFetchSuccess = false;
      const hostname = new URL(url).hostname.replace("www.", "");
      const pathSlug = new URL(url).pathname
        .split("/")
        .filter(Boolean)
        .pop()
        ?.replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()) ?? "";
      productInfo = {
        product_name: pathSlug || hostname,
        description: `Product from ${hostname}. URL: ${url}`,
        price: "Not available",
        features: "",
        reviews: "",
      };
    }

    // Step 2: Call Claude
    const userPrompt = buildGenerateUserPrompt(productInfo, platforms, tone);

    const callClaude = async (): Promise<string> => {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        system: GENERATE_FROM_URL_SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
      });
      const block = response.content.find((b) => b.type === "text");
      if (!block || block.type !== "text")
        throw new Error("No text response from AI");
      return block.text;
    };

    let result: Record<string, unknown>;
    try {
      result = parseJSON(await callClaude());
    } catch {
      try {
        result = parseJSON(await callClaude());
      } catch {
        return NextResponse.json(
          { error: "AI generation failed. Please try again." },
          { status: 502 }
        );
      }
    }

    // Step 3: Save to DB
    const { data: gen, error: insertErr } = await supabase
      .from("generated_ads")
      .insert({
        user_id: user.id,
        product_url: url,
        platforms,
        tone,
        product_info: { ...productInfo, fetch_success: htmlFetchSuccess },
        result,
      })
      .select("id")
      .single();

    if (insertErr) {
      console.error("DB insert error:", insertErr);
      return NextResponse.json(
        { error: "Failed to save generation" },
        { status: 500 }
      );
    }

    // Deduct credit for free users
    if (!isPro) {
      await supabase
        .from("profiles")
        .update({
          generations_remaining: Math.max(
            0,
            (profile?.generations_remaining ?? 1) - 1
          ),
        })
        .eq("id", user.id);
    }

    return NextResponse.json(
      { generationId: gen.id },
      { headers: { "X-RateLimit-Remaining": String(remaining) } }
    );
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 }
    );
  }
}
