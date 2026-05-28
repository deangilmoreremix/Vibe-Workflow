import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? 'https://bzxohkrxcwodllketcpz.supabase.co',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const MU_API_KEY = Deno.env.get('MU_API_KEY') ?? ''
const MU_API_BASE = 'https://api.muapi.ai'

export default async (req: Request) => {
  const url = new URL(req.url)
  const path = url.pathname.replace('/functions/v1/app', '') + url.search
  const method = req.method.toUpperCase()
  
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing authorization' }), { status: 401 })
  }
  
  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error } = await supabase.auth.getUser(token)
  
  if (error || !user) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 })
  }
  
  if (method === 'GET' && url.pathname.includes('get_file_upload_url')) {
    const response = await fetch(`${MU_API_BASE}/app/get_file_upload_url?${url.search}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': MU_API_KEY,
      },
    })
    const data = await response.json()
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  
  if (method === 'POST' && url.pathname.includes('calculate_dynamic_cost')) {
    const body = await req.json()
    const response = await fetch(`${MU_API_BASE}/app/calculate_dynamic_cost`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': MU_API_KEY,
      },
      body: JSON.stringify(body),
    })
    const data = await response.json()
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  
  return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })
}