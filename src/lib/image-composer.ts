import sharp from "sharp";

interface ComposeParams {
  imageUrl: string;
  headline: string;
  ctaText: string;
  platform: string;
  niche: string;
}

/* ── Accent colors per niche ─────────────────────────────────────── */
function getAccentColor(niche: string): string {
  const n = niche.toLowerCase();
  if (n.includes("fashion") || n.includes("luxury")) return "#C9A96E";
  if (n.includes("beauty") || n.includes("skincare")) return "#D4608A";
  if (n.includes("tech") || n.includes("gadget") || n.includes("software") || n.includes("saas")) return "#0EA5E9";
  if (n.includes("fitness") || n.includes("sport") || n.includes("gym")) return "#F4511E";
  if (n.includes("food") || n.includes("restaurant")) return "#D97706";
  if (n.includes("home") || n.includes("garden") || n.includes("interior")) return "#65A663";
  if (n.includes("finance") || n.includes("business") || n.includes("invest")) return "#1E40AF";
  if (n.includes("travel") || n.includes("hotel")) return "#0891B2";
  if (n.includes("education") || n.includes("course") || n.includes("coaching")) return "#7C3AED";
  return "#5B5FFF";
}

/* ── Text wrapping ───────────────────────────────────────────────── */
function wrapText(text: string, charsPerLine: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (test.length <= charsPerLine) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3);
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/* ── Determine layout positions ─────────────────────────────────── */
function getLayout(
  platform: string,
  width: number,
  height: number
): {
  gradientStartY: number;
  gradientHeight: number;
  headlineBottomY: number;
  ctaCenterY: number;
  showTopSponsor: boolean;
} {
  const p = platform.toLowerCase();
  const isVertical = height > width;

  if (isVertical) {
    // TikTok / Stories: gradient at bottom ~40% of height
    return {
      gradientStartY: Math.round(height * 0.58),
      gradientHeight: Math.round(height * 0.42),
      headlineBottomY: Math.round(height * 0.82),
      ctaCenterY: Math.round(height * 0.91),
      showTopSponsor: false,
    };
  }

  if (p.includes("google") || p.includes("display") || p.includes("banner")) {
    // Landscape: gradient on left side
    return {
      gradientStartY: Math.round(height * 0.45),
      gradientHeight: Math.round(height * 0.55),
      headlineBottomY: Math.round(height * 0.68),
      ctaCenterY: Math.round(height * 0.83),
      showTopSponsor: false,
    };
  }

  // Square (Facebook / Instagram)
  return {
    gradientStartY: Math.round(height * 0.52),
    gradientHeight: Math.round(height * 0.48),
    headlineBottomY: Math.round(height * 0.74),
    ctaCenterY: Math.round(height * 0.87),
    showTopSponsor:
      p.includes("facebook") || p.includes("instagram"),
  };
}

/* ── Build gradient overlay SVG ─────────────────────────────────── */
function buildGradientSvg(
  width: number,
  height: number,
  gradientStartY: number,
  gradientHeight: number
): Buffer {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="black" stop-opacity="0"/>
      <stop offset="55%" stop-color="black" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="black" stop-opacity="0.82"/>
    </linearGradient>
  </defs>
  <rect x="0" y="${gradientStartY}" width="${width}" height="${gradientHeight}" fill="url(#vignette)"/>
</svg>`;
  return Buffer.from(svg);
}

/* ── Build headline SVG ─────────────────────────────────────────── */
function buildHeadlineSvg(
  width: number,
  height: number,
  headline: string,
  headlineBottomY: number
): Buffer {
  // Scale font size based on image width
  const fontSize = Math.round(width * 0.055);
  const lineHeight = Math.round(fontSize * 1.22);
  const charsPerLine = Math.floor((width * 0.84) / (fontSize * 0.52));
  const lines = wrapText(headline, charsPerLine);
  const padding = Math.round(width * 0.06);

  // Build lines from bottom up
  const textElements = [...lines].reverse().map((line, i) => {
    const y = headlineBottomY - i * lineHeight;
    return `<text
      x="${width / 2}"
      y="${y}"
      text-anchor="middle"
      fill="white"
      font-family="Arial Black, Arial, Helvetica, sans-serif"
      font-weight="900"
      font-size="${fontSize}"
      letter-spacing="-0.5"
      filter="url(#textShadow)"
    >${escapeXml(line)}</text>`;
  });

  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="textShadow" x="-8%" y="-8%" width="116%" height="116%">
      <feDropShadow dx="0" dy="2" stdDeviation="${Math.round(fontSize * 0.12)}" flood-color="rgba(0,0,0,0.9)"/>
    </filter>
  </defs>
  ${textElements.join("\n  ")}
</svg>`;

  void padding; // declared for future use
  return Buffer.from(svg);
}

/* ── Build CTA button SVG ───────────────────────────────────────── */
function buildCtaSvg(
  width: number,
  height: number,
  ctaText: string,
  ctaCenterY: number,
  accentColor: string
): Buffer {
  const fontSize = Math.round(width * 0.028);
  const buttonWidth = Math.min(Math.round(width * 0.42), 360);
  const buttonHeight = Math.round(buttonWidth * 0.175);
  const buttonX = Math.round((width - buttonWidth) / 2);
  const buttonY = Math.round(ctaCenterY - buttonHeight / 2);
  const radius = Math.round(buttonHeight / 2);

  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="btnGlow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="4" stdDeviation="${Math.round(buttonHeight * 0.18)}" flood-color="${accentColor}" flood-opacity="0.55"/>
    </filter>
  </defs>
  <!-- Button background -->
  <rect
    x="${buttonX}" y="${buttonY}"
    width="${buttonWidth}" height="${buttonHeight}"
    rx="${radius}" ry="${radius}"
    fill="${accentColor}"
    filter="url(#btnGlow)"
  />
  <!-- Subtle inner highlight (top half) -->
  <rect
    x="${buttonX}" y="${buttonY}"
    width="${buttonWidth}" height="${Math.round(buttonHeight / 2)}"
    rx="${radius}" ry="${radius}"
    fill="rgba(255,255,255,0.12)"
  />
  <!-- CTA text -->
  <text
    x="${Math.round(width / 2)}"
    y="${Math.round(ctaCenterY + fontSize * 0.38)}"
    text-anchor="middle"
    fill="white"
    font-family="Arial Black, Arial, Helvetica, sans-serif"
    font-weight="800"
    font-size="${fontSize}"
    letter-spacing="0.8"
  >${escapeXml(ctaText.toUpperCase())}</text>
</svg>`;
  return Buffer.from(svg);
}

/* ── Build Sponsored label SVG ──────────────────────────────────── */
function buildSponsoredSvg(width: number, height: number): Buffer {
  const pillW = Math.round(width * 0.115);
  const pillH = Math.round(width * 0.032);
  const pillX = Math.round(width * 0.038);
  const pillY = Math.round(height * 0.032);
  const fontSize = Math.round(pillH * 0.58);

  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect x="${pillX}" y="${pillY}" width="${pillW}" height="${pillH}"
    rx="${Math.round(pillH / 2)}" fill="rgba(0,0,0,0.52)"/>
  <text
    x="${pillX + Math.round(pillW / 2)}"
    y="${pillY + Math.round(pillH * 0.68)}"
    text-anchor="middle"
    fill="rgba(255,255,255,0.88)"
    font-family="Arial, Helvetica, sans-serif"
    font-size="${fontSize}"
    font-weight="600"
    letter-spacing="0.5"
  >Sponsored</text>
</svg>`;
  return Buffer.from(svg);
}

/* ── Main compose function ──────────────────────────────────────── */
export async function composeAdImage({
  imageUrl,
  headline,
  ctaText,
  platform,
  niche,
}: ComposeParams): Promise<Buffer> {
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`Failed to fetch DALL-E image: ${res.status}`);
  const imageBuffer = Buffer.from(await res.arrayBuffer());

  const metadata = await sharp(imageBuffer).metadata();
  const width = metadata.width ?? 1024;
  const height = metadata.height ?? 1024;

  const layout = getLayout(platform, width, height);
  const accentColor = getAccentColor(niche);

  const overlays: sharp.OverlayOptions[] = [
    // 1. Gradient vignette for text readability
    {
      input: buildGradientSvg(width, height, layout.gradientStartY, layout.gradientHeight),
      top: 0,
      left: 0,
      blend: "over",
    },
    // 2. Headline text
    {
      input: buildHeadlineSvg(width, height, headline, layout.headlineBottomY),
      top: 0,
      left: 0,
      blend: "over",
    },
    // 3. CTA button
    {
      input: buildCtaSvg(width, height, ctaText, layout.ctaCenterY, accentColor),
      top: 0,
      left: 0,
      blend: "over",
    },
  ];

  // 4. Sponsored label for social platforms
  if (layout.showTopSponsor) {
    overlays.push({
      input: buildSponsoredSvg(width, height),
      top: 0,
      left: 0,
      blend: "over",
    });
  }

  return sharp(imageBuffer).composite(overlays).png({ quality: 95 }).toBuffer();
}
