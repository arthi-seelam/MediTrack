import { Hospital } from "@/data/mockData";
import { MapPin, Phone, Clock, Star, Navigation, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const HospitalCard = ({ hospital }: { hospital: Hospital }) => {
  const isOpen = hospital.is24x7 || (() => {
    const now = new Date();
    const h = now.getHours();
    const open = parseInt(hospital.openingTime);
    const close = parseInt(hospital.closingTime);
    return h >= open && h <= close;
  })();

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Top accent */}
      <div className="h-1.5 bg-primary" />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-display font-bold text-lg text-card-foreground group-hover:text-primary transition-colors">
              {hospital.name}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
              <MapPin className="w-3.5 h-3.5" />
              <span>{hospital.address}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-warning/10 text-warning px-2 py-1 rounded-md text-sm font-semibold">
            <Star className="w-3.5 h-3.5" fill="currentColor" />
            {hospital.rating}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            hospital.is24x7 ? "bg-success/10 text-success" :
            isOpen ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
          }`}>
            {hospital.is24x7 ? "24×7" : isOpen ? "Open" : "Closed"}
          </span>
          {hospital.emergencySupported && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-emergency/10 text-emergency font-medium">Emergency</span>
          )}
          {hospital.icuAvailable && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">ICU</span>
          )}
          {hospital.ambulanceAvailable && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Ambulance</span>
          )}
        </div>

        {/* Info row */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Phone className="w-3.5 h-3.5" />
            <span>{hospital.phone}</span>
          </div>
          {hospital.distance !== undefined && (
            <div className="flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5" />
              <span>{hospital.distance} km</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href={`tel:${hospital.phone}`}
            className="flex-1 text-center py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            📞 Call Now
          </a>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 text-center py-2.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            🗺️ Directions
          </a>
          <Link
            to={`/hospitals/${hospital.id}`}
            className="p-2.5 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HospitalCard;
