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

interface UploadZoneProps {
  label: string;
  letter: "A" | "B";
  preview: string | null;
  dragOver: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  error: string;
}

function UploadZone({
  label,
  letter,
  preview,
  dragOver,
  inputRef,
  onDrop,
  onDragOver,
  onDragLeave,
  onFileInput,
  onClear,
  error,
}: UploadZoneProps) {
  const color = letter === "A" ? "blue" : "violet";
  const borderActive = letter === "A" ? "border-blue-500 bg-blue-500/5" : "border-violet-500 bg-violet-500/5";
  const badgeBg = letter === "A"
    ? "bg-blue-600/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30"
    : "bg-violet-600/10 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-500/30";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-sm font-black border ${badgeBg}`}>
          {letter}
        </span>
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</span>
      </div>

      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <img
            src={preview}
            alt={`Ad ${letter} preview`}
            className="w-full h-48 object-cover"
          />
          <button
            onClick={onClear}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition"
            title="Remove image"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className={`absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-black ${
            letter === "A" ? "bg-blue-600 text-white" : "bg-violet-600 text-white"
          }`}>
            Ad {letter}
          </div>
        </div>
      ) : (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition min-h-[192px] flex flex-col items-center justify-center gap-3 ${
            dragOver
              ? borderActive
              : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-gray-100/50 dark:hover:bg-gray-800/30"
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            color === "blue"
              ? "bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20"
              : "bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20"
          }`}>
            <svg className={`w-5 h-5 ${color === "blue" ? "text-blue-500" : "text-violet-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Drop Ad {letter} here, or{" "}
              <span className={color === "blue" ? "text-blue-600 dark:text-blue-400" : "text-violet-600 dark:text-violet-400"}>
                browse
              </span>
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">JPG, PNG, or WebP — max 5MB</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={onFileInput}
          />
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

export default function ComparePage() {
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();

  const fileInputRefA = useRef<HTMLInputElement>(null);
  const fileInputRefB = useRef<HTMLInputElement>(null);

  const [fileA, setFileA] = useState<File | null>(null);
  const [previewA, setPreviewA] = useState<string | null>(null);
  const [dragOverA, setDragOverA] = useState(false);
  const [errorA, setErrorA] = useState("");

  const [fileB, setFileB] = useState<File | null>(null);
  const [previewB, setPreviewB] = useState<string | null>(null);
  const [dragOverB, setDragOverB] = useState(false);
  const [errorB, setErrorB] = useState("");

  const [platform, setPlatform] = useState("");
  const [niche, setNiche] = useState("");
  const [customNiche, setCustomNiche] = useState("");

  const [comparing, setComparing] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [error, setError] = useState("");
  const [noCredits, setNoCredits] = useState(false);

  const handleFile = useCallback(
    (f: File, slot: "A" | "B") => {
      const setErr = slot === "A" ? setErrorA : setErrorB;
      const setFile = slot === "A" ? setFileA : setFileB;
      const setPreview = slot === "A" ? setPreviewA : setPreviewB;

      setErr("");
      if (!ACCEPTED_TYPES.includes(f.type)) {
        const msg = `Unsupported format. Please use JPG, PNG, or WebP.`;
        setErr(msg);
        toast(msg, "error");
        return;
      }
      if (f.size > MAX_FILE_SIZE) {
        const msg = `Image too large (${(f.size / 1024 / 1024).toFixed(1)} MB). Max 5MB.`;
        setErr(msg);
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

  function clearSlot(slot: "A" | "B") {
    if (slot === "A") {
      setFileA(null); setPreviewA(null); setErrorA("");
      if (fileInputRefA.current) fileInputRefA.current.value = "";
    } else {
      setFileB(null); setPreviewB(null); setErrorB("");
      if (fileInputRefB.current) fileInputRefB.current.value = "";
    }
  }

  const canCompare = fileA && fileB && platform && (niche !== "Other" ? niche : customNiche);

  async function handleCompare() {
    if (!fileA || !fileB || !canCompare) return;
    setError("");
    setNoCredits(false);
    setComparing(true);

    const msgs = [
      "Uploading creatives...",
      "Analyzing Ad A...",
      "Analyzing Ad B...",
      "Comparing visual impact...",
      "Evaluating hook strength...",
      "Assessing CTA effectiveness...",
      "Determining the winner...",
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

      // Check credits
      const { data: profile } = await supabase
        .from("profiles")
        .select("comparisons_remaining, subscription_status")
        .eq("id", user.id)
        .single();

      if (
        profile?.subscription_status !== "active" &&
        (profile?.comparisons_remaining ?? 0) <= 0
      ) {
        setNoCredits(true);
        setComparing(false);
        toast("No comparisons remaining. Upgrade to Pro for unlimited.", "warning");
        return;
      }

      // Upload both images
      const extA = fileA.name.split(".").pop();
      const extB = fileB.name.split(".").pop();
      const pathA = `${user.id}/compare-${Date.now()}-a.${extA}`;
      const pathB = `${user.id}/compare-${Date.now() + 1}-b.${extB}`;

      const [uploadA, uploadB] = await Promise.all([
        supabase.storage.from("ad-images").upload(pathA, fileA),
        supabase.storage.from("ad-images").upload(pathB, fileB),
      ]);

      if (uploadA.error || uploadB.error) {
        toast("Failed to upload images. Please try again.", "error");
        throw new Error("Image upload failed");
      }

      const { data: { publicUrl: urlA } } = supabase.storage.from("ad-images").getPublicUrl(pathA);
      const { data: { publicUrl: urlB } } = supabase.storage.from("ad-images").getPublicUrl(pathB);

      const effectiveNiche = niche === "Other" ? customNiche : niche;

      // Call compare API
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 120_000);

      let res: Response;
      try {
        res = await fetch("/api/compare", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageAUrl: urlA,
            imageBUrl: urlB,
            platform: platform.toLowerCase().replace(" ", "_"),
            niche: effectiveNiche.toLowerCase().replace("/", "_").replace(" & ", "_"),
          }),
          signal: controller.signal,
        });
      } catch (fetchErr) {
        if (fetchErr instanceof DOMException && fetchErr.name === "AbortError") {
          toast("Comparison timed out. Please try again.", "error");
          throw new Error("Comparison timed out.");
        }
        toast("Network error. Check your connection.", "error");
        throw new Error("Network error.");
      } finally {
        clearTimeout(timeout);
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg = body.error || "Comparison failed";
        if (res.status === 403) {
          setNoCredits(true);
          setComparing(false);
          toast("No comparisons remaining.", "warning");
          return;
        }
        if (res.status === 429) {
          toast("Too many requests. Please wait a minute.", "warning");
        } else {
          toast(msg, "error");
        }
        throw new Error(msg);
      }

      const { comparisonId } = await res.json();
      toast("Comparison complete! Revealing the winner...", "success");
      router.push(`/compare/${comparisonId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setComparing(false);
    } finally {
      clearInterval(timer);
      setProgressMsg("");
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">A/B Compare</h1>
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 rounded-full">
            New
          </span>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Upload two ad creatives and let AI determine which one will win.
        </p>
      </div>

      {/* No credits warning */}
      {noCredits && (
        <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl flex items-center gap-3">
          <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">No comparisons remaining</p>
            <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">Free plan includes 1 comparison. Upgrade to Pro for unlimited.</p>
          </div>
          <Link
            href="/settings"
            className="text-xs font-semibold px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition"
          >
            Upgrade
          </Link>
        </div>
      )}

      {/* Upload zones */}
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-5">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold">1</span>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upload both ad creatives</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <UploadZone
            label="First Ad"
            letter="A"
            preview={previewA}
            dragOver={dragOverA}
            inputRef={fileInputRefA}
            onDrop={(e) => { e.preventDefault(); setDragOverA(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f, "A"); }}
            onDragOver={(e) => { e.preventDefault(); setDragOverA(true); }}
            onDragLeave={() => setDragOverA(false)}
            onFileInput={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f, "A"); }}
            onClear={() => clearSlot("A")}
            error={errorA}
          />

          <UploadZone
            label="Second Ad"
            letter="B"
            preview={previewB}
            dragOver={dragOverB}
            inputRef={fileInputRefB}
            onDrop={(e) => { e.preventDefault(); setDragOverB(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f, "B"); }}
            onDragOver={(e) => { e.preventDefault(); setDragOverB(true); }}
            onDragLeave={() => setDragOverB(false)}
            onFileInput={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f, "B"); }}
            onClear={() => clearSlot("B")}
            error={errorB}
          />
        </div>
      </div>

      {/* Platform & Niche */}
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-5">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold">2</span>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Set context</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Platform <span className="text-red-500">*</span>
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select platform...</option>
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Niche <span className="text-red-500">*</span>
            </label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select niche...</option>
              {NICHES.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
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
                className="w-full px-3 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        <p className="mt-3 text-xs text-gray-400 dark:text-gray-600">
          Platform and niche context apply to both ads — they should be competing for the same audience.
        </p>
      </div>

      {/* Error */}
      {error && !noCredits && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Compare button */}
      {comparing ? (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="relative">
            <div className="w-14 h-14 rounded-full border-2 border-blue-200 dark:border-blue-900" />
            <div className="absolute inset-0 w-14 h-14 rounded-full border-2 border-t-blue-600 animate-spin" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">{progressMsg}</p>
        </div>
      ) : (
        <button
          onClick={handleCompare}
          disabled={!canCompare || noCredits}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:from-gray-300 disabled:to-gray-300 dark:disabled:from-gray-700 dark:disabled:to-gray-700 text-white disabled:text-gray-400 dark:disabled:text-gray-600 font-semibold text-[15px] rounded-xl transition-all shadow-sm disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Compare Ads →
        </button>
      )}

      {!canCompare && !comparing && (
        <p className="text-center text-xs text-gray-400 dark:text-gray-600 -mt-4">
          {!fileA || !fileB ? "Upload both ad creatives to continue" : "Select platform and niche to continue"}
        </p>
      )}
    </div>
  );
}
