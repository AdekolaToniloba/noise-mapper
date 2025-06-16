// app/(authenticated)/profile/about/page.tsx
"use client";

import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();

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
          <h1 className="text-xl font-semibold">About</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* App Info */}
        <div className="bg-white rounded-lg p-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-teal-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Noise Map</h2>
          <p className="text-gray-600 mb-4">Version 0.1.0</p>
          <p className="text-sm text-gray-500">Find your quiet in the city</p>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-lg p-6">
          <h3 className="font-semibold mb-3">Our Mission</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            We believe everyone deserves peaceful spaces in their urban
            environment. Noise Map empowers communities to collectively map and
            navigate around noise pollution, creating a more livable city for
            all.
          </p>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg p-6">
          <h3 className="font-semibold mb-3">Key Features</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm text-gray-600">
                Real-time noise level reporting
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm text-gray-600">
                Community-driven data collection
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm text-gray-600">
                Quiet route navigation
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm text-gray-600">
                Interactive heat maps
              </span>
            </li>
          </ul>
        </div>

        {/* Technical Info */}
        <div className="bg-white rounded-lg p-6">
          <h3 className="font-semibold mb-3">Technical Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Platform</span>
              <span className="font-medium">Next.js 15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Database</span>
              <span className="font-medium">PostgreSQL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Maps</span>
              <span className="font-medium">Leaflet + OpenStreetMap</span>
            </div>
          </div>
        </div>

        {/* Credits */}
        <div className="text-center text-sm text-gray-500">
          <p>© 2024 Noise Map</p>
          <p className="mt-1">Made with ❤️ for quieter cities</p>
        </div>
      </div>
    </div>
  );
}
