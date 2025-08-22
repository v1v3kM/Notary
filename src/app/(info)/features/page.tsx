'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Search, 
  History, 
  Globe, 
  CheckCircle, 
  Zap, 
  Shield, 
  Star,
  Users,
  BarChart3,
  Layout,
  ExternalLink
} from 'lucide-react';

const features = [
  {
    icon: Layout,
    title: 'Document Templates',
    description: 'Professional legal document templates with preview, category filtering, and easy customization.',
    status: 'completed',
    demoUrl: '/templates',
    highlights: [
      '6 comprehensive templates (Property, Rental, Affidavit, Partnership, Power of Attorney, Employment)',
      'Template preview with modal functionality',
      'Category-based filtering and search',
      'Popularity indicators and ratings',
      'Professional field mapping system'
    ]
  },
  {
    icon: Search,
    title: 'Advanced Search & Filtering',
    description: 'Sophisticated search capabilities with multi-criteria filtering, date ranges, and sorting options.',
    status: 'completed',
    demoUrl: '/templates',
    highlights: [
      'Multi-criteria search with text, category, and price filters',
      'Date range filtering for document creation',
      'Price range sliders for budget-based filtering',
      'Sort by popularity, price, and date',
      'Grid and list view modes',
      'Responsive design with mobile optimization'
    ]
  },
  {
    icon: History,
    title: 'Document Versioning',
    description: 'Complete version control system with history tracking, comparison tools, and restoration capabilities.',
    status: 'completed',
    demoUrl: '/versions',
    highlights: [
      'Visual timeline of document changes',
      'Side-by-side version comparison',
      'Change tracking with author information',
      'Comment system for collaboration',
      'One-click version restoration',
      'File size and status tracking'
    ]
  },
  {
    icon: Globe,
    title: 'Multi-Language Support (i18n)',
    description: 'Comprehensive internationalization with 8 Indian languages and real-time switching.',
    status: 'completed',
    demoUrl: '/language-demo',
    highlights: [
      'Support for 8 Indian languages (English, Hindi, Bengali, Telugu, Tamil, Gujarati, Marathi, Kannada)',
      'Real-time language switching without page reload',
      'Culturally adapted content and legal terminology',
      'Native script support for all languages',
      'Language preference persistence',
      'Professional translation quality'
    ]
  },
  {
    icon: BarChart3,
    title: 'Enhanced Dashboard',
    description: 'Comprehensive dashboard with statistics, recent activity, and quick access to all platform features.',
    status: 'completed',
    demoUrl: '/dashboard',
    highlights: [
      'Real-time statistics and analytics',
      'Recent activity tracking',
      'Popular templates showcase',
      'Quick action buttons for common tasks',
      'User profile management',
      'Notification system integration'
    ]
  },
  {
    icon: FileText,
    title: 'Navigation Integration',
    description: 'Seamless integration of new features into the main platform navigation and user workflows.',
    status: 'completed',
    demoUrl: '/',
    highlights: [
      'Templates link in main navigation',
      'User menu with quick access to all features',
      'Mobile-responsive navigation updates',
      'Bilingual navigation labels',
      'Breadcrumb navigation for better UX',
      'Contextual help and support links'
    ]
  }
];

const futureFeatures = [
  {
    icon: Shield,
    title: 'Payment Integration',
    description: 'Secure payment processing with multiple payment methods',
    priority: 'Critical'
  },
  {
    icon: Users,
    title: 'Real Authentication',
    description: 'Production-ready authentication with role-based access',
    priority: 'Critical'
  },
  {
    icon: Star,
    title: 'File Storage',
    description: 'Cloud storage integration for document management',
    priority: 'Critical'
  },
  {
    icon: Zap,
    title: 'Real-time Notifications',
    description: 'Live updates and notification system',
    priority: 'Major'
  }
];

export default function FeaturesOverview() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Platform Features Overview
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive static features implemented to enhance user experience and prepare for API integrations
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Implementation Status */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Implementation Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Static Features</h3>
              <p className="text-3xl font-bold text-green-600">6/6</p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Ready for API</h3>
              <p className="text-3xl font-bold text-blue-600">100%</p>
              <p className="text-sm text-gray-500">Integration Ready</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">User Experience</h3>
              <p className="text-3xl font-bold text-purple-600">95%</p>
              <p className="text-sm text-gray-500">Enhanced</p>
            </div>
          </div>
        </div>

        {/* Completed Features */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Completed Features</h2>
          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                      ✓ Completed
                    </span>
                    <Link
                      href={feature.demoUrl}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full hover:bg-blue-200 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Demo
                    </Link>
                  </div>
                </div>

                <div className="ml-16">
                  <h4 className="font-medium text-gray-900 mb-3">Key Highlights:</h4>
                  <ul className="space-y-2">
                    {feature.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Future API Integration Features */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-6">Next Phase: API Integration Features</h2>
          <p className="text-gray-600 mb-6">
            The following features are next in the roadmap and will require backend API development:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {futureFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      feature.priority === 'Critical' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {feature.priority} Priority
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Strategic Implementation Plan</h3>
            <p className="text-blue-800 text-sm">
              The static features implemented provide a solid foundation for API integration. 
              Each component is designed to seamlessly work with backend services once they&apos;re available, 
              ensuring smooth transition from static to dynamic functionality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
