'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Edit3, 
  Save, 
  X,
  Shield,
  FileText,
  Clock,
  Bell
} from 'lucide-react';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  aadhaar: string;
  pan: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profile, setProfile] = useState<UserProfile>({
    firstName: 'John',
    lastName: 'Doe',
    email: user?.email || 'john.doe@example.com',
    phone: '+91 98765 43210',
    address: '123 Main Street, Block A',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    aadhaar: '1234 5678 9012',
    pan: 'ABCDE1234F'
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile / प्रोफ़ाइल', icon: User },
    { id: 'documents', label: 'Documents / दस्तावेज़', icon: FileText },
    { id: 'notifications', label: 'Notifications / सूचनाएं', icon: Bell },
    { id: 'security', label: 'Security / सुरक्षा', icon: Shield }
  ];

  const recentDocuments = [
    { name: 'Property Sale Deed', date: '2024-01-15', status: 'Completed', type: 'Real Estate' },
    { name: 'Employment Contract', date: '2024-01-10', status: 'In Progress', type: 'Business' },
    { name: 'Income Affidavit', date: '2024-01-05', status: 'Completed', type: 'Legal' },
    { name: 'Passport Application', date: '2024-01-01', status: 'Completed', type: 'Government' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Government Identity Bar */}
      <div className="bg-gradient-to-r from-orange-500 via-white to-green-500 h-1"></div>
      
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-6"
          >
            <div className="w-20 h-20 flex items-center justify-center">
              <Image 
                src="/logo.png" 
                alt="Company Logo"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                User Profile / उपयोगकर्ता प्रोफ़ाइल
              </h1>
              <p className="text-blue-200">Manage your account and preferences</p>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{profile.firstName} {profile.lastName}</h3>
                <p className="text-gray-600">{profile.email}</p>
              </div>
              
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              {activeTab === 'profile' && (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSave}
                          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedProfile.firstName}
                          onChange={(e) => setEditedProfile({ ...editedProfile, firstName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{profile.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedProfile.lastName}
                          onChange={(e) => setEditedProfile({ ...editedProfile, lastName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{profile.lastName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <p className="text-gray-900 py-2">{profile.email}</p>
                      <p className="text-xs text-gray-500">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editedProfile.phone}
                          onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{profile.phone}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedProfile.address}
                          onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{profile.address}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedProfile.city}
                          onChange={(e) => setEditedProfile({ ...editedProfile, city: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{profile.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedProfile.state}
                          onChange={(e) => setEditedProfile({ ...editedProfile, state: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{profile.state}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedProfile.pincode}
                          onChange={(e) => setEditedProfile({ ...editedProfile, pincode: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{profile.pincode}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Number</label>
                      <p className="text-gray-900 py-2">**** **** {profile.aadhaar.slice(-4)}</p>
                      <p className="text-xs text-gray-500">Aadhaar number is masked for security</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
                      <p className="text-gray-900 py-2">{profile.pan}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">Recent Documents</h2>
                  <div className="space-y-4">
                    {recentDocuments.map((doc, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {doc.date}
                              </span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                {doc.type}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              doc.status === 'Completed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {doc.status}
                            </span>
                            <button className="text-blue-600 hover:text-blue-800">
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">Notification Settings</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-4 border-b border-gray-200">
                      <div>
                        <h3 className="font-semibold text-gray-900">Email Notifications</h3>
                        <p className="text-gray-600">Receive updates about your documents via email</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex items-center justify-between py-4 border-b border-gray-200">
                      <div>
                        <h3 className="font-semibold text-gray-900">SMS Notifications</h3>
                        <p className="text-gray-600">Get SMS updates for important events</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex items-center justify-between py-4 border-b border-gray-200">
                      <div>
                        <h3 className="font-semibold text-gray-900">Document Completion</h3>
                        <p className="text-gray-600">Notify when documents are processed</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">Security Settings</h2>
                  <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        <h3 className="font-semibold text-green-800">Account Security</h3>
                      </div>
                      <p className="text-green-700 mt-2">Your account is secure with 2FA enabled</p>
                    </div>
                    
                    <div className="space-y-4">
                      <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <h3 className="font-semibold text-gray-900">Change Password</h3>
                        <p className="text-gray-600">Update your account password</p>
                      </button>
                      
                      <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
                        <p className="text-gray-600">Manage your 2FA settings</p>
                      </button>
                      
                      <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <h3 className="font-semibold text-gray-900">Digital Signature Certificate</h3>
                        <p className="text-gray-600">Manage your digital signature certificate</p>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
