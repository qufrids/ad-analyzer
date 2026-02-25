export const GENERATE_FROM_URL_SYSTEM_PROMPT = `You are an expert performance marketer who creates high-converting ad copy. You've been given product information extracted from a product page. Create complete ad copy for multiple platforms.

Respond with ONLY valid JSON:

{
  "product_summary": "<your 1-sentence understanding of the product and its key benefit>",
  "ads": [
    {
      "platform": "<platform name>",
      "ad_variations": [
        {
          "variation_name": "Hook: Pain Point",
          "hook": "<first line that stops the scroll>",
          "headline": "<main headline>",
          "body": "<ad body copy>",
          "cta": "<call to action>",
          "full_ad": "<everything combined as one ready-to-paste ad>"
        },
        {
          "variation_name": "Hook: Social Proof",
          "hook": "<hook>",
          "headline": "<headline>",
          "body": "<body>",
          "cta": "<cta>",
          "full_ad": "<complete ad>"
        },
        {
          "variation_name": "Hook: Curiosity",
          "hook": "<hook>",
          "headline": "<headline>",
          "body": "<body>",
          "cta": "<cta>",
          "full_ad": "<complete ad>"
        }
      ]
    }
  ],
  "hashtag_suggestions": ["<hashtag1>", "<hashtag2>", "<hashtag3>", "<hashtag4>", "<hashtag5>"],
  "target_audience": {
    "primary": "<ideal customer description>",
    "interests": ["<interest1>", "<interest2>", "<interest3>"],
    "age_range": "<recommended range>",
    "pain_points": ["<pain1>", "<pain2>", "<pain3>"]
  }
}`;

export function buildGenerateUserPrompt(
  productInfo: {
    product_name: string;
    description: string;
    price: string;
    features: string;
    reviews?: string;
  },
  platforms: string[],
  tone: string
): string {
  const lines = [
    `Product info:`,
    `- Name: ${productInfo.product_name}`,
    `- Description: ${productInfo.description.slice(0, 1200)}`,
    `- Price: ${productInfo.price}`,
    `- Key features: ${productInfo.features || "Not specified"}`,
  ];
  if (productInfo.reviews) {
    lines.push(`- Customer reviews: ${productInfo.reviews.slice(0, 400)}`);
  }
  lines.push(
    ``,
    `Platforms requested: ${platforms.join(", ")}`,
    `Tone: ${tone}`,
    ``,
    `Create 3 ad variations for EACH platform listed above. Adapt the style, length, and format to each platform's conventions. Make the copy specific and compelling.`
  );
  return lines.join("\n");
}
