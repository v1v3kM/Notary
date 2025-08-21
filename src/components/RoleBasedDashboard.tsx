'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ClientDashboard from './ClientDashboard';
import LawyerDashboard from './LawyerDashboard';
import { 
  User, 
  Scale, 
  Crown, 
  LogOut, 
  Settings,
  Shield,
  Users,
  FileText
} from 'lucide-react';

type UserRole = 'client' | 'lawyer' | 'admin';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  subscription?: string;
  isVerified?: boolean;
}

const mockUserProfiles: Record<UserRole, UserProfile> = {
  client: {
    id: 'client_001',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@email.com',
    role: 'client',
    subscription: 'Premium'
  },
  lawyer: {
    id: 'lawyer_001',
    name: 'Advocate Priya Sharma',
    email: 'priya.sharma@lawfirm.com',
    role: 'lawyer',
    isVerified: true
  },
  admin: {
    id: 'admin_001',
    name: 'Admin User',
    email: 'admin@notaryplatform.com',
    role: 'admin'
  }
};

export default function RoleBasedDashboard() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(mockUserProfiles.client);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const switchRole = (role: UserRole) => {
    setCurrentUser(mockUserProfiles[role]);
    setShowRoleSwitcher(false);
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'client': return User;
      case 'lawyer': return Scale;
      case 'admin': return Crown;
      default: return User;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'client': return 'bg-blue-500';
      case 'lawyer': return 'bg-purple-500';
      case 'admin': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'client': return 'bg-blue-100 text-blue-700';
      case 'lawyer': return 'bg-purple-100 text-purple-700';
      case 'admin': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Role Switcher Header (Demo purposes) */}
      <div className="bg-white/90 backdrop-blur-md border-b border-white/20 sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${getRoleColor(currentUser.role)} rounded-full flex items-center justify-center text-white`}>
                  {React.createElement(getRoleIcon(currentUser.role), { className: 'w-5 h-5' })}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="font-semibold text-gray-900">{currentUser.name}</h2>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(currentUser.role)}`}>
                      {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                    </span>
                    {currentUser.isVerified && (
                      <Shield className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{currentUser.email}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Demo Role Switcher */}
              <div className="relative">
                <button
                  onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                  className="bg-white/70 border border-white/20 px-4 py-2 rounded-lg hover:bg-white/90 transition-colors text-sm font-medium flex items-center space-x-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Switch Role (Demo)</span>
                </button>

                {showRoleSwitcher && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 p-3 z-50"
                  >
                    <div className="space-y-2">
                      {Object.entries(mockUserProfiles).map(([role, profile]) => (
                        <button
                          key={role}
                          onClick={() => switchRole(role as UserRole)}
                          className={`w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                            currentUser.role === role ? 'bg-blue-50 border border-blue-200' : ''
                          }`}
                        >
                          <div className={`w-8 h-8 ${getRoleColor(role as UserRole)} rounded-full flex items-center justify-center text-white`}>
                            {React.createElement(getRoleIcon(role as UserRole), { className: 'w-4 h-4' })}
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-gray-900">{profile.name}</p>
                            <p className="text-xs text-gray-600">{profile.role}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="relative">
        {currentUser.role === 'client' && <ClientDashboard />}
        {currentUser.role === 'lawyer' && <LawyerDashboard />}
        {currentUser.role === 'admin' && <AdminDashboard />}
      </div>
    </div>
  );
}

// Admin Dashboard Component
function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Navigation Tabs */}
      <div className="mb-8">
        <nav className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-2">
          <div className="flex space-x-2">
            {[
              { id: 'overview', name: 'Overview', icon: FileText },
              { id: 'users', name: 'Users', icon: Users },
              { id: 'lawyers', name: 'Lawyers', icon: Scale },
              { id: 'documents', name: 'Documents', icon: FileText },
              { id: 'settings', name: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-red-600 text-white shadow-md'
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

      {/* Admin Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Platform management and analytics</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Total Users',
                value: '2,547',
                change: '+12%',
                icon: Users,
                color: 'blue'
              },
              {
                title: 'Active Lawyers',
                value: '147',
                change: '+5%',
                icon: Scale,
                color: 'purple'
              },
              {
                title: 'Documents Processed',
                value: '8,432',
                change: '+23%',
                icon: FileText,
                color: 'green'
              },
              {
                title: 'Platform Revenue',
                value: '₹12.4L',
                change: '+18%',
                icon: Crown,
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

          {/* Recent Activity */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Platform Activity</h3>
            <div className="space-y-4">
              {[
                {
                  action: 'New lawyer registration',
                  details: 'Advocate Arjun Singh from Bangalore',
                  time: '30 minutes ago',
                  type: 'lawyer'
                },
                {
                  action: 'Document completed',
                  details: 'Property Sale Agreement processed',
                  time: '2 hours ago',
                  type: 'document'
                },
                {
                  action: 'New user signup',
                  details: 'Priya Patel from Mumbai',
                  time: '4 hours ago',
                  type: 'user'
                },
                {
                  action: 'Payment processed',
                  details: '₹5,000 consultation fee',
                  time: '6 hours ago',
                  type: 'payment'
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activity.type === 'lawyer' ? 'bg-purple-100' :
                    activity.type === 'document' ? 'bg-green-100' :
                    activity.type === 'user' ? 'bg-blue-100' :
                    'bg-orange-100'
                  }`}>
                    {activity.type === 'lawyer' && <Scale className="w-4 h-4 text-purple-600" />}
                    {activity.type === 'document' && <FileText className="w-4 h-4 text-green-600" />}
                    {activity.type === 'user' && <User className="w-4 h-4 text-blue-600" />}
                    {activity.type === 'payment' && <Crown className="w-4 h-4 text-orange-600" />}
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

      {/* Other admin tabs can be implemented similarly */}
      {activeTab !== 'overview' && (
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center">
          <Crown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
          </h3>
          <p className="text-gray-600 mb-6">
            This section is under development. Admin features for {activeTab} management will be available soon.
          </p>
          <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors">
            Configure {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </button>
        </div>
      )}
    </div>
  );
}
