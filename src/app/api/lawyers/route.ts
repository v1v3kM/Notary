import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database/supabase';

// Demo data for testing
const demoLawyers = [
  {
    id: 'demo-lawyer-1',
    user_id: 'demo-user-1',
    specialization: ['Property Law', 'Contract Law'],
    experience_years: 8,
    price_range_min: 150000,
    price_range_max: 300000,
    location: 'Mumbai, Maharashtra',
    bio: 'Experienced property lawyer specializing in real estate transactions and legal documentation.',
    languages: ['English', 'Hindi', 'Marathi'],
    consultation_modes: ['video', 'phone', 'in-person'],
    rating: 4.8,
    total_reviews: 127,
    is_verified: true,
    created_at: '2023-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    users: {
      id: 'demo-user-1',
      email: 'priya.sharma@example.com',
      name: 'Priya Sharma',
      phone: '+91 98765 43210',
      profile_photo_url: '/api/placeholder/150/150'
    }
  },
  {
    id: 'demo-lawyer-2',
    user_id: 'demo-user-2',
    specialization: ['Corporate Law', 'Tax Law'],
    experience_years: 12,
    price_range_min: 200000,
    price_range_max: 500000,
    location: 'Delhi, Delhi',
    bio: 'Corporate law expert with extensive experience in business legal matters and tax compliance.',
    languages: ['English', 'Hindi'],
    consultation_modes: ['video', 'phone'],
    rating: 4.9,
    total_reviews: 203,
    is_verified: true,
    created_at: '2022-08-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
    users: {
      id: 'demo-user-2',
      email: 'rajesh.kumar@example.com',
      name: 'Rajesh Kumar',
      phone: '+91 98765 54321',
      profile_photo_url: '/api/placeholder/150/150'
    }
  }
];

// GET /api/lawyers - Fetch all verified lawyers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const specialization = searchParams.get('specialization') || 'all';

    // Production mode - use Supabase database
    if (false) {
      let filteredLawyers = [...demoLawyers];

      // Apply search filter
      if (search) {
        filteredLawyers = filteredLawyers.filter(lawyer =>
          lawyer.users.name.toLowerCase().includes(search.toLowerCase()) ||
          lawyer.location.toLowerCase().includes(search.toLowerCase()) ||
          lawyer.specialization.some(spec => 
            spec.toLowerCase().includes(search.toLowerCase())
          )
        );
      }

      // Apply specialization filter
      if (specialization !== 'all') {
        filteredLawyers = filteredLawyers.filter(lawyer =>
          lawyer.specialization.some(spec =>
            spec.toLowerCase().includes(specialization.toLowerCase())
          )
        );
      }

      return NextResponse.json({ 
        lawyers: filteredLawyers,
        message: 'Demo data returned' 
      });
    }

    let query = supabase
      .from('lawyer_profiles')
      .select(`
        id,
        user_id,
        specialization,
        experience_years,
        price_range_min,
        price_range_max,
        location,
        bio,
        languages,
        consultation_modes,
        rating,
        total_reviews,
        is_verified,
        created_at,
        updated_at,
        users!lawyer_profiles_user_id_fkey (
          id,
          email,
          raw_user_meta_data
        )
      `)
      .eq('is_verified', true);

    // Apply search filter
    if (search) {
      query = query.or(`
        users.raw_user_meta_data->>name.ilike.%${search}%,
        location.ilike.%${search}%,
        specialization.cs.{${search}}
      `);
    }

    // Apply specialization filter
    if (specialization !== 'all') {
      query = query.contains('specialization', [specialization]);
    }

    const { data, error } = await query.order('rating', { ascending: false });

    if (error) {
      console.error('Error fetching lawyers:', error);
      return NextResponse.json(
        { error: 'Failed to fetch lawyers' },
        { status: 500 }
      );
    }

    // Transform data to include name from user metadata
    const lawyers = data?.map(lawyer => {
      const userData = Array.isArray(lawyer.users) ? lawyer.users[0] : lawyer.users;
      return {
        ...lawyer,
        name: userData?.raw_user_meta_data?.name || 'Unknown Lawyer',
        email: userData?.email,
        phone: userData?.raw_user_meta_data?.phone
      };
    }) || [];

    return NextResponse.json({ lawyers });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
