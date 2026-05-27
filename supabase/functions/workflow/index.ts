import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const MU_API_KEY = Deno.env.get('MU_API_KEY') ?? ''
const MU_API_BASE = 'https://api.muapi.ai'

export default async (req: Request) => {
  const url = new URL(req.url)
  const path = url.pathname.replace('/functions/v1/workflow', '') + url.search
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
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'x-api-key': MU_API_KEY,
    'user_id': user.id,
  }
  
  const options: RequestInit = { method, headers }
  
  if (method !== 'GET' && method !== 'DELETE' && req.body) {
    const body = await req.json()
    options.body = JSON.stringify(body)
  }
  
  const response = await fetch(`${MU_API_BASE}${path}`, options)
  const data = await response.json()
  
  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { 'Content-Type': 'application/json' },
  })
}