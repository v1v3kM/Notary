'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { formatDateTime, formatDate, formatTime } from '@/utils/dateUtils';
import {
  BarChart3,
  Calendar,
  Users,
  FileText,
  MessageSquare,
  Star,
  DollarSign,
  CheckCircle,
  Video,
  Phone,
  Home,
  Settings,
  Bell,
  Plus,
  Eye,
  Edit,
  MoreVertical,
  Filter,
  Search,
  Download,
  User,
  Upload
} from 'lucide-react';

interface LawyerStats {
  totalClients: number;
  activeConsultations: number;
  completedDocuments: number;
  pendingReviews: number;
  monthlyEarnings: number;
  successRate: number;
  responseTime: string;
  clientRating: number;
}

interface Consultation {
  id: string;
  clientName: string;
  documentType: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  dateTime: Date;
  duration: string;
  priority: 'low' | 'medium' | 'high';
  mode: 'video' | 'phone' | 'in-person';
}

interface Document {
  id: string;
  title: string;
  clientName: string;
  type: string;
  status: 'draft' | 'review' | 'approved' | 'signed' | 'completed';
  dateCreated: Date;
  deadline: Date;
  priority: 'low' | 'medium' | 'high';
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalDocuments: number;
  rating: number;
  lastConsultation: Date;
  status: 'active' | 'inactive';
}

const mockStats: LawyerStats = {
  totalClients: 247,
  activeConsultations: 12,
  completedDocuments: 189,
  pendingReviews: 8,
  monthlyEarnings: 145000,
  successRate: 97.3,
  responseTime: '< 2 hours',
  clientRating: 4.9
};

const mockConsultations: Consultation[] = [
  {
    id: '1',
    clientName: 'Rahul Sharma',
    documentType: 'Property Sale Agreement',
    status: 'scheduled',
    dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    duration: '45 mins',
    priority: 'high',
    mode: 'video'
  },
  {
    id: '2',
    clientName: 'Priya Patel',
    documentType: 'Partnership Deed',
    status: 'in-progress',
    dateTime: new Date(Date.now() - 30 * 60 * 1000),
    duration: '60 mins',
    priority: 'medium',
    mode: 'video'
  },
  {
    id: '3',
    clientName: 'Amit Kumar',
    documentType: 'Rental Agreement',
    status: 'scheduled',
    dateTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
    duration: '30 mins',
    priority: 'low',
    mode: 'phone'
  }
];

const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Property Sale Agreement - Bangalore',
    clientName: 'Suresh Reddy',
    type: 'Property Sale',
    status: 'review',
    dateCreated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    priority: 'high'
  },
  {
    id: '2',
    title: 'Employment Contract - Tech Company',
    clientName: 'Neha Singh',
    type: 'Employment',
    status: 'draft',
    dateCreated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Partnership Deed Amendment',
    clientName: 'Vikram Agarwal',
    type: 'Partnership',
    status: 'approved',
    dateCreated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    priority: 'low'
  }
];

const mockClients: Client[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh@email.com',
    phone: '+91 98765 43210',
    totalDocuments: 8,
    rating: 5.0,
    lastConsultation: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'active'
  },
  {
    id: '2',
    name: 'Anita Sharma',
    email: 'anita@email.com',
    phone: '+91 87654 32109',
    totalDocuments: 3,
    rating: 4.8,
    lastConsultation: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: 'active'
  }
];

export default function LawyerDashboard() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats] = useState<LawyerStats>(mockStats);
  const [consultations] = useState<Consultation[]>(mockConsultations);
  const [documents] = useState<Document[]>(mockDocuments);
  const [clients] = useState<Client[]>(mockClients);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'draft': return 'bg-gray-100 text-gray-700';
      case 'review': return 'bg-orange-100 text-orange-700';
      case 'approved': return 'bg-blue-100 text-blue-700';
      case 'signed': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
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
                {getGreeting()}, {profile?.role === 'lawyer' ? 'Advocate ' : ''}{profile?.name || 'Lawyer'}
              </h1>
              <p className="text-gray-600">Manage your practice and clients efficiently</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
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
                { id: 'overview', name: 'Overview', icon: BarChart3 },
                { id: 'consultations', name: 'Consultations', icon: Video },
                { id: 'documents', name: 'Documents', icon: FileText },
                { id: 'clients', name: 'Clients', icon: Users },
                { id: 'earnings', name: 'Earnings', icon: DollarSign },
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
                  title: 'Total Clients',
                  value: stats.totalClients,
                  change: '+12%',
                  icon: Users,
                  color: 'blue'
                },
                {
                  title: 'Active Consultations',
                  value: stats.activeConsultations,
                  change: '+5',
                  icon: Video,
                  color: 'green'
                },
                {
                  title: 'Documents Completed',
                  value: stats.completedDocuments,
                  change: '+23',
                  icon: FileText,
                  color: 'purple'
                },
                {
                  title: 'Monthly Earnings',
                  value: `₹${(stats.monthlyEarnings / 1000).toFixed(0)}K`,
                  change: '+18%',
                  icon: DollarSign,
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
                      <p className="text-xs text-green-600">{stat.change} from last month</p>
                    </div>
                    <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-semibold text-green-600">{stats.successRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Client Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-semibold">{stats.clientRating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Response Time</span>
                    <span className="font-semibold text-blue-600">{stats.responseTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Pending Reviews</span>
                    <span className="font-semibold text-orange-600">{stats.pendingReviews}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'New Consultation', icon: Plus, color: 'blue' },
                    { name: 'Create Document', icon: FileText, color: 'green' },
                    { name: 'View Schedule', icon: Calendar, color: 'purple' },
                    { name: 'Client Messages', icon: MessageSquare, color: 'orange' }
                  ].map((action, index) => (
                    <button
                      key={index}
                      className={`bg-${action.color}-50 hover:bg-${action.color}-100 text-${action.color}-700 p-4 rounded-xl text-center transition-colors`}
                    >
                      <action.icon className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">{action.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  {
                    action: 'Document approved',
                    details: 'Property Sale Agreement for Suresh Reddy',
                    time: '2 hours ago',
                    icon: CheckCircle,
                    color: 'green'
                  },
                  {
                    action: 'New consultation scheduled',
                    details: 'Video call with Rahul Sharma tomorrow at 2:00 PM',
                    time: '4 hours ago',
                    icon: Calendar,
                    color: 'blue'
                  },
                  {
                    action: 'Client rating received',
                    details: 'Anita Sharma rated your service 5 stars',
                    time: '1 day ago',
                    icon: Star,
                    color: 'yellow'
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                    <div className={`w-8 h-8 bg-${activity.color}-100 rounded-lg flex items-center justify-center`}>
                      <activity.icon className={`w-4 h-4 text-${activity.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.details}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
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
                <span>Schedule New</span>
              </button>
            </div>

            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Document Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mode
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {consultations.map((consultation) => (
                      <tr key={consultation.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                              {consultation.clientName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{consultation.clientName}</div>
                              <div className="text-sm text-gray-500">{consultation.duration}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {consultation.documentType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDateTime(consultation.dateTime)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {consultation.mode === 'video' && <Video className="w-4 h-4 mr-1 text-blue-600" />}
                            {consultation.mode === 'phone' && <Phone className="w-4 h-4 mr-1 text-green-600" />}
                            {consultation.mode === 'in-person' && <Home className="w-4 h-4 mr-1 text-purple-600" />}
                            <span className="text-sm text-gray-900 capitalize">{consultation.mode}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(consultation.status)}`}>
                            {consultation.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {documents.map((document) => (
                <motion.div
                  key={document.id}
                  className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{document.title}</h3>
                      <p className="text-sm text-gray-600">Client: {document.clientName}</p>
                      <p className="text-xs text-gray-500">Created: {formatDateTime(document.dateCreated)}</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(document.status)}`}>
                      {document.status}
                    </span>
                    <span className={`text-sm font-medium ${getPriorityColor(document.priority)}`}>
                      {document.priority} priority
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span>Deadline: {formatDateTime(document.deadline)}</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{document.type}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      <Edit className="w-4 h-4 inline mr-1" />
                      Edit
                    </button>
                    <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Clients Tab */}
        {activeTab === 'clients' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Clients</h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search clients..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Client</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {clients.map((client) => (
                <div key={client.id} className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{client.name}</h3>
                        <p className="text-sm text-gray-600">{client.email}</p>
                        <p className="text-sm text-gray-600">{client.phone}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{client.rating}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      client.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {client.status}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Documents: {client.totalDocuments}</span>
                      <span>Last consultation: {formatDateTime(client.lastConsultation)}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-3">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        View Details
                      </button>
                      <button className="bg-green-100 text-green-700 py-2 px-3 rounded-lg hover:bg-green-200 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button className="bg-purple-100 text-purple-700 py-2 px-3 rounded-lg hover:bg-purple-200 transition-colors">
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Earnings Tab */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Earnings</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download Report</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'This Month',
                  amount: '₹1,45,000',
                  change: '+18%',
                  color: 'green'
                },
                {
                  title: 'Last Month',
                  amount: '₹1,23,000',
                  change: '+12%',
                  color: 'blue'
                },
                {
                  title: 'Average Monthly',
                  amount: '₹1,35,000',
                  change: '+8%',
                  color: 'purple'
                }
              ].map((earning, index) => (
                <div key={index} className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{earning.title}</h3>
                  <p className="text-3xl font-bold text-gray-900">{earning.amount}</p>
                  <p className={`text-sm font-medium text-${earning.color}-600`}>{earning.change} from previous</p>
                </div>
              ))}
            </div>

            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Payment Breakdown</h3>
              <div className="space-y-4">
                {[
                  { service: 'Consultation Fees', amount: '₹85,000', percentage: '58%' },
                  { service: 'Document Preparation', amount: '₹45,000', percentage: '31%' },
                  { service: 'Legal Review', amount: '₹15,000', percentage: '11%' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{item.service}</span>
                    <div className="text-right">
                      <span className="font-semibold text-gray-900">{item.amount}</span>
                      <span className="text-sm text-gray-600 ml-2">({item.percentage})</span>
                    </div>
                  </div>
                ))}
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
                    <h3 className="text-xl font-bold text-gray-900">Professional Profile</h3>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                        {profile?.specialization || 'Not provided'}
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Office Address</label>
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                        {profile?.address || 'Not provided'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bar Council Registration</label>
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                        {profile?.aadhaar_number || 'Not provided'}
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

              {/* Professional Stats & Actions */}
              <div className="space-y-6">
                <motion.div
                  className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Professional Status</h3>
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
                      <span className="text-gray-600">Practice Since</span>
                      <span className="text-gray-900">
                        {profile?.created_at ? formatDate(new Date(profile.created_at)) : 'N/A'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Success Rate</span>
                      <span className="text-green-600 font-semibold">
                        {stats.successRate}%
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Client Rating</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-gray-900 font-semibold">{stats.clientRating}</span>
                      </div>
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
                      <Plus className="w-4 h-4" />
                      <span>New Consultation</span>
                    </button>
                    
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>Upload Certificate</span>
                    </button>
                    
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <Settings className="w-4 h-4" />
                      <span>Practice Settings</span>
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
