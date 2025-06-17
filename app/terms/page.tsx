// app/terms/page.tsx
import Link from "next/link";
import TermsNav from "./TermsNav";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Noise Map | Terms and Conditions",
  description:
    "Read the terms and conditions for using Noise Map's urban noise mapping and quiet route finding services.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation as a client component */}
      <TermsNav />

      {/* Content */}
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Terms of Service
          </h1>
          <p className="text-gray-600 mb-8">Effective Date: January 2025</p>

          <div className="prose prose-lg max-w-none">
            {/* ...previous sections... */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Disclaimers
              </h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                8.1 Service Availability
              </h3>
              <p className="text-gray-600 leading-relaxed">
                The Service is provided &quot;as is&quot; and &quot;as
                available&quot; without warranties of any kind. We do not
                guarantee that the Service will be uninterrupted, secure, or
                error-free. Your use of the Service is at your sole risk.
              </p>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">
                8.2 No Warranty
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We disclaim all warranties, express or implied, including but
                not limited to merchantability, fitness for a particular
                purpose, and non-infringement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Limitation of Liability
              </h2>
              <p className="text-gray-600 leading-relaxed">
                To the fullest extent permitted by law, Noise Map and its
                affiliates shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages, or any loss of
                profits or revenues, whether incurred directly or indirectly, or
                any loss of data, use, goodwill, or other intangible losses,
                resulting from (a) your use or inability to use the Service; (b)
                any unauthorized access to or use of our servers and/or any
                personal information stored therein; or (c) any other matter
                relating to the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Indemnification
              </h2>
              <p className="text-gray-600 leading-relaxed">
                You agree to indemnify and hold harmless Noise Map, its
                affiliates, and their respective officers, directors, employees,
                and agents from and against any claims, liabilities, damages,
                losses, and expenses, including reasonable attorneys&apos; fees,
                arising out of or in any way connected with your access to or
                use of the Service or your violation of these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Changes to Terms
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to modify or replace these Terms at any
                time. If a revision is material, we will provide reasonable
                notice prior to any new terms taking effect. By continuing to
                access or use the Service after those revisions become
                effective, you agree to be bound by the revised terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                12. Governing Law
              </h2>
              <p className="text-gray-600 leading-relaxed">
                These Terms shall be governed and construed in accordance with
                the laws of your jurisdiction, without regard to its conflict of
                law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                13. Contact Us
              </h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about these Terms, please contact us
                at{" "}
                <a
                  href="mailto:support@noisemap.app"
                  className="text-blue-600 underline"
                >
                  support@noisemap.app
                </a>
                .
              </p>
            </section>

            <p className="text-gray-500 text-sm mt-12">
              &copy; {new Date().getFullYear()} Noise Map. All rights reserved.
            </p>
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
                  <Link
                    href="/map"
                    className="hover:text-white transition-colors"
                  >
                    Interactive Map
                  </Link>
                </li>
                <li>
                  <Link
                    href="/quiet-routes"
                    className="hover:text-white transition-colors"
                  >
                    Quiet Routes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/map"
                    className="hover:text-white transition-colors"
                  >
                    Report Noise
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
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
                    className="hover:text-white transition-colors"
                  >
                    admin@noisemap.xyz
                  </a>
                </li>
                <li>
                  <Link
                    href="/help"
                    className="hover:text-white transition-colors"
                  >
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
