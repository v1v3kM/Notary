'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { formatDateTime, formatDate, formatTime } from '@/utils/dateUtils';
import {
  FileText,
  Search,
  Calendar,
  MessageSquare,
  Star,
  CheckCircle,
  Download,
  Upload,
  Video,
  Phone,
  User,
  Bell,
  Settings,
  Plus,
  Eye,
  MapPin,
  Filter,
  CreditCard,
  Shield,
  BookOpen,
  Award,
  TrendingUp,
  Home
} from 'lucide-react';

interface Document {
  id: string;
  title: string;
  type: string;
  status: 'draft' | 'in-review' | 'approved' | 'signed' | 'completed' | 'rejected';
  lawyer: string;
  dateCreated: Date;
  lastUpdated: Date;
  deadline?: Date;
  progress: number;
  urgency: 'low' | 'medium' | 'high';
}

interface Consultation {
  id: string;
  lawyer: string;
  lawyerImage: string;
  documentType: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  dateTime: Date;
  duration: string;
  mode: 'video' | 'phone' | 'in-person';
  rating?: number;
  notes?: string;
}

interface Transaction {
  id: string;
  type: 'consultation' | 'document' | 'subscription';
  description: string;
  amount: number;
  date: Date;
  status: 'paid' | 'pending' | 'failed';
  lawyer?: string;
}

interface LawyerCard {
  id: string;
  name: string;
  specialization: string[];
  rating: number;
  experience: number;
  location: string;
  priceRange: string;
  availability: 'available' | 'busy' | 'offline';
  profileImage: string;
}

const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Property Sale Agreement - Mumbai Apartment',
    type: 'Property Sale',
    status: 'in-review',
    lawyer: 'Advocate Priya Sharma',
    dateCreated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    progress: 75,
    urgency: 'high'
  },
  {
    id: '2',
    title: 'Employment Contract Review',
    type: 'Employment',
    status: 'completed',
    lawyer: 'Advocate Rajesh Kumar',
    dateCreated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    progress: 100,
    urgency: 'low'
  },
  {
    id: '3',
    title: 'Partnership Deed Amendment',
    type: 'Partnership',
    status: 'draft',
    lawyer: 'Advocate Meera Patel',
    dateCreated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    progress: 25,
    urgency: 'medium'
  }
];

const mockConsultations: Consultation[] = [
  {
    id: '1',
    lawyer: 'Advocate Priya Sharma',
    lawyerImage: '/api/placeholder/lawyer1.jpg',
    documentType: 'Property Sale Agreement',
    status: 'upcoming',
    dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    duration: '45 mins',
    mode: 'video'
  },
  {
    id: '2',
    lawyer: 'Advocate Rajesh Kumar',
    lawyerImage: '/api/placeholder/lawyer2.jpg',
    documentType: 'Employment Contract',
    status: 'completed',
    dateTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    duration: '30 mins',
    mode: 'video',
    rating: 5,
    notes: 'Very helpful session, all queries resolved'
  }
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'consultation',
    description: 'Video consultation with Advocate Priya Sharma',
    amount: 2500,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: 'paid',
    lawyer: 'Advocate Priya Sharma'
  },
  {
    id: '2',
    type: 'document',
    description: 'Property Sale Agreement drafting',
    amount: 5000,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: 'paid',
    lawyer: 'Advocate Priya Sharma'
  },
  {
    id: '3',
    type: 'subscription',
    description: 'Premium plan monthly subscription',
    amount: 1999,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: 'paid'
  }
];

const mockFeaturedLawyers: LawyerCard[] = [
  {
    id: '1',
    name: 'Advocate Priya Sharma',
    specialization: ['Property Law', 'Civil Law'],
    rating: 4.9,
    experience: 8,
    location: 'New Delhi',
    priceRange: '₹2,000 - ₹5,000',
    availability: 'available',
    profileImage: '/api/placeholder/lawyer1.jpg'
  },
  {
    id: '2',
    name: 'Advocate Rajesh Kumar',
    specialization: ['Business Law', 'Corporate Law'],
    rating: 4.8,
    experience: 12,
    location: 'Mumbai',
    priceRange: '₹3,000 - ₹8,000',
    availability: 'busy',
    profileImage: '/api/placeholder/lawyer2.jpg'
  }
];

export default function ClientDashboard() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [documents] = useState<Document[]>(mockDocuments);
  const [consultations] = useState<Consultation[]>(mockConsultations);
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [featuredLawyers] = useState<LawyerCard[]>(mockFeaturedLawyers);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in-review': return 'bg-blue-100 text-blue-700';
      case 'approved': return 'bg-purple-100 text-purple-700';
      case 'signed': return 'bg-indigo-100 text-indigo-700';
      case 'draft': return 'bg-gray-100 text-gray-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'upcoming': return 'bg-yellow-100 text-yellow-700';
      case 'ongoing': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'paid': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-700 border-green-200';
      case 'busy': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'offline': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {getGreeting()}, {profile?.name || 'Client'}
              </h1>
              <p className="text-gray-600">Track your legal documents and consultations</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  2
                </span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-2">
            <div className="flex space-x-2">
              {[
                { id: 'overview', name: 'Overview', icon: TrendingUp },
                { id: 'documents', name: 'My Documents', icon: FileText },
                { id: 'consultations', name: 'Consultations', icon: Video },
                { id: 'lawyers', name: 'Find Lawyers', icon: Search },
                { id: 'payments', name: 'Payments', icon: CreditCard },
                { id: 'profile', name: 'Profile', icon: User }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Active Documents',
                  value: documents.filter(d => d.status !== 'completed').length,
                  total: documents.length,
                  icon: FileText,
                  color: 'blue'
                },
                {
                  title: 'Upcoming Consultations',
                  value: consultations.filter(c => c.status === 'upcoming').length,
                  total: consultations.length,
                  icon: Calendar,
                  color: 'green'
                },
                {
                  title: 'Completed Cases',
                  value: documents.filter(d => d.status === 'completed').length,
                  total: documents.length,
                  icon: CheckCircle,
                  color: 'purple'
                },
                {
                  title: 'Total Spent',
                  value: `₹${(transactions.filter(t => t.status === 'paid').reduce((sum, t) => sum + t.amount, 0) / 1000).toFixed(0)}K`,
                  total: transactions.length,
                  icon: CreditCard,
                  color: 'orange'
                }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-500">of {stat.total} total</p>
                    </div>
                    <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Upload Document', icon: Upload, color: 'blue' },
                  { name: 'Book Consultation', icon: Calendar, color: 'green' },
                  { name: 'Find Lawyer', icon: Search, color: 'purple' },
                  { name: 'Track Progress', icon: Eye, color: 'orange' }
                ].map((action, index) => (
                  <button
                    key={index}
                    className={`bg-${action.color}-50 hover:bg-${action.color}-100 text-${action.color}-700 p-4 rounded-xl text-center transition-colors group`}
                  >
                    <action.icon className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">{action.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Documents */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Recent Documents</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {documents.slice(0, 3).map((document) => (
                  <div key={document.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{document.title}</p>
                        <p className="text-sm text-gray-600">by {document.lawyer}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(document.status)}`}>
                        {document.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{document.progress}% complete</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Consultations */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Upcoming Consultations</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Schedule New
                </button>
              </div>
              {consultations.filter(c => c.status === 'upcoming').length > 0 ? (
                <div className="space-y-3">
                  {consultations.filter(c => c.status === 'upcoming').map((consultation) => (
                    <div key={consultation.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {consultation.lawyer.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{consultation.lawyer}</p>
                          <p className="text-sm text-gray-600">{consultation.documentType}</p>
                          <p className="text-xs text-gray-500">{formatDateTime(consultation.dateTime)} • {consultation.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {consultation.mode === 'video' && <Video className="w-4 h-4 text-blue-600" />}
                        {consultation.mode === 'phone' && <Phone className="w-4 h-4 text-green-600" />}
                        {consultation.mode === 'in-person' && <User className="w-4 h-4 text-purple-600" />}
                        <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                          Join
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No upcoming consultations</p>
                  <button className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Schedule a consultation
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">My Documents</h2>
              <div className="flex items-center space-x-3">
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>New Document</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {documents.map((document) => (
                <motion.div
                  key={document.id}
                  className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{document.title}</h3>
                      <p className="text-sm text-gray-600">by {document.lawyer}</p>
                      <p className="text-xs text-gray-500">Created: {formatDateTime(document.dateCreated)}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(document.status)}`}>
                      {document.status}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium text-gray-900">{document.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${document.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-sm font-medium ${getUrgencyColor(document.urgency)}`}>
                      {document.urgency} priority
                    </span>
                    {document.deadline && (
                      <span className="text-xs text-gray-500">
                        Due: {formatDateTime(document.deadline)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      <Eye className="w-4 h-4 inline mr-1" />
                      View
                    </button>
                    <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="bg-green-100 text-green-700 py-2 px-3 rounded-lg hover:bg-green-200 transition-colors">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Consultations Tab */}
        {activeTab === 'consultations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Consultations</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Book Consultation</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {consultations.map((consultation) => (
                <div key={consultation.id} className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {consultation.lawyer.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{consultation.lawyer}</h3>
                        <p className="text-sm text-gray-600">{consultation.documentType}</p>
                        <p className="text-xs text-gray-500">{formatDateTime(consultation.dateTime)}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(consultation.status)}`}>
                      {consultation.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {consultation.mode === 'video' && <Video className="w-4 h-4 text-blue-600" />}
                      {consultation.mode === 'phone' && <Phone className="w-4 h-4 text-green-600" />}
                      {consultation.mode === 'in-person' && <User className="w-4 h-4 text-purple-600" />}
                      <span className="text-sm text-gray-600 capitalize">{consultation.mode}</span>
                    </div>
                    <span className="text-sm text-gray-600">{consultation.duration}</span>
                  </div>

                  {consultation.rating && (
                    <div className="flex items-center space-x-1 mb-4">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{consultation.rating}</span>
                      <span className="text-xs text-gray-500">rating given</span>
                    </div>
                  )}

                  {consultation.notes && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-700">{consultation.notes}</p>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    {consultation.status === 'upcoming' ? (
                      <>
                        <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                          Join Now
                        </button>
                        <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                          Reschedule
                        </button>
                      </>
                    ) : consultation.status === 'completed' && !consultation.rating ? (
                      <button className="flex-1 bg-yellow-600 text-white py-2 px-3 rounded-lg hover:bg-yellow-700 transition-colors text-sm">
                        Rate Consultation
                      </button>
                    ) : (
                      <button className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm">
                        Book Again
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Find Lawyers Tab */}
        {activeTab === 'lawyers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Find Lawyers</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                View All Lawyers
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredLawyers.map((lawyer) => (
                <motion.div
                  key={lawyer.id}
                  className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                      {lawyer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{lawyer.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{lawyer.rating}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getAvailabilityColor(lawyer.availability)}`}>
                          {lawyer.availability}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {lawyer.specialization.map((spec, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{lawyer.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Award className="w-4 h-4 mr-2" />
                      <span>{lawyer.experience} years experience</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="font-semibold text-gray-900">{lawyer.priceRange}</span>
                    <div className="flex items-center space-x-2">
                      <button className="bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors text-sm">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Call
                      </button>
                      <button className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        Book Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Search Section */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Search Lawyers by Specialty</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Property Law', icon: Home, count: 45 },
                  { name: 'Business Law', icon: BookOpen, count: 32 },
                  { name: 'Family Law', icon: User, count: 28 },
                  { name: 'Criminal Law', icon: Shield, count: 19 }
                ].map((specialty, index) => (
                  <button
                    key={index}
                    className="bg-gray-50 hover:bg-gray-100 p-4 rounded-xl text-center transition-colors group"
                  >
                    <specialty.icon className="w-8 h-8 mx-auto mb-2 text-gray-600 group-hover:text-blue-600 transition-colors" />
                    <p className="font-medium text-gray-900">{specialty.name}</p>
                    <p className="text-xs text-gray-500">{specialty.count} lawyers</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download Report</span>
              </button>
            </div>

            {/* Payment Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Total Paid',
                  amount: `₹${transactions.filter(t => t.status === 'paid').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}`,
                  color: 'green'
                },
                {
                  title: 'Pending Payments',
                  amount: `₹${transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}`,
                  color: 'yellow'
                },
                {
                  title: 'This Month',
                  amount: `₹${transactions.filter(t => 
                    t.status === 'paid' && 
                    t.date.getMonth() === new Date().getMonth()
                  ).reduce((sum, t) => sum + t.amount, 0).toLocaleString()}`,
                  color: 'blue'
                }
              ].map((summary, index) => (
                <div key={index} className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{summary.title}</h3>
                  <p className={`text-3xl font-bold text-${summary.color}-600`}>{summary.amount}</p>
                </div>
              ))}
            </div>

            {/* Transaction History */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Recent Transactions</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                            {transaction.lawyer && (
                              <div className="text-sm text-gray-500">{transaction.lawyer}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full capitalize">
                            {transaction.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ₹{transaction.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDateTime(transaction.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Information */}
              <div className="lg:col-span-2">
                <motion.div
                  className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Profile Information</h3>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      Edit Profile
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                        {profile?.name || 'Not provided'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                        {profile?.email || 'Not provided'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                        {profile?.phone || 'Not provided'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-900 capitalize">
                        {profile?.role || 'Client'}
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                        {profile?.address || 'Not provided'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Number</label>
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                        {profile?.aadhaar_number ? `****-****-${profile.aadhaar_number.slice(-4)}` : 'Not provided'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                        {profile?.pan_number ? `${profile.pan_number.slice(0, 3)}****${profile.pan_number.slice(-2)}` : 'Not provided'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Account Status & Actions */}
              <div className="space-y-6">
                <motion.div
                  className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Account Status</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Verification Status</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        profile?.is_verified 
                          ? 'bg-green-100 text-green-700 border border-green-200' 
                          : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      }`}>
                        {profile?.is_verified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Member Since</span>
                      <span className="text-gray-900">
                        {profile?.created_at ? formatDate(new Date(profile.created_at)) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>Upload Documents</span>
                    </button>
                    
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <Calendar className="w-4 h-4" />
                      <span>Schedule Consultation</span>
                    </button>
                    
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <Settings className="w-4 h-4" />
                      <span>Account Settings</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
