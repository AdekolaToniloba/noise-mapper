// components/NoiseInput.tsx
"use client";

import { useState } from "react";
import useAudioAnalyzer from "../hooks/useAudioAnalyzer";
import useGeolocation from "../hooks/useGeolocation";
import { NoiseReport } from "../types";

interface NoiseInputProps {
  onNoiseReported: (report: NoiseReport) => void;
}

export default function NoiseInput({ onNoiseReported }: NoiseInputProps) {
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

  // Handle reporting noise levels
  const handleReportNoise = async () => {
    if (!coordinates) {
      setSubmitError("Location data is not available");
      return;
    }

    // Use either recorded or manual decibel value
    const decibels = currentDecibels
      ? currentDecibels
      : parseFloat(manualDecibels);

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
    <div className="left-0 right-0 bg-white p-3 sm:p-5 shadow-lg rounded-t-lg overflow-y-auto max-h-60 sm:max-h-none">
      <div className="flex flex-col space-y-3">
        {/* Error messages - more compact on mobile */}
        {(audioError || geoError || submitError) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-1.5 rounded text-xs sm:text-sm">
            {audioError || geoError || submitError}
          </div>
        )}

        {/* Current decibel display - smaller on mobile */}
        <div className="text-center">
          <span className="text-sm sm:text-base font-semibold">
            {currentDecibels
              ? `Current Noise Level: ${currentDecibels} dB`
              : "No sound data available"}
          </span>
        </div>

        {/* More efficient layout for mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          {/* Record button */}
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 sm:py-3 rounded-full focus:outline-none text-sm sm:text-base flex items-center justify-center"
              disabled={submitting}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
              Record Noise
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 sm:py-3 rounded-full focus:outline-none text-sm sm:text-base flex items-center justify-center"
              disabled={submitting}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
              Stop Recording
            </button>
          )}

          {/* Manual input with more compact layout */}
          <div className="flex items-center space-x-2 justify-center">
            <label
              htmlFor="manualDecibels"
              className="text-gray-700 text-sm sm:text-base whitespace-nowrap"
            >
              Manual dB:
            </label>
            <input
              id="manualDecibels"
              type="number"
              min="0"
              max="150"
              value={manualDecibels}
              onChange={(e) => setManualDecibels(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1.5 w-20 text-sm sm:text-base"
              disabled={isRecording || submitting}
            />
          </div>
        </div>

        {/* Submit button - more compact */}
        <button
          onClick={handleReportNoise}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 sm:py-3 rounded-full focus:outline-none w-full text-sm sm:text-base flex items-center justify-center"
          disabled={
            (!currentDecibels && !manualDecibels) || submitting || !coordinates
          }
        >
          {submitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Report Noise Level
            </>
          )}
        </button>
      </div>
    </div>
  );
}
