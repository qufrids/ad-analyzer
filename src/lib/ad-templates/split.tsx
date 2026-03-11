import React from "react";
import type { TemplateProps } from "./types";

export function splitTemplate({
  headline,
  bodyCopy,
  ctaText,
  brandName,
  colors,
  width,
  height,
}: TemplateProps): React.ReactElement {
  const pad = Math.round(width * 0.07);
  const headingSize = Math.round(width * 0.062);
  const bodySize = Math.round(width * 0.028);
  const brandSize = Math.round(width * 0.019);
  const ctaSize = Math.round(width * 0.026);
  const ctaPadV = Math.round(height * 0.022);
  const ctaPadH = Math.round(width * 0.055);
  const leftFraction = 0.45;
  const leftW = Math.round(width * leftFraction);
  const rightW = width - leftW;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "100%",
        fontFamily: "Inter",
        overflow: "hidden",
      }}
    >
      {/* Left — colored, headline */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: `${leftW}px`,
          flexShrink: 0,
          height: "100%",
          background: colors.secondary,
          padding: `${pad}px`,
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: headingSize,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.1,
          }}
        >
          {headline}
        </div>
      </div>

      {/* Right — dark, body + CTA */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: `${rightW}px`,
          flexShrink: 0,
          height: "100%",
          background: `linear-gradient(160deg, ${colors.primary} 0%, ${colors.background} 100%)`,
          padding: `${pad}px`,
        }}
      >
        {/* Brand */}
        <div
          style={{
            display: "flex",
            fontSize: brandSize,
            color: colors.accent,
            fontWeight: 400,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: `${Math.round(height * 0.04)}px`,
          }}
        >
          {brandName || "SPONSORED"}
        </div>

        {/* Body */}
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: bodySize,
              color: colors.text,
              lineHeight: 1.6,
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
              background: colors.accent,
              borderRadius: "8px",
              paddingTop: `${ctaPadV}px`,
              paddingBottom: `${ctaPadV}px`,
              paddingLeft: `${ctaPadH}px`,
              paddingRight: `${ctaPadH}px`,
              fontSize: ctaSize,
              fontWeight: 700,
              color: colors.primary,
            }}
          >
            {ctaText}
          </div>
        </div>
      </div>
    </div>
  );
}
