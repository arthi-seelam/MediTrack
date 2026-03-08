import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { CITIES } from "@/data/mockData";
import { calculateDistance } from "@/hooks/use-geolocation";

interface LocationContextType {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  userCoords: { lat: number; lng: number } | null;
  detecting: boolean;
  detectLocation: () => void;
  error: string | null;
}

const LocationContext = createContext<LocationContextType | null>(null);

export const useLocationContext = () => {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocationContext must be used within LocationProvider");
  return ctx;
};

function findNearestCity(lat: number, lng: number): string {
  let nearest = CITIES[0].name;
  let minDist = Infinity;
  for (const city of CITIES) {
    const dist = calculateDistance(lat, lng, city.lat, city.lng);
    if (dist < minDist) {
      minDist = dist;
      nearest = city.name;
    }
  }
  return nearest;
}

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCity, setSelectedCityState] = useState<string>(() => {
    return localStorage.getItem("meditrack_city") || "";
  });
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(() => {
    const saved = localStorage.getItem("meditrack_location");
    return saved ? JSON.parse(saved) : null;
  });
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setSelectedCity = useCallback((city: string) => {
    setSelectedCityState(city);
    localStorage.setItem("meditrack_city", city);
  }, []);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    setDetecting(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        localStorage.setItem("meditrack_location", JSON.stringify(coords));
        const city = findNearestCity(coords.lat, coords.lng);
        setSelectedCity(city);
        setDetecting(false);
      },
      (err) => {
        setError(err.message);
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
