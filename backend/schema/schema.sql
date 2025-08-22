-- Canonical database schema for Notary
-- Uses pgcrypto and gen_random_uuid()
-- Run this file in Supabase SQL editor

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email varchar(255) UNIQUE NOT NULL,
  phone varchar(20),
  name varchar(255) NOT NULL,
  role varchar(20) CHECK (role IN ('client', 'lawyer')) NOT NULL DEFAULT 'client',
  aadhaar_number varchar(12),
  pan_number varchar(10),
  address text,
  specialization varchar(255),
  is_verified boolean DEFAULT false,
  profile_photo_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Lawyer Profiles
CREATE TABLE IF NOT EXISTS public.lawyer_profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  specialization text[] NOT NULL DEFAULT '{}',
  experience_years integer NOT NULL DEFAULT 0,
  price_range_min bigint NOT NULL DEFAULT 0,
  price_range_max bigint NOT NULL DEFAULT 0,
  location varchar(255) NOT NULL,
  bio text,
  languages text[] NOT NULL DEFAULT '{"English"}',
  consultation_modes text[] NOT NULL DEFAULT '{"video"}' CHECK (consultation_modes <@ ARRAY['video', 'phone', 'in-person']),
  rating decimal(3,2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  total_reviews integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  available_from time DEFAULT '09:00:00',
  available_to time DEFAULT '17:00:00',
  working_days integer[] DEFAULT '{1,2,3,4,5}' CHECK (working_days <@ ARRAY[0,1,2,3,4,5,6]),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id)
);

-- Availability slots
CREATE TABLE IF NOT EXISTS public.availability_slots (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  lawyer_id uuid REFERENCES public.lawyer_profiles(user_id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean DEFAULT true,
  price bigint NOT NULL DEFAULT 0,
  consultation_mode varchar(20) DEFAULT 'video' CHECK (consultation_mode IN ('video', 'phone', 'in-person')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(lawyer_id, date, start_time)
);

-- Appointments
CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  lawyer_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  lawyer_profile_id uuid REFERENCES public.lawyer_profiles(id) ON DELETE CASCADE NOT NULL,
  slot_id uuid REFERENCES public.availability_slots(id) ON DELETE SET NULL,
  scheduled_date date NOT NULL,
  scheduled_time time NOT NULL,
  duration integer DEFAULT 60,
  consultation_mode varchar(20) NOT NULL CHECK (consultation_mode IN ('video', 'phone', 'in-person')),
  document_type varchar(255),
  description text,
  urgency varchar(10) DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high')),
  status varchar(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show')),
  amount bigint NOT NULL DEFAULT 0,
  payment_status varchar(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  meeting_link text,
  notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Appointment payments
CREATE TABLE IF NOT EXISTS public.appointment_payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  amount bigint NOT NULL,
  currency varchar(3) DEFAULT 'INR',
  payment_method varchar(50),
  razorpay_payment_id varchar(255),
  razorpay_order_id varchar(255),
  razorpay_signature varchar(255),
  status varchar(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Documents
CREATE TABLE IF NOT EXISTS public.documents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  agreement_type varchar(50) NOT NULL CHECK (agreement_type IN ('rent', 'affidavit', 'partnership', 'property', 'contract', 'other')),
  title varchar(255) NOT NULL,
  content jsonb,
  status varchar(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'in_verification', 'approved', 'rejected', 'completed')),
  lawyer_id uuid REFERENCES public.users(id),
  payment_status varchar(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  amount bigint DEFAULT 0,
  documents_uploaded text[],
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Document payments
CREATE TABLE IF NOT EXISTS public.document_payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id uuid REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  amount bigint NOT NULL,
  currency varchar(3) DEFAULT 'INR',
  payment_method varchar(50),
  razorpay_payment_id varchar(255),
  razorpay_order_id varchar(255),
  status varchar(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_lawyer_profiles_user_id ON public.lawyer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_lawyer_profiles_specialization ON public.lawyer_profiles USING GIN(specialization);
CREATE INDEX IF NOT EXISTS idx_lawyer_profiles_location ON public.lawyer_profiles(location);

CREATE INDEX IF NOT EXISTS idx_availability_slots_lawyer_id ON public.availability_slots(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_availability_slots_date ON public.availability_slots(date);

CREATE INDEX IF NOT EXISTS idx_appointments_client_id ON public.appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_lawyer_id ON public.appointments(lawyer_id);

CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);

-- RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lawyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_payments ENABLE ROW LEVEL SECURITY;

-- Policies and triggers omitted here to keep this file focused; see database-schema.sql for full policies and triggers
