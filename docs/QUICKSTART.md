Quick start to get the Notary project running locally

This file contains the minimal steps to make the app runnable for development with Supabase.

Prerequisites
- Node.js (recommend 18+)
- npm or yarn
- A Supabase project (free tier is fine)
- supabase CLI (optional, but helpful)

1) Create Supabase project
- Create a new project at https://app.supabase.com
- Note the project URL and anon key
- Go to Settings > API and copy the `service_role` key (keep it secret)
- In Storage create a bucket named: `documents` and set it to public (or adapt code to private uploads)

2) Prepare frontend env
- Copy `notary-frontend/.env.example` to `notary-frontend/.env.local`
- Fill the following values:
  - NEXT_PUBLIC_SUPABASE_URL=<your-project-url>
  - NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
  - SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>  # only for setup scripts; do NOT commit
  - OPTIONAL: Razorpay keys if testing payments

3) Run database SQL
Option A (recommended manual):
- Open Supabase dashboard -> SQL Editor
- Open the file `database-schema.sql` in this repo and run its contents
- Then optionally run `insert-sample-data.sql` to populate demo data

Option B (automated script):
- From repo root run: `node auto-setup.js`
- If `SUPABASE_SERVICE_ROLE_KEY` is missing the script will still generate `auto-generated-setup.sql` for manual execution

4) Run frontend

```bash
cd notary-frontend
npm install
npm run dev
```

5) Open the app
- Visit http://localhost:3000
- Signup page (if present) at /auth/signup

Notes & troubleshooting
- If you see storage errors, verify the `documents` bucket exists and is public.
- If auth/profile creation fails, confirm the `users` table exists and RLS policies were applied.
- If you don't want to run Supabase, the frontend supports demo mode (see the frontend README).

Security
- Never commit `.env.local` or your service role key to git. Add it to `.gitignore`.

If you want, I can now:
- run a repo cleanup to unify SQL UUID usage and remove duplicate SQL files
- create a small script to apply the SQL via Supabase CLI (if you provide the project ref)
- attempt to start the frontend here (requires valid env values)

