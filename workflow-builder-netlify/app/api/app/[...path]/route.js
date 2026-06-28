const MU_API_KEY = process.env.MU_API_KEY;
const MU_API_BASE = "https://api.muapi.ai";

async function handler(request) {
  const method = request.method.toUpperCase();
  const url = new URL(request.url);
  const path = url.search;

  if (method === "GET" && path.includes("get_file_upload_url")) {
    const response = await fetch(`${MU_API_BASE}/app/get_file_upload_url?${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": MU_API_KEY || "",
      },
    });
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (method === "POST" && url.pathname.includes("calculate_dynamic_cost")) {
    const body = await request.json();
    const response = await fetch(`${MU_API_BASE}/app/calculate_dynamic_cost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": MU_API_KEY || "",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ error: "Not found" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH, handler as OPTIONS };
