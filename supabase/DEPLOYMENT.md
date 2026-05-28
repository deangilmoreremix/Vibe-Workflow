# Vibe Workflow - Supabase + Netlify Deployment

## Project Configuration

**Supabase Project:** bzxohkrxcwodllketcpz
**Netlify Deployment:** Ready for production

## Setup Instructions

### 1. Set Supabase Secrets

```bash
supabase secrets set MU_API_KEY=d370ae6ecc87e99654ed2220fba0d1511224f41623867aedc2c2a0a06f15b208 --project-ref bzxohkrxcwodllketcpz
```

### 2. Deploy Supabase Edge Functions

```bash
supabase functions deploy workflow --project-ref bzxohkrxcwodllketcpz
supabase functions deploy app --project-ref bzxohkrxcwodllketcpz
```

### 3. Run Migrations

In Supabase SQL editor or via psql:
```sql
-- This creates the workflows table for local persistence
-- MuAPI handles the actual workflow storage
create table workflows (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users,
  name text,
  data jsonb,
  created_at timestamp default now()
);
```

### 4. Netlify Deployment

Set environment variable in Netlify dashboard:
- `MU_API_KEY` - d370ae6ecc87e99654ed2220fba0d1511224f41623867aedc2c2a0a06f15b208

For local development:
```bash
cd workflow-builder-netlify
cp .env.local.example .env.local
netlify dev
```

## API Endpoints

**Supabase Functions:**
- `https://bzxohkrxcwodllketcpz.supabase.co/functions/v1/workflow/*`
- `https://bzxohkrxcwodllketcpz.supabase.co/functions/v1/app/*`

**Netlify Functions (after deploy):**
- `https://site-name.netlify.app/.netlify/functions/workflow/*`
- `https://site-name.netlify.app/.netlify/functions/app/*`

## Authentication

The app uses Supabase Auth. Users must be authenticated to access workflow features.

Environment variables set:
- `NEXT_PUBLIC_SUPABASE_URL` = https://bzxohkrxcwodllketcpz.supabase.co
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Configure in Netlify:
- `SUPABASE_URL` = https://bzxohkrxcwodllketcpz.supabase.co
- `SUPABASE_ANON_KEY` = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
- `SUPABASE_SERVICE_ROLE_KEY` = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...