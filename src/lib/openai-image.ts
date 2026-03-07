import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateImprovedAdImage({
  improvedHeadline,
  improvedBodyCopy,
  improvedCTA,
  platform,
  niche,
  weaknesses,
  strengths,
}: {
  improvedHeadline: string;
  improvedBodyCopy: string;
  improvedCTA: string;
  platform: string;
  niche: string;
  weaknesses: string[];
  strengths: string[];
}): Promise<string | null> {
  try {
    const isVertical = ["tiktok", "stories", "reels", "story"].some((p) =>
      platform.toLowerCase().includes(p)
    );
    const size: "1024x1024" | "1024x1792" = isVertical ? "1024x1792" : "1024x1024";

    const weaknessesSummary = weaknesses.slice(0, 3).join(", ");
    const strengthsSummary = strengths.slice(0, 3).join(", ");

    const prompt =
      `Create a professional, high-converting ${platform} ad creative for the ${niche} niche. ` +
      `The ad should have:\n` +
      `- A clean, modern design with bold typography\n` +
      `- Headline text: ${improvedHeadline}\n` +
      `- A clear call-to-action button that says: ${improvedCTA}\n` +
      `- Professional color scheme appropriate for ${niche}\n` +
      `- The layout should follow ${platform} best practices\n` +
      `- High visual contrast for readability\n` +
      `- The design should fix these issues from the original ad: ${weaknessesSummary}\n` +
      `- Keep these strong elements: ${strengthsSummary}\n` +
      `Style: Professional advertising creative, clean modern design, not stock photo, designed graphic ad.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size,
      quality: "standard",
      response_format: "url",
    });

    const url = response.data && response.data[0] ? response.data[0].url : undefined;
    return url ?? null;
  } catch (error) {
    console.error("DALL-E image generation failed:", error);
    return null;
  }
}
