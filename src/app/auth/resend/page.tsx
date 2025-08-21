'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ResendVerification() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' })

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setResult({ type: 'error', message: 'Please enter your email address.' })
      return
    }

    setLoading(true)
    setResult({ type: '', message: '' })

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        if (error.message.includes('rate limit')) {
          setResult({ 
            type: 'error', 
            message: 'Too many requests. Please wait a few minutes before requesting another verification email.' 
          })
        } else if (error.message.includes('not found')) {
          setResult({ 
            type: 'error', 
            message: 'No account found with this email. Please sign up first or check your email address.' 
          })
        } else {
          setResult({ type: 'error', message: error.message })
        }
      } else {
        setResult({ 
          type: 'success', 
          message: 'Verification email sent! Please check your inbox and click the verification link.' 
        })
      }
    } catch {
      setResult({ 
        type: 'error', 
        message: 'Failed to send verification email. Please try again later.' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Resend Verification</h1>
          <p className="text-gray-600 mt-2">
            Enter your email to receive a new verification link
          </p>
        </div>

        <form onSubmit={handleResend} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Result message */}
          {result.message && (
            <div className={`p-4 rounded-lg border ${
              result.type === 'success' 
                ? 'bg-green-50 text-green-800 border-green-200' 
                : 'bg-red-50 text-red-800 border-red-200'
            }`}>
              <div className="flex items-center">
                {result.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 mr-2" />
                ) : (
                  <AlertCircle className="w-5 h-5 mr-2" />
                )}
                <span className="text-sm">{result.message}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Send Verification Email
              </>
            )}
          </button>
        </form>

        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-center space-x-4 text-sm">
            <Link 
              href="/auth/login" 
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              Try Signing In
            </Link>
            <span className="text-gray-300">|</span>
            <Link 
              href="/auth/signup" 
              className="text-green-600 hover:text-green-700 hover:underline"
            >
              Create Account
            </Link>
          </div>
          
          <div className="text-center">
            <Link 
              href="/" 
              className="inline-flex items-center text-gray-600 hover:text-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Home
            </Link>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Having trouble?</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Check your spam/junk folder</li>
            <li>• Make sure the email address is correct</li>
            <li>• Wait a few minutes between requests</li>
            <li>• Contact support if issues persist</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
