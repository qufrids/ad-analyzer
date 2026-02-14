"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";

interface AnalysisData {
  platform: string;
  niche: string;
  overall_score: number;
  created_at: string;
  result: {
    overall_score: number;
    summary: string;
    scores: Record<string, { score: number; feedback: string }>;
    strengths: string[];
    weaknesses: string[];
    recommendations: { priority: string; action: string }[];
    competitor_insight: string;
    predicted_ctr_range: string;
  };
}

const SCORE_LABELS: Record<string, string> = {
  visual_impact: "Visual Impact",
  copy_effectiveness: "Copy Effectiveness",
  hook_strength: "Hook Strength",
  brand_consistency: "Brand Consistency",
  cta_clarity: "CTA Clarity",
  platform_fit: "Platform Fit",
};

export default function DownloadPDF({ data }: { data: AnalysisData }) {
  const [loading, setLoading] = useState(false);

  const generate = () => {
    setLoading(true);
    try {
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const w = doc.internal.pageSize.getWidth();
      const margin = 16;
      const contentW = w - margin * 2;
      let y = 20;

      const checkPage = (need: number) => {
        if (y + need > 275) {
          doc.addPage();
          y = 20;
        }
      };

      // Header
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 30, 30);
      doc.text("AdScore AI — Analysis Report", margin, y);
      y += 10;

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(120, 120, 120);
      const date = new Date(data.created_at).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      doc.text(
        `${data.platform.toUpperCase()} · ${data.niche.charAt(0).toUpperCase() + data.niche.slice(1)} · ${date}`,
        margin,
        y
      );
      y += 4;

      // Divider
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, y, w - margin, y);
      y += 10;

      // Overall Score
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 30, 30);
      doc.text("Overall Score", margin, y);
      const scoreStr = `${data.overall_score} / 100`;
      doc.setFontSize(14);
      if (data.overall_score >= 80) doc.setTextColor(34, 197, 94);
      else if (data.overall_score >= 60) doc.setTextColor(234, 179, 8);
      else doc.setTextColor(239, 68, 68);
      doc.text(scoreStr, w - margin, y, { align: "right" });
      y += 8;

      // Summary
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      const summaryLines = doc.splitTextToSize(data.result.summary, contentW);
      doc.text(summaryLines, margin, y);
      y += summaryLines.length * 5 + 8;

      // Score Breakdown
      checkPage(50);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 30, 30);
      doc.text("Score Breakdown", margin, y);
      y += 8;

      Object.entries(SCORE_LABELS).forEach(([key, label]) => {
        const s = data.result.scores?.[key];
        if (!s) return;
        checkPage(18);

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(50, 50, 50);
        doc.text(label, margin, y);
        doc.text(`${s.score}/100`, w - margin, y, { align: "right" });
        y += 4;

        // Bar background
        doc.setFillColor(230, 230, 230);
        doc.roundedRect(margin, y, contentW, 3, 1.5, 1.5, "F");
        // Bar fill
        const barW = (s.score / 100) * contentW;
        if (s.score >= 80) doc.setFillColor(34, 197, 94);
        else if (s.score >= 60) doc.setFillColor(234, 179, 8);
        else doc.setFillColor(239, 68, 68);
        doc.roundedRect(margin, y, barW, 3, 1.5, 1.5, "F");
        y += 5;

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        const fbLines = doc.splitTextToSize(s.feedback, contentW);
        doc.text(fbLines, margin, y);
        y += fbLines.length * 4 + 5;
      });

      // Strengths
      checkPage(30);
      y += 4;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(34, 197, 94);
      doc.text("Strengths", margin, y);
      y += 7;

      data.result.strengths?.forEach((s) => {
        checkPage(12);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 60);
        const lines = doc.splitTextToSize(`✓  ${s}`, contentW - 4);
        doc.text(lines, margin + 2, y);
        y += lines.length * 5 + 2;
      });

      // Weaknesses
      checkPage(30);
      y += 4;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(239, 68, 68);
      doc.text("Weaknesses", margin, y);
      y += 7;

      data.result.weaknesses?.forEach((w2) => {
        checkPage(12);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 60);
        const lines = doc.splitTextToSize(`✗  ${w2}`, contentW - 4);
        doc.text(lines, margin + 2, y);
        y += lines.length * 5 + 2;
      });

      // Recommendations
      checkPage(30);
      y += 4;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 30, 30);
      doc.text("Recommendations", margin, y);
      y += 8;

      const sorted = [...(data.result.recommendations || [])].sort((a, b) => {
        const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
        return (order[a.priority] ?? 3) - (order[b.priority] ?? 3);
      });

      sorted.forEach((rec) => {
        checkPage(14);
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        if (rec.priority === "high") doc.setTextColor(239, 68, 68);
        else if (rec.priority === "medium") doc.setTextColor(234, 179, 8);
        else doc.setTextColor(59, 130, 246);
        doc.text(rec.priority.toUpperCase(), margin + 2, y);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 60);
        const lines = doc.splitTextToSize(rec.action, contentW - 24);
        doc.text(lines, margin + 22, y);
        y += lines.length * 5 + 4;
      });

      // Bonus Insights
      checkPage(30);
      y += 4;
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, y, w - margin, y);
      y += 8;

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(59, 130, 246);
      doc.text("Competitor Insight", margin, y);
      y += 6;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      const ciLines = doc.splitTextToSize(data.result.competitor_insight || "", contentW);
      doc.text(ciLines, margin, y);
      y += ciLines.length * 5 + 8;

      checkPage(20);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(147, 51, 234);
      doc.text("Predicted CTR", margin, y);
      y += 6;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      doc.text(data.result.predicted_ctr_range || "N/A", margin, y);
      y += 12;

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(180, 180, 180);
      doc.text("Generated by AdScore AI — adscore.ai", margin, 290);

      doc.save(`adscore-analysis-${data.overall_score}.pdf`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={generate}
      disabled={loading}
      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-800 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-600 font-medium rounded-lg transition text-sm disabled:opacity-50"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      {loading ? "Generating..." : "Download PDF"}
    </button>
  );
}
