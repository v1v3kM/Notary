'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  MapPin,
  Star,
  Calendar,
  Phone,
  Video,
  MessageSquare,
  CheckCircle,
  GraduationCap,
  Eye,
  MoreVertical,
  Grid,
  List,
  AlertCircle
} from 'lucide-react';

interface Lawyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  specializations: string[];
  location: {
    city: string;
    state: string;
    country: string;
  };
  experience: number;
  rating: number;
  totalReviews: number;
  successRate: number;
  responseTime: string;
  availability: 'available' | 'busy' | 'offline';
  verified: boolean;
  languages: string[];
  education: {
    degree: string;
    institution: string;
    year: number;
  }[];
  barCouncilNumber: string;
  practiceAreas: string[];
  pricing: {
    consultation: number;
    hourlyRate: number;
    documentReview: number;
  };
  stats: {
    totalCases: number;
    activeCases: number;
    completedCases: number;
    clientSatisfaction: number;
    avgResponseTime: string;
  };
  description: string;
  joinedDate: Date;
  lastActive: Date;
  featured: boolean;
}

interface SearchFilters {
  specialization: string;
  location: string;
  experience: string;
  rating: string;
  availability: string;
  priceRange: string;
  language: string;
  sortBy: string;
}

const mockLawyers: Lawyer[] = [
  {
    id: '1',
    name: 'Advocate Priya Sharma',
    email: 'priya.sharma@law.com',
    phone: '+91 98765 43210',
    specializations: ['Property Law', 'Civil Law', 'Real Estate'],
    location: { city: 'New Delhi', state: 'Delhi', country: 'India' },
    experience: 8,
    rating: 4.9,
    totalReviews: 187,
    successRate: 96.5,
    responseTime: '< 2 hours',
    availability: 'available',
    verified: true,
    languages: ['English', 'Hindi', 'Punjabi'],
    education: [
      { degree: 'LLB', institution: 'Delhi University', year: 2016 },
      { degree: 'LLM in Property Law', institution: 'NLSIU Bangalore', year: 2018 }
    ],
    barCouncilNumber: 'D/12345/2016',
    practiceAreas: ['Property Disputes', 'Real Estate Transactions', 'Civil Litigation'],
    pricing: {
      consultation: 2500,
      hourlyRate: 4000,
      documentReview: 1500
    },
    stats: {
      totalCases: 245,
      activeCases: 18,
      completedCases: 227,
      clientSatisfaction: 4.9,
      avgResponseTime: '1.5 hours'
    },
    description: 'Specialized in property law with extensive experience in real estate transactions and property disputes. Known for quick resolution and client-focused approach.',
    joinedDate: new Date('2020-03-15'),
    lastActive: new Date(Date.now() - 30 * 60 * 1000),
    featured: true
  },
  {
    id: '2',
    name: 'Advocate Rajesh Kumar',
    email: 'rajesh.kumar@law.com',
    phone: '+91 87654 32109',
    specializations: ['Business Law', 'Corporate Law', 'Contract Law'],
    location: { city: 'Mumbai', state: 'Maharashtra', country: 'India' },
    experience: 12,
    rating: 4.8,
    totalReviews: 298,
    successRate: 94.2,
    responseTime: '< 3 hours',
    availability: 'busy',
    verified: true,
    languages: ['English', 'Hindi', 'Marathi'],
    education: [
      { degree: 'BBA LLB', institution: 'NMIMS Mumbai', year: 2012 },
      { degree: 'LLM in Corporate Law', institution: 'ILS Pune', year: 2014 }
    ],
    barCouncilNumber: 'M/67890/2012',
    practiceAreas: ['Corporate Compliance', 'Mergers & Acquisitions', 'Business Contracts'],
    pricing: {
      consultation: 3500,
      hourlyRate: 6000,
      documentReview: 2000
    },
    stats: {
      totalCases: 412,
      activeCases: 24,
      completedCases: 388,
      clientSatisfaction: 4.8,
      avgResponseTime: '2.2 hours'
    },
    description: 'Expert in corporate law with 12+ years of experience helping businesses navigate complex legal challenges. Specializes in startup legal advice and corporate structuring.',
    joinedDate: new Date('2019-08-20'),
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    featured: true
  },
  {
    id: '3',
    name: 'Advocate Meera Patel',
    email: 'meera.patel@law.com',
    phone: '+91 76543 21098',
    specializations: ['Family Law', 'Divorce Law', 'Child Custody'],
    location: { city: 'Ahmedabad', state: 'Gujarat', country: 'India' },
    experience: 6,
    rating: 4.7,
    totalReviews: 142,
    successRate: 92.8,
    responseTime: '< 4 hours',
    availability: 'available',
    verified: true,
    languages: ['English', 'Hindi', 'Gujarati'],
    education: [
      { degree: 'LLB', institution: 'Gujarat University', year: 2018 },
      { degree: 'PG Diploma in Family Law', institution: 'NUJS Kolkata', year: 2019 }
    ],
    barCouncilNumber: 'G/54321/2018',
    practiceAreas: ['Divorce Proceedings', 'Child Custody', 'Domestic Violence'],
    pricing: {
      consultation: 2000,
      hourlyRate: 3500,
      documentReview: 1200
    },
    stats: {
      totalCases: 156,
      activeCases: 12,
      completedCases: 144,
      clientSatisfaction: 4.7,
      avgResponseTime: '3.1 hours'
    },
    description: 'Compassionate family law attorney with expertise in sensitive family matters. Known for her empathetic approach and successful mediation skills.',
    joinedDate: new Date('2021-01-10'),
    lastActive: new Date(Date.now() - 6 * 60 * 60 * 1000),
    featured: false
  }
];

const specializationOptions = [
  'All Specializations', 'Property Law', 'Business Law', 'Corporate Law', 'Family Law',
  'Criminal Law', 'Civil Law', 'Labor Law', 'Tax Law', 'Intellectual Property',
  'Constitutional Law', 'Environmental Law', 'Immigration Law'
];

const locationOptions = [
  'All Locations', 'New Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata',
  'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh'
];

const languageOptions = [
  'All Languages', 'English', 'Hindi', 'Bengali', 'Tamil', 'Telugu',
  'Marathi', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Urdu'
];

export default function LawyerManagement() {
  const [lawyers] = useState<Lawyer[]>(mockLawyers);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  
  const [filters, setFilters] = useState<SearchFilters>({
    specialization: 'All Specializations',
    location: 'All Locations',
    experience: 'Any',
    rating: 'Any',
    availability: 'All',
    priceRange: 'Any',
    language: 'All Languages',
    sortBy: 'rating'
  });

  // Filter and search logic
  const filteredLawyers = lawyers.filter(lawyer => {
    // Search query filter
    if (searchQuery && !lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !lawyer.specializations.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }

    // Specialization filter
    if (filters.specialization !== 'All Specializations' && 
        !lawyer.specializations.includes(filters.specialization)) {
      return false;
    }

    // Location filter
    if (filters.location !== 'All Locations' && lawyer.location.city !== filters.location) {
      return false;
    }

    // Experience filter
    if (filters.experience !== 'Any') {
      const expValue = parseInt(filters.experience);
      if (expValue === 5 && lawyer.experience < 5) return false;
      if (expValue === 10 && lawyer.experience < 10) return false;
    }

    // Rating filter
    if (filters.rating !== 'Any') {
      const ratingValue = parseFloat(filters.rating);
      if (lawyer.rating < ratingValue) return false;
    }

    // Availability filter
    if (filters.availability !== 'All' && lawyer.availability !== filters.availability) {
      return false;
    }

    // Language filter
    if (filters.language !== 'All Languages' && 
        !lawyer.languages.includes(filters.language)) {
      return false;
    }

    return true;
  });

  // Sort logic
  const sortedLawyers = [...filteredLawyers].sort((a, b) => {
    switch (filters.sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'experience':
        return b.experience - a.experience;
      case 'rating':
        return b.rating - a.rating;
      case 'price':
        return a.pricing.consultation - b.pricing.consultation;
      case 'location':
        return a.location.city.localeCompare(b.location.city);
      default:
        return b.rating - a.rating;
    }
  });

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-700 border-green-200';
      case 'busy': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'offline': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getExperienceLevel = (years: number) => {
    if (years < 3) return 'Junior';
    if (years < 7) return 'Mid-level';
    if (years < 12) return 'Senior';
    return 'Expert';
  };

  const openProfile = (lawyer: Lawyer) => {
    setSelectedLawyer(lawyer);
    setShowProfile(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Legal Experts</h1>
              <p className="text-gray-600">Connect with verified lawyers across India</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{lawyers.length}</p>
                <p className="text-sm text-gray-600">Verified Lawyers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">4.8</p>
                <p className="text-sm text-gray-600">Avg Rating</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">24/7</p>
                <p className="text-sm text-gray-600">Available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, specialization, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  showFilters ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>

              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="rating">Sort by Rating</option>
                <option value="name">Sort by Name</option>
                <option value="experience">Sort by Experience</option>
                <option value="price">Sort by Price</option>
                <option value="location">Sort by Location</option>
              </select>

              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-6 pt-6 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                    <select
                      value={filters.specialization}
                      onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {specializationOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <select
                      value={filters.location}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {locationOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                    <select
                      value={filters.experience}
                      onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Any">Any Experience</option>
                      <option value="5">5+ Years</option>
                      <option value="10">10+ Years</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <select
                      value={filters.rating}
                      onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Any">Any Rating</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="4.0">4.0+ Stars</option>
                      <option value="3.5">3.5+ Stars</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                    <select
                      value={filters.availability}
                      onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="All">All</option>
                      <option value="available">Available</option>
                      <option value="busy">Busy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={filters.language}
                      onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {languageOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                    <select
                      value={filters.priceRange}
                      onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Any">Any Price</option>
                      <option value="low">Under ₹2,000</option>
                      <option value="medium">₹2,000 - ₹5,000</option>
                      <option value="high">Above ₹5,000</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => setFilters({
                        specialization: 'All Specializations',
                        location: 'All Locations',
                        experience: 'Any',
                        rating: 'Any',
                        availability: 'All',
                        priceRange: 'Any',
                        language: 'All Languages',
                        sortBy: 'rating'
                      })}
                      className="w-full px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {sortedLawyers.length} of {lawyers.length} lawyers
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Lawyers Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedLawyers.map((lawyer) => (
              <motion.div
                key={lawyer.id}
                className={`bg-white/70 backdrop-blur-sm border rounded-2xl p-6 cursor-pointer transition-all hover:shadow-lg ${
                  lawyer.featured ? 'border-blue-300 bg-blue-50/50' : 'border-white/20'
                }`}
                whileHover={{ scale: 1.02 }}
                onClick={() => openProfile(lawyer)}
              >
                {lawyer.featured && (
                  <div className="flex items-center justify-center mb-4">
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                      Featured
                    </span>
                  </div>
                )}

                <div className="flex items-center space-x-4 mb-4">
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
                    <p className="text-sm text-gray-600">{getExperienceLevel(lawyer.experience)}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getAvailabilityColor(lawyer.availability)}`}>
                        {lawyer.availability}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{lawyer.rating}</span>
                      <span className="text-sm text-gray-500">({lawyer.totalReviews})</span>
                    </div>
                    <span className="text-sm text-gray-600">{lawyer.experience} years</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{lawyer.location.city}, {lawyer.location.state}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {lawyer.specializations.slice(0, 2).map((spec) => (
                      <span key={spec} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {spec}
                      </span>
                    ))}
                    {lawyer.specializations.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{lawyer.specializations.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600">Consultation</p>
                    <p className="font-semibold text-gray-900">₹{lawyer.pricing.consultation.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lawyer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Specializations
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedLawyers.map((lawyer) => (
                    <tr key={lawyer.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openProfile(lawyer)}>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                            {lawyer.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium text-gray-900">{lawyer.name}</p>
                              {lawyer.verified && <CheckCircle className="w-4 h-4 text-blue-600" />}
                              {lawyer.featured && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                            </div>
                            <p className="text-sm text-gray-500">{lawyer.experience} years experience</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {lawyer.specializations.slice(0, 2).map((spec) => (
                            <span key={spec} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {lawyer.location.city}, {lawyer.location.state}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{lawyer.rating}</span>
                          <span className="text-sm text-gray-500">({lawyer.totalReviews})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        ₹{lawyer.pricing.consultation.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Phone className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {sortedLawyers.length === 0 && (
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No lawyers found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilters({
                  specialization: 'All Specializations',
                  location: 'All Locations',
                  experience: 'Any',
                  rating: 'Any',
                  availability: 'All',
                  priceRange: 'Any',
                  language: 'All Languages',
                  sortBy: 'rating'
                });
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Lawyer Profile Modal */}
        <AnimatePresence>
          {showProfile && selectedLawyer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-4xl w-full max-h-screen overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                        {selectedLawyer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h2 className="text-2xl font-bold text-gray-900">{selectedLawyer.name}</h2>
                          {selectedLawyer.verified && <CheckCircle className="w-6 h-6 text-blue-600" />}
                          {selectedLawyer.featured && <Star className="w-6 h-6 text-yellow-500 fill-current" />}
                        </div>
                        <p className="text-gray-600">{selectedLawyer.specializations.join(', ')}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="font-medium">{selectedLawyer.rating}</span>
                            <span className="text-sm text-gray-500">({selectedLawyer.totalReviews} reviews)</span>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getAvailabilityColor(selectedLawyer.availability)}`}>
                            {selectedLawyer.availability}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowProfile(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <MoreVertical className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">About</h3>
                        <p className="text-gray-700">{selectedLawyer.description}</p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">Education</h3>
                        <div className="space-y-3">
                          {selectedLawyer.education.map((edu, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <GraduationCap className="w-5 h-5 text-blue-600" />
                              <div>
                                <p className="font-medium">{edu.degree}</p>
                                <p className="text-sm text-gray-600">{edu.institution} • {edu.year}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">Practice Areas</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedLawyer.practiceAreas.map((area) => (
                            <span key={area} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg">
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">Languages</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedLawyer.languages.map((lang) => (
                            <span key={lang} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="font-semibold mb-3">Contact & Book</h3>
                        <div className="space-y-3">
                          <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            <Calendar className="w-4 h-4" />
                            <span>Book Consultation</span>
                          </button>
                          <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
                            <Video className="w-4 h-4" />
                            <span>Video Call</span>
                          </button>
                          <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                            <MessageSquare className="w-4 h-4" />
                            <span>Send Message</span>
                          </button>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="font-semibold mb-3">Pricing</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Consultation</span>
                            <span className="font-medium">₹{selectedLawyer.pricing.consultation.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Hourly Rate</span>
                            <span className="font-medium">₹{selectedLawyer.pricing.hourlyRate.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Document Review</span>
                            <span className="font-medium">₹{selectedLawyer.pricing.documentReview.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="font-semibold mb-3">Statistics</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Cases</span>
                            <span className="font-medium">{selectedLawyer.stats.totalCases}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Success Rate</span>
                            <span className="font-medium text-green-600">{selectedLawyer.successRate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Response Time</span>
                            <span className="font-medium">{selectedLawyer.responseTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Bar Council</span>
                            <span className="font-medium">{selectedLawyer.barCouncilNumber}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
