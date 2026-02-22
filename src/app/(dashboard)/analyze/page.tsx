"use client";

import { useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast";

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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function AnalyzePage() {
  const supabase = createClient();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Step 1: Upload
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Step 2: Context
  const [platform, setPlatform] = useState("");
  const [niche, setNiche] = useState("");
  const [customNiche, setCustomNiche] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [productOffer, setProductOffer] = useState("");

  // Step 3: Analyze
  const [analyzing, setAnalyzing] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [error, setError] = useState("");
  const [noCredits, setNoCredits] = useState(false);

  const handleFile = useCallback((f: File) => {
    setUploadError("");
    if (!ACCEPTED_TYPES.includes(f.type)) {
      const msg = `Unsupported format (${f.type || "unknown"}). Please upload a JPG, PNG, or WebP image.`;
      setUploadError(msg);
      toast(msg, "error");
      return;
    }
    if (f.size > MAX_FILE_SIZE) {
      const sizeMB = (f.size / 1024 / 1024).toFixed(1);
      const msg = `Image is too large (${sizeMB} MB). Maximum size is 5 MB.`;
      setUploadError(msg);
      toast(msg, "error");
      return;
    }
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.onerror = () => {
      setUploadError("Failed to read the image file. Please try again.");
      toast("Failed to read the image file.", "error");
    };
    reader.readAsDataURL(f);
  }, [toast]);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  }

  function removeFile() {
    setFile(null);
    setPreview(null);
    setUploadError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const canAnalyze = file && platform && (niche !== "Other" ? niche : customNiche);

  async function handleAnalyze() {
    if (!file || !canAnalyze) return;
    setError("");
    setNoCredits(false);
    setAnalyzing(true);

    // Cycle through progress messages
    const progressMessages = [
      "Uploading creative...",
      "Analyzing hook strength...",
      "Evaluating copy clarity...",
      "Predicting engagement potential...",
      "Assessing CTA effectiveness...",
      "Checking platform fit...",
      "Generating performance score...",
      "Building recommendations...",
    ];
    let msgIndex = 0;
    setProgressMsg(progressMessages[0]);
    const progressTimer = setInterval(() => {
      msgIndex = Math.min(msgIndex + 1, progressMessages.length - 1);
      setProgressMsg(progressMessages[msgIndex]);
    }, 3500);

    try {
      // Check credits
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast("Session expired. Please log in again.", "error");
        throw new Error("Not authenticated. Please log in again.");
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("credits_remaining, subscription_status")
        .eq("id", user.id)
        .single();

      if (
        profile?.subscription_status !== "active" &&
        (profile?.credits_remaining ?? 0) <= 0
      ) {
        setNoCredits(true);
        setAnalyzing(false);
        toast("No credits remaining. Upgrade to Pro for unlimited analyses.", "warning");
        return;
      }

      // Upload image to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadErr } = await supabase.storage
        .from("ad-images")
        .upload(filePath, file);

      if (uploadErr) {
        toast("Failed to upload image. Please try again.", "error");
        throw new Error("Image upload failed: " + uploadErr.message);
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("ad-images").getPublicUrl(filePath);

      // Call analysis API with timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 120_000); // 2 min timeout

      let res: Response;
      try {
        res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageUrl: publicUrl,
            platform: platform.toLowerCase().replace(" ", "_"),
            niche: niche === "Other" ? customNiche.toLowerCase() : niche.toLowerCase().replace("/", "_").replace(" & ", "_"),
            targetAudience,
            productOffer,
          }),
          signal: controller.signal,
        });
      } catch (fetchErr) {
        if (fetchErr instanceof DOMException && fetchErr.name === "AbortError") {
          toast("Analysis timed out. The AI is taking too long — please try again.", "error");
          throw new Error("Analysis timed out. Please try again.");
        }
        toast("Network error. Check your connection and try again.", "error");
        throw new Error("Network error. Please check your connection.");
      } finally {
        clearTimeout(timeout);
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const errorMsg = body.error || "Analysis failed";

        if (res.status === 429) {
          toast("Too many requests. Please wait a minute before trying again.", "warning");
          throw new Error("Rate limit exceeded. Please wait a minute.");
        }
        if (res.status === 403) {
          setNoCredits(true);
          setAnalyzing(false);
          toast("No credits remaining.", "warning");
          return;
        }
        if (res.status === 502) {
          toast("AI service is temporarily unavailable. Please try again in a moment.", "error");
          throw new Error("AI service unavailable. Please try again.");
        }

        toast(errorMsg, "error");
        throw new Error(errorMsg);
      }

      const { analysisId } = await res.json();
      toast("Analysis complete!", "success");
      router.push(`/analysis/${analysisId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setAnalyzing(false);
    } finally {
      clearInterval(progressTimer);
      setProgressMsg("");
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Analysis</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Upload an ad creative and get AI-powered insights.
        </p>
      </div>

      {/* Step 1: Upload */}
      <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold">
            1
          </span>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upload your ad creative</h2>
        </div>

        {!preview ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 sm:p-10 text-center cursor-pointer transition ${
              dragOver
                ? "border-blue-500 bg-blue-500/5"
                : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800/30"
            }`}
          >
            <svg
              className="w-10 h-10 text-gray-400 dark:text-gray-600 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Drag and drop your image here, or{" "}
              <span className="text-blue-600 dark:text-blue-400">browse</span>
            </p>
            <p className="text-gray-400 dark:text-gray-600 text-xs mt-1">
              JPG, PNG, or WebP — max 5MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        ) : (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 max-h-72 object-contain bg-gray-100 dark:bg-gray-800"
            />
            <button
              onClick={removeFile}
              className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <p className="text-sm text-gray-500 mt-2">
              {file?.name} ({(file!.size / 1024 / 1024).toFixed(1)} MB)
            </p>
          </div>
        )}

        {uploadError && (
          <p className="text-sm text-red-400 mt-2">{uploadError}</p>
        )}
      </section>

      {/* Step 2: Context */}
      <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold">
            2
          </span>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tell us about the ad</h2>
        </div>

        <div className="space-y-5">
          {/* Platform */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Platform <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition ${
                    platform === p
                      ? "bg-blue-600/10 border-blue-500 text-blue-600 dark:text-blue-400"
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Niche */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Niche <span className="text-red-400">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {NICHES.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNiche(n)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition ${
                    niche === n
                      ? "bg-blue-600/10 border-blue-500 text-blue-600 dark:text-blue-400"
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            {niche === "Other" && (
              <input
                type="text"
                value={customNiche}
                onChange={(e) => setCustomNiche(e.target.value)}
                placeholder="Enter your niche"
                className="mt-2 w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            )}
          </div>

          {/* Target Audience (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Target audience{" "}
              <span className="text-gray-400 dark:text-gray-600 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. Women 25-34 interested in skincare"
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Product / Offer (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Product or offer{" "}
              <span className="text-gray-400 dark:text-gray-600 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={productOffer}
              onChange={(e) => setProductOffer(e.target.value)}
              placeholder="e.g. 20% off summer collection"
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>
      </section>

      {/* Step 3: Analyze */}
      <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold">
            3
          </span>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Get your analysis</h2>
        </div>

        {noCredits ? (
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 mb-4">
            <p className="text-yellow-400 text-sm font-medium mb-1">
              No credits remaining
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
              You&apos;ve used all your free analyses. Upgrade to Pro for unlimited access.
            </p>
            <button
              onClick={() => router.push("/settings")}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-medium rounded-lg transition"
            >
              Upgrade to Pro
            </button>
          </div>
        ) : error ? (
          <div className="bg-red-400/5 border border-red-400/20 rounded-lg px-4 py-3 mb-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86l-8.58 14.86A1 1 0 002.59 20h18.82a1 1 0 00.88-1.28L13.71 3.86a1 1 0 00-1.42 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-red-400">{error}</p>
              <button
                onClick={() => { setError(""); handleAnalyze(); }}
                className="text-xs text-red-400/70 hover:text-red-300 underline mt-1 transition"
              >
                Try again
              </button>
            </div>
          </div>
        ) : null}

        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze || analyzing}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {analyzing ? (
            <>
              <svg
                className="animate-spin w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              {progressMsg || "Analyzing your ad..."}
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Analyze Ad
            </>
          )}
        </button>

        {analyzing && progressMsg && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center animate-pulse-subtle">
            {progressMsg}
          </p>
        )}

        {!canAnalyze && !analyzing && (
          <p className="text-xs text-gray-400 dark:text-gray-600 text-center mt-2">
            Upload an image and select platform + niche to continue.
          </p>
        )}
      </section>
    </div>
  );
}
