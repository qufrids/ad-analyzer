import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { COMPETITOR_SPY_SYSTEM_PROMPT, buildSpyUserPrompt } from "@/lib/prompts/competitor-spy";
import { rateLimit } from "@/lib/rate-limit";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

type MediaType = "image/jpeg" | "image/png" | "image/webp";

function parseJSON(text: string): Record<string, unknown> {
  const cleaned = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
  return JSON.parse(cleaned);
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
      `spy:${user.id}`,
      { maxRequests: 3, windowMs: 60_000 }
    );
    if (!withinLimit) {
      return NextResponse.json(
        { error: `Too many requests. Please wait ${resetInSeconds} seconds.` },
        { status: 429, headers: { "Retry-After": String(resetInSeconds) } }
      );
    }

    const { imageUrl, platform, niche, userProduct } = await request.json();

    if (!imageUrl || !platform || !niche) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Credit check
    const { data: profile } = await supabase
      .from("profiles")
      .select("spy_credits_remaining, subscription_status")
      .eq("id", user.id)
      .single();

    const isPro = profile?.subscription_status === "active";
    if (!isPro && (profile?.spy_credits_remaining ?? 0) <= 0) {
      return NextResponse.json({ error: "No spy credits remaining" }, { status: 403 });
    }

    // Download image from storage
    const storagePath = imageUrl.split("/ad-images/").pop();
    if (!storagePath) {
      return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
    }

    const { data: imageData, error: downloadErr } = await supabase.storage
      .from("ad-images")
      .download(decodeURIComponent(storagePath));

    if (downloadErr || !imageData) {
      return NextResponse.json({ error: "Failed to fetch image from storage" }, { status: 400 });
    }

    const ext = storagePath.split(".").pop()?.toLowerCase();
    const mediaType: MediaType =
      imageData.type.includes("png") || ext === "png"
        ? "image/png"
        : imageData.type.includes("webp") || ext === "webp"
        ? "image/webp"
        : "image/jpeg";

    const base64 = Buffer.from(await imageData.arrayBuffer()).toString("base64");
    const userPrompt = buildSpyUserPrompt(platform, niche, userProduct);

    // Call Claude — retry once on JSON parse failure
    const callClaude = async (): Promise<string> => {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 3000,
        system: COMPETITOR_SPY_SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: mediaType, data: base64 },
              },
              { type: "text", text: userPrompt },
            ],
          },
        ],
      });
      const block = response.content.find((b) => b.type === "text");
      if (!block || block.type !== "text") throw new Error("No text response from AI");
      return block.text;
    };

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

    // Save to spy_analyses table
    const { data: spyAnalysis, error: insertErr } = await supabase
      .from("spy_analyses")
      .insert({
        user_id: user.id,
        image_url: imageUrl,
        platform,
        niche,
        user_product: userProduct ?? null,
        result,
      })
      .select("id")
      .single();

    if (insertErr) {
      console.error("DB insert error:", insertErr);
      return NextResponse.json({ error: "Failed to save analysis" }, { status: 500 });
    }

    // Deduct credit for free users
    if (!isPro) {
      await supabase
        .from("profiles")
        .update({ spy_credits_remaining: Math.max(0, (profile?.spy_credits_remaining ?? 1) - 1) })
        .eq("id", user.id);
    }

    return NextResponse.json(
      { spyId: spyAnalysis.id },
      { headers: { "X-RateLimit-Remaining": String(remaining) } }
    );
  } catch (err) {
    console.error("Spy analysis error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Analysis failed" },
      { status: 500 }
    );
  }
}
