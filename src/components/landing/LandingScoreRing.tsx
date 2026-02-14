function scoreColor(score: number) {
  if (score >= 70) return { stroke: "#22c55e", text: "text-green-400" };
  if (score >= 40) return { stroke: "#f97316", text: "text-orange-400" };
  return { stroke: "#ef4444", text: "text-red-400" };
}

export default function LandingScoreRing({
  score,
  size = 80,
}: {
  score: number;
  size?: number;
}) {
  const center = size / 2;
  const radius = size * 0.4;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const colors = scoreColor(score);
  const strokeWidth = size * 0.07;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-white/[0.06]"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke={colors.stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 6px ${colors.stroke}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-xl font-bold ${colors.text}`}>{score}</span>
        <span className="text-[8px] text-gray-500 uppercase tracking-wider">/100</span>
      </div>
    </div>
  );
}
