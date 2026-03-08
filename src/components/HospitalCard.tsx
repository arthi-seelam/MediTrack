import { Hospital } from "@/data/mockData";
import { MapPin, Phone, Star, Navigation } from "lucide-react";
import { Link } from "react-router-dom";

interface HospitalCardProps {
  readonly hospital: Hospital;
}

/** Check if hospital is currently open */
function isHospitalOpen(hospital: Hospital): boolean {
  if (hospital.is24x7) return true;

  const now = new Date();
  const currentHour = now.getHours();
  const openingHour = parseInt(hospital.openingTime);
  const closingHour = parseInt(hospital.closingTime);

  return currentHour >= openingHour && currentHour <= closingHour;
}

/** Get status badge styling based on availability */
function getStatusBadgeStyles(hospital: Hospital): string {
  if (hospital.is24x7) return "bg-success/10 text-success";
  return isHospitalOpen(hospital) ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive";
}

/** Get status label text */
function getStatusText(hospital: Hospital): string {
  if (hospital.is24x7) return "24×7";
  return isHospitalOpen(hospital) ? "Open" : "Closed";
}

/**
 * Displays hospital information card with key details
 */
const HospitalCard: React.FC<HospitalCardProps> = ({ hospital }) => {
  const statusStyles = getStatusBadgeStyles(hospital);
  const statusText = getStatusText(hospital);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-lg">
      {/* Top accent bar */}
      <div className="h-1.5 bg-primary" />

      <div className="p-5">
        {/* Header with name and rating */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-display text-lg font-bold text-card-foreground">
              {hospital.name}
            </h3>
            <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>{hospital.address}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-md bg-warning/10 px-2 py-1 text-sm font-semibold text-warning">
            <Star className="h-3.5 w-3.5" fill="currentColor" />
            {hospital.rating}
          </div>
        </div>

        {/* Status and facility tags */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles}`}>
            {statusText}
          </span>
          {hospital.emergencySupported && (
            <span className="rounded-full bg-emergency/10 px-2 py-0.5 text-xs font-medium text-emergency">
              Emergency
            </span>
          )}
          {hospital.icuAvailable && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              ICU
            </span>
          )}
          {hospital.ambulanceAvailable && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              Ambulance
            </span>
          )}
        </div>

        {/* Contact info */}
        <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Phone className="h-3.5 w-3.5" />
            <span>{hospital.phone}</span>
          </div>
          {hospital.distance !== undefined && (
            <div className="flex items-center gap-1">
              <Navigation className="h-3.5 w-3.5" />
              <span>{hospital.distance} km</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <a
            href={`tel:${hospital.phone}`}
            className="flex-1 rounded-lg bg-primary py-2.5 text-center text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            📞 Call Now
          </a>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 rounded-lg bg-secondary py-2.5 text-center text-sm font-semibold text-secondary-foreground transition-opacity hover:opacity-90"
          >
            🗺️ Directions
          </a>
          <Link
            to={`/hospitals/${hospital.id}`}
            className="flex-1 rounded-lg bg-muted py-2.5 text-center text-sm font-semibold text-muted-foreground transition-opacity hover:opacity-90"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HospitalCard;