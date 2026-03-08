import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { HOSPITALS } from "@/data/mockData";
import HospitalCard from "@/components/HospitalCard";
import { useGeolocation, calculateDistance } from "@/hooks/use-geolocation";

const CITIES = [...new Set(HOSPITALS.map(h => h.city))];

const HospitalSearchPage = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(initialSearch);
  const [city, setCity] = useState("");
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [icuOnly, setIcuOnly] = useState(false);
  const [is24x7, setIs24x7] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [maxDistance, setMaxDistance] = useState<number>(0); // 0 = no limit

  const { location, loading, detect } = useGeolocation(true);

  const filtered = useMemo(() => {
    return HOSPITALS.map(h => {
      const distance = location
        ? calculateDistance(location.lat, location.lng, h.lat, h.lng)
        : h.distance;
      return { ...h, distance };
    })
      .filter(h => {
        if (search && !h.name.toLowerCase().includes(search.toLowerCase())) return false;
        if (city && h.city !== city) return false;
        if (emergencyOnly && !h.emergencySupported) return false;
        if (icuOnly && !h.icuAvailable) return false;
        if (is24x7 && !h.is24x7) return false;
        if (maxDistance > 0 && h.distance !== undefined && h.distance > maxDistance) return false;
        return true;
      })
      .sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));
  }, [search, city, emergencyOnly, icuOnly, is24x7, location, maxDistance]);

  const activeFilters = [city, emergencyOnly && "Emergency", icuOnly && "ICU", is24x7 && "24×7", maxDistance > 0 && "Distance"].filter(Boolean).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Find Hospitals</h1>
        <p className="text-muted-foreground mb-2">Search and filter hospitals near you</p>

        {/* Location status */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          {loading ? (
            <span className="flex items-center gap-1.5 text-primary">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Detecting location...
            </span>
          ) : location ? (
            <span className="flex items-center gap-1.5 text-success">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Showing hospitals sorted by distance
            </span>
          ) : (
            <button onClick={detect} className="text-primary hover:underline underline-offset-2">
              Enable location to see nearby hospitals
            </button>
          )}
        </div>

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
              showFilters || activeFilters > 0
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilters > 0 && (
              <span className="w-5 h-5 rounded-full bg-primary-foreground text-primary text-xs flex items-center justify-center font-bold">
                {activeFilters}
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
                onClick={() => { setCity(""); setEmergencyOnly(false); setIcuOnly(false); setIs24x7(false); setMaxDistance(0); }}
                className="text-sm text-primary hover:underline"
              >
                Clear all
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                >
                  <option value="">All Cities</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {location && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Max Distance</label>
                  <select
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                  >
                    <option value={0}>Any distance</option>
                    <option value={5}>Within 5 km</option>
                    <option value={10}>Within 10 km</option>
                    <option value={25}>Within 25 km</option>
                    <option value={50}>Within 50 km</option>
                    <option value={100}>Within 100 km</option>
                  </select>
                </div>
              )}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={emergencyOnly} onChange={(e) => setEmergencyOnly(e.target.checked)} className="rounded" />
                <span className="text-sm text-foreground">Emergency Support</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={icuOnly} onChange={(e) => setIcuOnly(e.target.checked)} className="rounded" />
                <span className="text-sm text-foreground">ICU Available</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={is24x7} onChange={(e) => setIs24x7(e.target.checked)} className="rounded" />
                <span className="text-sm text-foreground">24×7 Hospitals</span>
              </label>
            </div>
          </motion.div>
        )}

        {/* Results */}
        <div className="text-sm text-muted-foreground mb-4">{filtered.length} hospitals found</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((hospital) => (
            <HospitalCard key={hospital.id} hospital={hospital} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-medium">No hospitals found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default HospitalSearchPage;
