export interface NoiseReport {
  id: string;
  lat: number;
  lng: number;
  decibels: number;
  timestamp: Date;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface AudioAnalyzerHookReturn {
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  currentDecibels: number | null;
  error: string | null;
}

export interface GeolocationHookReturn {
  coordinates: LatLng | null;
  error: string | null;
  loading: boolean;
}
