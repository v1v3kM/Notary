import { createClient } from '@supabase/supabase-js'

// Production Supabase configuration
const createSupabaseClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // Validate environment variables
  if (!url || !key) {
    console.error('❌ Missing Supabase environment variables')
    console.error('NEXT_PUBLIC_SUPABASE_URL:', url ? 'Present' : 'Missing')
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', key ? 'Present' : 'Missing')
    throw new Error('Supabase configuration is incomplete')
  }
  
  console.log('✅ Creating Supabase client with URL:', url.substring(0, 30) + '...')
  
  return createClient(url, key, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    },
    global: {
      headers: {
        'x-application-name': 'notary-platform'
      }
    }
  })
}

export const supabase = createSupabaseClient()

// Production mode only - no demo functionality

// Database types for TypeScript
export interface User {
  id: string
  email: string
  phone: string
  name: string
  role: 'client' | 'lawyer'
  aadhaar_number?: string
  pan_number?: string
  address?: string
  specialization?: string
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  user_id: string
  agreement_type: 'rent' | 'affidavit' | 'partnership'
  title: string
  content: Record<string, unknown> // JSON field for form data
  status: 'draft' | 'submitted' | 'in_verification' | 'approved' | 'rejected' | 'completed'
  lawyer_id?: string
  payment_status: 'pending' | 'completed' | 'failed'
  amount: number
  documents_uploaded: string[] // Array of file URLs
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  document_id: string
  user_id: string
  amount: number
  currency: string
  payment_method: string
  razorpay_payment_id?: string
  razorpay_order_id?: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  created_at: string
  updated_at: string
}
