# 🚀 Supabase Database Setup - Complete Guide

## 🎯 Quick Setup (2 minutes)

### Step 1: Get Your Service Role Key
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/cjfvdwmykwsvpkocqyev)
2. Click **Settings** → **API** 
3. Copy the **`service_role`** key (the long one, NOT the anon key)
4. Replace the placeholder in `notary-frontend/.env.local`:
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=your_real_service_role_key_here
   ```
