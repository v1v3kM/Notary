#!/usr/bin/env node

/**
 * Supabase Database Setup via REST API
 * This script sets up your database using Supabase's REST API
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Colors for output
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

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

function makeRequest(options, data = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

async function setupDatabase() {
    log('🚀 Supabase Database Setup via API', 'bright');
    log('==================================', 'bright');

    // Get environment variables or ask for them
    let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
        supabaseUrl = await question('\n📝 Enter your Supabase project URL: ');
    }

    if (!supabaseKey) {
        supabaseKey = await question('🔑 Enter your Supabase service role key: ');
    }

    if (!supabaseUrl || !supabaseKey) {
        log('❌ Both Supabase URL and service role key are required', 'red');
        rl.close();
        return;
    }

    // Extract project reference from URL
    const urlMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
    if (!urlMatch) {
        log('❌ Invalid Supabase URL format', 'red');
        rl.close();
        return;
    }

    const projectRef = urlMatch[1];
    log(`\n🔗 Project: ${projectRef}`, 'cyan');

    // Prefer canonical schema file
    const sqlFilePathCandidates = [
        path.join(__dirname, 'schema', 'schema.sql'),
        path.join(__dirname, 'database_setup.sql'),
        path.join(__dirname, 'database-schema.sql')
    ];
    const sqlFilePath = sqlFilePathCandidates.find(p => fs.existsSync(p));

    if (!sqlFilePath) {
        log('❌ No SQL schema file found. Please ensure schema/schema.sql or database_setup.sql exists in the repo.', 'red');
        rl.close();
        return;
    }

    log('\n📋 SQL file to run: ' + sqlFilePath, 'cyan');
    log('\n⚠️ This script will NOT execute SQL via the REST RPC endpoint because that endpoint is not available on all Supabase projects.', 'yellow');
    log('\nPlease use one of the options below to apply the SQL:', 'bright');
    log('\nOption A (recommended): Supabase Dashboard', 'cyan');
    log('  1) Open your Supabase project → SQL Editor', 'bright');
    log(`  2) Copy the contents of ${sqlFilePath} and run it`, 'bright');

    log('\nOption B: Supabase CLI (if installed)', 'cyan');
    log('  1) Install supabase CLI: https://supabase.com/docs/guides/cli', 'bright');
    log('  2) From project root run: supabase db remote set <YOUR_DB_URL>', 'bright');
    log(`  3) Run: supabase sql "$(cat ${sqlFilePath} | sed -e 's/"/\\"/g')"`, 'bright');

    log('\nAfter running the SQL, create the storage bucket named "documents" via the dashboard or CLI.', 'bright');

    rl.close();
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    log('\n\n👋 Setup cancelled by user', 'yellow');
    rl.close();
    process.exit(0);
});

// Run the setup
setupDatabase().catch((error) => {
    log(`❌ Setup failed: ${error.message}`, 'red');
    rl.close();
});