import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #030712 0%, #1e1b4b 50%, #030712 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Gradient accent bar at top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
          }}
        />

        {/* Logo / Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              fontWeight: 700,
              color: "white",
            }}
          >
            A
          </div>
          <div
            style={{
              fontSize: "48px",
              fontWeight: 700,
              color: "white",
              display: "flex",
            }}
          >
            AdScore AI
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "28px",
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.4,
            display: "flex",
          }}
        >
          AI-Powered Ad Creative Analysis
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "20px",
            color: "#64748b",
            textAlign: "center",
            maxWidth: "700px",
            marginTop: "16px",
            lineHeight: 1.5,
            display: "flex",
          }}
        >
          Upload your ad. Get instant scores, feedback & recommendations.
        </div>

        {/* Score preview badges */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            marginTop: "40px",
          }}
        >
          {[
            { label: "Visual Impact", score: 85, color: "#22c55e" },
            { label: "Copy Quality", score: 72, color: "#eab308" },
            { label: "Overall Score", score: 78, color: "#eab308" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "12px",
                padding: "16px 24px",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div
                style={{
                  fontSize: "36px",
                  fontWeight: 700,
                  color: item.color,
                  display: "flex",
                }}
              >
                {item.score}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#94a3b8",
                  display: "flex",
                }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
