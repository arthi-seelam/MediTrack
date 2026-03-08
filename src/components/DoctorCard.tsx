import { Doctor } from "@/data/mockData";
import { Star, Clock, Building2, Stethoscope } from "lucide-react";

const DoctorCard = ({ doctor }: { doctor: Doctor }) => {
  const initials = doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 p-5">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-lg shrink-0">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-lg text-card-foreground">{doctor.name}</h3>
          <div className="flex items-center gap-1.5 text-sm text-primary font-medium mt-0.5">
            <Stethoscope className="w-3.5 h-3.5" />
            {doctor.specialization}
          </div>

          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>{doctor.hospitalName}</span>
            </div>
            <span>•</span>
            <span>{doctor.experienceYears} yrs exp</span>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1 text-warning text-sm font-semibold">
              <Star className="w-3.5 h-3.5" fill="currentColor" />
              {doctor.rating}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {doctor.availableTimings}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              doctor.consultationType === 'Online' ? 'bg-success/10 text-success' :
              doctor.consultationType === 'Offline' ? 'bg-primary/10 text-primary' :
              'bg-accent text-accent-foreground'
            }`}>
              {doctor.consultationType}
            </span>
            <span className="text-sm font-semibold text-foreground">₹{doctor.consultationFee}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
          Book Appointment
        </button>
        <button className="flex-1 py-2.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
          View Profile
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
