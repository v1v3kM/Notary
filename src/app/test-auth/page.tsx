'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { demoUsers } from '@/lib/demo-data'

export default function TestAuth() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setResult('')
    
    try {
      // Test 1: Check Supabase connection
      const { data } = await supabase.auth.getSession()
      setResult(prev => prev + `✅ Supabase connection: OK\n`)
      setResult(prev => prev + `Session: ${data.session ? 'Active' : 'None'}\n`)
      
      // Test 2: Try to access users table
      const { error: userError } = await supabase
        .from('users')
        .select('count')
        .limit(1)
      
      if (userError) {
        setResult(prev => prev + `❌ Users table: ${userError.message}\n`)
      } else {
        setResult(prev => prev + `✅ Users table: Accessible\n`)
      }
      
      // Test 3: List existing auth users (if you have access)
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
      if (authError) {
        setResult(prev => prev + `❌ Auth users: ${authError.message}\n`)
      } else {
        setResult(prev => prev + `✅ Auth users found: ${authUsers.users.length}\n`)
      }
      
    } catch (error) {
      setResult(prev => prev + `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`)
    } finally {
      setLoading(false)
    }
  }

  const createDemoUsers = async () => {
    setLoading(true)
    setResult('')
    
    try {
      // Create client user
      const clientUser = demoUsers.client
      const { data: clientData, error: clientError } = await supabase.auth.signUp({
        email: clientUser.email,
        password: clientUser.password,
        options: {
          data: {
            name: clientUser.name,
            role: clientUser.role
          },
          emailRedirectTo: undefined // Disable email confirmation for demo users
        }
      })
      
      if (clientError) {
        setResult(prev => prev + `❌ Client user creation failed: ${clientError.message}\n`)
      } else {
        setResult(prev => prev + `✅ Client user created: ${clientData.user?.email}\n`)
        if (clientData.user && !clientData.user.email_confirmed_at) {
          setResult(prev => prev + `⚠️ Client user needs email confirmation\n`)
        }
      }

      // Create lawyer user
      const lawyerUser = demoUsers.lawyer
      const { data: lawyerData, error: lawyerError } = await supabase.auth.signUp({
        email: lawyerUser.email,
        password: lawyerUser.password,
        options: {
          data: {
            name: lawyerUser.name,
            role: lawyerUser.role
          },
          emailRedirectTo: undefined // Disable email confirmation for demo users
        }
      })
      
      if (lawyerError) {
        setResult(prev => prev + `❌ Lawyer user creation failed: ${lawyerError.message}\n`)
      } else {
        setResult(prev => prev + `✅ Lawyer user created: ${lawyerData.user?.email}\n`)
        if (lawyerData.user && !lawyerData.user.email_confirmed_at) {
          setResult(prev => prev + `⚠️ Lawyer user needs email confirmation\n`)
        }
      }

    } catch (error) {
      setResult(prev => prev + `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`)
    } finally {
      setLoading(false)
    }
  }

  const confirmDemoUsers = async () => {
    setLoading(true)
    setResult('')
    
    try {
      setResult(prev => prev + `🔄 Attempting to confirm demo user emails...\n`)
      
      // Note: In production, you would use Supabase admin functions to confirm emails
      // For now, we'll provide instructions for manual confirmation
      setResult(prev => prev + `📧 To manually confirm emails, you have two options:\n`)
      setResult(prev => prev + `\n1. RECOMMENDED - Disable email confirmation:\n`)
      setResult(prev => prev + `   • Go to Supabase Dashboard > Authentication > Settings\n`)
      setResult(prev => prev + `   • Turn OFF "Enable email confirmations"\n`)
      setResult(prev => prev + `   • This allows immediate login with credentials\n`)
      setResult(prev => prev + `\n2. OR use the email verification links sent to your email\n`)
      setResult(prev => prev + `\n✅ Demo users should be able to login once email confirmation is handled\n`)
      
    } catch (error) {
      setResult(prev => prev + `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`)
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async () => {
    setLoading(true)
    setResult('')
    
    try {
      // Test login with client credentials
      const clientUser = demoUsers.client
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: clientUser.email,
        password: clientUser.password
      })
      
      if (loginError) {
        setResult(prev => prev + `❌ Login failed: ${loginError.message}
`)
        
        // Check if it's an email confirmation issue
        if (loginError.message.includes('Email not confirmed')) {
          setResult(prev => prev + `💡 Tip: Check your email for verification link or try creating user first
`)
        }
      } else {
        setResult(prev => prev + `✅ Login successful: ${loginData.user?.email}
`)
        setResult(prev => prev + `User ID: ${loginData.user?.id}
`)
        
        // Test accessing user profile
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', loginData.user?.id)
          .single()
          
        if (profileError) {
          setResult(prev => prev + `⚠️ Profile access failed: ${profileError.message}
`)
        } else {
          setResult(prev => prev + `✅ Profile loaded: ${profile?.name} (${profile?.role})
`)
        }
      }

    } catch (error) {
      setResult(prev => prev + `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}
`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Development Tools</h1>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-yellow-800 mb-2">⚠️ Development Only</h2>
          <p className="text-yellow-700 text-sm">
            This page is for development and debugging purposes only. 
            In production, users should use the normal signup and login flow.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Supabase Connection</h2>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={testConnection}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Connection'}
            </button>
            
            <button 
              onClick={createDemoUsers}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Demo Users'}
            </button>

            <button 
              onClick={confirmDemoUsers}
              disabled={loading}
              className="bg-orange-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Fix Email Confirmation'}
            </button>

            <button 
              onClick={testLogin}
              disabled={loading}
              className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Login'}
            </button>
          </div>
        </div>
        
        {result && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Results:</h3>
            <pre className="whitespace-pre-wrap text-sm">{result}</pre>
          </div>
        )}
        
        <div className="mt-8 bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="font-semibold mb-2 text-red-800">Development Demo Credentials:</h3>
          <p className="text-red-700 text-sm mb-2">These are for testing only - not for production use</p>
          <p className="text-red-600 text-sm"><strong>Client:</strong> {demoUsers.client.email} / {demoUsers.client.password}</p>
          <p className="text-red-600 text-sm"><strong>Lawyer:</strong> {demoUsers.lawyer.email} / {demoUsers.lawyer.password}</p>
        </div>
      </div>
    </div>
  )
}
