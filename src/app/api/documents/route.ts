import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch user's documents
export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
  )

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's documents
    const { data: documents, error: docsError } = await supabase
      .from('documents')
      .select(`
        *,
        lawyer:lawyer_id(name, email, specialization),
        payments(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (docsError) {
      return NextResponse.json({ error: docsError.message }, { status: 400 })
    }

    return NextResponse.json({ documents })

  } catch (error: unknown) {
    console.error('Get documents error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

// POST - Create new document
export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
  )

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { agreementType, title, content, amount } = body

    // Validate required fields
    if (!agreementType || !title || !content || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create document
    const { data: document, error: docError } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        agreement_type: agreementType,
        title,
        content,
        amount,
        status: 'draft'
      })
      .select()
      .single()

    if (docError) {
      return NextResponse.json({ error: docError.message }, { status: 400 })
    }

    return NextResponse.json({ 
      message: 'Document created successfully!',
      document 
    })

  } catch (error: unknown) {
    console.error('Create document error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
