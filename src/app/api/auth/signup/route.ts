import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const email = String(formData.get('email'))
  const password = String(formData.get('password'))
  const name = String(formData.get('name'))
  const phone = String(formData.get('phone'))
  const role = String(formData.get('role'))
  const aadhaarNumber = String(formData.get('aadhaarNumber'))
  const panNumber = String(formData.get('panNumber'))
  const address = String(formData.get('address'))
  const specialization = String(formData.get('specialization'))

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
  )

  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${requestUrl.origin}/auth/callback`,
      },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // Create user profile
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          name,
          phone,
          role: role as 'client' | 'lawyer',
          aadhaar_number: aadhaarNumber || null,
          pan_number: panNumber || null,
          address: address || null,
          specialization: role === 'lawyer' ? specialization : null,
        })

      if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 400 })
      }
    }

    return NextResponse.json({ 
      message: 'Registration successful! Please check your email to verify your account.',
      user: authData.user 
    })

  } catch (error: unknown) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
