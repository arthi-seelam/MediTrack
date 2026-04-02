import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";

interface Props {
  appointmentId: string;
  doctorId: string;
  doctorName: string;
  userId: string;
  onRated?: () => void;
}

const RateAppointmentDialog = ({ appointmentId, doctorId, doctorName, userId, onRated }: Props) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) { toast({ title: "Please select a rating", variant: "destructive" }); return; }
    setLoading(true);
    const { error } = await supabase.from("doctor_ratings").insert({
      user_id: userId,
      doctor_id: doctorId,
      appointment_id: appointmentId,
      rating,
      review: review.trim() || null,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message.includes("duplicate") ? "You already rated this appointment." : error.message, variant: "destructive" });
    } else {
      toast({ title: "Thank you!", description: "Your rating has been submitted." });
      setOpen(false);
      onRated?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1">
          <Star className="w-3.5 h-3.5" /> Rate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Rate Dr. {doctorName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${star <= (hover || rating) ? "text-warning fill-warning" : "text-muted-foreground"}`}
                />
              </button>
            ))}
          </div>
          <textarea
            placeholder="Write a review (optional)"
            value={review}
            onChange={e => setReview(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? "Submitting..." : "Submit Rating"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RateAppointmentDialog;
