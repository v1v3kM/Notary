import { useState, useEffect } from 'react';
import { ApiAppointmentService, type LawyerProfile, type AvailabilitySlot } from '@/lib/apiAppointmentService';
import { getDemoLawyers, getDemoAvailabilitySlots } from '@/lib/appointmentService';
import { useAuth } from '@/contexts/AuthContext';

export interface UseAppointmentSchedulerReturn {
  lawyers: LawyerProfile[];
  loading: boolean;
  error: string | null;
  selectedLawyer: LawyerProfile | null;
  availableSlots: AvailabilitySlot[];
  slotsLoading: boolean;
  searchTerm: string;
  specialization: string;
  setSearchTerm: (term: string) => void;
  setSpecialization: (spec: string) => void;
  selectLawyer: (lawyer: LawyerProfile) => void;
  getAvailabilityForDate: (date: Date) => Promise<void>;
  bookAppointment: (appointmentData: {
    slot_id: string;
    scheduled_date: string;
    scheduled_time: string;
    consultation_mode: 'video' | 'phone' | 'in-person';
    document_type?: string;
    description?: string;
    urgency: 'low' | 'medium' | 'high';
    amount: number;
  }) => Promise<{ success: boolean; error?: string; appointmentId?: string }>;
  refreshLawyers: () => Promise<void>;
}

export const useAppointmentScheduler = (): UseAppointmentSchedulerReturn => {
  const { user } = useAuth();
  
  // State management
  const [lawyers, setLawyers] = useState<LawyerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLawyer, setSelectedLawyer] = useState<LawyerProfile | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialization, setSpecialization] = useState('all');

  // Load lawyers on mount and when filters change
  useEffect(() => {
    const loadLawyersEffect = async () => {
      setLoading(true);
      setError(null);

      try {
        if (false) {
          // Use demo data in demo mode
          let filteredLawyers = getDemoLawyers();
          
          // Apply search filter
          if (searchTerm) {
            filteredLawyers = filteredLawyers.filter(lawyer =>
              lawyer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              lawyer.specialization.some(spec => 
                spec.toLowerCase().includes(searchTerm.toLowerCase())
              )
            );
          }
          
          // Apply specialization filter
          if (specialization !== 'all') {
            filteredLawyers = filteredLawyers.filter(lawyer =>
              lawyer.specialization.includes(specialization)
            );
          }
          
          setLawyers(filteredLawyers);
        } else {
        // Use real backend service
        const { data, error: serviceError } = await ApiAppointmentService.getLawyers(
          searchTerm, 
          specialization
        );          if (serviceError) {
            setError(serviceError);
            setLawyers([]);
          } else {
            setLawyers(data || []);
          }
        }
      } catch {
        setError('Failed to load lawyers');
        setLawyers([]);
      } finally {
        setLoading(false);
      }
    };

    loadLawyersEffect();
  }, [searchTerm, specialization]);

  const selectLawyer = (lawyer: LawyerProfile) => {
    setSelectedLawyer(lawyer);
  };

  const getAvailabilityForDate = async (date: Date) => {
    if (!selectedLawyer) return;

    setSlotsLoading(true);
    try {
      const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format

      if (false && selectedLawyer) {
        // Use demo data (disabled in production)
        const demoSlots = getDemoAvailabilitySlots(selectedLawyer!.id, dateString);
        setAvailableSlots(demoSlots);
      } else {
        // Use real backend service
        const { data, error: serviceError } = await ApiAppointmentService.getAvailableSlots(
          selectedLawyer.id, 
          dateString
        );

        if (serviceError) {
          setError(serviceError);
          setAvailableSlots([]);
        } else {
          setAvailableSlots(data || []);
        }
      }
    } catch {
      setError('Failed to load availability');
      setAvailableSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const bookAppointment = async (appointmentData: {
    slot_id: string;
    scheduled_date: string;
    scheduled_time: string;
    consultation_mode: 'video' | 'phone' | 'in-person';
    document_type?: string;
    description?: string;
    urgency: 'low' | 'medium' | 'high';
    amount: number;
  }): Promise<{ success: boolean; error?: string; appointmentId?: string }> => {
    if (!user || !selectedLawyer) {
      return { success: false, error: 'User not authenticated or lawyer not selected' };
    }

    try {
      if (false) {
        // Simulate booking in demo mode (disabled in production)
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
        
        // Remove the slot from available slots to simulate booking
        setAvailableSlots(prev => prev.filter(slot => slot.id !== appointmentData.slot_id));
        
        return { 
          success: true, 
          appointmentId: `demo-appointment-${Date.now()}` 
        };
      } else {
        // Use real backend service
        const { data, error: serviceError } = await ApiAppointmentService.bookAppointment({
          lawyer_profile_id: selectedLawyer.id,
          ...appointmentData
        }, user.id);

        if (serviceError) {
          return { success: false, error: serviceError };
        }

        // Refresh availability to reflect the booked slot
        const currentDate = new Date(appointmentData.scheduled_date);
        await getAvailabilityForDate(currentDate);

        return { 
          success: true, 
          appointmentId: data?.id 
        };
      }
    } catch {
      return { 
        success: false, 
        error: 'Failed to book appointment' 
      };
    }
  };

  const refreshLawyers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (false) {
        const demoLawyers = getDemoLawyers();
        setLawyers(demoLawyers);
      } else {
        const { data, error: serviceError } = await ApiAppointmentService.getLawyers();
        
        if (serviceError) {
          setError(serviceError);
          setLawyers([]);
        } else {
          setLawyers(data || []);
        }
      }
    } catch {
      setError('Failed to load lawyers');
      setLawyers([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    lawyers,
    loading,
    error,
    selectedLawyer,
    availableSlots,
    slotsLoading,
    searchTerm,
    specialization,
    setSearchTerm,
    setSpecialization,
    selectLawyer,
    getAvailabilityForDate,
    bookAppointment,
    refreshLawyers
  };
};
