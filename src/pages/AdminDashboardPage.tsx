import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Building2, Plus, Calendar, Users, LogOut, CheckCircle2, XCircle, Clock } from "lucide-react";

interface HospitalRow {
  id: string;
  name: string;
  city: string;
  address: string;
}

interface DoctorRow {
  id: string;
  name: string;
  specialization: string;
  experience_years: number;
  consultation_fee: number;
  available_timings: string | null;
  consultation_type: string;
  status: string;
}

interface AppointmentRow {
  id: string;
  appointment_date: string;
  appointment_time: string;
  patient_name: string;
  phone: string | null;
  problem_description: string | null;
  status: string;
  doctors: { name: string; specialization: string } | null;
}

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  confirmed: "bg-success/10 text-success border-success/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  completed: "bg-primary/10 text-primary border-primary/20",
  cancelled: "bg-muted text-muted-foreground border-border",
};

const AdminDashboardPage = () => {
  const { user, isHospitalAdmin, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [hospital, setHospital] = useState<HospitalRow | null>(null);
  const [doctors, setDoctors] = useState<DoctorRow[]>([]);
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [addDoctorOpen, setAddDoctorOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: "", specialization: "", experience_years: 0, consultation_fee: 500,
    available_timings: "9:00 AM - 5:00 PM", consultation_type: "Both",
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/admin/login"); return; }
    if (!isHospitalAdmin) {
      toast({ title: "Access denied", description: "You don't have hospital admin privileges.", variant: "destructive" });
      navigate("/");
      return;
    }
    fetchData();
  }, [user, isHospitalAdmin, authLoading]);

  const fetchData = async () => {
    if (!user) return;
    const { data: h } = await supabase.from("hospitals").select("*").eq("admin_user_id", user.id).limit(1).single();
    if (!h) { setLoading(false); return; }
    setHospital(h as unknown as HospitalRow);

    const [doctorsRes, appointmentsRes] = await Promise.all([
      supabase.from("doctors").select("*").eq("hospital_id", h.id),
      supabase.from("appointments").select("*, doctors(name, specialization)").eq("hospital_id", h.id).order("appointment_date", { ascending: false }),
    ]);
    setDoctors((doctorsRes.data as unknown as DoctorRow[]) ?? []);
    setAppointments((appointmentsRes.data as unknown as AppointmentRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (!hospital) return;
    const channel = supabase
      .channel("admin-appointments")
      .on("postgres_changes", { event: "*", schema: "public", table: "appointments", filter: `hospital_id=eq.${hospital.id}` }, () => fetchData())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [hospital]);

  const updateAppointmentStatus = async (id: string, status: string) => {
    await supabase.from("appointments").update({ status: status as "pending" | "confirmed" | "rejected" | "completed" }).eq("id", id);
    toast({ title: `Appointment ${status}` });
    fetchData();
  };

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospital) return;
    const { error } = await supabase.from("doctors").insert({
      ...newDoctor,
      hospital_id: hospital.id,
      rating: 0,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Doctor added successfully" });
      setAddDoctorOpen(false);
      setNewDoctor({ name: "", specialization: "", experience_years: 0, consultation_fee: 500, available_timings: "9:00 AM - 5:00 PM", consultation_type: "Both" });
      fetchData();
    }
  };

  const filteredAppointments = statusFilter === "all" ? appointments : appointments.filter((a) => a.status === statusFilter);

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Loading dashboard...</p></div>;
  }

  if (!hospital) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground">No Hospital Assigned</h2>
          <p className="text-muted-foreground mt-2">Contact system admin to assign your hospital.</p>
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
            <Building2 className="w-6 h-6 text-primary" />
            <div>
              <h1 className="font-display font-bold text-foreground">{hospital.name}</h1>
              <p className="text-sm text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="outline" size="sm">View Site</Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }}>
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Appointments", value: appointments.length, icon: Calendar },
            { label: "Pending", value: appointments.filter(a => a.status === "pending").length, icon: Clock },
            { label: "Confirmed", value: appointments.filter(a => a.status === "confirmed").length, icon: CheckCircle2 },
            { label: "Doctors", value: doctors.length, icon: Users },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <stat.icon className="w-4 h-4" />
                <span className="text-sm">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="appointments">
          <TabsList>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="doctors">Doctors</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-foreground">Appointments</h2>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredAppointments.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-8 text-center">
                <p className="text-muted-foreground">No appointments found</p>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointments.map((apt) => (
                      <TableRow key={apt.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{apt.patient_name}</p>
                            {apt.phone && <p className="text-sm text-muted-foreground">{apt.phone}</p>}
                            {apt.problem_description && <p className="text-xs text-muted-foreground mt-0.5">{apt.problem_description}</p>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{apt.doctors?.name}</p>
                          <p className="text-sm text-muted-foreground">{apt.doctors?.specialization}</p>
                        </TableCell>
                        <TableCell>
                          <p>{apt.appointment_date}</p>
                          <p className="text-sm text-muted-foreground">{apt.appointment_time}</p>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${statusColors[apt.status]} border capitalize`}>{apt.status}</Badge>
                        </TableCell>
                        <TableCell>
                          {apt.status === "pending" && (
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" className="text-success border-success/30 hover:bg-success/10" onClick={() => updateAppointmentStatus(apt.id, "confirmed")}>
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Accept
                              </Button>
                              <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => updateAppointmentStatus(apt.id, "rejected")}>
                                <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                              </Button>
                            </div>
                          )}
                          {apt.status === "confirmed" && (
                            <Button size="sm" variant="outline" onClick={() => updateAppointmentStatus(apt.id, "completed")}>
                              Mark Complete
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="doctors" className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-foreground">Doctors ({doctors.length})</h2>
              <Dialog open={addDoctorOpen} onOpenChange={setAddDoctorOpen}>
                <DialogTrigger asChild>
                  <Button><Plus className="w-4 h-4 mr-1" /> Add Doctor</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Doctor</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddDoctor} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Doctor Name</Label>
                      <Input value={newDoctor.name} onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Specialization</Label>
                      <Input value={newDoctor.specialization} onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Experience (years)</Label>
                        <Input type="number" value={newDoctor.experience_years} onChange={(e) => setNewDoctor({ ...newDoctor, experience_years: parseInt(e.target.value) || 0 })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Fee (₹)</Label>
                        <Input type="number" value={newDoctor.consultation_fee} onChange={(e) => setNewDoctor({ ...newDoctor, consultation_fee: parseInt(e.target.value) || 0 })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Available Timings</Label>
                      <Input value={newDoctor.available_timings} onChange={(e) => setNewDoctor({ ...newDoctor, available_timings: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Consultation Type</Label>
                      <Select value={newDoctor.consultation_type} onValueChange={(v) => setNewDoctor({ ...newDoctor, consultation_type: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Online">Online</SelectItem>
                          <SelectItem value="Offline">Offline</SelectItem>
                          <SelectItem value="Both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full">Add Doctor</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {doctors.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-8 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No doctors added yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctors.map((doc) => (
                  <div key={doc.id} className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{doc.name}</h3>
                        <p className="text-sm text-primary">{doc.specialization}</p>
                        <p className="text-sm text-muted-foreground mt-1">{doc.experience_years} yrs exp • ₹{doc.consultation_fee}</p>
                        <p className="text-sm text-muted-foreground">{doc.available_timings}</p>
                      </div>
                      <Badge variant={doc.status === "active" ? "default" : "secondary"} className="capitalize">{doc.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
