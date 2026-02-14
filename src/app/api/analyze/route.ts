import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import {
  AD_ANALYSIS_SYSTEM_PROMPT,
  buildUserPrompt,
} from "@/lib/prompts/ad-analysis";
import { rateLimit } from "@/lib/rate-limit";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function callClaude(
  imageBase64: string,
  mediaType: "image/jpeg" | "image/png" | "image/webp",
  userPrompt: string
): Promise<string> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    system: AD_ANALYSIS_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType,
              data: imageBase64,
            },
          },
          {
            type: "text",
            text: userPrompt,
          },
        ],
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from AI");
  }
  return textBlock.text;
}

function parseAnalysisJSON(text: string): Record<string, unknown> {
  // Strip markdown code fences if present
  const cleaned = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
  return JSON.parse(cleaned);
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();

    // 1. Verify authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 5 requests per minute per user
    const { success: withinLimit, remaining, resetInSeconds } = rateLimit(
      `analyze:${user.id}`,
      { maxRequests: 5, windowMs: 60_000 }
    );
    if (!withinLimit) {
      return NextResponse.json(
        { error: `Too many requests. Please wait ${resetInSeconds} seconds.` },
        {
          status: 429,
          headers: {
            "Retry-After": String(resetInSeconds),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const { imageUrl, platform, niche, targetAudience, productOffer } =
      await request.json();

    if (!imageUrl || !platform || !niche) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 2. Check credits / subscription
    const { data: profile } = await supabase
      .from("profiles")
      .select("credits_remaining, subscription_status")
      .eq("id", user.id)
      .single();

    if (
      profile?.subscription_status !== "active" &&
      (profile?.credits_remaining ?? 0) <= 0
    ) {
      return NextResponse.json(
        { error: "No credits remaining" },
        { status: 403 }
      );
    }

    // 3. Download image from storage using Supabase (handles private buckets)
    // Extract the file path from the full storage URL
    const storagePath = imageUrl.split("/ad-images/").pop();
    if (!storagePath) {
      return NextResponse.json(
        { error: "Invalid image URL" },
        { status: 400 }
      );
    }

    const { data: imageData, error: downloadErr } = await supabase.storage
      .from("ad-images")
      .download(decodeURIComponent(storagePath));

    if (downloadErr || !imageData) {
      console.error("Storage download error:", downloadErr);
      return NextResponse.json(
        { error: "Failed to fetch image from storage" },
        { status: 400 }
      );
    }

    // Detect media type from file extension or blob type
    const blobType = imageData.type;
    const fileExt = storagePath.split(".").pop()?.toLowerCase();
    const mediaType: "image/jpeg" | "image/png" | "image/webp" =
      blobType.includes("png") || fileExt === "png"
        ? "image/png"
        : blobType.includes("webp") || fileExt === "webp"
        ? "image/webp"
        : "image/jpeg";

    const imageBuffer = await imageData.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString("base64");

    // 4. Build prompt
    const userPrompt = buildUserPrompt({
      platform,
      niche,
      targetAudience,
      productOffer,
    });

    // 5. Call Claude — retry once if JSON parsing fails
    let analysisResult: Record<string, unknown>;
    let rawText: string;

    try {
      rawText = await callClaude(imageBase64, mediaType, userPrompt);
      analysisResult = parseAnalysisJSON(rawText);
    } catch (firstError) {
      console.warn("First Claude call failed, retrying:", firstError);
      try {
        rawText = await callClaude(imageBase64, mediaType, userPrompt);
        analysisResult = parseAnalysisJSON(rawText);
      } catch (retryError) {
        console.error("Retry also failed:", retryError);
        return NextResponse.json(
          { error: "AI analysis failed. Please try again." },
          { status: 502 }
        );
      }
    }

    // 6. Validate and clamp score
    const overallScore = Math.min(
      100,
      Math.max(1, Math.round(Number(analysisResult.overall_score) || 50))
    );

    // 7. Map values to match DB constraints
    const allowedNiches = ["fashion", "beauty", "tech", "fitness", "food", "home", "other"];
    const nicheMap: Record<string, string> = {
      tech_gadgets: "tech",
      home_garden: "home",
    };
    const dbNiche = nicheMap[niche] || (allowedNiches.includes(niche) ? niche : "other");

    const platformMap: Record<string, string> = {
      google_ads: "google",
    };
    const dbPlatform = platformMap[platform] || platform;

    // 8. Save to database
    const { data: analysis, error: insertErr } = await supabase
      .from("analyses")
      .insert({
        user_id: user.id,
        image_url: imageUrl,
        platform: dbPlatform,
        niche: dbNiche,
        overall_score: overallScore,
        analysis_result: analysisResult,
      })
      .select("id")
      .single();

    if (insertErr) {
      console.error("DB insert error:", insertErr);
      return NextResponse.json(
        { error: "Failed to save analysis" },
        { status: 500 }
      );
    }

    // 9. Deduct credit for free users
    if (profile?.subscription_status !== "active") {
      await supabase
        .from("profiles")
        .update({
          credits_remaining: (profile?.credits_remaining ?? 1) - 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
    }

    return NextResponse.json(
      { analysisId: analysis.id },
      { headers: { "X-RateLimit-Remaining": String(remaining) } }
    );
  } catch (err) {
    console.error("Analysis error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Analysis failed" },
      { status: 500 }
    );
  }
}
