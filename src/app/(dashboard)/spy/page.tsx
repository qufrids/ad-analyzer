"use client";

import { useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast";
import Link from "next/link";

const PLATFORMS = ["Facebook", "Instagram", "TikTok", "Google Ads"] as const;
const NICHES = [
  "Fashion",
  "Beauty",
  "Tech/Gadgets",
  "Fitness",
  "Food",
  "Home & Garden",
  "Other",
] as const;

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function SpyPage() {
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [platform, setPlatform] = useState("");
  const [niche, setNiche] = useState("");
  const [customNiche, setCustomNiche] = useState("");
  const [userProduct, setUserProduct] = useState("");

  const [analyzing, setAnalyzing] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [error, setError] = useState("");
  const [noCredits, setNoCredits] = useState(false);

  const handleFile = useCallback(
    (f: File) => {
      setUploadError("");
      if (!ACCEPTED_TYPES.includes(f.type)) {
        const msg = "Unsupported format. Use JPG, PNG, or WebP.";
        setUploadError(msg);
        toast(msg, "error");
        return;
      }
      if (f.size > MAX_FILE_SIZE) {
        const msg = `Image too large (${(f.size / 1024 / 1024).toFixed(1)} MB). Max 5MB.`;
        setUploadError(msg);
        toast(msg, "error");
        return;
      }
      setFile(f);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(f);
    },
    [toast]
  );

  const canAnalyze = file && platform && (niche !== "Other" ? niche : customNiche);

  async function handleAnalyze() {
    if (!file || !canAnalyze) return;
    setError("");
    setNoCredits(false);
    setAnalyzing(true);

    const msgs = [
      "Uploading competitor ad...",
      "Scanning visual elements...",
      "Decoding their strategy...",
      "Identifying vulnerabilities...",
      "Crafting your counter-attack...",
      "Building battle plan...",
      "Compiling intelligence report...",
    ];
    let idx = 0;
    setProgressMsg(msgs[0]);
    const timer = setInterval(() => {
      idx = Math.min(idx + 1, msgs.length - 1);
      setProgressMsg(msgs[idx]);
    }, 3500);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated. Please log in again.");

      // Credit check
      const { data: profile } = await supabase
        .from("profiles")
        .select("spy_credits_remaining, subscription_status")
        .eq("id", user.id)
        .single();

      if (
        profile?.subscription_status !== "active" &&
        (profile?.spy_credits_remaining ?? 0) <= 0
      ) {
        setNoCredits(true);
        setAnalyzing(false);
        toast("No spy credits remaining. Upgrade to Pro for unlimited.", "warning");
        return;
      }

      // Upload to storage
      const ext = file.name.split(".").pop();
      const filePath = `${user.id}/spy-${Date.now()}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from("ad-images")
        .upload(filePath, file);

      if (uploadErr) {
        toast("Failed to upload image. Please try again.", "error");
        throw new Error("Upload failed: " + uploadErr.message);
      }

      const { data: { publicUrl } } = supabase.storage
        .from("ad-images")
        .getPublicUrl(filePath);

      const effectiveNiche = niche === "Other" ? customNiche : niche;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 120_000);

      let res: Response;
      try {
        res = await fetch("/api/spy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageUrl: publicUrl,
            platform: platform.toLowerCase().replace(" ", "_"),
            niche: effectiveNiche.toLowerCase().replace("/", "_").replace(" & ", "_"),
            userProduct: userProduct.trim() || undefined,
          }),
          signal: controller.signal,
        });
      } catch (fetchErr) {
        if (fetchErr instanceof DOMException && fetchErr.name === "AbortError") {
          toast("Analysis timed out. Please try again.", "error");
          throw new Error("Analysis timed out.");
        }
        toast("Network error. Check your connection.", "error");
        throw new Error("Network error.");
      } finally {
        clearTimeout(timeout);
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg = body.error || "Analysis failed";
        if (res.status === 403) {
          setNoCredits(true);
          setAnalyzing(false);
          toast("No spy credits remaining.", "warning");
          return;
        }
        if (res.status === 429) toast("Too many requests. Please wait a minute.", "warning");
        else toast(msg, "error");
        throw new Error(msg);
      }

      const { spyId } = await res.json();
      toast("Intelligence report ready.", "success");
      router.push(`/spy/${spyId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setAnalyzing(false);
    } finally {
      clearInterval(timer);
      setProgressMsg("");
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            🔍 Spy on Any Competitor&apos;s Ad
          </h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Upload a screenshot of any ad and we&apos;ll reverse-engineer why it works — then tell you exactly how to beat it.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-500/[0.08] text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/25">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            Intelligence Tool
          </span>
          <span className="text-[11px] text-gray-400 dark:text-zinc-600">
            Works on any ad from any brand
          </span>
        </div>
      </div>

      {/* No credits warning */}
      {noCredits && (
        <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl flex items-center gap-3">
          <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">No spy credits remaining</p>
            <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">Free plan includes 1 spy analysis. Upgrade to Pro for unlimited.</p>
          </div>
          <Link href="/settings" className="text-xs font-semibold px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition">
            Upgrade
          </Link>
        </div>
      )}

      {/* Upload zone */}
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-rose-600 text-white text-sm font-bold">1</span>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upload the competitor&apos;s ad</h2>
        </div>

        {preview ? (
          <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <img src={preview} alt="Competitor ad preview" className="w-full h-52 object-cover" />
            <button
              onClick={() => { setFile(null); setPreview(null); setUploadError(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white uppercase tracking-wider">
              Competitor Ad
            </div>
          </div>
        ) : (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
              dragOver
                ? "border-rose-500 bg-rose-500/5"
                : "border-gray-300 dark:border-gray-700 hover:border-rose-400 dark:hover:border-rose-500/50 hover:bg-rose-50/50 dark:hover:bg-rose-500/[0.03]"
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-rose-500 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Drop a competitor&apos;s ad screenshot, or{" "}
              <span className="text-rose-600 dark:text-rose-400">browse</span>
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
              JPG, PNG, or WebP — max 5MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
          </div>
        )}

        {uploadError && <p className="mt-2 text-xs text-red-500">{uploadError}</p>}
      </div>

      {/* Context */}
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-5">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-rose-600 text-white text-sm font-bold">2</span>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Intelligence context</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Platform <span className="text-red-500">*</span>
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="">Select platform...</option>
              {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Niche <span className="text-red-500">*</span>
            </label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="">Select niche...</option>
              {NICHES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          {niche === "Other" && (
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Describe your niche <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customNiche}
                onChange={(e) => setCustomNiche(e.target.value)}
                placeholder="e.g. Pet supplies, SaaS, Financial services..."
                className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          )}

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Your product / offer{" "}
              <span className="text-gray-400 dark:text-gray-600 font-normal">(optional — tailors the counter-strategy)</span>
            </label>
            <input
              type="text"
              value={userProduct}
              onChange={(e) => setUserProduct(e.target.value)}
              placeholder="e.g. 'Organic skincare serum for sensitive skin, $45'"
              className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && !noCredits && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* CTA */}
      {analyzing ? (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-2 border-rose-200 dark:border-rose-900/40" />
            <div className="absolute inset-0 rounded-full border-2 border-t-rose-600 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">{progressMsg}</p>
        </div>
      ) : (
        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze || noCredits}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 disabled:from-gray-300 disabled:to-gray-300 dark:disabled:from-gray-700 dark:disabled:to-gray-700 text-white disabled:text-gray-400 dark:disabled:text-gray-600 font-semibold text-[15px] rounded-xl transition-all shadow-sm shadow-rose-900/20 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Analyze Competitor Ad →
        </button>
      )}

      {!canAnalyze && !analyzing && (
        <p className="text-center text-xs text-gray-400 dark:text-gray-600 -mt-4">
          {!file ? "Upload a competitor's ad screenshot to begin" : "Select platform and niche to continue"}
        </p>
      )}
    </div>
  );
}
