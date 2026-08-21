type RuntimeEnv = {
  VITE_PUBLIC_BACKEND_URL?: string;
  VITE_MAINTENANCE_MODE?: string;
  VITE_SITE_DOMAIN?: string;
};

declare global {
  interface Window {
    __ENV__?: RuntimeEnv;
  }
}

const runtimeEnv = typeof window !== "undefined" ? window.__ENV__ : undefined;

export const ENV = {
  BASE_URL:
    runtimeEnv?.VITE_PUBLIC_BACKEND_URL ||
    import.meta.env.VITE_PUBLIC_BACKEND_URL ||
    "http://localhost",
  MAINTENANCE_MODE:
    (runtimeEnv?.VITE_MAINTENANCE_MODE ||
      import.meta.env.VITE_MAINTENANCE_MODE ||
      "false") === "true",
  SITE_DOMAIN: runtimeEnv?.VITE_SITE_DOMAIN || import.meta.env.VITE_SITE_DOMAIN || "",
};
