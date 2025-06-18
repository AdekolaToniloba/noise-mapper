// app/privacy/page.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
  // const sectionVariants = {
  //   initial: { opacity: 0, y: 20 },
  //   animate: { opacity: 1, y: 0 },
  //   transition: { duration: 0.6 },
  // };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/"
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent"
              >
                Noise Map
              </Link>
            </motion.div>
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/map"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Open Map
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Content */}
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Privacy Policy
            </h1>
            <p className="text-gray-600 mb-8">Last updated: January 2024</p>
          </motion.div>

          <div className="prose prose-lg max-w-none">
            {[
              {
                title: "1. Introduction",
                content: `At Noise Map ("we," "our," or "us"), we are committed to protecting your privacy. This Privacy Policy 
                explains how we collect, use, disclose, and safeguard your information when you use our website and 
                mobile application.`,
              },
              {
                title: "2. Information We Collect",
                subsections: [
                  {
                    subtitle: "2.1 Information You Provide",
                    items: [
                      {
                        label: "Account Information:",
                        detail:
                          "Email address, name, and profile picture (if provided)",
                      },
                      {
                        label: "Noise Reports:",
                        detail:
                          "Decibel levels and timestamps of your submissions",
                      },
                      {
                        label: "Preferences:",
                        detail:
                          "Your notification settings and saved locations",
                      },
                    ],
                  },
                  {
                    subtitle: "2.2 Information Collected Automatically",
                    items: [
                      {
                        label: "Location Data:",
                        detail:
                          "GPS coordinates when you submit noise reports (only when you grant permission)",
                      },
                      {
                        label: "Device Information:",
                        detail:
                          "Device type, operating system, and browser type",
                      },
                      {
                        label: "Usage Data:",
                        detail:
                          "How you interact with our services, including pages visited and features used",
                      },
                    ],
                  },
                ],
              },
              {
                title: "3. How We Use Your Information",
                content: "We use the collected information to:",
                items: [
                  "Provide and maintain our noise mapping services",
                  "Display noise levels and quiet routes on our maps",
                  "Send you notifications about noise levels in your saved locations (if enabled)",
                  "Improve our services and develop new features",
                  "Respond to your comments, questions, and support requests",
                  "Detect, prevent, and address technical issues",
                ],
              },
              {
                title: "4. Data Sharing and Disclosure",
                content:
                  "We do not sell, trade, or rent your personal information. We may share your information only in the following situations:",
                items: [
                  {
                    label: "Aggregated Data:",
                    detail:
                      "We may share anonymized, aggregated noise data with researchers and city planners",
                  },
                  {
                    label: "Service Providers:",
                    detail:
                      "With third-party vendors who assist in operating our services",
                  },
                  {
                    label: "Legal Requirements:",
                    detail:
                      "If required by law or to protect our rights and safety",
                  },
                  {
                    label: "Business Transfers:",
                    detail:
                      "In connection with a merger, acquisition, or sale of assets",
                  },
                ],
              },
              {
                title: "5. Data Security",
                content: `We implement appropriate technical and organizational security measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction. These measures include 
                encryption, secure servers, and regular security assessments.`,
              },
              {
                title: "6. Your Rights and Choices",
                content: "You have the right to:",
                items: [
                  "Access and receive a copy of your personal data",
                  "Correct or update your personal information",
                  "Delete your account and associated data",
                  "Opt-out of notifications and marketing communications",
                  "Withdraw consent for location services at any time",
                ],
              },
              {
                title: "7. Data Retention",
                content: `We retain your personal information only for as long as necessary to provide our services and fulfill 
                the purposes outlined in this policy. Noise report data is anonymized after 90 days. Account information 
                is retained until you delete your account.`,
              },
              {
                title: "8. Children's Privacy",
                content: `Our services are not intended for children under 13 years of age. We do not knowingly collect personal 
                information from children under 13. If you believe we have collected information from a child under 13, 
                please contact us immediately.`,
              },
              {
                title: "9. International Data Transfers",
                content: `Your information may be transferred to and processed in countries other than your country of residence. 
                We ensure appropriate safeguards are in place to protect your information in accordance with this policy.`,
              },
              {
                title: "10. Changes to This Policy",
                content: `We may update this Privacy Policy from time to time. We will notify you of any changes by posting the 
                new policy on this page and updating the "Last updated" date. Your continued use of our services after 
                changes constitutes acceptance of the updated policy.`,
              },
              {
                title: "11. Contact Us",
                content:
                  "If you have any questions about this Privacy Policy or our data practices, please contact us at:",
                contact: true,
              },
            ].map((section, index) => (
              <motion.section
                key={index}
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <motion.h2
                  className="text-2xl font-semibold text-gray-900 mb-4"
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {section.title}
                </motion.h2>

                {section.content && (
                  <p className="text-gray-600 leading-relaxed">
                    {section.content}
                  </p>
                )}

                {section.subsections &&
                  section.subsections.map((subsection, subIndex) => (
                    <motion.div
                      key={subIndex}
                      className="mt-4"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + subIndex * 0.1 }}
                    >
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        {subsection.subtitle}
                      </h3>
                      <ul className="list-disc pl-6 space-y-2 text-gray-600">
                        {subsection.items.map((item, itemIndex) => (
                          <motion.li
                            key={itemIndex}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + itemIndex * 0.05 }}
                            whileHover={{ x: 5 }}
                          >
                            <strong>{item.label}</strong> {item.detail}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}

                {section.items && (
                  <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-3">
                    {section.items.map((item, itemIndex) => (
                      <motion.li
                        key={itemIndex}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + itemIndex * 0.05 }}
                        whileHover={{ x: 5 }}
                      >
                        {typeof item === "string" ? (
                          item
                        ) : (
                          <>
                            <strong>{item.label}</strong> {item.detail}
                          </>
                        )}
                      </motion.li>
                    ))}
                  </ul>
                )}

                {section.contact && (
                  <motion.div
                    className="bg-gray-50 rounded-lg p-4 mt-4"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
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
                  </motion.div>
                )}
              </motion.section>
            ))}
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
