// app/map/page.tsx
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import Link from "next/link";
import NoiseInput from "@/components/NoiseInput";
import useGeolocation from "@/hooks/useGeolocation";
import { NoiseReport, LatLng } from "@/types";
import BottomNav from "@/components/layout/BottomNav";

const NoiseMap = dynamic(() => import("@/components/NoiseMap"), {
  ssr: false,
});

const SearchBar = dynamic(() => import("@/components/SearchBar"), {
  ssr: false,
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MapPage() {
  const { data: session } = useSession();
  const { coordinates } = useGeolocation();

  const [noiseReports, setNoiseReports] = useState<NoiseReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchLocation, setSearchLocation] = useState<LatLng | null>(null);
  const [showNoiseInput, setShowNoiseInput] = useState(false);

  // Fetch noise reports when component mounts
  const {
    data,
    error: fetchError,
    mutate,
  } = useSWR("/api/noise", fetcher, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      if (retryCount >= 3) return;
      setTimeout(() => revalidate({ retryCount }), 3000);
    },
  });

  useEffect(() => {
    if (data) {
      if (Array.isArray(data)) {
        setNoiseReports(data);
      } else {
        setNoiseReports([]);
        setError("Invalid data format received from server");
      }
      setLoading(false);
    }
    if (fetchError) {
      console.error("Fetch error:", fetchError);
      setError(`Error loading noise data: ${fetchError.message}`);
      setNoiseReports([]);
      setLoading(false);
    }
  }, [data, fetchError]);

  const handleNoiseReported = async (newReport: NoiseReport) => {
    setNoiseReports((prev) => [...prev, newReport]);
    await mutate();
  };

  const handleLocationSelect = (location: {
    lat: number;
    lng: number;
    label: string;
  }) => {
    setSearchLocation({ lat: location.lat, lng: location.lng });
  };

  return (
    <main className="relative h-screen w-full flex flex-col overflow-hidden">
      {/* Header Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent"
            >
              Noise Map
            </Link>
            <div className="flex items-center space-x-4">
              {!session ? (
                <>
                  <Link
                    href="/quiet-routes"
                    className="hidden sm:inline-flex items-center text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Quiet Routes
                  </Link>
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {session.user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Search bar */}
      <div className="relative z-20 w-full mt-16">
        <SearchBar onLocationSelect={handleLocationSelect} />
      </div>

      {/* Map */}
      <div className="flex-grow relative z-10">
        <NoiseMap
          center={coordinates}
          reports={noiseReports}
          searchLocation={searchLocation}
        />
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute bottom-24 right-4 flex flex-col gap-3 z-20">
        {session && (
          <Link
            href="/quiet-routes"
            className="bg-teal-600 text-white p-4 rounded-full shadow-lg hover:bg-teal-700 transition-colors group"
            title="Find Quiet Routes"
          >
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
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            <span className="absolute right-full mr-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Find Quiet Routes
            </span>
          </Link>
        )}
        <button
          onClick={() => setShowNoiseInput(!showNoiseInput)}
          className={`${
            showNoiseInput
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white p-4 rounded-full shadow-lg transition-all group`}
          title={showNoiseInput ? "Close" : "Report Noise"}
        >
          {showNoiseInput ? (
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
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
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          )}
          <span className="absolute right-full mr-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {showNoiseInput ? "Close" : "Report Noise Level"}
          </span>
        </button>
      </div>

      {/* Noise input panel - Desktop optimized */}
      {showNoiseInput && (
        <div className="fixed bottom-0 left-0 right-0 z-20 md:left-auto md:right-4 md:bottom-4 md:w-96 animate-slide-up">
          <NoiseInput
            onNoiseReported={handleNoiseReported}
            onClose={() => setShowNoiseInput(false)}
          />
        </div>
      )}

      {/* Bottom navigation for authenticated users */}
      {session && <BottomNav />}

      {/* Error message */}
      {error && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md">
          <p className="font-semibold">{error}</p>
          <div className="text-sm mt-1">
            Please check your database connection or try again later.
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <div className="text-blue-500 text-lg sm:text-xl">
            Loading noise data...
          </div>
        </div>
      )}
    </main>
  );
}
