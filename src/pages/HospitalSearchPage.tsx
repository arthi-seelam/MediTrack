import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { HOSPITALS, Hospital } from "@/data/mockData";
import HospitalCard from "@/components/HospitalCard";
import { useLocationContext } from "@/contexts/LocationContext";
import { calculateDistance } from "@/hooks/use-geolocation";

interface HospitalFilters {
  emergency: boolean;
  icu: boolean;
  twentyFourSeven: boolean;
}

/** Apply search and facility filters to hospitals */
function matches(hospital: Hospital, searchTerm: string, filters: HospitalFilters, cityFilter?: string): boolean {
  if (cityFilter && hospital.city !== cityFilter) return false;
  if (searchTerm && !hospital.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
  if (filters.emergency && !hospital.emergencySupported) return false;
  if (filters.icu && !hospital.icuAvailable) return false;
  if (filters.twentyFourSeven && !hospital.is24x7) return false;
  return true;
}

const HospitalSearchPage = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(initialSearch);
  const [filters, setFilters] = useState<HospitalFilters>({
    emergency: false,
    icu: false,
    twentyFourSeven: false,
  });
  const [showFilters, setShowFilters] = useState(false);

  const { selectedCity, userCoords } = useLocationContext();

  const filtered = useMemo(() => {
    return HOSPITALS
      .filter(hospital => matches(hospital, search, filters, selectedCity))
      .map(hospital => ({
        ...hospital,
        distance: userCoords ? calculateDistance(userCoords.lat, userCoords.lng, hospital.lat, hospital.lng) : undefined,
      }))
      .sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));
  }, [search, filters, selectedCity, userCoords]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          {selectedCity ? `Hospitals in ${selectedCity}` : "Find Hospitals"}
        </h1>
        <p className="text-muted-foreground mb-6">
          {selectedCity
            ? `Showing all hospitals in the ${selectedCity} area`
            : "Select a city from the top bar or detect your location to see nearby hospitals"
          }
        </p>

        {/* Search + filter toggle */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 flex items-center bg-card border border-border rounded-xl overflow-hidden">
            <Search className="w-5 h-5 text-muted-foreground ml-4" />
            <input
              type="text"
              placeholder="Search hospitals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
              showFilters || activeFilterCount > 0
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-primary-foreground text-primary text-xs flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-card border border-border rounded-xl p-5 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-display font-semibold text-foreground">Filters</span>
              <button
                onClick={() => setFilters({ emergency: false, icu: false, twentyFourSeven: false })}
                className="text-sm text-primary hover:underline"
              >
                Clear all
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.emergency}
                  onChange={(e) => setFilters({ ...filters, emergency: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-foreground">Emergency Support</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.icu}
                  onChange={(e) => setFilters({ ...filters, icu: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-foreground">ICU Available</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.twentyFourSeven}
                  onChange={(e) => setFilters({ ...filters, twentyFourSeven: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-foreground">24×7 Hospitals</span>
              </label>
            </div>
          </motion.div>
        )}

        {/* Results */}
        <div className="text-sm text-muted-foreground mb-4">
          {filtered.length} hospitals found
          {selectedCity && <span className="text-primary font-medium"> in {selectedCity}</span>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((hospital) => (
            <HospitalCard key={hospital.id} hospital={hospital} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <MapPin className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-lg font-medium">No hospitals found{selectedCity ? ` in ${selectedCity}` : ""}</p>
            <p className="text-sm mt-1">Try selecting a different city or adjusting your filters</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default HospitalSearchPage;
