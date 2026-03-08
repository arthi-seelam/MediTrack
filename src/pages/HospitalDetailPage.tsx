import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Star, ArrowLeft, CheckCircle2, XCircle, Building2 } from "lucide-react";
import { HOSPITALS, DOCTORS, Hospital } from "@/data/mockData";
import DoctorCard from "@/components/DoctorCard";

/** Build facility list from hospital data */
function getFacilities(hospital: Hospital) {
  return [
    { label: "Emergency Services", available: hospital.emergencySupported },
    { label: "ICU", available: hospital.icuAvailable },
    { label: "Ambulance", available: hospital.ambulanceAvailable },
    { label: "Blood Bank", available: hospital.bloodBankAvailable },
    { label: "Trauma Care", available: hospital.traumaSupport },
    { label: "Ventilator", available: hospital.ventilatorAvailable },
  ];
}

const HospitalDetailPage = () => {
  const { id } = useParams();
  const hospital = HOSPITALS.find(h => h.id === id);

  if (!hospital) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-xl text-muted-foreground">Hospital not found</p>
        <Link to="/hospitals" className="text-primary hover:underline mt-4 inline-block">← Back to hospitals</Link>
      </div>
    );
  }

  const hospitalDoctors = DOCTORS.filter(d => d.hospitalId === hospital.id);
  const facilities = getFacilities(hospital);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/hospitals" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to hospitals
        </Link>

        {/* Header */}
        <div className="bg-card border border-border rounded-xl p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {hospital.verified && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">✓ Verified</span>
                )}
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  hospital.is24x7 ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                }`}>
                  {hospital.is24x7 ? "Open 24×7" : `${hospital.openingTime} - ${hospital.closingTime}`}
                </span>
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">{hospital.name}</h1>
              <div className="flex items-center gap-1 mt-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{hospital.address}</span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {hospital.phone}
                </div>
                <div className="flex items-center gap-1 text-warning font-semibold">
                  <Star className="w-4 h-4" fill="currentColor" />
                  {hospital.rating} ({hospital.reviewCount} reviews)
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <a href={`tel:${hospital.phone}`} className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
                📞 Call Now
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold"
              >
                🗺️ Directions
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Facilities */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-display font-bold text-lg text-foreground mb-4">Facilities</h2>
            <div className="space-y-3">
              {facilities.map(f => (
                <div key={f.label} className="flex items-center gap-2">
                  {f.available
                    ? <CheckCircle2 className="w-5 h-5 text-success" />
                    : <XCircle className="w-5 h-5 text-muted-foreground/40" />
                  }
                  <span className={`text-sm ${f.available ? "text-foreground" : "text-muted-foreground"}`}>{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Departments */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-display font-bold text-lg text-foreground mb-4">Departments</h2>
            <div className="flex flex-wrap gap-2">
              {hospital.departments.map(dept => (
                <span key={dept} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                  {dept}
                </span>
              ))}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-display font-bold text-lg text-foreground mb-4">Emergency</h2>
            {hospital.emergencySupported ? (
              <div>
                <p className="text-sm text-muted-foreground mb-3">24/7 emergency services available</p>
                <a
                  href={`tel:${hospital.emergencyContact}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-emergency text-emergency-foreground font-semibold text-sm emergency-pulse"
                >
                  🚑 {hospital.emergencyContact}
                </a>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No emergency services at this hospital</p>
            )}
          </div>
        </div>

        {/* Map embed placeholder */}
        <div className="mt-6 bg-card border border-border rounded-xl overflow-hidden">
          <iframe
            title="Hospital Location"
            width="100%"
            height="300"
            style={{ border: 0 }}
            loading="lazy"
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${hospital.lat},${hospital.lng}&zoom=15`}
          />
        </div>

        {/* Doctors at this hospital */}
        {hospitalDoctors.length > 0 && (
          <div className="mt-8">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              Doctors at {hospital.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {hospitalDoctors.map(doctor => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default HospitalDetailPage;
