import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RateAppointmentDialog from "@/components/RateAppointmentDialog";

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  patient_name: string;
  problem_description: string | null;
  status: string;
  doctor_id: string;
  doctors: { name: string; specialization: string } | null;
  hospitals: { name: string } | null;
}

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  confirmed: "bg-success/10 text-success border-success/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  completed: "bg-primary/10 text-primary border-primary/20",
  cancelled: "bg-muted text-muted-foreground border-border",
};

const UserDashboardPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [ratedIds, setRatedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("appointments")
      .select("*, doctors(name, specialization), hospitals(name)")
      .eq("user_id", user.id)
      .order("appointment_date", { ascending: false });
    const apts = (data as unknown as Appointment[]) ?? [];
    setAppointments(apts);

    // Check which completed ones are already rated
    const completedIds = apts.filter(a => a.status === "completed").map(a => a.id);
    if (completedIds.length > 0) {
      const { data: ratings } = await supabase.from("doctor_ratings").select("appointment_id").in("appointment_id", completedIds);
      setRatedIds(new Set(ratings?.map(r => r.appointment_id) ?? []));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    fetchAppointments();
    const channel = supabase
      .channel("user-appointments")
      .on("postgres_changes", { event: "*", schema: "public", table: "appointments", filter: `user_id=eq.${user.id}` }, () => fetchAppointments())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const cancelAppointment = async (id: string) => {
    const { error } = await supabase.from("appointments").update({ status: "cancelled" as any }).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Appointment cancelled" });
      fetchAppointments();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <h1 className="font-display text-2xl font-bold text-foreground mb-6">My Appointments</h1>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : appointments.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">No appointments yet</p>
            <p className="text-muted-foreground mt-1">Book an appointment with a doctor to get started</p>
            <Link to="/doctors" className="mt-4 inline-block text-primary hover:underline">Find a doctor →</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div key={apt.id} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{apt.doctors?.name ?? "Doctor"}</h3>
                    <p className="text-sm text-muted-foreground">{apt.doctors?.specialization} • {apt.hospitals?.name}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{apt.appointment_date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{apt.appointment_time}</span>
                    </div>
                    {apt.problem_description && <p className="text-sm text-muted-foreground mt-2">Reason: {apt.problem_description}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={`${statusColors[apt.status]} border capitalize`}>{apt.status}</Badge>
                    {apt.status === "pending" && (
                      <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => cancelAppointment(apt.id)}>
                        Cancel
                      </Button>
                    )}
                    {apt.status === "completed" && !ratedIds.has(apt.id) && (
                      <RateAppointmentDialog
                        appointmentId={apt.id}
                        doctorId={apt.doctor_id}
                        doctorName={apt.doctors?.name ?? "Doctor"}
                        userId={user!.id}
                        onRated={fetchAppointments}
                      />
                    )}
                    {apt.status === "completed" && ratedIds.has(apt.id) && (
                      <span className="text-xs text-muted-foreground">✓ Rated</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UserDashboardPage;
