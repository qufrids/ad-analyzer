"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TIER_ORDER, TIER_DISPLAY } from "@/lib/stripe-config";

const PRICING = [
  {
    name: "Free",
    tier: "free" as const,
    price: "$0",
    cadence: "forever",
    desc: "Try AdScore AI — no card needed.",
    highlight: false,
    features: [
      { text: "3 ad analyses", included: true },
      { text: "1 AI ad improvement", included: true },
      { text: "Browse swipe file templates", included: true },
      { text: "A/B Compare", included: false },
      { text: "Competitor Spy", included: false },
      { text: "URL to Ads generator", included: false },
      { text: "Performance Tracker", included: false },
    ],
  },
  {
    name: "Starter",
    tier: "starter" as const,
    price: "$19",
    cadence: "/month",
    desc: "For sellers testing and iterating creatives.",
    highlight: false,
    features: [
      { text: "50 analyses/month", included: true },
      { text: "10 AI improvements/month", included: true },
      { text: "5 A/B comparisons/month", included: true },
      { text: "Full swipe file + copy gen", included: true },
      { text: "Basic performance tracker", included: true },
      { text: "Competitor Spy", included: false },
      { text: "URL to Ads generator", included: false },
      { text: "Email support", included: true },
    ],
  },
  {
    name: "Pro",
    tier: "pro" as const,
    price: "$39",
    cadence: "/month",
    desc: "For marketers who ship consistently.",
    highlight: true,
    features: [
      { text: "200 analyses/month", included: true },
      { text: "40 AI improvements/month", included: true },
      { text: "20 A/B comparisons/month", included: true },
      { text: "10 Competitor Spy/month", included: true },
      { text: "5 URL to Ads/month", included: true },
      { text: "Full swipe file + copy gen", included: true },
      { text: "Full tracker + export", included: true },
      { text: "Priority analysis speed", included: true },
    ],
  },
  {
    name: "Agency",
    tier: "agency" as const,
    price: "$79",
    cadence: "/month",
    desc: "For teams managing multiple brands.",
    highlight: false,
    features: [
      { text: "Unlimited analyses", included: true },
      { text: "Unlimited improvements", included: true },
      { text: "Unlimited A/B compare", included: true },
      { text: "Unlimited Competitor Spy", included: true },
      { text: "Unlimited URL to Ads", included: true },
      { text: "Weekly email reports", included: true },
      { text: "Priority support", included: true },
      { text: "API access (coming soon)", included: true },
    ],
  },
];

const TIER_BADGE_CLASS: Record<string, string> = {
  free: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
  starter: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
  pro: "bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  agency: "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400",
};

export default function PricingPage() {
  const router = useRouter();
  const [userTier, setUserTier] = useState<string>("free");
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_tier")
        .eq("id", user.id)
        .single();
      setUserTier((profile?.subscription_tier as string | null) ?? "free");
      setReady(true);
    });
  }, [router]);

  async function handleCheckout(tier: string) {
    setLoadingTier(tier);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoadingTier(null);
    }
  }

  async function handlePortal() {
    setLoadingTier("portal");
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoadingTier(null);
    }
  }

  const userTierIndex = TIER_ORDER.indexOf(userTier);

  function renderButton(p: typeof PRICING[number]) {
    if (!ready) {
      return <div className="h-9 w-full rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />;
    }

    const thisTierIndex = TIER_ORDER.indexOf(p.tier);

    // Free tier
    if (p.tier === "free") {
      if (userTierIndex === 0) {
        return (
          <button disabled className="w-full py-2.5 rounded-lg text-[13px] font-semibold cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700">
            Current Plan
          </button>
        );
      }
      return (
        <button onClick={handlePortal} disabled={loadingTier === "portal"} className="w-full py-2.5 rounded-lg text-[13px] font-semibold transition border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-60">
          {loadingTier === "portal" ? "Opening…" : "Manage / Downgrade"}
        </button>
      );
    }

    // Current plan
    if (userTierIndex === thisTierIndex) {
      return (
        <div className="space-y-2">
          <button disabled className="w-full py-2.5 rounded-lg text-[13px] font-semibold cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700">
            Current Plan
          </button>
          <button onClick={handlePortal} disabled={loadingTier === "portal"} className="w-full py-2 rounded-lg text-[12px] font-medium transition border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-60">
            {loadingTier === "portal" ? "Opening…" : "Manage Billing"}
          </button>
        </div>
      );
    }

    // Downgrade
    if (userTierIndex > thisTierIndex && userTierIndex > 0) {
      return (
        <button onClick={handlePortal} disabled={loadingTier === "portal"} className="w-full py-2.5 rounded-lg text-[13px] font-semibold transition border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-60">
          {loadingTier === "portal" ? "Opening…" : "Downgrade"}
        </button>
      );
    }

    // Upgrade
    const isLoading = loadingTier === p.tier;
    return (
      <button
        onClick={() => handleCheckout(p.tier)}
        disabled={!!loadingTier}
        className={`w-full py-2.5 rounded-lg text-[13px] font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed ${
          p.highlight
            ? "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-md shadow-purple-900/20"
            : "bg-gray-900 dark:bg-white/[0.06] text-white hover:bg-gray-800 dark:hover:bg-white/[0.10] border border-gray-800 dark:border-white/[0.08]"
        }`}
      >
        {isLoading ? (
          <span className="inline-flex items-center justify-center gap-2">
            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Redirecting…
          </span>
        ) : userTier === "free" ? "Start 3-Day Free Trial" : "Upgrade"}
      </button>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Plans & Pricing</h1>
          {ready && (
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${TIER_BADGE_CLASS[userTier] ?? TIER_BADGE_CLASS.free}`}>
              {TIER_DISPLAY[userTier]?.label ?? "Free"} Plan
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          All paid plans include a 3-day free trial. Cancel anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PRICING.map((p) => {
          const thisTierIndex = TIER_ORDER.indexOf(p.tier);
          const isCurrent = ready && TIER_ORDER.indexOf(userTier) === thisTierIndex;

          return (
            <div
              key={p.tier}
              className={`relative rounded-xl overflow-hidden flex flex-col ${
                isCurrent
                  ? "ring-2 ring-blue-500 dark:ring-blue-400 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-500/30"
                  : p.highlight
                  ? "bg-gray-900 dark:bg-zinc-900 border-2 border-cyan-500/60 shadow-lg shadow-cyan-900/10"
                  : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
              }`}
            >
              {isCurrent && (
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500" />
              )}
              {p.highlight && !isCurrent && (
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-cyan-400/60 via-cyan-300 to-purple-400/60" />
              )}

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <h3 className={`text-[13px] font-semibold ${
                    isCurrent ? "text-blue-600 dark:text-blue-400"
                    : p.highlight ? "text-cyan-400"
                    : "text-gray-500 dark:text-gray-400"
                  }`}>
                    {p.name}
                  </h3>
                  {isCurrent && (
                    <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 uppercase tracking-widest px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                  {p.highlight && !isCurrent && (
                    <span className="text-[9px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 uppercase tracking-widest px-2 py-0.5 rounded-full">
                      Popular
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`text-3xl font-black tracking-tight ${
                    p.highlight && !isCurrent ? "text-white" : "text-gray-900 dark:text-white"
                  }`}>
                    {p.price}
                  </span>
                  <span className="text-sm text-gray-400 dark:text-zinc-500">{p.cadence}</span>
                </div>

                <p className={`text-[12px] mb-5 ${
                  p.highlight && !isCurrent ? "text-gray-400" : "text-gray-400 dark:text-zinc-600"
                }`}>
                  {p.desc}
                </p>

                <ul className="space-y-2 flex-1 mb-5">
                  {p.features.map((f) => (
                    <li key={f.text} className="flex items-center gap-2">
                      {f.included ? (
                        <svg className={`w-3.5 h-3.5 shrink-0 ${
                          p.highlight && !isCurrent ? "text-cyan-400" : "text-green-500 dark:text-green-400"
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5 shrink-0 text-gray-300 dark:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      <span className={`text-[12px] ${
                        f.included
                          ? p.highlight && !isCurrent ? "text-gray-300" : "text-gray-600 dark:text-gray-300"
                          : "text-gray-300 dark:text-gray-700 line-through"
                      }`}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {renderButton(p)}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center mt-6 text-[12px] text-gray-400 dark:text-gray-600">
        Questions? Contact us or check the{" "}
        <a href="/#faq" className="underline underline-offset-2 hover:text-gray-600 dark:hover:text-gray-400">
          FAQ
        </a>
        .
      </p>
    </div>
  );
}
