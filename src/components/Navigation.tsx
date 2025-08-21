'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Menu, 
  X, 
  User, 
  LogOut,
  ChevronDown,
  Flag
} from 'lucide-react';

const navItems = [
  { name: 'Home / होम', href: '/' },
  { name: 'About / परिचय', href: '/about' },
  { name: 'Services / सेवाएं', href: '/pricing' },
  { name: 'Templates / टेम्प्लेट', href: '/templates' },
  { name: 'Features / फीचर्स', href: '/features' },
  { name: 'Lawyers / वकील', href: '/lawyers' },
  { name: 'Notifications / सूचनाएं', href: '/notifications' },
  { name: 'Help / सहायता', href: '/help' },
  { name: 'Contact / संपर्क', href: '/contact' }
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    signOut();
    setUserMenuOpen(false);
  };

  return (
    <>
      {/* Government Header Bar */}
      <div className="bg-gradient-to-r from-orange-500 via-white to-green-500 h-1"></div>
      
      {/* Government Identity Bar */}
      <div className="bg-blue-900 text-white py-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center text-xs font-medium">
            <Flag className="w-3 h-3 mr-2" />
            Government of India • भारत सरकार • Ministry of Electronics & IT
          </div>
        </div>
      </div>
      
      <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Company Logo */}
            <Link href="/" className="flex items-center space-x-4">
              <motion.div
                className="w-16 h-16 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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
                <span className="text-2xl font-bold text-blue-900">Digital Notary</span>
                <span className="text-sm text-gray-600 font-medium">डिजिटल नोटरी सेवा</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-sm border-b-2 border-transparent hover:border-orange-500 pb-1"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* User Menu or Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 bg-gray-50 px-4 py-2 rounded-lg border"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">{user.email}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200"
                    >
                      <Link
                        href="/dashboard"
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-b border-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Dashboard / डैशबोर्ड
                      </Link>
                      <Link
                        href="/versions"
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-b border-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Document Versions / डॉक्यूमेंट वर्जन
                      </Link>
                      <Link
                        href="/profile"
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-b border-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Profile / प्रोफ़ाइल
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                      >
                        <LogOut className="w-4 h-4 inline mr-2" />
                        Sign Out / साइन आउट
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/auth/login"
                    className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium px-4 py-2 border border-gray-300 rounded-lg hover:border-blue-500"
                  >
                    Sign In / साइन इन
                  </Link>
                  <Link href="/get-started">
                    <motion.button
                      className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 border-2 border-orange-600"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Get Started / शुरू करें
                    </motion.button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 p-2 rounded-lg border border-gray-300"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg"
            >
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 font-medium px-4 py-3 rounded-lg mx-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {user ? (
                  <div className="pt-4 border-t border-gray-200 space-y-2 mx-2">
                    <div className="flex items-center space-x-2 text-gray-700 px-4 py-2 bg-white rounded-lg">
                      <User className="w-5 h-5" />
                      <span className="font-medium">{user.email}</span>
                    </div>
                    <Link
                      href="/dashboard"
                      className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 px-4 py-3 rounded-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard / डैशबोर्ड
                    </Link>
                    <Link
                      href="/versions"
                      className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 px-4 py-3 rounded-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      Document Versions / डॉक्यूमेंट वर्जन
                    </Link>
                    <Link
                      href="/profile"
                      className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 px-4 py-3 rounded-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      Profile / प्रोफ़ाइल
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 px-4 py-3 rounded-lg w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out / साइन आउट</span>
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-gray-200 space-y-2 mx-2">
                    <Link
                      href="/auth/login"
                      className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 font-medium px-4 py-3 rounded-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In / साइन इन
                    </Link>
                    <Link href="/get-started" onClick={() => setIsOpen(false)}>
                      <button className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-lg font-medium">
                        Get Started / शुरू करें
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </nav>
    </>
  );
}
