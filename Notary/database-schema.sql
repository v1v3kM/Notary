
-- Extensions: use pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email varchar(255) UNIQUE NOT NULL,
  phone varchar(20),
  name varchar(255) NOT NULL,
  role varchar(20) CHECK (role IN ('client', 'lawyer')) NOT NULL DEFAULT 'client',
  aadhaar_number varchar(12),
  pan_number varchar(10),
  address text,
  specialization varchar(255), -- Only for lawyers
  is_verified boolean DEFAULT false,
  profile_photo_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Lawyer Profiles table
CREATE TABLE IF NOT EXISTS public.lawyer_profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  specialization text[] NOT NULL DEFAULT '{}',
  experience_years integer NOT NULL DEFAULT 0,
  price_range_min bigint NOT NULL DEFAULT 0, -- in paise (Indian currency smallest unit)
  price_range_max bigint NOT NULL DEFAULT 0, -- in paise
  location varchar(255) NOT NULL,
  bio text,
  languages text[] NOT NULL DEFAULT '{"English"}',
  consultation_modes text[] NOT NULL DEFAULT '{"video"}' 
    CHECK (consultation_modes <@ ARRAY['video', 'phone', 'in-person']),
  rating decimal(3,2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  total_reviews integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  available_from time DEFAULT '09:00:00',
  available_to time DEFAULT '17:00:00',
  working_days integer[] DEFAULT '{1,2,3,4,5}' -- 0=Sunday, 1=Monday, etc.
    CHECK (working_days <@ ARRAY[0,1,2,3,4,5,6]),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id)
);

-- 3. Availability Slots table
CREATE TABLE IF NOT EXISTS public.availability_slots (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  lawyer_id uuid REFERENCES public.lawyer_profiles(user_id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean DEFAULT true,
  price bigint NOT NULL DEFAULT 0, -- in paise
  consultation_mode varchar(20) DEFAULT 'video'
    CHECK (consultation_mode IN ('video', 'phone', 'in-person')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(lawyer_id, date, start_time)
);

-- 4. Appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  lawyer_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  lawyer_profile_id uuid REFERENCES public.lawyer_profiles(id) ON DELETE CASCADE NOT NULL,
  slot_id uuid REFERENCES public.availability_slots(id) ON DELETE SET NULL,
  scheduled_date date NOT NULL,
  scheduled_time time NOT NULL,
  duration integer DEFAULT 60, -- in minutes
  consultation_mode varchar(20) NOT NULL
    CHECK (consultation_mode IN ('video', 'phone', 'in-person')),
  document_type varchar(255),
  description text,
  urgency varchar(10) DEFAULT 'medium'
    CHECK (urgency IN ('low', 'medium', 'high')),
  status varchar(20) DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show')),
  amount bigint NOT NULL DEFAULT 0, -- in paise
  payment_status varchar(20) DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  meeting_link text,
  notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Appointment Payments table
CREATE TABLE IF NOT EXISTS public.appointment_payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  amount bigint NOT NULL, -- in paise
  currency varchar(3) DEFAULT 'INR',
  payment_method varchar(50),
  razorpay_payment_id varchar(255),
  razorpay_order_id varchar(255),
  razorpay_signature varchar(255),
  status varchar(20) DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Documents table
CREATE TABLE IF NOT EXISTS public.documents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  agreement_type varchar(50) NOT NULL
    CHECK (agreement_type IN ('rent', 'affidavit', 'partnership', 'property', 'contract', 'other')),
  title varchar(255) NOT NULL,
  content jsonb, -- Store form data as JSON
  status varchar(20) DEFAULT 'draft'
    CHECK (status IN ('draft', 'submitted', 'in_verification', 'approved', 'rejected', 'completed')),
  lawyer_id uuid REFERENCES public.users(id),
  payment_status varchar(20) DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'completed', 'failed')),
  amount bigint DEFAULT 0, -- in paise
  documents_uploaded text[], -- Array of file URLs
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Document Payments table
CREATE TABLE IF NOT EXISTS public.document_payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id uuid REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  amount bigint NOT NULL, -- in paise
  currency varchar(3) DEFAULT 'INR',
  payment_method varchar(50),
  razorpay_payment_id varchar(255),
  razorpay_order_id varchar(255),
  status varchar(20) DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lawyer_profiles_user_id ON public.lawyer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_lawyer_profiles_specialization ON public.lawyer_profiles USING GIN(specialization);
CREATE INDEX IF NOT EXISTS idx_lawyer_profiles_location ON public.lawyer_profiles(location);
CREATE INDEX IF NOT EXISTS idx_lawyer_profiles_is_verified ON public.lawyer_profiles(is_verified);

CREATE INDEX IF NOT EXISTS idx_availability_slots_lawyer_id ON public.availability_slots(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_availability_slots_date ON public.availability_slots(date);
CREATE INDEX IF NOT EXISTS idx_availability_slots_is_available ON public.availability_slots(is_available);

CREATE INDEX IF NOT EXISTS idx_appointments_client_id ON public.appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_lawyer_id ON public.appointments(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_date ON public.appointments(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);

CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON public.documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_agreement_type ON public.documents(agreement_type);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lawyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for lawyer_profiles table
CREATE POLICY "Anyone can view verified lawyer profiles" ON public.lawyer_profiles
  FOR SELECT USING (is_verified = true);

CREATE POLICY "Lawyers can view own profile" ON public.lawyer_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Lawyers can update own profile" ON public.lawyer_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for availability_slots table
CREATE POLICY "Anyone can view available slots" ON public.availability_slots
  FOR SELECT USING (is_available = true);

CREATE POLICY "Lawyers can manage own slots" ON public.availability_slots
  FOR ALL USING (auth.uid() = lawyer_id);

-- RLS Policies for appointments table
CREATE POLICY "Users can view own appointments" ON public.appointments
  FOR SELECT USING (auth.uid() = client_id OR auth.uid() = lawyer_id);

CREATE POLICY "Clients can create appointments" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Participants can update appointments" ON public.appointments
  FOR UPDATE USING (auth.uid() = client_id OR auth.uid() = lawyer_id);

-- RLS Policies for documents table
CREATE POLICY "Users can view own documents" ON public.documents
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = lawyer_id);

CREATE POLICY "Users can manage own documents" ON public.documents
  FOR ALL USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lawyer_profiles_updated_at BEFORE UPDATE ON public.lawyer_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
