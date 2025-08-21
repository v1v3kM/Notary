'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  Eye, 
  Ear, 
  MousePointer, 
  Keyboard, 
  Type, 
  Monitor,
  Smartphone,
  Heart,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const features = [
  {
    title: 'Visual Accessibility',
    description: 'Support for users with visual impairments',
    icon: <Eye className="w-8 h-8" />,
    items: [
      'High contrast mode for better visibility',
      'Screen reader compatibility (NVDA, JAWS, VoiceOver)',
      'Alternative text for all images and icons',
      'Keyboard navigation support',
      'Adjustable font sizes',
      'Color blind friendly design'
    ]
  },
  {
    title: 'Hearing Accessibility',
    description: 'Features for users with hearing difficulties',
    icon: <Ear className="w-8 h-8" />,
    items: [
      'Visual alerts and notifications',
      'Closed captions for video content',
      'Text alternatives for audio information',
      'Sign language interpretation support',
      'Written instructions for all processes'
    ]
  },
  {
    title: 'Motor Accessibility',
    description: 'Support for users with motor impairments',
    icon: <MousePointer className="w-8 h-8" />,
    items: [
      'Keyboard-only navigation',
      'Large clickable areas',
      'Voice control compatibility',
      'Reduced motion options',
      'Extended time limits for forms',
      'Single-hand operation support'
    ]
  },
  {
    title: 'Cognitive Accessibility',
    description: 'Design for cognitive and learning differences',
    icon: <Type className="w-8 h-8" />,
    items: [
      'Simple and clear language',
      'Step-by-step processes',
      'Error prevention and correction',
      'Consistent navigation patterns',
      'Help and support at every step',
      'Progress indicators'
    ]
  }
];

const compliance = [
  {
    title: 'WCAG 2.1 AA Compliance',
    description: 'Meets Web Content Accessibility Guidelines Level AA',
    icon: <CheckCircle className="w-6 h-6" />
  },
  {
    title: 'Section 508 Compliant',
    description: 'Follows US Federal accessibility standards',
    icon: <CheckCircle className="w-6 h-6" />
  },
  {
    title: 'Rights of PWD Act 2016',
    description: 'Compliant with Indian disability rights legislation',
    icon: <CheckCircle className="w-6 h-6" />
  },
  {
    title: 'Digital India Guidelines',
    description: 'Follows Government of India accessibility guidelines',
    icon: <CheckCircle className="w-6 h-6" />
  }
];

const devices = [
  {
    title: 'Desktop & Laptop',
    description: 'Full accessibility features on all major browsers',
    icon: <Monitor className="w-8 h-8" />
  },
  {
    title: 'Mobile & Tablet',
    description: 'Touch-friendly interface with accessibility support',
    icon: <Smartphone className="w-8 h-8" />
  },
  {
    title: 'Assistive Technology',
    description: 'Compatible with screen readers and other tools',
    icon: <Keyboard className="w-8 h-8" />
  }
];

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Government Identity Bar */}
      <div className="bg-gradient-to-r from-orange-500 via-white to-green-500 h-1"></div>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-800 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <motion.div 
            className="text-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="mb-8 flex justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
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
            </motion.div>
            
            <motion.h1 
              className="text-4xl lg:text-6xl font-bold mb-6 leading-tight"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Accessibility Statement
              <br />
              <span className="text-2xl lg:text-3xl font-medium text-blue-200">
                पहुंच की जानकारी
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg lg:text-xl mb-12 max-w-4xl mx-auto text-blue-100"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              We are committed to ensuring digital accessibility for people with disabilities. 
              Our platform is designed to be inclusive and accessible to all users.
            </motion.p>
            
            <motion.div 
              className="flex justify-center items-center space-x-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Heart className="w-8 h-8 text-red-400" />
              <span className="text-xl font-semibold">Accessible by Design</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Accessibility Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Accessibility Features / पहुंच सुविधाएं
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive accessibility features to ensure equal access for all users
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg p-8 border border-gray-200"
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white mr-4">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
                
                <ul className="space-y-3">
                  {feature.items.map((item, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Standards Compliance / मानक अनुपालन
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform meets international and national accessibility standards
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {compliance.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg p-6 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Device Support */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Device Support / उपकरण समर्थन
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Accessible across all devices and assistive technologies
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {devices.map((device, index) => (
              <motion.div
                key={device.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg p-8 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white mx-auto mb-6">
                  {device.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{device.title}</h3>
                <p className="text-gray-600">{device.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-20 bg-gradient-to-r from-blue-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Accessibility Feedback / पहुंच प्रतिक्रिया
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
              Help us improve accessibility. Share your feedback or report accessibility issues.
            </p>
            <div className="space-y-4">
              <p className="text-lg">
                <strong>Email:</strong> accessibility@digitalnotary.gov.in
              </p>
              <p className="text-lg">
                <strong>Phone:</strong> 1800-11-ACCESS (1800-11-22237)
              </p>
              <p className="text-lg">
                <strong>Response Time:</strong> Within 48 hours
              </p>
            </div>
            <div className="mt-8">
              <motion.button
                className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Accessibility Team
                <ArrowRight className="w-5 h-5 inline ml-2" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
