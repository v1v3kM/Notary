#!/usr/bin/env node

/**
 * Ultimate Automated Supabase Setup
 * This does everything automatically and opens the required pages
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        resolve(false); // Don't reject, just indicate failure
      } else {
        resolve(true);
      }
    });
  });
}

async function ultimateSetup() {
  console.log('🚀 ULTIMATE Supabase Auto-Setup');
  console.log('================================\n');

  // Step 1: Generate the complete SQL
  console.log('📊 Step 1: Generating complete database setup...');
  
  const sqlContent = `-- Ultimate Supabase Database Setup
-- Auto-generated: ${new Date().toISOString()}
-- Project: cjfvdwmykwsvpkocqyev

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

-- Create trigger function for automatic timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for automatic timestamp updates
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Verification query
SELECT 
  'Database setup completed successfully! 🎉' as message,
  COUNT(*) as tables_created
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('users', 'documents', 'payments');`;

  // Save SQL to file
  fs.writeFileSync(path.join(__dirname, 'COMPLETE_DATABASE_SETUP.sql'), sqlContent);
  console.log('✅ Complete SQL script generated');

  // Step 2: Create an HTML guide that auto-opens
  console.log('\n📱 Step 2: Creating interactive setup guide...');
  
  const htmlGuide = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Supabase Database Setup - Auto Guide</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; background: #f8fafc; }
        .container { background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .step { margin: 30px 0; padding: 20px; border-left: 4px solid #10b981; background: #f0fdf4; border-radius: 8px; }
        .step h3 { color: #059669; margin-top: 0; }
        .code-block { background: #1f2937; color: #f9fafb; padding: 20px; border-radius: 8px; overflow-x: auto; font-family: 'Monaco', 'Menlo', monospace; font-size: 14px; line-height: 1.5; margin: 15px 0; }
        .btn { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 10px 10px 10px 0; transition: background 0.2s; }
        .btn:hover { background: #2563eb; }
        .btn-success { background: #10b981; }
        .btn-success:hover { background: #059669; }
        .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .success { background: #d1fae5; border: 1px solid #10b981; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .copy-btn { background: #6b7280; color: white; padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; margin-left: 10px; }
        .copy-btn:hover { background: #4b5563; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Automated Supabase Database Setup</h1>
        <p><strong>Project:</strong> cjfvdwmykwsvpkocqyev</p>
        
        <div class="step">
            <h3>📍 Step 1: Get Your Service Role Key</h3>
            <p>Click the button below to open your Supabase API settings:</p>
            <a href="https://supabase.com/dashboard/project/cjfvdwmykwsvpkocqyev/settings/api" target="_blank" class="btn">
                🔑 Open API Settings
            </a>
            <div class="warning">
                <strong>Important:</strong> Copy the <strong>service_role</strong> key (the long one), NOT the anon key!
            </div>
        </div>

        <div class="step">
            <h3>📱 Step 2: Update Environment File</h3>
            <p>Replace the placeholder in your <code>notary-frontend/.env.local</code> file:</p>
            <div class="code-block">SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here</div>
        </div>

        <div class="step">
            <h3>📊 Step 3: Run Database Setup</h3>
            <p>Click to open Supabase SQL Editor:</p>
            <a href="https://supabase.com/dashboard/project/cjfvdwmykwsvpkocqyev/sql" target="_blank" class="btn">
                📝 Open SQL Editor
            </a>
            <p>Then copy and paste this complete SQL script:</p>
            <div class="code-block" id="sqlScript">${sqlContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
            <button class="copy-btn" onclick="copySQL()">📋 Copy SQL</button>
        </div>

        <div class="step">
            <h3>🎉 Step 4: Verify Setup</h3>
            <p>After running the SQL script, restart your development server:</p>
            <div class="code-block">cd notary-frontend && npm run dev</div>
            <div class="success">
                <strong>Success indicators:</strong><br>
                ✅ Database warning banner disappears<br>
                ✅ User registration works<br>
                ✅ Authentication flows work<br>
                ✅ Document creation works
            </div>
        </div>

        <div class="step">
            <h3>🔧 What This Sets Up</h3>
            <ul>
                <li>✅ <strong>Users table</strong> - User profiles and authentication</li>
                <li>✅ <strong>Documents table</strong> - Legal document management</li>
                <li>✅ <strong>Payments table</strong> - Payment processing and tracking</li>
                <li>✅ <strong>Security policies</strong> - Row-level access control</li>
                <li>✅ <strong>Triggers</strong> - Automatic timestamp updates</li>
                <li>✅ <strong>Permissions</strong> - Proper access grants</li>
            </ul>
        </div>
    </div>

    <script>
        function copySQL() {
            const sqlScript = document.getElementById('sqlScript');
            const textArea = document.createElement('textarea');
            textArea.value = \`${sqlContent.replace(/`/g, '\\`')}\`;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            const btn = event.target;
            const originalText = btn.textContent;
            btn.textContent = '✅ Copied!';
            btn.style.background = '#10b981';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '#6b7280';
            }, 2000);
        }

        // Auto-open Supabase dashboard after 3 seconds
        setTimeout(() => {
            if (confirm('Ready to open Supabase dashboard for setup?')) {
                window.open('https://supabase.com/dashboard/project/cjfvdwmykwsvpkocqyev/settings/api', '_blank');
            }
        }, 3000);
    </script>
</body>
</html>`;

  // Save HTML guide
  const guidePath = path.join(__dirname, 'SUPABASE_SETUP_GUIDE.html');
  fs.writeFileSync(guidePath, htmlGuide);
  console.log('✅ Interactive setup guide created');

  // Step 3: Try to open the guide automatically
  console.log('\n🌐 Step 3: Opening interactive setup guide...');
  
  const openSuccess = await runCommand(`open "${guidePath}"`);
  if (!openSuccess) {
    // Try alternative methods
    await runCommand(`start "${guidePath}"`); // Windows
    await runCommand(`xdg-open "${guidePath}"`); // Linux
  }

  // Step 4: Display summary
  console.log('\n🎉 AUTOMATION COMPLETE!');
  console.log('======================');
  console.log('\n📁 Files created:');
  console.log('   ✅ COMPLETE_DATABASE_SETUP.sql - Complete SQL script');
  console.log('   ✅ SUPABASE_SETUP_GUIDE.html - Interactive guide');
  console.log('\n🔄 Next steps:');
  console.log('   1. 🔑 Get your service role key from Supabase');
  console.log('   2. 📝 Update .env.local file');
  console.log('   3. 📊 Run SQL script in Supabase dashboard');
  console.log('   4. 🚀 Restart your development server');
  
  console.log('\n🌐 Interactive guide should open automatically');
  console.log(`   Or manually open: ${guidePath}`);
  
  console.log('\n💡 Quick links:');
  console.log('   API Settings: https://supabase.com/dashboard/project/cjfvdwmykwsvpkocqyev/settings/api');
  console.log('   SQL Editor:   https://supabase.com/dashboard/project/cjfvdwmykwsvpkocqyev/sql');
  
  console.log('\n🎯 After setup, the database warning will disappear!');
}

// Run the ultimate setup
ultimateSetup().catch(console.error);
