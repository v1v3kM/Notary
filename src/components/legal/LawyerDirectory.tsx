'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  MapPin,
  Star,
  Clock,
  Award,
  Briefcase,
  Scale,
  FileText,
  ChevronDown,
  X,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  MessageCircle,
  Video,
  Home,
  Shield,
  Zap,
  Calendar,
  Badge,
  TrendingUp,
  Users,
  Percent
} from 'lucide-react';

interface Lawyer {
  id: string;
  name: string;
  specialization: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  location: string;
  languages: string[];
  priceRange: string;
  availability: 'available' | 'busy' | 'offline';
  profileImage: string;
  completedCases: number;
  responseTime: string;
  description: string;
  verified: boolean;
  // Portal-specific features
  notaryExpertise: string[];
  documentTypes: string[];
  onlineConsultation: boolean;
  emergencyAvailable: boolean;
  barCouncilNumber: string;
  notaryLicenseNumber?: string;
  digitalSignature: boolean;
  videoNotarization: boolean;
  homeVisit: boolean;
  governmentApproved: boolean;
  successRate: number;
  avgProcessingTime: string;
  clientRetentionRate: number;
  specialOffers?: string;
  workingHours: {
    weekdays: string;
    weekends: string;
  };
}

const mockLawyers: Lawyer[] = [
  {
    id: '1',
    name: 'Advocate Priya Sharma',
    specialization: ['Property Law', 'Civil Law', 'Contract Law'],
    experience: 8,
    rating: 4.9,
    reviewCount: 127,
    location: 'New Delhi',
    languages: ['Hindi', 'English', 'Punjabi'],
    priceRange: '₹2,000 - ₹5,000',
    availability: 'available',
    profileImage: '/api/placeholder/lawyer1.jpg',
    completedCases: 245,
    responseTime: '< 2 hours',
    description: 'Specialized in property transactions and civil disputes with 8+ years of experience.',
    verified: true,
    notaryExpertise: ['Property Registration', 'Sale Deeds', 'Lease Agreements', 'Power of Attorney'],
    documentTypes: ['Property Sale Agreement', 'Rental Agreement', 'NOC', 'Affidavits'],
    onlineConsultation: true,
    emergencyAvailable: false,
    barCouncilNumber: 'D/1234/2015',
    notaryLicenseNumber: 'NOT/DL/2016/001',
    digitalSignature: true,
    videoNotarization: true,
    homeVisit: true,
    governmentApproved: true,
    successRate: 98.5,
    avgProcessingTime: '2-3 days',
    clientRetentionRate: 92,
    specialOffers: '10% off for first-time clients',
    workingHours: {
      weekdays: '9:00 AM - 7:00 PM',
      weekends: '10:00 AM - 5:00 PM'
    }
  },
  {
    id: '2',
    name: 'Advocate Rajesh Kumar',
    specialization: ['Business Law', 'Corporate Law', 'Partnership Deeds'],
    experience: 12,
    rating: 4.8,
    reviewCount: 89,
    location: 'Mumbai',
    languages: ['Hindi', 'English', 'Marathi'],
    priceRange: '₹3,000 - ₹8,000',
    availability: 'available',
    profileImage: '/api/placeholder/lawyer2.jpg',
    completedCases: 312,
    responseTime: '< 1 hour',
    description: 'Expert in business law and corporate matters with extensive experience in partnerships.',
    verified: true,
    notaryExpertise: ['Business Registration', 'Partnership Deeds', 'MOUs', 'Corporate Agreements'],
    documentTypes: ['Partnership Deed', 'MOA/AOA', 'Share Transfer', 'Employment Contract'],
    onlineConsultation: true,
    emergencyAvailable: true,
    barCouncilNumber: 'M/5678/2011',
    digitalSignature: true,
    videoNotarization: true,
    homeVisit: false,
    governmentApproved: true,
    successRate: 96.8,
    avgProcessingTime: '1-2 days',
    clientRetentionRate: 88,
    specialOffers: 'Express service available',
    workingHours: {
      weekdays: '8:00 AM - 8:00 PM',
      weekends: 'By appointment only'
    }
  },
  {
    id: '3',
    name: 'Advocate Meera Patel',
    specialization: ['Family Law', 'Personal Law', 'Affidavits'],
    experience: 6,
    rating: 4.7,
    reviewCount: 156,
    location: 'Ahmedabad',
    languages: ['Hindi', 'English', 'Gujarati'],
    priceRange: '₹1,500 - ₹4,000',
    availability: 'busy',
    profileImage: '/api/placeholder/lawyer3.jpg',
    completedCases: 189,
    responseTime: '< 3 hours',
    description: 'Dedicated family law practitioner with focus on personal legal matters.',
    verified: true,
    notaryExpertise: ['Identity Affidavits', 'Income Certificates', 'Character Certificates', 'Name Change'],
    documentTypes: ['Identity Affidavit', 'Income Certificate', 'Character Certificate', 'Marriage Certificate'],
    onlineConsultation: true,
    emergencyAvailable: false,
    barCouncilNumber: 'G/9012/2017',
    digitalSignature: true,
    videoNotarization: false,
    homeVisit: true,
    governmentApproved: true,
    successRate: 94.2,
    avgProcessingTime: '3-4 days',
    clientRetentionRate: 85,
    workingHours: {
      weekdays: '10:00 AM - 6:00 PM',
      weekends: '10:00 AM - 2:00 PM'
    }
  },
  {
    id: '4',
    name: 'Advocate Arjun Singh',
    specialization: ['Criminal Law', 'Civil Rights', 'Legal Documentation'],
    experience: 15,
    rating: 4.9,
    reviewCount: 203,
    location: 'Bangalore',
    languages: ['Hindi', 'English', 'Kannada', 'Tamil'],
    priceRange: '₹4,000 - ₹10,000',
    availability: 'available',
    profileImage: '/api/placeholder/lawyer4.jpg',
    completedCases: 456,
    responseTime: '< 30 minutes',
    description: 'Senior advocate with expertise in criminal law and comprehensive legal documentation.',
    verified: true,
    notaryExpertise: ['Court Documents', 'Bail Applications', 'Legal Notices', 'Witness Statements'],
    documentTypes: ['Legal Notice', 'Bail Application', 'Witness Statement', 'Court Affidavit'],
    onlineConsultation: true,
    emergencyAvailable: true,
    barCouncilNumber: 'K/3456/2008',
    digitalSignature: true,
    videoNotarization: true,
    homeVisit: false,
    governmentApproved: true,
    successRate: 97.3,
    avgProcessingTime: 'Same day',
    clientRetentionRate: 95,
    specialOffers: '24/7 emergency consultation',
    workingHours: {
      weekdays: '24/7',
      weekends: '24/7'
    }
  },
  {
    id: '5',
    name: 'Advocate Kavita Reddy',
    specialization: ['Property Law', 'Real Estate', 'Registration'],
    experience: 10,
    rating: 4.8,
    reviewCount: 134,
    location: 'Hyderabad',
    languages: ['Hindi', 'English', 'Telugu'],
    priceRange: '₹2,500 - ₹6,000',
    availability: 'offline',
    profileImage: '/api/placeholder/lawyer5.jpg',
    completedCases: 278,
    responseTime: '< 4 hours',
    description: 'Real estate law specialist with deep knowledge of property registration processes.',
    verified: true,
    notaryExpertise: ['Property Registration', 'Title Verification', 'Encumbrance Certificate', 'Mutation'],
    documentTypes: ['Sale Deed', 'Gift Deed', 'Will', 'Partition Deed'],
    onlineConsultation: false,
    emergencyAvailable: false,
    barCouncilNumber: 'T/7890/2013',
    notaryLicenseNumber: 'NOT/HYD/2014/002',
    digitalSignature: false,
    videoNotarization: false,
    homeVisit: true,
    governmentApproved: true,
    successRate: 99.1,
    avgProcessingTime: '4-5 days',
    clientRetentionRate: 90,
    workingHours: {
      weekdays: '9:30 AM - 6:30 PM',
      weekends: 'Closed'
    }
  }
];

export default function LawyerDirectory() {
  const [lawyers] = useState<Lawyer[]>(mockLawyers);
  const [filteredLawyers, setFilteredLawyers] = useState<Lawyer[]>(mockLawyers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  
  // Portal-specific filters
  const [documentTypeFilter, setDocumentTypeFilter] = useState('all');
  const [onlineConsultationOnly, setOnlineConsultationOnly] = useState(false);
  const [emergencyAvailableOnly, setEmergencyAvailableOnly] = useState(false);
  const [videoNotarizationOnly, setVideoNotarizationOnly] = useState(false);
  const [homeVisitOnly, setHomeVisitOnly] = useState(false);
  const [governmentApprovedOnly, setGovernmentApprovedOnly] = useState(false);
  const [minSuccessRate, setMinSuccessRate] = useState(0);

  const specializations = ['Property Law', 'Business Law', 'Family Law', 'Criminal Law', 'Civil Law', 'Corporate Law'];
  const locations = ['New Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Pune'];
  const documentTypes = ['Property Sale Agreement', 'Partnership Deed', 'Rental Agreement', 'Identity Affidavit', 'Legal Notice', 'Employment Contract'];

  const applyFilters = () => {
    const filtered = lawyers.filter(lawyer => {
      const matchesSearch = lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lawyer.specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           lawyer.notaryExpertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesSpecialization = selectedSpecialization === 'all' ||
                                   lawyer.specialization.includes(selectedSpecialization);
      
      const matchesLocation = selectedLocation === 'all' || lawyer.location === selectedLocation;
      
      const matchesAvailability = availabilityFilter === 'all' || lawyer.availability === availabilityFilter;

      // Portal-specific filters
      const matchesDocumentType = documentTypeFilter === 'all' ||
                                 lawyer.documentTypes.includes(documentTypeFilter);

      const matchesOnlineConsultation = !onlineConsultationOnly || lawyer.onlineConsultation;
      const matchesEmergencyAvailable = !emergencyAvailableOnly || lawyer.emergencyAvailable;
      const matchesVideoNotarization = !videoNotarizationOnly || lawyer.videoNotarization;
      const matchesHomeVisit = !homeVisitOnly || lawyer.homeVisit;
      const matchesGovernmentApproved = !governmentApprovedOnly || lawyer.governmentApproved;
      const matchesSuccessRate = lawyer.successRate >= minSuccessRate;

      return matchesSearch && matchesSpecialization && matchesLocation && matchesAvailability &&
             matchesDocumentType && matchesOnlineConsultation && matchesEmergencyAvailable &&
             matchesVideoNotarization && matchesHomeVisit && matchesGovernmentApproved && matchesSuccessRate;
    });

    setFilteredLawyers(filtered);
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-700 border-green-200';
      case 'busy': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'offline': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available': return 'Available';
      case 'busy': return 'Busy';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lawyer Directory</h1>
              <p className="text-gray-600 mt-2">
                Find verified legal professionals for your document needs
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white/70 border border-white/20 px-4 py-2 rounded-xl flex items-center space-x-2 hover:bg-white/90 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search lawyers by name or specialization..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                applyFilters();
              }}
              className="w-full pl-12 pr-4 py-4 bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                    <select
                      value={selectedSpecialization}
                      onChange={(e) => {
                        setSelectedSpecialization(e.target.value);
                        applyFilters();
                      }}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Specializations</option>
                      {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => {
                        setSelectedLocation(e.target.value);
                        applyFilters();
                      }}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Locations</option>
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                    <select
                      value={documentTypeFilter}
                      onChange={(e) => {
                        setDocumentTypeFilter(e.target.value);
                        applyFilters();
                      }}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Document Types</option>
                      {documentTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                    <select
                      value={availabilityFilter}
                      onChange={(e) => {
                        setAvailabilityFilter(e.target.value);
                        applyFilters();
                      }}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="available">Available</option>
                      <option value="busy">Busy</option>
                      <option value="offline">Offline</option>
                    </select>
                  </div>
                </div>

                {/* Portal-specific filters */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Notary Platform Features</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={onlineConsultationOnly}
                        onChange={(e) => {
                          setOnlineConsultationOnly(e.target.checked);
                          applyFilters();
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Online Consultation</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={videoNotarizationOnly}
                        onChange={(e) => {
                          setVideoNotarizationOnly(e.target.checked);
                          applyFilters();
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Video Notarization</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={homeVisitOnly}
                        onChange={(e) => {
                          setHomeVisitOnly(e.target.checked);
                          applyFilters();
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Home Visit</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emergencyAvailableOnly}
                        onChange={(e) => {
                          setEmergencyAvailableOnly(e.target.checked);
                          applyFilters();
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Emergency Available</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={governmentApprovedOnly}
                        onChange={(e) => {
                          setGovernmentApprovedOnly(e.target.checked);
                          applyFilters();
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Govt. Approved</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Success Rate: {minSuccessRate}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={minSuccessRate}
                        onChange={(e) => {
                          setMinSuccessRate(Number(e.target.value));
                          applyFilters();
                        }}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedSpecialization('all');
                          setSelectedLocation('all');
                          setAvailabilityFilter('all');
                          setDocumentTypeFilter('all');
                          setOnlineConsultationOnly(false);
                          setEmergencyAvailableOnly(false);
                          setVideoNotarizationOnly(false);
                          setHomeVisitOnly(false);
                          setGovernmentApprovedOnly(false);
                          setMinSuccessRate(0);
                          setFilteredLawyers(lawyers);
                        }}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredLawyers.length} of {lawyers.length} lawyers
          </p>
        </div>

        {/* Lawyers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLawyers.map((lawyer, index) => (
            <motion.div
              key={lawyer.id}
              className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedLawyer(lawyer)}
            >
              {/* Profile Header */}
              <div className="flex items-start space-x-4 mb-4">
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
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{lawyer.rating}</span>
                      <span className="text-sm text-gray-500">({lawyer.reviewCount})</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getAvailabilityColor(lawyer.availability)}`}>
                      {getAvailabilityText(lawyer.availability)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Specializations */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {lawyer.specialization.slice(0, 2).map((spec, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {spec}
                    </span>
                  ))}
                  {lawyer.specialization.length > 2 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                      +{lawyer.specialization.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {/* Key Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{lawyer.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase className="w-4 h-4 mr-2" />
                  <span>{lawyer.experience} years experience</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Responds in {lawyer.responseTime}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span>{lawyer.successRate}% success rate</span>
                </div>
              </div>

              {/* Portal-specific badges */}
              <div className="flex flex-wrap gap-1 mb-4">
                {lawyer.onlineConsultation && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center">
                    <Video className="w-3 h-3 mr-1" />
                    Online
                  </span>
                )}
                {lawyer.videoNotarization && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full flex items-center">
                    <Video className="w-3 h-3 mr-1" />
                    Video Notary
                  </span>
                )}
                {lawyer.homeVisit && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full flex items-center">
                    <Home className="w-3 h-3 mr-1" />
                    Home Visit
                  </span>
                )}
                {lawyer.emergencyAvailable && (
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full flex items-center">
                    <Zap className="w-3 h-3 mr-1" />
                    Emergency
                  </span>
                )}
                {lawyer.governmentApproved && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full flex items-center">
                    <Shield className="w-3 h-3 mr-1" />
                    Govt. Approved
                  </span>
                )}
              </div>

              {/* Price and Action */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="font-semibold text-gray-900">{lawyer.priceRange}</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  View Profile
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredLawyers.length === 0 && (
          <div className="text-center py-12">
            <Scale className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No lawyers found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search criteria or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecialization('all');
                setSelectedLocation('all');
                setAvailabilityFilter('all');
                setDocumentTypeFilter('all');
                setOnlineConsultationOnly(false);
                setEmergencyAvailableOnly(false);
                setVideoNotarizationOnly(false);
                setHomeVisitOnly(false);
                setGovernmentApprovedOnly(false);
                setMinSuccessRate(0);
                setFilteredLawyers(lawyers);
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Lawyer Profile Modal */}
      <AnimatePresence>
        {selectedLawyer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedLawyer(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                      {selectedLawyer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h2 className="text-2xl font-bold text-gray-900">{selectedLawyer.name}</h2>
                        {selectedLawyer.verified && (
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className="font-medium">{selectedLawyer.rating}</span>
                          <span className="text-gray-500">({selectedLawyer.reviewCount} reviews)</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getAvailabilityColor(selectedLawyer.availability)}`}>
                          {getAvailabilityText(selectedLawyer.availability)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedLawyer(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">About</h3>
                  <p className="text-gray-600">{selectedLawyer.description}</p>
                </div>

                {/* Specializations */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedLawyer.specialization.map((spec, idx) => (
                      <span key={idx} className="px-3 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Notary Expertise */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Notary Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedLawyer.notaryExpertise.map((exp, idx) => (
                      <span key={idx} className="px-3 py-2 bg-purple-100 text-purple-700 text-sm font-medium rounded-lg">
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Document Types */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Document Types Handled</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedLawyer.documentTypes.map((doc, idx) => (
                      <span key={idx} className="px-3 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg">
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Portal Features */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Platform Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${selectedLawyer.onlineConsultation ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-sm">Online Consultation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${selectedLawyer.videoNotarization ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-sm">Video Notarization</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${selectedLawyer.homeVisit ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-sm">Home Visit</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${selectedLawyer.emergencyAvailable ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-sm">Emergency Available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${selectedLawyer.digitalSignature ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-sm">Digital Signature</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${selectedLawyer.governmentApproved ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-sm">Govt. Approved</span>
                    </div>
                  </div>
                </div>

                {/* Key Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-500">Location</span>
                        <p className="font-medium">{selectedLawyer.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Briefcase className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-500">Experience</span>
                        <p className="font-medium">{selectedLawyer.experience} years</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-500">Languages</span>
                        <p className="font-medium">{selectedLawyer.languages.join(', ')}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-500">Bar Council No.</span>
                        <p className="font-medium">{selectedLawyer.barCouncilNumber}</p>
                      </div>
                    </div>
                    {selectedLawyer.notaryLicenseNumber && (
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-gray-400" />
                        <div>
                          <span className="text-sm text-gray-500">Notary License</span>
                          <p className="font-medium">{selectedLawyer.notaryLicenseNumber}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-500">Completed Cases</span>
                        <p className="font-medium">{selectedLawyer.completedCases}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-500">Response Time</span>
                        <p className="font-medium">{selectedLawyer.responseTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-500">Success Rate</span>
                        <p className="font-medium">{selectedLawyer.successRate}%</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-500">Client Retention</span>
                        <p className="font-medium">{selectedLawyer.clientRetentionRate}%</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Award className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-500">Price Range</span>
                        <p className="font-medium">{selectedLawyer.priceRange}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Working Hours & Special Offers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Working Hours
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>Weekdays: {selectedLawyer.workingHours.weekdays}</div>
                      <div>Weekends: {selectedLawyer.workingHours.weekends}</div>
                    </div>
                  </div>
                  
                  {selectedLawyer.specialOffers && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 flex items-center text-green-700">
                        <Percent className="w-4 h-4 mr-2" />
                        Special Offer
                      </h4>
                      <p className="text-sm text-green-600">{selectedLawyer.specialOffers}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                    <MessageCircle className="w-5 h-5" />
                    <span>Start Consultation</span>
                  </button>
                  <button className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Book Notary Service</span>
                  </button>
                  <button className="bg-green-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                    <Phone className="w-5 h-5" />
                    <span>Call</span>
                  </button>
                  <button className="bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
                    <Mail className="w-5 h-5" />
                    <span>Email</span>
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
