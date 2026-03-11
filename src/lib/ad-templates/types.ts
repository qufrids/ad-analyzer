export interface TemplateColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface TemplateProps {
  headline: string;
  bodyCopy: string;
  ctaText: string;
  brandName: string;
  colors: TemplateColors;
  width: number;
  height: number;
}
