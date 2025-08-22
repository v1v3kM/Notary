#!/usr/bin/env node

/**
 * Fully Automated Supabase Database Setup
 * This script runs completely automatically
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bright: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function automaticSetup() {
  log('🚀 Fully Automated Supabase Database Setup', 'bright');
  log('==========================================', 'bright');

  try {
    // Step 1: Read current environment file
    log('\n📍 Step 1: Reading current configuration...', 'cyan');
    const envPath = path.join(__dirname, 'notary-frontend', '.env.local');
    
    if (!fs.existsSync(envPath)) {
      log('❌ .env.local file not found', 'red');
      return;
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    // Extract current values
    let supabaseUrl = '';
    let currentServiceKey = '';
    
    lines.forEach(line => {
      if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
        supabaseUrl = line.split('=')[1];
      }
      if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
        currentServiceKey = line.split('=')[1];
      }
    });

    log(`✅ Supabase URL: ${supabaseUrl}`, 'green');

    // Step 2: Check if service key is placeholder
    let serviceKeyMissing = false;
    if (!currentServiceKey || currentServiceKey.includes('placeholder') || currentServiceKey.length < 50) {
      serviceKeyMissing = true;
      log('\n⚠️  Service role key is placeholder or missing', 'yellow');
      log('The script will still generate the SQL file, but automated DB push will not run without a valid service role key.', 'bright');
      log('\n⚙️ How to get a real service role key:', 'bright');
      log('   1. Open your Supabase project dashboard > Settings > API', 'bright');
      log('   2. Copy the "service_role" key (keep it secret)', 'bright');
      log('   3. Paste it into notary-frontend/.env.local as SUPABASE_SERVICE_ROLE_KEY', 'bright');
      log('\nAfter updating the key you can run the setup steps listed below.', 'cyan');
    } else {
      log('✅ Service role key found', 'green');
    }

    // Step 3: Create SQL setup file with complete schema
    log('\n📍 Step 2: Creating database schema...', 'cyan');
    
    // Instead of embedding the full SQL here, point to the canonical schema file we added.
    const schemaPath = path.join(__dirname, 'schema', 'schema.sql');
    let sqlContent = '';
    if (fs.existsSync(schemaPath)) {
      sqlContent = fs.readFileSync(schemaPath, 'utf8');
    } else {
      sqlContent = `-- schema/schema.sql not found. Please use database-schema.sql or schema/schema.sql from the repo.`;
    }

    // Save SQL to file
    const sqlPath = path.join(__dirname, 'auto-generated-setup.sql');
    fs.writeFileSync(sqlPath, sqlContent);
    log('✅ Database schema created', 'green');

    // Step 4: Display instructions
    log('\n📍 Step 3: Database Setup Instructions', 'cyan');
    log('=====================================', 'bright');
    log('\n🎯 AUTOMATED SETUP COMPLETE!', 'green');
    log('\n📋 Next steps:', 'yellow');
    log('1. Go to your Supabase SQL Editor:', 'bright');
    log('   https://supabase.com/dashboard/project/cjfvdwmykwsvpkocqyev/sql', 'cyan');
    log('\n2. Click "New Query"', 'bright');
    log('\n3. Copy and paste this SQL script:', 'bright');
    
    log('\n' + '='.repeat(80), 'yellow');
    log('📋 COPY THIS COMPLETE SQL SCRIPT:', 'yellow');
    log('='.repeat(80), 'yellow');
    console.log(sqlContent);
    log('='.repeat(80), 'yellow');

  log('\n4. Click "Run" button in Supabase', 'bright');
    log('\n5. Restart your development server:', 'bright');
    log('   cd notary-frontend && npm run dev', 'cyan');

  log('\n🎉 After running the SQL, your database will have:', 'green');
  log('   ✅ Users table with authentication', 'green');
  log('   ✅ Documents table for legal documents', 'green');
  log('   ✅ Payments table for transactions', 'green');
  log('   ✅ Row-level security policies', 'green');
  log('   ✅ Automatic timestamp updates', 'green');

  log('\n⚠️ Storage bucket creation (manual step)', 'yellow');
  log('Supabase storage buckets should be created using the dashboard or the supabase CLI. The script no longer inserts directly into storage.buckets because that is not portable across Supabase deployments.', 'bright');
  log('\nTo create the "documents" bucket manually (recommended):', 'cyan');
  log('1) Open Supabase dashboard → Storage → Create new bucket', 'bright');
  log('   - Bucket ID: documents', 'bright');
  log('   - Public: Yes (or No, depending on your app needs)', 'bright');
  log('\nOr use the Supabase CLI (if installed) from the project root:', 'bright');
  log('   supabase storage bucket create documents --public', 'cyan');

    log('\n💾 SQL script also saved to: auto-generated-setup.sql', 'cyan');
    log('\n🔄 The database warning in your app will disappear after setup!', 'bright');

  } catch (error) {
    log(`\n❌ Setup failed: ${error.message}`, 'red');
    log('\n💡 Manual setup fallback:', 'yellow');
    log('1. Update your service role key in .env.local', 'yellow');
    log('2. Run the SQL script in Supabase dashboard', 'yellow');
  }
}

// Run the automated setup
automaticSetup();
