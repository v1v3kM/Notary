'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Shield, 
  FileText, 
  Award, 
  CheckCircle, 
  Globe, 
  Lock,
  Building,
  Scale,
  Flag,
  FileCheck,
  Eye
} from 'lucide-react';

const compliance = [
  {
    title: 'Information Technology Act, 2000',
    description: 'Full compliance with Indian IT laws and digital signature regulations',
    icon: <FileText className="w-8 h-8" />,
    details: [
      'Section 3: Electronic Records and Digital Signatures',
      'Section 4: Legal Recognition of Electronic Records',
      'Section 5: Legal Recognition of Digital Signatures',
      'Section 85: Electronic Signature Certificates',
      'Compliance with IT Amendment Act 2008'
    ],
    authority: 'Ministry of Electronics & IT, Government of India'
  },
  {
    title: 'Digital Signature Rules, 2000',
    description: 'Adherence to Controller of Certifying Authorities guidelines',
    icon: <FileCheck className="w-8 h-8" />,
    details: [
      'CCA approved Certifying Authority partnership',
      'Class 2 and Class 3 digital certificates support',
      'PKI infrastructure compliance',
      'Certificate revocation list maintenance',
      'Time stamping authority integration'
    ],
    authority: 'Controller of Certifying Authorities (CCA)'
  },
  {
    title: 'Indian Evidence Act, 1872',
    description: 'Digital documents admissible as evidence in Indian courts',
    icon: <Scale className="w-8 h-8" />,
    details: [
      'Section 65A: Admissibility of electronic records',
      'Section 65B: Electronic record production',
      'Section 67A: Digital signature proof',
      'Section 85A: Digital signature presumption',
      'Section 88A: Electronic agreements'
    ],
    authority: 'Supreme Court of India'
  },
  {
    title: 'Personal Data Protection',
    description: 'Data privacy and protection compliance',
    icon: <Lock className="w-8 h-8" />,
    details: [
      'Digital Personal Data Protection Act, 2023 ready',
      'Data minimization principles',
      'Consent management framework',
      'Data breach notification procedures',
      'Cross-border data transfer compliance'
    ],
    authority: 'Data Protection Board of India'
  },
  {
    title: 'ISO 27001:2013',
    description: 'Information Security Management System certification',
    icon: <Shield className="w-8 h-8" />,
    details: [
      'Information security policies',
      'Risk assessment and management',
      'Security incident management',
      'Business continuity planning',
      'Regular security audits'
    ],
    authority: 'International Organization for Standardization'
  },
  {
    title: 'RBI Guidelines',
    description: 'Reserve Bank of India compliance for financial transactions',
    icon: <Building className="w-8 h-8" />,
    details: [
      'Digital payment security standards',
      'KYC (Know Your Customer) compliance',
      'AML (Anti-Money Laundering) procedures',
      'Payment and Settlement Systems Act compliance',
      'NPCI guidelines adherence'
    ],
    authority: 'Reserve Bank of India'
  }
];

const certifications = [
  {
    title: 'CCA Approved',
    description: 'Certified by Controller of Certifying Authorities',
    icon: <Award className="w-6 h-6" />
  },
  {
    title: 'ISO 27001 Certified',
    description: 'Information Security Management System',
    icon: <Shield className="w-6 h-6" />
  },
  {
    title: 'SOC 2 Type II',
    description: 'Service Organization Control audit certification',
    icon: <Eye className="w-6 h-6" />
  },
  {
    title: 'GDPR Compliant',
    description: 'European data protection regulation compliance',
    icon: <Globe className="w-6 h-6" />
  }
];

const auditReports = [
  {
    title: 'Security Audit Report 2024',
    date: 'January 2024',
    authority: 'CERT-In Empanelled Auditor',
    status: 'Passed'
  },
  {
    title: 'IT Act Compliance Audit',
    date: 'December 2023',
    authority: 'CCA Approved Auditor',
    status: 'Certified'
  },
  {
    title: 'Data Protection Assessment',
    date: 'November 2023',
    authority: 'Independent Privacy Consultant',
    status: 'Compliant'
  }
];

export default function CompliancePage() {
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
              IT Act 2000 Compliance
              <br />
              <span className="text-2xl lg:text-3xl font-medium text-blue-200">
                आईटी अधिनियम 2000 अनुपालन
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg lg:text-xl mb-12 max-w-4xl mx-auto text-blue-100"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Our digital notarization platform is fully compliant with Indian laws and 
              international security standards, ensuring legal validity and security.
            </motion.p>
            
            <motion.div 
              className="flex justify-center items-center space-x-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Flag className="w-8 h-8 text-orange-400" />
              <span className="text-xl font-semibold">Government Certified Platform</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Compliance Details */}
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
              Legal Compliance Framework / कानूनी अनुपालन ढांचा
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive compliance with Indian and international laws
            </p>
          </motion.div>

          <div className="space-y-8">
            {compliance.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg p-8 border border-gray-200"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    <div className="flex items-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white mr-4">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm font-semibold text-blue-800 mb-1">Regulatory Authority</p>
                      <p className="text-sm text-blue-700">{item.authority}</p>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-2">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Compliance Details</h4>
                    <ul className="space-y-3">
                      {item.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start text-gray-700">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
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
              Certifications & Standards / प्रमाणन और मानक
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Industry-leading certifications for security and compliance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg p-6 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  {cert.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{cert.title}</h3>
                <p className="text-gray-600">{cert.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Audit Reports */}
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
              Audit Reports / ऑडिट रिपोर्ट
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Regular third-party audits ensure continuous compliance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {auditReports.map((report, index) => (
              <motion.div
                key={report.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{report.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    report.status === 'Passed' || report.status === 'Certified' || report.status === 'Compliant'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{report.authority}</p>
                <p className="text-sm text-gray-500">{report.date}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-r from-blue-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Compliance Inquiries / अनुपालन पूछताछ
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
              For detailed compliance documentation or audit reports, contact our legal team
            </p>
            <div className="space-y-4">
              <p className="text-lg">
                <strong>Email:</strong> compliance@digitalnotary.gov.in
              </p>
              <p className="text-lg">
                <strong>Legal Department:</strong> +91-11-2345-6789
              </p>
            </div>
            <div className="mt-8">
              <Link href="/contact">
                <motion.button
                  className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Legal Team
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
