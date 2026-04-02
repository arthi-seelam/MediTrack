
-- 1. Unique index to prevent double booking
CREATE UNIQUE INDEX IF NOT EXISTS idx_no_double_booking 
ON public.appointments (doctor_id, appointment_date, appointment_time) 
WHERE status NOT IN ('cancelled', 'rejected');

-- 2. Users can cancel own pending appointments
CREATE POLICY "Users can cancel own pending appointments"
ON public.appointments FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND status = 'pending')
WITH CHECK (auth.uid() = user_id AND status = 'cancelled');

-- 3. Doctor ratings table
CREATE TABLE public.doctor_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  appointment_id uuid NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(appointment_id)
);

ALTER TABLE public.doctor_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ratings" ON public.doctor_ratings FOR SELECT USING (true);
CREATE POLICY "Users can rate after completed appointment" ON public.doctor_ratings FOR INSERT
TO authenticated WITH CHECK (
  auth.uid() = user_id 
  AND EXISTS (
    SELECT 1 FROM public.appointments 
    WHERE appointments.id = appointment_id 
    AND appointments.user_id = auth.uid() 
    AND appointments.status = 'completed'
  )
);

-- 4. Doctors can view own appointments
CREATE POLICY "Doctors can view own appointments"
ON public.appointments FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.doctors 
  WHERE doctors.id = appointments.doctor_id 
  AND doctors.user_id = auth.uid()
));

-- 5. Doctors can update own appointment status
CREATE POLICY "Doctors can update own appointment status"
ON public.appointments FOR UPDATE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.doctors 
  WHERE doctors.id = appointments.doctor_id 
  AND doctors.user_id = auth.uid()
));

-- 6. Enable realtime for doctor_ratings
ALTER PUBLICATION supabase_realtime ADD TABLE public.doctor_ratings;
