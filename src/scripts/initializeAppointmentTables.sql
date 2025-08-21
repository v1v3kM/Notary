-- Initialize appointment-related tables in Supabase
-- Run this script in your Supabase SQL editor

-- First, ensure the appointment tables are created
-- Copy and run the appointment-schema.sql file first, then run this for sample data

-- Insert sample lawyer profiles (only if they don't exist)
INSERT INTO lawyer_profiles (
  id, user_id, specialization, experience_years, price_range_min, price_range_max,
  location, bio, languages, consultation_modes, rating, total_reviews, is_verified,
  available_from, available_to, working_days
) VALUES 
(
  'lawyer-1',
  (SELECT id FROM auth.users LIMIT 1), -- Use first available user
  ARRAY['Property Law', 'Civil Law', 'Contract Law'],
  8,
  200000, -- ₹2,000 in paise
  500000, -- ₹5,000 in paise
  'New Delhi',
  'Experienced property and civil law specialist with 8 years of practice.',
  ARRAY['Hindi', 'English', 'Punjabi'],
  ARRAY['video', 'phone', 'in-person']::consultation_mode[],
  4.9,
  45,
  true,
  '09:00',
  '18:00',
  ARRAY[1, 2, 3, 4, 5, 6] -- Monday to Saturday
),
(
  'lawyer-2',
  (SELECT id FROM auth.users LIMIT 1), -- Use first available user
  ARRAY['Business Law', 'Corporate Law', 'Partnership Deeds'],
  12,
  300000, -- ₹3,000 in paise
  800000, -- ₹8,000 in paise
  'Mumbai',
  'Senior corporate and business law expert with extensive experience in partnerships.',
  ARRAY['Hindi', 'English', 'Marathi'],
  ARRAY['video', 'phone']::consultation_mode[],
  4.8,
  78,
  true,
  '09:30',
  '17:30',
  ARRAY[1, 2, 3, 4, 5] -- Monday to Friday
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample availability slots for the next 14 days
INSERT INTO availability_slots (
  id, lawyer_id, date, start_time, end_time, is_available, price, consultation_mode
)
SELECT 
  'slot-' || lawyer_id || '-' || generate_date || '-' || time_slot,
  lawyer_id,
  generate_date::date,
  time_slot,
  (time_slot::time + interval '1 hour')::time,
  (random() > 0.3), -- 70% chance of being available
  CASE 
    WHEN lawyer_id = 'lawyer-1' THEN 250000 + (random() * 75000)::int -- ₹2,500-3,250
    WHEN lawyer_id = 'lawyer-2' THEN 400000 + (random() * 100000)::int -- ₹4,000-5,000
    ELSE 300000
  END,
  CASE 
    WHEN random() < 0.4 THEN 'video'
    WHEN random() < 0.7 THEN 'phone'
    ELSE 'in-person'
  END::consultation_mode
FROM (
  SELECT 
    lawyer_id,
    generate_date,
    time_slot
  FROM (
    SELECT 'lawyer-1' AS lawyer_id
    UNION ALL
    SELECT 'lawyer-2'
  ) lawyers
  CROSS JOIN (
    SELECT (CURRENT_DATE + interval '1 day' * generate_series)::date AS generate_date
    FROM generate_series(0, 13) -- Next 14 days
  ) dates
  CROSS JOIN (
    SELECT time_slot::time
    FROM unnest(ARRAY[
      '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
    ]) AS time_slot
  ) times
) data
ON CONFLICT (id) DO NOTHING;

-- Update users table to add name information for lawyers
-- This assumes you have some users in your auth.users table
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'),
  '{name}',
  CASE 
    WHEN id = (SELECT user_id FROM lawyer_profiles WHERE id = 'lawyer-1') THEN '"Advocate Priya Sharma"'
    WHEN id = (SELECT user_id FROM lawyer_profiles WHERE id = 'lawyer-2') THEN '"Advocate Rajesh Kumar"'
    ELSE raw_user_meta_data->'name'
  END
)
WHERE id IN (
  SELECT user_id FROM lawyer_profiles WHERE id IN ('lawyer-1', 'lawyer-2')
);

-- Verify the data was inserted
SELECT 
  lp.id,
  u.raw_user_meta_data->>'name' as name,
  lp.specialization,
  lp.experience_years,
  lp.price_range_min,
  lp.price_range_max,
  lp.location,
  lp.rating
FROM lawyer_profiles lp
LEFT JOIN auth.users u ON lp.user_id = u.id
ORDER BY lp.id;

SELECT 
  COUNT(*) as total_slots,
  lawyer_id,
  date,
  COUNT(*) FILTER (WHERE is_available = true) as available_slots
FROM availability_slots 
WHERE date >= CURRENT_DATE 
GROUP BY lawyer_id, date 
ORDER BY lawyer_id, date
LIMIT 10;
