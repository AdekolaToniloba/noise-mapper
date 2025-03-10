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
    <div className="left-0 right-0 bg-white p-4 shadow-lg rounded-t-lg">
      <div className="flex flex-col space-y-4">
        {/* Error messages */}
        {(audioError || geoError || submitError) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
            {audioError || geoError || submitError}
          </div>
        )}

        {/* Current decibel display */}
        <div className="text-center">
          <span className="text-lg font-semibold">
            {currentDecibels
              ? `Current Noise Level: ${currentDecibels} dB`
              : "No sound data available"}
          </span>
        </div>

        {/* Microphone controls */}
        <div className="flex items-center justify-center space-x-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full focus:outline-none"
              disabled={submitting}
            >
              Record Noise
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full focus:outline-none"
              disabled={submitting}
            >
              Stop Recording
            </button>
          )}

          {/* Manual input fallback */}
          <div className="flex items-center space-x-2">
            <label htmlFor="manualDecibels" className="text-gray-700">
              Manual dB:
            </label>
            <input
              id="manualDecibels"
              type="number"
              min="0"
              max="150"
              value={manualDecibels}
              onChange={(e) => setManualDecibels(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 w-20"
              disabled={isRecording || submitting}
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          onClick={handleReportNoise}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full focus:outline-none w-full"
          disabled={
            (!currentDecibels && !manualDecibels) || submitting || !coordinates
          }
        >
          {submitting ? "Submitting..." : "Report Noise Level"}
        </button>
      </div>
    </div>
  );
}
