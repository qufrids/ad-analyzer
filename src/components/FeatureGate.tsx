"use client";

import { TIER_DISPLAY, TIER_ORDER } from "@/lib/stripe-config";

interface FeatureGateProps {
  children: React.ReactNode;
  userTier: string;
  requiredTier: 'starter' | 'pro' | 'agency';
  featureName: string;
}

function UpgradeButton({ requiredTier }: { requiredTier: string }) {
  async function handleUpgrade() {
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: requiredTier }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // fail silently — user can go to settings
    }
  }

  return (
    <button
      onClick={handleUpgrade}
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium text-sm rounded-lg transition"
    >
      Upgrade to {TIER_DISPLAY[requiredTier]?.label} →
    </button>
  );
}

export default function FeatureGate({ children, userTier, requiredTier, featureName }: FeatureGateProps) {
  const hasAccess = TIER_ORDER.indexOf(userTier || 'free') >= TIER_ORDER.indexOf(requiredTier);

  if (hasAccess) return <>{children}</>;

  // Still loading (empty string userTier) — render children normally
  if (!userTier) return <>{children}</>;

  return (
    <div className="relative min-h-[400px]">
      <div className="pointer-events-none select-none blur-sm opacity-30 overflow-hidden max-h-[400px]">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-gray-950/70 backdrop-blur-[2px] rounded-2xl">
        <div className="text-center p-8 max-w-sm">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200 dark:border-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{featureName}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            Available on{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {TIER_DISPLAY[requiredTier]?.label}
            </span>{' '}
            plan and above
          </p>
          <UpgradeButton requiredTier={requiredTier} />
        </div>
      </div>
    </div>
  );
}
