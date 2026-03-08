import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { DOCTORS, SPECIALTIES } from "@/data/mockData";
import DoctorCard from "@/components/DoctorCard";

const DoctorSearchPage = () => {
  const [searchParams] = useSearchParams();
  const initialSpecialty = searchParams.get("specialty") || "";

  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState(initialSpecialty);
  const [consultationType, setConsultationType] = useState("");

  const filtered = useMemo(() => {
    return DOCTORS.filter(d => {
      if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (specialty && d.specialization.toLowerCase() !== SPECIALTIES.find(s => s.slug === specialty)?.label.toLowerCase()) return false;
      if (consultationType && d.consultationType !== consultationType && d.consultationType !== 'Both') return false;
      return true;
    });
  }, [search, specialty, consultationType]);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Find Doctors</h1>
        <p className="text-muted-foreground mb-6">Search by specialty, name, or consultation type</p>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="flex-1 flex items-center bg-card border border-border rounded-xl overflow-hidden">
            <Search className="w-5 h-5 text-muted-foreground ml-4" />
            <input
              type="text"
              placeholder="Search doctors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
            />
          </div>
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm"
          >
            <option value="">All Specialties</option>
            {SPECIALTIES.map(s => <option key={s.slug} value={s.slug}>{s.label}</option>)}
          </select>
          <select
            value={consultationType}
            onChange={(e) => setConsultationType(e.target.value)}
            className="px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm"
          >
            <option value="">All Types</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>
        </div>

        <div className="text-sm text-muted-foreground mb-4">{filtered.length} doctors found</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map(doctor => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-medium">No doctors found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DoctorSearchPage;
