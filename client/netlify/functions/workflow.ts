import { Context } from "@netlify/functions";

const MU_API_KEY = process.env.MU_API_KEY || Netlify.env.get("MU_API_KEY");
const MU_API_BASE = "https://api.muapi.ai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

export default async (req: Request, context: Context) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace("/.netlify/functions/workflow", "") + url.search;
  const method = req.method.toUpperCase();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "x-api-key": MU_API_KEY || "",
  };

  try {
    const response = await fetch(`${MU_API_BASE}${path}`, {
      method,
      headers,
      ...(req.body ? { body: JSON.stringify(await req.json()) } : {}),
    });

    const data = await response.json().catch(() => ({}));

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

export const config = {
  runtime: "edge",
};
