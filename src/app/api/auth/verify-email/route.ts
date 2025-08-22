import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/database/supabaseServer'

export async function POST(request: NextRequest) {
  try {
    const { token, type = 'signup' } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabase = await createServerSupabaseClient()

    try {
      // Use Supabase's built-in email verification
      const { data, error: authError } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: type as 'signup' | 'email_change' | 'recovery' | 'invite'
      })

      if (authError) {
        console.error('Supabase verification error:', authError)
        
        if (authError.message.includes('expired')) {
          return NextResponse.json(
            { error: 'Verification token has expired' },
            { status: 400 }
          )
        }
        
        return NextResponse.json(
          { error: 'Invalid verification token' },
          { status: 400 }
        )
      }

      if (data.user) {
        return NextResponse.json(
          { 
            message: 'Email verified successfully',
            success: true,
            user: {
              id: data.user.id,
              email: data.user.email,
              email_confirmed_at: data.user.email_confirmed_at
            }
          },
          { status: 200 }
        )
      } else {
        return NextResponse.json(
          { error: 'Verification failed' },
          { status: 400 }
        )
      }

    } catch (dbError) {
      console.error('Supabase operation failed:', dbError)
      return NextResponse.json(
        { error: 'Authentication service error' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const type = searchParams.get('type') || 'signup'

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabase = await createServerSupabaseClient()

    try {
      // Verify the token with Supabase
      const { data, error: authError } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: type as 'signup' | 'email_change' | 'recovery' | 'invite'
      })

      if (authError) {
        console.error('Supabase verification error:', authError)
        
        if (authError.message.includes('expired')) {
          return NextResponse.json(
            { error: 'Verification token has expired' },
            { status: 400 }
          )
        }
        
        return NextResponse.json(
          { error: 'Invalid verification token' },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { 
          message: 'Token is valid',
          valid: true,
          email: data.user?.email
        },
        { status: 200 }
      )

    } catch (dbError) {
      console.error('Supabase operation failed:', dbError)
      return NextResponse.json(
        { error: 'Authentication service error' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Token validation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
