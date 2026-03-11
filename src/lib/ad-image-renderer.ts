import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import type { TemplateColors } from "./ad-templates/types";
import { boldTemplate } from "./ad-templates/bold";
import { minimalTemplate } from "./ad-templates/minimal";
import { gradientTemplate } from "./ad-templates/gradient";
import { darkTemplate } from "./ad-templates/dark";
import { splitTemplate } from "./ad-templates/split";

/* ── Font cache (warm-lambda reuse) ─────────────────────────────── */
let fontBoldCache: ArrayBuffer | null = null;
let fontRegularCache: ArrayBuffer | null = null;

async function getFonts(): Promise<{ bold: ArrayBuffer; regular: ArrayBuffer }> {
  if (!fontBoldCache) {
    const res = await fetch(
      "https://fonts.bunny.net/inter/files/inter-latin-700-normal.woff"
    );
    if (!res.ok) throw new Error(`Font fetch failed: ${res.status}`);
    fontBoldCache = await res.arrayBuffer();
  }
  if (!fontRegularCache) {
    const res = await fetch(
      "https://fonts.bunny.net/inter/files/inter-latin-400-normal.woff"
    );
    if (!res.ok) throw new Error(`Font fetch failed: ${res.status}`);
    fontRegularCache = await res.arrayBuffer();
  }
  return { bold: fontBoldCache, regular: fontRegularCache };
}

/* ── Color schemes ──────────────────────────────────────────────── */
const COLOR_SCHEMES: Record<string, TemplateColors> = {
  fashion:  { primary: "#1a1a2e", secondary: "#e94560", accent: "#f5f5f5", background: "#0f0f1a", text: "#ffffff" },
  beauty:   { primary: "#2d1b69", secondary: "#e8a0bf", accent: "#f0d9e5", background: "#1a0e3a", text: "#ffffff" },
  tech:     { primary: "#0a192f", secondary: "#64ffda", accent: "#8892b0", background: "#020c1b", text: "#e6f1ff" },
  fitness:  { primary: "#1b1b1b", secondary: "#ff6b35", accent: "#f7c948", background: "#0d0d0d", text: "#ffffff" },
  food:     { primary: "#2c1810", secondary: "#e85d26", accent: "#f4a460", background: "#1a0f0a", text: "#fff8f0" },
  home:     { primary: "#2c3e50", secondary: "#27ae60", accent: "#f1c40f", background: "#1a252f", text: "#ecf0f1" },
  finance:  { primary: "#0a2647", secondary: "#2e8b57", accent: "#d4af37", background: "#061a33", text: "#f0f0f0" },
  default:  { primary: "#111827", secondary: "#6366f1", accent: "#a5b4fc", background: "#030712", text: "#f9fafb" },
};

/* ── Niche detection ────────────────────────────────────────────── */
function detectNicheKey(niche: string): string {
  const n = niche.toLowerCase();
  if (n.includes("fashion") || n.includes("luxury") || n.includes("apparel") || n.includes("cloth")) return "fashion";
  if (n.includes("beauty") || n.includes("skincare") || n.includes("cosmetic") || n.includes("makeup")) return "beauty";
  if (n.includes("tech") || n.includes("gadget") || n.includes("software") || n.includes("app") || n.includes("saas")) return "tech";
  if (n.includes("fitness") || n.includes("sport") || n.includes("gym") || n.includes("health") || n.includes("workout")) return "fitness";
  if (n.includes("food") || n.includes("restaurant") || n.includes("beverage") || n.includes("drink")) return "food";
  if (n.includes("home") || n.includes("garden") || n.includes("interior") || n.includes("furniture") || n.includes("decor")) return "home";
  if (n.includes("finance") || n.includes("business") || n.includes("invest") || n.includes("insurance") || n.includes("legal") || n.includes("company") || n.includes("corporate") || n.includes("account")) return "finance";
  return "default";
}

/* ── Templates ──────────────────────────────────────────────────── */
export type TemplateName = "bold" | "minimal" | "gradient" | "dark" | "split";

export const TEMPLATE_LABELS: Record<TemplateName, string> = {
  bold:     "Bold & Direct",
  minimal:  "Clean & Minimal",
  gradient: "Eye-Catching",
  dark:     "Premium Dark",
  split:    "Split Layout",
};

const NICHE_TEMPLATES: Record<string, TemplateName[]> = {
  fashion:  ["dark", "minimal", "gradient"],
  beauty:   ["dark", "minimal", "gradient"],
  tech:     ["dark", "bold", "split"],
  fitness:  ["bold", "gradient", "split"],
  food:     ["gradient", "bold", "minimal"],
  home:     ["minimal", "split", "gradient"],
  finance:  ["dark", "minimal", "bold"],
  default:  ["bold", "dark", "gradient"],
};

export function getTemplatesForNiche(niche: string): TemplateName[] {
  const key = detectNicheKey(niche);
  return NICHE_TEMPLATES[key] ?? NICHE_TEMPLATES.default;
}

const TEMPLATE_FNS = {
  bold:     boldTemplate,
  minimal:  minimalTemplate,
  gradient: gradientTemplate,
  dark:     darkTemplate,
  split:    splitTemplate,
} as const;

/* ── Platform dimensions ────────────────────────────────────────── */
function getDimensions(platform: string): { width: number; height: number } {
  const p = platform.toLowerCase();
  if (p.includes("tiktok") || p.includes("story") || p.includes("stories") || p.includes("reel")) {
    return { width: 1080, height: 1920 };
  }
  if (p.includes("google") || p.includes("display") || p.includes("banner")) {
    return { width: 1200, height: 628 };
  }
  return { width: 1080, height: 1080 };
}

/* ── Main export ────────────────────────────────────────────────── */
export interface RenderAdImageParams {
  headline: string;
  bodyCopy: string;
  ctaText: string;
  brandName: string;
  platform: string;
  niche: string;
  template: TemplateName;
}

export async function renderAdImage({
  headline,
  bodyCopy,
  ctaText,
  brandName,
  platform,
  niche,
  template,
}: RenderAdImageParams): Promise<Buffer> {
  const fonts = await getFonts();
  const { width, height } = getDimensions(platform);
  const nicheKey = detectNicheKey(niche);
  const colors = COLOR_SCHEMES[nicheKey] ?? COLOR_SCHEMES.default;

  const element = TEMPLATE_FNS[template]({
    headline,
    bodyCopy,
    ctaText,
    brandName,
    colors,
    width,
    height,
  });

  const svg = await satori(element, {
    width,
    height,
    fonts: [
      { name: "Inter", data: fonts.bold,    weight: 700, style: "normal" },
      { name: "Inter", data: fonts.regular, weight: 400, style: "normal" },
    ],
  });

  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: width } });
  const pngData = resvg.render();
  return Buffer.from(pngData.asPng());
}
