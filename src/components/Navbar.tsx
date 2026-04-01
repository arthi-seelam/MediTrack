import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Menu, X, MapPin, ChevronDown, Loader2, User, LogOut, CalendarCheck } from "lucide-react";
import { useState } from "react";
import { useLocationContext } from "@/contexts/LocationContext";
import { useAuth } from "@/hooks/useAuth";
import { CITIES } from "@/data/mockData";

const NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "Hospitals", path: "/hospitals" },
  { label: "Doctors", path: "/doctors" },
  { label: "Emergency", path: "/emergency" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const { selectedCity, setSelectedCity, detecting, detectLocation } = useLocationContext();

  return (
    <nav className="sticky top-0 z-50 glass-card border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary-foreground" fill="currentColor" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">MediTrack</span>
        </Link>

        {/* City selector */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-primary" />
            {detecting ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Detecting...
              </span>
            ) : (
              <span>{selectedCity || "Select City"}</span>
            )}
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>

          {cityDropdownOpen && (
            <div className="absolute top-full mt-1 left-0 w-56 bg-card border border-border rounded-xl shadow-lg py-1 z-50">
              <button
                onClick={() => { detectLocation(); setCityDropdownOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-primary hover:bg-muted transition-colors"
              >
                <MapPin className="w-4 h-4" />
                📍 Detect my location
              </button>
              <div className="border-t border-border my-1" />
              <button
                onClick={() => { setSelectedCity(""); setCityDropdownOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${!selectedCity ? "text-primary font-semibold" : "text-foreground"}`}
              >
                All Cities
              </button>
              {CITIES.map(c => (
                <button
                  key={c.name}
                  onClick={() => { setSelectedCity(c.name); setCityDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${selectedCity === c.name ? "text-primary font-semibold" : "text-foreground"}`}
                >
                  {c.name}, {c.state}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-lg bg-primary/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/emergency"
            className="px-4 py-2 rounded-lg bg-emergency text-emergency-foreground text-sm font-semibold emergency-pulse"
          >
            🚑 Emergency
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t bg-card px-4 pb-4"
        >
          {/* Mobile city selector */}
          <div className="py-3 border-b border-border mb-2">
            <button
              onClick={() => { detectLocation(); }}
              className="flex items-center gap-2 text-sm text-primary font-medium mb-2"
            >
              <MapPin className="w-4 h-4" />
              {detecting ? "Detecting..." : "📍 Detect my location"}
            </button>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
            >
              <option value="">All Cities</option>
              {CITIES.map(c => <option key={c.name} value={c.name}>{c.name}, {c.state}</option>)}
            </select>
          </div>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`block py-3 text-sm font-medium ${
                location.pathname === item.path ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/emergency"
            onClick={() => setMobileOpen(false)}
            className="mt-2 block w-full text-center px-4 py-3 rounded-lg bg-emergency text-emergency-foreground text-sm font-semibold"
          >
            🚑 Emergency
          </Link>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
