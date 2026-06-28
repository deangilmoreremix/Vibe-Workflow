const MU_API_KEY = process.env.MU_API_KEY;
const MU_API_BASE = "https://api.muapi.ai";

async function handler(request) {
  const method = request.method.toUpperCase();

  if (method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      },
    });
  }

  const url = new URL(request.url);
  const params = url.pathname.split("/").slice(4);
  const path = "/" + (params.length ? params.join("/") : "") + url.search;

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": MU_API_KEY || "",
  };

  try {
    const response = await fetch(`${MU_API_BASE}${path}`, {
      method,
      headers,
      ...(method !== "GET" && method !== "HEAD" && method !== "OPTIONS" ? { body: await request.text() } : {}),
    });

    const data = await response.json().catch(() => ({}));

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH, handler as OPTIONS };
