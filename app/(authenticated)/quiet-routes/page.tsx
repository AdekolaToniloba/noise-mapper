// app/(authenticated)/quiet-routes/page.tsx
"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface QuietRoute {
  id: string;
  startAddress: string;
  endAddress: string;
  distance: number;
  avgNoiseLevel: number;
  createdAt: string;
}

export default function QuietRoutesPage() {
  const [isSearching, setIsSearching] = useState(false);
  const [startAddress, setStartAddress] = useState("");
  const [endAddress, setEndAddress] = useState("");
  const [showRouteForm, setShowRouteForm] = useState(false);

  const { data: routes, error } = useSWR<QuietRoute[]>(
    "/api/quiet-routes",
    fetcher
  );

  const handleFindRoute = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startAddress || !endAddress) {
      toast.error("Please enter both start and end addresses");
      return;
    }

    setIsSearching(true);

    try {
      // TODO: Implement actual route finding algorithm
      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Route found! This feature is coming soon.");
      setShowRouteForm(false);
      setStartAddress("");
      setEndAddress("");
    } catch (error) {
      toast.error("Failed to find route");
    } finally {
      setIsSearching(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getNoiseLevel = (avgNoise: number) => {
    if (avgNoise < 50) return { label: "Quiet", color: "text-green-600" };
    if (avgNoise < 70) return { label: "Moderate", color: "text-yellow-600" };
    return { label: "Loud", color: "text-red-600" };
  };

  if (showRouteForm) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <button onClick={() => setShowRouteForm(false)} className="mr-4">
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
            <h1 className="text-xl font-semibold">Quiet Route</h1>
          </div>

          <form onSubmit={handleFindRoute} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Enter starting point"
                value={startAddress}
                onChange={(e) => setStartAddress(e.target.value)}
                className="w-full p-4 bg-gray-100 rounded-lg border-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Enter destination"
                value={endAddress}
                onChange={(e) => setEndAddress(e.target.value)}
                className="w-full p-4 bg-gray-100 rounded-lg border-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="w-full bg-blue-600 text-white py-4 rounded-full font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Finding quiet route...
                </span>
              ) : (
                "Find Quiet Route"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold">Quietest Route</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* Map placeholder */}
        <div className="bg-teal-600 rounded-lg h-64 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-teal-700">
            <div className="grid grid-cols-12 gap-0.5 p-2 h-full opacity-30">
              {[...Array(96)].map((_, i) => (
                <div key={i} className="bg-teal-500" />
              ))}
            </div>
          </div>

          {/* Search bar overlay */}
          <div className="absolute top-4 left-4 right-4">
            <button
              onClick={() => setShowRouteForm(true)}
              className="w-full bg-white rounded-full px-4 py-3 text-left text-gray-500 shadow-lg"
            >
              <span className="flex items-center">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Search for a location
              </span>
            </button>
          </div>

          {/* Zoom controls */}
          <div className="absolute right-4 bottom-4 space-y-2">
            <button className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center">
              <span className="text-xl">+</span>
            </button>
            <button className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center">
              <span className="text-xl">−</span>
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setShowRouteForm(true)}
            className="bg-blue-600 text-white py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
          >
            Start Navigation
          </button>
          <button className="bg-gray-200 text-gray-700 py-3 rounded-full font-medium hover:bg-gray-300 transition-colors">
            View Route Details
          </button>
        </div>

        {/* Past routes */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Routes</h2>

          {error && (
            <div className="text-center py-8 text-gray-500">
              Failed to load routes
            </div>
          )}

          {routes && routes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No routes yet</p>
              <p className="text-sm mt-2">Find your first quiet route above</p>
            </div>
          )}

          {routes && routes.length > 0 && (
            <div className="space-y-3">
              {routes.map((route) => {
                const noise = getNoiseLevel(route.avgNoiseLevel);
                return (
                  <div
                    key={route.id}
                    className="bg-white rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {route.startAddress}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">to</p>
                        <p className="font-medium text-sm">
                          {route.endAddress}
                        </p>
                      </div>
                      <span className={`text-xs font-medium ${noise.color}`}>
                        {noise.label}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{route.distance.toFixed(1)} km</span>
                      <span>{formatDate(route.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
