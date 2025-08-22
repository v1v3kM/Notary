'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/database/supabase';
import { motion } from 'framer-motion';
import Link from 'next/link';
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

function EmailConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Check if user came from email link
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          setStatus('error');
          setMessage('Failed to verify email. Please try again.');
          return;
        }

        if (data.session?.user) {
          if (data.session.user.email_confirmed_at) {
            setStatus('success');
            setMessage('Your email has been successfully verified! You can now sign in to your account.');
            
            // Redirect to signin after 3 seconds
            setTimeout(() => {
              router.push('/auth/signin');
            }, 3000);
          } else {
            setStatus('error');
            setMessage('Email verification is still pending. Please check your email.');
          }
        } else {
          // Check for token and type in URL params
          const access_token = searchParams.get('access_token');
          const refresh_token = searchParams.get('refresh_token');
          const type = searchParams.get('type');

          if (access_token && refresh_token && type === 'signup') {
            // Set the session
            const { error: sessionError } = await supabase.auth.setSession({
              access_token,
              refresh_token
            });

            if (sessionError) {
              console.error('Session error:', sessionError);
              setStatus('error');
              setMessage('Failed to confirm email. Please try again.');
            } else {
              setStatus('success');
              setMessage('Your email has been successfully verified! You can now sign in to your account.');
              
              // Redirect to signin after 3 seconds
              setTimeout(() => {
                router.push('/auth/signin');
              }, 3000);
            }
          } else {
            setStatus('error');
            setMessage('Invalid verification link. Please request a new verification email.');
          }
        }
      } catch (error) {
        console.error('Email confirmation error:', error);
        setStatus('error');
        setMessage('An error occurred during verification. Please try again.');
      }
    };

    handleEmailConfirmation();
  }, [router, searchParams]);

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

export default function EmailConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <EmailConfirmationContent />
    </Suspense>
  );
}
