"use client";

import { useEffect, useState } from "react";

function scoreColor(score: number) {
  if (score > 70) return { ring: "stroke-green-400", text: "text-green-400", glow: "shadow-green-400/20" };
  if (score >= 40) return { ring: "stroke-orange-400", text: "text-orange-400", glow: "shadow-orange-400/20" };
  return { ring: "stroke-red-400", text: "text-red-400", glow: "shadow-red-400/20" };
}

export default function ScoreRing({ score }: { score: number }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [mounted, setMounted] = useState(false);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  const colors = scoreColor(score);

  useEffect(() => {
    setMounted(true);
    let frame: number;
    const duration = 1200;
    const start = performance.now();

    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));
      if (progress < 1) frame = requestAnimationFrame(animate);
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return (
    <div className={`relative inline-flex items-center justify-center ${mounted ? "animate-fade-in" : "opacity-0"}`}>
      <svg width="170" height="170" className="-rotate-90">
        {/* Background circle */}
        <circle
          cx="85"
          cy="85"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          className="text-gray-200 dark:text-gray-800"
        />
        {/* Score arc */}
        <circle
          cx="85"
          cy="85"
          r={radius}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          className={`${colors.ring} transition-all duration-1000`}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-bold ${colors.text}`}>
          {animatedScore}
        </span>
        <span className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">
          out of 100
        </span>
      </div>
    </div>
  );
}
