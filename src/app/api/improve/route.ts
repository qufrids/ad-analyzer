import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import {
  AD_IMPROVER_SYSTEM_PROMPT,
  buildImproverPrompt,
} from "@/lib/prompts/ad-improver";
import { rateLimit } from "@/lib/rate-limit";
import { generateImprovedAdImage } from "@/lib/openai-image";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function callClaude(
  imageBase64: string,
  mediaType: "image/jpeg" | "image/png" | "image/webp",
  userPrompt: string
): Promise<string> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    system: AD_IMPROVER_SYSTEM_PROMPT,
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

function parseJSON(text: string): Record<string, unknown> {
  const cleaned = text
    .replace(/^```(?:json)?\s*\n?/i, "")
    .replace(/\n?```\s*$/i, "")
    .trim();
  return JSON.parse(cleaned);
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // 1. Verify authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 3 requests per minute per user
    const { success: withinLimit, resetInSeconds } = rateLimit(
      `improve:${user.id}`,
      { maxRequests: 3, windowMs: 60_000 }
    );
    if (!withinLimit) {
      return NextResponse.json(
        { error: `Too many requests. Please wait ${resetInSeconds} seconds.` },
        { status: 429 }
      );
    }

    const { analysisId } = await request.json();

    if (!analysisId) {
      return NextResponse.json(
        { error: "Missing analysisId" },
        { status: 400 }
      );
    }

    // 2. Fetch the analysis record
    const { data: analysis, error: fetchErr } = await supabase
      .from("analyses")
      .select("*")
      .eq("id", analysisId)
      .eq("user_id", user.id)
      .single();

    if (fetchErr || !analysis) {
      return NextResponse.json(
        { error: "Analysis not found" },
        { status: 404 }
      );
    }

    // 3. Check credits / subscription
    const { data: profile } = await supabase
      .from("profiles")
      .select("improvements_remaining, subscription_status")
      .eq("id", user.id)
      .single();

    const isPro = profile?.subscription_status === "active";
    const improvementsLeft = profile?.improvements_remaining ?? 0;

    if (!isPro && improvementsLeft <= 0) {
      return NextResponse.json(
        { error: "No improvement credits remaining" },
        { status: 403 }
      );
    }

    // 4. Download image from storage
    const storagePath = analysis.image_url?.split("/ad-images/").pop();
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

    // 5. Build prompt from existing analysis data
    const analysisResult = analysis.analysis_result as {
      overall_score: number;
      summary: string;
      weaknesses: string[];
    };

    const userPrompt = buildImproverPrompt({
      platform: analysis.platform,
      niche: analysis.niche,
      overallScore: analysis.overall_score,
      summary: analysisResult.summary ?? "",
      weaknesses: analysisResult.weaknesses ?? [],
    });

    // 6. Call Claude — retry once on JSON parse failure
    let improvementResult: Record<string, unknown>;

    try {
      const rawText = await callClaude(imageBase64, mediaType, userPrompt);
      improvementResult = parseJSON(rawText);
    } catch (firstError) {
      console.warn("First improve call failed, retrying:", firstError);
      try {
        const rawText = await callClaude(imageBase64, mediaType, userPrompt);
        improvementResult = parseJSON(rawText);
      } catch (retryError) {
        console.error("Retry also failed:", retryError);
        return NextResponse.json(
          { error: "AI improvement failed. Please try again." },
          { status: 502 }
        );
      }
    }

    // 7. Generate improved ad image via DALL-E (best-effort — never blocks the response)
    let improvedImageSignedUrl: string | null = null;

    try {
      const headlines = improvementResult.headlines as Array<{ text: string }> | undefined;
      const bodyCopy = improvementResult.body_copy as { short?: string } | undefined;
      const ctaOptions = improvementResult.cta_options as string[] | undefined;

      const improvedHeadline = headlines?.[0]?.text ?? "";
      const improvedBodyCopy = bodyCopy?.short ?? "";
      const improvedCTA = ctaOptions?.[0] ?? "";

      if (improvedHeadline) {
        const openaiImageUrl = await generateImprovedAdImage({
          improvedHeadline,
          improvedBodyCopy,
          improvedCTA,
          platform: analysis.platform,
          niche: analysis.niche,
          weaknesses: (analysisResult.weaknesses ?? []) as string[],
          strengths: ((analysis.analysis_result as { strengths?: string[] }).strengths ?? []) as string[],
        });

        if (openaiImageUrl) {
          // Download from OpenAI (URL expires in 1 hour)
          const imgRes = await fetch(openaiImageUrl);
          if (imgRes.ok) {
            const imgBuffer = await imgRes.arrayBuffer();
            const uploadPath = `${user.id}/improved/${analysisId}.png`;

            const { error: uploadErr } = await supabase.storage
              .from("ad-images")
              .upload(uploadPath, imgBuffer, {
                contentType: "image/png",
                upsert: true,
              });

            if (!uploadErr) {
              // Store as public-style URL (same format as image_url)
              const { data: urlData } = supabase.storage
                .from("ad-images")
                .getPublicUrl(uploadPath);

              const storedUrl = urlData.publicUrl;

              // Also get a signed URL to return immediately
              const { data: signedData } = await supabase.storage
                .from("ad-images")
                .createSignedUrl(uploadPath, 3600);

              improvedImageSignedUrl = signedData?.signedUrl ?? null;

              // Update the improved_image_url in DB (non-blocking, separate update)
              await supabase
                .from("analyses")
                .update({ improved_image_url: storedUrl })
                .eq("id", analysisId)
                .eq("user_id", user.id);
            }
          }
        }
      }
    } catch (imgError) {
      console.error("Image generation pipeline failed (non-fatal):", imgError);
    }

    // 8. Save improvement result to analyses table
    const { error: updateErr } = await supabase
      .from("analyses")
      .update({
        improvement_result: improvementResult,
        improvement_generated_at: new Date().toISOString(),
      })
      .eq("id", analysisId)
      .eq("user_id", user.id);

    if (updateErr) {
      console.error("DB update error:", updateErr);
      return NextResponse.json(
        { error: "Failed to save improvement" },
        { status: 500 }
      );
    }

    // 9. Deduct improvement credit for free users
    if (!isPro) {
      await supabase
        .from("profiles")
        .update({
          improvements_remaining: Math.max(0, improvementsLeft - 1),
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
    }

    return NextResponse.json({
      result: improvementResult,
      improved_image_url: improvedImageSignedUrl,
    });
  } catch (err) {
    console.error("Improve error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Improvement failed" },
      { status: 500 }
    );
  }
}
