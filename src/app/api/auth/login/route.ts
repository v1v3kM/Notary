import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { isDemoUser, getDemoUser } from '@/lib/demo/demo-data'

export async function POST(request: NextRequest) {
  let email: string;
  let password: string;

  // Handle both JSON and FormData
  const contentType = request.headers.get('content-type') || '';
  
  if (contentType.includes('application/json')) {
    const body = await request.json();
    email = body.email;
    password = body.password;
  } else {
    const formData = await request.formData();
    email = String(formData.get('email'));
    password = String(formData.get('password'));
  }

  // Handle demo users
  if (isDemoUser(email)) {
    const demoUser = getDemoUser(email);
    if (demoUser && demoUser.password === password) {
      // Create a mock session for demo users
      const mockUser = {
        id: demoUser.id,
        email: demoUser.email,
        created_at: demoUser.created_at,
        updated_at: demoUser.updated_at,
        email_confirmed_at: demoUser.created_at,
        user_metadata: { name: demoUser.name },
        app_metadata: { role: demoUser.role }
      };

      // Store demo session in localStorage (will be handled on client side)
      return NextResponse.json({ 
        message: 'Demo login successful!',
        user: mockUser,
        profile: demoUser,
        isDemoMode: true
      });
    } else {
      return NextResponse.json({ error: 'Invalid demo credentials' }, { status: 400 });
    }
  }

  // Regular Supabase authentication for non-demo users
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
  )

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user?.id)
      .single()

    if (profileError) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 400 })
    }

    return NextResponse.json({ 
      message: 'Login successful!',
      user: data.user,
      profile,
      isDemoMode: false
    })

  } catch (error: unknown) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
