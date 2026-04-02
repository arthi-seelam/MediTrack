import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Stethoscope, Calendar, Clock, CheckCircle2, XCircle, LogOut, Star } from "lucide-react";

interface AppointmentRow {
  id: string;
  appointment_date: string;
  appointment_time: string;
  patient_name: string;
  phone: string | null;
  problem_description: string | null;
  status: string;
  hospitals: { name: string } | null;
}

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  confirmed: "bg-success/10 text-success border-success/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  completed: "bg-primary/10 text-primary border-primary/20",
  cancelled: "bg-muted text-muted-foreground border-border",
};

const DoctorDashboardPage = () => {
  const { user, roles, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [doctorInfo, setDoctorInfo] = useState<{ id: string; name: string; specialization: string } | null>(null);
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const isDoctor = roles.includes("doctor");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth"); return; }
    if (!isDoctor) {
      toast({ title: "Access denied", description: "You don't have doctor privileges.", variant: "destructive" });
      navigate("/");
      return;
    }
    fetchData();
  }, [user, isDoctor, authLoading]);

  const fetchData = async () => {
    if (!user) return;
    const { data: doc } = await supabase.from("doctors").select("id, name, specialization").eq("user_id", user.id).limit(1).single();
    if (!doc) { setLoading(false); return; }
    setDoctorInfo(doc);

    const { data: apts } = await supabase
      .from("appointments")
      .select("*, hospitals(name)")
      .eq("doctor_id", doc.id)
      .order("appointment_date", { ascending: false });
    setAppointments((apts as unknown as AppointmentRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (!doctorInfo) return;
    const channel = supabase
      .channel("doctor-appointments")
      .on("postgres_changes", { event: "*", schema: "public", table: "appointments", filter: `doctor_id=eq.${doctorInfo.id}` }, () => fetchData())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [doctorInfo]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("appointments").update({ status: status as any }).eq("id", id);
    toast({ title: `Appointment ${status}` });
    fetchData();
  };

  const filtered = statusFilter === "all" ? appointments : appointments.filter(a => a.status === statusFilter);

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Loading dashboard...</p></div>;
  }

  if (!doctorInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 text-center">
        <div>
          <Stethoscope className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground">No Doctor Profile Found</h2>
          <p className="text-muted-foreground mt-2">Your account is not linked to a doctor profile yet.</p>
          <Button variant="outline" onClick={() => { signOut(); navigate("/"); }} className="mt-4">Sign Out</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Stethoscope className="w-6 h-6 text-primary" />
            <div>
              <h1 className="font-display font-bold text-foreground">Dr. {doctorInfo.name}</h1>
              <p className="text-sm text-muted-foreground">{doctorInfo.specialization}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/"><Button variant="outline" size="sm">View Site</Button></Link>
            <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }}>
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total", value: appointments.length, icon: Calendar },
            { label: "Pending", value: appointments.filter(a => a.status === "pending").length, icon: Clock },
            { label: "Confirmed", value: appointments.filter(a => a.status === "confirmed").length, icon: CheckCircle2 },
            { label: "Avg Rating", value: "—", icon: Star },
          ].map(stat => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <stat.icon className="w-4 h-4" />
                <span className="text-sm">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-foreground">My Appointments</h2>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Filter" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <p className="text-muted-foreground">No appointments found</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(apt => (
                  <TableRow key={apt.id}>
                    <TableCell>
                      <p className="font-medium text-foreground">{apt.patient_name}</p>
                      {apt.phone && <p className="text-sm text-muted-foreground">{apt.phone}</p>}
                      {apt.problem_description && <p className="text-xs text-muted-foreground mt-0.5">{apt.problem_description}</p>}
                    </TableCell>
                    <TableCell>{apt.hospitals?.name ?? "—"}</TableCell>
                    <TableCell>
                      <p>{apt.appointment_date}</p>
                      <p className="text-sm text-muted-foreground">{apt.appointment_time}</p>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${statusColors[apt.status] ?? ""} border capitalize`}>{apt.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {apt.status === "pending" && (
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="text-success border-success/30 hover:bg-success/10" onClick={() => updateStatus(apt.id, "confirmed")}>
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Accept
                          </Button>
                          <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => updateStatus(apt.id, "rejected")}>
                            <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                          </Button>
                        </div>
                      )}
                      {apt.status === "confirmed" && (
                        <Button size="sm" variant="outline" onClick={() => updateStatus(apt.id, "completed")}>Mark Complete</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboardPage;
