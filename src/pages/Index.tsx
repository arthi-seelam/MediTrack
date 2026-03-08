import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin, Building2, UserRound, Siren, Heart, Brain, Baby, Bone, Stethoscope, Eye } from "lucide-react";
import { useState } from "react";
import { SPECIALTIES } from "@/data/mockData";

const SPECIALTY_ICONS: Record<string, React.ReactNode> = {
  cardiology: <Heart className="w-6 h-6" />,
  dermatology: <Eye className="w-6 h-6" />,
  pediatrics: <Baby className="w-6 h-6" />,
  orthopedics: <Bone className="w-6 h-6" />,
  neurology: <Brain className="w-6 h-6" />,
  general: <Stethoscope className="w-6 h-6" />,
  gynecology: <UserRound className="w-6 h-6" />,
  ophthalmology: <Eye className="w-6 h-6" />,
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/20" />
        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Heart className="w-4 h-4" fill="currentColor" />
              Your Health, Our Priority
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold text-foreground leading-tight">
              Find Healthcare
              <span className="text-primary"> Near You</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              Discover hospitals, doctors, and emergency services instantly. Fast, reliable, and always available.
            </p>

            {/* Search bar */}
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="flex items-center bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                <Search className="w-5 h-5 text-muted-foreground ml-4" />
                <input
                  type="text"
                  placeholder="Search hospitals, doctors, or specialties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-4 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
                />
                <button className="px-6 py-4 bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                  Search
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 mt-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <button className="hover:text-primary transition-colors underline underline-offset-2">
                  Detect my location
                </button>
                <span>or type your city</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="container mx-auto px-4 -mt-4 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {[
            { label: "Find Hospital", icon: <Building2 className="w-6 h-6" />, path: "/hospitals", color: "bg-primary/10 text-primary" },
            { label: "Find Doctor", icon: <UserRound className="w-6 h-6" />, path: "/doctors", color: "bg-success/10 text-success" },
            { label: "Emergency Services", icon: <Siren className="w-6 h-6" />, path: "/emergency", color: "bg-emergency/10 text-emergency" },
          ].map((action, i) => (
            <motion.div key={action.label} {...fadeUp} transition={{ delay: i * 0.1 }}>
              <Link
                to={action.path}
                className="flex items-center gap-4 p-5 rounded-xl bg-card border border-border hover:shadow-md transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}>
                  {action.icon}
                </div>
                <span className="font-display font-semibold text-card-foreground group-hover:text-primary transition-colors">
                  {action.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Specialties */}
      <section className="container mx-auto px-4 py-12">
        <motion.div {...fadeUp} className="text-center mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Browse by Specialty</h2>
          <p className="text-muted-foreground mt-2">Find the right specialist for your health needs</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {SPECIALTIES.map((spec, i) => (
            <motion.div key={spec.slug} {...fadeUp} transition={{ delay: i * 0.05 }}>
              <Link
                to={`/doctors?specialty=${spec.slug}`}
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card border border-border hover:shadow-md hover:border-primary/30 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {SPECIALTY_ICONS[spec.slug] || <Stethoscope className="w-6 h-6" />}
                </div>
                <span className="font-medium text-sm text-card-foreground">{spec.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { value: "500+", label: "Hospitals" },
            { value: "2,000+", label: "Doctors" },
            { value: "50+", label: "Cities" },
            { value: "24/7", label: "Support" },
          ].map((stat, i) => (
            <motion.div key={stat.label} {...fadeUp} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="font-display text-3xl md:text-4xl font-extrabold text-primary">{stat.value}</div>
              <div className="text-muted-foreground text-sm mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2026 MediTrack. All rights reserved. Your health, our priority.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
