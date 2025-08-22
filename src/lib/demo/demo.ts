export const isDemoMode = () => {
  // Check if we're in demo environment
  const demoEnv = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
  const demoUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('demo')
  
  return demoEnv || demoUrl || typeof window !== 'undefined' && localStorage.getItem('demo-session')
}

export const getDemoUser = () => {
  return {
    id: 'demo-user-123',
    email: 'demo@example.com',
    created_at: new Date().toISOString(),
    app_metadata: {},
    user_metadata: {
      name: 'Demo User'
    },
    aud: 'authenticated',
    role: 'authenticated'
  }
}

export const getDemoProfile = () => {
  return {
    id: 'demo-user-123',
    email: 'demo@example.com',
    name: 'Demo User',
    phone: '+91 98765 43210',
    role: 'client' as const,
    aadhaar_number: '1234 5678 9012',
    pan_number: 'ABCDE1234F',
    address: 'Demo Address, Demo City, Demo State',
    is_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
}

export const setDemoSession = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('demo-session', JSON.stringify({
      user: getDemoUser(),
      profile: getDemoProfile()
    }))
  }
}

export const clearDemoSession = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('demo-session')
  }
}

export const getDemoSession = () => {
  if (typeof window !== 'undefined') {
    const session = localStorage.getItem('demo-session')
    if (session) {
      try {
        return JSON.parse(session)
      } catch {
        return null
      }
    }
  }
  return null
}
