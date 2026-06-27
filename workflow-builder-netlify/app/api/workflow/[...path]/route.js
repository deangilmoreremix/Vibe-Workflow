import { NextResponse } from "next/server";

const MU_API_KEY = process.env.MU_API_KEY || "";
const MU_API_BASE = "https://api.muapi.ai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Cookie",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Credentials": "true",
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function buildTargetUrl(req, params) {
  const splat = Array.isArray(params.path) ? params.path.join("/") : "";
  const url = new URL(req.url);
  const search = url.search || "";
  const path = splat.startsWith("/") ? splat : `/${splat}`;
  return `${MU_API_BASE}/workflow${path}${search}`;
}

async function proxy(req, params) {
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 200, headers: corsHeaders });
  }

  const targetUrl = buildTargetUrl(req, params);
  const method = req.method.toUpperCase();

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": MU_API_KEY,
  };

  const incomingAuth = req.headers.get("authorization");
  if (incomingAuth) headers["Authorization"] = incomingAuth;

  const incomingCookie = req.headers.get("cookie");
  if (incomingCookie) headers["Cookie"] = incomingCookie;

  let body;
  if (method !== "GET" && method !== "HEAD") {
    try {
      body = await req.text();
    } catch (e) {
      body = undefined;
    }
  }

  try {
    const response = await fetch(targetUrl, {
      method,
      headers,
      ...(body ? { body } : {}),
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") || "application/json";
    const responseBody = await response.text();

    return new NextResponse(responseBody, {
      status: response.status,
      headers: {
        ...corsHeaders,
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    console.error("Workflow proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function GET(req, ctx) {
  return proxy(req, ctx.params);
}
export async function POST(req, ctx) {
  return proxy(req, ctx.params);
}
export async function PUT(req, ctx) {
  return proxy(req, ctx.params);
}
export async function PATCH(req, ctx) {
  return proxy(req, ctx.params);
}
export async function DELETE(req, ctx) {
  return proxy(req, ctx.params);
}
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}
