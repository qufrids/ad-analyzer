import Link from "next/link";
import ClientNavbar from "@/components/landing/ClientNavbar";

export default function PublicPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "var(--font-inter,'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif)" }}>
      <ClientNavbar />
      <main className="min-h-screen bg-white pt-14 md:pt-[72px]">
        {children}
      </main>
      <footer className="bg-[#F8FAFC] border-t border-[#E2E8F0] py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-7 h-7 bg-[#4F46E5] rounded-[6px] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8.5 2L3.5 9H8L7 14L12.5 7H8.5Z" fill="white" />
              </svg>
            </span>
            <span className="text-[15px] font-bold text-[#0F172A]">AdScore</span>
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            {[
              { label: "Home",    href: "/" },
              { label: "Privacy", href: "/privacy" },
              { label: "Terms",   href: "/terms" },
              { label: "Contact", href: "/contact" },
              { label: "Help",    href: "/help" },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-[13px] text-[#64748B] hover:text-[#4F46E5] transition-colors duration-150"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <p className="text-[13px] text-[#94A3B8]">© 2026 AdScore AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
