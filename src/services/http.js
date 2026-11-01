// Single place where the app talks to the network.
// Set VITE_API_URL in .env to switch every service from mock data to your backend.
export const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
if (import.meta.env.PROD && !API_URL) {
  throw new Error("VITE_API_URL must be configured for a production build.");
}
export const USE_MOCK = !API_URL;

const TOKEN_KEY = "hirenest_token";
let unauthorizedHandler = null;

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
  return () => {
    if (unauthorizedHandler === handler) unauthorizedHandler = null;
  };
}

export async function http(path, { method = "GET", body } = {}) {
  const token = tokenStore.get();
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    tokenStore.clear();
    unauthorizedHandler?.();
  }
  if (!res.ok) {
    const error = new Error(data.message || "Something went wrong. Please try again.");
    error.status = res.status;
    throw error;
  }
  return data;
}

// Small helper so mock calls feel like real network calls (loading states stay honest).
export const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));
