'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CheckCircle, AlertCircle, User, Key } from 'lucide-react'

export default function ManualConfirm() {
  const [email, setEmail] = useState('vivekmaurya3421@gmail.com')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  const confirmUserManually = async () => {
    setLoading(true)
    setResult('')

    try {
      // First, try to get the user from auth.users
      const { data: users, error: listError } = await supabase.auth.admin.listUsers()
      
      if (listError) {
        setResult(`❌ Error accessing users: ${listError.message}`)
        return
      }

      const user = users.users.find(u => u.email === email)
      
      if (!user) {
        setResult(`❌ User not found with email: ${email}`)
        return
      }

      if (user.email_confirmed_at) {
        setResult(`✅ User ${email} is already confirmed!`)
        return
      }

      // Manual confirmation using admin API
      const { error: confirmError } = await supabase.auth.admin.updateUserById(
        user.id,
        { email_confirm: true }
      )

      if (confirmError) {
        setResult(`❌ Failed to confirm user: ${confirmError.message}`)
      } else {
        setResult(`✅ Successfully confirmed user: ${email}`)
      }

    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const createUserWithoutVerification = async () => {
    setLoading(true)
    setResult('')

    try {
      // Create user with email confirmation disabled
      const { error } = await supabase.auth.admin.createUser({
        email: email,
        password: 'tempPassword123!',
        email_confirm: true, // This bypasses email confirmation
        user_metadata: {
          name: 'Manual User'
        }
      })

      if (error) {
        setResult(`❌ Failed to create user: ${error.message}`)
      } else {
        setResult(`✅ Created confirmed user: ${email}\n🔑 Temporary password: tempPassword123!\n⚠️ Please change password after login`)
      }

    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const resetUserPassword = async () => {
    setLoading(true)
    setResult('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) {
        setResult(`❌ Failed to send reset email: ${error.message}`)
      } else {
        setResult(`✅ Password reset email sent to: ${email}`)
      }

    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2">Manual User Management</h1>
          <p className="text-gray-600 mb-8">
            Manually confirm users or create pre-verified accounts when email delivery fails.
          </p>

          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                User Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter user email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={confirmUserManually}
                disabled={loading || !email}
                className="flex items-center justify-center bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {loading ? 'Confirming...' : 'Confirm Existing User'}
              </button>

              <button
                onClick={createUserWithoutVerification}
                disabled={loading || !email}
                className="flex items-center justify-center bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <User className="w-4 h-4 mr-2" />
                {loading ? 'Creating...' : 'Create Confirmed User'}
              </button>

              <button
                onClick={resetUserPassword}
                disabled={loading || !email}
                className="flex items-center justify-center bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                <Key className="w-4 h-4 mr-2" />
                {loading ? 'Sending...' : 'Send Password Reset'}
              </button>
            </div>

            {/* Result Display */}
            {result && (
              <div className={`p-4 rounded-lg border ${
                result.startsWith('✅') 
                  ? 'bg-green-50 text-green-800 border-green-200' 
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}>
                <div className="flex items-start">
                  {result.startsWith('✅') ? (
                    <CheckCircle className="w-5 h-5 mr-2 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 mr-2 mt-0.5" />
                  )}
                  <pre className="text-sm whitespace-pre-wrap">{result}</pre>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">How to Use:</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li><strong>Confirm Existing User:</strong> For users who signed up but didn't get verification email</li>
                <li><strong>Create Confirmed User:</strong> Creates a new user that's already verified</li>
                <li><strong>Send Password Reset:</strong> Sends password reset email (might work better than signup emails)</li>
              </ul>
            </div>

            {/* Quick Solutions */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">⚡ Quick Solutions:</h3>
              <ol className="text-yellow-700 text-sm space-y-1">
                <li>1. <strong>Best Fix:</strong> Disable email confirmation in Supabase Dashboard</li>
                <li>2. <strong>For existing users:</strong> Use "Confirm Existing User" button above</li>
                <li>3. <strong>For new users:</strong> Use "Create Confirmed User" button above</li>
                <li>4. <strong>Alternative:</strong> Use password reset (sometimes works better)</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
