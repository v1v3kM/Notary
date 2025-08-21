'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Mail,
  Shield,
  Home,
  ArrowRight,
  User
} from 'lucide-react';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. Please request a new verification email.');
      return;
    }

    // Verify email with API
    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setStatus('success');
          setMessage('Your email has been successfully verified! You can now sign in to your account.');
        } else if (response.status === 400 && data.error?.includes('expired')) {
          setStatus('expired');
          setMessage('This verification link has expired. Please request a new one.');
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed. Please try again or contact support.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('An error occurred during verification. Please try again.');
      }
    };

    verifyEmail();
  }, [searchParams]);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <RefreshCw className="w-12 h-12 text-blue-600 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-600" />;
      case 'error':
      case 'expired':
        return <AlertCircle className="w-12 h-12 text-red-600" />;
      default:
        return <Mail className="w-12 h-12 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'from-blue-500 to-purple-500';
      case 'success':
        return 'from-green-500 to-emerald-500';
      case 'error':
      case 'expired':
        return 'from-red-500 to-orange-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'loading':
        return 'Verifying Your Email...';
      case 'success':
        return 'Email Verified Successfully!';
      case 'expired':
        return 'Verification Link Expired';
      case 'error':
        return 'Verification Failed';
      default:
        return 'Email Verification';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-lg text-center"
        >
          {/* Status Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`w-20 h-20 bg-gradient-to-r ${getStatusColor()} rounded-full flex items-center justify-center mx-auto mb-6`}
          >
            <div className="bg-white rounded-full p-2">
              {getStatusIcon()}
            </div>
          </motion.div>

          {/* Status Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-2xl font-bold text-gray-900 mb-4"
          >
            {getStatusTitle()}
          </motion.h1>

          {/* Status Message */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-gray-600 mb-8"
          >
            {message}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="space-y-4"
          >
            {status === 'success' && (
              <div className="space-y-3">
                <Link href="/auth/signin">
                  <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Sign In to Your Account</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
                <Link href="/dashboard">
                  <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                    <Home className="w-5 h-5" />
                    <span>Go to Dashboard</span>
                  </button>
                </Link>
              </div>
            )}

            {(status === 'error' || status === 'expired') && (
              <div className="space-y-3">
                <Link href="/auth/resend-verification">
                  <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                    <Mail className="w-5 h-5" />
                    <span>Request New Verification</span>
                  </button>
                </Link>
                <Link href="/auth/signin">
                  <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                    Try Signing In
                  </button>
                </Link>
              </div>
            )}

            {status === 'loading' && (
              <div className="text-center">
                <p className="text-sm text-gray-500">Please wait while we verify your email...</p>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Additional Info */}
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4"
          >
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-800 mb-1">Account Secured</h3>
                <p className="text-sm text-green-700">
                  Your account is now fully verified and secure. You can access all platform features.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Help Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-6 text-center"
        >
          <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-700">
            Need help? Contact our support team
          </Link>
        </motion.div>

        {/* Home Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="mt-4 text-center"
        >
          <Link href="/" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 text-sm">
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
