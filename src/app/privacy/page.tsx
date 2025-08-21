'use client';

import { motion } from 'framer-motion';
import { Shield, Eye, Lock, FileText, Users, Clock } from 'lucide-react';

const sections = [
  {
    title: 'Information We Collect',
    icon: <FileText className="w-6 h-6" />,
    content: [
      {
        subtitle: 'Personal Information',
        text: 'We collect personal information that you provide directly to us, including your name, email address, phone number, and government-issued identification for identity verification purposes.'
      },
      {
        subtitle: 'Document Information',
        text: 'We collect and process the documents you upload for notarization, including their content and metadata necessary for the notarization process.'
      },
      {
        subtitle: 'Technical Information',
        text: 'We automatically collect certain technical information, including your IP address, browser type, device information, and usage patterns to improve our services.'
      }
    ]
  },
  {
    title: 'How We Use Your Information',
    icon: <Users className="w-6 h-6" />,
    content: [
      {
        subtitle: 'Notarization Services',
        text: 'We use your information to provide notarization services, verify your identity, process your documents, and maintain records as required by law.'
      },
      {
        subtitle: 'Service Improvement',
        text: 'We analyze usage patterns and feedback to improve our platform, develop new features, and enhance user experience.'
      },
      {
        subtitle: 'Communication',
        text: 'We use your contact information to send you service-related communications, updates, and support responses.'
      }
    ]
  },
  {
    title: 'Information Security',
    icon: <Shield className="w-6 h-6" />,
    content: [
      {
        subtitle: 'Encryption',
        text: 'All data transmission and storage uses bank-level AES-256 encryption to protect your information from unauthorized access.'
      },
      {
        subtitle: 'Access Controls',
        text: 'We implement strict access controls, ensuring only authorized personnel can access your information on a need-to-know basis.'
      },
      {
        subtitle: 'Regular Audits',
        text: 'We conduct regular security audits and penetration testing to identify and address potential vulnerabilities.'
      }
    ]
  },
  {
    title: 'Data Retention',
    icon: <Clock className="w-6 h-6" />,
    content: [
      {
        subtitle: 'Document Storage',
        text: 'Notarized documents are retained for the period required by state law, typically 7-10 years, after which they are securely deleted.'
      },
      {
        subtitle: 'Personal Information',
        text: 'Personal information is retained as long as necessary to provide services and comply with legal obligations.'
      },
      {
        subtitle: 'Account Deletion',
        text: 'You may request account deletion at any time. We will delete your personal information within 30 days, subject to legal retention requirements.'
      }
    ]
  }
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <motion.div 
            className="text-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Shield className="w-10 h-10 text-white" />
            </motion.div>
            
            <motion.h1 
              className="text-5xl lg:text-6xl font-bold mb-8"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Privacy Policy
            </motion.h1>
            
            <motion.p 
              className="text-xl lg:text-2xl mb-8 max-w-4xl mx-auto text-blue-100"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Your privacy and data security are our top priorities. Learn how we protect and handle your information.
            </motion.p>

            <motion.div 
              className="text-blue-200"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              Last updated: December 15, 2024
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Overview</h2>
            <div className="prose prose-lg text-gray-600 leading-relaxed">
              <p className="mb-6">
                At NotaryPro, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
                digital notarization services.
              </p>
              <p className="mb-6">
                We understand that notarization involves sensitive legal documents and personal information. That&apos;s why we&apos;ve 
                implemented industry-leading security measures and maintain strict privacy standards to protect your data.
              </p>
              <p>
                By using our services, you agree to the collection and use of information in accordance with this Privacy Policy. 
                We will not use or share your information except as described in this policy.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Sections */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <div className="flex items-center mb-8">
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <div className="text-white">
                      {section.icon}
                    </div>
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>

                <div className="space-y-6">
                  {section.content.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: (index * 0.1) + (idx * 0.1), duration: 0.5 }}
                      viewport={{ once: true }}
                      className="border-l-4 border-blue-500 pl-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.subtitle}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.text}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Your Rights Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-8">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Eye className="w-6 h-6 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900">Your Rights and Choices</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Access Your Information</h3>
                  <p className="text-gray-600">
                    You have the right to request access to the personal information we hold about you and to receive 
                    a copy of that information.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Correct Inaccuracies</h3>
                  <p className="text-gray-600">
                    You can request that we correct any inaccurate or incomplete personal information we have about you.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Delete Your Data</h3>
                  <p className="text-gray-600">
                    You may request deletion of your personal information, subject to legal retention requirements 
                    for notarized documents.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Portability</h3>
                  <p className="text-gray-600">
                    You have the right to receive your personal information in a structured, commonly used format 
                    for transfer to another service.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Opt-Out of Marketing</h3>
                  <p className="text-gray-600">
                    You can opt out of receiving marketing communications from us at any time by following the 
                    unsubscribe instructions in our emails.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">File Complaints</h3>
                  <p className="text-gray-600">
                    You have the right to file a complaint with relevant data protection authorities if you believe 
                    we have mishandled your personal information.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg text-center"
          >
            <motion.div 
              className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Lock className="w-8 h-8 text-white" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About Your Privacy?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              If you have any questions about this Privacy Policy or how we handle your personal information, 
              please don&apos;t hesitate to contact us.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
                <p className="text-blue-600">privacy@notarypro.com</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
                <p className="text-blue-600">1-800-NOTARY-1</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Updates Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Policy Updates</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, 
                operational, or regulatory reasons. We will notify you of any material changes by posting the new Privacy 
                Policy on our website and updating the &ldquo;Last updated&rdquo; date. We encourage you to review this Privacy 
                Policy periodically to stay informed about how we protect your information.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
