# Notary (monorepo)

This repository contains two main parts:

- `notary-frontend/` — Next.js frontend (production app). This is the folder Vercel should build.
- `backend/` — Setup scripts, SQL schema, and utilities for initializing the Supabase database.
- `docs/` — Guides and setup documentation.

Quick commands

```
# Start frontend (dev)
cd notary-frontend && npm install && npm run dev

# See backend setup helpers
cd backend && node auto-setup.js
```
