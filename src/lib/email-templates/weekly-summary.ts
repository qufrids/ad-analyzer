/**
 * Weekly Summary Email Template
 *
 * Usage (when email sending is wired up):
 *   const { subject, html, text } = buildWeeklySummaryEmail(data);
 *   await sendEmail({ to: user.email, subject, html });
 *
 * Suggested sender: Resend, SendGrid, or AWS SES.
 * Suggested trigger: Vercel Cron at "0 9 * * 1" (every Monday 9 AM UTC)
 */

export interface WeeklySummaryData {
  userName: string;
  userEmail: string;
  weekStart: string;  // e.g. "Jan 20"
  weekEnd: string;    // e.g. "Jan 26"
  analysesThisWeek: number;
  avgScoreThisWeek: number | null;
  avgScoreAllTime: number | null;
  improvementPct: number | null;    // % change vs prior week avg (null if not enough data)
  topRecommendation: string | null; // Best recommendation from highest-scoring ad this week
  bestScoreThisWeek: number | null;
  totalAnalysesAllTime: number;
  appUrl: string;                   // e.g. "https://adscore.ai"
}

/* ─── Text version ──────────────────────────────── */
export function buildWeeklySummaryText(data: WeeklySummaryData): string {
  const {
    userName,
    weekStart,
    weekEnd,
    analysesThisWeek,
    avgScoreThisWeek,
    avgScoreAllTime,
    improvementPct,
    topRecommendation,
    bestScoreThisWeek,
    totalAnalysesAllTime,
    appUrl,
  } = data;

  const trendLine =
    improvementPct !== null
      ? `${improvementPct >= 0 ? "+" : ""}${improvementPct}% vs last week`
      : "Keep analyzing to track your trend";

  return `
AdScore AI — Weekly Summary (${weekStart}–${weekEnd})

Hi ${userName},

Here's your weekly ad performance report:

📊 This Week
  Ads analyzed: ${analysesThisWeek}
  Average score: ${avgScoreThisWeek ?? "—"}
  Best score: ${bestScoreThisWeek ?? "—"}
  Trend: ${trendLine}

📈 All Time
  Total analyses: ${totalAnalysesAllTime}
  Average score: ${avgScoreAllTime ?? "—"}

${topRecommendation ? `💡 Top Recommendation\n  "${topRecommendation}"\n` : ""}

View your dashboard: ${appUrl}/dashboard
Analyze a new ad: ${appUrl}/analyze

—
AdScore AI · Unsubscribe: ${appUrl}/settings
`.trim();
}

/* ─── HTML version ──────────────────────────────── */
export function buildWeeklySummaryHtml(data: WeeklySummaryData): string {
  const {
    userName,
    weekStart,
    weekEnd,
    analysesThisWeek,
    avgScoreThisWeek,
    avgScoreAllTime,
    improvementPct,
    topRecommendation,
    bestScoreThisWeek,
    totalAnalysesAllTime,
    appUrl,
  } = data;

  const trendColor =
    improvementPct === null
      ? "#6B7280"
      : improvementPct >= 0
      ? "#22C55E"
      : "#EF4444";

  const trendLabel =
    improvementPct !== null
      ? `${improvementPct >= 0 ? "▲" : "▼"} ${Math.abs(improvementPct)}% vs last week`
      : "Not enough data yet";

  const scoreColor = (s: number | null) =>
    !s ? "#6B7280" : s >= 70 ? "#22C55E" : s >= 40 ? "#EAB308" : "#EF4444";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AdScore Weekly Summary</title>
</head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0F172A;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Logo / Header -->
        <tr>
          <td style="padding-bottom:28px;text-align:center;">
            <div style="display:inline-flex;align-items:center;gap:8px;">
              <div style="width:28px;height:28px;background:#22C55E;border-radius:7px;display:inline-flex;align-items:center;justify-content:center;">
                <span style="color:#fff;font-size:14px;font-weight:900;">⚡</span>
              </div>
              <span style="font-size:16px;font-weight:700;color:#0F172A;">AdScore AI</span>
            </div>
            <p style="margin:8px 0 0;font-size:12px;color:#64748B;font-weight:500;">
              Weekly Summary · ${weekStart}–${weekEnd}
            </p>
          </td>
        </tr>

        <!-- Card -->
        <tr>
          <td style="background:#FFFFFF;border:1px solid rgba(15,23,42,0.06);border-radius:16px;overflow:hidden;">

            <!-- Hero -->
            <div style="padding:32px 36px 24px;border-bottom:1px solid rgba(15,23,42,0.06);">
              <p style="margin:0 0 4px;font-size:13px;color:#64748B;">Hi ${userName} 👋</p>
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#0F172A;letter-spacing:-0.02em;">
                Your weekly ad report is here
              </h1>
              <p style="margin:0;font-size:14px;color:#64748B;line-height:1.6;">
                Here's how your ad performance tracked this week.
              </p>
            </div>

            <!-- Stats grid -->
            <div style="padding:24px 36px;border-bottom:1px solid rgba(15,23,42,0.06);">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <!-- Analyses -->
                  <td width="25%" style="text-align:center;padding:0 8px 0 0;">
                    <div style="background:#F8FAFC;border:1px solid rgba(15,23,42,0.06);border-radius:12px;padding:16px 12px;">
                      <p style="margin:0 0 4px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#94A3B8;">Ads Analyzed</p>
                      <p style="margin:0;font-size:28px;font-weight:900;color:#0F172A;line-height:1;">${analysesThisWeek}</p>
                      <p style="margin:4px 0 0;font-size:10px;color:#94A3B8;">this week</p>
                    </div>
                  </td>
                  <!-- Avg Score -->
                  <td width="25%" style="text-align:center;padding:0 8px;">
                    <div style="background:#F8FAFC;border:1px solid rgba(15,23,42,0.06);border-radius:12px;padding:16px 12px;">
                      <p style="margin:0 0 4px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#94A3B8;">Avg Score</p>
                      <p style="margin:0;font-size:28px;font-weight:900;color:${scoreColor(avgScoreThisWeek)};line-height:1;">${avgScoreThisWeek ?? "—"}</p>
                      <p style="margin:4px 0 0;font-size:10px;color:#94A3B8;">this week</p>
                    </div>
                  </td>
                  <!-- Best Score -->
                  <td width="25%" style="text-align:center;padding:0 8px;">
                    <div style="background:#F8FAFC;border:1px solid rgba(15,23,42,0.06);border-radius:12px;padding:16px 12px;">
                      <p style="margin:0 0 4px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#94A3B8;">Best Score</p>
                      <p style="margin:0;font-size:28px;font-weight:900;color:${scoreColor(bestScoreThisWeek)};line-height:1;">${bestScoreThisWeek ?? "—"}</p>
                      <p style="margin:4px 0 0;font-size:10px;color:#94A3B8;">this week</p>
                    </div>
                  </td>
                  <!-- Trend -->
                  <td width="25%" style="text-align:center;padding:0 0 0 8px;">
                    <div style="background:#F8FAFC;border:1px solid rgba(15,23,42,0.06);border-radius:12px;padding:16px 12px;">
                      <p style="margin:0 0 4px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#94A3B8;">Trend</p>
                      <p style="margin:0;font-size:16px;font-weight:800;color:${trendColor};line-height:1.2;">${trendLabel}</p>
                    </div>
                  </td>
                </tr>
              </table>
            </div>

            ${topRecommendation ? `
            <!-- Top Recommendation -->
            <div style="padding:24px 36px;border-bottom:1px solid rgba(15,23,42,0.06);">
              <p style="margin:0 0 10px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#94A3B8;">💡 Top Recommendation This Week</p>
              <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;padding:14px 16px;">
                <p style="margin:0;font-size:14px;color:#166534;line-height:1.6;">"${topRecommendation}"</p>
              </div>
            </div>
            ` : ""}

            <!-- All-time stats -->
            <div style="padding:20px 36px;background:#F8FAFC;border-top:1px solid rgba(15,23,42,0.06);">
              <p style="margin:0;font-size:12px;color:#94A3B8;">
                All time: <strong style="color:#64748B;">${totalAnalysesAllTime} analyses</strong> ·
                Average score: <strong style="color:#64748B;">${avgScoreAllTime ?? "—"}</strong>
              </p>
            </div>

            <!-- CTA -->
            <div style="padding:28px 36px;text-align:center;">
              <a href="${appUrl}/analyze" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#3B82F6,#8B5CF6);color:#FFFFFF;font-size:14px;font-weight:700;border-radius:10px;text-decoration:none;letter-spacing:-0.01em;">
                Analyze a New Ad →
              </a>
              <p style="margin:14px 0 0;font-size:12px;color:#94A3B8;">
                <a href="${appUrl}/dashboard" style="color:#64748B;text-decoration:none;">View your dashboard</a>
              </p>
            </div>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding-top:24px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#CBD5E1;">
              AdScore AI · You're receiving this because you have a weekly summary enabled.
              <br/>
              <a href="${appUrl}/settings" style="color:#94A3B8;text-decoration:none;">Unsubscribe</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;
}

/* ─── Combined export ────────────────────────────── */
export function buildWeeklySummaryEmail(data: WeeklySummaryData): {
  subject: string;
  html: string;
  text: string;
} {
  const weekRange = `${data.weekStart}–${data.weekEnd}`;
  const trendSuffix =
    data.improvementPct !== null
      ? ` (${data.improvementPct >= 0 ? "+" : ""}${data.improvementPct}% trend)`
      : "";

  return {
    subject: `Your AdScore Weekly Report · ${weekRange}${trendSuffix}`,
    html: buildWeeklySummaryHtml(data),
    text: buildWeeklySummaryText(data),
  };
}
