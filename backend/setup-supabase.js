#!/usr/bin/env node

/**
 * Automated Supabase Database Setup Script
 * This script will set up your Supabase database tables automatically
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// ANSI color codes for pretty output
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

async function execCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject({ error, stderr });
            } else {
                resolve(stdout);
            }
        });
    });
}

async function checkSupabaseAuth() {
    try {
        const result = await execCommand('supabase auth status');
        return result.includes('Logged in');
    } catch (error) {
        return false;
    }
}

async function loginToSupabase() {
    log('\n🔐 Logging into Supabase...', 'cyan');
    try {
        await execCommand('supabase auth login');
        log('✅ Successfully logged into Supabase!', 'green');
        return true;
    } catch (error) {
        log('❌ Failed to login to Supabase', 'red');
        console.error(error.stderr);
        return false;
    }
}

async function linkProject() {
    const projectRef = await question('\n📝 Enter your Supabase project reference (from your project URL): ');

    if (!projectRef) {
        log('❌ Project reference is required', 'red');
        return false;
    }

    log(`\n🔗 Linking to project: ${projectRef}`, 'cyan');
    try {
        await execCommand(`supabase link --project-ref ${projectRef}`);
        log('✅ Successfully linked to Supabase project!', 'green');
        return true;
    } catch (error) {
        log('❌ Failed to link project', 'red');
        console.error(error.stderr);
        return false;
    }
}

async function runDatabaseSetup() {
    const sqlFilePath = path.join(__dirname, 'database_setup.sql');

    if (!fs.existsSync(sqlFilePath)) {
        log('❌ database_setup.sql file not found', 'red');
        return false;
    }

    log('\n📊 Running database setup script...', 'cyan');
    try {
        await execCommand(`supabase db push --file ${sqlFilePath}`);
        log('✅ Database tables created successfully!', 'green');
        return true;
    } catch (error) {
        log('❌ Failed to create database tables', 'red');

        // Try alternative method - direct SQL execution
        log('\n🔄 Trying alternative method...', 'yellow');
        try {
            const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
            await execCommand(`supabase db sql --stdin`, { input: sqlContent });
            log('✅ Database setup completed using alternative method!', 'green');
            return true;
        } catch (altError) {
            console.error(altError.stderr);
            return false;
        }
    }
}

async function createStorageBucket() {
    log('\n📁 Setting up storage bucket...', 'cyan');
    try {
        // Create documents bucket
        await execCommand('supabase storage bucket create documents --public');
        log('✅ Documents storage bucket created!', 'green');
        return true;
    } catch (error) {
        if (error.stderr.includes('already exists')) {
            log('ℹ️ Documents bucket already exists', 'yellow');
            return true;
        } else {
            log('❌ Failed to create storage bucket', 'red');
            console.error(error.stderr);
            return false;
        }
    }
}

async function testConnection() {
    log('\n🧪 Testing database connection...', 'cyan');
    try {
        const result = await execCommand('supabase db sql --query "SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\' AND table_name IN (\'users\', \'documents\', \'payments\');"');

        if (result.includes('users') && result.includes('documents') && result.includes('payments')) {
            log('✅ All required tables are present!', 'green');
            return true;
        } else {
            log('⚠️ Some tables may be missing', 'yellow');
            return false;
        }
    } catch (error) {
        log('❌ Failed to test database connection', 'red');
        return false;
    }
}

async function main() {
    log('🚀 Supabase Database Setup Automation', 'bright');
    log('=====================================', 'bright');

    // Check if already authenticated
    const isAuthenticated = await checkSupabaseAuth();

    if (!isAuthenticated) {
        const shouldLogin = await question('\n❓ You need to login to Supabase. Proceed? (y/N): ');
        if (shouldLogin.toLowerCase() !== 'y') {
            log('❌ Setup cancelled', 'red');
            rl.close();
            return;
        }

        const loginSuccess = await loginToSupabase();
        if (!loginSuccess) {
            rl.close();
            return;
        }
    } else {
        log('✅ Already logged into Supabase', 'green');
    }

    // Link project
    const linkSuccess = await linkProject();
    if (!linkSuccess) {
        rl.close();
        return;
    }

    // Run database setup
    const dbSuccess = await runDatabaseSetup();
    if (!dbSuccess) {
        log('\n💡 Manual setup required:', 'yellow');
        log('1. Go to your Supabase dashboard', 'yellow');
        log('2. Open SQL Editor', 'yellow');
        log('3. Copy and paste the contents of database_setup.sql', 'yellow');
        log('4. Run the script', 'yellow');
    }

    // Create storage bucket
    await createStorageBucket();

    // Test connection
    await testConnection();

    log('\n🎉 Supabase setup completed!', 'green');
    log('Your application should now work with the database.', 'bright');

    rl.close();
}

// Handle errors gracefully
process.on('uncaughtException', (error) => {
    log(`❌ Unexpected error: ${error.message}`, 'red');
    rl.close();
});

process.on('unhandledRejection', (reason, promise) => {
    log(`❌ Unhandled rejection: ${reason}`, 'red');
    rl.close();
});

// Run the setup
main().catch((error) => {
    log(`❌ Setup failed: ${error.message}`, 'red');
    rl.close();
});