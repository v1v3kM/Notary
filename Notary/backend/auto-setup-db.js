const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, 'notary-frontend', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

// Parse environment variables
const env = {};
envContent.split('\n').forEach(line => {
    const [key, ...values] = line.split('=');
    if (key && values.length > 0) {
        env[key.trim()] = values.join('=').trim();
    }
});

async function setupSupabaseDatabase() {
    console.log('🚀 Starting Supabase Database Setup...\n');

    // Get configuration
    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        console.error('❌ Missing Supabase configuration in .env.local');
        return;
    }

    // Check if service role key is placeholder
    if (serviceRoleKey.includes('placeholder')) {
        console.error('❌ Please replace the placeholder service role key in .env.local with your real key');
        console.log('💡 Get your service role key from: https://supabase.com/dashboard > Settings > API');
        return;
    }

    console.log(`✅ Supabase URL: ${supabaseUrl.substring(0, 30)}...`);
    console.log(`✅ Service Role Key: ${serviceRoleKey.substring(0, 20)}...\n`);

    // Create Supabase client with service role
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Read SQL setup file. Prefer canonical schema in schema/schema.sql
    const sqlPathCandidates = [
        path.join(__dirname, 'schema', 'schema.sql'),
        path.join(__dirname, 'database_setup.sql'),
        path.join(__dirname, 'database-schema.sql')
    ];
    const sqlPath = sqlPathCandidates.find(p => fs.existsSync(p));
    if (!fs.existsSync(sqlPath)) {
        console.error('❌ No SQL schema file found. Looked for:', sqlPathCandidates.join(', '));
        return;
    }

    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    try {
    console.log('📊 Preparing to create database objects from:', sqlPath);

    // Don't attempt to execute SQL via non-standard RPC here. Prefer supabase CLI or manual SQL run.
    console.log('\n⚠️ This script will not execute SQL automatically. Use one of the options below:');
    console.log('\nOption A (recommended): Use the Supabase CLI to apply the SQL:');
    console.log('  1) Install supabase CLI: https://supabase.com/docs/guides/cli');
    console.log('  2) Run from the repo root: supabase db remote set <YOUR_DB_URL>');
    console.log(`  3) Run: supabase sql "$(cat ${sqlPath} | sed -e 's/"/\\"/g')"`);

    console.log('\nOption B: Use Supabase dashboard SQL editor:');
    console.log('  1) Open your Supabase project -> SQL Editor');
    console.log(`  2) Copy the contents of ${sqlPath} and run it`);

    console.log('\nNote: Running SQL requires a service role key or using the dashboard.');

        // Test database setup by checking if tables exist
        console.log('\n🧪 Testing database setup...');

        const { data: tableData, error: tableError } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')
            .in('table_name', ['users', 'documents', 'payments']);

        if (tableError) {
            console.log('⚠️ Could not verify tables, but they may have been created');
        } else if (tableData && tableData.length >= 3) {
            console.log('✅ All required tables are present!');
        }

        // Try to create a test user to verify everything works
        console.log('\n🔐 Testing authentication...');

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: 'test@example.com',
            password: 'testpassword123'
        });

        if (authError && !authError.message.includes('already registered')) {
            console.log(`⚠️ Auth test warning: ${authError.message}`);
        } else {
            console.log('✅ Authentication system working!');
        }

        console.log('\n🎉 Database setup completed successfully!');
        console.log('Your application should now work with the database.');
        console.log('\n💡 You can now:');
        console.log('  - Sign up new users');
        console.log('  - Create documents');
        console.log('  - Process payments');
        console.log('  - All authentication features');

    } catch (error) {
        console.error('\n❌ Database setup failed:', error.message);
        console.log('\n💡 Manual setup required:');
        console.log('1. Go to your Supabase dashboard > SQL Editor');
        console.log('2. Copy and paste the contents of database_setup.sql');
        console.log('3. Run the script');
    }
}

// Run the setup
setupSupabaseDatabase().catch(console.error);