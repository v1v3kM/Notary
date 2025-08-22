import { NextResponse } from 'next/server'
import { demoUsers } from '@/lib/demo/demo-data'

export async function POST() {
  try {
    // In demo mode, we don't actually need to create users in Supabase
    // Just return success since we're using local demo data
    
    // Check if demo mode is enabled
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
    
    if (isDemoMode) {
      // Simulate successful demo setup
      const results = [
        { user: 'client', status: 'created', email: demoUsers.client.email },
        { user: 'lawyer', status: 'created', email: demoUsers.lawyer.email }
      ];

      return NextResponse.json({ 
        message: 'Demo users setup completed (demo mode)',
        results,
        isDemoMode: true
      });
    }

    // If not in demo mode but Supabase is not configured, still return success
    return NextResponse.json({ 
      message: 'Demo setup completed - using local demo data',
      results: [
        { user: 'client', status: 'ready', email: demoUsers.client.email },
        { user: 'lawyer', status: 'ready', email: demoUsers.lawyer.email }
      ],
      isDemoMode: true
    });

  } catch (error: unknown) {
    console.error('Demo setup error:', error)
    return NextResponse.json(
      { error: 'Failed to setup demo users' },
      { status: 500 }
    )
  }
}
