import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { MapPin, Phone, Clock, Star, ArrowLeft, Building2, Stethoscope, Calendar, MessageCircle } from "lucide-react";
import { DOCTORS, HOSPITALS, Doctor } from "@/data/mockData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Get consultation type display text */
function getConsultationTypeText(type: Doctor["consultationType"]): string {
  switch (type) {
    case "Online": return "Online Consultation";
    case "Offline": return "In-Person Visit";
    case "Both": return "Online & In-Person";
    default: return type;
  }
}

const DoctorDetailPage = () => {
  const { id } = useParams();
  const doctor = DOCTORS.find(d => d.id === id);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    reason: "",
    patientName: "",
    phone: "",
  });

  if (!doctor) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-xl text-muted-foreground">Doctor not found</p>
        <Link to="/doctors" className="text-primary hover:underline mt-4 inline-block">← Back to doctors</Link>
      </div>
    );
  }

  const hospital = HOSPITALS.find(h => h.id === doctor.hospitalId);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to a backend
    alert(`Appointment booked successfully!\n\nDoctor: ${doctor.name}\nDate: ${bookingData.date}\nTime: ${bookingData.time}\nPatient: ${bookingData.patientName}\nPhone: ${bookingData.phone}\nReason: ${bookingData.reason}\n\nConsultation Fee: ₹${doctor.consultationFee}`);
    setIsBookingOpen(false);
    setBookingData({ date: "", time: "", reason: "", patientName: "", phone: "" });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/doctors" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to doctors
        </Link>

        {/* Header */}
        <div className="bg-card border border-border rounded-xl p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-2xl font-bold text-primary">
                {doctor.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>

              <div className="flex-1">
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">{doctor.name}</h1>

                <div className="flex items-center gap-2 mt-2">
                  <Stethoscope className="w-4 h-4 text-primary" />
                  <span className="text-lg font-medium text-primary">{doctor.specialization}</span>
                </div>

                <div className="flex items-center gap-1 mt-2 text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  <span>{doctor.hospitalName}</span>
                </div>

                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-warning" fill="currentColor" />
                    <span className="font-semibold text-warning">{doctor.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{doctor.availableTimings}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{doctor.experienceYears} years experience</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    doctor.consultationType === "Online" ? "bg-success/10 text-success" :
                    doctor.consultationType === "Offline" ? "bg-primary/10 text-primary" :
                    "bg-accent/10 text-accent"
                  }`}>
                    {getConsultationTypeText(doctor.consultationType)}
                  </span>
                  <span className="text-lg font-bold text-foreground">₹{doctor.consultationFee}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                <DialogTrigger asChild>
                  <button className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
                    📅 Book Appointment
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Book Appointment with {doctor.name}</DialogTitle>
                    <DialogDescription>
                      Fill in your details to schedule an appointment. Consultation fee: ₹{doctor.consultationFee}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="patientName">Patient Name</Label>
                        <Input
                          id="patientName"
                          placeholder="Enter your name"
                          value={bookingData.patientName}
                          onChange={(e) => setBookingData({ ...bookingData, patientName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter phone number"
                          value={bookingData.phone}
                          onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Preferred Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={bookingData.date}
                          onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time">Preferred Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={bookingData.time}
                          onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason for Visit</Label>
                      <Input
                        id="reason"
                        placeholder="Brief description of your health concern"
                        value={bookingData.reason}
                        onChange={(e) => setBookingData({ ...bookingData, reason: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="flex-1">
                        Confirm Booking
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsBookingOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              <button className="px-6 py-3 rounded-lg bg-secondary text-secondary-foreground font-semibold hover:opacity-90 transition-opacity">
                💬 Send Message
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-display font-bold text-lg text-foreground mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">{doctor.hospitalName}</p>
                  <p className="text-sm text-muted-foreground">{doctor.city}</p>
                </div>
              </div>
              {hospital && (
                <>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{hospital.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <a href={`tel:${hospital.phone}`} className="text-sm text-primary hover:underline">
                      {hospital.phone}
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Availability */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-display font-bold text-lg text-foreground mb-4">Availability</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Timings</p>
                  <p className="text-sm text-muted-foreground">{doctor.availableTimings}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Consultation Types</p>
                  <p className="text-sm text-muted-foreground">{getConsultationTypeText(doctor.consultationType)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hospital Information */}
        {hospital && (
          <div className="mt-6 bg-card border border-border rounded-xl p-6">
            <h2 className="font-display font-bold text-lg text-foreground mb-4">Hospital Information</h2>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{hospital.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{hospital.address}</p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1 text-warning font-semibold">
                    <Star className="w-3.5 h-3.5" fill="currentColor" />
                    {hospital.rating}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    hospital.is24x7 ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                  }`}>
                    {hospital.is24x7 ? "24×7" : "Regular Hours"}
                  </span>
                </div>
              </div>
              <Link
                to={`/hospitals/${hospital.id}`}
                className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 text-sm font-medium transition-colors"
              >
                View Hospital
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DoctorDetailPage;