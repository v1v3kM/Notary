'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RoleBasedDashboard from './RoleBasedDashboard';
import DocumentUpload from './DocumentUpload';
import AppointmentScheduler from './AppointmentScheduler';
import PaymentProcessing from './PaymentProcessing';
import VideoConsultation from './VideoConsultation';
import {
  FileText,
  Calendar,
  CreditCard,
  Video,
  Home,
  Settings,
  User,
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number | string }>;
  component?: React.ComponentType;
  description: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    component: RoleBasedDashboard,
    description: 'Overview and quick actions'
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: FileText,
    description: 'Upload and manage documents'
  },
  {
    id: 'appointments',
    label: 'Appointments',
    icon: Calendar,
    component: AppointmentScheduler,
    description: 'Schedule consultations'
  },
  {
    id: 'payments',
    label: 'Payments',
    icon: CreditCard,
    component: PaymentProcessing,
    description: 'Payment and billing'
  },
  {
    id: 'consultation',
    label: 'Video Call',
    icon: Video,
    component: VideoConsultation,
    description: 'Live video consultation'
  }
];

export default function NotaryPlatform() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifications] = useState(3);

  const ActiveComponent = navigationItems.find(item => item.id === activeSection)?.component || RoleBasedDashboard;

  const handleFilesUploaded = (files: File[]) => {
    console.log('Files uploaded:', files);
    // Handle file upload logic
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-white shadow-lg border-r border-gray-200 flex flex-col"
          >
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">NotaryPro</h1>
                    <p className="text-sm text-gray-500">Digital Platform</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="lg:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === item.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className={`w-5 h-5 ${
                      activeSection === item.id ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                    {item.id === 'consultation' && notifications > 0 && (
                      <div className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                        {notifications}
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">John Doe</div>
                  <div className="text-sm text-gray-500">Client Account</div>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!isSidebarOpen && (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}
              
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {navigationItems.find(item => item.id === activeSection)?.label}
                </h2>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                    {notifications}
                  </div>
                )}
              </button>

              {/* Profile */}
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">John Doe</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {activeSection === 'documents' ? (
                <div className="p-6">
                  <DocumentUpload
                    onFilesUploaded={handleFilesUploaded}
                    showCategories={true}
                    showPreview={true}
                    allowTagging={true}
                  />
                </div>
              ) : (
                <ActiveComponent />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
