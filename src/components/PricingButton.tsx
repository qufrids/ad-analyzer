"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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

const BASE =
  "block w-full text-center py-[14px] rounded-[8px] text-[15px] font-semibold transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed";

export default function PricingButton({ tier, highlight = false }: PricingButtonProps) {
  const router = useRouter();
  const [userTier, setUserTier] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setUserTier("guest"); return; }
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
        router.push(`/signup?redirect=/pricing&tier=${tier}`);
        return;
      }
      if (data.url) window.location.href = data.url;
    } catch { /* fail silently */ }
    finally { setLoading(false); }
  }

  if (tier === "free") {
    return (
      <a href="/signup" className={`${BASE} border border-[#E2E8F0] text-[#334155] hover:bg-[#F8FAFC]`}>
        Get Started Free
      </a>
    );
  }

  if (userTier === null) {
    return <div className="h-12 w-full rounded-[8px] bg-[#F1F5F9] animate-pulse" />;
  }

  const userTierIndex = TIER_INDEX[userTier] ?? -1;
  const thisTierIndex = TIER_INDEX[tier] ?? 0;

  if (userTier === "guest") {
    return (
      <button
        onClick={() => router.push(`/signup?redirect=/pricing&tier=${tier}`)}
        className={`${BASE} ${
          highlight
            ? "bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
            : "border border-[#E2E8F0] text-[#334155] hover:bg-[#F8FAFC]"
        }`}
      >
        Start 3-Day Free Trial
      </button>
    );
  }

  if (userTierIndex === thisTierIndex) {
    return (
      <button
        disabled
        className={`${BASE} bg-[#F8FAFC] text-[#94A3B8] border border-[#E2E8F0] cursor-not-allowed`}
      >
        Current Plan
      </button>
    );
  }

  if (userTierIndex > thisTierIndex && userTierIndex > 0) {
    return (
      <a
        href="/settings"
        className={`${BASE} border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]`}
      >
        Downgrade
      </a>
    );
  }

  const label = userTier === "free" ? "Start 3-Day Free Trial" : "Upgrade";

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={`${BASE} ${
        highlight
          ? "bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
          : "border border-[#E2E8F0] text-[#334155] hover:bg-[#F8FAFC]"
      }`}
    >
      {loading ? (
        <span className="inline-flex items-center justify-center gap-2">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Redirecting…
        </span>
      ) : label}
    </button>
  );
}
