type RuntimeEnv = {
  VITE_PUBLIC_BACKEND_URL?: string;
  VITE_MAINTENANCE_MODE?: string;
  VITE_SITE_DOMAIN?: string;
  VITE_OTEL_ENABLED?: string;
  VITE_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT?: string;
  VITE_OTEL_PROPAGATE_TRACE_HEADER_URLS?: string;
  VITE_OTEL_SERVICE_NAME?: string;
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
  OTEL_ENABLED:
    runtimeEnv?.VITE_OTEL_ENABLED ||
    import.meta.env.VITE_OTEL_ENABLED ||
    "true",
  OTEL_EXPORTER_OTLP_TRACES_ENDPOINT:
    runtimeEnv?.VITE_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ||
    import.meta.env.VITE_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ||
    "/otel/v1/traces",
  OTEL_PROPAGATE_TRACE_HEADER_URLS:
    runtimeEnv?.VITE_OTEL_PROPAGATE_TRACE_HEADER_URLS ||
    import.meta.env.VITE_OTEL_PROPAGATE_TRACE_HEADER_URLS ||
    "",
  OTEL_SERVICE_NAME:
    runtimeEnv?.VITE_OTEL_SERVICE_NAME ||
    import.meta.env.VITE_OTEL_SERVICE_NAME ||
    "smartwms-app",
};
