-- Setup script for Digital Notary Appointment System
-- Run this script in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for appointments system
DO $$ BEGIN
    CREATE TYPE consultation_mode AS ENUM ('video', 'phone', 'in-person');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE urgency_level AS ENUM ('low', 'medium', 'high');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create lawyer_profiles table
CREATE TABLE IF NOT EXISTS lawyer_profiles (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    specialization TEXT[] NOT NULL DEFAULT '{}',
    experience_years INTEGER NOT NULL DEFAULT 0,
    price_range_min INTEGER NOT NULL DEFAULT 0, -- in paise
    price_range_max INTEGER NOT NULL DEFAULT 0, -- in paise
    location TEXT NOT NULL DEFAULT '',
    bio TEXT,
    languages TEXT[] NOT NULL DEFAULT '{"English"}',
    consultation_modes consultation_mode[] NOT NULL DEFAULT '{video}',
    rating DECIMAL(3,2) NOT NULL DEFAULT 4.0 CHECK (rating >= 0 AND rating <= 5),
    total_reviews INTEGER NOT NULL DEFAULT 0,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    available_from TIME NOT NULL DEFAULT '09:00',
    available_to TIME NOT NULL DEFAULT '17:00',
    working_days INTEGER[] NOT NULL DEFAULT '{1,2,3,4,5}', -- 0=Sunday, 1=Monday, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_price_range CHECK (price_range_min <= price_range_max),
    CONSTRAINT valid_experience CHECK (experience_years >= 0),
    CONSTRAINT valid_working_days CHECK (array_length(working_days, 1) > 0)
);

-- Create availability_slots table
CREATE TABLE IF NOT EXISTS availability_slots (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    lawyer_id TEXT REFERENCES lawyer_profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT true,
    price INTEGER NOT NULL DEFAULT 0, -- in paise
    consultation_mode consultation_mode NOT NULL DEFAULT 'video',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_time_range CHECK (start_time < end_time),
    CONSTRAINT valid_price CHECK (price >= 0),
    UNIQUE(lawyer_id, date, start_time)
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    lawyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    lawyer_profile_id TEXT REFERENCES lawyer_profiles(id) ON DELETE CASCADE,
    slot_id TEXT REFERENCES availability_slots(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    duration INTEGER NOT NULL DEFAULT 60, -- in minutes
    consultation_mode consultation_mode NOT NULL,
    document_type TEXT NOT NULL,
    description TEXT,
    urgency urgency_level NOT NULL DEFAULT 'medium',
    status appointment_status NOT NULL DEFAULT 'scheduled',
    meeting_link TEXT,
    meeting_notes TEXT,
    amount INTEGER NOT NULL DEFAULT 0, -- in paise
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_duration CHECK (duration > 0),
    CONSTRAINT valid_amount CHECK (amount >= 0)
);

-- Create appointment_payments table
CREATE TABLE IF NOT EXISTS appointment_payments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    appointment_id TEXT REFERENCES appointments(id) ON DELETE CASCADE,
    client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL, -- in paise
    currency TEXT NOT NULL DEFAULT 'INR',
    payment_method TEXT,
    razorpay_payment_id TEXT,
    razorpay_order_id TEXT,
    status payment_status NOT NULL DEFAULT 'pending',
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_payment_amount CHECK (amount > 0)
);

-- Create appointment_reviews table
CREATE TABLE IF NOT EXISTS appointment_reviews (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    appointment_id TEXT REFERENCES appointments(id) ON DELETE CASCADE,
    client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    lawyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(appointment_id, client_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lawyer_profiles_user_id ON lawyer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_lawyer_profiles_specialization ON lawyer_profiles USING GIN(specialization);
CREATE INDEX IF NOT EXISTS idx_lawyer_profiles_location ON lawyer_profiles(location);
CREATE INDEX IF NOT EXISTS idx_lawyer_profiles_verified ON lawyer_profiles(is_verified);

CREATE INDEX IF NOT EXISTS idx_availability_slots_lawyer_date ON availability_slots(lawyer_id, date);
CREATE INDEX IF NOT EXISTS idx_availability_slots_available ON availability_slots(is_available);
CREATE INDEX IF NOT EXISTS idx_availability_slots_date ON availability_slots(date);

CREATE INDEX IF NOT EXISTS idx_appointments_client ON appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_lawyer ON appointments(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

CREATE INDEX IF NOT EXISTS idx_payments_appointment ON appointment_payments(appointment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON appointment_payments(status);

-- Enable Row Level Security (RLS)
ALTER TABLE lawyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lawyer_profiles
CREATE POLICY "Public can view verified lawyer profiles" ON lawyer_profiles
    FOR SELECT USING (is_verified = true);

CREATE POLICY "Lawyers can update own profile" ON lawyer_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Lawyers can insert own profile" ON lawyer_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for availability_slots
CREATE POLICY "Public can view available slots" ON availability_slots
    FOR SELECT USING (is_available = true AND date >= CURRENT_DATE);

CREATE POLICY "Lawyers can manage own slots" ON availability_slots
    FOR ALL USING (
        lawyer_id IN (
            SELECT id FROM lawyer_profiles WHERE user_id = auth.uid()
        )
    );

-- RLS Policies for appointments
CREATE POLICY "Users can view own appointments" ON appointments
    FOR SELECT USING (
        auth.uid() = client_id OR 
        auth.uid() = lawyer_id
    );

CREATE POLICY "Clients can create appointments" ON appointments
    FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Participants can update appointments" ON appointments
    FOR UPDATE USING (
        auth.uid() = client_id OR 
        auth.uid() = lawyer_id
    );

-- RLS Policies for appointment_payments
CREATE POLICY "Users can view own payments" ON appointment_payments
    FOR SELECT USING (
        auth.uid() = client_id OR
        auth.uid() IN (
            SELECT lawyer_id FROM appointments WHERE id = appointment_id
        )
    );

CREATE POLICY "Clients can create payments" ON appointment_payments
    FOR INSERT WITH CHECK (auth.uid() = client_id);

-- RLS Policies for appointment_reviews
CREATE POLICY "Public can view reviews" ON appointment_reviews
    FOR SELECT USING (true);

CREATE POLICY "Clients can create reviews" ON appointment_reviews
    FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can update own reviews" ON appointment_reviews
    FOR UPDATE USING (auth.uid() = client_id);

-- Functions and triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_lawyer_profiles_updated_at 
    BEFORE UPDATE ON lawyer_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at 
    BEFORE UPDATE ON appointments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'Appointment system tables created successfully!' as message;
