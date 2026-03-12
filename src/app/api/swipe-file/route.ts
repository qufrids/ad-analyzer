import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const anthropic = new Anthropic();

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { templateName, framework, platform, productDescription } = await request.json();

  if (!templateName || !framework || !platform || !productDescription?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are an expert direct-response copywriter specializing in paid social and search ads.

Use the "${templateName}" framework (${framework}) to write a compelling, ready-to-use ad for the following:

Product/Offer: ${productDescription}
Platform: ${platform}

Requirements:
- Follow the ${framework} framework precisely, labeling each section clearly
- Write in a natural, conversational tone appropriate for ${platform}
- Be specific and concrete — no vague fluff
- Include a clear, punchy call-to-action
- Keep it concise and scannable
- Make it conversion-focused

Output the complete ad copy, formatted with clear section labels.`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }

  return NextResponse.json({ copy: content.text });
}
