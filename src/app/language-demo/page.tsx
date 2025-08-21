'use client';

import { LanguageProvider, LanguageSelector, useTranslation } from '@/components/LanguageProvider';
import { motion } from 'framer-motion';
import { Globe, Users, FileText, Award, Zap, Shield } from 'lucide-react';

function LanguageDemoContent() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Globe,
      title: 'Multi-Language Support',
      titleHi: 'बहुभाषी समर्थन',
      description: 'Available in 8 Indian languages',
      descriptionHi: '8 भारतीय भाषाओं में उपलब्ध'
    },
    {
      icon: Users,
      title: 'Cultural Adaptation',
      titleHi: 'सांस्कृतिक अनुकूलन',
      description: 'Localized content for different regions',
      descriptionHi: 'विभिन्न क्षेत्रों के लिए स्थानीयकृत सामग्री'
    },
    {
      icon: FileText,
      title: 'Legal Accuracy',
      titleHi: 'कानूनी सटीकता',
      description: 'Legally accurate translations',
      descriptionHi: 'कानूनी रूप से सटीक अनुवाद'
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      titleHi: 'गुणवत्ता आश्वासन',
      description: 'Professional translation quality',
      descriptionHi: 'पेशेवर अनुवाद गुणवत्ता'
    },
    {
      icon: Zap,
      title: 'Real-time Switching',
      titleHi: 'तत्काल स्विचिंग',
      description: 'Instant language switching',
      descriptionHi: 'तत्काल भाषा स्विचिंग'
    },
    {
      icon: Shield,
      title: 'Compliance Ready',
      titleHi: 'अनुपालन तैयार',
      description: 'Meets government standards',
      descriptionHi: 'सरकारी मानकों को पूरा करता है'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Multi-Language Demo</h1>
              <p className="text-gray-600 mt-2">
                Experience our platform in multiple Indian languages
              </p>
            </div>
            <LanguageSelector showFullNames={true} />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">{t('common.welcome')}</h2>
            <p className="text-xl text-blue-100">
              Digital Notary Platform - Serving India in Multiple Languages
            </p>
          </div>
        </motion.div>

        {/* Navigation Demo */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Navigation Example</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              'navigation.home',
              'navigation.about', 
              'navigation.services',
              'templates.title',
              'common.dashboard',
              'navigation.help'
            ].map((key) => (
              <motion.div
                key={key}
                className="bg-gray-50 p-3 rounded-lg text-center"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-sm font-medium text-gray-700">
                  {t(key)}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dashboard Demo */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">{t('common.dashboard')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { key: 'dashboard.totalDocuments', value: '24', color: 'blue' },
              { key: 'dashboard.completedDocuments', value: '18', color: 'green' },
              { key: 'dashboard.pendingDocuments', value: '6', color: 'yellow' },
              { key: 'dashboard.totalSpent', value: '₹12,450', color: 'purple' }
            ].map((stat) => (
              <motion.div
                key={stat.key}
                className="bg-gray-50 p-4 rounded-lg"
                whileHover={{ scale: 1.02 }}
              >
                <div className={`text-2xl font-bold text-${stat.color}-600 mb-1`}>
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm">{t(stat.key)}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Templates Demo */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">{t('templates.title')}</h3>
          <p className="text-gray-600 mb-6">{t('templates.subtitle')}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              'templates.property',
              'templates.business', 
              'templates.personal',
              'templates.legal'
            ].map((category) => (
              <motion.div
                key={category}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <FileText className="w-8 h-8 text-blue-600 mb-3" />
                <h4 className="font-medium text-gray-900 mb-2">{t(category)}</h4>
                <p className="text-sm text-gray-500">
                  Professional {t(category).toLowerCase()} documents
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-6">Multi-Language Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600 text-sm mb-2">
                  {feature.description}
                </p>
                <div className="text-xs text-gray-500 border-t pt-2">
                  <div className="font-medium">{feature.titleHi}</div>
                  <div>{feature.descriptionHi}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Language Information */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            Supported Languages / समर्थित भाषाएं
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'English', native: 'English', code: 'EN' },
              { name: 'Hindi', native: 'हिन्दी', code: 'HI' },
              { name: 'Bengali', native: 'বাংলা', code: 'BN' },
              { name: 'Telugu', native: 'తెలుగు', code: 'TE' },
              { name: 'Tamil', native: 'தமிழ்', code: 'TA' },
              { name: 'Gujarati', native: 'ગુજરાતી', code: 'GU' },
              { name: 'Marathi', native: 'मराठी', code: 'MR' },
              { name: 'Kannada', native: 'ಕನ್ನಡ', code: 'KN' }
            ].map((lang) => (
              <div key={lang.code} className="bg-white p-3 rounded-lg">
                <div className="font-medium text-gray-900">{lang.native}</div>
                <div className="text-sm text-gray-500">{lang.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LanguageDemo() {
  return (
    <LanguageProvider>
      <LanguageDemoContent />
    </LanguageProvider>
  );
}
