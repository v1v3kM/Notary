'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import NotaryPlatform from './NotaryPlatform';
import {
  FileText,
  Shield,
  Zap,
  Users,
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Globe,
  Award,
  TrendingUp
} from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Document Management',
    description: 'Upload, categorize, and manage all your legal documents securely',
    color: 'blue'
  },
  {
    icon: Users,
    title: 'Role-Based Dashboards',
    description: 'Separate interfaces for clients, lawyers, and notaries',
    color: 'green'
  },
  {
    icon: Clock,
    title: 'Appointment Scheduling',
    description: 'Book consultations with lawyers and notaries easily',
    color: 'purple'
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Multiple payment options with bank-grade security',
    color: 'orange'
  },
  {
    icon: Zap,
    title: 'Video Consultations',
    description: 'High-quality video calls with document sharing',
    color: 'red'
  },
  {
    icon: Star,
    title: 'Digital Signatures',
    description: 'Legally binding electronic signatures and notarization',
    color: 'yellow'
  }
];

const stats = [
  { label: 'Documents Processed', value: '50,000+', icon: FileText },
  { label: 'Active Users', value: '10,000+', icon: Users },
  { label: 'Success Rate', value: '99.9%', icon: TrendingUp },
  { label: 'Countries Served', value: '25+', icon: Globe }
];

export default function PlatformShowcase() {
  const [showPlatform, setShowPlatform] = useState(false);
  const [, setActiveFeature] = useState(0);

  if (showPlatform) {
    return <NotaryPlatform />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
                Digital Notary
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {' '}Platform
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                A comprehensive solution for digital notarization, document management, 
                legal consultations, and secure payment processing - all in one platform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
                  onClick={() => setShowPlatform(true)}
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Launch Platform</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  className="bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 shadow-lg border border-gray-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Digital Notarization
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines all essential features for modern legal document processing,
              consultation, and notarization services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:shadow-lg transition-all cursor-pointer"
                onMouseEnter={() => setActiveFeature(index)}
                whileHover={{ scale: 1.02 }}
              >
                <div className={`w-14 h-14 bg-${feature.color}-100 rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                
                <div className="mt-6 flex items-center text-blue-600 font-medium">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Preview */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Experience the Platform
            </h2>
            <p className="text-xl text-gray-600">
              See how our comprehensive solution works in practice
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                {[
                  'Role-based dashboards for clients, lawyers, and notaries',
                  'Secure document upload with categorization',
                  'Advanced appointment scheduling system',
                  'Multiple payment options with security',
                  'HD video consultations with screen sharing',
                  'Digital signatures and notarization'
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-center space-x-4"
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-lg text-gray-700">{item}</span>
                  </motion.div>
                ))}
              </div>

              <motion.button
                onClick={() => setShowPlatform(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Try the Platform</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <div className="flex-1 bg-gray-100 rounded-full h-8 flex items-center px-4">
                    <span className="text-sm text-gray-500">notarypro.app</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Dashboard Overview</h3>
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-blue-600">12</div>
                        <div className="text-xs text-gray-600">Documents</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-green-600">3</div>
                        <div className="text-xs text-gray-600">Meetings</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-purple-600">8</div>
                        <div className="text-xs text-gray-600">Completed</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="w-6 h-6 bg-green-100 rounded mb-2">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">Upload Documents</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="w-6 h-6 bg-blue-100 rounded mb-2">
                        <Clock className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">Schedule Meeting</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-xl shadow-lg"
              >
                <Award className="w-6 h-6" />
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 bg-blue-500 text-white p-3 rounded-xl shadow-lg"
              >
                <Shield className="w-6 h-6" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Legal Workflow?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of legal professionals who trust our platform for their digital notarization needs.
            </p>
            
            <motion.button
              onClick={() => setShowPlatform(true)}
              className="bg-white text-blue-600 px-10 py-5 rounded-xl font-bold text-xl hover:bg-gray-50 transition-colors shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Now
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
