#!/usr/bin/env node

/**
 * Quick Database Status Check
 * This checks if your Supabase database is properly set up
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function checkDatabaseStatus() {
  console.log('🔍 Checking Supabase Database Status...\n');

  try {
    // Read environment variables
    const envPath = path.join(__dirname, 'notary-frontend', '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    let supabaseUrl = '';
    let anonKey = '';
    let serviceKey = '';
    
    envContent.split('\n').forEach(line => {
      if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
        supabaseUrl = line.split('=')[1];
      }
      if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
        anonKey = line.split('=')[1];
      }
      if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
        serviceKey = line.split('=')[1];
      }
    });

    console.log('📊 Configuration Status:');
    console.log(`   URL: ${supabaseUrl ? '✅ Present' : '❌ Missing'}`);
    console.log(`   Anon Key: ${anonKey ? '✅ Present' : '❌ Missing'}`);
    console.log(`   Service Key: ${serviceKey && !serviceKey.includes('placeholder') ? '✅ Real key' : '❌ Placeholder'}`);

    if (!supabaseUrl || !anonKey) {
      console.log('\n❌ Missing basic Supabase configuration');
      return;
    }

    // Test connection with anon key
    console.log('\n🔗 Testing Supabase Connection...');
    const supabase = createClient(supabaseUrl, anonKey);
    
    // Test basic connection
    const { data: authUser, error: authError } = await supabase.auth.getUser();
    
    if (authError && !authError.message.includes('JWT')) {
      console.log(`❌ Connection failed: ${authError.message}`);
      return;
    }
    
    console.log('✅ Supabase connection working');

    // Check if tables exist
    console.log('\n📋 Checking Database Tables...');
    
    try {
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('count', { count: 'exact', head: true });
      
      if (usersError) {
        console.log(`❌ Users table: ${usersError.message}`);
      } else {
        console.log('✅ Users table exists and accessible');
      }
    } catch (error) {
      console.log('❌ Users table: Not found or not accessible');
    }

    try {
      const { data: docsData, error: docsError } = await supabase
        .from('documents')
        .select('count', { count: 'exact', head: true });
      
      if (docsError) {
        console.log(`❌ Documents table: ${docsError.message}`);
      } else {
        console.log('✅ Documents table exists and accessible');
      }
    } catch (error) {
      console.log('❌ Documents table: Not found or not accessible');
    }

    try {
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('count', { count: 'exact', head: true });
      
      if (paymentsError) {
        console.log(`❌ Payments table: ${paymentsError.message}`);
      } else {
        console.log('✅ Payments table exists and accessible');
      }
    } catch (error) {
      console.log('❌ Payments table: Not found or not accessible');
    }

    console.log('\n🎯 Diagnosis:');
    
    if (serviceKey.includes('placeholder')) {
      console.log('🔑 ISSUE: Service role key is still placeholder');
      console.log('   → Get real key from: https://supabase.com/dashboard/project/cjfvdwmykwsvpkocqyev/settings/api');
      console.log('   → Update .env.local file');
    }

    console.log('📊 ISSUE: Database tables may not be set up');
    console.log('   → Run SQL script in: https://supabase.com/dashboard/project/cjfvdwmykwsvpkocqyev/sql');
    console.log('   → Use COMPLETE_FIX_SETUP.sql file');

    console.log('\n💡 Next Steps to Fix Login Error:');
    console.log('   1. Open: FIX_LOGIN_ERROR.html (step-by-step guide)');
    console.log('   2. Update service role key');
    console.log('   3. Run database setup SQL');
    console.log('   4. Create test user account');
    console.log('   5. Try logging in again');

  } catch (error) {
    console.error('\n❌ Check failed:', error.message);
    console.log('\n💡 This is likely due to missing database setup');
    console.log('   → Follow the steps in FIX_LOGIN_ERROR.html');
  }
}

checkDatabaseStatus();
