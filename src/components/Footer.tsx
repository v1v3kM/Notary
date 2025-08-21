'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Flag, Award, Shield } from 'lucide-react';

const footerSections = [
  {
    title: 'Services / सेवाएं',
    links: [
      { name: 'Real Estate / अचल संपत्ति', href: '/services/real-estate' },
      { name: 'Legal Documents / कानूनी दस्तावेज', href: '/services/legal' },
      { name: 'Business Documents / व्यावसायिक दस्तावेज', href: '/services/business' },
      { name: 'Government Documents / सरकारी दस्तावेज', href: '/services/government' }
    ]
  },
  {
    title: 'Information / जानकारी',
    links: [
      { name: 'About Us / हमारे बारे में', href: '/about' },
      { name: 'Pricing / मूल्य निर्धारण', href: '/pricing' },
      { name: 'Contact / संपर्क', href: '/contact' },
      { name: 'Help / सहायता', href: '/help' }
    ]
  },
  {
    title: 'Legal / कानूनी',
    links: [
      { name: 'Privacy Policy / गोपनीयता नीति', href: '/privacy' },
      { name: 'Terms of Service / सेवा की शर्तें', href: '/terms' },
      { name: 'IT Act 2000 Compliance', href: '/compliance' },
      { name: 'Digital Signature Rules', href: '/digital-signature' }
    ]
  },
  {
    title: 'Government Links / सरकारी लिंक',
    links: [
      { name: 'Digital India Portal', href: 'https://digitalindia.gov.in' },
      { name: 'CCA (Controller of Certifying Authorities)', href: 'https://cca.gov.in' },
      { name: 'Ministry of Electronics & IT', href: 'https://meity.gov.in' },
      { name: 'e-Governance Portal', href: 'https://www.india.gov.in' }
    ]
  }
];

const contactInfo = [
  {
    icon: <Mail className="w-5 h-5" />,
    label: 'Email / ईमेल',
    value: 'support@digitalnotary.gov.in',
    href: 'mailto:support@digitalnotary.gov.in'
  },
  {
    icon: <Phone className="w-5 h-5" />,
    label: 'Helpline / हेल्पलाइन',
    value: '1800-11-1234 (Toll Free)',
    href: 'tel:+918001111234'
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    label: 'Address / पता',
    value: 'Ministry of Electronics & IT, Electronics Niketan, CGO Complex, New Delhi - 110003',
    href: '#'
  }
];

const certifications = [
  {
    icon: <Shield className="w-6 h-6" />,
    text: 'IT Act 2000 Compliant'
  },
  {
    icon: <Award className="w-6 h-6" />,
    text: 'CCA Approved'
  },
  {
    icon: <Flag className="w-6 h-6" />,
    text: 'Government Certified'
  }
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Government Identity Strip */}
      <div className="bg-gradient-to-r from-orange-500 via-white to-green-500 h-1"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link href="/" className="flex items-center space-x-4 mb-6">
                <motion.div
                  className="w-16 h-16 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <Image 
                    src="/logo.png" 
                    alt="Company Logo"
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </motion.div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">Digital Notary</span>
                  <span className="text-base text-gray-400">डिजिटल नोटरी सेवा</span>
                </div>
              </Link>
              
              <p className="text-gray-400 mb-6 leading-relaxed text-sm">
                Government of India&apos;s official digital notarization service under the 
                Ministry of Electronics & Information Technology. Secure, legally compliant, 
                and accessible digital notarization for all citizens.
              </p>
              
              <p className="text-gray-400 mb-6 leading-relaxed text-sm">
                भारत सरकार की आधिकारिक डिजिटल नोटरी सेवा। सुरक्षित, कानूनी रूप से 
                अनुपालित और सभी नागरिकों के लिए सुलभ।
              </p>

              {/* Government Certifications */}
              <div className="grid grid-cols-1 gap-3 mb-6">
                {certifications.map((cert, index) => (
                  <motion.div
                    key={cert.text}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3 text-blue-400"
                  >
                    {cert.icon}
                    <span className="text-sm">{cert.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-start space-x-3 text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      <div className="text-blue-400 mt-1">
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">{item.label}</div>
                        <div className="text-sm">{item.value}</div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section, sectionIndex) => (
            <div key={section.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold mb-6 text-blue-300">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: (sectionIndex * 0.1) + (linkIndex * 0.05), duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white hover:text-orange-300 transition-colors duration-200 text-sm border-b border-transparent hover:border-orange-300 pb-1"
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {link.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Government Notice Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-gray-800"
        >
          <div className="bg-blue-900 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Flag className="w-6 h-6 text-orange-400" />
              <h3 className="text-lg font-semibold text-white">Government Notice / सरकारी सूचना</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              This service is provided by the Government of India under the Information Technology Act, 2000. 
              All digital certificates are issued by Controller of Certifying Authorities (CCA) approved 
              Certification Authorities. The digital signatures have legal validity as per Indian law.
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              यह सेवा भारत सरकार द्वारा सूचना प्रौद्योगिकी अधिनियम, 2000 के तहत प्रदान की जाती है। 
              सभी डिजिटल प्रमाणपत्र नियंत्रक प्रमाणन प्राधिकरण (CCA) द्वारा अनुमोदित हैं।
            </p>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-gray-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm text-center md:text-left">
              <div>© 2024 Government of India • भारत सरकार • All rights reserved</div>
              <div className="text-xs mt-1">Ministry of Electronics & Information Technology</div>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-orange-300 text-sm transition-colors duration-200">
                Privacy / गोपनीयता
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-orange-300 text-sm transition-colors duration-200">
                Terms / शर्तें
              </Link>
              <Link href="/accessibility" className="text-gray-400 hover:text-orange-300 text-sm transition-colors duration-200">
                Accessibility / पहुंच
              </Link>
            </div>
          </div>
          
          {/* National Emblem */}
          <div className="flex justify-center mt-8">
            <div className="bg-gradient-to-r from-orange-500 via-white to-green-500 h-1 w-32 rounded"></div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
