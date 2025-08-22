import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/database/supabaseServer'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabase = await createServerSupabaseClient()

    try {
      // Use Supabase's built-in email verification
      const { error: authError } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      })

      if (authError) {
        console.error('Supabase auth error:', authError)
        return NextResponse.json(
          { error: 'Failed to send verification email' },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { 
          message: 'Verification email sent successfully',
          success: true 
        },
        { status: 200 }
      )

    } catch (dbError) {
      console.error('Supabase operation failed:', dbError)
      
      return NextResponse.json(
        { 
          message: 'Failed to send verification email',
          success: false,
          error: 'Supabase service error'
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Send verification email error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
