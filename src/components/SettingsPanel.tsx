'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  User,
  Shield,
  Bell,
  CreditCard,
  Palette,
  Lock,
  Save,
  Trash2,
  Download,
  Upload,
  Mail,
  Camera,
  Edit,
  Check,
  AlertCircle,
  Moon,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'client' | 'lawyer' | 'notary' | 'admin';
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  preferences: {
    language: string;
    timezone: string;
    currency: string;
    dateFormat: string;
  };
  verified: boolean;
  joinDate: Date;
}

interface NotificationSettings {
  email: {
    documentUpdates: boolean;
    consultationReminders: boolean;
    paymentNotifications: boolean;
    securityAlerts: boolean;
    marketingEmails: boolean;
  };
  push: {
    documentUpdates: boolean;
    consultationReminders: boolean;
    paymentNotifications: boolean;
    securityAlerts: boolean;
  };
  sms: {
    consultationReminders: boolean;
    securityAlerts: boolean;
    paymentNotifications: boolean;
  };
  sound: boolean;
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  loginAlerts: boolean;
  sessionTimeout: number;
  passwordLastChanged: Date;
  trustedDevices: Array<{
    id: string;
    name: string;
    type: string;
    lastUsed: Date;
    current: boolean;
  }>;
  loginHistory: Array<{
    id: string;
    device: string;
    location: string;
    timestamp: Date;
    success: boolean;
  }>;
}

const mockProfile: UserProfile = {
  id: '1',
  name: 'Arjun Malhotra',
  email: 'arjun.malhotra@email.com',
  phone: '+91 98765 43210',
  role: 'client',
  address: {
    street: '123 MG Road',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    pincode: '110001'
  },
  preferences: {
    language: 'English',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    dateFormat: 'DD/MM/YYYY'
  },
  verified: true,
  joinDate: new Date('2023-01-15')
};

const mockNotificationSettings: NotificationSettings = {
  email: {
    documentUpdates: true,
    consultationReminders: true,
    paymentNotifications: true,
    securityAlerts: true,
    marketingEmails: false
  },
  push: {
    documentUpdates: true,
    consultationReminders: true,
    paymentNotifications: true,
    securityAlerts: true
  },
  sms: {
    consultationReminders: true,
    securityAlerts: true,
    paymentNotifications: false
  },
  sound: true,
  quietHours: {
    enabled: true,
    startTime: '22:00',
    endTime: '08:00'
  }
};

const mockSecuritySettings: SecuritySettings = {
  twoFactorAuth: true,
  loginAlerts: true,
  sessionTimeout: 30,
  passwordLastChanged: new Date('2023-12-01'),
  trustedDevices: [
    {
      id: '1',
      name: 'MacBook Pro',
      type: 'Desktop',
      lastUsed: new Date(),
      current: true
    },
    {
      id: '2',
      name: 'iPhone 15',
      type: 'Mobile',
      lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000),
      current: false
    }
  ],
  loginHistory: [
    {
      id: '1',
      device: 'Chrome on macOS',
      location: 'New Delhi, India',
      timestamp: new Date(),
      success: true
    },
    {
      id: '2',
      device: 'Safari on iOS',
      location: 'New Delhi, India',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      success: true
    }
  ]
};

export default function SettingsPanel() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [notifications, setNotifications] = useState<NotificationSettings>(mockNotificationSettings);
  const [security, setSecurity] = useState<SecuritySettings>(mockSecuritySettings);
  const [isEditing, setIsEditing] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'advanced', label: 'Advanced', icon: Settings }
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'हिंदी (Hindi)' },
    { value: 'bn', label: 'বাংলা (Bengali)' },
    { value: 'te', label: 'తెలుగు (Telugu)' },
    { value: 'mr', label: 'मराठी (Marathi)' },
    { value: 'ta', label: 'தமிழ் (Tamil)' },
    { value: 'gu', label: 'ગુજરાતી (Gujarati)' }
  ];

  const timezoneOptions = [
    { value: 'Asia/Kolkata', label: 'IST (UTC+05:30)' },
    { value: 'Asia/Dubai', label: 'GST (UTC+04:00)' },
    { value: 'Europe/London', label: 'GMT (UTC+00:00)' },
    { value: 'America/New_York', label: 'EST (UTC-05:00)' }
  ];

  const saveChanges = () => {
    // Save logic here
    setUnsavedChanges(false);
    setIsEditing(false);
    // Show success message
  };

  const ProfileTab = () => (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-6">Profile Picture</h3>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {profile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{profile.name}</h4>
            <p className="text-sm text-gray-600 mb-3">{profile.email}</p>
            <div className="flex space-x-2">
              <button className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                <Upload className="w-4 h-4 inline mr-2" />
                Upload New
              </button>
              <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <Edit className="w-4 h-4" />
            <span>{isEditing ? 'Cancel' : 'Edit'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => {
                setProfile({ ...profile, name: e.target.value });
                setUnsavedChanges(true);
              }}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => {
                setProfile({ ...profile, email: e.target.value });
                setUnsavedChanges(true);
              }}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => {
                setProfile({ ...profile, phone: e.target.value });
                setUnsavedChanges(true);
              }}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <input
              type="text"
              value={profile.role}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 capitalize"
            />
          </div>
        </div>

        {/* Address */}
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-4">Address</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
              <input
                type="text"
                value={profile.address.street}
                onChange={(e) => {
                  setProfile({
                    ...profile,
                    address: { ...profile.address, street: e.target.value }
                  });
                  setUnsavedChanges(true);
                }}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={profile.address.city}
                onChange={(e) => {
                  setProfile({
                    ...profile,
                    address: { ...profile.address, city: e.target.value }
                  });
                  setUnsavedChanges(true);
                }}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <input
                type="text"
                value={profile.address.state}
                onChange={(e) => {
                  setProfile({
                    ...profile,
                    address: { ...profile.address, state: e.target.value }
                  });
                  setUnsavedChanges(true);
                }}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code</label>
              <input
                type="text"
                value={profile.address.pincode}
                onChange={(e) => {
                  setProfile({
                    ...profile,
                    address: { ...profile.address, pincode: e.target.value }
                  });
                  setUnsavedChanges(true);
                }}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <input
                type="text"
                value={profile.address.country}
                onChange={(e) => {
                  setProfile({
                    ...profile,
                    address: { ...profile.address, country: e.target.value }
                  });
                  setUnsavedChanges(true);
                }}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-4">Preferences</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={profile.preferences.language}
                onChange={(e) => {
                  setProfile({
                    ...profile,
                    preferences: { ...profile.preferences, language: e.target.value }
                  });
                  setUnsavedChanges(true);
                }}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              >
                {languageOptions.map(option => (
                  <option key={option.value} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                value={profile.preferences.timezone}
                onChange={(e) => {
                  setProfile({
                    ...profile,
                    preferences: { ...profile.preferences, timezone: e.target.value }
                  });
                  setUnsavedChanges(true);
                }}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              >
                {timezoneOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {unsavedChanges && (
          <div className="mt-6 flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span className="text-sm text-yellow-800">You have unsaved changes</span>
            </div>
            <button
              onClick={saveChanges}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const NotificationsTab = () => (
    <div className="space-y-6">
      {/* Email Notifications */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Mail className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Email Notifications</h3>
        </div>
        <div className="space-y-4">
          {Object.entries(notifications.email).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-sm text-gray-600">
                  Receive notifications about {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => {
                    setNotifications({
                      ...notifications,
                      email: { ...notifications.email, [key]: e.target.checked }
                    });
                    setUnsavedChanges(true);
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Smartphone className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold">Push Notifications</h3>
        </div>
        <div className="space-y-4">
          {Object.entries(notifications.push).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-sm text-gray-600">
                  Show push notifications for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => {
                    setNotifications({
                      ...notifications,
                      push: { ...notifications.push, [key]: e.target.checked }
                    });
                    setUnsavedChanges(true);
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Quiet Hours */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Moon className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold">Quiet Hours</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Enable Quiet Hours</p>
              <p className="text-sm text-gray-600">Disable notifications during specified hours</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.quietHours.enabled}
                onChange={(e) => {
                  setNotifications({
                    ...notifications,
                    quietHours: { ...notifications.quietHours, enabled: e.target.checked }
                  });
                  setUnsavedChanges(true);
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
          
          {notifications.quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4 ml-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                <input
                  type="time"
                  value={notifications.quietHours.startTime}
                  onChange={(e) => {
                    setNotifications({
                      ...notifications,
                      quietHours: { ...notifications.quietHours, startTime: e.target.value }
                    });
                    setUnsavedChanges(true);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                <input
                  type="time"
                  value={notifications.quietHours.endTime}
                  onChange={(e) => {
                    setNotifications({
                      ...notifications,
                      quietHours: { ...notifications.quietHours, endTime: e.target.value }
                    });
                    setUnsavedChanges(true);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const SecurityTab = () => (
    <div className="space-y-6">
      {/* Password & Authentication */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-6">Password & Authentication</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <div className="flex items-center space-x-3">
              {security.twoFactorAuth && (
                <span className="text-sm text-green-600 flex items-center">
                  <Check className="w-4 h-4 mr-1" />
                  Enabled
                </span>
              )}
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {security.twoFactorAuth ? 'Manage' : 'Enable'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Change Password</p>
              <p className="text-sm text-gray-600">
                Last changed: {security.passwordLastChanged.toLocaleDateString()}
              </p>
            </div>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Change Password
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Login Alerts</p>
              <p className="text-sm text-gray-600">Get notified of new login attempts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={security.loginAlerts}
                onChange={(e) => {
                  setSecurity({ ...security, loginAlerts: e.target.checked });
                  setUnsavedChanges(true);
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Trusted Devices */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-6">Trusted Devices</h3>
        <div className="space-y-4">
          {security.trustedDevices.map((device) => {
            const DeviceIcon = device.type === 'Desktop' ? Monitor : 
                              device.type === 'Mobile' ? Smartphone : Tablet;
            return (
              <div key={device.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <DeviceIcon className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">{device.name}</p>
                    <p className="text-sm text-gray-600">
                      Last used: {device.lastUsed.toLocaleString()}
                      {device.current && ' (Current session)'}
                    </p>
                  </div>
                </div>
                {!device.current && (
                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Login History */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Recent Login Activity</h3>
          <button className="text-blue-600 hover:text-blue-800 text-sm">View All</button>
        </div>
        <div className="space-y-3">
          {security.loginHistory.slice(0, 5).map((login) => (
            <div key={login.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${login.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{login.device}</p>
                  <p className="text-xs text-gray-600">{login.location}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">{login.timestamp.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
              <p className="text-gray-600">Manage your account preferences and security settings</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </button>
              {unsavedChanges && (
                <button
                  onClick={saveChanges}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sticky top-6">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'profile' && <ProfileTab />}
                {activeTab === 'notifications' && <NotificationsTab />}
                {activeTab === 'security' && <SecurityTab />}
                {(activeTab === 'billing' || activeTab === 'appearance' || 
                  activeTab === 'privacy' || activeTab === 'advanced') && (
                  <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-12 text-center">
                    <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings
                    </h3>
                    <p className="text-gray-600">{activeTab} configuration options coming soon.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
