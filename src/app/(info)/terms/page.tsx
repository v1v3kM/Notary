'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FileCheck, Shield, AlertTriangle, Gavel, Clock } from 'lucide-react';

const sections = [
  {
    title: 'Acceptance of Terms',
    icon: <FileCheck className="w-6 h-6" />,
    content: `By accessing and using NotaryPro's digital notarization services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. These terms constitute a legally binding agreement between you and NotaryPro. If you do not agree to these terms, please do not use our services.`
  },
  {
    title: 'Service Description',
    icon: <Shield className="w-6 h-6" />,
    content: `NotaryPro provides digital notarization services that allow you to have documents notarized remotely through secure video conferencing technology. Our services include identity verification, document authentication, and the application of digital notarial seals in compliance with applicable state and federal laws.`
  },
  {
    title: 'User Eligibility and Responsibilities',
    icon: <Gavel className="w-6 h-6" />,
    content: `You must be at least 18 years old and legally capable of entering into binding agreements to use our services. You are responsible for providing accurate information, maintaining the confidentiality of your account credentials, and ensuring that your use of our services complies with all applicable laws and regulations.`
  },
  {
    title: 'Acceptable Use Policy',
    icon: <AlertTriangle className="w-6 h-6" />,
    content: `You agree not to use our services for any illegal, fraudulent, or unauthorized purposes. You may not attempt to compromise the security of our platform, upload malicious content, or engage in any activity that could harm our services or other users. Violation of this policy may result in immediate termination of your account.`
  },
  {
    title: 'Document Requirements and Limitations',
    icon: <FileCheck className="w-6 h-6" />,
    content: `Documents submitted for notarization must be complete, legible, and compliant with applicable laws. We reserve the right to refuse notarization of documents that appear fraudulent, incomplete, or that we are legally prohibited from notarizing. Certain document types may require additional verification or may not be eligible for digital notarization.`
  },
  {
    title: 'Payment Terms and Refunds',
    icon: <Clock className="w-6 h-6" />,
    content: `Payment is due at the time services are rendered. We accept major credit cards and other payment methods as specified on our platform. Refunds are provided in accordance with our refund policy, typically within 30 days of service for unused services or in cases of service failure on our part.`
  }
];

const limitations = [
  {
    title: 'Service Availability',
    content: 'While we strive to provide continuous service, we cannot guarantee 100% uptime. Services may be temporarily unavailable due to maintenance, updates, or technical issues.'
  },
  {
    title: 'Accuracy of Information',
    content: 'We are not responsible for the accuracy or completeness of information provided by users. Users are solely responsible for the content of their documents.'
  },
  {
    title: 'Legal Advice',
    content: 'NotaryPro does not provide legal advice. Our notaries verify identity and witness signatures but do not advise on document content or legal implications.'
  },
  {
    title: 'Third-Party Services',
    content: 'We may integrate with third-party services for enhanced functionality. We are not responsible for the performance or policies of these third-party services.'
  }
];

export default function TermsPage() {
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
              className="w-24 h-24 flex items-center justify-center mx-auto mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Image 
                src="/logo.png" 
                alt="Company Logo"
                width={96}
                height={96}
                className="object-contain"
              />
            </motion.div>
            
            <motion.h1 
              className="text-5xl lg:text-6xl font-bold mb-8"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Terms of Service
            </motion.h1>
            
            <motion.p 
              className="text-xl lg:text-2xl mb-8 max-w-4xl mx-auto text-blue-100"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Please read these terms carefully before using our digital notarization services.
            </motion.p>

            <motion.div 
              className="text-blue-200"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              Effective Date: December 15, 2024
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Introduction</h2>
            <div className="prose prose-lg text-gray-600 leading-relaxed">
              <p className="mb-6">
                Welcome to NotaryPro, a digital notarization platform that provides secure, convenient, and legally 
                compliant remote notarization services. These Terms of Service (&ldquo;Terms&rdquo;) govern your use of our 
                platform and services.
              </p>
              <p className="mb-6">
                These Terms establish the rights and responsibilities of both NotaryPro and our users. By using our 
                services, you enter into a legal agreement with us and must comply with all applicable laws and 
                regulations governing notarization in your jurisdiction.
              </p>
              <p>
                We reserve the right to modify these Terms at any time. Material changes will be communicated to 
                users with appropriate notice, and continued use of our services constitutes acceptance of any 
                modifications.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Terms Sections */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <div className="flex items-start">
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-6 mt-1 flex-shrink-0"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <div className="text-white">
                      {section.icon}
                    </div>
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{section.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Limitations and Disclaimers */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Limitations and Disclaimers</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Important limitations on our services and your use of our platform
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {limitations.map((limitation, index) => (
                <motion.div
                  key={limitation.title}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-yellow-50 border border-yellow-200 rounded-xl p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                    {limitation.title}
                  </h3>
                  <p className="text-gray-700">{limitation.content}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Liability and Indemnification */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-center mb-6">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mr-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Shield className="w-6 h-6 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900">Liability and Indemnification</h2>
            </div>

            <div className="space-y-6 text-gray-600">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Limitation of Liability</h3>
                <p className="leading-relaxed">
                  To the maximum extent permitted by law, NotaryPro&apos;s total liability for any claims arising from 
                  or related to our services shall not exceed the amount paid by you for the specific service that 
                  gave rise to the claim. We shall not be liable for any indirect, incidental, special, consequential, 
                  or punitive damages.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">User Indemnification</h3>
                <p className="leading-relaxed">
                  You agree to indemnify, defend, and hold harmless NotaryPro and its officers, directors, employees, 
                  and agents from any claims, damages, losses, or expenses arising from your use of our services, 
                  violation of these Terms, or infringement of any third-party rights.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Force Majeure</h3>
                <p className="leading-relaxed">
                  Neither party shall be liable for any failure or delay in performance due to events beyond their 
                  reasonable control, including but not limited to acts of God, natural disasters, war, terrorism, 
                  government actions, or network failures.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Governing Law and Disputes */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-blue-50 border border-blue-200 rounded-2xl p-8"
          >
            <div className="flex items-center mb-6">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Gavel className="w-6 h-6 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900">Governing Law and Dispute Resolution</h2>
            </div>

            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Governing Law</h3>
                <p className="leading-relaxed">
                  These Terms and any disputes arising from or related to our services shall be governed by and 
                  construed in accordance with the laws of the State of Delaware, without regard to its conflict 
                  of law provisions.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Dispute Resolution</h3>
                <p className="leading-relaxed">
                  Any disputes arising from these Terms or our services shall first be addressed through good faith 
                  negotiations. If negotiations fail, disputes shall be resolved through binding arbitration in 
                  accordance with the rules of the American Arbitration Association.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Class Action Waiver</h3>
                <p className="leading-relaxed">
                  You agree that any arbitration or legal proceeding shall be conducted on an individual basis and 
                  not as part of a class action, collective action, or representative proceeding.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
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
              <FileCheck className="w-8 h-8 text-white" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About These Terms?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              If you have any questions about these Terms of Service, please contact our legal team.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-blue-600">legal@notarypro.com</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                <p className="text-blue-600">1-800-NOTARY-1</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
