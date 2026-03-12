import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import {
  AD_IMPROVER_SYSTEM_PROMPT,
  buildImproverPrompt,
} from "@/lib/prompts/ad-improver";
import { rateLimit } from "@/lib/rate-limit";
import { renderAdImage, getTemplatesForNiche } from "@/lib/ad-image-renderer";
import { canPerformAction, incrementUsage } from "@/lib/usage";

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

    // 3. Check monthly quota
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_tier, subscription_status")
      .eq("id", user.id)
      .single();

    const tier = profile?.subscription_tier ?? 'free';
    const quota = await canPerformAction(user.id, 'improvements', tier);
    if (!quota.allowed) {
      return NextResponse.json(
        { error: 'limit_reached', used: quota.used, limit: quota.limit, upgrade_tier: tier === 'free' ? 'starter' : tier === 'starter' ? 'pro' : 'agency' },
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

    // 7. Generate 3 improved ad image variations via Satori (best-effort)
    const improvedImageSignedUrls: string[] = [];
    const improvedImagePaths: string[] = [];

    try {
      const headlines = improvementResult.headlines as Array<{ text: string }> | undefined;
      const ctaOptions = improvementResult.cta_options as string[] | undefined;
      const bodyCopyObj = improvementResult.body_copy as { short?: string; medium?: string; long?: string } | undefined;

      const bestHeadline = headlines?.[0]?.text ?? "";
      const bestBodyCopy = bodyCopyObj?.short ?? bodyCopyObj?.medium ?? "";
      const bestCTA = ctaOptions?.[0] ?? "";

      if (bestHeadline) {
        const templates = getTemplatesForNiche(analysis.niche);
        const adminStorage = createServiceClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        ).storage;

        for (let i = 0; i < templates.length; i++) {
          try {
            const pngBuffer = await renderAdImage({
              headline: bestHeadline,
              bodyCopy: bestBodyCopy,
              ctaText: bestCTA,
              brandName: "",
              platform: analysis.platform,
              niche: analysis.niche,
              template: templates[i],
            });

            const storagePath = `${user.id}/improved/${analysisId}_variation_${i + 1}.png`;
            const { error: uploadErr } = await adminStorage
              .from("ad-images")
              .upload(storagePath, pngBuffer, { contentType: "image/png", upsert: true });

            if (!uploadErr) {
              const { data: signedData } = await adminStorage
                .from("ad-images")
                .createSignedUrl(storagePath, 3600);
              if (signedData?.signedUrl) {
                improvedImageSignedUrls.push(signedData.signedUrl);
                improvedImagePaths.push(storagePath);
              }
            }
          } catch (varErr) {
            console.error(`Variation ${i + 1} failed:`, varErr);
          }
        }

        if (improvedImagePaths.length > 0) {
          const firstPublicUrl = adminStorage
            .from("ad-images")
            .getPublicUrl(improvedImagePaths[0]).data.publicUrl;

          await supabase
            .from("analyses")
            .update({
              improved_image_url: firstPublicUrl,
              improved_image_urls: improvedImagePaths,
            })
            .eq("id", analysisId)
            .eq("user_id", user.id);
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

    // 9. Increment usage
    await incrementUsage(user.id, 'improvements');

    return NextResponse.json({
      result: improvementResult,
      improved_image_urls: improvedImageSignedUrls,
    });
  } catch (err) {
    console.error("Improve error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Improvement failed" },
      { status: 500 }
    );
  }
}
