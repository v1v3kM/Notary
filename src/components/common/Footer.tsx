'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Shield, ExternalLink } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-800 to-gray-900 text-white">
      {/* Government Identity Bar */}
      <div className="bg-gradient-to-r from-orange-600 to-green-600 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <div className="flex items-center space-x-2 mb-2 md:mb-0">
              <Shield className="w-4 h-4" />
              <span className="font-medium">Certified by Government of India</span>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <Link href="#" className="hover:text-orange-200 flex items-center space-x-1">
                <ExternalLink className="w-3 h-3" />
                <span>NIC Portal</span>
              </Link>
              <span>|</span>
              <Link href="#" className="hover:text-orange-200">Digital India</Link>
              <span>|</span>
              <Link href="#" className="hover:text-orange-200">भारत सरकार</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Government Department Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Image 
                  src="/logo.png" 
                  alt="Digital Notary Platform - Government of India"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full border-2 border-orange-500"
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-600 rounded-full"></div>
              </div>
              <div>
                <span className="text-lg font-bold">Digital Notary Platform</span>
                <p className="text-xs text-orange-300">Government of India Initiative</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              An official digital notarization service under the Ministry of Electronics & IT, 
              providing secure and legally compliant document authentication.
            </p>
          </div>

          {/* Government Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-300">Government Services</h3>
            <ul className="space-y-2">
              <li><Link href="/services" className="text-gray-300 hover:text-orange-300 text-sm">Digital Notarization</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-orange-300 text-sm">About Department</Link></li>
              <li><Link href="/pricing" className="text-gray-300 hover:text-orange-300 text-sm">Fee Structure</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-orange-300 text-sm">Citizen Support</Link></li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-300">Legal Framework</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-gray-300 hover:text-orange-300 text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-300 hover:text-orange-300 text-sm">Terms of Service</Link></li>
              <li><Link href="/compliance" className="text-gray-300 hover:text-orange-300 text-sm">IT Act Compliance</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-orange-300 text-sm">RTI Guidelines</Link></li>
            </ul>
          </div>

          {/* Department Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-orange-300">Department Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-orange-400" />
                <span className="text-gray-300 text-sm">support@digitalnotary.gov.in</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-orange-400" />
                <span className="text-gray-300 text-sm">1800-11-4444 (Toll Free)</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-orange-400" />
                <span className="text-gray-300 text-sm">New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Government Footer */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <p className="text-gray-400">
                © 2025 Government of India. All Rights Reserved.
              </p>
              <div className="h-4 w-px bg-gray-600"></div>
              <span className="text-xs text-gray-500">
                Last Updated: {new Date().toLocaleDateString('en-IN')}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <Link href="#" className="hover:text-orange-300">Website Policy</Link>
              <span>|</span>
              <Link href="#" className="hover:text-orange-300">Help</Link>
              <span>|</span>
              <Link href="#" className="hover:text-orange-300">Feedback</Link>
              <span>|</span>
              <Link href="#" className="hover:text-orange-300">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}