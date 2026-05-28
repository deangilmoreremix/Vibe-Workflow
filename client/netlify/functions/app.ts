import { Context } from "@netlify/functions";

const MU_API_KEY = process.env.MU_API_KEY || Netlify.env.get("MU_API_KEY");
const MU_API_BASE = "https://api.muapi.ai";

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const path = url.pathname.replace("/.netlify/functions/app", "") + url.search;
  const method = req.method.toUpperCase();

  if (method === "GET" && url.pathname.includes("get_file_upload_url")) {
    const response = await fetch(`${MU_API_BASE}/app/get_file_upload_url?${url.search}`, {
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
    const body = await req.json();
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
};

export const config = {
  runtime: "edge",
};