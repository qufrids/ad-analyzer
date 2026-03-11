import React from "react";
import type { TemplateProps } from "./types";

export function minimalTemplate({
  headline,
  bodyCopy,
  ctaText,
  brandName,
  colors,
  width,
  height,
}: TemplateProps): React.ReactElement {
  const pad = Math.round(width * 0.1);
  const headingSize = Math.round(width * 0.065);
  const bodySize = Math.round(width * 0.030);
  const brandSize = Math.round(width * 0.018);
  const ctaSize = Math.round(width * 0.028);

  const bgLight = "#f8f9fa";
  const textDark = "#111111";
  const mutedGray = "#6b7280";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: bgLight,
        padding: `${pad}px`,
        fontFamily: "Inter",
      }}
    >
      {/* Brand */}
      <div
        style={{
          display: "flex",
          fontSize: brandSize,
          color: mutedGray,
          fontWeight: 400,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          marginBottom: `${Math.round(height * 0.08)}px`,
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
            color: textDark,
            lineHeight: 1.15,
            marginBottom: `${Math.round(height * 0.045)}px`,
          }}
        >
          {headline}
        </div>

        {/* Thin accent line */}
        <div
          style={{
            display: "flex",
            width: `${Math.round(width * 0.12)}px`,
            height: "2px",
            background: colors.secondary,
            marginBottom: `${Math.round(height * 0.04)}px`,
          }}
        />

        <div
          style={{
            display: "flex",
            fontSize: bodySize,
            color: mutedGray,
            lineHeight: 1.6,
            fontWeight: 400,
          }}
        >
          {bodyCopy}
        </div>
      </div>

      {/* CTA — underline link style */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: `${Math.round(width * 0.015)}px`,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: ctaSize,
            color: colors.secondary,
            fontWeight: 700,
            letterSpacing: "0.02em",
          }}
        >
          {ctaText}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: ctaSize,
            color: colors.secondary,
            fontWeight: 700,
          }}
        >
          →
        </div>
      </div>
    </div>
  );
}
