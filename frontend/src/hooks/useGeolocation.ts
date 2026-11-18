import { useCallback, useEffect, useState } from 'react';

export interface GeoPosition {
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number | null;
}

interface UseGeolocationOptions {
  watch?: boolean;
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const {
    watch = false,
    enableHighAccuracy = true,
    timeout = 15000,
    maximumAge = 10000,
  } = options;

  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const applyPosition = useCallback((pos: GeolocationPosition) => {
    setPosition({
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
      speed: pos.coords.speed,
    });
    setError(null);
    setLoading(false);
  }, []);

  const applyError = useCallback((err: GeolocationPositionError) => {
    const messages: Record<number, string> = {
      1: 'Location permission denied. Enable location access in your browser.',
      2: 'Location unavailable. Try again outdoors or check GPS.',
      3: 'Location request timed out. Please retry.',
    };
    setError(messages[err.code] || err.message || 'Unable to get location');
    setLoading(false);
  }, []);

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(applyPosition, applyError, {
      enableHighAccuracy,
      timeout,
      maximumAge,
    });
  }, [applyError, applyPosition, enableHighAccuracy, maximumAge, timeout]);

  useEffect(() => {
    if (!watch) return;
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }
    setLoading(true);
    const id = navigator.geolocation.watchPosition(applyPosition, applyError, {
      enableHighAccuracy,
      timeout,
      maximumAge,
    });
    return () => navigator.geolocation.clearWatch(id);
  }, [watch, applyError, applyPosition, enableHighAccuracy, maximumAge, timeout]);

  return { position, error, loading, getCurrentPosition };
}

export default useGeolocation;
