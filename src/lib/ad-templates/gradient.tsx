import React from "react";
import type { TemplateProps } from "./types";

export function gradientTemplate({
  headline,
  bodyCopy,
  ctaText,
  brandName,
  colors,
  width,
  height,
}: TemplateProps): React.ReactElement {
  const pad = Math.round(width * 0.08);
  const headingSize = Math.round(width * 0.068);
  const bodySize = Math.round(width * 0.030);
  const brandSize = Math.round(width * 0.020);
  const ctaSize = Math.round(width * 0.028);
  const ctaPadV = Math.round(height * 0.022);
  const ctaPadH = Math.round(width * 0.07);
  const circleSize = Math.round(width * 0.65);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.background} 50%, ${colors.primary} 100%)`,
        padding: `${pad}px`,
        fontFamily: "Inter",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative circle top-right */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: `${-Math.round(circleSize * 0.35)}px`,
          right: `${-Math.round(circleSize * 0.35)}px`,
          width: `${circleSize}px`,
          height: `${circleSize}px`,
          borderRadius: "50%",
          background: colors.secondary,
          opacity: 0.15,
        }}
      />
      {/* Smaller circle bottom-left */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          bottom: `${-Math.round(circleSize * 0.2)}px`,
          left: `${-Math.round(circleSize * 0.2)}px`,
          width: `${Math.round(circleSize * 0.55)}px`,
          height: `${Math.round(circleSize * 0.55)}px`,
          borderRadius: "50%",
          background: colors.secondary,
          opacity: 0.09,
        }}
      />

      {/* Label */}
      <div
        style={{
          display: "flex",
          fontSize: brandSize,
          color: colors.secondary,
          fontWeight: 400,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          marginBottom: `${Math.round(height * 0.05)}px`,
        }}
      >
        {brandName || "SPONSORED"}
      </div>

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
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
            background: "#ffffff",
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
  );
}
