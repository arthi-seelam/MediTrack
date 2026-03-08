import { useState, useEffect, useCallback } from "react";

export interface UserLocation {
  lat: number;
  lng: number;
  city?: string;
}

interface GeolocationState {
  location: UserLocation | null;
  loading: boolean;
  error: string | null;
  detect: () => void;
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function calculateDistance(userLat: number, userLng: number, destLat: number, destLng: number): number {
  return Math.round(haversineDistance(userLat, userLng, destLat, destLng) * 10) / 10;
}

export function useGeolocation(autoDetect = false): GeolocationState {
  const [location, setLocation] = useState<UserLocation | null>(() => {
    const saved = localStorage.getItem("meditrack_location");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detect = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: UserLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
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
