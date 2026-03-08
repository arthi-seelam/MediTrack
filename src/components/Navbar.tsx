import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "Hospitals", path: "/hospitals" },
  { label: "Doctors", path: "/doctors" },
  { label: "Emergency", path: "/emergency" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass-card border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary-foreground" fill="currentColor" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">MediTrack</span>
        </Link>

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
