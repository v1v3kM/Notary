-- Sample data for testing the appointment system
-- Run this AFTER the setup-supabase-tables.sql script

-- First, let's create some test users (these will be used as lawyers)
-- Note: In production, users should register through your app's auth flow

-- Insert sample lawyer profiles
-- You'll need to replace the user_id values with actual user IDs from your auth.users table
-- For now, we'll create placeholder entries that you can update later

INSERT INTO lawyer_profiles (
    id, user_id, specialization, experience_years, price_range_min, price_range_max,
    location, bio, languages, consultation_modes, rating, total_reviews, is_verified,
    available_from, available_to, working_days
) VALUES 
(
    'lawyer-priya-001',
    (SELECT id FROM auth.users WHERE email LIKE '%@example.com' LIMIT 1), -- Replace with actual user ID
    ARRAY['Property Law', 'Civil Law', 'Contract Law'],
    8,
    200000, -- ₹2,000 in paise
    500000, -- ₹5,000 in paise
    'New Delhi',
    'Experienced property and civil law specialist with 8 years of practice. Expertise in real estate transactions, contract disputes, and civil litigation.',
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
    'lawyer-rajesh-002',
    (SELECT id FROM auth.users WHERE email LIKE '%@test.com' LIMIT 1), -- Replace with actual user ID
    ARRAY['Business Law', 'Corporate Law', 'Partnership Deeds'],
    12,
    300000, -- ₹3,000 in paise
    800000, -- ₹8,000 in paise
    'Mumbai',
    'Senior corporate and business law expert with extensive experience in partnerships, corporate compliance, and business formations.',
    ARRAY['Hindi', 'English', 'Marathi'],
    ARRAY['video', 'phone']::consultation_mode[],
    4.8,
    78,
    true,
    '09:30',
    '17:30',
    ARRAY[1, 2, 3, 4, 5] -- Monday to Friday
),
(
    'lawyer-anita-003',
    (SELECT id FROM auth.users WHERE email LIKE '%@demo.com' LIMIT 1), -- Replace with actual user ID
    ARRAY['Family Law', 'Divorce Law', 'Child Custody'],
    6,
    180000, -- ₹1,800 in paise
    400000, -- ₹4,000 in paise
    'Bangalore',
    'Compassionate family law attorney specializing in divorce proceedings, child custody, and domestic relations.',
    ARRAY['Hindi', 'English', 'Kannada'],
    ARRAY['video', 'phone', 'in-person']::consultation_mode[],
    4.7,
    32,
    true,
    '10:00',
    '17:00',
    ARRAY[1, 2, 3, 4, 5] -- Monday to Friday
)
ON CONFLICT (id) DO UPDATE SET
    specialization = EXCLUDED.specialization,
    experience_years = EXCLUDED.experience_years,
    price_range_min = EXCLUDED.price_range_min,
    price_range_max = EXCLUDED.price_range_max,
    location = EXCLUDED.location,
    bio = EXCLUDED.bio,
    languages = EXCLUDED.languages,
    consultation_modes = EXCLUDED.consultation_modes,
    rating = EXCLUDED.rating,
    total_reviews = EXCLUDED.total_reviews,
    is_verified = EXCLUDED.is_verified,
    available_from = EXCLUDED.available_from,
    available_to = EXCLUDED.available_to,
    working_days = EXCLUDED.working_days,
    updated_at = NOW();

-- Generate availability slots for the next 14 days for each lawyer
INSERT INTO availability_slots (
    id, lawyer_id, date, start_time, end_time, is_available, price, consultation_mode
)
SELECT 
    'slot-' || lawyer_id || '-' || generate_date || '-' || time_slot,
    lawyer_id,
    generate_date::date,
    time_slot::time,
    (time_slot::time + interval '1 hour')::time,
    (random() > 0.2), -- 80% chance of being available
    CASE 
        WHEN lawyer_id = 'lawyer-priya-001' THEN 250000 + (random() * 100000)::int -- ₹2,500-3,500
        WHEN lawyer_id = 'lawyer-rajesh-002' THEN 400000 + (random() * 150000)::int -- ₹4,000-5,500
        WHEN lawyer_id = 'lawyer-anita-003' THEN 200000 + (random() * 80000)::int -- ₹2,000-2,800
        ELSE 300000
    END,
    CASE 
        WHEN random() < 0.4 THEN 'video'::consultation_mode
        WHEN random() < 0.7 THEN 'phone'::consultation_mode
        ELSE 'in-person'::consultation_mode
    END
FROM (
    SELECT 
        lawyer_id,
        generate_date,
        time_slot
    FROM (
        SELECT 'lawyer-priya-001' AS lawyer_id
        UNION ALL
        SELECT 'lawyer-rajesh-002'
        UNION ALL
        SELECT 'lawyer-anita-003'
    ) lawyers
    CROSS JOIN (
        SELECT (CURRENT_DATE + interval '1 day' * generate_series)::date AS generate_date
        FROM generate_series(0, 13) -- Next 14 days
    ) dates
    CROSS JOIN (
        SELECT time_slot::time
        FROM unnest(ARRAY[
            '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'
        ]) AS time_slot
    ) times
    WHERE 
        -- Only generate slots for working days
        EXTRACT(DOW FROM generate_date) = ANY(
            CASE 
                WHEN lawyer_id = 'lawyer-priya-001' THEN ARRAY[1,2,3,4,5,6]
                WHEN lawyer_id = 'lawyer-rajesh-002' THEN ARRAY[1,2,3,4,5]
                WHEN lawyer_id = 'lawyer-anita-003' THEN ARRAY[1,2,3,4,5]
                ELSE ARRAY[1,2,3,4,5]
            END
        )
        AND 
        -- Only generate slots within working hours
        time_slot::time >= (
            CASE 
                WHEN lawyer_id = 'lawyer-priya-001' THEN '09:00'::time
                WHEN lawyer_id = 'lawyer-rajesh-002' THEN '09:30'::time
                WHEN lawyer_id = 'lawyer-anita-003' THEN '10:00'::time
                ELSE '09:00'::time
            END
        )
        AND 
        time_slot::time < (
            CASE 
                WHEN lawyer_id = 'lawyer-priya-001' THEN '18:00'::time
                WHEN lawyer_id = 'lawyer-rajesh-002' THEN '17:30'::time
                WHEN lawyer_id = 'lawyer-anita-003' THEN '17:00'::time
                ELSE '17:00'::time
            END
        )
) data
ON CONFLICT (lawyer_id, date, start_time) DO UPDATE SET
    is_available = EXCLUDED.is_available,
    price = EXCLUDED.price,
    consultation_mode = EXCLUDED.consultation_mode;

-- Update user metadata to include lawyer names (if users exist)
-- This query will only work if you have users in your auth.users table
-- You can skip this if you don't have test users yet

DO $$
DECLARE
    user_record RECORD;
BEGIN
    -- Try to update user metadata for sample lawyers
    FOR user_record IN 
        SELECT u.id, lp.id as lawyer_id
        FROM auth.users u
        JOIN lawyer_profiles lp ON u.id = lp.user_id
        WHERE lp.id IN ('lawyer-priya-001', 'lawyer-rajesh-002', 'lawyer-anita-003')
    LOOP
        UPDATE auth.users 
        SET raw_user_meta_data = jsonb_set(
            COALESCE(raw_user_meta_data, '{}'),
            '{name}',
            CASE 
                WHEN user_record.lawyer_id = 'lawyer-priya-001' THEN '"Advocate Priya Sharma"'
                WHEN user_record.lawyer_id = 'lawyer-rajesh-002' THEN '"Advocate Rajesh Kumar"'
                WHEN user_record.lawyer_id = 'lawyer-anita-003' THEN '"Advocate Anita Desai"'
                ELSE '"Unknown Lawyer"'
            END::jsonb
        )
        WHERE id = user_record.id;
    END LOOP;
END $$;

-- Verify the data was inserted
SELECT 
    'Data verification:' as info,
    COUNT(*) as lawyer_profiles_count
FROM lawyer_profiles;

SELECT 
    'Availability slots:' as info,
    lawyer_id,
    COUNT(*) as total_slots,
    COUNT(*) FILTER (WHERE is_available = true) as available_slots,
    MIN(date) as first_date,
    MAX(date) as last_date
FROM availability_slots 
WHERE date >= CURRENT_DATE 
GROUP BY lawyer_id 
ORDER BY lawyer_id;

-- Success message
SELECT 'Sample data inserted successfully! You can now test the appointment booking system.' as message;
