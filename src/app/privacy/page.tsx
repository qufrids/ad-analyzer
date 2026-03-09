import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — AdScore AI",
  description: "Privacy Policy for AdScore AI",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "March 9, 2026";
  const email = "privacy@adspk.com";
  const appUrl = "https://adspk.vercel.app";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Nav */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            AdScore AI
          </Link>
          <Link
            href="/login"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
          >
            Sign in
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-10">Last updated: {lastUpdated}</p>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">1. Introduction</h2>
            <p>
              AdScore AI (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the website{" "}
              <a href={appUrl} className="text-blue-600 dark:text-blue-400">{appUrl}</a>{" "}
              (the &quot;Service&quot;). This Privacy Policy explains how we collect, use, and protect your personal
              information when you use our Service.
            </p>
            <p className="mt-3">
              By using AdScore AI, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">2. Information We Collect</h2>
            <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Information you provide:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Name and email address when you create an account</li>
              <li>Ad images you upload for analysis</li>
              <li>Platform, niche, and campaign details you enter</li>
              <li>Payment information (processed securely by Stripe — we never store card details)</li>
            </ul>
            <p className="font-medium text-gray-800 dark:text-gray-200 mb-2 mt-4">Information collected automatically:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Log data (IP address, browser type, pages visited, time spent)</li>
              <li>Cookies and similar tracking technologies</li>
              <li>Device information</li>
            </ul>
            <p className="font-medium text-gray-800 dark:text-gray-200 mb-2 mt-4">Information from third-party sign-in (Google, Apple, Facebook):</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Name and email address provided by the OAuth provider</li>
              <li>Profile picture (if provided by the OAuth provider)</li>
              <li>We do not receive your password from these providers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To provide, maintain, and improve our Service</li>
              <li>To process your ad images through AI analysis</li>
              <li>To manage your account and subscription</li>
              <li>To send transactional emails (receipts, account alerts)</li>
              <li>To respond to your support requests</li>
              <li>To detect and prevent fraud or abuse</li>
              <li>To comply with legal obligations</li>
            </ul>
            <p className="mt-3">
              We do not sell your personal data to third parties. We do not use your uploaded ad images to train AI models.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">4. Data Sharing</h2>
            <p>We share your data only with trusted service providers necessary to operate our Service:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Supabase</strong> — database and authentication hosting</li>
              <li><strong>Anthropic</strong> — AI analysis of your ad images (images are processed and not stored by Anthropic)</li>
              <li><strong>OpenAI</strong> — AI image generation (when using the AI Improver feature)</li>
              <li><strong>Stripe</strong> — payment processing</li>
              <li><strong>Vercel</strong> — website hosting</li>
            </ul>
            <p className="mt-3">
              We may disclose your information if required by law or to protect our legal rights.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">5. Data Retention</h2>
            <p>
              We retain your account data for as long as your account is active. Uploaded ad images are stored securely
              and associated with your account. You may delete your account and all associated data at any time from
              the Settings page. Upon deletion, your data is permanently removed within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">6. Cookies</h2>
            <p>
              We use cookies and similar technologies to maintain your login session and improve your experience.
              These are essential cookies required for the Service to function. You can control cookies through
              your browser settings, but disabling them may affect Service functionality.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">7. Security</h2>
            <p>
              We implement industry-standard security measures including HTTPS encryption, secure authentication,
              and access controls. However, no method of transmission over the internet is 100% secure.
              We encourage you to use a strong, unique password for your account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">8. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and associated data</li>
              <li>Export your data</li>
              <li>Withdraw consent for data processing</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, contact us at{" "}
              <a href={`mailto:${email}`} className="text-blue-600 dark:text-blue-400">{email}</a>{" "}
              or use the account deletion option in Settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">9. Children&apos;s Privacy</h2>
            <p>
              AdScore AI is not directed to children under 13. We do not knowingly collect personal information
              from children under 13. If you believe a child has provided us with personal information, please
              contact us and we will delete it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant changes by
              posting the new policy on this page and updating the &quot;Last updated&quot; date. Continued use of
              the Service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white">AdScore AI</p>
              <p>Email: <a href={`mailto:${email}`} className="text-blue-600 dark:text-blue-400">{email}</a></p>
              <p>Website: <a href={appUrl} className="text-blue-600 dark:text-blue-400">{appUrl}</a></p>
            </div>
          </section>

        </div>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 mt-16">
        <div className="max-w-3xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} AdScore AI. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gray-900 dark:hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-900 dark:hover:text-white transition">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
