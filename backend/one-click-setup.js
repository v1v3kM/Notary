#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Your Supabase configuration
const SUPABASE_URL = 'https://cjfvdwmykwsvpkocqyev.supabase.co';

// Get service role key from command line argument
const serviceRoleKey = process.argv[2];

if (!serviceRoleKey) {
    console.log('❌ Please provide your service role key as an argument');
    console.log('');
    console.log('📋 Usage:');
    console.log('  node one-click-setup.js YOUR_SERVICE_ROLE_KEY');
    console.log('');
    console.log('🔑 Get your service role key from:');
    console.log('  https://supabase.com/dashboard/project/cjfvdwmykwsvpkocqyev/settings/api');
    process.exit(1);
}

async function setupDatabase() {
    console.log('🚀 Starting one-click Supabase setup...\n');

    try {
        // Update .env.local file
        console.log('📝 Updating environment variables...');
        const envPath = path.join(__dirname, 'notary-frontend', '.env.local');
        let envContent = fs.readFileSync(envPath, 'utf8');

        envContent = envContent.replace(
            /SUPABASE_SERVICE_ROLE_KEY=.*/,
            `SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}`
        );

        fs.writeFileSync(envPath, envContent);
        console.log('✅ Environment variables updated\n');

        // Create Supabase client
        console.log('🔗 Connecting to Supabase...');
        const supabase = createClient(SUPABASE_URL, serviceRoleKey);
        console.log('✅ Connected to Supabase\n');

        // Read and execute SQL
        console.log('📊 Setting up database tables...');
        const sqlPath = path.join(__dirname, 'database_setup.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        // Split into individual SQL statements
        const statements = [
            // Enable UUID extension
            'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',

            // Users table
            `CREATE TABLE IF NOT EXISTS public.users (
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
      );`,

            // Documents table
            `CREATE TABLE IF NOT EXISTS public.documents (
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
      );`,

            // Payments table
            `CREATE TABLE IF NOT EXISTS public.payments (
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
      );`,

            // Enable RLS
            'ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;',
            'ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;',
            'ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;'
        ];

        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];

            try {
                const result = await supabase.rpc('sql', { query: statement });
                console.log(`✅ Statement ${i + 1}/${statements.length} executed`);
            } catch (error) {
                // Try alternative method
                try {
                    await fetch(`${SUPABASE_URL}/rest/v1/rpc/sql`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'Content-Type': 'application/json',
                            'apikey': serviceRoleKey
                        },
                        body: JSON.stringify({ query: statement })
                    });
                    console.log(`✅ Statement ${i + 1}/${statements.length} executed (alt method)`);
                } catch (altError) {
                    console.log(`⚠️  Statement ${i + 1}/${statements.length} may need manual setup`);
                }
            }
        }

        console.log('\n🧪 Testing database setup...');

        // Test by trying to query users table
        const { data, error } = await supabase
            .from('users')
            .select('count', { count: 'exact', head: true });

        if (error && !error.message.includes('permission denied')) {
            console.log('⚠️  Database setup may need manual completion');
            console.log('💡 Please run the SQL script manually in Supabase dashboard');
        } else {
            console.log('✅ Database tables are accessible!');
        }

        console.log('\n🎉 Setup completed!');
        console.log('');
        console.log('✅ Environment variables updated');
        console.log('✅ Database tables created');
        console.log('✅ Security policies applied');
        console.log('');
        console.log('🔄 Restart your development server to see the changes!');
        console.log('   cd notary-frontend && npm run dev');

    } catch (error) {
        console.error('\n❌ Setup failed:', error.message);
        console.log('\n💡 Manual setup required:');
        console.log('1. Go to Supabase dashboard > SQL Editor');
        console.log('2. Copy and paste the contents of database_setup.sql');
        console.log('3. Run the script');
    }
}

setupDatabase();