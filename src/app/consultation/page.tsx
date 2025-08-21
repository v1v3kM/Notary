'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Video, 
  Phone, 
  MapPin, 
  FileText, 
  CreditCard, 
  CheckCircle,
  Star,
  ArrowRight,
  Shield,
  MessageCircle,
  Users,
  Globe,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  price: number;
}

interface Lawyer {
  id: string;
  name: string;
  specialization: string[];
  rating: number;
  experience: number;
  consultationPrice: number;
  image: string;
  verified: boolean;
  languages: string[];
}

const mockLawyers: Lawyer[] = [
  {
    id: '1',
    name: 'Advocate Priya Sharma',
    specialization: ['Property Law', 'Civil Law'],
    rating: 4.9,
    experience: 8,
    consultationPrice: 1500,
    image: '/lawyer1.jpg',
    verified: true,
    languages: ['Hindi', 'English', 'Punjabi']
  },
  {
    id: '2',
    name: 'Advocate Rajesh Kumar',
    specialization: ['Business Law', 'Corporate Law'],
    rating: 4.8,
    experience: 12,
    consultationPrice: 2000,
    image: '/lawyer2.jpg',
    verified: true,
    languages: ['Hindi', 'English', 'Marathi']
  },
  {
    id: '3',
    name: 'Advocate Meera Patel',
    specialization: ['Family Law', 'Personal Law'],
    rating: 4.7,
    experience: 6,
    consultationPrice: 1200,
    image: '/lawyer3.jpg',
    verified: true,
    languages: ['Hindi', 'English', 'Gujarati']
  }
];

const timeSlots: TimeSlot[] = [
  { id: '1', time: '09:00 AM', available: true, price: 1500 },
  { id: '2', time: '10:00 AM', available: false, price: 1500 },
  { id: '3', time: '11:00 AM', available: true, price: 1500 },
  { id: '4', time: '02:00 PM', available: true, price: 1500 },
  { id: '5', time: '03:00 PM', available: true, price: 1500 },
  { id: '6', time: '04:00 PM', available: false, price: 1500 },
  { id: '7', time: '05:00 PM', available: true, price: 1500 },
  { id: '8', time: '06:00 PM', available: true, price: 1800 } // Premium time
];

export default function ConsultationPage() {
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(mockLawyers[0]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [consultationType, setConsultationType] = useState<'video' | 'phone' | 'office'>('video');
  const [step, setStep] = useState(1);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    urgency: 'normal',
    legalArea: '',
    documents: [] as File[]
  });

  const consultationTypes = [
    {
      id: 'video',
      title: 'Video Consultation',
      description: 'Face-to-face consultation via secure video call',
      icon: Video,
      duration: '30-60 minutes',
      price: 0, // Base price
      features: ['HD Video Quality', 'Screen Sharing', 'Recording Available', 'Document Sharing']
    },
    {
      id: 'phone',
      title: 'Phone Consultation',
      description: 'Voice consultation via phone call',
      icon: Phone,
      duration: '30-45 minutes',
      price: -200, // Discount
      features: ['Direct Phone Call', 'Call Recording', 'Follow-up SMS', 'Email Summary']
    },
    {
      id: 'office',
      title: 'Office Visit',
      description: 'In-person consultation at lawyer\'s office',
      icon: MapPin,
      duration: '45-90 minutes',
      price: 300, // Premium
      features: ['Face-to-Face Meeting', 'Document Review', 'Detailed Discussion', 'Follow-up Support']
    }
  ];

  const legalAreas = [
    'Property Law',
    'Business Law',
    'Family Law',
    'Criminal Law',
    'Civil Law',
    'Corporate Law',
    'Labor Law',
    'Tax Law',
    'Immigration Law',
    'Intellectual Property'
  ];

  const faqs = [
    {
      id: '1',
      question: 'How do I prepare for my consultation?',
      answer: 'Gather all relevant documents, prepare specific questions, and ensure you have a quiet space for video/phone consultations.'
    },
    {
      id: '2',
      question: 'What if I need to reschedule?',
      answer: 'You can reschedule up to 24 hours before your appointment without any charges through your dashboard.'
    },
    {
      id: '3',
      question: 'Is my consultation confidential?',
      answer: 'Yes, all consultations are completely confidential and protected by attorney-client privilege.'
    },
    {
      id: '4',
      question: 'What documents should I prepare?',
      answer: 'Bring any relevant legal documents, contracts, notices, or papers related to your legal matter.'
    },
    {
      id: '5',
      question: 'How long does a consultation last?',
      answer: 'Consultation duration varies based on type: Video (30-60 min), Phone (30-45 min), Office visit (45-90 min).'
    }
  ];

  const getNextAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateTotal = () => {
    if (!selectedLawyer) return 0;
    const basePrice = selectedLawyer.consultationPrice;
    const typeAdjustment = consultationTypes.find(t => t.id === consultationType)?.price || 0;
    const selectedSlot = timeSlots.find(t => t.id === selectedTime);
    const timeAdjustment = selectedSlot ? selectedSlot.price - 1500 : 0;
    
    return basePrice + typeAdjustment + timeAdjustment;
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    // Handle consultation booking
    console.log('Booking consultation...', {
      lawyer: selectedLawyer,
      date: selectedDate,
      time: selectedTime,
      type: consultationType,
      formData
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Book Legal Consultation</h1>
              <p className="text-gray-600 mt-2">Get expert legal advice from verified lawyers</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-600">500+</span>
                </div>
                <p className="text-sm text-gray-600">Expert Lawyers</p>
              </div>
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-2xl font-bold text-yellow-500">4.8</span>
                </div>
                <p className="text-sm text-gray-600">Average Rating</p>
              </div>
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">24/7</span>
                </div>
                <p className="text-sm text-gray-600">Available</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Booking Flow */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between">
                {[
                  { num: 1, title: 'Select Lawyer', completed: step > 1 },
                  { num: 2, title: 'Choose Date & Time', completed: step > 2 },
                  { num: 3, title: 'Consultation Details', completed: step > 3 },
                  { num: 4, title: 'Payment & Confirmation', completed: false }
                ].map((stepItem, index) => (
                  <div key={stepItem.num} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      step === stepItem.num 
                        ? 'bg-blue-600 text-white' 
                        : stepItem.completed 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {stepItem.completed ? <CheckCircle className="w-5 h-5" /> : stepItem.num}
                    </div>
                    <span className={`ml-2 font-medium ${
                      step === stepItem.num ? 'text-blue-600' : stepItem.completed ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {stepItem.title}
                    </span>
                    {index < 3 && (
                      <ArrowRight className="w-5 h-5 text-gray-400 mx-4" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Lawyer</h2>
                  
                  <div className="space-y-4">
                    {mockLawyers.map((lawyer) => (
                      <div
                        key={lawyer.id}
                        onClick={() => setSelectedLawyer(lawyer)}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedLawyer?.id === lawyer.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                            {lawyer.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-gray-900">{lawyer.name}</h3>
                              {lawyer.verified && (
                                <CheckCircle className="w-4 h-4 text-blue-600" />
                              )}
                            </div>
                            <div className="flex items-center space-x-4 mt-1">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm font-medium">{lawyer.rating}</span>
                              </div>
                              <span className="text-sm text-gray-600">{lawyer.experience} years exp</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {lawyer.specialization.map((spec, idx) => (
                                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                  {spec}
                                </span>
                              ))}
                            </div>
                            <div className="mt-2">
                              <span className="text-sm text-gray-600">Languages: </span>
                              <span className="text-sm font-medium">{lawyer.languages.join(', ')}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">₹{lawyer.consultationPrice}</div>
                            <div className="text-sm text-gray-600">per consultation</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Date & Time</h2>
                  
                  {/* Consultation Type */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultation Type</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {consultationTypes.map((type) => (
                        <div
                          key={type.id}
                          onClick={() => setConsultationType(type.id as 'video' | 'phone' | 'office')}
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            consultationType === type.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-center">
                            <type.icon className={`w-8 h-8 mx-auto mb-2 ${
                              consultationType === type.id ? 'text-blue-600' : 'text-gray-600'
                            }`} />
                            <h4 className="font-semibold text-gray-900">{type.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                            <p className="text-sm font-medium text-blue-600 mt-2">{type.duration}</p>
                            {type.price !== 0 && (
                              <p className={`text-sm font-bold mt-1 ${
                                type.price > 0 ? 'text-red-600' : 'text-green-600'
                              }`}>
                                {type.price > 0 ? '+' : ''}₹{type.price}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Date</h3>
                    <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                      {getNextAvailableDates().map((date) => (
                        <button
                          key={date}
                          onClick={() => setSelectedDate(date)}
                          className={`p-3 rounded-lg text-center transition-all ${
                            selectedDate === date
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <div className="text-sm font-medium">{formatDate(date)}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Selection */}
                  {selectedDate && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Time</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot.id}
                            onClick={() => slot.available && setSelectedTime(slot.id)}
                            disabled={!slot.available}
                            className={`p-3 rounded-lg text-center transition-all ${
                              selectedTime === slot.id
                                ? 'bg-blue-600 text-white'
                                : slot.available
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            <div className="font-medium">{slot.time}</div>
                            {slot.price !== 1500 && (
                              <div className="text-xs">₹{slot.price}</div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Consultation Details</h2>
                  
                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Legal Area</label>
                        <select
                          value={formData.legalArea}
                          onChange={(e) => setFormData({...formData, legalArea: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select legal area</option>
                          {legalAreas.map(area => (
                            <option key={area} value={area}>{area}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
                      <div className="flex space-x-4">
                        {[
                          { value: 'low', label: 'Low', color: 'text-green-600' },
                          { value: 'normal', label: 'Normal', color: 'text-blue-600' },
                          { value: 'high', label: 'High', color: 'text-orange-600' },
                          { value: 'urgent', label: 'Urgent', color: 'text-red-600' }
                        ].map((urgency) => (
                          <label key={urgency.value} className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="urgency"
                              value={urgency.value}
                              checked={formData.urgency === urgency.value}
                              onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                              className="mr-2"
                            />
                            <span className={`font-medium ${urgency.color}`}>{urgency.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Describe Your Legal Issue
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Please provide details about your legal matter..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Relevant Documents (Optional)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">Drag and drop files here or click to upload</p>
                        <p className="text-sm text-gray-500 mt-1">PDF, DOC, JPG, PNG (Max 10MB each)</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment & Confirmation</h2>
                  
                  {/* Summary */}
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultation Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lawyer:</span>
                        <span className="font-medium">{selectedLawyer?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date & Time:</span>
                        <span className="font-medium">
                          {selectedDate && formatDate(selectedDate)} at {timeSlots.find(t => t.id === selectedTime)?.time}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Consultation Type:</span>
                        <span className="font-medium capitalize">{consultationType} Consultation</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Legal Area:</span>
                        <span className="font-medium">{formData.legalArea}</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between text-lg font-bold">
                        <span>Total Amount:</span>
                        <span className="text-blue-600">₹{calculateTotal()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: 'card', title: 'Credit/Debit Card', icon: CreditCard },
                        { id: 'upi', title: 'UPI Payment', icon: Phone },
                        { id: 'wallet', title: 'Digital Wallet', icon: Zap }
                      ].map((method) => (
                        <div key={method.id} className="p-4 border border-gray-300 rounded-lg text-center hover:border-blue-500 cursor-pointer">
                          <method.icon className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                          <span className="font-medium">{method.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handlePrevious}
                  disabled={step === 1}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {step < 4 ? (
                  <button
                    onClick={handleNext}
                    disabled={
                      (step === 1 && !selectedLawyer) ||
                      (step === 2 && (!selectedDate || !selectedTime)) ||
                      (step === 3 && (!formData.name || !formData.email || !formData.phone))
                    }
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                  >
                    <span>Confirm & Pay</span>
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Why Choose Us */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Choose Our Platform?</h3>
              <div className="space-y-4">
                {[
                  { icon: Shield, title: 'Verified Lawyers', description: 'All lawyers are verified and licensed' },
                  { icon: Clock, title: 'Quick Booking', description: 'Book consultations in just a few clicks' },
                  { icon: Star, title: 'High Ratings', description: '4.8/5 average customer satisfaction' },
                  { icon: Globe, title: 'Secure Platform', description: 'End-to-end encrypted consultations' }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <feature.icon className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <div className="font-medium text-gray-900">{feature.title}</div>
                      <div className="text-sm text-gray-600">{feature.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-3">
                {faqs.slice(0, 3).map((faq) => (
                  <div key={faq.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      className="w-full text-left flex items-center justify-between"
                    >
                      <span className="font-medium text-gray-900 text-sm">{faq.question}</span>
                      {expandedFAQ === faq.id ? 
                        <ChevronUp className="w-4 h-4 text-gray-500" /> : 
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      }
                    </button>
                    {expandedFAQ === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-2"
                      >
                        <p className="text-sm text-gray-600">{faq.answer}</p>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
              <p className="text-blue-100 text-sm mb-4">
                Our support team is available 24/7 to assist you
              </p>
              <div className="flex space-x-3">
                <button className="flex items-center space-x-2 bg-white/20 text-white px-3 py-2 rounded-lg text-sm hover:bg-white/30 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat</span>
                </button>
                <button className="flex items-center space-x-2 bg-white/20 text-white px-3 py-2 rounded-lg text-sm hover:bg-white/30 transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
