"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast";
import Link from "next/link";

const PLATFORMS = [
  {
    id: "facebook",
    label: "Facebook",
    color: "blue",
    activeBg: "bg-blue-500/10 border-blue-500/40 text-blue-400",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: "instagram",
    label: "Instagram",
    color: "pink",
    activeBg: "bg-pink-500/10 border-pink-500/40 text-pink-400",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    id: "tiktok",
    label: "TikTok",
    color: "cyan",
    activeBg: "bg-cyan-500/10 border-cyan-500/40 text-cyan-400",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.88a8.17 8.17 0 004.79 1.54V7a4.85 4.85 0 01-1.02-.31z" />
      </svg>
    ),
  },
  {
    id: "google",
    label: "Google Ads",
    color: "amber",
    activeBg: "bg-amber-500/10 border-amber-500/40 text-amber-400",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
  },
] as const;

const TONES = [
  { id: "Professional", desc: "Clear, authoritative" },
  { id: "Casual",       desc: "Friendly, conversational" },
  { id: "Urgent",       desc: "Scarcity, FOMO" },
  { id: "Playful",      desc: "Fun, energetic" },
  { id: "Luxurious",    desc: "Premium, aspirational" },
];

export default function GeneratePage() {
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();

  const [url, setUrl] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    "facebook",
    "instagram",
  ]);
  const [tone, setTone] = useState("Casual");

  const [generating, setGenerating] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [error, setError] = useState("");
  const [noCredits, setNoCredits] = useState(false);

  function togglePlatform(id: string) {
    setSelectedPlatforms((prev) =>
      prev.includes(id)
        ? prev.length > 1
          ? prev.filter((p) => p !== id)
          : prev // keep at least one
        : [...prev, id]
    );
  }

  const canGenerate = url.trim() && selectedPlatforms.length > 0 && tone;

  async function handleGenerate() {
    if (!canGenerate) return;

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(
        url.startsWith("http") ? url : `https://${url}`
      );
    } catch {
      setError("Please enter a valid URL.");
      return;
    }

    setError("");
    setNoCredits(false);
    setGenerating(true);

    const msgs = [
      "Fetching product page...",
      "Reading product details...",
      "Extracting key features...",
      `Writing ${selectedPlatforms.length} platform${selectedPlatforms.length > 1 ? "s" : ""}...`,
      "Crafting Pain Point hooks...",
      "Writing Social Proof angles...",
      "Generating Curiosity hooks...",
      "Finalising ad copy...",
    ];
    let idx = 0;
    setProgressMsg(msgs[0]);
    const timer = setInterval(() => {
      idx = Math.min(idx + 1, msgs.length - 1);
      setProgressMsg(msgs[idx]);
    }, 4000);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated. Please log in again.");

      const { data: profile } = await supabase
        .from("profiles")
        .select("generations_remaining, subscription_status")
        .eq("id", user.id)
        .single();

      if (
        profile?.subscription_status !== "active" &&
        (profile?.generations_remaining ?? 0) <= 0
      ) {
        setNoCredits(true);
        setGenerating(false);
        toast("No generations remaining. Upgrade to Pro.", "warning");
        return;
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 150_000);

      let res: Response;
      try {
        res = await fetch("/api/generate-from-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: parsedUrl.toString(),
            platforms: selectedPlatforms,
            tone,
          }),
          signal: controller.signal,
        });
      } catch (fetchErr) {
        if (fetchErr instanceof DOMException && fetchErr.name === "AbortError") {
          toast("Generation timed out. Please try again.", "error");
          throw new Error("Timed out.");
        }
        toast("Network error.", "error");
        throw new Error("Network error.");
      } finally {
        clearTimeout(timeout);
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg = body.error || "Generation failed";
        if (res.status === 403) {
          setNoCredits(true);
          setGenerating(false);
          toast("No generations remaining.", "warning");
          return;
        }
        if (res.status === 429) toast("Too many requests. Wait a minute.", "warning");
        else toast(msg, "error");
        throw new Error(msg);
      }

      const { generationId } = await res.json();
      toast("Ads generated successfully!", "success");
      router.push(`/generate/${generationId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setGenerating(false);
    } finally {
      clearInterval(timer);
      setProgressMsg("");
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          🔗 Generate Ads from Your Product Page
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Paste your Shopify, Amazon, or any product URL. Our AI will create
          ready-to-run ad copy tailored to each platform.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-500/[0.08] text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/25">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            URL Scraper + AI Writer
          </span>
          <span className="text-[11px] text-gray-400 dark:text-zinc-600">
            Works on any product page
          </span>
        </div>
      </div>

      {/* No credits */}
      {noCredits && (
        <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl flex items-center gap-3">
          <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">No generations remaining</p>
            <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">Upgrade to Pro for unlimited ad generation.</p>
          </div>
          <Link href="/settings" className="text-xs font-semibold px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition">
            Upgrade
          </Link>
        </div>
      )}

      {/* Step 1 — URL */}
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-600 text-white text-sm font-bold">1</span>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Product page URL</h2>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder="https://yourstore.com/products/amazing-product"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400 dark:placeholder:text-gray-600"
          />
        </div>
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-600">
          Shopify, Amazon, Etsy, WooCommerce, or any product landing page.
        </p>
      </div>

      {/* Step 2 — Platforms */}
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-600 text-white text-sm font-bold">2</span>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Select platforms</h2>
          <span className="text-xs text-gray-400 dark:text-gray-600">Multi-select</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {PLATFORMS.map((p) => {
            const isSelected = selectedPlatforms.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => togglePlatform(p.id)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                  isSelected
                    ? p.activeBg
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <span className={isSelected ? "" : "opacity-50"}>{p.icon}</span>
                {p.label}
                {isSelected && (
                  <svg className="w-3.5 h-3.5 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-gray-400 dark:text-gray-600">
          You&apos;ll get 3 ad variations (Pain Point, Social Proof, Curiosity) for each selected platform.
        </p>
      </div>

      {/* Step 3 — Tone */}
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-600 text-white text-sm font-bold">3</span>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Ad tone</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTone(t.id)}
              className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
                tone === t.id
                  ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-600 dark:text-indigo-400"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              {t.id}
              <span className="ml-1.5 text-[10px] font-normal opacity-60">{t.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && !noCredits && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Generate button */}
      {generating ? (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-2 border-indigo-200 dark:border-indigo-900/40" />
            <div className="absolute inset-0 rounded-full border-2 border-t-indigo-600 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse text-center">{progressMsg}</p>
          <p className="text-xs text-gray-400 dark:text-gray-600">This may take 30–60 seconds</p>
        </div>
      ) : (
        <button
          onClick={handleGenerate}
          disabled={!canGenerate || noCredits}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:from-gray-300 disabled:to-gray-300 dark:disabled:from-gray-700 dark:disabled:to-gray-700 text-white disabled:text-gray-400 dark:disabled:text-gray-600 font-semibold text-[15px] rounded-xl transition-all shadow-sm shadow-indigo-900/20 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Generate Ads →
        </button>
      )}

      {!canGenerate && !generating && (
        <p className="text-center text-xs text-gray-400 dark:text-gray-600 -mt-4">
          {!url ? "Enter a product URL to get started" : "Select at least one platform"}
        </p>
      )}
    </div>
  );
}
