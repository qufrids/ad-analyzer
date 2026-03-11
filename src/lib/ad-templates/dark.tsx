import React from "react";
import type { TemplateProps } from "./types";

export function darkTemplate({
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
  const ctaPadH = Math.round(width * 0.065);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#0a0a0a",
        padding: `${pad}px`,
        fontFamily: "Inter",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Radial glow */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: "25%",
          left: "-15%",
          width: `${Math.round(width * 0.9)}px`,
          height: `${Math.round(height * 0.55)}px`,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${colors.secondary}1a 0%, transparent 70%)`,
        }}
      />

      {/* Brand */}
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

      {/* Headline */}
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
            marginBottom: `${Math.round(height * 0.03)}px`,
          }}
        >
          {headline}
        </div>

        {/* Diamond divider */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "10px",
            marginBottom: `${Math.round(height * 0.035)}px`,
          }}
        >
          <div
            style={{
              display: "flex",
              width: `${Math.round(width * 0.04)}px`,
              height: "1px",
              background: colors.secondary,
            }}
          />
          <div
            style={{
              display: "flex",
              width: "7px",
              height: "7px",
              background: colors.secondary,
              transform: "rotate(45deg)",
            }}
          />
          <div
            style={{
              display: "flex",
              width: `${Math.round(width * 0.04)}px`,
              height: "1px",
              background: colors.secondary,
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            fontSize: bodySize,
            color: "#9ca3af",
            lineHeight: 1.55,
            fontWeight: 400,
          }}
        >
          {bodyCopy}
        </div>
      </div>

      {/* Ghost CTA */}
      <div style={{ display: "flex" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `2px solid ${colors.secondary}`,
            borderRadius: "8px",
            paddingTop: `${ctaPadV}px`,
            paddingBottom: `${ctaPadV}px`,
            paddingLeft: `${ctaPadH}px`,
            paddingRight: `${ctaPadH}px`,
            fontSize: ctaSize,
            fontWeight: 700,
            color: colors.secondary,
            letterSpacing: "0.04em",
          }}
        >
          {ctaText}
        </div>
      </div>
    </div>
  );
}
