"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

const TIER_FEATURES: Record<string, string[]> = {
  starter: [
    "50 ad analyses per month",
    "10 AI ad improvements per month",
    "5 A/B comparisons per month",
    "Full swipe file + copy generation",
    "Basic performance tracker",
    "Email support",
  ],
  pro: [
    "200 ad analyses per month",
    "40 AI ad improvements per month",
    "20 A/B comparisons per month",
    "10 Competitor Spy uses per month",
    "5 URL to Ads generations per month",
    "Full swipe file + copy generation",
    "Full tracker + CSV export",
    "Priority analysis speed",
  ],
  agency: [
    "Unlimited ad analyses",
    "Unlimited AI ad improvements",
    "Unlimited A/B comparisons",
    "Unlimited Competitor Spy",
    "Unlimited URL to Ads",
    "Weekly email performance reports",
    "Priority support",
    "API access (coming soon)",
  ],
};

const TIER_PRICES: Record<string, string> = {
  starter: "$19",
  pro: "$39",
  agency: "$79",
};

interface SessionData {
  tier: string;
  trial_ends_at: string;
  price: string;
  card_brand: string | null;
  card_last4: string | null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function ConfettiPiece({ index }: { index: number }) {
  const colors = ["#22C55E", "#3B82F6", "#8B5CF6", "#F59E0B", "#EC4899", "#06B6D4"];
  const color = colors[index % colors.length];
  const left = `${(index * 37 + 5) % 95}%`;
  const delay = `${(index * 0.15) % 2}s`;
  const duration = `${2.5 + (index % 3) * 0.4}s`;
  const size = `${6 + (index % 3) * 3}px`;

  return (
    <div
      className="confetti-piece"
      style={
        {
          "--color": color,
          "--left": left,
          "--delay": delay,
          "--duration": duration,
          "--size": size,
        } as React.CSSProperties
      }
    />
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [data, setData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    if (!sessionId) {
      setError("No session found.");
      setLoading(false);
      return;
    }

    fetch(`/api/stripe/verify-session?session_id=${sessionId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setData(d);
        } else {
          setError(d.error || "Could not verify your subscription.");
        }
      })
      .catch(() => setError("Network error. Please check your Settings page."))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const tierName = data?.tier ? capitalize(data.tier) : "Pro";
  const features = data?.tier ? (TIER_FEATURES[data.tier] ?? TIER_FEATURES.pro) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto mb-6" />
          <p className="text-zinc-400 text-[15px]">Verifying your subscription…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-zinc-400 text-sm mb-6">{error}</p>
          <Link href="/settings" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.08] text-white rounded-xl text-sm font-medium transition">
            Check Settings →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white overflow-hidden">
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes checkmark-circle {
          0% { stroke-dashoffset: 166; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes checkmark-stroke {
          0% { stroke-dashoffset: 48; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .confetti-piece {
          position: fixed;
          top: -10px;
          left: var(--left);
          width: var(--size);
          height: var(--size);
          background: var(--color);
          border-radius: 2px;
          animation: confetti-fall var(--duration) ease-in var(--delay) forwards;
          pointer-events: none;
          z-index: 100;
        }
        .checkmark-circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          animation: checkmark-circle 0.6s cubic-bezier(0.65, 0, 0.45, 1) 0.3s forwards;
        }
        .checkmark-stroke {
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: checkmark-stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }
        .fade-up-1 { animation: fade-up 0.5s ease 0.2s both; }
        .fade-up-2 { animation: fade-up 0.5s ease 0.4s both; }
        .fade-up-3 { animation: fade-up 0.5s ease 0.6s both; }
        .fade-up-4 { animation: fade-up 0.5s ease 0.8s both; }
        .fade-up-5 { animation: fade-up 0.5s ease 1.0s both; }
      `}</style>

      {/* Confetti */}
      {Array.from({ length: 30 }).map((_, i) => (
        <ConfettiPiece key={i} index={i} />
      ))}

      {/* Background glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] opacity-[0.12] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, #22C55E 0%, transparent 65%)" }}
      />

      <div className="relative max-w-2xl mx-auto px-4 py-16 sm:py-24">
        {/* Checkmark */}
        <div className="fade-up-1 flex flex-col items-center mb-10">
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full blur-xl opacity-30"
              style={{ background: "radial-gradient(circle, #22C55E 0%, transparent 70%)" }}
            />
            <svg className="w-20 h-20 relative" viewBox="0 0 52 52">
              <circle
                className="checkmark-circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
                stroke="#22C55E"
                strokeWidth="2"
              />
              <path
                className="checkmark-stroke"
                fill="none"
                stroke="#22C55E"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 27l8 8 16-18"
              />
            </svg>
          </div>

          <h1 className="mt-6 text-3xl sm:text-4xl font-black tracking-tight text-center">
            Welcome to {tierName}! 🎉
          </h1>
          <p className="mt-2 text-zinc-400 text-[15px] text-center">
            Your subscription is now active
          </p>
        </div>

        {/* Subscription details card */}
        <div className="fade-up-2 bg-zinc-900 border border-white/[0.07] rounded-2xl p-6 mb-6">
          <h2 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-4">
            Subscription Details
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Plan</span>
              <span className="text-sm font-semibold text-white">{tierName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Price</span>
              <span className="text-sm font-semibold text-white">
                {TIER_PRICES[data?.tier ?? "pro"] ?? "$39"}/month
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Trial</span>
              <span className="text-sm font-semibold text-green-400">3-day free trial starts now</span>
            </div>
            {data?.trial_ends_at && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Trial ends</span>
                  <span className="text-sm font-semibold text-white">
                    {formatDate(data.trial_ends_at)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">First charge</span>
                  <span className="text-sm font-semibold text-white">
                    {TIER_PRICES[data?.tier ?? "pro"] ?? "$39"} on {formatDate(data.trial_ends_at)}
                  </span>
                </div>
              </>
            )}
            {data?.card_last4 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Payment method</span>
                <span className="text-sm font-semibold text-white capitalize">
                  {data.card_brand ?? "Card"} ···· {data.card_last4}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* What's included */}
        {features.length > 0 && (
          <div className="fade-up-3 bg-zinc-900 border border-white/[0.07] rounded-2xl p-6 mb-6">
            <h2 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-4">
              What&apos;s Included in {tierName}
            </h2>
            <ul className="space-y-2.5">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <svg className="w-4 h-4 shrink-0 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-zinc-300">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA buttons */}
        <div className="fade-up-4 flex flex-col sm:flex-row gap-3 mb-8">
          <Link
            href="/dashboard"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold text-[15px] rounded-xl transition shadow-lg shadow-green-900/30"
          >
            Go to Dashboard
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/analyze"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-white/[0.1] hover:border-white/[0.2] hover:bg-white/[0.04] text-zinc-300 font-medium text-[15px] rounded-xl transition"
          >
            Analyze Your First Ad
          </Link>
        </div>

        {/* Footer note */}
        <p className="fade-up-5 text-center text-[12px] text-zinc-600 leading-relaxed">
          You can manage your subscription anytime in{" "}
          <Link href="/settings" className="text-zinc-400 hover:text-zinc-300 underline underline-offset-2">
            Settings
          </Link>
          . Cancel before your trial ends and you won&apos;t be charged.
        </p>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
