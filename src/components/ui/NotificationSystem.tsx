'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  X,
  Check,
  AlertTriangle,
  Info,
  Clock,
  FileText,
  Calendar,
  Settings,
  Filter,
  MoreVertical,
  Star,
  Trash2,
  Search,
  BellRing,
  Eye,
  EyeOff
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  category: 'document' | 'appointment' | 'system' | 'payment' | 'security';
  timestamp: Date;
  read: boolean;
  important: boolean;
  actionUrl?: string;
  actionText?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Document Notarized Successfully',
    message: 'Your Property Sale Agreement has been notarized and is ready for download.',
    type: 'success',
    category: 'document',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
    read: false,
    important: true,
    actionUrl: '/documents/123',
    actionText: 'Download Document'
  },
  {
    id: '2',
    title: 'Upcoming Appointment Reminder',
    message: 'You have a notarization appointment scheduled for tomorrow at 2:00 PM.',
    type: 'info',
    category: 'appointment',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    important: false,
    actionUrl: '/appointments/456',
    actionText: 'View Details'
  },
  {
    id: '3',
    title: 'Payment Method Expiring',
    message: 'Your credit card ending in 4532 will expire next month. Please update your payment method.',
    type: 'warning',
    category: 'payment',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    read: true,
    important: true,
    actionUrl: '/settings/payment',
    actionText: 'Update Payment'
  },
  {
    id: '4',
    title: 'Security Alert',
    message: 'New login detected from Chrome on Windows. If this wasn\'t you, please secure your account.',
    type: 'warning',
    category: 'security',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    read: true,
    important: true,
    actionUrl: '/settings/security',
    actionText: 'Review Activity'
  },
  {
    id: '5',
    title: 'System Maintenance Notice',
    message: 'Scheduled maintenance will occur on Sunday, 2:00 AM - 4:00 AM EST. Services may be temporarily unavailable.',
    type: 'info',
    category: 'system',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
    important: false,
    actionUrl: '/status',
    actionText: 'View Status'
  },
  {
    id: '6',
    title: 'Document Review Required',
    message: 'Your Partnership Deed requires additional verification. Please provide missing information.',
    type: 'warning',
    category: 'document',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    read: false,
    important: true,
    actionUrl: '/documents/789',
    actionText: 'Complete Review'
  },
  {
    id: '7',
    title: 'Monthly Usage Summary',
    message: 'You\'ve used 8 out of 15 documents this month. Upgrade to Professional for unlimited access.',
    type: 'info',
    category: 'system',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    read: true,
    important: false,
    actionUrl: '/pricing',
    actionText: 'Upgrade Plan'
  }
];

const categoryIcons = {
  document: FileText,
  appointment: Calendar,
  system: Settings,
  payment: Info,
  security: AlertTriangle
};

const typeStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  warning: 'bg-orange-50 border-orange-200 text-orange-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  error: 'bg-red-50 border-red-200 text-red-800'
};

const typeIcons = {
  success: Check,
  warning: AlertTriangle,
  info: Info,
  error: X
};

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMins < 1) return 'Just now';
  if (diffInMins < 60) return `${diffInMins}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString();
}

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const categories = ['all', 'document', 'appointment', 'system', 'payment', 'security'];
  
  const filteredNotifications = notifications.filter(notification => {
    const matchesCategory = selectedCategory === 'all' || notification.category === selectedCategory;
    const matchesReadStatus = !showUnreadOnly || !notification.read;
    const matchesSearch = !searchQuery || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesReadStatus && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    setShowDropdown(null);
  };

  const toggleImportant = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, important: !notification.important } 
          : notification
      )
    );
    setShowDropdown(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600">
                  {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All notifications read'}
                </p>
              </div>
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Mark All Read</span>
              </button>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Filters and Search */}
        <motion.div
          className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Options */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Category Filters */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Filter by:</span>
              {categories.map((category) => {
                const Icon = category === 'all' ? Filter : categoryIcons[category as keyof typeof categoryIcons];
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span className="capitalize">{category}</span>
                  </button>
                );
              })}
            </div>

            {/* Show Unread Toggle */}
            <button
              onClick={() => setShowUnreadOnly(!showUnreadOnly)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                showUnreadOnly
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {showUnreadOnly ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>{showUnreadOnly ? 'Unread Only' : 'Show All'}</span>
            </button>
          </div>
        </motion.div>

        {/* Notifications List */}
        <AnimatePresence>
          {filteredNotifications.length === 0 ? (
            <motion.div
              className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-12 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <BellRing className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-600">
                {searchQuery 
                  ? 'Try adjusting your search or filters' 
                  : 'You\'re all caught up! No new notifications at this time.'}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification, index) => {
                const CategoryIcon = categoryIcons[notification.category];
                const TypeIcon = typeIcons[notification.type];
                
                return (
                  <motion.div
                    key={notification.id}
                    className={`bg-white/70 backdrop-blur-sm border rounded-xl p-6 hover:shadow-lg transition-all duration-300 relative ${
                      !notification.read ? 'border-blue-200 bg-blue-50/50' : 'border-white/20'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {/* Unread Indicator */}
                    {!notification.read && (
                      <div className="absolute left-2 top-6 w-3 h-3 bg-blue-600 rounded-full"></div>
                    )}

                    <div className="flex items-start space-x-4">
                      {/* Category Icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        notification.type === 'success' ? 'bg-green-100' :
                        notification.type === 'warning' ? 'bg-orange-100' :
                        notification.type === 'error' ? 'bg-red-100' :
                        'bg-blue-100'
                      }`}>
                        <CategoryIcon className={`w-6 h-6 ${
                          notification.type === 'success' ? 'text-green-600' :
                          notification.type === 'warning' ? 'text-orange-600' :
                          notification.type === 'error' ? 'text-red-600' :
                          'text-blue-600'
                        }`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h3 className={`font-semibold text-gray-900 ${!notification.read ? 'font-bold' : ''}`}>
                              {notification.title}
                            </h3>
                            {notification.important && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {/* Type Badge */}
                            <div className={`px-2 py-1 rounded-full border text-xs font-medium ${typeStyles[notification.type]}`}>
                              <TypeIcon className="w-3 h-3 inline mr-1" />
                              {notification.type}
                            </div>
                            
                            {/* Actions Dropdown */}
                            <div className="relative">
                              <button
                                onClick={() => setShowDropdown(showDropdown === notification.id ? null : notification.id)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <MoreVertical className="w-4 h-4 text-gray-400" />
                              </button>
                              
                              {showDropdown === notification.id && (
                                <motion.div
                                  className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                >
                                  <div className="py-2">
                                    {!notification.read && (
                                      <button
                                        onClick={() => markAsRead(notification.id)}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                      >
                                        <Check className="w-4 h-4" />
                                        <span>Mark as Read</span>
                                      </button>
                                    )}
                                    <button
                                      onClick={() => toggleImportant(notification.id)}
                                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                    >
                                      <Star className={`w-4 h-4 ${notification.important ? 'text-yellow-500 fill-current' : ''}`} />
                                      <span>{notification.important ? 'Remove from Important' : 'Mark as Important'}</span>
                                    </button>
                                    <button
                                      onClick={() => deleteNotification(notification.id)}
                                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      <span>Delete</span>
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{notification.message}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{formatRelativeTime(notification.timestamp)}</span>
                          </div>
                          
                          {notification.actionUrl && (
                            <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                              {notification.actionText}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
