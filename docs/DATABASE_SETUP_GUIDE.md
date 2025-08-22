# Database Setup Checklist

## 📋 **Step-by-Step Database Setup Instructions**

### 1. **Get Complete Supabase Credentials**
- [ ] Copy the complete **anon public key** from Supabase dashboard
- [ ] Get the **service role key** (click "here" link in the API section)
- [ ] Verify the project URL: `https://uqrxp1odehgqwtbhjsx.supabase.co`

### 2. **Update Environment Variables**
- [ ] Update `.env.local` with complete API keys
- [ ] Set `NEXT_PUBLIC_DEMO_MODE=false` to use real backend
- [ ] Add service role key for server-side operations

### 3. **Execute Database Scripts**
**In your Supabase SQL Editor, run these scripts in order:**

#### Step 1: Create Database Schema
```sql
-- Execute: database-schema.sql
-- This creates all tables, indexes, and security policies
```

#### Step 2: Insert Sample Data
```sql
-- Execute: insert-sample-data.sql  
-- This populates tables with realistic test data
```

### 4. **Verify Database Setup**
After running the scripts, check that these tables exist:
- [ ] `users` table
- [ ] `lawyer_profiles` table
- [ ] `availability_slots` table
- [ ] `appointments` table
- [ ] `appointment_payments` table
- [ ] `documents` table
- [ ] `document_payments` table

### 5. **Test API Connection**
Once database is set up:
- [ ] Restart Next.js development server
- [ ] Test `/api/lawyers` endpoint
- [ ] Verify frontend loads lawyer data from database

## 🔧 **Files Created:**

1. **`database-schema.sql`** - Complete database structure
   - All required tables with proper relationships
   - Indexes for performance
   - Row Level Security (RLS) policies
   - Triggers for automatic timestamps

2. **`insert-sample-data.sql`** - Realistic test data
   - 3 sample lawyers with different specializations
   - 30 days of availability slots for each lawyer
   - Sample appointments and documents
   - Payment records

## ⚠️ **Important Notes:**

- The database uses **paise** (smallest Indian currency unit) for all amounts
- RLS policies ensure data security and proper access control
- UUIDs are used for all primary keys for better security
- Sample data includes realistic Indian names, locations, and specializations

## 🚀 **Next Steps After Database Setup:**

1. Update environment variables with real Supabase credentials
2. Switch from demo mode to production mode
3. Test the complete appointment booking flow
4. Verify data persistence and API functionality

---

**Ready to proceed once you have the complete Supabase credentials!**
