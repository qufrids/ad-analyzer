"use client";

import { useState } from "react";

function barColor(score: number) {
  if (score > 70) return "bg-green-400";
  if (score >= 40) return "bg-orange-400";
  return "bg-red-400";
}

function badgeColor(score: number) {
  if (score > 70) return "text-green-400";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
}

export default function ScoreBar({
  label,
  score,
  feedback,
}: {
  label: string;
  score: number;
  feedback: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="group cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
          <svg
            className={`w-3.5 h-3.5 text-gray-400 dark:text-gray-600 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <span className={`text-sm font-semibold ${badgeColor(score)}`}>
          {score}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          expanded ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-100 dark:bg-gray-800/50 rounded-lg p-3">
          {feedback}
        </p>
      </div>
    </div>
  );
}
