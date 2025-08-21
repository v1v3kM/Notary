'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Scale, 
  FileText, 
  Shield, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Gavel,
  Award,
  FileCheck,
  Banknote
} from 'lucide-react';

const services = [
  {
    title: 'Income Affidavits',
    description: 'Legal affidavits for income verification and declarations',
    price: '₹300',
    time: '1-2 hours',
    icon: <FileText className="w-8 h-8" />,
    features: [
      'Income verification documents',
      'Legal compliance check',
      'Digital signatures',
      'Court-ready format'
    ]
  },
  {
    title: 'Age Proof Affidavits',
    description: 'Age verification affidavits for official purposes',
    price: '₹250',
    time: '1 hour',
    icon: <Award className="w-8 h-8" />,
    features: [
      'Age verification process',
      'Document authentication',
      'Legal format compliance',
      'Government acceptance'
    ]
  },
  {
    title: 'Name Change Affidavits',
    description: 'Legal name change declarations and affidavits',
    price: '₹400',
    time: '2-3 hours',
    icon: <FileCheck className="w-8 h-8" />,
    features: [
      'Name change verification',
      'Identity validation',
      'Legal documentation',
      'Official gazette compliance'
    ]
  },
  {
    title: 'Court Affidavits',
    description: 'Court-ready affidavits for legal proceedings',
    price: '₹500',
    time: '2-4 hours',
    icon: <Gavel className="w-8 h-8" />,
    features: [
      'Court format compliance',
      'Legal verification',
      'Oath administration',
      'Judicial acceptance'
    ]
  }
];

const legalCompliance = [
  {
    title: 'IT Act 2000 Compliance',
    description: 'Full compliance with Information Technology Act, 2000',
    icon: <Shield className="w-6 h-6" />
  },
  {
    title: 'Legal Validity',
    description: 'All affidavits have legal validity in Indian courts',
    icon: <Scale className="w-6 h-6" />
  },
  {
    title: 'Digital Signatures',
    description: 'Government-approved digital signature certificates',
    icon: <FileCheck className="w-6 h-6" />
  },
  {
    title: 'CCA Approved',
    description: 'Certified by Controller of Certifying Authorities',
    icon: <Award className="w-6 h-6" />
  }
];

export default function LegalServices() {
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
              Legal Document Services
              <br />
              <span className="text-2xl lg:text-3xl font-medium text-blue-200">
                कानूनी दस्तावेज़ सेवाएं
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg lg:text-xl mb-12 max-w-4xl mx-auto text-blue-100"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Professional notarization for affidavits, declarations, and legal documents. 
              Court-ready format with full legal compliance.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Link href="/auth/signup">
                <motion.button
                  className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Notarization
                  <ArrowRight className="w-5 h-5 inline ml-2" />
                </motion.button>
              </Link>
              
              <Link href="/help">
                <motion.button
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-900 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
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
              Legal Services / कानूनी सेवाएं
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Court-ready affidavits and legal documents with full compliance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-200"
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-white mr-4">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center">
                        <Banknote className="w-4 h-4 mr-1" />
                        {service.price}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {service.time}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">{service.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link href="/auth/signup">
                  <motion.button
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 inline ml-2" />
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Compliance Section */}
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
              Legal Compliance / कानूनी अनुपालन
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Full compliance with Indian laws and regulations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {legalCompliance.map((item, index) => (
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Need Legal Document Notarization?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-purple-100">
              Get your affidavits and legal documents notarized with full court validity
            </p>
            <Link href="/auth/signup">
              <motion.button
                className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Now - ₹250 onwards
                <ArrowRight className="w-5 h-5 inline ml-2" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
