"use client";

import { useState } from "react";
import { signInWithOAuth } from "@/lib/supabase/auth";

type Provider = "google" | "azure";

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

const PROVIDERS: {
  id: Provider;
  label: string;
  icon: React.ReactNode;
  className: string;
}[] = [
  {
    id: "google",
    label: "Google",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className="shrink-0">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
    className:
      "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm",
  },
  {
    id: "azure",
    label: "Microsoft",
    icon: (
      <svg viewBox="0 0 21 21" width="20" height="20" aria-hidden="true" className="shrink-0">
        <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
        <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
        <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
        <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
      </svg>
    ),
    className:
      "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm",
  },
];

export default function OAuthButtons() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<Provider | null>(null);

  async function handleOAuth(provider: Provider) {
    setError("");
    setLoading(provider);
    const err = await signInWithOAuth(provider);
    if (err) {
      const name = provider.charAt(0).toUpperCase() + provider.slice(1);
      setError(`${name} login failed. Please try again.`);
      setLoading(null);
    }
  }

  return (
    <div className="mt-5">
      {/* Divider */}
      <div className="relative mb-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-white dark:bg-gray-950 text-[11px] font-medium tracking-wide text-gray-400 dark:text-gray-500 uppercase">
            or continue with
          </span>
        </div>
      </div>

      {/* 3-column button grid */}
      <div className="flex items-center justify-center gap-4">
        {PROVIDERS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => handleOAuth(p.id)}
            disabled={!!loading}
            title={p.label}
            className={`
              w-12 h-12 flex items-center justify-center rounded-full
              transition-all duration-150
              disabled:opacity-50 disabled:cursor-not-allowed
              ${p.className}
            `}
          >
            {loading === p.id ? <Spinner /> : p.icon}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-400/10 border border-red-200 dark:border-red-400/20 rounded-lg px-3 py-2 text-center">
          {error}
        </p>
      )}
    </div>
  );
}
