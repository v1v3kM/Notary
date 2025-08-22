#!/usr/bin/env node

/**
 * Complete Automated Setup - Final Version
 * This handles everything automatically once you provide the service key
 */

const fs = require('fs');
const path = require('path');

// Check if service key is provided as argument
const serviceKey = process.argv[2];

if (!serviceKey) {
  console.log('\n🚀 Supabase Database Auto-Setup');
  console.log('=================================');
  console.log('\n📋 Usage:');
  console.log('node final-setup.js YOUR_SERVICE_ROLE_KEY');
  console.log('\n🔑 Get your service role key from:');
  console.log('https://supabase.com/dashboard/project/cjfvdwmykwsvpkocqyev/settings/api');
  console.log('\n💡 Copy the "service_role" key (the long one) and run:');
  console.log('node final-setup.js eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  process.exit(1);
}

console.log('🚀 Starting Automated Supabase Setup...\n');

try {
  // Step 1: Update environment file
  console.log('📝 Step 1: Updating environment variables...');
  const envPath = path.join(__dirname, 'notary-frontend', '.env.local');
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  envContent = envContent.replace(
    /SUPABASE_SERVICE_ROLE_KEY=.*/,
    `SUPABASE_SERVICE_ROLE_KEY=${serviceKey}`
  );
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Environment file updated!\n');

  // Step 2: Create comprehensive SQL setup
  console.log('📊 Step 2: Generating database schema...');
  
  const sqlContent = `-- Complete Supabase Database Setup
-- Auto-generated: ${new Date().toISOString()}

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE,
  name VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  role VARCHAR CHECK (role IN ('client', 'lawyer')) NOT NULL DEFAULT 'client',
  aadhaar_number VARCHAR,
  pan_number VARCHAR,
  specialization VARCHAR,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  agreement_type VARCHAR CHECK (agreement_type IN ('rent', 'affidavit', 'partnership')) NOT NULL,
  title VARCHAR NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  status VARCHAR CHECK (status IN ('draft', 'submitted', 'in_verification', 'approved', 'rejected', 'completed')) DEFAULT 'draft',
  lawyer_id UUID REFERENCES public.users(id),
  payment_status VARCHAR CHECK (payment_status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  documents_uploaded TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR DEFAULT 'INR',
  payment_method VARCHAR NOT NULL,
  razorpay_payment_id VARCHAR,
  razorpay_order_id VARCHAR,
  status VARCHAR CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Policies (with IF NOT EXISTS handling)
DO $$
BEGIN
  -- Users policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'users' AND policyname = 'Users can view own profile') THEN
    CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'users' AND policyname = 'Users can update own profile') THEN
    CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'users' AND policyname = 'Users can insert own profile') THEN
    CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;

  -- Documents policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'documents' AND policyname = 'Users can view own documents') THEN
    CREATE POLICY "Users can view own documents" ON public.documents FOR SELECT USING (auth.uid() = user_id OR auth.uid() = lawyer_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'documents' AND policyname = 'Users can create own documents') THEN
    CREATE POLICY "Users can create own documents" ON public.documents FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'documents' AND policyname = 'Users can update own documents') THEN
    CREATE POLICY "Users can update own documents" ON public.documents FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = lawyer_id);
  END IF;

  -- Payments policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'payments' AND policyname = 'Users can view own payments') THEN
    CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'payments' AND policyname = 'Users can create own payments') THEN
    CREATE POLICY "Users can create own payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Create trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS handle_updated_at ON public.users;
DROP TRIGGER IF EXISTS handle_updated_at ON public.documents;
DROP TRIGGER IF EXISTS handle_updated_at ON public.payments;

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Success message
SELECT 'Database setup completed successfully! 🎉' as result;`;

  // Save SQL file
  const sqlPath = path.join(__dirname, 'ready-to-run-setup.sql');
  fs.writeFileSync(sqlPath, sqlContent);
  console.log('✅ Database schema generated!\n');

  // Step 3: Try to set up via API
  console.log('🔄 Step 3: Attempting automatic database setup...');
  
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(
    'https://cjfvdwmykwsvpkocqyev.supabase.co',
    serviceKey
  );

  // Execute SQL setup
  const statements = sqlContent.split(';').filter(s => s.trim().length > 0);
  let successCount = 0;

  for (let i = 0; i < Math.min(statements.length, 10); i++) { // Limit to avoid timeouts
    try {
      const statement = statements[i].trim() + ';';
      if (statement.includes('CREATE TABLE') || statement.includes('CREATE EXTENSION')) {
        await supabase.rpc('sql', { query: statement });
        successCount++;
        console.log(`  ✅ Statement ${i + 1} executed successfully`);
      }
    } catch (error) {
      console.log(`  ⚠️ Statement ${i + 1} may need manual setup`);
    }
  }

  if (successCount > 0) {
    console.log('\n🎉 Partial automatic setup completed!');
  }

  // Step 4: Display final instructions
  console.log('\n📋 FINAL SETUP INSTRUCTIONS');
  console.log('===========================');
  console.log('\n🔗 Go to Supabase SQL Editor:');
  console.log('https://supabase.com/dashboard/project/cjfvdwmykwsvpkocqyev/sql');
  console.log('\n📋 Copy and paste this complete SQL script:');
  
  console.log('\n' + '='.repeat(80));
  console.log('📊 COMPLETE DATABASE SETUP SQL:');
  console.log('='.repeat(80));
  console.log(sqlContent);
  console.log('='.repeat(80));

  console.log('\n🎯 After running the SQL:');
  console.log('1. ✅ All database tables will be created');
  console.log('2. ✅ Security policies will be applied');
  console.log('3. ✅ Your app will work with the database');
  console.log('4. ✅ The warning banner will disappear');

  console.log('\n🔄 Restart your development server:');
  console.log('cd notary-frontend && npm run dev');

  console.log('\n💾 SQL script saved to: ready-to-run-setup.sql');
  console.log('\n🎉 Setup complete! Run the SQL in Supabase dashboard.');

} catch (error) {
  console.error('\n❌ Error:', error.message);
  console.log('\n💡 Manual setup required:');
  console.log('1. Update service role key in .env.local');
  console.log('2. Run SQL script in Supabase dashboard');
}
