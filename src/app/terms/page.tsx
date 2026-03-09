import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — AdScore AI",
  description: "Terms of Service for AdScore AI",
};

export default function TermsPage() {
  const lastUpdated = "March 9, 2026";
  const email = "support@adspk.com";
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-10">Last updated: {lastUpdated}</p>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using AdScore AI at{" "}
              <a href={appUrl} className="text-blue-600 dark:text-blue-400">{appUrl}</a>,
              you agree to be bound by these Terms of Service. If you do not agree to these terms,
              please do not use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">2. Description of Service</h2>
            <p>
              AdScore AI is an AI-powered advertising creative analysis platform that helps users evaluate,
              improve, and optimize their ad creatives. Features include ad scoring, copy improvement,
              competitor analysis, A/B comparison, and AI image generation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">3. Account Registration</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>You must provide accurate and complete information when creating an account</li>
              <li>You are responsible for maintaining the security of your account credentials</li>
              <li>You must be at least 13 years old to use this Service</li>
              <li>One person may not maintain more than one free account</li>
              <li>You are responsible for all activity that occurs under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Upload content that infringes on any third party&apos;s intellectual property rights</li>
              <li>Upload illegal, harmful, threatening, or offensive content</li>
              <li>Attempt to reverse engineer, hack, or disrupt the Service</li>
              <li>Use the Service for any unlawful purpose</li>
              <li>Resell or redistribute the Service without authorization</li>
              <li>Use automated tools to scrape or abuse the Service</li>
              <li>Upload content that violates advertising platform policies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">5. Intellectual Property</h2>
            <p>
              You retain ownership of the ad images and content you upload. By uploading content, you grant
              AdScore AI a limited, non-exclusive license to process that content solely for the purpose
              of providing the Service to you.
            </p>
            <p className="mt-3">
              The AdScore AI platform, including its design, code, and AI-generated outputs, is owned by
              AdScore AI and protected by intellectual property laws. AI-generated analysis results and
              improved copy are provided for your use in connection with your advertising activities.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">6. Subscription and Payments</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Free accounts include a limited number of analysis credits</li>
              <li>Pro subscriptions are billed monthly at the listed price</li>
              <li>Payments are processed securely by Stripe</li>
              <li>Subscriptions automatically renew unless cancelled</li>
              <li>You may cancel your subscription at any time from the Settings page</li>
              <li>Refunds are issued at our discretion — contact us within 7 days of a charge for consideration</li>
              <li>We reserve the right to change pricing with 30 days notice</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">7. AI-Generated Content Disclaimer</h2>
            <p>
              AdScore AI uses artificial intelligence to generate analysis, copy suggestions, and images.
              AI-generated content is provided &quot;as is&quot; for informational and creative purposes only.
              You are solely responsible for reviewing, editing, and deciding whether to use any
              AI-generated content. We make no guarantees about the accuracy, effectiveness, or
              appropriateness of AI outputs for your specific use case.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">8. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, AdScore AI shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, including but not limited to loss
              of profits, data, or goodwill, arising from your use of the Service.
            </p>
            <p className="mt-3">
              Our total liability to you for any claims arising from these Terms shall not exceed the
              amount you paid to us in the 12 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">9. Disclaimer of Warranties</h2>
            <p>
              The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind,
              either express or implied. We do not warrant that the Service will be uninterrupted,
              error-free, or that any particular results will be achieved from use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">10. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account at any time for violation of
              these Terms or for any other reason at our discretion. You may delete your account at
              any time from the Settings page. Upon termination, your right to use the Service ceases
              immediately.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">11. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. We will notify you of material changes by
              posting the updated Terms on this page. Continued use of the Service after changes
              constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with applicable laws.
              Any disputes shall be resolved through binding arbitration or in courts of competent jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">13. Contact Us</h2>
            <p>
              For questions about these Terms, please contact us at:
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
