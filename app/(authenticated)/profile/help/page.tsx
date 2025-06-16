// app/(authenticated)/profile/help/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FAQItem {
  question: string;
  answer: string;
}

export default function HelpPage() {
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: "How do I report noise levels?",
      answer:
        "You can report noise levels by tapping the 'Report Noise' button on the main map screen. You can either use your device's microphone to record actual noise levels or manually input the decibel value.",
    },
    {
      question: "What are quiet routes?",
      answer:
        "Quiet routes are walking paths through the city that avoid high-noise areas. Our algorithm analyzes community-reported noise data to find the most peaceful paths between your starting point and destination.",
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
      question: "How do I delete my account?",
      answer:
        "To delete your account, please contact our support team at support@noisemap.com. We'll process your request within 48 hours.",
    },
  ];

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <h1 className="text-xl font-semibold">Help Center</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* Quick Links */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
          <div className="space-y-3">
            <a
              href="mailto:support@noisemap.com"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <div className="flex items-center space-x-3">
                <svg
                  className="w-5 h-5 text-gray-600"
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
                <span className="font-medium">Email Support</span>
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
            </a>

            <a
              href="https://noisemap.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <div className="flex items-center space-x-3">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span className="font-medium">Privacy Policy</span>
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
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-2">
            {faqItems.map((item, index) => (
              <div key={index} className="border-b last:border-0">
                <button
                  onClick={() => toggleExpanded(index)}
                  className="w-full py-4 text-left flex items-center justify-between"
                >
                  <span className="font-medium pr-4">{item.question}</span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transform transition-transform ${
                      expandedIndex === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {expandedIndex === index && (
                  <div className="pb-4 text-gray-600 text-sm">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Still need help?</p>
          <p className="mt-1">Contact us at support@noisemap.com</p>
        </div>
      </div>
    </div>
  );
}
