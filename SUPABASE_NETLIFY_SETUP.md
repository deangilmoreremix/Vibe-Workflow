# Vibe Workflow - Supabase + Netlify Deployment

## Overview

Vibe Workflow is now configured as a standalone application using:
- **Supabase Edge Functions** (or Netlify Functions) for API proxy
- **MuAPI** for image/video AI generation
- **Netlify** for frontend hosting

## Architecture

```
workflow-builder-netlify/          supabase/
├── app/                           ├── functions/
│   ├── workflow/              │   │   ├── workflow/
│   └── [id]/                        │   │   │   └── index.ts   # API proxy to MuAPI
│       └── page.js          │   │   └── app/           # File upload endpoints
│       └── WorkflowBuilderClient.js│   └── migrations/
├── netlify.toml                    │       └── create_workflows.sql
├── netlify/functions/              └── config.toml
│   ├── workflow.ts            # Netlify Edge Function
│   └── app.ts                 # File upload helper
├── package.json
└── next.config.mjs
```

## Quick Start

### Option A: Netlify Functions (Recommended)

1. Install dependencies:
```bash
npm install
npm run build:lib
```

2. Run locally:
```bash
cp workflow-builder-netlify/.env.local.example workflow-builder-netlify/.env.local
# Add your MU_API_KEY
netlify dev
```

3. Deploy to Netlify:
```bash
netlify deploy --prod
```

**Set in Netlify Dashboard:**
- `MU_API_KEY` - Your MuAPI key from https://muapi.ai

### Option B: Supabase Edge Functions

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login and link project:
```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

3. Set secrets:
```bash
supabase secrets set MU_API_KEY=your_api_key_here
```

4. Deploy functions:
```bash
supabase functions deploy workflow
supabase functions deploy app
```

5. Serve locally (optional):
```bash
supabase start
supabase functions serve workflow
supabase functions serve app
```

**Set in Supabase Dashboard:**
- `MU_API_KEY` - Your MuAPI key
- `SUPABASE_URL` - Your project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key

## Environment Variables

| Variable | Description | Where to Set |
|----------|-------------|--------------|
| `MU_API_KEY` | MuAPI key for AI generation | Required |
| `NEXT_PUBLIC_API_URL` | API base URL for local dev | Optional (empty in production) |

## API Endpoints

Both Netlify and Supabase functions proxy to MuAPI:

| Endpoint | Description |
|----------|-------------|
| `/api/workflow/create` | Create workflow |
| `/api/workflow/get-workflow-defs` | Get all workflows |
| `/api/workflow/get-workflow-def/{id}` | Get single workflow |
| `/api/workflow/{id}/node-schemas` | Get node schemas |
| `/api/workflow/{id}/run` | Run workflow |
| `/api/workflow/run/{run_id}/status` | Check run status |
| `/api/app/get_file_upload_url` | Get file upload URL |

## Supabase Storage (Optional)

To enable Supabase Storage for file persistence:

1. Create a storage bucket:
```sql
insert into storage.buckets (id, name, public) 
values ('workflow-assets', 'workflow-assets', true);
```

2. Update the `get_file_upload_url` function to use Supabase storage instead of MuAPI CDN.

## File Structure

```
workflow-builder-netlify/
├── app/
│   ├── globals.css
│   ├── layout.js
│   └── workflow/
│       ├── page.js                    # Workflow listing
│       ├── WorkflowListingClient.js   # Listing component
│       └── [id]/
│           ├── page.js                # Workflow editor page
│           └── WorkflowBuilderClient.js
├── netlify.toml                       # Netlify config
├── netlify/functions/
│   ├── workflow.ts                   # Proxy all /api/workflow/*
│   └── app.ts                        # Helper endpoints
├── package.json
├── next.config.mjs
├── tailwind.config.js
└── postcss.config.js
```

## Notes

- The Netlify functions are simpler (no auth check) - suitable for public/demo usage
- The Supabase functions include auth verification via Supabase Auth
- Both configurations use the same frontend code in `workflow-builder-netlify/`
- File uploads go directly to MuAPI's CDN via signed URLs