'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { 
  Mail, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Clock,
  Shield,
  HelpCircle,
  Home
} from 'lucide-react';

export default function ResendVerificationPage() {
  const [email, setEmail] = useState('vivekmaurya3421@gmail.com');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(true);
  const [error, setError] = useState('');
  const [resendCount, setResendCount] = useState(1);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const handleResendEmail = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (cooldownSeconds > 0) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Use Supabase client-side resend
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      setEmailSent(true);
      setResendCount(prev => prev + 1);
      
      // Set cooldown (60 seconds)
      setCooldownSeconds(60);
      const timer = setInterval(() => {
        setCooldownSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err: unknown) {
      console.error('Email send error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to send verification email. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCooldownTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Resend Verification</h1>
          <p className="text-gray-600">Enter your email to receive a new verification link</p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-lg"
        >
          {/* Success Message */}
          {emailSent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl"
            >
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">Verification email sent!</p>
                  <p className="text-sm text-green-700 mt-1">
                    Please check your inbox and click the verification link.
                  </p>
                  {resendCount > 1 && (
                    <p className="text-xs text-green-600 mt-1">
                      Email sent {resendCount} times
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
            >
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800">Error</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Email Form */}
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email address"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Resend Button */}
            <button
              onClick={handleResendEmail}
              disabled={isLoading || cooldownSeconds > 0}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : cooldownSeconds > 0 ? (
                <>
                  <Clock className="w-5 h-5" />
                  <span>Wait {formatCooldownTime(cooldownSeconds)}</span>
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  <span>Send Verification Email</span>
                </>
              )}
            </button>

            {/* Alternative Actions */}
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center space-x-4 text-sm">
                <Link href="/auth/signin" className="text-blue-600 hover:text-blue-700 font-medium">
                  Try Signing In
                </Link>
                <span className="text-gray-400">|</span>
                <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                  Create Account
                </Link>
              </div>
              
              <Link href="/" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 text-sm">
                <Home className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 bg-white/50 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-gray-900">Having trouble?</h3>
          </div>
          
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Check your spam/junk folder</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Make sure the email address is correct</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Wait a few minutes between requests</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>
                <Link href="/contact" className="text-blue-600 hover:text-blue-700">
                  Contact support
                </Link>
                {' '}if issues persist
              </span>
            </li>
          </ul>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-6 text-center"
        >
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Your information is secure and protected</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
