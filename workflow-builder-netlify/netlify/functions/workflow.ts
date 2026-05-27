import { Context } from "@netlify/functions";

const MU_API_KEY = process.env.MU_API_KEY || Netlify.env.get("MU_API_KEY");
const MU_API_BASE = "https://api.muapi.ai";

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const path = url.pathname.replace("/.netlify/functions/workflow", "") + url.search;
  const method = req.method.toUpperCase();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "x-api-key": MU_API_KEY || "",
  };

  const response = await fetch(`${MU_API_BASE}${path}`, {
    method,
    headers,
    ...(req.body ? { body: JSON.stringify(await req.json()) } : {}),
  });

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
};

export const config = {
  runtime: "edge",
};