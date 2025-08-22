# Supabase Setup Instructions

## 🚨 URGENT: Database Setup Required

**Current Error**: `Error creating user profile: {}`
**Cause**: The `users` table doesn't exist in your Supabase database
**Solution**: Run the SQL setup commands below

## Step 1: Create Database Tables (REQUIRED)

1. Go to your [Supabase SQL Editor](https://supabase.com/dashboard/projects/cjfvdwmykwsvpkocqyev/sql/new)
2. Copy and paste the contents of `database_setup.sql` (created in your project folder)
3. Click **Run** to execute all commands
4. Verify tables are created in the [Table Editor](https://supabase.com/dashboard/projects/cjfvdwmykwsvpkocqyev/editor)

### Expected Tables:
- ✅ `users` - User profiles and authentication data
- ✅ `documents` - Document management
- ✅ `payments` - Payment tracking

## Step 2: Create Storage Bucket (for file uploads)

1. Go to [Storage](https://supabase.com/dashboard/projects/cjfvdwmykwsvpkocqyev/storage/buckets)
2. Click **Create Bucket**
3. Name: `documents`
4. Set as **Public** bucket
5. Click **Create**

## Step 3: Test Signup Flow

After completing Steps 1 & 2:
1. Visit: http://localhost:3000/auth/signup
2. Complete registration process
3. Account creation should now work without errors

## Current Issues & Solutions

### 1. Storage Bucket Missing (Fixed by temporary bypass)
**Error**: `[StorageApiError]: Bucket not found`
**Solution**: Create storage bucket in Supabase Dashboard

### 2. Email Configuration Invalid
**Error**: `Invalid login: 535-5.7.8 Username and Password not accepted`
**Solution**: Update email credentials in `.env.local`

## Required Supabase Configuration

### Step 1: Create Storage Bucket
1. Go to your Supabase Dashboard: https://supabase.com/dashboard/projects/cjfvdwmykwsvpkocqyev
2. Navigate to **Storage** in the left sidebar
3. Click **Create Bucket**
4. Create a bucket named: `documents`
5. Set it as **Public** (for document access)

### Step 2: Verify Database Tables
Make sure these tables exist in your Supabase database:

```sql
-- Users table
CREATE TABLE users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE,
  name VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  role VARCHAR CHECK (role IN ('client', 'lawyer')) NOT NULL DEFAULT 'client',
  aadhaar_number VARCHAR,
  pan_number VARCHAR,
  address TEXT,
  specialization VARCHAR,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  agreement_type VARCHAR CHECK (agreement_type IN ('rent', 'affidavit', 'partnership')) NOT NULL,
  title VARCHAR NOT NULL,
  content JSONB NOT NULL,
  status VARCHAR CHECK (status IN ('draft', 'submitted', 'in_verification', 'approved', 'rejected', 'completed')) DEFAULT 'draft',
  lawyer_id UUID REFERENCES users(id),
  payment_status VARCHAR CHECK (payment_status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
  amount DECIMAL(10,2) NOT NULL,
  documents_uploaded TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES documents(id) NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR DEFAULT 'INR',
  payment_method VARCHAR NOT NULL,
  razorpay_payment_id VARCHAR,
  razorpay_order_id VARCHAR,
  status VARCHAR CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Step 3: Enable Row Level Security (RLS)
```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Documents policies
CREATE POLICY "Users can view own documents" ON documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own documents" ON documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own documents" ON documents FOR UPDATE USING (auth.uid() = user_id);

-- Payments policies
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own payments" ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Step 4: Update Email Configuration
Update your `.env.local` file with valid email credentials:

```bash
# Gmail Configuration (recommended)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password  # Use Gmail App Password, not regular password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# Or use other email service like SendGrid, AWS SES, etc.
```

## Current Workarounds Applied

### ✅ File Upload Bypass
- File uploads are temporarily disabled during signup
- Users can still register without uploading documents
- Files can be uploaded later after verification

### ✅ Email Service Bypass
- Welcome emails are temporarily disabled
- Signup still works with Supabase email verification
- Email functionality can be re-enabled after configuration

## Testing Signup Flow

1. Go to: http://localhost:3000/auth/signup
2. Complete all 4 steps
3. Files will be noted but not uploaded
4. Account will be created in Supabase
5. User will receive verification email from Supabase

## Next Steps

1. **Create the storage bucket** (most important)
2. **Verify database tables exist**
3. **Update email credentials** (optional)
4. **Test the complete signup flow**
5. **Re-enable file uploads** once storage is configured

The signup process should now work without the storage and email errors!
