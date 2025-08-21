'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  FileText,
  Calendar,
  CreditCard,
  MessageSquare,
  Bell,
  Settings,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Video,
  Mail,
  MapPin,
  Shield,
  Award,
  TrendingUp,
  Download,
  Eye,
  Plus,
  Search,
  Filter,
  Edit,
  Share2,
  Archive,
  Bookmark,
  Users,
  HelpCircle,
  FileSearch,
  Zap,
  Target,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

interface ClientStats {
  totalDocuments: number;
  activeConsultations: number;
  completedCases: number;
  totalSpent: number;
  successRate: number;
  averageRating: number;
  responseTime: string;
  memberSince: Date;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; size?: number | string }>;
  color: string;
  action: () => void;
  popular?: boolean;
}

interface RecentActivity {
  id: string;
  type: 'document' | 'consultation' | 'payment' | 'message';
  title: string;
  description: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'in-progress' | 'failed';
  metadata?: any;
}

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionRequired?: boolean;
}

interface LawyerRecommendation {
  id: string;
  name: string;
  specialization: string[];
  rating: number;
  experience: number;
  availability: 'available' | 'busy' | 'offline';
  priceRange: string;
  location: string;
  profileImage?: string;
  matchScore: number;
}

const mockStats: ClientStats = {
  totalDocuments: 12,
  activeConsultations: 2,
  completedCases: 8,
  totalSpent: 45000,
  successRate: 95.5,
  averageRating: 4.8,
  responseTime: '< 4 hours',
  memberSince: new Date('2023-08-15')
};

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Document Signed Successfully',
    message: 'Your Property Sale Agreement has been digitally signed and completed.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    actionRequired: false
  },
  {
    id: '2',
    type: 'warning',
    title: 'Consultation Reminder',
    message: 'Your scheduled consultation with Advocate Priya Sharma is in 30 minutes.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
    actionRequired: true
  },
  {
    id: '3',
    type: 'info',
    title: 'New Feature Available',
    message: 'Digital signature feature is now available for all document types.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    actionRequired: false
  }
];

const mockRecentActivity: RecentActivity[] = [
  {
    id: '1',
    type: 'document',
    title: 'Property Sale Agreement Completed',
    description: 'Document has been signed by all parties and notarized.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'completed'
  },
  {
    id: '2',
    type: 'consultation',
    title: 'Video Call with Advocate Sharma',
    description: 'Discussed property documentation requirements.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    status: 'completed'
  },
  {
    id: '3',
    type: 'payment',
    title: 'Consultation Fee Payment',
    description: 'Payment of ₹2,500 processed successfully.',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    status: 'completed'
  },
  {
    id: '4',
    type: 'document',
    title: 'Employment Contract Review',
    description: 'Document submitted for legal review.',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: 'in-progress'
  }
];

const mockLawyerRecommendations: LawyerRecommendation[] = [
  {
    id: '1',
    name: 'Advocate Priya Sharma',
    specialization: ['Property Law', 'Civil Law'],
    rating: 4.9,
    experience: 8,
    availability: 'available',
    priceRange: '₹2,000 - ₹5,000',
    location: 'New Delhi',
    matchScore: 95
  },
  {
    id: '2',
    name: 'Advocate Rajesh Kumar',
    specialization: ['Business Law', 'Corporate Law'],
    rating: 4.8,
    experience: 12,
    availability: 'busy',
    priceRange: '₹3,000 - ₹8,000',
    location: 'Mumbai',
    matchScore: 88
  }
];

export default function ClientPortal() {
  const [activeSection, setActiveSection] = useState('overview');
  const [stats] = useState<ClientStats>(mockStats);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [recentActivity] = useState<RecentActivity[]>(mockRecentActivity);
  const [lawyerRecommendations] = useState<LawyerRecommendation[]>(mockLawyerRecommendations);
  const [showNotifications, setShowNotifications] = useState(false);

  const quickActions: QuickAction[] = [
    {
      id: 'upload_document',
      title: 'Upload Document',
      description: 'Upload a new legal document for review',
      icon: FileText,
      color: 'blue',
      action: () => console.log('Upload document'),
      popular: true
    },
    {
      id: 'book_consultation',
      title: 'Book Consultation',
      description: 'Schedule a meeting with a lawyer',
      icon: Calendar,
      color: 'green',
      action: () => console.log('Book consultation'),
      popular: true
    },
    {
      id: 'find_lawyer',
      title: 'Find Lawyer',
      description: 'Browse and connect with specialists',
      icon: Search,
      color: 'purple',
      action: () => console.log('Find lawyer')
    },
    {
      id: 'track_progress',
      title: 'Track Progress',
      description: 'Monitor your case status and updates',
      icon: BarChart3,
      color: 'orange',
      action: () => console.log('Track progress')
    },
    {
      id: 'payment_history',
      title: 'Payment History',
      description: 'View transaction history and receipts',
      icon: CreditCard,
      color: 'indigo',
      action: () => console.log('Payment history')
    },
    {
      id: 'messages',
      title: 'Messages',
      description: 'Chat with your legal team',
      icon: MessageSquare,
      color: 'pink',
      action: () => console.log('Messages')
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'error': return AlertCircle;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'document': return FileText;
      case 'consultation': return Video;
      case 'payment': return CreditCard;
      case 'message': return MessageSquare;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'document': return 'blue';
      case 'consultation': return 'green';
      case 'payment': return 'purple';
      case 'message': return 'orange';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-700';
      case 'busy': return 'bg-yellow-100 text-yellow-700';
      case 'offline': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Client Portal</h1>
              <p className="text-gray-600">Welcome back to your legal dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search documents, lawyers..."
                  className="pl-10 pr-4 py-2 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-400 hover:text-gray-600 relative"
                >
                  <Bell className="w-6 h-6" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                    >
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => {
                          const NotificationIcon = getNotificationIcon(notification.type);
                          return (
                            <div
                              key={notification.id}
                              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                                !notification.read ? 'bg-blue-50' : ''
                              }`}
                              onClick={() => markNotificationAsRead(notification.id)}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                                  <NotificationIcon className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{notification.title}</p>
                                  <p className="text-sm text-gray-600">{notification.message}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {notification.timestamp.toLocaleTimeString()}
                                  </p>
                                </div>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="p-4 border-t border-gray-200">
                        <button className="w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium">
                          View All Notifications
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Settings */}
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="w-6 h-6" />
              </button>

              {/* Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  RK
                </div>
                <div className="hidden md:block">
                  <p className="font-medium text-gray-900">Rajesh Kumar</p>
                  <p className="text-sm text-gray-600">Premium Member</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Total Documents',
              value: stats.totalDocuments,
              change: '+2 this month',
              icon: FileText,
              color: 'blue'
            },
            {
              title: 'Active Consultations',
              value: stats.activeConsultations,
              change: 'Next: Today 2PM',
              icon: Video,
              color: 'green'
            },
            {
              title: 'Completed Cases',
              value: stats.completedCases,
              change: `${stats.successRate}% success rate`,
              icon: CheckCircle,
              color: 'purple'
            },
            {
              title: 'Total Spent',
              value: `₹${(stats.totalSpent / 1000).toFixed(0)}K`,
              change: 'Saved ₹8K with platform',
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
                  <p className="text-xs text-green-600">{stat.change}</p>
                </div>
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Customize
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action) => (
                  <motion.button
                    key={action.id}
                    onClick={action.action}
                    className={`text-left p-4 border-2 border-gray-200 rounded-xl hover:border-${action.color}-500 hover:bg-${action.color}-50 transition-all group relative`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {action.popular && (
                      <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                        Popular
                      </div>
                    )}
                    <div className={`w-10 h-10 bg-${action.color}-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-${action.color}-200 transition-colors`}>
                      <action.icon className={`w-5 h-5 text-${action.color}-600`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const ActivityIcon = getActivityIcon(activity.type);
                  const activityColor = getActivityColor(activity.type);
                  
                  return (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg">
                      <div className={`w-10 h-10 bg-${activityColor}-100 rounded-lg flex items-center justify-center`}>
                        <ActivityIcon className={`w-5 h-5 text-${activityColor}-600`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">{activity.title}</h3>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                              {activity.status}
                            </span>
                            <span className="text-xs text-gray-500">
                              {activity.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Insights</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Case Success Rate</span>
                    <span className="font-semibold text-green-600">{stats.successRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stats.successRate}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Average Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-semibold">{stats.averageRating}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(stats.averageRating / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Response Time</span>
                    <span className="font-semibold text-blue-600">{stats.responseTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Faster than 85% of clients</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-semibold text-purple-600">
                      {stats.memberSince.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-600">Trusted member for 1+ year</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recommended Lawyers */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Recommended Lawyers</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {lawyerRecommendations.map((lawyer) => (
                  <div key={lawyer.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {lawyer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{lawyer.name}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAvailabilityColor(lawyer.availability)}`}>
                            {lawyer.availability}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{lawyer.specialization.join(', ')}</p>
                        
                        <div className="flex items-center space-x-3 mt-2">
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs font-medium">{lawyer.rating}</span>
                          </div>
                          <span className="text-xs text-gray-500">{lawyer.experience}+ years</span>
                          <div className="flex items-center space-x-1">
                            <Target className="w-3 h-3 text-green-600" />
                            <span className="text-xs text-green-600">{lawyer.matchScore}% match</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm font-medium text-gray-900">{lawyer.priceRange}</span>
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                              <Phone className="w-3 h-3" />
                            </button>
                            <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                              <MessageSquare className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Help & Support */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Help & Support</h3>
              
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg text-left">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">FAQ & Knowledge Base</span>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg text-left">
                  <MessageSquare className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Live Chat Support</span>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg text-left">
                  <Phone className="w-4 h-4 text-purple-600" />
                  <span className="text-sm">Schedule Support Call</span>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg text-left">
                  <Mail className="w-4 h-4 text-orange-600" />
                  <span className="text-sm">Email Support</span>
                </button>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">24/7 Emergency Support</span>
                </div>
                <p className="text-xs text-blue-700 mt-1">For urgent legal matters</p>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Tips for Success</h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Keep documents organized</p>
                    <p className="text-xs text-gray-600">Use folders and tags for easy access</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <Clock className="w-3 h-3 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Respond promptly</p>
                    <p className="text-xs text-gray-600">Quick responses help faster resolution</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                    <Star className="w-3 h-3 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Rate your lawyers</p>
                    <p className="text-xs text-gray-600">Help others find quality legal help</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
