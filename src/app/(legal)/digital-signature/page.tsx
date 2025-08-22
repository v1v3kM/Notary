'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Shield, 
  FileText, 
  Key, 
  CheckCircle, 
  Globe, 
  Lock,
  Award,
  Building,
  Clock,
  ArrowRight,
  UserCheck,
  FileCheck
} from 'lucide-react';

const digitalSignatureTypes = [
  {
    title: 'Class 1 Digital Signature',
    description: 'Basic level digital signature for simple document signing',
    price: '₹999/year',
    features: [
      'Email-based identity verification',
      'Basic document signing',
      'Personal use suitable',
      'Low security applications',
      'Valid for 1 year'
    ],
    icon: <FileText className="w-8 h-8" />,
    usage: 'Personal documents, basic forms'
  },
  {
    title: 'Class 2 Digital Signature',
    description: 'Medium security level for business and government applications',
    price: '₹1,499/year',
    features: [
      'Identity verification through documents',
      'Business document signing',
      'Government portal access',
      'E-filing capabilities',
      'Valid for 2 years'
    ],
    icon: <Building className="w-8 h-8" />,
    usage: 'Business documents, government forms, tax filing',
    popular: true
  },
  {
    title: 'Class 3 Digital Signature',
    description: 'Highest security level for critical applications',
    price: '₹2,999/year',
    features: [
      'Physical presence verification',
      'High-value transactions',
      'Legal document signing',
      'Court submissions',
      'Valid for 2 years'
    ],
    icon: <Shield className="w-8 h-8" />,
    usage: 'Legal documents, high-value contracts, court filings'
  }
];

const process = [
  {
    step: '01',
    title: 'Document Verification',
    description: 'Submit identity and address proof documents',
    icon: <FileCheck className="w-6 h-6" />
  },
  {
    step: '02',
    title: 'Identity Validation',
    description: 'Complete KYC process with authorized personnel',
    icon: <UserCheck className="w-6 h-6" />
  },
  {
    step: '03',
    title: 'Certificate Generation',
    description: 'Digital signature certificate is generated and issued',
    icon: <Award className="w-6 h-6" />
  },
  {
    step: '04',
    title: 'Download & Install',
    description: 'Download certificate and install on your device',
    icon: <Key className="w-6 h-6" />
  }
];

const benefits = [
  {
    title: 'Legal Validity',
    description: 'Legally valid under IT Act 2000 and Indian Evidence Act',
    icon: <Shield className="w-6 h-6" />
  },
  {
    title: 'Time Savings',
    description: 'Instant document signing without physical presence',
    icon: <Clock className="w-6 h-6" />
  },
  {
    title: 'Cost Effective',
    description: 'Reduce printing, courier, and travel costs',
    icon: <Award className="w-6 h-6" />
  },
  {
    title: 'Security',
    description: 'PKI technology ensures document integrity and authenticity',
    icon: <Lock className="w-6 h-6" />
  },
  {
    title: 'Global Acceptance',
    description: 'Accepted by government agencies and international bodies',
    icon: <Globe className="w-6 h-6" />
  },
  {
    title: 'Non-repudiation',
    description: 'Signer cannot deny having signed the document',
    icon: <FileText className="w-6 h-6" />
  }
];

const applications = [
  'Income Tax e-filing (ITR)',
  'GST returns and compliance',
  'Company registration documents',
  'Bank loan applications',
  'Insurance claims',
  'Property registration',
  'Tender submissions',
  'Court document filing',
  'Patent applications',
  'Export-import documentation'
];

export default function DigitalSignaturePage() {
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
              Digital Signature Rules
              <br />
              <span className="text-2xl lg:text-3xl font-medium text-blue-200">
                डिजिटल हस्ताक्षर नियम
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg lg:text-xl mb-12 max-w-4xl mx-auto text-blue-100"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Get your CCA-approved digital signature certificate for secure document signing 
              and legal compliance under Indian IT laws.
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
                  Get Digital Signature
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

      {/* Digital Signature Types */}
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
              Digital Signature Types / डिजिटल हस्ताक्षर प्रकार
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the right digital signature certificate based on your needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {digitalSignatureTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className={`bg-white rounded-xl shadow-lg p-8 border-2 relative ${
                  type.popular ? 'border-orange-300 bg-gradient-to-br from-white to-orange-50' : 'border-gray-200'
                }`}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                {type.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center text-white ${
                    type.popular ? 'bg-gradient-to-br from-orange-500 to-red-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                  }`}>
                    {type.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{type.title}</h3>
                  <p className="text-gray-600 mb-4">{type.description}</p>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{type.price}</div>
                  <p className="text-sm text-gray-500 mb-4">Best for: {type.usage}</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {type.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link href="/auth/signup">
                  <motion.button
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                      type.popular
                        ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:shadow-lg'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg'
                    }`}
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

      {/* Process Section */}
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
              How to Get Digital Signature / डिजिटल हस्ताक्षर कैसे प्राप्त करें
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple 4-step process to get your digital signature certificate
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6">
                  {step.step}
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white mx-auto mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
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
              Benefits of Digital Signature / डिजिटल हस्ताक्षर के फायदे
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Why digital signatures are the future of document authentication
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg p-6 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Applications Section */}
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
              Applications / उपयोग
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Where you can use your digital signature certificate
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {applications.map((app, index) => (
              <motion.div
                key={app}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-shadow"
              >
                <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">{app}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Get Your Digital Signature?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
              Join millions of Indians using digital signatures for secure and legal document signing
            </p>
            <Link href="/auth/signup">
              <motion.button
                className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started - From ₹999/year
                <ArrowRight className="w-5 h-5 inline ml-2" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
