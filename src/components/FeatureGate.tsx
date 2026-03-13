"use client";

import { useState } from "react";
import { TIER_DISPLAY, TIER_ORDER } from "@/lib/stripe-config";
import { TIER_LIMITS } from "@/lib/tier-limits";

interface FeatureGateProps {
  children: React.ReactNode;
  userTier: string;
  requiredTier: "starter" | "pro" | "agency";
  featureName: string;
  // Optional: current usage to show "you've used X/Y"
  usedCount?: number;
  limitCount?: number;
  limitReached?: boolean;
}

const TIER_ACCENT: Record<string, string> = {
  starter: "from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500",
  pro: "from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500",
  agency: "from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500",
};

const TIER_ICON_BG: Record<string, string> = {
  starter: "from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200 dark:border-blue-800",
  pro: "from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 border-cyan-200 dark:border-cyan-800",
  agency: "from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 border-purple-200 dark:border-purple-800",
};

const TIER_ICON_COLOR: Record<string, string> = {
  starter: "text-blue-600 dark:text-blue-400",
  pro: "text-cyan-600 dark:text-cyan-400",
  agency: "text-purple-600 dark:text-purple-400",
};

const FEATURE_BENEFITS: Record<string, string> = {
  "A/B Compare": "Test two ads side-by-side to find the stronger creative",
  "Competitor Spy": "Analyze competitor ads and reverse-engineer what's working",
  "Generate from URL": "Paste a URL and get ad copy generated from the page",
  "Swipe File": "Generate ready-to-use copy using proven ad frameworks",
  "Performance Tracker": "Track your ad performance trends over time",
};

function UpgradeButton({
  requiredTier,
  usedCount,
  limitCount,
}: {
  requiredTier: string;
  usedCount?: number;
  limitCount?: number;
}) {
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: requiredTier }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // fail silently
    } finally {
      setLoading(false);
    }
  }

  const gradientClass = TIER_ACCENT[requiredTier] ?? TIER_ACCENT.pro;
  const tierLabel = TIER_DISPLAY[requiredTier]?.label ?? "Pro";
  const tierPrice = TIER_DISPLAY[requiredTier]?.price ?? "$39/mo";

  const limitText =
    usedCount !== undefined && limitCount !== undefined
      ? ` (you&apos;ve used ${usedCount}/${limitCount})`
      : "";

  return (
    <div className="space-y-3">
      {limitText && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          You&apos;ve used {usedCount}/{limitCount} on your current plan.
        </p>
      )}
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className={`inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${gradientClass} text-white font-medium text-sm rounded-lg transition disabled:opacity-60 shadow-lg`}
      >
        {loading ? (
          <>
            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Redirecting…
          </>
        ) : (
          <>
            Upgrade to {tierLabel} — {tierPrice}
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </>
        )}
      </button>
      <p className="text-[11px] text-gray-400 dark:text-gray-600 text-center">
        Includes 3-day free trial · Cancel anytime
      </p>
    </div>
  );
}

export default function FeatureGate({
  children,
  userTier,
  requiredTier,
  featureName,
  usedCount,
  limitCount,
  limitReached = false,
}: FeatureGateProps) {
  const hasAccess = TIER_ORDER.indexOf(userTier || "free") >= TIER_ORDER.indexOf(requiredTier);

  // Still loading (empty string userTier) — render children normally
  if (!userTier) return <>{children}</>;

  if (hasAccess && !limitReached) return <>{children}</>;

  const tierLabel = TIER_DISPLAY[requiredTier]?.label ?? "Pro";
  const tierPrice = TIER_DISPLAY[requiredTier]?.price ?? "$39/mo";
  const benefit = FEATURE_BENEFITS[featureName] ?? `Available on ${tierLabel} and above`;
  const iconBg = TIER_ICON_BG[requiredTier] ?? TIER_ICON_BG.pro;
  const iconColor = TIER_ICON_COLOR[requiredTier] ?? TIER_ICON_COLOR.pro;

  // If they have access but hit limit — show limit message
  if (hasAccess && limitReached) {
    const tierLimits = TIER_LIMITS[requiredTier as keyof typeof TIER_LIMITS];
    const nextTierLabel =
      requiredTier === "starter" ? "Pro"
      : requiredTier === "pro" ? "Agency"
      : null;

    return (
      <div className="relative min-h-[300px]">
        <div className="pointer-events-none select-none blur-sm opacity-30 overflow-hidden max-h-[300px]">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-[2px] rounded-2xl">
          <div className="text-center p-8 max-w-sm">
            <div className={`w-14 h-14 bg-gradient-to-br ${iconBg} border rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              <svg className={`w-7 h-7 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Monthly Limit Reached</h3>
            {usedCount !== undefined && limitCount !== undefined && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                You&apos;ve used <span className="font-semibold text-gray-700 dark:text-gray-200">{usedCount}/{limitCount}</span> this month.
              </p>
            )}
            {nextTierLabel ? (
              <>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                  Upgrade to{" "}
                  <span className="font-semibold text-gray-700 dark:text-gray-200">{nextTierLabel}</span>{" "}
                  for more capacity.
                </p>
                <UpgradeButton
                  requiredTier={requiredTier === "starter" ? "pro" : "agency"}
                  usedCount={usedCount}
                  limitCount={limitCount}
                />
              </>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                Resets on the 1st of next month.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // No access — show upgrade gate
  return (
    <div className="relative min-h-[400px]">
      <div className="pointer-events-none select-none blur-sm opacity-30 overflow-hidden max-h-[400px]">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-gray-950/70 backdrop-blur-[2px] rounded-2xl">
        <div className="text-center p-8 max-w-sm">
          <div className={`w-14 h-14 bg-gradient-to-br ${iconBg} border rounded-2xl flex items-center justify-center mx-auto mb-4`}>
            <svg className={`w-7 h-7 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{featureName}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{benefit}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">
            Available on{" "}
            <span className="font-semibold text-gray-600 dark:text-gray-300">
              {tierLabel} ({tierPrice})
            </span>{" "}
            and above
          </p>
          <UpgradeButton requiredTier={requiredTier} usedCount={usedCount} limitCount={limitCount} />
        </div>
      </div>
    </div>
  );
}
