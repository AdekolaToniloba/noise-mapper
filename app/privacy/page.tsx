// app/privacy/page.tsx
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Noise Map | How We Protect Your Data",
  description:
    "Learn how Noise Map collects, uses, and protects your personal information while helping you find quiet spaces in the city.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent"
            >
              Noise Map
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/map"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Open Map
              </Link>
              <Link
                href="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Privacy Policy
          </h1>
          <p className="text-gray-600 mb-8">Last updated: January 2024</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-600 leading-relaxed">
                At Noise Map (&quot;we,&quot; &quot;our,&quot; or
                &quot;us&quot;), we are committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you use our website and mobile
                application.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Information We Collect
              </h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                2.1 Information You Provide
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>
                  <strong>Account Information:</strong> Email address, name, and
                  profile picture (if provided)
                </li>
                <li>
                  <strong>Noise Reports:</strong> Decibel levels and timestamps
                  of your submissions
                </li>
                <li>
                  <strong>Preferences:</strong> Your notification settings and
                  saved locations
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">
                2.2 Information Collected Automatically
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>
                  <strong>Location Data:</strong> GPS coordinates when you
                  submit noise reports (only when you grant permission)
                </li>
                <li>
                  <strong>Device Information:</strong> Device type, operating
                  system, and browser type
                </li>
                <li>
                  <strong>Usage Data:</strong> How you interact with our
                  services, including pages visited and features used
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-gray-600 mb-3">
                We use the collected information to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Provide and maintain our noise mapping services</li>
                <li>Display noise levels and quiet routes on our maps</li>
                <li>
                  Send you notifications about noise levels in your saved
                  locations (if enabled)
                </li>
                <li>Improve our services and develop new features</li>
                <li>
                  Respond to your comments, questions, and support requests
                </li>
                <li>Detect, prevent, and address technical issues</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Data Sharing and Disclosure
              </h2>
              <p className="text-gray-600 mb-3">
                We do not sell, trade, or rent your personal information. We may
                share your information only in the following situations:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>
                  <strong>Aggregated Data:</strong> We may share anonymized,
                  aggregated noise data with researchers and city planners
                </li>
                <li>
                  <strong>Service Providers:</strong> With third-party vendors
                  who assist in operating our services
                </li>
                <li>
                  <strong>Legal Requirements:</strong> If required by law or to
                  protect our rights and safety
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with a
                  merger, acquisition, or sale of assets
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Data Security
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We implement appropriate technical and organizational security
                measures to protect your personal information against
                unauthorized access, alteration, disclosure, or destruction.
                These measures include encryption, secure servers, and regular
                security assessments.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Your Rights and Choices
              </h2>
              <p className="text-gray-600 mb-3">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Access and receive a copy of your personal data</li>
                <li>Correct or update your personal information</li>
                <li>Delete your account and associated data</li>
                <li>Opt-out of notifications and marketing communications</li>
                <li>Withdraw consent for location services at any time</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Data Retention
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We retain your personal information only for as long as
                necessary to provide our services and fulfill the purposes
                outlined in this policy. Noise report data is anonymized after
                90 days. Account information is retained until you delete your
                account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Children&apos;s Privacy
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Our services are not intended for children under 13 years of
                age. We do not knowingly collect personal information from
                children under 13. If you believe we have collected information
                from a child under 13, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. International Data Transfers
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Your information may be transferred to and processed in
                countries other than your country of residence. We ensure
                appropriate safeguards are in place to protect your information
                in accordance with this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Changes to This Policy
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new policy on this page
                and updating the &quot;Last updated&quot; date. Your continued
                use of our services after changes constitutes acceptance of the
                updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Contact Us
              </h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about this Privacy Policy or our data
                practices, please contact us at:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <p className="text-gray-700">
                  Email:{" "}
                  <a
                    href="mailto:admin@noisemap.xyz"
                    className="text-blue-600 hover:underline"
                  >
                    admin@noisemap.xyz
                  </a>
                  <br />
                  Website:{" "}
                  <a
                    href="https://www.noisemap.xyz"
                    className="text-blue-600 hover:underline"
                  >
                    www.noisemap.xyz
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Noise Map</h4>
              <p className="text-sm">Find your quiet in the city</p>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Features</h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/map" className="hover:text-white">
                    Interactive Map
                  </Link>
                </li>
                <li>
                  <Link href="/quiet-routes" className="hover:text-white">
                    Quiet Routes
                  </Link>
                </li>
                <li>
                  <Link href="/map" className="hover:text-white">
                    Report Noise
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Connect</h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="mailto:admin@noisemap.xyz"
                    className="hover:text-white"
                  >
                    admin@noisemap.xyz
                  </a>
                </li>
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            <p>&copy; 2024 Noise Map. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
