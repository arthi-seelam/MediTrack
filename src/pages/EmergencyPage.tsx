import { motion } from "framer-motion";
import { Siren, Phone, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { HOSPITALS } from "@/data/mockData";
import HospitalCard from "@/components/HospitalCard";
import { useLocationContext } from "@/contexts/LocationContext";
import { calculateDistance } from "@/hooks/use-geolocation";

const EmergencyPage = () => {
  const { selectedCity, userCoords, detecting, detectLocation } = useLocationContext();

  const emergencyHospitals = HOSPITALS
    .filter(h => h.emergencySupported)
    .filter(h => selectedCity ? h.city === selectedCity : true)
    .map(h => ({
      ...h,
      distance: userCoords ? calculateDistance(userCoords.lat, userCoords.lng, h.lat, h.lng) : undefined,
    }))
    .sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Emergency hero */}
        <div className="bg-emergency/5 border-2 border-emergency/20 rounded-2xl p-8 md:p-12 text-center mb-8">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <button className="w-32 h-32 rounded-full bg-emergency text-emergency-foreground flex items-center justify-center mx-auto emergency-pulse mb-6 hover:opacity-90 transition-opacity">
              <Siren className="w-16 h-16" />
            </button>
          </motion.div>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-foreground mb-2">
            Emergency Services {selectedCity && `in ${selectedCity}`}
          </h1>
          <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
            Tap the button above or call emergency services immediately. We'll show you the nearest hospitals with emergency support.
          </p>

          {/* Location status */}
          <div className="flex items-center justify-center gap-2 text-sm mb-6">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            {detecting ? (
              <span className="flex items-center gap-1.5 text-primary">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Detecting your location...
              </span>
            ) : selectedCity ? (
              <span className="flex items-center gap-1.5 text-success">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Showing emergency hospitals in {selectedCity}
              </span>
            ) : (
              <button onClick={detectLocation} className="text-primary hover:underline underline-offset-2">
                Enable location for nearest results
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="tel:112"
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-emergency text-emergency-foreground font-bold text-lg hover:opacity-90"
            >
              <Phone className="w-5 h-5" />
              Call 112 (Emergency)
            </a>
            <a
              href="tel:108"
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90"
            >
              <Phone className="w-5 h-5" />
              Call 108 (Ambulance)
            </a>
          </div>
        </div>

        {/* Quick services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Emergency Hospitals", count: emergencyHospitals.length, icon: "🏥" },
            { label: "Ambulance Services", count: emergencyHospitals.filter(h => h.ambulanceAvailable).length, icon: "🚑" },
            { label: "Blood Banks", count: emergencyHospitals.filter(h => h.bloodBankAvailable).length, icon: "🩸" },
          ].map(item => (
            <div key={item.label} className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
              <span className="text-3xl">{item.icon}</span>
              <div>
                <div className="font-display font-bold text-2xl text-foreground">{item.count}</div>
                <div className="text-sm text-muted-foreground">{item.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency hospitals */}
        <h2 className="font-display text-xl font-bold text-foreground mb-4">
          {selectedCity ? `Emergency Hospitals in ${selectedCity}` : "Nearest Emergency Hospitals"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {emergencyHospitals.map(hospital => (
            <HospitalCard key={hospital.id} hospital={hospital} />
          ))}
        </div>
        {emergencyHospitals.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-medium">No emergency hospitals found{selectedCity ? ` in ${selectedCity}` : ""}</p>
            <p className="text-sm mt-1">Try selecting a different city</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default EmergencyPage;
