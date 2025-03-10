// hooks/useGeolocation.ts
import { useState, useEffect } from "react";
import { LatLng, GeolocationHookReturn } from "../types";

// NYC fallback coordinates
const DEFAULT_COORDINATES: LatLng = { lat: 40.7128, lng: -74.006 };

export default function useGeolocation(): GeolocationHookReturn {
  const [coordinates, setCoordinates] = useState<LatLng | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setCoordinates(DEFAULT_COORDINATES);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (error) => {
        setError(`Unable to retrieve your location: ${error.message}`);
        setCoordinates(DEFAULT_COORDINATES);
        setLoading(false);
      }
    );
  }, []);

  return { coordinates, error, loading };
}
