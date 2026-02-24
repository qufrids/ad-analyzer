import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { AD_COMPARE_SYSTEM_PROMPT, buildCompareUserPrompt } from "@/lib/prompts/ad-compare";
import { rateLimit } from "@/lib/rate-limit";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

type MediaType = "image/jpeg" | "image/png" | "image/webp";

function getMediaType(blob: Blob, path: string): MediaType {
  const ext = path.split(".").pop()?.toLowerCase();
  if (blob.type.includes("png") || ext === "png") return "image/png";
  if (blob.type.includes("webp") || ext === "webp") return "image/webp";
  return "image/jpeg";
}

function parseJSON(text: string): Record<string, unknown> {
  const cleaned = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
  return JSON.parse(cleaned);
}

async function downloadImage(supabase: ReturnType<typeof createClient>, imageUrl: string) {
  const storagePath = imageUrl.split("/ad-images/").pop();
  if (!storagePath) throw new Error("Invalid image URL");

  const { data, error } = await supabase.storage
    .from("ad-images")
    .download(decodeURIComponent(storagePath));

  if (error || !data) throw new Error("Failed to fetch image from storage");

  const mediaType = getMediaType(data, storagePath);
  const base64 = Buffer.from(await data.arrayBuffer()).toString("base64");
  return { base64, mediaType };
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 3 per minute
    const { success: withinLimit, remaining, resetInSeconds } = rateLimit(
      `compare:${user.id}`,
      { maxRequests: 3, windowMs: 60_000 }
    );
    if (!withinLimit) {
      return NextResponse.json(
        { error: `Too many requests. Please wait ${resetInSeconds} seconds.` },
        { status: 429, headers: { "Retry-After": String(resetInSeconds) } }
      );
    }

    const { imageAUrl, imageBUrl, platform, niche } = await request.json();

    if (!imageAUrl || !imageBUrl || !platform || !niche) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Credit check
    const { data: profile } = await supabase
      .from("profiles")
      .select("comparisons_remaining, subscription_status")
      .eq("id", user.id)
      .single();

    const isPro = profile?.subscription_status === "active";
    if (!isPro && (profile?.comparisons_remaining ?? 0) <= 0) {
      return NextResponse.json({ error: "No comparisons remaining" }, { status: 403 });
    }

    // Download both images in parallel
    const [imageA, imageB] = await Promise.all([
      downloadImage(supabase, imageAUrl),
      downloadImage(supabase, imageBUrl),
    ]);

    // Single Claude call with both images
    const userPrompt = buildCompareUserPrompt(platform, niche);

    const callClaude = async (): Promise<string> => {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        system: AD_COMPARE_SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: imageA.mediaType, data: imageA.base64 },
              },
              { type: "text", text: "This is Ad A." },
              {
                type: "image",
                source: { type: "base64", media_type: imageB.mediaType, data: imageB.base64 },
              },
              { type: "text", text: `This is Ad B. ${userPrompt}` },
            ],
          },
        ],
      });
      const block = response.content.find((b) => b.type === "text");
      if (!block || block.type !== "text") throw new Error("No text response from AI");
      return block.text;
    }

    let result: Record<string, unknown>;
    try {
      result = parseJSON(await callClaude());
    } catch {
      try {
        result = parseJSON(await callClaude());
      } catch {
        return NextResponse.json({ error: "AI analysis failed. Please try again." }, { status: 502 });
      }
    }

    // Save to comparisons table
    const { data: comparison, error: insertErr } = await supabase
      .from("comparisons")
      .insert({
        user_id: user.id,
        image_a_url: imageAUrl,
        image_b_url: imageBUrl,
        platform,
        niche,
        result,
      })
      .select("id")
      .single();

    if (insertErr) {
      console.error("DB insert error:", insertErr);
      return NextResponse.json({ error: "Failed to save comparison" }, { status: 500 });
    }

    // Deduct credit for free users
    if (!isPro) {
      await supabase
        .from("profiles")
        .update({ comparisons_remaining: Math.max(0, (profile?.comparisons_remaining ?? 1) - 1) })
        .eq("id", user.id);
    }

    return NextResponse.json(
      { comparisonId: comparison.id },
      { headers: { "X-RateLimit-Remaining": String(remaining) } }
    );
  } catch (err) {
    console.error("Compare error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Comparison failed" },
      { status: 500 }
    );
  }
}
