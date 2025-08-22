-- Sample Data for Notary Application
-- Execute this script AFTER running database-schema.sql

-- 1. Insert sample users (lawyers and clients)
INSERT INTO public.users (id, email, phone, name, role, is_verified, profile_photo_url) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'priya.sharma@example.com', '+91 98765 43210', 'Priya Sharma', 'lawyer', true, '/placeholder.svg'),
  ('550e8400-e29b-41d4-a716-446655440002', 'rajesh.kumar@example.com', '+91 98765 54321', 'Rajesh Kumar', 'lawyer', true, '/placeholder.svg'),
  ('550e8400-e29b-41d4-a716-446655440003', 'anjali.patel@example.com', '+91 98765 65432', 'Anjali Patel', 'lawyer', true, '/placeholder.svg'),
  ('550e8400-e29b-41d4-a716-446655440004', 'amit.singh@example.com', '+91 98765 76543', 'Amit Singh', 'client', true, '/placeholder.svg'),
  ('550e8400-e29b-41d4-a716-446655440005', 'neha.gupta@example.com', '+91 98765 87654', 'Neha Gupta', 'client', true, '/placeholder.svg');

-- 2. Insert lawyer profiles
INSERT INTO public.lawyer_profiles (
  id, user_id, specialization, experience_years, price_range_min, price_range_max, 
  location, bio, languages, consultation_modes, rating, total_reviews, is_verified,
  available_from, available_to, working_days
) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440011',
    '550e8400-e29b-41d4-a716-446655440001',
    ARRAY['Property Law', 'Contract Law'],
    8,
    150000, -- ₹1,500 in paise
    300000, -- ₹3,000 in paise
    'Mumbai, Maharashtra',
    'Experienced property lawyer specializing in real estate transactions and legal documentation. Helping clients navigate complex property laws with expertise and dedication.',
    ARRAY['English', 'Hindi', 'Marathi'],
    ARRAY['video', 'phone', 'in-person'],
    4.8,
    127,
    true,
    '09:00:00',
    '18:00:00',
    ARRAY[1,2,3,4,5,6] -- Monday to Saturday
  ),
  (
    '550e8400-e29b-41d4-a716-446655440012',
    '550e8400-e29b-41d4-a716-446655440002',
    ARRAY['Corporate Law', 'Tax Law'],
    12,
    200000, -- ₹2,000 in paise
    500000, -- ₹5,000 in paise
    'Delhi, Delhi',
    'Corporate law expert with extensive experience in business legal matters and tax compliance. Providing comprehensive legal solutions for businesses of all sizes.',
    ARRAY['English', 'Hindi'],
    ARRAY['video', 'phone'],
    4.9,
    203,
    true,
    '09:30:00',
    '17:30:00',
    ARRAY[1,2,3,4,5] -- Monday to Friday
  ),
  (
    '550e8400-e29b-41d4-a716-446655440013',
    '550e8400-e29b-41d4-a716-446655440003',
    ARRAY['Family Law', 'Criminal Law'],
    6,
    120000, -- ₹1,200 in paise
    250000, -- ₹2,500 in paise
    'Bangalore, Karnataka',
    'Compassionate family law attorney with a strong background in criminal law. Committed to protecting clients rights and providing personalized legal representation.',
    ARRAY['English', 'Hindi', 'Kannada'],
    ARRAY['video', 'phone', 'in-person'],
    4.7,
    89,
    true,
    '10:00:00',
    '19:00:00',
    ARRAY[1,2,3,4,5,6] -- Monday to Saturday
  );

-- 3. Insert availability slots for the next 30 days
-- For Priya Sharma (Property Law)
INSERT INTO public.availability_slots (lawyer_id, date, start_time, end_time, is_available, price, consultation_mode)
SELECT 
  '550e8400-e29b-41d4-a716-446655440001',
  current_date + interval_days,
  start_time::time,
  (start_time + interval '1 hour')::time,
  true,
  200000, -- ₹2,000 in paise
  CASE WHEN random() > 0.5 THEN 'video' ELSE 'phone' END
FROM 
  generate_series(1, 30) AS interval_days,
  generate_series(9, 17) AS hour
CROSS JOIN
  (VALUES ('09:00'::time), ('10:00'::time), ('11:00'::time), ('14:00'::time), ('15:00'::time), ('16:00'::time), ('17:00'::time)) AS t(start_time)
WHERE 
  extract(dow from current_date + interval_days) BETWEEN 1 AND 6; -- Monday to Saturday

-- For Rajesh Kumar (Corporate Law)
INSERT INTO public.availability_slots (lawyer_id, date, start_time, end_time, is_available, price, consultation_mode)
SELECT 
  '550e8400-e29b-41d4-a716-446655440002',
  current_date + interval_days,
  start_time::time,
  (start_time + interval '1 hour')::time,
  true,
  300000, -- ₹3,000 in paise
  CASE WHEN random() > 0.7 THEN 'phone' ELSE 'video' END
FROM 
  generate_series(1, 30) AS interval_days,
  (VALUES ('10:00'::time), ('11:00'::time), ('14:00'::time), ('15:00'::time), ('16:00'::time)) AS t(start_time)
WHERE 
  extract(dow from current_date + interval_days) BETWEEN 1 AND 5; -- Monday to Friday

-- For Anjali Patel (Family Law)
INSERT INTO public.availability_slots (lawyer_id, date, start_time, end_time, is_available, price, consultation_mode)
SELECT 
  '550e8400-e29b-41d4-a716-446655440003',
  current_date + interval_days,
  start_time::time,
  (start_time + interval '1 hour')::time,
  true,
  180000, -- ₹1,800 in paise
  CASE 
    WHEN random() > 0.7 THEN 'in-person'
    WHEN random() > 0.4 THEN 'video'
    ELSE 'phone'
  END
FROM 
  generate_series(1, 30) AS interval_days,
  (VALUES ('10:00'::time), ('11:00'::time), ('12:00'::time), ('15:00'::time), ('16:00'::time), ('17:00'::time), ('18:00'::time)) AS t(start_time)
WHERE 
  extract(dow from current_date + interval_days) BETWEEN 1 AND 6; -- Monday to Saturday

-- 4. Insert some sample appointments
INSERT INTO public.appointments (
  client_id, lawyer_id, lawyer_profile_id, scheduled_date, scheduled_time, 
  consultation_mode, document_type, description, urgency, amount, status, payment_status
) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440004', -- Amit Singh (client)
    '550e8400-e29b-41d4-a716-446655440001', -- Priya Sharma (lawyer)
    '550e8400-e29b-41d4-a716-446655440011', -- Priya's profile
    current_date + 2,
    '10:00:00',
    'video',
    'Property Agreement',
    'Need help with property purchase documentation and legal verification.',
    'high',
    200000,
    'confirmed',
    'completed'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440005', -- Neha Gupta (client)
    '550e8400-e29b-41d4-a716-446655440002', -- Rajesh Kumar (lawyer)
    '550e8400-e29b-41d4-a716-446655440012', -- Rajesh's profile
    current_date + 5,
    '14:00:00',
    'phone',
    'Business Contract',
    'Business partnership agreement review and legal consultation.',
    'medium',
    300000,
    'scheduled',
    'pending'
  );

-- 5. Insert sample documents
INSERT INTO public.documents (
  user_id, agreement_type, title, content, status, amount, payment_status
) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440004',
    'rent',
    'Apartment Rental Agreement - Mumbai',
    '{"property_address": "123 Marine Drive, Mumbai", "monthly_rent": 50000, "security_deposit": 150000, "lease_duration": 11}',
    'completed',
    500000,
    'completed'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440005',
    'partnership',
    'Tech Startup Partnership Agreement',
    '{"business_name": "TechVenture Pvt Ltd", "partners": ["Neha Gupta", "Rahul Sharma"], "profit_share": "50-50"}',
    'in_verification',
    750000,
    'completed'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440004',
    'affidavit',
    'Income Certificate Affidavit',
    '{"annual_income": 1200000, "purpose": "Bank Loan Application", "declaration_type": "income"}',
    'approved',
    200000,
    'completed'
  );

-- 6. Insert payment records
INSERT INTO public.appointment_payments (
  appointment_id, user_id, amount, currency, payment_method, status, razorpay_payment_id
)
SELECT 
  a.id,
  a.client_id,
  a.amount,
  'INR',
  'card',
  CASE WHEN a.payment_status = 'completed' THEN 'completed' ELSE 'pending' END,
  CASE WHEN a.payment_status = 'completed' THEN 'pay_' || substring(md5(random()::text), 1, 14) ELSE NULL END
FROM public.appointments a;

INSERT INTO public.document_payments (
  document_id, user_id, amount, currency, payment_method, status, razorpay_payment_id
)
SELECT 
  d.id,
  d.user_id,
  d.amount,
  'INR',
  'card',
  CASE WHEN d.payment_status = 'completed' THEN 'completed' ELSE 'pending' END,
  CASE WHEN d.payment_status = 'completed' THEN 'pay_' || substring(md5(random()::text), 1, 14) ELSE NULL END
FROM public.documents d
WHERE d.amount > 0;

-- Update some availability slots to mark them as booked
UPDATE public.availability_slots 
SET is_available = false 
WHERE lawyer_id = '550e8400-e29b-41d4-a716-446655440001' 
  AND date = current_date + 2 
  AND start_time = '10:00:00';

UPDATE public.availability_slots 
SET is_available = false 
WHERE lawyer_id = '550e8400-e29b-41d4-a716-446655440002' 
  AND date = current_date + 5 
  AND start_time = '14:00:00';
