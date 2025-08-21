import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
    )

    console.log('Testing Supabase database connection...')

    // Test 2: Check if users table exists
    let usersTableExists = false
    let usersTableError: string | null = null
    try {
      const { error: tableError } = await supabase
        .from('users')
        .select('id')
        .limit(1)
      
      if (!tableError) {
        usersTableExists = true
      } else {
        usersTableError = tableError.message
      }
    } catch (err: unknown) {
      usersTableError = err instanceof Error ? err.message : 'Unknown error'
    }

    // Test 3: Check if storage bucket exists
    let storageExists = false
    let storageError: string | null = null
    try {
      const { error: bucketError } = await supabase.storage
        .from('documents')
        .list('', { limit: 1 })
      
      if (!bucketError) {
        storageExists = true
      } else {
        storageError = bucketError.message
      }
    } catch (err: unknown) {
      storageError = err instanceof Error ? err.message : 'Unknown error'
    }

    interface Recommendation {
      issue: string;
      solution: string;
      priority: string;
    }

    const diagnostics = {
      supabaseConnection: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
        keyPresent: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        status: 'connected'
      },
      databaseTables: {
        usersTable: {
          exists: usersTableExists,
          error: usersTableError
        }
      },
      storage: {
        documentsbucket: {
          exists: storageExists,
          error: storageError
        }
      },
      recommendations: [] as Recommendation[]
    }

    // Add recommendations based on test results
    if (!usersTableExists) {
      diagnostics.recommendations.push({
        issue: 'Users table missing',
        solution: 'Run the SQL commands from database_setup.sql in your Supabase SQL Editor',
        priority: 'HIGH'
      })
    }

    if (!storageExists) {
      diagnostics.recommendations.push({
        issue: 'Storage bucket missing',
        solution: 'Create a "documents" bucket in Supabase Storage (set as public)',
        priority: 'MEDIUM'
      })
    }

    return NextResponse.json({
      status: 'success',
      message: 'Database diagnostics completed',
      diagnostics,
      setupComplete: usersTableExists && storageExists,
      criticalIssues: !usersTableExists
    })

  } catch (error: unknown) {
    console.error('Database test error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({
      status: 'error',
      message: 'Failed to test database connection',
      error: errorMessage,
      diagnostics: null
    }, { status: 500 })
  }
}
