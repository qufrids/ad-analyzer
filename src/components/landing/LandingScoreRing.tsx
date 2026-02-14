function scoreColor(score: number) {
  if (score > 70) return { ring: "stroke-green-400", text: "text-green-400" };
  if (score >= 40) return { ring: "stroke-orange-400", text: "text-orange-400" };
  return { ring: "stroke-red-400", text: "text-red-400" };
}

export default function LandingScoreRing({
  score,
  size = 80,
}: {
  score: number;
  size?: number;
}) {
  const center = size / 2;
  const radius = size * 0.41;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const colors = scoreColor(score);
  const strokeWidth = size * 0.06;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-800"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={colors.ring}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-lg font-bold ${colors.text}`}>
          {score}
        </span>
        <span className="text-[9px] text-gray-500 uppercase tracking-wider">
          / 100
        </span>
      </div>
    </div>
  );
}
