// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import NoiseInput from "../components/NoiseInput";
import useGeolocation from "../hooks/useGeolocation";
import { NoiseReport } from "../types";

const NoiseMap = dynamic(() => import("../components/NoiseMap"), {
  ssr: false,
});

export default function Home() {
  const { coordinates } = useGeolocation();
  const [noiseReports, setNoiseReports] = useState<NoiseReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch noise reports when component mounts
  useEffect(() => {
    async function fetchNoiseReports() {
      try {
        setLoading(true);
        const response = await fetch("/api/noise");

        if (!response.ok) {
          throw new Error(`Failed to fetch noise reports: ${response.status}`);
        }

        const data = await response.json();
        setNoiseReports(data);
        setError(null);
      } catch (err) {
        setError(
          `Error loading noise data: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
      } finally {
        setLoading(false);
      }
    }

    fetchNoiseReports();
  }, []);

  // Handle when a new noise report is added
  const handleNoiseReported = (newReport: NoiseReport) => {
    setNoiseReports((prev) => [...prev, newReport]);
  };

  return (
    <main className="relative h-screen w-full flex flex-col overflow-hidden">
      {/* Map component */}
      <div className="flex-grow relative">
        <NoiseMap center={coordinates} reports={noiseReports} />
      </div>

      {/* Noise input component */}
      <div className="shrink-0">
        <NoiseInput onNoiseReported={handleNoiseReported} />
      </div>

      {/* Error message */}
      {error && (
        <div className="absolute top-4 left-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <div className="text-blue-500 text-xl">Loading noise data...</div>
        </div>
      )}
    </main>
  );
}
