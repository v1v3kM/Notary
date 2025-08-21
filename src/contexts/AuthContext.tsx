'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import type { User as ProfileUser } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  profile: ProfileUser | null
  loading: boolean
  signUp: (email: string, password: string, userData: Omit<ProfileUser, 'id' | 'created_at' | 'updated_at'>) => Promise<{ error?: string; success?: string }>
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<ProfileUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('🔐 Initializing Supabase authentication...')
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('❌ Error getting session:', sessionError?.message || 'Session error occurred')
        }
        
        if (session?.user) {
          console.log('✅ User session found:', session.user.email)
          setUser(session.user)
          
          // Try to fetch user profile, but handle missing table gracefully
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single()
            
            if (profileError) {
              if (profileError.message?.includes('table') || 
                  profileError.message?.includes('schema cache') ||
                  profileError.code === 'PGRST116') {
                console.warn('⚠️ Users table not found - database setup required')
                console.warn('Please run the SQL commands in database_setup.sql to enable full functionality')
                // Don't set this as an error - just continue without profile
              } else {
                console.error('❌ Error fetching user profile:', profileError?.message || 'Profile fetch error')
              }
            } else if (profileData) {
              console.log('✅ User profile loaded:', profileData.email)
              setProfile(profileData)
            }
          } catch (dbError) {
            console.warn('⚠️ Database not fully configured - some features may be limited')
            console.warn('Error details:', dbError instanceof Error ? dbError.message : 'Database access error')
          }
        } else {
          console.log('ℹ️ No active session found')
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event: string, session: Session | null) => {
            console.log('🔄 Auth state changed:', event, session?.user?.email)
            
            if (session?.user) {
              setUser(session.user)
              
              // Try to fetch profile on auth change
              try {
                const { data: profileData, error: profileError } = await supabase
                  .from('users')
                  .select('*')
                  .eq('id', session.user.id)
                  .single()
                
                if (profileError) {
                  if (profileError.message?.includes('table') || 
                      profileError.message?.includes('schema cache') ||
                      profileError.code === 'PGRST116') {
                    console.warn('⚠️ Users table not found during auth change - database setup required')
                    // Don't log this as an error
                  } else {
                    console.error('❌ Error fetching user profile on auth change:', profileError?.message || 'Profile fetch error on auth change')
                  }
                } else if (profileData) {
                  setProfile(profileData)
                }
              } catch (dbError) {
                console.warn('⚠️ Database access limited during auth change')
              }
            } else {
              setUser(null)
              setProfile(null)
            }
          }
        )

        setLoading(false)
        return () => subscription.unsubscribe()
      } catch (error) {
        console.error('❌ Error initializing auth:', error instanceof Error ? error.message : 'Auth initialization error')
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const signUp = async (email: string, password: string, userData: Omit<ProfileUser, 'id' | 'created_at' | 'updated_at'>): Promise<{ error?: string; success?: string }> => {
    try {
      console.log('Starting signup process for:', email)
      
      if (!email || !password) {
        return { error: 'Email and password are required' }
      }

      if (!userData.name || !userData.phone) {
        return { error: 'Name and phone number are required' }
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name: userData.name,
          }
        }
      })

      if (authError) {
        console.error('Supabase auth signup error:', authError?.message || 'Signup error occurred')
        if (authError.message.includes('rate limit')) {
          return { error: 'Too many signup attempts. Please wait a moment and try again.' }
        }
        if (authError.message.includes('already registered')) {
          return { error: 'An account with this email already exists. Please sign in instead.' }
        }
        if (authError.message.includes('invalid email')) {
          return { error: 'Please enter a valid email address.' }
        }
        if (authError.message.includes('password')) {
          return { error: 'Password must be at least 6 characters long.' }
        }
        return { error: authError.message || 'Failed to create account. Please try again.' }
      }

      if (authData?.user) {
        console.log('Auth user created successfully:', authData.user.email)
        
        // Temporarily bypass profile creation if database tables don't exist
        // This allows users to at least create accounts and verify emails
        let profileCreated = false;
        
        try {
          // First, check if the users table exists
          const { error: tableCheckError } = await supabase
            .from('users')
            .select('id')
            .limit(1)
          
          if (tableCheckError && (
            tableCheckError.message?.includes('relation "users" does not exist') ||
            tableCheckError.message?.includes('table') ||
            tableCheckError.code === 'PGRST116'
          )) {
            console.warn('⚠️ Users table does not exist - skipping profile creation')
            console.warn('Account created successfully but profile data will need to be added later')
            console.warn('Please run the SQL commands in database_setup.sql to enable full functionality')
            
            // Return success but warn about incomplete setup
            return { 
              success: 'Account created successfully! Please check your email to verify your account. Database setup needed for full functionality.' 
            }
          } else {
            // Table exists, proceed with profile creation
            const profileData = {
              id: authData.user.id,
              email: authData.user.email!,
              name: userData.name,
              phone: userData.phone,
              role: userData.role || 'client',
              aadhaar_number: userData.aadhaar_number || null,
              pan_number: userData.pan_number || null,
              address: userData.address || null,
              specialization: userData.specialization || null,
              is_verified: false,
            }

            console.log('Attempting to create user profile with data:', profileData)
            
            const { data: insertData, error: profileError } = await supabase
              .from('users')
              .insert([profileData])
              .select()

            if (profileError) {
              console.error('Error creating user profile:', profileError.message || 'Unknown profile creation error')
              
              // Return success for auth but note profile issue
              return { 
                success: 'Account created but profile setup incomplete. Please contact support for database setup.' 
              }
            } else {
              console.log('User profile created successfully:', insertData)
              profileCreated = true
            }
          }
        } catch (error) {
          console.error('Database setup error:', error instanceof Error ? error.message : 'Database setup failed')
          console.warn('Proceeding with account creation despite database setup issues')
        }

        return { 
          success: profileCreated ? 'Account created successfully!' : 'Account created! Please complete database setup for full functionality.' 
        }
      }

      return { error: 'Failed to create account. Please try again.' }
    } catch (error) {
      console.error('Signup error:', error instanceof Error ? error.message : 'Signup failed')
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          return { error: 'Network error. Please check your internet connection and try again.' }
        }
        return { error: error.message }
      }
      return { error: 'An unexpected error occurred. Please try again.' }
    }
  }

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      console.log('Starting signin process for:', email)

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        // Safe error logging that won't cause crashes
        const safeErrorMessage = (() => {
          try {
            if (typeof error === 'string') return error
            if (error && typeof error.message === 'string') return error.message
            if (error && typeof error.toString === 'function') return error.toString()
            return 'Authentication error occurred'
          } catch {
            return 'Error details unavailable'
          }
        })()
        
        console.error('Signin error details:', safeErrorMessage)
        
        const errorMessage = safeErrorMessage
        
        if (errorMessage.includes('Invalid login credentials')) {
          return { 
            error: 'Invalid email or password. If you just signed up, please check your email for a verification link first.' 
          }
        }
        if (errorMessage.includes('Email not confirmed')) {
          return { 
            error: 'Please check your email and click the verification link before signing in.' 
          }
        }
        if (errorMessage.includes('rate limit')) {
          return { error: 'Too many signin attempts. Please wait a moment and try again.' }
        }
        if (errorMessage.includes('signup')) {
          return { 
            error: 'Account may not exist. Please sign up first or check your email for verification.' 
          }
        }
        
        // For unverified email accounts
        const statusCode = error?.status?.toString() || error?.code?.toString() || '';
        if (statusCode === '400') {
          return { 
            error: 'Account not verified. Please check your email for verification link or try signing up again.' 
          }
        }
        
        return { error: errorMessage || 'Login failed. Please try again.' }
      }

      console.log('Signin successful')
      return {}
    } catch (error) {
      const safeErrorMessage = (() => {
        try {
          if (typeof error === 'string') return error
          if (error instanceof Error) return error.message
          if (error && typeof error.toString === 'function') return error.toString()
          return 'Signin error occurred'
        } catch {
          return 'Error details unavailable'
        }
      })()
      
      console.error('Signin error:', safeErrorMessage)
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          return { error: 'Network error. Please check your internet connection and try again.' }
        }
        return { error: error.message }
      }
      return { error: 'An unexpected error occurred. Please try again.' }
    }
  }

  const signOut = async () => {
    try {
      console.log('Signing out user')
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Signout error:', error instanceof Error ? error.message : 'Signout failed')
    }
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
