"use client";

import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";

export interface ChartPoint {
  date: string;       // formatted label
  fullDate: string;   // ISO for tooltip
  score: number;
  platform: string;
  niche: string;
  id: string;
}

/* ── Custom Tooltip ── */
function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: ChartPoint }[];
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const scoreColor =
    d.score >= 70 ? "#22C55E" : d.score >= 40 ? "#EAB308" : "#EF4444";

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg px-4 py-3 text-sm min-w-[160px]">
      <p className="text-gray-500 dark:text-gray-400 text-xs mb-2">{d.fullDate}</p>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-2xl font-black" style={{ color: scoreColor }}>
          {d.score}
        </span>
        <span className="text-gray-400 dark:text-gray-500 text-xs">/100</span>
      </div>
      <p className="text-gray-600 dark:text-gray-300 font-medium capitalize text-xs">
        {d.platform} · {d.niche}
      </p>
    </div>
  );
}

/* ── Custom Dot ── */
function CustomDot(props: {
  cx?: number;
  cy?: number;
  payload?: ChartPoint;
}) {
  const { cx, cy, payload } = props;
  if (!cx || !cy || !payload) return null;
  const color =
    payload.score >= 70 ? "#22C55E" : payload.score >= 40 ? "#EAB308" : "#EF4444";
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill={color} stroke="#fff" strokeWidth={2} className="dark:[stroke:#18181b]" />
    </g>
  );
}

interface Props {
  data: ChartPoint[];
  height?: number;
}

export default function ScoreChart({ data, height = 220 }: Props) {
  if (data.length < 2) {
    return (
      <div
        className="flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl"
        style={{ height }}
      >
        <svg className="w-8 h-8 text-gray-300 dark:text-gray-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Analyze at least 2 ads to start tracking your progress
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
          Your score trend will appear here
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="4 4"
          stroke="currentColor"
          className="text-gray-100 dark:text-gray-800"
          vertical={false}
        />

        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "currentColor" }}
          className="text-gray-400 dark:text-gray-600"
          axisLine={false}
          tickLine={false}
          dy={8}
        />

        <YAxis
          domain={[0, 100]}
          ticks={[0, 25, 50, 75, 100]}
          tick={{ fontSize: 11, fill: "currentColor" }}
          className="text-gray-400 dark:text-gray-600"
          axisLine={false}
          tickLine={false}
        />

        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#06B6D4", strokeWidth: 1, strokeDasharray: "4 4" }} />

        {/* Score threshold lines */}
        <ReferenceLine y={70} stroke="#22C55E" strokeWidth={1} strokeDasharray="4 2" strokeOpacity={0.3} />
        <ReferenceLine y={40} stroke="#EF4444" strokeWidth={1} strokeDasharray="4 2" strokeOpacity={0.3} />

        <Area
          type="monotone"
          dataKey="score"
          stroke="url(#lineGradient)"
          strokeWidth={2.5}
          fill="url(#cyanGradient)"
          dot={<CustomDot />}
          activeDot={{ r: 7, fill: "#06B6D4", stroke: "#fff", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
