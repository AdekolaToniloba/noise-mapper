// components/NoiseInput.tsx
"use client";

import { useState, useEffect } from "react";
import useAudioAnalyzer from "../hooks/useAudioAnalyzer";
import useGeolocation from "../hooks/useGeolocation";
import { NoiseReport } from "../types";

interface NoiseInputProps {
  onNoiseReported: (report: NoiseReport) => void;
  onClose?: () => void;
}

export default function NoiseInput({
  onNoiseReported,
  onClose,
}: NoiseInputProps) {
  const {
    isRecording,
    startRecording,
    stopRecording,
    currentDecibels,
    error: audioError,
  } = useAudioAnalyzer();
  const { coordinates, error: geoError } = useGeolocation();
  const [manualDecibels, setManualDecibels] = useState<string>("70");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Sound wave animation based on decibel level
  const getWaveHeight = (index: number) => {
    if (!isRecording || !currentDecibels) return 10;
    const intensity = (currentDecibels - 40) / 80; // Normalize to 0-1
    const baseHeight = 10 + intensity * 40;
    const variation = Math.sin(Date.now() / 200 + index) * 10 * intensity;
    return Math.max(10, baseHeight + variation);
  };

  // Handle reporting noise levels
  const handleReportNoise = async () => {
    if (!coordinates) {
      setSubmitError("Location data is not available");
      return;
    }

    const decibels = currentDecibels || parseFloat(manualDecibels);

    if (isNaN(decibels) || decibels < 0 || decibels > 150) {
      setSubmitError("Please enter a valid decibel value (0-150)");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);

      const response = await fetch("/api/noise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lat: coordinates.lat,
          lng: coordinates.lng,
          decibels,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const newReport = await response.json();
      onNoiseReported(newReport);

      // Auto-stop recording if we were recording
      if (isRecording) {
        stopRecording();
      }

      // Close panel after successful submission
      if (onClose) {
        setTimeout(onClose, 1000);
      }
    } catch (error) {
      setSubmitError(
        `Failed to report noise: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl p-6 md:p-8 max-h-[80vh] overflow-y-auto">
      {/* Close button for desktop */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 md:block hidden"
        >
          <svg
            className="w-5 h-5"
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
        </button>
      )}

      <div className="flex flex-col space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Report Noise Level
        </h3>

        {/* Error messages */}
        {(audioError || geoError || submitError) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {audioError || geoError || submitError}
          </div>
        )}

        {/* Sound visualization */}
        <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl p-6">
          <div className="flex items-center justify-center h-24 mb-4">
            {isRecording ? (
              <div className="flex items-end space-x-1">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 bg-gradient-to-t from-blue-500 to-teal-400 rounded-full transition-all duration-200"
                    style={{ height: `${getWaveHeight(i)}px` }}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-gray-400">
                <svg
                  className="w-8 h-8"
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
                <span className="text-sm">Ready to record</span>
              </div>
            )}
          </div>

          {/* Current decibel display */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">
              {currentDecibels ? `${currentDecibels} dB` : "-- dB"}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {currentDecibels
                ? getNoiseDescription(currentDecibels)
                : "No sound detected"}
            </p>
          </div>
        </div>

        {/* Recording controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
              disabled={submitting}
            >
              <svg
                className="w-5 h-5"
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
              <span>Start Recording</span>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2 animate-pulse"
              disabled={submitting}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                />
              </svg>
              <span>Stop Recording</span>
            </button>
          )}

          {/* Manual input */}
          <div className="bg-gray-50 rounded-xl p-4">
            <label
              htmlFor="manualDecibels"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Or enter manually:
            </label>
            <div className="flex items-center space-x-2">
              <input
                id="manualDecibels"
                type="number"
                min="0"
                max="150"
                value={manualDecibels}
                onChange={(e) => setManualDecibels(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isRecording || submitting}
              />
              <span className="text-gray-600 font-medium">dB</span>
            </div>
          </div>
        </div>

        {/* Location info */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>
            {coordinates
              ? `Location: ${coordinates.lat.toFixed(
                  4
                )}, ${coordinates.lng.toFixed(4)}`
              : "Acquiring location..."}
          </span>
        </div>

        {/* Submit button */}
        <button
          onClick={handleReportNoise}
          className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-6 py-4 rounded-xl font-medium transition-all flex items-center justify-center space-x-2"
          disabled={
            (!currentDecibels && !manualDecibels) || submitting || !coordinates
          }
        >
          {submitting ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
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
              <span>Submit Report</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Helper function to describe noise levels
function getNoiseDescription(decibels: number): string {
  if (decibels < 30) return "Very quiet - Like a whisper";
  if (decibels < 50) return "Quiet - Like a library";
  if (decibels < 70) return "Moderate - Normal conversation";
  if (decibels < 85) return "Loud - City traffic";
  if (decibels < 100) return "Very loud - Subway train";
  if (decibels < 120) return "Extremely loud - Rock concert";
  return "Dangerous - Immediate hearing damage risk";
}
