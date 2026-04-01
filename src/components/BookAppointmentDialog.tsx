import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "lucide-react";

interface BookAppointmentDialogProps {
  doctorId: string;
  doctorName: string;
  hospitalId: string;
  consultationFee: number;
  trigger?: React.ReactNode;
}

const BookAppointmentDialog = ({ doctorId, doctorName, hospitalId, consultationFee, trigger }: BookAppointmentDialogProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    date: "",
    time: "",
    patientName: "",
    phone: "",
    reason: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({ title: "Please sign in", description: "You need to be logged in to book an appointment.", variant: "destructive" });
      navigate("/auth");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("appointments").insert({
      user_id: user.id,
      doctor_id: doctorId,
      hospital_id: hospitalId,
      appointment_date: data.date,
      appointment_time: data.time,
      patient_name: data.patientName,
      phone: data.phone || null,
      problem_description: data.reason || null,
    });
    setLoading(false);

    if (error) {
      toast({ title: "Booking failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Appointment booked!", description: "Your appointment is pending confirmation from the hospital." });
      setOpen(false);
      setData({ date: "", time: "", patientName: "", phone: "", reason: "" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Calendar className="w-4 h-4" /> Book Appointment
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Book Appointment with {doctorName}</DialogTitle>
          <DialogDescription>Consultation fee: ₹{consultationFee}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bk-name">Patient Name</Label>
              <Input id="bk-name" placeholder="Your name" value={data.patientName} onChange={(e) => setData({ ...data, patientName: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bk-phone">Phone</Label>
              <Input id="bk-phone" type="tel" placeholder="Phone number" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bk-date">Date</Label>
              <Input id="bk-date" type="date" value={data.date} onChange={(e) => setData({ ...data, date: e.target.value })} min={new Date().toISOString().split("T")[0]} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bk-time">Time</Label>
              <Input id="bk-time" type="time" value={data.time} onChange={(e) => setData({ ...data, time: e.target.value })} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bk-reason">Reason for visit</Label>
            <Input id="bk-reason" placeholder="Brief description" value={data.reason} onChange={(e) => setData({ ...data, reason: e.target.value })} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Booking..." : "Confirm Booking"}
            </Button>
            <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookAppointmentDialog;
