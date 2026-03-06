"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";

const FEATURE_LINKS = [
  { label: "Ad Analysis",        href: "#features",          icon: "📊" },
  { label: "AI Ad Improver",     href: "#ai-improver",       icon: "✨" },
  { label: "A/B Compare",        href: "#ab-compare",        icon: "⚔️" },
  { label: "Competitor Spy",     href: "#competitor-spy",    icon: "🕵️" },
  { label: "Swipe File",         href: "#swipe-file",        icon: "📂" },
  { label: "Generate from URL",  href: "#generate-from-url", icon: "🔗" },
  { label: "Performance Tracker",href: "#tracker",           icon: "📈" },
];

const NAV_LINKS = [
  { label: "Pricing",      href: "#pricing"  },
  { label: "How It Works", href: "#workflow" },
];

export default function ClientNavbar() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);

  useEffect(() => {
    const fn = () => setSolid(window.scrollY > 16);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          solid
            ? "bg-[#F8FAFC]/95 dark:bg-[#09090B]/95 backdrop-blur-md border-b border-slate-100 dark:border-white/[0.06] shadow-sm dark:shadow-none"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect width="22" height="22" rx="5" fill="#22C55E" />
              <path d="M11.5 4L5 12h6.5L10 18l7-10H10.5L11.5 4z" fill="white" strokeLinejoin="round" />
            </svg>
            <span className="text-[15px] font-bold text-slate-900 dark:text-white tracking-tight leading-none">
              AdScore
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {/* Features dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setFeaturesOpen(true)}
              onMouseLeave={() => setFeaturesOpen(false)}
            >
              <button className="flex items-center gap-1 text-[13px] text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors duration-150">
                Features
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${featuresOpen ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {featuresOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white dark:bg-zinc-950 border border-slate-100 dark:border-white/[0.08] rounded-xl shadow-xl dark:shadow-black/60 overflow-hidden py-1"
                  >
                    {FEATURE_LINKS.map((f) => (
                      <a
                        key={f.href}
                        href={f.href}
                        onClick={() => setFeaturesOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors"
                      >
                        <span className="text-[14px]">{f.icon}</span>
                        {f.label}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-[13px] text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors duration-150"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-[13px] text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors duration-150"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 text-[13px] px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-zinc-900 font-semibold rounded-lg hover:bg-slate-800 dark:hover:bg-zinc-100 transition-colors duration-150 shadow-sm"
            >
              Start Free
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={() => setOpen(!open)}
              className="p-2 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {open
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/70"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-80 bg-white dark:bg-zinc-950 border-l border-black/[0.06] dark:border-white/[0.06] flex flex-col"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-black/[0.06] dark:border-white/[0.06]">
                <span className="text-sm font-semibold text-zinc-900 dark:text-white">Menu</span>
                <button onClick={() => setOpen(false)} className="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 px-6 py-4 overflow-y-auto">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3 mt-1">Features</p>
                {FEATURE_LINKS.map((f) => (
                  <a
                    key={f.href}
                    href={f.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 py-2.5 text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white border-b border-black/[0.04] dark:border-white/[0.04] transition-colors last:border-0"
                  >
                    <span>{f.icon}</span>
                    {f.label}
                  </a>
                ))}

                <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3 mt-6">Navigation</p>
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center py-2.5 text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white border-b border-black/[0.04] dark:border-white/[0.04] transition-colors last:border-0"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>

              <div className="px-6 pb-8 space-y-3 border-t border-black/[0.06] dark:border-white/[0.06] pt-4">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block text-center py-3 text-sm text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-white/[0.08] rounded-lg hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/[0.16] transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="block text-center py-3 text-sm font-semibold bg-slate-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg hover:bg-slate-800 dark:hover:bg-zinc-100 transition-colors"
                >
                  Start Free
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
