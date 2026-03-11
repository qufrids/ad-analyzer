import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import {
  AD_IMPROVER_SYSTEM_PROMPT,
  buildImproverPrompt,
} from "@/lib/prompts/ad-improver";
import { rateLimit } from "@/lib/rate-limit";
import { generateImprovedAdImage } from "@/lib/openai-image";
import { composeAdImage } from "@/lib/image-composer";

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
      strengths: string[];
      scores?: Record<string, { score: number; feedback: string }>;
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

    // 7. Generate improved ad image via DALL-E + Sharp text overlay (best-effort)
    let improvedImageSignedUrl: string | null = null;

    try {
      const headlines = improvementResult.headlines as Array<{ text: string }> | undefined;
      const ctaOptions = improvementResult.cta_options as string[] | undefined;

      const improvedHeadline = headlines?.[0]?.text ?? "";
      const improvedCTA = ctaOptions?.[0] ?? "";

      console.log('=== STARTING IMAGE GENERATION ===');
      console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
      console.log('OPENAI_API_KEY starts with:', process.env.OPENAI_API_KEY?.substring(0, 7));
      console.log('[img] headline:', improvedHeadline || "(empty)");

      if (improvedHeadline) {
        // Step 1: Generate base image with DALL-E 3 (HD, no text in image)
        const openaiImageUrl = await generateImprovedAdImage({
          originalAnalysis: {
            overall_score: analysis.overall_score,
            weaknesses: analysisResult.weaknesses ?? [],
            strengths: analysisResult.strengths ?? [],
            scores: analysisResult.scores,
          },
          improvementResult: {
            headlines: headlines,
            cta_options: ctaOptions,
            creative_direction: (improvementResult.creative_direction as {
              visual_improvements?: string;
              color_psychology?: string;
            } | undefined),
          },
          platform: analysis.platform,
          niche: analysis.niche,
        });

        console.log("[img] DALL-E URL:", openaiImageUrl ? "received" : "null");

        if (openaiImageUrl) {
          // Step 2: Composite headline + CTA button onto image using Sharp
          console.log("[img] Starting Sharp compose...");
          const composedBuffer = await composeAdImage({
            imageUrl: openaiImageUrl,
            headline: improvedHeadline,
            ctaText: improvedCTA,
            platform: analysis.platform,
            niche: analysis.niche,
          });
          console.log("[img] Composed buffer size:", composedBuffer.length);

          const uploadPath = `${user.id}/improved/${analysisId}.png`;

          const { error: uploadErr } = await supabase.storage
            .from("ad-images")
            .upload(uploadPath, composedBuffer, {
              contentType: "image/png",
              upsert: true,
            });

          console.log("[img] Storage upload error:", uploadErr ?? "none");

          if (!uploadErr) {
            const { data: urlData } = supabase.storage
              .from("ad-images")
              .getPublicUrl(uploadPath);

            const storedUrl = urlData.publicUrl;

            const { data: signedData } = await supabase.storage
              .from("ad-images")
              .createSignedUrl(uploadPath, 3600);

            improvedImageSignedUrl = signedData?.signedUrl ?? null;
            console.log("[img] Signed URL:", improvedImageSignedUrl ? "ok" : "null");

            await supabase
              .from("analyses")
              .update({ improved_image_url: storedUrl })
              .eq("id", analysisId)
              .eq("user_id", user.id);
          }
        }
      }
    } catch (imgError) {
      const error = imgError as Error;
      console.error('=== IMAGE GENERATION FAILED ===');
      console.error('Error name:', error?.name);
      console.error('Error message:', error?.message);
      console.error('Full error:', JSON.stringify(imgError, null, 2));
      console.error('Stack trace:', error?.stack);
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
