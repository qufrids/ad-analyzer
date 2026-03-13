"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TIER_ORDER } from "@/lib/stripe-config";

interface PricingButtonProps {
  tier: "free" | "starter" | "pro" | "agency";
  highlight?: boolean;
}

const TIER_INDEX: Record<string, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  agency: 3,
};

export default function PricingButton({ tier, highlight = false }: PricingButtonProps) {
  const router = useRouter();
  const [userTier, setUserTier] = useState<string | null>(null); // null = loading
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        setUserTier("guest");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_tier")
        .eq("id", user.id)
        .single();
      setUserTier((profile?.subscription_tier as string | null) ?? "free");
    });
  }, []);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (res.status === 401) {
        // Not logged in — redirect to signup with intent
        router.push(`/signup?redirect=/pricing&tier=${tier}`);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // fail silently
    } finally {
      setLoading(false);
    }
  }

  // Free tier button
  if (tier === "free") {
    return (
      <a
        href="/signup"
        className="block w-full text-center py-2.5 rounded-lg text-[13px] font-semibold transition-colors border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-white/[0.04]"
      >
        Get Started Free
      </a>
    );
  }

  // Loading state — show skeleton
  if (userTier === null) {
    return (
      <div className="h-9 w-full rounded-lg bg-slate-100 dark:bg-white/[0.05] animate-pulse" />
    );
  }

  const userTierIndex = TIER_INDEX[userTier] ?? -1;
  const thisTierIndex = TIER_INDEX[tier] ?? 0;

  // Not logged in
  if (userTier === "guest") {
    return (
      <button
        onClick={() => router.push(`/signup?redirect=/pricing&tier=${tier}`)}
        className={`block w-full text-center py-2.5 rounded-lg text-[13px] font-semibold transition-colors ${
          highlight
            ? "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-lg shadow-purple-900/30"
            : "bg-slate-900 dark:bg-white/[0.06] text-white hover:bg-slate-800 dark:hover:bg-white/[0.10] border border-slate-800 dark:border-white/[0.08]"
        }`}
      >
        Start 3-Day Free Trial
      </button>
    );
  }

  // Current plan
  if (userTierIndex === thisTierIndex) {
    return (
      <button
        disabled
        className="block w-full text-center py-2.5 rounded-lg text-[13px] font-semibold cursor-not-allowed bg-slate-100 dark:bg-white/[0.04] text-slate-400 dark:text-zinc-600 border border-slate-200 dark:border-white/[0.06]"
      >
        Current Plan
      </button>
    );
  }

  // Downgrade
  if (userTierIndex > thisTierIndex && userTierIndex > 0) {
    return (
      <a
        href="/settings"
        className="block w-full text-center py-2.5 rounded-lg text-[13px] font-semibold transition-colors border border-slate-200 dark:border-white/[0.08] text-slate-500 dark:text-zinc-500 hover:bg-slate-50 dark:hover:bg-white/[0.04]"
      >
        Downgrade
      </a>
    );
  }

  // Upgrade / Start trial
  const label =
    userTier === "free"
      ? "Start 3-Day Free Trial"
      : "Upgrade";

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={`block w-full text-center py-2.5 rounded-lg text-[13px] font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
        highlight
          ? "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-lg shadow-purple-900/30"
          : "bg-slate-900 dark:bg-white/[0.06] text-white hover:bg-slate-800 dark:hover:bg-white/[0.10] border border-slate-800 dark:border-white/[0.08]"
      }`}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Redirecting…
        </span>
      ) : label}
    </button>
  );
}
