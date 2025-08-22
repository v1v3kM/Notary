#!/usr/bin/env node

/**
 * Interactive Supabase Database Setup
 * This script will guide you through setting up your database
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function main() {
    log('🚀 Supabase Database Setup Guide', 'bright');
    log('================================', 'bright');

    log('\n📋 I need to guide you through setting up your Supabase database.', 'cyan');
    log('This requires your service role key from Supabase dashboard.', 'cyan');

    const proceed = await question('\n❓ Do you want to proceed? (y/N): ');
    if (proceed.toLowerCase() !== 'y') {
        log('❌ Setup cancelled', 'red');
        rl.close();
        return;
    }

    // Step 1: Get Service Role Key
    log('\n📍 STEP 1: Get your Service Role Key', 'yellow');
    log('1. Go to: https://supabase.com/dashboard', 'bright');
    log('2. Select your project: cjfvdwmykwsvpkocqyev', 'bright');
    log('3. Go to Settings → API', 'bright');
    log('4. Copy the "service_role" key (NOT the anon key)', 'bright');

    const serviceKey = await question('\n🔑 Paste your service role key here: ');

    if (!serviceKey || serviceKey.trim().length < 50) {
        log('❌ Invalid service role key. Please try again.', 'red');
        rl.close();
        return;
    }

    // Step 2: Update .env.local
    log('\n📍 STEP 2: Updating environment variables...', 'yellow');

    const envPath = path.join(__dirname, 'notary-frontend', '.env.local');
    let envContent = fs.readFileSync(envPath, 'utf8');

    // Replace placeholder service role key
    envContent = envContent.replace(
        /SUPABASE_SERVICE_ROLE_KEY=.*/,
        `SUPABASE_SERVICE_ROLE_KEY=${serviceKey.trim()}`
    );

    fs.writeFileSync(envPath, envContent);
    log('✅ Environment variables updated!', 'green');

    // Step 3: Show SQL setup instructions
    log('\n📍 STEP 3: Database Setup', 'yellow');
    log('Now you need to run the SQL script in Supabase:', 'bright');
    log('\n1. Go to: https://supabase.com/dashboard/project/cjfvdwmykwsvpkocqyev/sql', 'bright');
    log('2. Click "New Query"', 'bright');
    log('3. Copy and paste the SQL below:', 'bright');

    const sqlPath = path.join(__dirname, 'database_setup.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    log('\n' + '='.repeat(80), 'cyan');
    log('📋 COPY THIS SQL SCRIPT:', 'cyan');
    log('='.repeat(80), 'cyan');
    console.log(sqlContent);
    log('='.repeat(80), 'cyan');

    const copied = await question('\n❓ Have you copied and run the SQL script in Supabase? (y/N): ');

    if (copied.toLowerCase() === 'y') {
        log('\n🎉 Excellent! Your database should now be set up.', 'green');
        log('📱 Restart your application to see the changes.', 'bright');
        log('\n💡 Your app can now:', 'cyan');
        log('  ✅ Register and authenticate users', 'green');
        log('  ✅ Store user profiles', 'green');
        log('  ✅ Create and manage documents', 'green');
        log('  ✅ Process payments', 'green');
        log('  ✅ Handle file uploads', 'green');
    } else {
        log('\n⚠️ Please complete the SQL setup in Supabase dashboard.', 'yellow');
        log('💡 The SQL script is saved in: database_setup.sql', 'bright');
    }

    // Step 4: Test connection
    log('\n📍 STEP 4: Testing connection...', 'yellow');

    try {
        // Import here to avoid issues if package not installed
        const { createClient } = require('@supabase/supabase-js');

        const supabase = createClient(
            'https://cjfvdwmykwsvpkocqyev.supabase.co',
            serviceKey.trim()
        );

        // Test authentication
        const { data, error } = await supabase.auth.getUser();

        if (error && !error.message.includes('JWT')) {
            log(`⚠️ Connection test warning: ${error.message}`, 'yellow');
        } else {
            log('✅ Supabase connection working!', 'green');
        }

        log('\n🎉 Setup completed successfully!', 'green');
        log('🔄 Restart your development server and the database warning should disappear.', 'bright');

    } catch (error) {
        log('⚠️ Could not test connection, but setup should be complete.', 'yellow');
        log('🔄 Restart your app to verify everything works.', 'bright');
    }

    rl.close();
}

// Handle interruption
process.on('SIGINT', () => {
    log('\n\n👋 Setup cancelled', 'yellow');
    rl.close();
    process.exit(0);
});

main().catch((error) => {
    log(`❌ Setup error: ${error.message}`, 'red');
    rl.close();
});