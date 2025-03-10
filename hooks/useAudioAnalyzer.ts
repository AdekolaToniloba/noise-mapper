import { useState, useEffect, useRef, useCallback } from "react";
import { AudioAnalyzerHookReturn } from "../types";
import { debounce } from "lodash";

// Define interfaces for WebkitAudioContext
interface WindowWithWebkitAudio extends Window {
  webkitAudioContext: typeof AudioContext;
}

export default function useAudioAnalyzer(): AudioAnalyzerHookReturn {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [currentDecibels, setCurrentDecibels] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const timerId = useRef<number | null>(null);

  // Create cleanup function without dependencies
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

    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }

    analyzerRef.current = null;
  }, []);

  // Create a stable reference to the debounced function
  const debouncedSetDecibelsRef = useRef<((value: number) => void) | null>(
    null
  );
  useEffect(() => {
    debouncedSetDecibelsRef.current = debounce((value: number) => {
      setCurrentDecibels(value);
    }, 500);

    return () => {
      if (debouncedSetDecibelsRef.current) {
        (
          debouncedSetDecibelsRef.current as unknown as { cancel: () => void }
        ).cancel();
      }
    };
  }, []);

  // Wrapper for the debounced function
  const debouncedSetDecibels = useCallback((value: number) => {
    if (debouncedSetDecibelsRef.current) {
      debouncedSetDecibelsRef.current(value);
    }
  }, []);

  // Calculate decibel levels using Web Worker
  const calculateDecibels = useCallback(() => {
    if (!analyzerRef.current || !workerRef.current) return;

    const bufferLength = analyzerRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyzerRef.current.getByteTimeDomainData(dataArray);

    // Send data to worker for processing
    workerRef.current.postMessage({
      dataArray: Array.from(dataArray), // Convert to regular array for transferability
      bufferLength,
    });
  }, []);

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      cleanup();

      // Create Web Worker
      workerRef.current = new Worker("/audioWorker.js");

      // Set up worker message handler
      workerRef.current.onmessage = (e) => {
        debouncedSetDecibels(e.data.decibels);
      };

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // Set up audio context and analyzer - use proper typing for webkitAudioContext
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as WindowWithWebkitAudio).webkitAudioContext;
      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 2048;
      source.connect(analyzer);
      analyzerRef.current = analyzer;

      // Start measuring decibel levels
      timerId.current = window.setInterval(() => {
        calculateDecibels();
      }, 500); // 500ms interval for performance

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
  }, [calculateDecibels, cleanup, debouncedSetDecibels]);

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
