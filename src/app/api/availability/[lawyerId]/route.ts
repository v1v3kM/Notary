import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Demo availability data
const getDemoAvailabilitySlots = (lawyerId: string, date: string) => {
  const slots = [];
  
  // Generate morning slots (9 AM - 12 PM)
  for (let hour = 9; hour < 12; hour++) {
    slots.push({
      id: `demo-slot-${lawyerId}-${date}-${hour}:00`,
      lawyer_id: lawyerId,
      date: date,
      start_time: `${hour.toString().padStart(2, '0')}:00`,
      end_time: `${(hour + 1).toString().padStart(2, '0')}:00`,
      is_available: Math.random() > 0.3, // 70% chance of being available
      price: lawyerId === 'demo-lawyer-1' ? 200000 : 300000, // in paise
      consultation_mode: Math.random() > 0.5 ? 'video' : 'phone',
      created_at: new Date().toISOString()
    });
  }
  
  // Generate afternoon slots (2 PM - 5 PM)
  for (let hour = 14; hour < 17; hour++) {
    slots.push({
      id: `demo-slot-${lawyerId}-${date}-${hour}:00`,
      lawyer_id: lawyerId,
      date: date,
      start_time: `${hour.toString().padStart(2, '0')}:00`,
      end_time: `${(hour + 1).toString().padStart(2, '0')}:00`,
      is_available: Math.random() > 0.3, // 70% chance of being available
      price: lawyerId === 'demo-lawyer-1' ? 200000 : 300000, // in paise
      consultation_mode: Math.random() > 0.5 ? 'video' : 'phone',
      created_at: new Date().toISOString()
    });
  }
  
  return slots.filter(slot => slot.is_available);
};

// GET /api/availability/[lawyerId] - Get available slots for a lawyer on a specific date
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lawyerId: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }
    
    // Validate date format (YYYY-MM-DD)
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }
    
    const { lawyerId } = await params;
    
    // Production mode - use Supabase database
    if (false && date) {
      const demoSlots = getDemoAvailabilitySlots(lawyerId, date as string);
      
      return NextResponse.json({ 
        slots: demoSlots,
        message: 'Demo availability data returned' 
      });
    }

    // Real backend logic for production
    const { data, error } = await supabase
      .from('availability_slots')
      .select('*')
      .eq('lawyer_id', lawyerId)
      .eq('date', date)
      .eq('is_available', true)
      .order('start_time');

    if (error) {
      console.error('Error fetching availability:', error);
      return NextResponse.json(
        { error: 'Failed to fetch availability' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      slots: data || [],
      message: 'Availability fetched successfully' 
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}