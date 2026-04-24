"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const FOR_ADVERTISERS = [
  { label: "Media Buyers",          href: "#hero" },
  { label: "Performance Marketers", href: "#hero" },
  { label: "DTC Brands",            href: "#hero" },
  { label: "Agencies",              href: "#hero" },
];

const FEATURE_LINKS = [
  { label: "Ad Analysis",         href: "#features", icon: "📊" },
  { label: "AI Improver",         href: "#features", icon: "✨" },
  { label: "A/B Compare",         href: "#features", icon: "⚔️" },
  { label: "Competitor Spy",      href: "#features", icon: "🕵️" },
  { label: "Performance Tracker", href: "#features", icon: "📈" },
];

const RESOURCES_LINKS = [
  { label: "Blog",          href: "#", badge: "Soon" },
  { label: "Help Center",   href: "#", badge: "Soon" },
  { label: "Documentation", href: "#", badge: "Soon" },
];

/* ── Desktop dropdown ── */
function Dropdown({ label, items }: {
  label: string;
  items: { label: string; href: string; badge?: string; icon?: string }[];
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
        className="flex items-center gap-1 text-[15px] font-medium text-[#334155] hover:text-[#4F46E5] transition-colors duration-150"
        aria-expanded={open}
      >
        {label}
        <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 bg-white border border-[#E2E8F0] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] overflow-hidden py-1.5 z-50">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between gap-2 px-4 py-2.5 text-[14px] text-[#334155] hover:text-[#4F46E5] hover:bg-[#F8FAFC] transition-colors"
            >
              <span className="flex items-center gap-2.5">
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </span>
              {item.badge && (
                <span className="text-[11px] font-semibold text-[#4F46E5] bg-[#EEF2FF] px-2 py-0.5 rounded-full">{item.badge}</span>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Navbar ── */
export default function ClientNavbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
      {/* ── Header bar ── */}
      <header
        style={{ fontFamily: "var(--font-inter,'Inter',system-ui,sans-serif)" }}
        className={`fixed inset-x-0 top-0 z-50 bg-white transition-all duration-300 ${scrolled ? "border-b border-[#E2E8F0]" : ""}`}
      >
        {/* 56px on mobile, 72px on desktop */}
        <nav className="max-w-7xl mx-auto px-6 md:px-6 lg:px-8 h-14 md:h-[72px] flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <span className="w-8 h-8 bg-[#4F46E5] rounded-[8px] flex items-center justify-center shadow-sm">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8.5 2L3.5 9H8L7 14L12.5 7H8.5Z" fill="white" />
              </svg>
            </span>
            <span className="text-[18px] md:text-[16px] font-bold text-[#0F172A] tracking-tight">AdScore</span>
          </Link>

          {/* Desktop center nav */}
          <div className="hidden md:flex items-center gap-7">
            <Dropdown label="For Advertisers" items={FOR_ADVERTISERS} />
            <Dropdown label="Features"        items={FEATURE_LINKS}   />
            <a href="#pricing" className="text-[15px] font-medium text-[#334155] hover:text-[#4F46E5] transition-colors">Pricing</a>
            <Dropdown label="Resources"       items={RESOURCES_LINKS} />
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-[15px] font-medium text-[#334155] hover:text-[#4F46E5] transition-colors">Sign In</Link>
            <Link href="/signup" className="inline-flex items-center gap-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-[14px] px-5 py-2.5 rounded-[8px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-all duration-150">
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

      {/* ── Mobile full-screen overlay ──
           Slides in from right, 0.3s ease */}
      <div
        style={{ fontFamily: "var(--font-inter,'Inter',system-ui,sans-serif)" }}
        className={`fixed inset-0 z-[60] bg-white flex flex-col md:hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0 opacity-100 pointer-events-auto" : "translate-x-full opacity-0 pointer-events-none"
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

        {/* Nav links — centered, stacked */}
        <nav className="flex-1 overflow-y-auto px-6 py-4">
          {/* Features */}
          {FEATURE_LINKS.map((f, i) => (
            <a
              key={f.label}
              href={f.href}
              onClick={close}
              style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}
              className={`flex items-center gap-4 text-[18px] font-medium text-[#334155] py-4 text-center justify-center ${
                i < FEATURE_LINKS.length - 1 ? "border-b border-[#F1F5F9]" : ""
              }`}
            >
              <span className="w-5 text-center text-[16px]">{f.icon}</span>
              {f.label}
            </a>
          ))}

          {/* Divider */}
          <div className="h-px bg-[#E2E8F0] my-3" />

          {/* Pricing + Sign In */}
          <a
            href="#pricing"
            onClick={close}
            style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}
            className="flex items-center justify-center text-[18px] font-medium text-[#334155] py-4 border-b border-[#F1F5F9]"
          >
            Pricing
          </a>
          <Link
            href="/login"
            onClick={close}
            style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}
            className="flex items-center justify-center text-[18px] font-medium text-[#334155] py-4"
          >
            Sign In
          </Link>
        </nav>

        {/* Get Started CTA — pinned bottom */}
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
