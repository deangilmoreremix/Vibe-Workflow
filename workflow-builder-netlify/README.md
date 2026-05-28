# Vibe Workflow - Supabase + Netlify Deployment

Open-source node-based AI workflow builder using Supabase Edge Functions and Netlify.

## Architecture

```
workflow-builder-netlify/
├── app/                    # Next.js frontend
│   ├── workflow/          # Workflow pages
│   └── layout.js
├── netlify.toml           # Netlify configuration
└── netlify/functions/     # Netlify Edge Functions
    ├── workflow.ts        # Proxies to MuAPI workflow endpoints
    └── app.ts             # Proxies to MuAPI app endpoints
```

## Setup

### 1. Install Netlify CLI
```bash
npm install -g netlify-cli
```

### 2. Configure Environment Variables
```bash
cp .env.local.example .env.local
# Edit .env.local and add your MuAPI key
```

### 3. Install Dependencies
```bash
npm install
npm run build:lib
```

### 4. Run Locally
```bash
netlify dev
```

### 5. Deploy to Netlify
```bash
netlify deploy --prod
```

## Supabase Setup (Alternative)

If using Supabase Edge Functions instead of Netlify:

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Initialize and deploy:
```bash
supabase functions deploy workflow --project-ref YOUR_PROJECT_REF
supabase functions deploy app --project-ref YOUR_PROJECT_REF
```

## Environment Variables

Required variables for Netlify (set in Site Settings > Build & Deploy > Environment):
- `MU_API_KEY` - Your MuAPI key from https://muapi.ai

For local development, add to `.env.local`:
- `NEXT_PUBLIC_API_URL` - Set to empty string for Netlify functions, or a custom API URL

## How It Works

1. **Frontend**: Next.js app deployed to Netlify
2. **API Layer**: Netlify Edge Functions proxy requests to MuAPI
3. **AI Processing**: MuAPI handles all image/video generation via workflow nodes
4. **Storage**: Files are uploaded directly to MuAPI's storage via signed URLs

## API Routes

The Netlify functions proxy these endpoints:

- `/api/workflow/*` → `https://api.muapi.ai/workflow/*`
- `/api/app/*` → `https://api.muapi.ai/app/*`

All requests include the `x-api-key` header with your MuAPI key.