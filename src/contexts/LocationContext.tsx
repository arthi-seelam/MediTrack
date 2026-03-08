import React, { createContext, useContext, useState, useCallback } from "react";
import { CITIES } from "@/data/mockData";
import { calculateDistance } from "@/hooks/use-geolocation";

/** User geographic coordinates */
interface Coordinates {
  lat: number;
  lng: number;
}

/** Location context exposed to components */
interface LocationContextType {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  userCoords: Coordinates | null;
  detecting: boolean;
  detectLocation: () => void;
  error: string | null;
}

const LocationContext = createContext<LocationContextType | null>(null);

const STORAGE_CITY_KEY = "meditrack_city";
const STORAGE_LOCATION_KEY = "meditrack_location";

/**
 * Access location context from child components
 * @throws Error if used outside LocationProvider
 */
export const useLocationContext = (): LocationContextType => {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocationContext must be used within LocationProvider");
  return ctx;
};

/**
 * Find nearest city by calculating distance to all available cities
 */
function findNearestCity(userLat: number, userLng: number): string {
  let nearestCity = CITIES[0].name;
  let minDistance = Infinity;

  for (const city of CITIES) {
    const distance = calculateDistance(userLat, userLng, city.lat, city.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearestCity = city.name;
    }
  }
  return nearestCity;
}

/**
 * Provides user location and city selection context to app
 */
export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Restore city selection from localStorage
  const [selectedCity, setCityInternal] = useState<string>(() => {
    return localStorage.getItem(STORAGE_CITY_KEY) || "";
  });

  // Restore user coordinates from localStorage
  const [userCoords, setUserCoords] = useState<Coordinates | null>(() => {
    const saved = localStorage.getItem(STORAGE_LOCATION_KEY);
    return saved ? JSON.parse(saved) as Coordinates : null;
  });

  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update city selection with localStorage persistence
  const setSelectedCity = useCallback((city: string): void => {
    setCityInternal(city);
    localStorage.setItem(STORAGE_CITY_KEY, city);
  }, []);

  // Initiate geolocation detection
  const detectLocation = useCallback((): void => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported in your browser");
      return;
    }
    setDetecting(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: Coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserCoords(coords);
        localStorage.setItem(STORAGE_LOCATION_KEY, JSON.stringify(coords));
        const city = findNearestCity(coords.lat, coords.lng);
        setSelectedCity(city);
        setDetecting(false);
      },
      (geoError) => {
        setError(geoError.message);
        setDetecting(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [setSelectedCity]);

  return (
    <LocationContext.Provider value={{ selectedCity, setSelectedCity, userCoords, detecting, detectLocation, error }}>
      {children}
    </LocationContext.Provider>
  );
};
