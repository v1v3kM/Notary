// API-based service layer for appointments
import type { LawyerProfile, AvailabilitySlot, Appointment } from './appointmentService';

export interface ApiServiceResponse<T> {
  data: T | null;
  error: string | null;
}

export class ApiAppointmentService {
  // Get all lawyers with search and filtering
  static async getLawyers(searchTerm = '', specialization = 'all'): Promise<ApiServiceResponse<LawyerProfile[]>> {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (specialization !== 'all') params.append('specialization', specialization);
      
      const response = await fetch(`/api/lawyers?${params.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Failed to fetch lawyers' };
      }
      
      const result = await response.json();
      return { data: result.lawyers || [], error: null };
    } catch (error) {
      console.error('Error in getLawyers:', error);
      return { data: null, error: 'Network error while fetching lawyers' };
    }
  }

  // Get available slots for a specific lawyer and date
  static async getAvailableSlots(lawyerId: string, date: string): Promise<ApiServiceResponse<AvailabilitySlot[]>> {
    try {
      const response = await fetch(`/api/availability/${lawyerId}?date=${date}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Failed to fetch availability' };
      }
      
      const result = await response.json();
      return { data: result.slots || [], error: null };
    } catch (error) {
      console.error('Error in getAvailableSlots:', error);
      return { data: null, error: 'Network error while fetching availability' };
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
    amount: number;
  }, clientId: string): Promise<ApiServiceResponse<Appointment>> {
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...appointmentData,
          client_id: clientId
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Failed to book appointment' };
      }
      
      const result = await response.json();
      return { data: result.appointment, error: null };
    } catch (error) {
      console.error('Error in bookAppointment:', error);
      return { data: null, error: 'Network error while booking appointment' };
    }
  }
}

// Re-export types for compatibility
export type { LawyerProfile, AvailabilitySlot, Appointment } from './appointmentService';
