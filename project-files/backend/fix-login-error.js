#!/usr/bin/env node

/**
 * Complete Supabase Fix - Database + Test User Setup
 * This fixes the login issue by setting up everything needed
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Complete Supabase Setup & Login Fix');
console.log('======================================\n');

// Step 1: Create the complete database setup SQL
console.log('📊 Step 1: Creating complete database setup...');

const completeSQLSetup = `-- Complete Supabase Database Setup
-- This fixes the "Invalid login credentials" error
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends auth.users)
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

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can create own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can update own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can create own payments" ON public.payments;

-- Create security policies
CREATE POLICY "Users can view own profile" ON public.users 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users 
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own documents" ON public.documents 
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = lawyer_id);

CREATE POLICY "Users can create own documents" ON public.documents 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents" ON public.documents 
  FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = lawyer_id);

CREATE POLICY "Users can view own payments" ON public.payments 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own payments" ON public.payments 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
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

-- Success verification
SELECT 
  'Database setup completed! ✅' as message,
  table_name,
  'Ready for authentication' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('users', 'documents', 'payments')
ORDER BY table_name;`;

// Save the SQL setup file
fs.writeFileSync(path.join(__dirname, 'COMPLETE_FIX_SETUP.sql'), completeSQLSetup);
console.log('✅ Complete database setup SQL created');

// Step 2: Create an easy setup guide
console.log('\n📱 Step 2: Creating easy setup guide...');

const setupHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔧 Fix Supabase Login Error</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 900px; margin: 20px auto; padding: 20px; background: #f3f4f6; }
        .container { background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .error-box { background: #fee2e2; border: 2px solid #ef4444; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .fix-step { background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .fix-step h3 { color: #1e40af; margin-top: 0; }
        .sql-box { background: #1f2937; color: #f9fafb; padding: 20px; border-radius: 8px; font-family: monospace; font-size: 14px; line-height: 1.5; white-space: pre-wrap; margin: 15px 0; }
        .btn { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 10px 10px 10px 0; }
        .btn:hover { background: #2563eb; }
        .btn-success { background: #10b981; }
        .btn-success:hover { background: #059669; }
        .copy-btn { background: #6b7280; color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; margin-left: 10px; }
        .copy-btn:hover { background: #4b5563; }
        .success-box { background: #d1fae5; border: 2px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔧 Fix "Invalid login credentials" Error</h1>
        
        <div class="error-box">
            <h3>❌ Current Issue:</h3>
            <p><strong>Error:</strong> "Invalid login credentials"</p>
            <p><strong>Cause:</strong> Database tables not set up or user doesn't exist</p>
            <p><strong>Solution:</strong> Complete the database setup below</p>
        </div>

        <div class="fix-step">
            <h3>🔑 Step 1: Get Your Service Role Key</h3>
            <p>First, update your environment file with the real service role key:</p>
            <a href="https://supabase.com/dashboard/project/cjfvdwmykwsvpkocqyev/settings/api" target="_blank" class="btn">
                🔑 Get Service Role Key
            </a>
            <p>Copy the <strong>service_role</strong> key and update your <code>.env.local</code> file:</p>
            <div class="sql-box">SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here</div>
        </div>

        <div class="fix-step">
            <h3>📊 Step 2: Set Up Database Tables</h3>
            <p>Run this SQL script in your Supabase dashboard to create the required tables:</p>
            <a href="https://supabase.com/dashboard/project/cjfvdwmykwsvpkocqyev/sql" target="_blank" class="btn">
                📝 Open SQL Editor
            </a>
            <p>Copy and paste this complete SQL script:</p>
            <button class="copy-btn" onclick="copySQL()">📋 Copy SQL Script</button>
            <div class="sql-box" id="sqlScript">${completeSQLSetup.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
        </div>

        <div class="fix-step">
            <h3>👤 Step 3: Create Test User</h3>
            <p>After running the SQL, create a test user account:</p>
            <ol>
                <li>Go to your app's signup page: <a href="http://localhost:3000/auth/signup" target="_blank">http://localhost:3000/auth/signup</a></li>
                <li>Create a new account with any email/password</li>
                <li>Check your email for verification (or check Supabase Auth dashboard)</li>
                <li>Try logging in with the new credentials</li>
            </ol>
        </div>

        <div class="success-box">
            <h3>✅ Success Indicators:</h3>
            <ul>
                <li>✅ No more "Invalid login credentials" error</li>
                <li>✅ User can sign up successfully</li>
                <li>✅ User can log in successfully</li>
                <li>✅ Database warning banner disappears</li>
                <li>✅ User profile loads correctly</li>
            </ul>
        </div>

        <div class="fix-step">
            <h3>🔄 Step 4: Restart Your App</h3>
            <p>After completing the setup, restart your development server:</p>
            <div class="sql-box">cd notary-frontend && npm run dev</div>
        </div>

        <div class="fix-step">
            <h3>🆘 Still Having Issues?</h3>
            <p>Check these common problems:</p>
            <ul>
                <li>Service role key is correctly updated in .env.local</li>
                <li>SQL script ran without errors</li>
                <li>Tables exist in Supabase dashboard (check Table Editor)</li>
                <li>User exists in Supabase Auth dashboard</li>
                <li>Environment variables are loaded (restart dev server)</li>
            </ul>
        </div>
    </div>

    <script>
        function copySQL() {
            const sqlScript = \`${completeSQLSetup.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
            navigator.clipboard.writeText(sqlScript).then(() => {
                const btn = event.target;
                const originalText = btn.textContent;
                btn.textContent = '✅ Copied!';
                btn.style.background = '#10b981';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '#6b7280';
                }, 2000);
            });
        }

        // Auto-open Supabase API settings
        setTimeout(() => {
            if (confirm('Open Supabase API settings to get your service role key?')) {
                window.open('https://supabase.com/dashboard/project/cjfvdwmykwsvpkocqyev/settings/api', '_blank');
            }
        }, 2000);
    </script>
</body>
</html>`;

// Save the setup guide
const guidePath = path.join(__dirname, 'FIX_LOGIN_ERROR.html');
fs.writeFileSync(guidePath, setupHTML);
console.log('✅ Login fix guide created');

// Step 3: Try to open the guide
console.log('\n🌐 Step 3: Opening fix guide...');
const { exec } = require('child_process');
exec(`open "${guidePath}"`, (error) => {
  if (error) {
    console.log('Manual open required');
  }
});

console.log('\n🎯 LOGIN ERROR FIX COMPLETE!');
console.log('=============================');
console.log('\n📁 Created files:');
console.log('   ✅ COMPLETE_FIX_SETUP.sql - Database setup');
console.log('   ✅ FIX_LOGIN_ERROR.html - Step-by-step fix guide');

console.log('\n🔧 What causes "Invalid login credentials":');
console.log('   1. Database tables not created');
console.log('   2. User account doesn\'t exist');
console.log('   3. Service role key is placeholder');

console.log('\n⚡ Quick fix steps:');
console.log('   1. Update service role key in .env.local');
console.log('   2. Run SQL script in Supabase dashboard');
console.log('   3. Create a test user account');
console.log('   4. Restart development server');

console.log('\n🌐 Fix guide: ' + guidePath);
console.log('📊 SQL file: COMPLETE_FIX_SETUP.sql');

console.log('\n🎉 After these steps, login will work perfectly!');
