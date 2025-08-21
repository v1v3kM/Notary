'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CheckCircle, AlertCircle, Info } from 'lucide-react'

interface DiagnosticResults {
  database?: Record<string, unknown>
  signin?: Record<string, unknown>
  session?: Record<string, unknown>
}

export default function DiagnosticsPage() {
  const [results, setResults] = useState<DiagnosticResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [testPassword, setTestPassword] = useState('')

  const runDatabaseTest = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-db')
      const data = await response.json()
      setResults({ ...results, database: data })
    } catch {
      setResults({ ...results, database: { error: 'Failed to test database' } })
    }
    setLoading(false)
  }

  const testSignIn = async () => {
    if (!testEmail || !testPassword) {
      alert('Please enter email and password')
      return
    }

    setLoading(true)
    try {
      console.log('Testing signin with:', testEmail)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      })

      const result = {
        success: !error,
        error: error ? {
          message: error.message,
          status: error.status || 'unknown',
          name: error.name || 'unknown'
        } : null,
        user: data.user ? {
          id: data.user.id,
          email: data.user.email,
          emailConfirmed: data.user.email_confirmed_at,
          lastSignIn: data.user.last_sign_in_at
        } : null
      }

      setResults({ ...results, signin: result })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setResults({ 
        ...results, 
        signin: { 
          success: false, 
          error: { message: errorMessage } 
        } 
      })
    }
    setLoading(false)
  }

  const testSession = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.getSession()
      setResults({ 
        ...results, 
        session: { 
          hasSession: !!data.session,
          user: data.session?.user || null,
          error: error?.message || null
        } 
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setResults({ 
        ...results, 
        session: { error: errorMessage } 
      })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">🔧 Authentication Diagnostics</h1>
          
          {/* Database Test */}
          <div className="mb-8 p-6 border border-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Database Status</h2>
            <button 
              onClick={runDatabaseTest}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-4"
            >
              {loading ? 'Testing...' : 'Test Database Connection'}
            </button>
            
            {results?.database && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
                  {JSON.stringify(results.database, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Session Test */}
          <div className="mb-8 p-6 border border-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Current Session</h2>
            <button 
              onClick={testSession}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 mb-4"
            >
              {loading ? 'Checking...' : 'Check Current Session'}
            </button>
            
            {results?.session && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
                  {JSON.stringify(results.session, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Sign In Test */}
          <div className="mb-8 p-6 border border-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Test Sign In</h2>
            <div className="space-y-4 mb-4">
              <input
                type="email"
                placeholder="Test email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Test password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={testSignIn}
                disabled={loading}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test Sign In'}
              </button>
            </div>
            
            {results?.signin && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
                  {JSON.stringify(results.signin, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="/auth/signup" 
              className="block p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 text-center"
            >
              <Info className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <span className="text-blue-800 font-medium">Signup Page</span>
            </a>
            <a 
              href="/auth/login" 
              className="block p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 text-center"
            >
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <span className="text-green-800 font-medium">Login Page</span>
            </a>
            <a 
              href="/api/test-db" 
              target="_blank"
              className="block p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 text-center"
            >
              <AlertCircle className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <span className="text-purple-800 font-medium">Database API</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
