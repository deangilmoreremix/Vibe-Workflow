import axios from "axios";

// The MuAPI key lives in the browser (set by the host app's Settings/Auth modal
// into localStorage['muapi_key'] and synced to window.__MUAPI_KEY__). This
// mirrors the established client-side key source used by src/shared/api/storyboard.ts
// in the parent app. We read it on every request so the value stays current even
// if the user updates their key while the builder is mounted.
function getApiKey() {
  if (typeof window === "undefined") return null;
  const w = window;
  const stored = w.__MUAPI_KEY__ || (w.localStorage && w.localStorage.getItem("muapi_key"));
  return stored || null;
}

const apiClient = axios.create();

// Inject x-api-key on same-origin /api/workflow requests so the proxy
// (app/api/workflow/[[...path]]/route.js) can forward it to https://api.muapi.ai.
// Cookie-based auth was deliberately removed upstream; the key must travel as the
// x-api-key header. We scope the injection to /api/workflow to avoid leaking the
// key to unrelated endpoints.
apiClient.interceptors.request.use((config) => {
  const url = typeof config.url === "string" ? config.url : "";
  if (url.startsWith("/api/workflow")) {
    const key = getApiKey();
    if (key) {
      config.headers = config.headers || {};
      config.headers["x-api-key"] = key;
    }
  }
  return config;
});

export default apiClient;
