'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft, Loader } from 'lucide-react'
import { supabase } from '@/lib/supabase'

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' })
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    // Extract access token from URL hash or query params
    const code = searchParams.get('code')
    const token = searchParams.get('access_token')
    
    if (code) {
      // Exchange code for session
      handleCodeExchange(code)
    } else if (token) {
      setAccessToken(token)
    } else {
      setResult({ type: 'error', message: 'Invalid reset link. Please request a new password reset.' })
    }
  }, [searchParams])

  const handleCodeExchange = async (code: string) => {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        setResult({ type: 'error', message: `Invalid or expired reset link: ${error.message}` })
      } else if (data.session) {
        setAccessToken(data.session.access_token)
        setResult({ type: 'success', message: 'Reset link verified! Please enter your new password below.' })
      }
    } catch {
      setResult({ type: 'error', message: 'Failed to verify reset link. Please try again.' })
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!password || !confirmPassword) {
      setResult({ type: 'error', message: 'Please fill in all fields.' })
      return
    }

    if (password !== confirmPassword) {
      setResult({ type: 'error', message: 'Passwords do not match.' })
      return
    }

    if (password.length < 6) {
      setResult({ type: 'error', message: 'Password must be at least 6 characters long.' })
      return
    }

    if (!accessToken) {
      setResult({ type: 'error', message: 'Invalid session. Please request a new password reset.' })
      return
    }

    setLoading(true)
    setResult({ type: '', message: '' })

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        setResult({ type: 'error', message: error.message })
      } else {
        setResult({ type: 'success', message: 'Password updated successfully! Redirecting to login...' })
        
        // Redirect to login after success
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      }
    } catch {
      setResult({ type: 'error', message: 'Failed to update password. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-600 mt-2">
            Enter your new password below
          </p>
        </div>

        {/* Result message */}
        {result.message && (
          <div className={`p-4 rounded-lg border mb-6 ${
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

        {accessToken && result.type !== 'error' ? (
          <form onSubmit={handlePasswordReset} className="space-y-6">
            {/* New Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !password || !confirmPassword}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating Password...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Update Password
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              {result.type === 'error' ? 'Unable to process reset request.' : 'Verifying reset link...'}
            </p>
            <div className="flex flex-col space-y-2">
              <Link 
                href="/auth/resend"
                className="text-blue-600 hover:text-blue-700 hover:underline"
              >
                Request New Password Reset
              </Link>
              <Link 
                href="/auth/login"
                className="text-gray-600 hover:text-gray-700 hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
        </div>

        {/* Security Note */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            🔒 For security, this reset link can only be used once and will expire soon.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ResetPassword() {
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
      <ResetPasswordContent />
    </Suspense>
  )
}
