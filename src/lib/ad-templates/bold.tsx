import React from "react";
import type { TemplateProps } from "./types";

export function boldTemplate({
  headline,
  bodyCopy,
  ctaText,
  brandName,
  colors,
  width,
  height,
}: TemplateProps): React.ReactElement {
  const pad = Math.round(width * 0.08);
  const headingSize = Math.round(width * 0.072);
  const bodySize = Math.round(width * 0.032);
  const brandSize = Math.round(width * 0.022);
  const ctaSize = Math.round(width * 0.030);
  const ctaPadV = Math.round(height * 0.022);
  const ctaPadH = Math.round(width * 0.065);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: `linear-gradient(145deg, ${colors.primary} 0%, ${colors.background} 100%)`,
        padding: `${pad}px`,
        fontFamily: "Inter",
      }}
    >
      {/* Brand */}
      {brandName ? (
        <div
          style={{
            display: "flex",
            fontSize: brandSize,
            color: colors.accent,
            fontWeight: 400,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: `${Math.round(height * 0.04)}px`,
          }}
        >
          {brandName}
        </div>
      ) : null}

      {/* Headline area */}
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            display: "flex",
            width: `${Math.round(width * 0.08)}px`,
            height: "4px",
            background: colors.secondary,
            marginBottom: `${Math.round(height * 0.03)}px`,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: headingSize,
            fontWeight: 700,
            color: colors.text,
            lineHeight: 1.1,
            marginBottom: `${Math.round(height * 0.04)}px`,
          }}
        >
          {headline}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: bodySize,
            color: colors.accent,
            lineHeight: 1.55,
            fontWeight: 400,
          }}
        >
          {bodyCopy}
        </div>
      </div>

      {/* CTA */}
      <div style={{ display: "flex" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: colors.secondary,
            borderRadius: "8px",
            paddingTop: `${ctaPadV}px`,
            paddingBottom: `${ctaPadV}px`,
            paddingLeft: `${ctaPadH}px`,
            paddingRight: `${ctaPadH}px`,
            fontSize: ctaSize,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "0.04em",
          }}
        >
          {ctaText}
        </div>
      </div>
    </div>
  );
}
