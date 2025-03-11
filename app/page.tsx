// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";
import NoiseInput from "../components/NoiseInput";
import useGeolocation from "../hooks/useGeolocation";
import { NoiseReport, LatLng } from "../types";

const NoiseMap = dynamic(() => import("../components/NoiseMap"), {
  ssr: false,
});

const SearchBar = dynamic(() => import("../components/SearchBar"), {
  ssr: false,
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { coordinates } = useGeolocation();

  const [noiseReports, setNoiseReports] = useState<NoiseReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchLocation, setSearchLocation] = useState<LatLng | null>(null);

  // Fetch noise reports when component mounts
  const {
    data,
    error: fetchError,
    mutate,
  } = useSWR("/api/noise", fetcher, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // Only retry up to 3 times
      if (retryCount >= 3) return;

      // Retry after 3 seconds
      setTimeout(() => revalidate({ retryCount }), 3000);
    },
  });

  useEffect(() => {
    if (data) {
      // Ensure data is an array before setting it
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
      setNoiseReports([]); // Initialize with empty array to prevent map errors
      setLoading(false);
    }
  }, [data, fetchError]);

  // Handle when a new noise report is added
  const handleNoiseReported = async (newReport: NoiseReport) => {
    setNoiseReports((prev) => [...prev, newReport]);
    await mutate(); // This will revalidate the data
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
      {/* Search bar component */}
      <div className="relative z-20 w-full">
        <SearchBar onLocationSelect={handleLocationSelect} />
      </div>

      {/* Map component */}
      <div className="flex-grow relative z-10">
        <NoiseMap
          center={coordinates}
          reports={noiseReports}
          searchLocation={searchLocation}
        />
      </div>

      {/* Noise input component - fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-20 sm:relative sm:bottom-auto">
        <NoiseInput onNoiseReported={handleNoiseReported} />
      </div>

      {/* Error message */}
      {/* {error && (
        <div className="absolute top-18 w-8/12 left-4 right-4 z-50   bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm sm:text-base">
          {error}
          <div className="text-sm mt-1">
            Please check your database connection or try again later.
          </div>
        </div>
      )} */}
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
