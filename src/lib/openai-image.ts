import OpenAI from "openai";

function getOpenAIClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });
}

/* ── Niche visual profiles ─────────────────────────────────────────── */
function getNicheStyle(niche: string): {
  visualStyle: string;
  mood: string;
  colorPalette: string;
  lighting: string;
  background: string;
  dalleStyle: "natural" | "vivid";
} {
  const n = niche.toLowerCase();

  if (n.includes("fashion") || n.includes("luxury") || n.includes("apparel")) {
    return {
      visualStyle:
        "clean, editorial, high-fashion aesthetic. Soft gradients, elegant minimalism, muted tones with one bold accent color. Inspired by Glossier and Fenty Beauty campaigns",
      mood: "luxurious, aspirational, and effortlessly cool",
      colorPalette: "cream white, dusty rose, and soft gold accent",
      lighting: "diffused soft studio lighting with gentle rim light",
      background: "smooth soft-gradient from off-white to blush, minimal and airy",
      dalleStyle: "natural",
    };
  }

  if (n.includes("beauty") || n.includes("skincare") || n.includes("cosmetic")) {
    return {
      visualStyle:
        "premium beauty editorial. Clean, dewy, glowing aesthetic with close-up product hero shots. Inspired by Charlotte Tilbury and La Mer campaign visuals",
      mood: "radiant, luxurious, and confidence-inspiring",
      colorPalette: "pearl white, rose gold, and champagne",
      lighting: "luminous soft-box beauty lighting with subtle specular highlights",
      background: "elegant marble texture or silky gradient from white to blush pink",
      dalleStyle: "natural",
    };
  }

  if (n.includes("tech") || n.includes("gadget") || n.includes("software") || n.includes("app") || n.includes("saas")) {
    return {
      visualStyle:
        "sleek, ultra-modern dark-mode aesthetic. Product floating with subtle environmental reflections and neon electric blue or cyan accents. Inspired by Apple and Samsung launch campaigns",
      mood: "cutting-edge, powerful, and innovative",
      colorPalette: "deep black, electric blue (#00B4FF), and chrome silver",
      lighting: "dramatic studio spot lighting with electric neon rim light",
      background:
        "deep charcoal black with subtle radial glow and geometric light grid lines",
      dalleStyle: "vivid",
    };
  }

  if (n.includes("fitness") || n.includes("sport") || n.includes("gym") || n.includes("health")) {
    return {
      visualStyle:
        "high-energy, bold, dynamic composition with strong diagonal lines and action-oriented framing. Inspired by Nike and Gymshark campaigns — powerful and motivational",
      mood: "energetic, driven, and unstoppable",
      colorPalette: "jet black, electric orange (#FF5722), and white",
      lighting: "dramatic high-contrast directional lighting with deep shadows",
      background:
        "dark gradient background with motion blur streaks and bold geometric shapes",
      dalleStyle: "vivid",
    };
  }

  if (n.includes("food") || n.includes("restaurant") || n.includes("beverage") || n.includes("drink")) {
    return {
      visualStyle:
        "mouth-watering food photography aesthetic. Warm, rich, textural close-up composition. Inspired by Bon Appétit magazine spreads and HelloFresh campaigns — natural and appetizing",
      mood: "warm, inviting, and indulgent",
      colorPalette: "warm amber, terracotta, and cream white",
      lighting: "natural window light with warm golden-hour warmth",
      background:
        "rustic wooden surface or clean marble counter with soft shadows",
      dalleStyle: "natural",
    };
  }

  if (n.includes("home") || n.includes("garden") || n.includes("interior") || n.includes("furniture")) {
    return {
      visualStyle:
        "warm, aspirational lifestyle photography. Natural, lived-in spaces with carefully curated objects. Inspired by West Elm and IKEA campaign photography — attainable yet beautiful",
      mood: "calm, warm, and aspirationally attainable",
      colorPalette: "warm white, sage green, and natural oak wood tones",
      lighting:
        "warm natural morning light streaming through windows, creating soft shadows",
      background:
        "a beautifully styled, softly lit interior lifestyle scene",
      dalleStyle: "natural",
    };
  }

  if (n.includes("finance") || n.includes("business") || n.includes("invest") || n.includes("insurance")) {
    return {
      visualStyle:
        "sophisticated, trust-building corporate aesthetic. Clean geometric layouts with strong typographic hierarchy. Inspired by premium consulting firm and fintech brand visuals",
      mood: "authoritative, trustworthy, and premium",
      colorPalette: "deep navy (#1A2E5A), forest green, and polished gold",
      lighting: "clean, bright, professional studio lighting",
      background:
        "deep navy gradient with subtle geometric grid pattern or abstract data visualization",
      dalleStyle: "vivid",
    };
  }

  if (n.includes("travel") || n.includes("hotel") || n.includes("tourism")) {
    return {
      visualStyle:
        "breathtaking travel photography with cinematic wide-angle perspective. Rich, saturated landscapes. Inspired by Airbnb and National Geographic visual storytelling",
      mood: "adventurous, wanderlust-inducing, and immersive",
      colorPalette: "turquoise ocean blue, golden sunset orange, and pristine white",
      lighting: "cinematic golden hour or blue hour ambient light",
      background: "a stunning, aspirational landscape or destination scene",
      dalleStyle: "vivid",
    };
  }

  if (n.includes("education") || n.includes("course") || n.includes("coaching") || n.includes("training")) {
    return {
      visualStyle:
        "modern, empowering design with clean layout. Growth-oriented imagery. Inspired by MasterClass and Coursera brand visuals — premium yet accessible",
      mood: "empowering, aspirational, and forward-thinking",
      colorPalette: "indigo (#4C1D95), bright white, and warm amber accent",
      lighting: "bright, clean studio lighting suggesting clarity and focus",
      background:
        "clean gradient from deep indigo to rich purple, or minimalist office setting",
      dalleStyle: "vivid",
    };
  }

  // Default: modern versatile
  return {
    visualStyle:
      "clean, contemporary, versatile design with bold typography and confident layout. Modern, professional aesthetic that commands attention",
    mood: "confident, modern, and compelling",
    colorPalette: "deep navy, vibrant blue-purple, and crisp white",
    lighting: "clean professional studio lighting with balanced shadows",
    background:
      "smooth gradient from deep navy to rich purple, premium and sophisticated",
    dalleStyle: "vivid",
  };
}

/* ── Platform layout profiles ─────────────────────────────────────── */
function getPlatformLayout(platform: string): {
  layoutDesc: string;
  headlinePosition: string;
  ctaPosition: string;
  size: "1024x1024" | "1792x1024" | "1024x1792";
} {
  const p = platform.toLowerCase();

  if (p.includes("tiktok") || p.includes("story") || p.includes("stories") || p.includes("reel")) {
    return {
      layoutDesc:
        "vertical 9:16 portrait format filling the full screen. Bold visual impact in the center third, with clear space at top and bottom for text overlays. Strong focal point in the center",
      headlinePosition: "upper third of the composition",
      ctaPosition: "lower fifth of the composition",
      size: "1024x1792",
    };
  }

  if (p.includes("google") || p.includes("display") || p.includes("banner")) {
    return {
      layoutDesc:
        "landscape format. Clear product hero on the right side, clean open space on the left for text overlays. Uncluttered, direct, and immediately readable layout",
      headlinePosition: "left third of the composition",
      ctaPosition: "lower-left area of the composition",
      size: "1792x1024",
    };
  }

  if (p.includes("instagram")) {
    return {
      layoutDesc:
        "perfect square format. Visually striking with a strong central focal point. Minimal clutter — Instagram rewards visual-first creatives. The composition uses negative space intentionally",
      headlinePosition: "lower third of the composition",
      ctaPosition: "bottom portion of the composition",
      size: "1024x1024",
    };
  }

  // Facebook default (also LinkedIn, Pinterest)
  return {
    layoutDesc:
      "square format. Product or visual hero takes 60% of the space. Clean open area at the bottom for text overlays. Subtle brand bar concept at the bottom edge",
    headlinePosition: "lower third of the composition",
    ctaPosition: "bottom area of the composition",
    size: "1024x1024",
  };
}

/* ── Main export ──────────────────────────────────────────────────── */
export async function generateImprovedAdImage({
  originalAnalysis,
  improvementResult,
  platform,
  niche,
}: {
  originalAnalysis: {
    overall_score: number;
    weaknesses?: string[];
    strengths?: string[];
    scores?: Record<string, { score: number; feedback: string }>;
  };
  improvementResult: {
    headlines?: Array<{ text: string; why_it_works?: string }>;
    cta_options?: string[];
    creative_direction?: {
      visual_improvements?: string;
      color_psychology?: string;
    };
  };
  platform: string;
  niche: string;
}): Promise<string | null> {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  const nicheStyle = getNicheStyle(niche);
  const platformLayout = getPlatformLayout(platform);

  // Extract creative direction hints from improvement result
  const visualHint = improvementResult.creative_direction?.visual_improvements ?? "";
  const colorHint = improvementResult.creative_direction?.color_psychology ?? "";
  const creativeHint =
    visualHint || colorHint
      ? ` The creative direction emphasizes: ${[visualHint, colorHint].filter(Boolean).join(". ")}.`
      : "";

  // Determine focal point from original weaknesses
  const weaknesses = originalAnalysis.weaknesses ?? [];
  const hadLowVisualImpact =
    (originalAnalysis.scores?.visual_impact?.score ?? 100) < 60;
  const focalPointDesc = hadLowVisualImpact
    ? "a dramatically improved, eye-catching hero visual element that immediately captures attention"
    : "a compelling hero product or lifestyle image that reinforces the value proposition";

  // Build the expert DALL-E prompt — NO TEXT in the image
  const prompt =
    `A premium, award-winning ${platform} advertisement for a ${niche} product. ` +
    `${nicheStyle.visualStyle}. ` +
    `The ad uses a ${platformLayout.layoutDesc}. ` +
    `The overall mood is ${nicheStyle.mood}. ` +
    `The design uses a sophisticated color palette of ${nicheStyle.colorPalette}${colorHint ? `, incorporating ${colorHint}` : ""}. ` +
    `The composition follows the rule of thirds with ${focalPointDesc} as the focal point. ` +
    `The lighting is ${nicheStyle.lighting}. ` +
    `The background features ${nicheStyle.background}. ` +
    `The ${platformLayout.headlinePosition} has a clean blank area with a subtle dark gradient overlay suitable for white text to be added. ` +
    `The ${platformLayout.ctaPosition} has an empty area suitable for a button to be added.` +
    `${creativeHint} ` +
    `CRITICAL: The image contains ABSOLUTELY NO TEXT, NO WORDS, NO LETTERS, NO NUMBERS — only pure visual design elements, graphics, and imagery. ` +
    `The design has intentional blank space where text overlays will be added in post-production. ` +
    `NO stock photo look. NO cheesy clip art. NO generic templates. NO watermarks. ` +
    `This looks like it was created by a top creative agency for a Fortune 500 brand. ` +
    `Ultra-high quality, photorealistic where appropriate, with professional color grading, cinematic depth of field, and perfect visual hierarchy. ` +
    `The overall composition should make someone stop scrolling instantly.`;

  try {
    const openai = getOpenAIClient();

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: platformLayout.size,
      quality: "hd",
      style: nicheStyle.dalleStyle,
      response_format: "url",
    });

    const url = response.data?.[0]?.url;
    return url ?? null;
  } catch (error) {
    const err = error as Error;
    console.error('=== DALL-E GENERATION FAILED ===');
    console.error('Error name:', err?.name);
    console.error('Error message:', err?.message);
    console.error('Full error:', JSON.stringify(error, null, 2));
    console.error('Stack trace:', err?.stack);
    return null;
  }
}
