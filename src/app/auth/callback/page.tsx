'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, AlertCircle, Loader, Mail, LogIn } from 'lucide-react'
import { supabase } from '@/lib/supabase'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [requestingNewEmail, setRequestingNewEmail] = useState(false)
  const [resendResult, setResendResult] = useState('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check for error parameters in URL
        const error = searchParams.get('error')
        const errorCode = searchParams.get('error_code')
        const errorDescription = searchParams.get('error_description')

        if (error) {
          console.error('Auth callback error:', { error, errorCode, errorDescription })
          
          if (errorCode === 'otp_expired') {
            setStatus('error')
            setMessage('Verification link has expired. Please request a new verification email.')
            return
          }
          
          setStatus('error')
          setMessage(errorDescription || 'Authentication failed. Please try again.')
          return
        }

        // Handle successful auth callback
        const { data, error: authError } = await supabase.auth.getSession()
        
        if (authError) {
          console.error('Session error:', authError)
          setStatus('error')
          setMessage('Failed to verify authentication. Please try signing in.')
          return
        }

        if (data.session) {
          console.log('Authentication successful:', data.session.user.email)
          setStatus('success')
          setMessage('Email verified successfully! Redirecting to dashboard...')
          
          // Redirect to dashboard after success
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
        } else {
          setStatus('error')
          setMessage('No session found. Please try signing in again.')
        }
      } catch (err) {
        console.error('Auth callback error:', err)
        setStatus('error')
        setMessage('An unexpected error occurred during verification.')
      }
    }

    handleAuthCallback()
  }, [searchParams, router])

  const handleResendVerification = async () => {
    if (!email) {
      setResendResult('Please enter your email address first.')
      return
    }

    setRequestingNewEmail(true)
    setResendResult('')

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        setResendResult(`Error: ${error.message}`)
      } else {
        setResendResult('✅ New verification email sent! Please check your inbox.')
      }
    } catch (err) {
      setResendResult('Failed to send verification email. Please try again.')
    } finally {
      setRequestingNewEmail(false)
    }
  }

  const handleTrySignIn = () => {
    // Redirect to login page
    router.push('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          {status === 'loading' && (
            <div className="flex flex-col items-center">
              <Loader className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <h2 className="text-xl font-semibold text-gray-800">Verifying your email...</h2>
            </div>
          )}
          
          {status === 'success' && (
            <div className="flex flex-col items-center">
              <CheckCircle className="w-12 h-12 text-green-600 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800">Email Verified!</h2>
            </div>
          )}
          
          {status === 'error' && (
            <div className="flex flex-col items-center">
              <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800">Verification Failed</h2>
            </div>
          )}
        </div>

        <p className="text-gray-600 mb-6">{message}</p>

        {status === 'error' && (
          <div className="space-y-4">
            {/* Email input for resending verification */}
            <div className="text-left">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email to resend verification"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Resend result message */}
            {resendResult && (
              <div className={`p-3 rounded-lg text-sm ${
                resendResult.startsWith('✅') 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {resendResult}
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={handleResendVerification}
                disabled={requestingNewEmail || !email}
                className="flex items-center justify-center w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Mail className="w-4 h-4 mr-2" />
                {requestingNewEmail ? 'Sending...' : 'Request New Verification Email'}
              </button>

              <Link
                href="/auth/resend"
                className="flex items-center justify-center w-full bg-blue-100 text-blue-700 py-2 px-4 rounded-lg font-medium hover:bg-blue-200 transition-colors text-sm"
              >
                <Mail className="w-4 h-4 mr-2" />
                Go to Resend Page
              </Link>
              
              <button
                onClick={handleTrySignIn}
                className="flex items-center justify-center w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Try Signing In
              </button>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm">
              Your account has been verified! You will be redirected to the dashboard shortly.
            </p>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-8 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="flex flex-col items-center">
            <Loader className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-gray-800">Loading...</h2>
          </div>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
