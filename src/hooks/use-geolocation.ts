import { useState, useEffect, useCallback } from "react";

/** User location coordinates */
export interface UserLocation {
  lat: number;
  lng: number;
  city?: string;
}

/** Geolocation hook state */
interface GeolocationState {
  location: UserLocation | null;
  loading: boolean;
  error: string | null;
  detect: () => void;
}

/**
 * Calculates distance between two geographic points using Haversine formula
 * @param startLat - Starting latitude
 * @param startLng - Starting longitude
 * @param endLat - Ending latitude
 * @param endLng - Ending longitude
 * @returns Distance in kilometers (rounded to 1 decimal)
 */
function haversineDistance(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
): number {
  const EARTH_RADIUS_KM = 6371;
  const toRadian = (degree: number) => (degree * Math.PI) / 180;

  const latDelta = toRadian(endLat - startLat);
  const lngDelta = toRadian(endLng - startLng);

  // Haversine formula
  const a =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(toRadian(startLat)) *
      Math.cos(toRadian(endLat)) *
      Math.sin(lngDelta / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/**
 * Calculates distance between two geographic points
 * @param userLat - User latitude
 * @param userLng - User longitude
 * @param pointLat - Point latitude (hospital/doctor location)
 * @param pointLng - Point longitude (hospital/doctor location)
 * @returns Distance in kilometers (rounded to 1 decimal)
 */
export function calculateDistance(
  userLat: number,
  userLng: number,
  pointLat: number,
  pointLng: number
): number {
  return Math.round(haversineDistance(userLat, userLng, pointLat, pointLng) * 10) / 10;
}

/**
 * Hook for geolocation functionality
 * Provides location detection and local storage persistence
 * @param autoDetect - Whether to automatically detect location on mount
 * @returns Geolocation state and detect function
 */
export function useGeolocation(autoDetect = false): GeolocationState {
  const [location, setLocation] = useState<UserLocation | null>(() => {
    const saved = localStorage.getItem("meditrack_location");
    return saved ? (JSON.parse(saved) as UserLocation) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detect = useCallback((): void => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: UserLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setLocation(loc);
        localStorage.setItem("meditrack_location", JSON.stringify(loc));
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    if (autoDetect && !location) {
      detect();
    }
  }, [autoDetect, location, detect]);

  return { location, loading, error, detect };
}
