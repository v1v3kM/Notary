'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Video,
  Phone,
  Home,
  Star,
  CheckCircle,
  ChevronLeft,
  Search,
  CreditCard,
  Shield,
  Award,
  Globe,
  Loader2
} from 'lucide-react';
import { useAppointmentScheduler } from '../hooks/useAppointmentScheduler';

interface AppointmentDetails {
  date: Date;
  time: string;
  mode: 'video' | 'phone' | 'in-person';
  documentType: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
}

const documentTypes = [
  'Property Sale Agreement',
  'Rental Agreement',
  'Business Partnership',
  'Employment Contract',
  'Identity Affidavit',
  'Legal Notice',
  'Will & Testament',
  'Power of Attorney',
  'NOC Certificate',
  'Other'
];

export default function AppointmentScheduler() {
  const {
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
    bookAppointment
  } = useAppointmentScheduler();

  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointmentDetails, setAppointmentDetails] = useState<Partial<AppointmentDetails>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Load availability when lawyer and date change
  useEffect(() => {
    if (selectedLawyer && selectedDate) {
      getAvailabilityForDate(selectedDate);
    }
  }, [selectedLawyer, selectedDate, getAvailabilityForDate]);

  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'video': return Video;
      case 'phone': return Phone;
      case 'in-person': return Home;
      default: return Video;
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'video': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'phone': return 'bg-green-100 text-green-700 border-green-200';
      case 'in-person': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleBookAppointment = () => {
    setShowConfirmation(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot || !appointmentDetails.date || !appointmentDetails.time || 
        !appointmentDetails.mode || !appointmentDetails.documentType || !appointmentDetails.urgency) {
      alert('Please fill in all required details');
      return;
    }

    setBookingLoading(true);
    
    const selectedSlotData = availableSlots.find(slot => slot.id === selectedSlot);
    if (!selectedSlotData) {
      alert('Selected time slot is no longer available');
      setBookingLoading(false);
      return;
    }

    try {
      const result = await bookAppointment({
        slot_id: selectedSlot,
        scheduled_date: appointmentDetails.date.toISOString().split('T')[0],
        scheduled_time: appointmentDetails.time,
        consultation_mode: appointmentDetails.mode,
        document_type: appointmentDetails.documentType,
        description: appointmentDetails.description || '',
        urgency: appointmentDetails.urgency,
        amount: selectedSlotData.price
      });

      if (result.success) {
        alert('Appointment booked successfully! You will receive a confirmation email shortly.');
        setShowConfirmation(false);
        setStep(1);
        setSelectedSlot(null);
        setAppointmentDetails({});
      } else {
        alert(result.error || 'Failed to book appointment. Please try again.');
      }
    } catch {
      alert('An error occurred while booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header - Responsive */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Book Consultation</h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Schedule a meeting with verified legal professionals</p>
            </div>
            <div className="flex items-center justify-center lg:justify-end">
              <div className="flex items-center space-x-2 bg-white/50 rounded-lg px-3 sm:px-4 py-2">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${
                  step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  1
                </div>
                <div className={`w-3 h-1 sm:w-4 rounded ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${
                  step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  2
                </div>
                <div className={`w-3 h-1 sm:w-4 rounded ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${
                  step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  3
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Step 1: Select Lawyer */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Select a Lawyer</h2>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search lawyers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-auto pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Specializations</option>
                  <option value="Property Law">Property Law</option>
                  <option value="Business Law">Business Law</option>
                  <option value="Family Law">Family Law</option>
                  <option value="Criminal Law">Criminal Law</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              {loading ? (
                <div className="col-span-2 flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Loading lawyers...</span>
                </div>
              ) : error ? (
                <div className="col-span-2 text-center py-12">
                  <p className="text-red-600">{error}</p>
                </div>
              ) : lawyers.length === 0 ? (
                <div className="col-span-2 text-center py-12">
                  <p className="text-gray-600">No lawyers found matching your criteria</p>
                </div>
              ) : (
                lawyers.map((lawyer) => (
                  <motion.div
                    key={lawyer.id}
                    className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all cursor-pointer"
                    whileHover={{ scale: 1.01 }}
                    onClick={() => {
                      selectLawyer(lawyer);
                      setStep(2);
                    }}
                  >
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg sm:text-xl flex-shrink-0">
                        {(lawyer.name || 'Unknown').split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">{lawyer.name || 'Unknown Lawyer'}</h3>
                          {lawyer.is_verified && <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3">
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                            <span className="text-xs sm:text-sm font-medium">{lawyer.rating}</span>
                          </div>
                          <span className="text-xs sm:text-sm text-gray-600">{lawyer.experience_years} years exp</span>
                          <span className="text-xs sm:text-sm text-gray-600 truncate">{lawyer.location}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
                          {lawyer.specialization.slice(0, 2).map((spec: string, idx: number) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {spec}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900 text-sm sm:text-base">
                            ₹{Math.round(lawyer.price_range_min / 100)} - ₹{Math.round(lawyer.price_range_max / 100)}
                          </span>
                          <div className="flex items-center space-x-1">
                            {lawyer.consultation_modes.map((mode: string) => {
                              const Icon = getModeIcon(mode);
                              return (
                                <div key={mode} className={`p-1 rounded border ${getModeColor(mode)}`}>
                                  <Icon className="w-2 h-2 sm:w-3 sm:h-3" />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-green-600 font-medium">
                          Available for booking
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* Step 2: Select Date & Time */}
        {step === 2 && selectedLawyer && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setStep(1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Select Date & Time</h2>
                  <p className="text-gray-600">Booking with {selectedLawyer.name}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Calendar */}
              <div className="lg:col-span-2">
                <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-6">
                  <h3 className="text-lg font-semibold mb-4">Available Dates</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 mb-4">
                    {generateCalendarDays().map((date, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedDate(date)}
                        className={`p-2 sm:p-3 rounded-lg text-center transition-colors ${
                          selectedDate.toDateString() === date.toDateString()
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="text-xs font-medium">
                          {date.toLocaleDateString('en-IN', { weekday: 'short' })}
                        </div>
                        <div className="text-sm font-bold">{formatDate(date)}</div>
                      </button>
                    ))}
                  </div>

                  {/* Time Slots */}
                  <h4 className="text-md font-semibold mb-3">Available Times</h4>
                  {slotsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                      <span className="ml-2 text-gray-600">Loading availability...</span>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="text-center py-8 text-gray-600">
                      No availability for selected date
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-2 sm:gap-3">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => {
                            setSelectedSlot(slot.id);
                            setAppointmentDetails({
                              ...appointmentDetails,
                              date: selectedDate,
                              time: slot.start_time
                            });
                          }}
                          className={`p-2 sm:p-3 rounded-lg border text-center transition-colors ${
                            slot.is_available
                              ? selectedSlot === slot.id
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white hover:bg-blue-50 text-gray-900 border-gray-200'
                              : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          }`}
                          disabled={!slot.is_available}
                        >
                          <div className="font-medium text-sm sm:text-base">{slot.start_time}</div>
                          <div className="text-xs">₹{Math.round(slot.price / 100)}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Lawyer Details & Continue */}
              <div className="space-y-6">
                <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base">
                      {(selectedLawyer.name || 'Unknown').split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{selectedLawyer.name || 'Unknown Lawyer'}</h4>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-sm">{selectedLawyer.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedLawyer.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4" />
                      <span>{selectedLawyer.experience_years} years experience</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4" />
                      <span>{selectedLawyer.languages.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {selectedSlot && appointmentDetails.date && appointmentDetails.time && (
                  <button
                    onClick={() => setStep(3)}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                  >
                    Continue to Details
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Appointment Details */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-4 px-4 sm:px-0">
              <button
                onClick={() => setStep(2)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Appointment Details</h2>
                <p className="text-gray-600 text-sm sm:text-base">Provide details about your consultation</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-6">
                  <h3 className="text-lg font-semibold mb-4">Consultation Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Document Type
                      </label>
                      <select
                        value={appointmentDetails.documentType || ''}
                        onChange={(e) => setAppointmentDetails({
                          ...appointmentDetails,
                          documentType: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      >
                        <option value="">Select document type</option>
                        {documentTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Consultation Mode
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {selectedLawyer?.consultation_modes.map((mode: string) => {
                          const Icon = getModeIcon(mode);
                          return (
                            <button
                              key={mode}
                              onClick={() => setAppointmentDetails({
                                ...appointmentDetails,
                                mode: mode as 'video' | 'phone' | 'in-person'
                              })}
                              className={`p-3 rounded-lg border text-center transition-colors ${
                                appointmentDetails.mode === mode
                                  ? `${getModeColor(mode)} border-2`
                                  : 'bg-white hover:bg-gray-50 border-gray-200'
                              }`}
                            >
                              <Icon className="w-5 h-5 mx-auto mb-1" />
                              <span className="text-sm font-medium capitalize">{mode}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Urgency Level
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {['low', 'medium', 'high'].map((urgency) => (
                          <button
                            key={urgency}
                            onClick={() => setAppointmentDetails({
                              ...appointmentDetails,
                              urgency: urgency as 'low' | 'medium' | 'high'
                            })}
                            className={`p-3 rounded-lg border text-center transition-colors ${
                              appointmentDetails.urgency === urgency
                                ? `${getUrgencyColor(urgency)} border-2`
                                : 'bg-white hover:bg-gray-50 border-gray-200'
                            }`}
                          >
                            <span className="text-sm font-medium capitalize">{urgency}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description (Optional)
                      </label>
                      <textarea
                        value={appointmentDetails.description || ''}
                        onChange={(e) => setAppointmentDetails({
                          ...appointmentDetails,
                          description: e.target.value
                        })}
                        placeholder="Briefly describe your legal matter..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Summary */}
              <div className="space-y-6">
                <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-6">
                  <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lawyer:</span>
                      <span className="font-medium truncate ml-2">{selectedLawyer?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {appointmentDetails.date?.toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{appointmentDetails.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mode:</span>
                      <span className="font-medium capitalize">{appointmentDetails.mode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Document:</span>
                      <span className="font-medium truncate ml-2">{appointmentDetails.documentType}</span>
                    </div>
                    <hr className="my-3" />
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>
                        ₹{availableSlots.find(slot => slot.id === selectedSlot)?.price 
                          ? Math.round((availableSlots.find(slot => slot.id === selectedSlot)?.price || 0) / 100)
                          : '0'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleBookAppointment}
                  disabled={!appointmentDetails.documentType || !appointmentDetails.mode}
                  className="w-full bg-blue-600 text-white py-3 px-4 sm:px-6 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Book & Pay</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-xl max-w-sm sm:max-w-md w-full p-4 sm:p-6 mx-4"
            >
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Confirm Booking</h3>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">
                  Are you sure you want to book this consultation with {selectedLawyer?.name}?
                </p>
                
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    disabled={bookingLoading}
                    className="w-full sm:flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    disabled={bookingLoading}
                    className="w-full sm:flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center text-sm sm:text-base"
                  >
                    {bookingLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Booking...
                      </>
                    ) : (
                      'Confirm & Pay'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
