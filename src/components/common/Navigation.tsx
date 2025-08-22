'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import Image from 'next/image';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Top Government Bar */}
      <div className="bg-gradient-to-r from-orange-500 to-green-600 text-white py-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <span className="font-medium">Government of India</span>
              <span className="text-orange-100">|</span>
              <span>Digital Notary Services</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="#" className="hover:text-orange-200 flex items-center space-x-1">
                <Globe className="w-3 h-3" />
                <span>हिंदी</span>
              </Link>
              <span className="text-orange-100">|</span>
              <span className="text-xs">Last Updated: {new Date().toLocaleDateString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white shadow-lg border-b-2 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Government Logo Section */}
            <Link href="/" className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                {/* Ashoka Chakra styled logo */}
                <div className="relative">
                  <Image 
                    src="/logo.png" 
                    alt="Digital Notary Platform - Government of India"
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full border-2 border-orange-500"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-800 leading-tight">Digital Notary Platform</span>
                  <span className="text-xs text-orange-600 font-medium">Government of India</span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/services" className="text-gray-700 hover:text-orange-600 font-medium border-b-2 border-transparent hover:border-orange-500 pb-1 transition-all duration-200">
                Services
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-orange-600 font-medium border-b-2 border-transparent hover:border-orange-500 pb-1 transition-all duration-200">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-orange-600 font-medium border-b-2 border-transparent hover:border-orange-500 pb-1 transition-all duration-200">
                Contact
              </Link>
              <div className="bg-gradient-to-r from-orange-500 to-green-600 text-white px-6 py-2 rounded-md hover:from-orange-600 hover:to-green-700 transition-all duration-200 shadow-md">
                <Link href="/auth/login" className="font-medium">
                  Citizen Login
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:text-orange-600 bg-gray-50 p-2 rounded-md"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden border-t border-orange-200 bg-gray-50">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link href="/services" className="block px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md font-medium">
                  Services
                </Link>
                <Link href="/about" className="block px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md font-medium">
                  About
                </Link>
                <Link href="/contact" className="block px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md font-medium">
                  Contact
                </Link>
                <Link href="/auth/login" className="block px-4 py-3 bg-gradient-to-r from-orange-500 to-green-600 text-white rounded-md font-medium text-center mt-4">
                  Citizen Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}