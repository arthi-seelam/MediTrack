
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('user', 'hospital_admin', 'doctor', 'system_admin');

-- Create appointment status enum
CREATE TYPE public.appointment_status AS ENUM ('pending', 'confirmed', 'rejected', 'completed');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create hospitals table
CREATE TABLE public.hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  phone TEXT,
  opening_time TEXT,
  closing_time TEXT,
  is_24x7 BOOLEAN NOT NULL DEFAULT false,
  emergency_supported BOOLEAN NOT NULL DEFAULT false,
  icu_available BOOLEAN NOT NULL DEFAULT false,
  ambulance_available BOOLEAN NOT NULL DEFAULT false,
  blood_bank_available BOOLEAN NOT NULL DEFAULT false,
  trauma_support BOOLEAN NOT NULL DEFAULT false,
  ventilator_available BOOLEAN NOT NULL DEFAULT false,
  emergency_contact TEXT,
  image_url TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;

-- Create doctors table
CREATE TABLE public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  experience_years INTEGER NOT NULL DEFAULT 0,
  consultation_fee INTEGER NOT NULL DEFAULT 0,
  available_timings TEXT,
  rating NUMERIC(2,1) NOT NULL DEFAULT 0.0,
  consultation_type TEXT NOT NULL DEFAULT 'Offline',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  phone TEXT,
  problem_description TEXT,
  status appointment_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Enable realtime for appointments
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_hospitals_updated_at BEFORE UPDATE ON public.hospitals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON public.doctors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies

-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Hospitals: public read, admin write
CREATE POLICY "Anyone can view hospitals" ON public.hospitals FOR SELECT USING (true);
CREATE POLICY "Hospital admin can update own hospital" ON public.hospitals FOR UPDATE USING (auth.uid() = admin_user_id);
CREATE POLICY "Hospital admin can insert hospital" ON public.hospitals FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'hospital_admin'));

-- Doctors: public read, hospital admin write
CREATE POLICY "Anyone can view doctors" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Hospital admin can manage doctors" ON public.doctors FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.hospitals WHERE id = hospital_id AND admin_user_id = auth.uid())
);
CREATE POLICY "Hospital admin can update doctors" ON public.doctors FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.hospitals WHERE id = hospital_id AND admin_user_id = auth.uid())
);
CREATE POLICY "Hospital admin can delete doctors" ON public.doctors FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.hospitals WHERE id = hospital_id AND admin_user_id = auth.uid())
);

-- Appointments
CREATE POLICY "Users can view own appointments" ON public.appointments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Hospital admin can view hospital appointments" ON public.appointments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.hospitals WHERE id = hospital_id AND admin_user_id = auth.uid())
);
CREATE POLICY "Users can create appointments" ON public.appointments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Hospital admin can update appointment status" ON public.appointments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.hospitals WHERE id = hospital_id AND admin_user_id = auth.uid())
);
