import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database/supabase';

// Demo appointments data
const demoAppointments: Array<{
  id: string;
  client_id: string;
  lawyer_id: string;
  lawyer_profile_id: string;
  slot_id: string;
  scheduled_date: string;
  scheduled_time: string;
  duration: number;
  consultation_mode: string;
  document_type?: string;
  description?: string;
  urgency: string;
  status: string;
  amount: number;
  payment_status: string;
  created_at: string;
  updated_at: string;
}> = [];

// POST /api/appointments - Create a new appointment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      lawyer_profile_id,
      slot_id,
      scheduled_date,
      scheduled_time,
      consultation_mode,
      document_type,
      description,
      urgency,
      amount,
      client_id
    } = body;

    // Validate required fields
    if (!lawyer_profile_id || !slot_id || !scheduled_date || !scheduled_time || 
        !consultation_mode || !document_type || !urgency || !amount || !client_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Production mode - use Supabase database
    if (false) {
      const demoAppointment = {
        id: `demo-appointment-${Date.now()}`,
        client_id,
        lawyer_id: lawyer_profile_id,
        lawyer_profile_id,
        slot_id,
        scheduled_date,
        scheduled_time,
        duration: 60,
        consultation_mode,
        document_type,
        description,
        urgency,
        status: 'scheduled',
        amount,
        payment_status: 'completed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      demoAppointments.push(demoAppointment);

      return NextResponse.json({
        appointment: demoAppointment,
        message: 'Demo appointment created successfully'
      });
    }

    // Start a Supabase transaction
    const { data: slotData, error: slotError } = await supabase
      .from('availability_slots')
      .select('*')
      .eq('id', slot_id)
      .eq('is_available', true)
      .single();

    if (slotError || !slotData) {
      return NextResponse.json(
        { error: 'Selected time slot is no longer available' },
        { status: 409 }
      );
    }

    // Get lawyer's user_id
    const { data: lawyerData, error: lawyerError } = await supabase
      .from('lawyer_profiles')
      .select('user_id')
      .eq('id', lawyer_profile_id)
      .single();

    if (lawyerError || !lawyerData) {
      return NextResponse.json(
        { error: 'Lawyer not found' },
        { status: 404 }
      );
    }

    // Create the appointment
    const { data: appointmentData, error: appointmentError } = await supabase
      .from('appointments')
      .insert({
        client_id,
        lawyer_id: lawyerData.user_id,
        lawyer_profile_id,
        slot_id,
        scheduled_date,
        scheduled_time,
        consultation_mode,
        document_type,
        description,
        urgency,
        amount,
        status: 'scheduled'
      })
      .select()
      .single();

    if (appointmentError) {
      console.error('Error creating appointment:', appointmentError);
      return NextResponse.json(
        { error: 'Failed to create appointment' },
        { status: 500 }
      );
    }

    // Mark the slot as unavailable
    const { error: updateSlotError } = await supabase
      .from('availability_slots')
      .update({ is_available: false })
      .eq('id', slot_id);

    if (updateSlotError) {
      console.error('Error updating slot availability:', updateSlotError);
      // Note: In production, you'd want to rollback the appointment here
    }

    // Create payment record
    const { data: paymentData, error: paymentError } = await supabase
      .from('appointment_payments')
      .insert({
        appointment_id: appointmentData.id,
        client_id,
        amount,
        currency: 'INR',
        status: 'pending'
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Error creating payment record:', paymentError);
      // In production, you might want to handle this more gracefully
    }

    return NextResponse.json({
      appointment: appointmentData,
      payment: paymentData,
      message: 'Appointment booked successfully'
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/appointments - Fetch user's appointments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client_id');
    const lawyerId = searchParams.get('lawyer_id');

    if (!clientId && !lawyerId) {
      return NextResponse.json(
        { error: 'Either client_id or lawyer_id is required' },
        { status: 400 }
      );
    }

    // Production mode - use Supabase database
    if (false) {
      const filteredAppointments = demoAppointments.filter(appointment => 
        (clientId && appointment.client_id === clientId) ||
        (lawyerId && appointment.lawyer_id === lawyerId)
      );

      return NextResponse.json({
        appointments: filteredAppointments,
        message: 'Demo appointments data returned'
      });
    }

    let query = supabase
      .from('appointments')
      .select(`
        *,
        lawyer_profiles!appointments_lawyer_profile_id_fkey (
          id,
          specialization,
          location,
          rating,
          users!lawyer_profiles_user_id_fkey (
            raw_user_meta_data
          )
        ),
        appointment_payments (
          id,
          amount,
          status,
          paid_at
        )
      `);

    if (clientId) {
      query = query.eq('client_id', clientId);
    } else if (lawyerId) {
      query = query.eq('lawyer_id', lawyerId);
    }

    const { data, error } = await query.order('scheduled_date', { ascending: false });

    if (error) {
      console.error('Error fetching appointments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch appointments' },
        { status: 500 }
      );
    }

    return NextResponse.json({ appointments: data || [] });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
