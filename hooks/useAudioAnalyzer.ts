// hooks/useAudioAnalyzer.ts
import { useState, useEffect, useRef, useCallback } from "react";
import { AudioAnalyzerHookReturn } from "../types";

export default function useAudioAnalyzer(): AudioAnalyzerHookReturn {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [currentDecibels, setCurrentDecibels] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const timerId = useRef<number | null>(null);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (timerId.current) {
      window.clearInterval(timerId.current);
      timerId.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyzerRef.current = null;
  }, []);

  // Calculate decibel levels using RMS method
  const calculateDecibels = useCallback(() => {
    if (!analyzerRef.current) return;

    const bufferLength = analyzerRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyzerRef.current.getByteTimeDomainData(dataArray);

    // Calculate RMS (Root Mean Square)
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      // Convert from 0-255 to -1 to 1
      const amplitude = dataArray[i] / 128 - 1;
      sum += amplitude * amplitude;
    }
    const rms = Math.sqrt(sum / bufferLength);

    // Convert RMS to decibels (approximation)
    // 0 dB is the threshold of hearing, 120+ dB is pain
    // This is a rough estimate - real decibel measurement requires calibration
    const dB = 20 * Math.log10(rms) + 90; // +90 is an offset to get values in a typical range

    // Ensure we're in a reasonable range (40-120 dB)
    const normalizedDB = Math.min(Math.max(dB, 40), 120);

    setCurrentDecibels(parseFloat(normalizedDB.toFixed(1)));
  }, []);

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      cleanup();

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // Set up audio context and analyzer
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 2048;
      source.connect(analyzer);
      analyzerRef.current = analyzer;

      // Start measuring decibel levels with debounce (500ms)
      timerId.current = window.setInterval(() => {
        calculateDecibels();
      }, 500);

      setIsRecording(true);
      setError(null);
    } catch (err) {
      setError(
        `Microphone access error: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
      setIsRecording(false);
    }
  }, [calculateDecibels, cleanup]);

  // Stop recording
  const stopRecording = useCallback(() => {
    cleanup();
    setIsRecording(false);
  }, [cleanup]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    isRecording,
    startRecording,
    stopRecording,
    currentDecibels,
    error,
  };
}
