import { Doctor } from "@/data/mockData";
import { Star, Clock, Building2, Stethoscope } from "lucide-react";

interface DoctorCardProps {
  readonly doctor: Doctor;
}

/** Extract initials from doctor name for avatar */
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Get Tailwind classes for consultation type badge */
function getConsultationTypeStyles(type: Doctor["consultationType"]): string {
  const styleMap: Record<Doctor["consultationType"], string> = {
    Online: "bg-success/10 text-success",
    Offline: "bg-primary/10 text-primary",
    Both: "bg-accent/10 text-accent",
  };
  return styleMap[type];
}

/**
 * Displays doctor profile card with key information
 */
const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const initials = getInitials(doctor.name);
  const consultationStyles = getConsultationTypeStyles(doctor.consultationType);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-lg font-bold text-primary">
          {initials}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-bold text-card-foreground">
            {doctor.name}
          </h3>

          <div className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-primary">
            <Stethoscope className="h-3.5 w-3.5" />
            {doctor.specialization}
          </div>

          <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              <span>{doctor.hospitalName}</span>
            </div>
            <span>•</span>
            <span>{doctor.experienceYears} yrs exp</span>
          </div>

          <div className="mt-2 flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm font-semibold text-warning">
              <Star className="h-3.5 w-3.5" fill="currentColor" />
              {doctor.rating}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {doctor.availableTimings}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${consultationStyles}`}>
              {doctor.consultationType}
            </span>
            <span className="text-sm font-semibold text-foreground">
              ₹{doctor.consultationFee}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-2">
        <button className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
          Book Appointment
        </button>
        <button className="flex-1 rounded-lg bg-secondary py-2.5 text-sm font-semibold text-secondary-foreground transition-opacity hover:opacity-90">
          View Profile
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;