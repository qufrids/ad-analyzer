"use client";

import { TIER_DISPLAY } from "@/lib/stripe-config";

interface LimitReachedModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  used: number;
  limit: number;
  currentTier: string;
  upgradeTier: string;
}

function daysUntilNextMonth(): number {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return Math.ceil((nextMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default function LimitReachedModal({ isOpen, onClose, featureName, used, limit, currentTier, upgradeTier }: LimitReachedModalProps) {
  if (!isOpen) return null;

  const days = daysUntilNextMonth();

  async function handleUpgrade() {
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: upgradeTier }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      onClose();
    }
  }

  const upgradeLimit = {
    starter: { analyses: 50, improvements: 10, comparisons: 5 },
    pro: { analyses: 200, improvements: 40, comparisons: 20 },
    agency: { analyses: 'Unlimited', improvements: 'Unlimited', comparisons: 'Unlimited' },
  }[upgradeTier] ?? {};

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Monthly limit reached</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          You&apos;ve used <strong className="text-gray-700 dark:text-gray-200">{used}/{limit}</strong> {featureName} this month.
          Resets in <strong className="text-gray-700 dark:text-gray-200">{days} {days === 1 ? 'day' : 'days'}</strong>.
        </p>

        {/* Tier comparison */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 border border-blue-100 dark:border-blue-800 rounded-xl p-4 mb-5">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-500 dark:text-gray-400">Current ({TIER_DISPLAY[currentTier]?.label})</span>
            <span className="font-semibold text-gray-700 dark:text-gray-300">{limit}/mo</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-600 dark:text-blue-400 font-medium">Upgrade to {TIER_DISPLAY[upgradeTier]?.label}</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">{typeof upgradeLimit === 'object' ? JSON.stringify(upgradeLimit) : ''}/mo</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleUpgrade}
            className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium text-sm rounded-lg transition"
          >
            Upgrade Now — {TIER_DISPLAY[upgradeTier]?.price}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
