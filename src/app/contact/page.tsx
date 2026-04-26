import type { Metadata } from "next";
import Link from "next/link";
import PublicPageLayout from "@/components/PublicPageLayout";

export const metadata: Metadata = {
  title: "Contact — AdScore AI",
  description: "Get in touch with the AdScore AI team. We're here to help.",
};

export default function ContactPage() {
  return (
    <PublicPageLayout>
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[14px] text-[#64748B] hover:text-[#4F46E5] transition-colors mb-10"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-12">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#4F46E5] bg-[#EEF2FF] border border-[#E0E7FF] px-3 py-1 rounded-full mb-4">
            CONTACT
          </span>
          <h1 className="text-[36px] md:text-[44px] font-bold text-[#0F172A] leading-tight tracking-tight mb-4">
            We&apos;re here to help.
          </h1>
          <p className="text-[18px] text-[#64748B] leading-[1.7]">
            Have a question, found a bug, or want to explore a custom plan for your team?
            Reach out — we respond to every message.
          </p>
        </div>

        {/* Contact options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {/* Email */}
          <div className="p-6 bg-white border border-[#E2E8F0] rounded-[16px]">
            <div className="w-10 h-10 bg-[#EEF2FF] rounded-[10px] flex items-center justify-center text-[#4F46E5] mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-[15px] font-semibold text-[#0F172A] mb-1">Email Support</p>
            <p className="text-[14px] text-[#64748B] mb-3">For general questions, billing, and bugs.</p>
            <a
              href="mailto:support@adscore.ai"
              className="text-[14px] font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors"
            >
              support@adscore.ai →
            </a>
          </div>

          {/* Response time */}
          <div className="p-6 bg-white border border-[#E2E8F0] rounded-[16px]">
            <div className="w-10 h-10 bg-[#EEF2FF] rounded-[10px] flex items-center justify-center text-[#4F46E5] mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-[15px] font-semibold text-[#0F172A] mb-1">Response Time</p>
            <p className="text-[14px] text-[#64748B] mb-3">We aim to respond within 24 hours, Monday–Friday.</p>
            <p className="text-[13px] text-[#94A3B8]">Pro & Agency users get priority support.</p>
          </div>
        </div>

        {/* Contact form */}
        <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 md:p-8 mb-10">
          <h2 className="text-[20px] font-bold text-[#0F172A] mb-6">Send us a message</h2>
          <form
            action="mailto:support@adscore.ai"
            method="post"
            encType="text/plain"
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#334155] mb-1.5">Your name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Jane Smith"
                  required
                  className="w-full px-4 py-3 text-[15px] text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#EEF2FF] transition-all placeholder:text-[#94A3B8]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#334155] mb-1.5">Email address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="jane@company.com"
                  required
                  className="w-full px-4 py-3 text-[15px] text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#EEF2FF] transition-all placeholder:text-[#94A3B8]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#334155] mb-1.5">Subject</label>
              <input
                type="text"
                name="subject"
                placeholder="Question about billing / Feature request / Bug report"
                className="w-full px-4 py-3 text-[15px] text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#EEF2FF] transition-all placeholder:text-[#94A3B8]"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#334155] mb-1.5">Message</label>
              <textarea
                name="message"
                rows={5}
                placeholder="Describe your question or issue in detail..."
                required
                className="w-full px-4 py-3 text-[15px] text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#EEF2FF] transition-all resize-none placeholder:text-[#94A3B8]"
              />
            </div>

            <button
              type="submit"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-[15px] px-8 py-3 rounded-[8px] transition-colors duration-150"
            >
              Send message →
            </button>
          </form>
          <p className="text-[13px] text-[#94A3B8] mt-4">
            Or email us directly at{" "}
            <a href="mailto:support@adscore.ai" className="text-[#4F46E5] hover:underline">
              support@adscore.ai
            </a>
          </p>
        </div>

        {/* Help links */}
        <div className="border-t border-[#E2E8F0] pt-8">
          <p className="text-[14px] text-[#64748B] mb-4">Looking for quick answers?</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/help" className="text-[14px] font-medium text-[#4F46E5] hover:text-[#4338CA] transition-colors">
              Help Center →
            </Link>
            <Link href="/#faq" className="text-[14px] font-medium text-[#4F46E5] hover:text-[#4338CA] transition-colors">
              FAQ →
            </Link>
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
}
