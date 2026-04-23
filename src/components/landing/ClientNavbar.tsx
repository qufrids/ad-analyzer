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
  { label: "Ad Analysis",          href: "#features", icon: "📊" },
  { label: "AI Improver",          href: "#features", icon: "✨" },
  { label: "A/B Compare",          href: "#features", icon: "⚔️" },
  { label: "Competitor Spy",       href: "#features", icon: "🕵️" },
  { label: "Performance Tracker",  href: "#features", icon: "📈" },
];

const RESOURCES_LINKS = [
  { label: "Blog",          href: "#", badge: "Soon" },
  { label: "Help Center",   href: "#", badge: "Soon" },
  { label: "Documentation", href: "#", badge: "Soon" },
];

function Dropdown({
  label,
  items,
}: {
  label: string;
  items: { label: string; href: string; badge?: string; icon?: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="flex items-center gap-1 text-[15px] font-medium text-[#334155] hover:text-[#4F46E5] transition-colors duration-150"
        aria-expanded={open}
      >
        {label}
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
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
              className="flex items-center justify-between gap-2 px-4 py-2.5 text-[14px] text-[#334155] hover:text-[#4F46E5] hover:bg-[#F8FAFC] transition-colors duration-100"
            >
              <span className="flex items-center gap-2.5">
                {item.icon && <span className="text-[15px]">{item.icon}</span>}
                {item.label}
              </span>
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

export default function ClientNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        style={{ fontFamily: "var(--font-inter, 'Inter', system-ui, sans-serif)" }}
        className={`fixed inset-x-0 top-0 z-50 bg-white transition-all duration-300 ${
          scrolled ? "border-b border-[#E2E8F0]" : ""
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <span className="w-8 h-8 bg-[#4F46E5] rounded-[8px] flex items-center justify-center shadow-sm">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8.5 2L3.5 9H8L7 14L12.5 7H8.5L8.5 2Z" fill="white" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-[16px] font-bold text-[#0F172A] tracking-tight">AdScore</span>
          </Link>

          {/* Desktop center nav */}
          <div className="hidden md:flex items-center gap-7">
            <Dropdown label="For Advertisers" items={FOR_ADVERTISERS} />
            <Dropdown label="Features" items={FEATURE_LINKS} />
            <a
              href="#pricing"
              className="text-[15px] font-medium text-[#334155] hover:text-[#4F46E5] transition-colors duration-150"
            >
              Pricing
            </a>
            <Dropdown label="Resources" items={RESOURCES_LINKS} />
          </div>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-[15px] font-medium text-[#334155] hover:text-[#4F46E5] transition-colors duration-150"
            >
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
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-[#334155] hover:text-[#0F172A] transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        style={{ fontFamily: "var(--font-inter, 'Inter', system-ui, sans-serif)" }}
        className={`fixed top-0 right-0 bottom-0 z-50 w-[300px] bg-white border-l border-[#E2E8F0] flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-[72px] flex items-center justify-between px-6 border-b border-[#E2E8F0]">
          <span className="text-[15px] font-semibold text-[#0F172A]">Menu</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#94A3B8] mb-3">Features</p>
          {FEATURE_LINKS.map((f) => (
            <a
              key={f.href + f.label}
              href={f.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 py-2.5 text-[15px] text-[#334155] hover:text-[#4F46E5] border-b border-[#F1F5F9] last:border-0 transition-colors"
            >
              <span>{f.icon}</span>
              {f.label}
            </a>
          ))}

          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#94A3B8] mb-3 mt-6">Navigation</p>
          <a
            href="#pricing"
            onClick={() => setMobileOpen(false)}
            className="flex items-center py-2.5 text-[15px] text-[#334155] hover:text-[#4F46E5] border-b border-[#F1F5F9] transition-colors"
          >
            Pricing
          </a>
          {RESOURCES_LINKS.map((r) => (
            <a
              key={r.label}
              href={r.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between py-2.5 text-[15px] text-[#334155] hover:text-[#4F46E5] border-b border-[#F1F5F9] last:border-0 transition-colors"
            >
              {r.label}
              {r.badge && (
                <span className="text-[11px] font-semibold text-[#4F46E5] bg-[#EEF2FF] px-2 py-0.5 rounded-full">
                  {r.badge}
                </span>
              )}
            </a>
          ))}
        </div>

        <div className="px-6 pb-8 space-y-3 border-t border-[#E2E8F0] pt-4">
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="block text-center py-3 text-[15px] font-medium text-[#334155] border border-[#E2E8F0] rounded-[8px] hover:bg-[#F8FAFC] transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            onClick={() => setMobileOpen(false)}
            className="block text-center py-3 text-[15px] font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-[8px] transition-colors"
          >
            Get Started →
          </Link>
        </div>
      </div>
    </>
  );
}
