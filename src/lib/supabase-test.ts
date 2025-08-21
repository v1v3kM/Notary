// Supabase Connection Test Utility
// Run this in the browser console to test Supabase connectivity

export const testSupabaseConnection = async () => {
  console.log('🔍 Testing Supabase Connection...')
  
  // Check environment variables
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log('📋 Environment Check:')
  console.log('URL:', url ? `${url.substring(0, 30)}...` : 'MISSING')
  console.log('Key:', key ? `${key.substring(0, 20)}...` : 'MISSING')
  
  if (!url || !key) {
    console.error('❌ Missing environment variables')
    return false
  }
  
  // Test basic connectivity
  try {
    console.log('🌐 Testing network connectivity...')
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    })
    
    console.log('📡 Response status:', response.status)
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()))
    
    if (response.ok) {
      console.log('✅ Supabase connection successful!')
      return true
    } else {
      console.error('❌ Supabase connection failed:', response.statusText)
      return false
    }
  } catch (error) {
    console.error('❌ Network error:', error)
    
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      console.error('💡 This might be a CORS issue or network connectivity problem')
      console.error('💡 Check if your Supabase project is active and the URL is correct')
    }
    
    return false
  }
}

// Test authentication endpoint specifically
export const testSupabaseAuth = async () => {
  console.log('🔐 Testing Supabase Auth...')
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!url || !key) {
    console.error('❌ Missing environment variables for auth test')
    return false
  }
  
  try {
    const authUrl = `${url}/auth/v1/signup`
    console.log('🎯 Testing auth endpoint:', authUrl)
    
    // Test with invalid data to see if endpoint responds
    const response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: '123' // This will fail validation but should get a response
      })
    })
    
    console.log('🔐 Auth response status:', response.status)
    
    if (response.status === 422) {
      console.log('✅ Auth endpoint is responding (validation error expected)')
      return true
    } else if (response.status === 200 || response.status === 400) {
      console.log('✅ Auth endpoint is responding')
      return true
    } else {
      console.error('❌ Auth endpoint error:', response.statusText)
      const text = await response.text()
      console.error('Response:', text)
      return false
    }
  } catch (error) {
    console.error('❌ Auth test error:', error)
    return false
  }
}

// Run all tests
export const runAllTests = async () => {
  console.log('🚀 Running Supabase Connectivity Tests...')
  console.log('=' .repeat(50))
  
  const basicTest = await testSupabaseConnection()
  const authTest = await testSupabaseAuth()
  
  console.log('=' .repeat(50))
  console.log('📊 Test Results:')
  console.log('Basic Connection:', basicTest ? '✅ PASS' : '❌ FAIL')
  console.log('Auth Endpoint:', authTest ? '✅ PASS' : '❌ FAIL')
  
  if (basicTest && authTest) {
    console.log('🎉 All tests passed! Supabase should work correctly.')
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.')
    console.log('💡 Troubleshooting tips:')
    console.log('   1. Verify your Supabase project is active')
    console.log('   2. Check your environment variables are correct')
    console.log('   3. Ensure your internet connection is stable')
    console.log('   4. Try refreshing the page and running tests again')
  }
  
  return basicTest && authTest
}

// Auto-run on import in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔧 Development mode detected - Supabase test utilities loaded')
  console.log('Run runAllTests() to test Supabase connectivity')
}
