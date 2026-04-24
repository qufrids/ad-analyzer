"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ─── Nav data ─── */

const FEATURES_NAV = [
  {
    label: "Ad Analysis",
    desc:  "Score any creative 0–100 across 6 dimensions",
    href:  "#feature-analysis",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    label: "AI Improver",
    desc:  "Fix weak ads with one-click AI rewrites",
    href:  "#feature-improver",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    label: "A/B Compare",
    desc:  "Upload two ads — AI picks the winner",
    href:  "#feature-ab",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    label: "Competitor Spy",
    desc:  "Decode any competitor ad and counter it",
    href:  "#feature-competitor",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    label: "Performance Tracker",
    desc:  "Track creative score trends over time",
    href:  "#feature-tracker",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    label: "URL to Ads",
    desc:  "Paste a product URL, get complete ad copy",
    href:  "#feature-url",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  },
];

const ADVERTISERS_NAV = [
  {
    label: "Media Buyers",
    desc:  "Pre-qualify creatives and cut dud rate before spend",
    href:  "#for-media-buyers",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
      </svg>
    ),
  },
  {
    label: "Performance Marketers",
    desc:  "Replace gut-feel with data-driven creative decisions",
    href:  "#for-marketers",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    label: "DTC Brands",
    desc:  "Scale winning creatives faster, reduce ad waste",
    href:  "#for-dtc",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    label: "Agencies",
    desc:  "Creative QA at scale across every client account",
    href:  "#for-agencies",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
];

const RESOURCES_NAV = [
  { label: "Blog",          href: "#", badge: "Soon" },
  { label: "Help Center",   href: "#", badge: "Soon" },
  { label: "Documentation", href: "#", badge: "Soon" },
];

/* ─── Rich dropdown (icon + title + description) ─── */
interface RichItem {
  label: string;
  desc:  string;
  href:  string;
  icon:  React.ReactNode;
}

function RichDropdown({ label, items, width = 300 }: {
  label: string;
  items: RichItem[];
  width?: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        aria-expanded={open}
        className={`flex items-center gap-1 text-[15px] font-medium transition-colors duration-150 ${
          open ? "text-[#4F46E5]" : "text-[#334155] hover:text-[#4F46E5]"
        }`}
      >
        {label}
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white border border-[#E2E8F0] rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.10)] overflow-hidden z-50 py-2"
          style={{ width: `${width}px` }}
        >
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="group flex items-start gap-3 px-4 py-3 hover:bg-[#F8FAFC] transition-colors duration-100"
            >
              {/* Icon box */}
              <div className="w-9 h-9 rounded-[8px] bg-[#EEF2FF] flex items-center justify-center shrink-0 mt-0.5 text-[#4F46E5] group-hover:bg-[#E0E7FF] transition-colors">
                {item.icon}
              </div>
              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#0F172A] group-hover:text-[#4F46E5] transition-colors leading-tight mb-0.5">
                  {item.label}
                </p>
                <p className="text-[12px] text-[#64748B] leading-relaxed">{item.desc}</p>
              </div>
              {/* Arrow */}
              <svg
                className="w-3.5 h-3.5 text-[#CBD5E1] group-hover:text-[#4F46E5] shrink-0 mt-1 transition-colors"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Simple dropdown (Resources — badge style) ─── */
function SimpleDropdown({ label, items }: {
  label: string;
  items: { label: string; href: string; badge?: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        aria-expanded={open}
        className={`flex items-center gap-1 text-[15px] font-medium transition-colors duration-150 ${
          open ? "text-[#4F46E5]" : "text-[#334155] hover:text-[#4F46E5]"
        }`}
      >
        {label}
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 bg-white border border-[#E2E8F0] rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.10)] overflow-hidden z-50 py-2">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-4 py-2.5 text-[14px] text-[#334155] hover:text-[#4F46E5] hover:bg-[#F8FAFC] transition-colors"
            >
              {item.label}
              {item.badge && (
                <span className="text-[11px] font-semibold text-[#4F46E5] bg-[#EEF2FF] px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Navbar ─── */
export default function ClientNavbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const close = () => setMobileOpen(false);

  return (
    <>
      {/* ── Header ── */}
      <header
        style={{ fontFamily: "var(--font-inter,'Inter',system-ui,sans-serif)" }}
        className={`fixed inset-x-0 top-0 z-50 bg-white transition-all duration-300 ${
          scrolled ? "border-b border-[#E2E8F0]" : ""
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-14 md:h-[72px] flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <span className="w-8 h-8 bg-[#4F46E5] rounded-[8px] flex items-center justify-center shadow-sm">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8.5 2L3.5 9H8L7 14L12.5 7H8.5Z" fill="white" />
              </svg>
            </span>
            <span className="text-[18px] md:text-[16px] font-bold text-[#0F172A] tracking-tight">AdScore</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            <RichDropdown label="For Advertisers" items={ADVERTISERS_NAV} width={310} />
            <RichDropdown label="Features"        items={FEATURES_NAV}   width={310} />
            <a href="#pricing" className="text-[15px] font-medium text-[#334155] hover:text-[#4F46E5] transition-colors">
              Pricing
            </a>
            <SimpleDropdown label="Resources" items={RESOURCES_NAV} />
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-[15px] font-medium text-[#334155] hover:text-[#4F46E5] transition-colors">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-[14px] px-5 py-2.5 rounded-[8px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-all duration-150"
            >
              Get Started
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 -mr-1 text-[#334155]"
            aria-label="Open menu"
            style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>
      </header>

      {/* ── Mobile full-screen overlay ── */}
      <div
        style={{ fontFamily: "var(--font-inter,'Inter',system-ui,sans-serif)" }}
        className={`fixed inset-0 z-[60] bg-white flex flex-col md:hidden transition-all duration-300 ease-in-out ${
          mobileOpen
            ? "translate-x-0 opacity-100 pointer-events-auto"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
        aria-modal="true"
        aria-hidden={!mobileOpen}
      >
        {/* Top bar */}
        <div className="h-14 flex items-center justify-between px-6 border-b border-[#F1F5F9] shrink-0">
          <Link href="/" onClick={close} className="flex items-center gap-2.5">
            <span className="w-8 h-8 bg-[#4F46E5] rounded-[8px] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8.5 2L3.5 9H8L7 14L12.5 7H8.5Z" fill="white" />
              </svg>
            </span>
            <span className="text-[18px] font-bold text-[#0F172A]">AdScore</span>
          </Link>
          <button
            onClick={close}
            className="p-2 -mr-1 text-[#64748B]"
            aria-label="Close menu"
            style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable links */}
        <nav className="flex-1 overflow-y-auto">

          {/* Features */}
          <div className="px-6 pt-4 pb-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#94A3B8] mb-1">Features</p>
          </div>
          {FEATURES_NAV.map((f, i) => (
            <a
              key={f.label}
              href={f.href}
              onClick={close}
              style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}
              className={`flex items-center gap-4 px-6 py-3.5 text-[17px] font-medium text-[#334155] ${
                i < FEATURES_NAV.length - 1 ? "border-b border-[#F8FAFC]" : ""
              }`}
            >
              <span className="w-9 h-9 bg-[#EEF2FF] rounded-[8px] flex items-center justify-center text-[#4F46E5] shrink-0">
                {f.icon}
              </span>
              <span className="flex-1">{f.label}</span>
            </a>
          ))}

          {/* Who it's for */}
          <div className="h-px bg-[#E2E8F0] mx-6 my-3" />
          <div className="px-6 pt-1 pb-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#94A3B8] mb-1">Who it&apos;s for</p>
          </div>
          {ADVERTISERS_NAV.map((a, i) => (
            <a
              key={a.label}
              href={a.href}
              onClick={close}
              style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}
              className={`flex items-center gap-4 px-6 py-3.5 text-[17px] font-medium text-[#334155] ${
                i < ADVERTISERS_NAV.length - 1 ? "border-b border-[#F8FAFC]" : ""
              }`}
            >
              <span className="w-9 h-9 bg-[#EEF2FF] rounded-[8px] flex items-center justify-center text-[#4F46E5] shrink-0">
                {a.icon}
              </span>
              <span className="flex-1">{a.label}</span>
            </a>
          ))}

          {/* Pricing / Sign In */}
          <div className="h-px bg-[#E2E8F0] mx-6 my-3" />
          <a
            href="#pricing"
            onClick={close}
            style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}
            className="flex items-center px-6 h-[52px] text-[18px] font-medium text-[#334155] border-b border-[#F8FAFC]"
          >
            Pricing
          </a>
          <Link
            href="/login"
            onClick={close}
            style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}
            className="flex items-center px-6 h-[52px] text-[18px] font-medium text-[#334155]"
          >
            Sign In
          </Link>
        </nav>

        {/* Get Started — pinned bottom */}
        <div className="px-6 pt-4 pb-10 border-t border-[#F1F5F9] shrink-0">
          <Link
            href="/signup"
            onClick={close}
            style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}
            className="flex items-center justify-center gap-2 w-full h-12 text-[16px] font-semibold bg-[#4F46E5] text-white rounded-[10px] transition-colors active:bg-[#4338CA]"
          >
            Get Started →
          </Link>
        </div>
      </div>
    </>
  );
}
