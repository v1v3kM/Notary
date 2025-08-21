import { supabase } from './supabase';

// Extended interfaces for appointments
export interface LawyerProfile {
  id: string;
  user_id: string;
  specialization: string[];
  experience_years: number;
  price_range_min: number; // in paise
  price_range_max: number; // in paise
  location: string;
  bio?: string;
  languages: string[];
  consultation_modes: ('video' | 'phone' | 'in-person')[];
  rating: number;
  total_reviews: number;
  is_verified: boolean;
  available_from: string; // HH:MM format
  available_to: string; // HH:MM format
  working_days: number[]; // 0=Sunday, 1=Monday, etc.
  created_at: string;
  updated_at: string;
  // Joined data from users table
  name?: string;
  email?: string;
  phone?: string;
  profile_photo_url?: string;
}

export interface AvailabilitySlot {
  id: string;
  lawyer_id: string;
  date: string; // YYYY-MM-DD format
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  is_available: boolean;
  price: number; // in paise
  consultation_mode: 'video' | 'phone' | 'in-person';
  created_at: string;
}

export interface Appointment {
  id: string;
  client_id: string;
  lawyer_id: string;
  lawyer_profile_id: string;
  slot_id: string;
  scheduled_date: string; // YYYY-MM-DD format
  scheduled_time: string; // HH:MM format
  duration: number; // in minutes
  consultation_mode: 'video' | 'phone' | 'in-person';
  document_type?: string;
  description?: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  amount: number; // in paise
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  meeting_link?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AppointmentPayment {
  id: string;
  appointment_id: string;
  user_id: string;
  amount: number; // in paise
  currency: string;
  payment_method?: string;
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
  updated_at: string;
}

// Utility function to convert paise to rupees
export const paiseToRupees = (paise: number): number => paise / 100;
export const rupeesToPaise = (rupees: number): number => rupees * 100;

// Format price range for display
export const formatPriceRange = (minPaise: number, maxPaise: number): string => {
  const minRupees = paiseToRupees(minPaise);
  const maxRupees = paiseToRupees(maxPaise);
  return `₹${minRupees.toLocaleString()} - ₹${maxRupees.toLocaleString()}`;
};

// Service functions for appointments
export class AppointmentService {
  
  // Get all verified lawyers with their profiles
  static async getLawyers(filters: {
    specialization?: string;
    location?: string;
    minRating?: number;
    searchTerm?: string;
  } = {}): Promise<{ data: LawyerProfile[] | null; error: string | null }> {
    try {
      let query = supabase
        .from('lawyer_profiles')
        .select(`
          *,
          users!inner(name, email, phone, profile_photo_url)
        `)
        .eq('is_verified', true)
        .order('rating', { ascending: false });

      // Apply filters
      if (filters.specialization && filters.specialization !== 'all') {
        query = query.contains('specialization', [filters.specialization]);
      }

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters.minRating) {
        query = query.gte('rating', filters.minRating);
      }

      if (filters.searchTerm) {
        query = query.or(`users.name.ilike.%${filters.searchTerm}%,specialization.cs.{${filters.searchTerm}}`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching lawyers:', error);
        return { data: null, error: error.message };
      }

      // Transform the data to include user information
      const transformedData = data?.map(lawyer => ({
        ...lawyer,
        name: lawyer.users?.name,
        email: lawyer.users?.email,
        phone: lawyer.users?.phone,
        profile_photo_url: lawyer.users?.profile_photo_url,
      })) as LawyerProfile[];

      return { data: transformedData, error: null };
    } catch (error) {
      console.error('Unexpected error fetching lawyers:', error);
      return { data: null, error: 'An unexpected error occurred' };
    }
  }

  // Get available slots for a specific lawyer on a specific date
  static async getAvailableSlots(
    lawyerId: string, 
    date: string
  ): Promise<{ data: AvailabilitySlot[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('availability_slots')
        .select('*')
        .eq('lawyer_id', lawyerId)
        .eq('date', date)
        .eq('is_available', true)
        .order('start_time');

      if (error) {
        console.error('Error fetching availability slots:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error fetching slots:', error);
      return { data: null, error: 'An unexpected error occurred' };
    }
  }

  // Book an appointment
  static async bookAppointment(appointmentData: {
    lawyer_profile_id: string;
    slot_id: string;
    scheduled_date: string;
    scheduled_time: string;
    consultation_mode: 'video' | 'phone' | 'in-person';
    document_type?: string;
    description?: string;
    urgency: 'low' | 'medium' | 'high';
    amount: number; // in paise
  }, userId: string): Promise<{ data: Appointment | null; error: string | null }> {
    try {
      // Start a transaction
      const { data: slotData, error: slotError } = await supabase
        .from('availability_slots')
        .select('lawyer_id')
        .eq('id', appointmentData.slot_id)
        .eq('is_available', true)
        .single();

      if (slotError || !slotData) {
        return { data: null, error: 'Slot is no longer available' };
      }

      // Get lawyer user_id from lawyer_profiles
      const { data: lawyerProfile, error: lawyerError } = await supabase
        .from('lawyer_profiles')
        .select('user_id')
        .eq('id', appointmentData.lawyer_profile_id)
        .single();

      if (lawyerError || !lawyerProfile) {
        return { data: null, error: 'Lawyer not found' };
      }

      // Create appointment
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert([{
          client_id: userId,
          lawyer_id: lawyerProfile.user_id,
          lawyer_profile_id: appointmentData.lawyer_profile_id,
          slot_id: appointmentData.slot_id,
          scheduled_date: appointmentData.scheduled_date,
          scheduled_time: appointmentData.scheduled_time,
          consultation_mode: appointmentData.consultation_mode,
          document_type: appointmentData.document_type,
          description: appointmentData.description,
          urgency: appointmentData.urgency,
          amount: appointmentData.amount,
          status: 'scheduled',
          payment_status: 'pending'
        }])
        .select()
        .single();

      if (appointmentError) {
        console.error('Error creating appointment:', appointmentError);
        return { data: null, error: appointmentError.message };
      }

      // Mark slot as unavailable
      const { error: updateSlotError } = await supabase
        .from('availability_slots')
        .update({ is_available: false })
        .eq('id', appointmentData.slot_id);

      if (updateSlotError) {
        console.error('Error updating slot availability:', updateSlotError);
        // Note: In a real app, you'd want to rollback the appointment creation
      }

      return { data: appointment, error: null };
    } catch (error) {
      console.error('Unexpected error booking appointment:', error);
      return { data: null, error: 'An unexpected error occurred' };
    }
  }

  // Get appointments for a user (client or lawyer)
  static async getUserAppointments(
    userId: string,
    role: 'client' | 'lawyer' = 'client'
  ): Promise<{ data: Appointment[] | null; error: string | null }> {
    try {
      const column = role === 'client' ? 'client_id' : 'lawyer_id';
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          lawyer_profiles!inner(
            *,
            users!inner(name, email, phone, profile_photo_url)
          )
        `)
        .eq(column, userId)
        .order('scheduled_date', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error fetching appointments:', error);
      return { data: null, error: 'An unexpected error occurred' };
    }
  }

  // Update appointment status
  static async updateAppointmentStatus(
    appointmentId: string,
    status: Appointment['status'],
    notes?: string
  ): Promise<{ data: Appointment | null; error: string | null }> {
    try {
      const updateData: Partial<Appointment> = { status };
      if (notes) updateData.notes = notes;

      const { data, error } = await supabase
        .from('appointments')
        .update(updateData)
        .eq('id', appointmentId)
        .select()
        .single();

      if (error) {
        console.error('Error updating appointment:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error updating appointment:', error);
      return { data: null, error: 'An unexpected error occurred' };
    }
  }

  // Create payment record for appointment
  static async createAppointmentPayment(
    appointmentId: string,
    userId: string,
    amount: number,
    paymentMethod: string,
    razorpayPaymentId?: string,
    razorpayOrderId?: string
  ): Promise<{ data: AppointmentPayment | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('appointment_payments')
        .insert([{
          appointment_id: appointmentId,
          user_id: userId,
          amount,
          payment_method: paymentMethod,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_order_id: razorpayOrderId,
          status: 'completed'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating payment record:', error);
        return { data: null, error: error.message };
      }

      // Update appointment payment status
      await supabase
        .from('appointments')
        .update({ payment_status: 'completed' })
        .eq('id', appointmentId);

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error creating payment:', error);
      return { data: null, error: 'An unexpected error occurred' };
    }
  }
}

// Demo data that matches the real database structure
export const getDemoLawyers = (): LawyerProfile[] => [
  {
    id: '1',
    user_id: 'user-1',
    name: 'Advocate Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 43210',
    specialization: ['Property Law', 'Civil Law', 'Contract Law'],
    experience_years: 8,
    price_range_min: 200000, // ₹2,000 in paise
    price_range_max: 500000, // ₹5,000 in paise
    location: 'New Delhi',
    bio: 'Experienced property lawyer with expertise in real estate transactions.',
    languages: ['Hindi', 'English', 'Punjabi'],
    consultation_modes: ['video', 'phone', 'in-person'],
    rating: 4.9,
    total_reviews: 156,
    is_verified: true,
    available_from: '09:00',
    available_to: '18:00',
    working_days: [1, 2, 3, 4, 5, 6],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: 'user-2',
    name: 'Advocate Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    phone: '+91 98765 43211',
    specialization: ['Business Law', 'Corporate Law', 'Partnership Deeds'],
    experience_years: 12,
    price_range_min: 300000, // ₹3,000 in paise
    price_range_max: 800000, // ₹8,000 in paise
    location: 'Mumbai',
    bio: 'Corporate lawyer specializing in business formations and partnerships.',
    languages: ['Hindi', 'English', 'Marathi'],
    consultation_modes: ['video', 'phone'],
    rating: 4.8,
    total_reviews: 203,
    is_verified: true,
    available_from: '09:30',
    available_to: '17:30',
    working_days: [1, 2, 3, 4, 5],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    user_id: 'user-3',
    name: 'Advocate Meera Patel',
    email: 'meera.patel@example.com',
    phone: '+91 98765 43212',
    specialization: ['Family Law', 'Divorce Law', 'Child Custody'],
    experience_years: 6,
    price_range_min: 150000, // ₹1,500 in paise
    price_range_max: 400000, // ₹4,000 in paise
    location: 'Bangalore',
    bio: 'Compassionate family lawyer with focus on amicable resolutions.',
    languages: ['English', 'Hindi', 'Kannada'],
    consultation_modes: ['video', 'phone', 'in-person'],
    rating: 4.7,
    total_reviews: 89,
    is_verified: true,
    available_from: '10:00',
    available_to: '19:00',
    working_days: [1, 2, 3, 4, 5, 6],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const getDemoAvailabilitySlots = (lawyerId: string, date: string): AvailabilitySlot[] => {
  const slots: AvailabilitySlot[] = [];
  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
  
  timeSlots.forEach((time) => {
    slots.push({
      id: `slot-${lawyerId}-${time}`,
      lawyer_id: lawyerId,
      date,
      start_time: time,
      end_time: `${parseInt(time.split(':')[0]) + 1}:00`,
      is_available: Math.random() > 0.3, // 70% availability
      price: time < '12:00' ? 250000 : 300000, // Morning vs afternoon pricing
      consultation_mode: ['video', 'phone', 'in-person'][Math.floor(Math.random() * 3)] as 'video' | 'phone' | 'in-person',
      created_at: new Date().toISOString()
    });
  });
  
  return slots;
};
