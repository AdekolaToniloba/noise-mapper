// app/help/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

export default function HelpCenterPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [hoveredQuickLink, setHoveredQuickLink] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: "How do I report noise levels?",
      answer:
        "You can report noise levels by clicking the 'Report Noise' button on the map screen. You can either use your device's microphone to record actual noise levels or manually input the decibel value. No login is required for reporting noise levels.",
    },
    {
      question: "What are quiet routes?",
      answer:
        "Quiet routes are walking paths through the city that avoid high-noise areas. Our algorithm analyzes community-reported noise data to find the most peaceful paths between your starting point and destination. This feature requires a free account.",
    },
    {
      question: "How accurate are the noise measurements?",
      answer:
        "Noise measurements are crowdsourced from our community. While individual recordings may vary based on device quality and environmental factors, the aggregate data provides a reliable overview of noise patterns in your area.",
    },
    {
      question: "Can I use the app offline?",
      answer:
        "The map requires an internet connection to load, but you can view previously loaded areas offline. However, you won't be able to submit new noise reports or access quiet routes without a connection.",
    },
    {
      question: "Is my location data private?",
      answer:
        "Yes, your privacy is important to us. Location data is only used when you submit a noise report and is anonymized. We never track your location continuously or share your personal location data with third parties.",
    },
    {
      question: "How do I delete my account?",
      answer:
        "To delete your account, please contact our support team at admin@noisemap.xyz. We'll process your request within 48 hours and permanently delete all your personal data.",
    },
    {
      question: "What devices are supported?",
      answer:
        "Noise Map works on any modern web browser on desktop, tablet, or mobile devices. For the best experience, we recommend using the latest version of Chrome, Firefox, Safari, or Edge.",
    },
    {
      question: "How can I contribute to making my city quieter?",
      answer:
        "The more noise reports from your area, the more accurate our maps become! Report noise levels regularly from different locations, especially during different times of day. You can also share Noise Map with friends and neighbors to grow the community.",
    },
  ];

  const quickLinks = [
    {
      href: "mailto:admin@noisemap.xyz",
      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      title: "Email Support",
    },
    {
      href: "/privacy",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      title: "Privacy Policy",
    },
    {
      href: "/terms",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      title: "Terms of Service",
    },
    {
      href: "/about",
      icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "About Us",
    },
  ];

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Help Center
            </h1>
            <p className="text-xl text-gray-600">
              Find answers to common questions about using Noise Map
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="bg-white rounded-xl shadow-sm p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold mb-6">Quick Links</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {quickLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 10 }}
                  whileTap={{ scale: 0.98 }}
                  onHoverStart={() => setHoveredQuickLink(index)}
                  onHoverEnd={() => setHoveredQuickLink(null)}
                >
                  <div className="flex items-center space-x-3">
                    <motion.svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      animate={{
                        rotate: hoveredQuickLink === index ? 360 : 0,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={link.icon}
                      />
                    </motion.svg>
                    <span className="font-medium">{link.title}</span>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            className="bg-white rounded-xl shadow-sm p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-2">
              {faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="border-b last:border-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                >
                  <motion.button
                    onClick={() => toggleExpanded(index)}
                    className="w-full py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg px-2"
                    whileHover={{ x: 5 }}
                  >
                    <span className="font-medium pr-4">{item.question}</span>
                    <motion.svg
                      className="w-5 h-5 text-gray-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      animate={{
                        rotate: expandedIndex === index ? 180 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </motion.svg>
                  </motion.button>
                  <AnimatePresence>
                    {expandedIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-4 px-2 text-gray-600">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h3 className="text-xl font-semibold mb-4">Still need help?</h3>
            <p className="text-gray-600 mb-6">
              Our support team is here to assist you
            </p>
            <motion.a
              href="mailto:admin@noisemap.xyz"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Contact Support
            </motion.a>
          </motion.div>
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
