#!/bin/sh

echo "Generating env-config.js..."

cat <<EOF > /usr/share/nginx/html/env-config.js
window.__ENV__ = {
  VITE_PUBLIC_BACKEND_URL: "${VITE_PUBLIC_BACKEND_URL:-${VITE_BACKEND_URL:-}}",
  VITE_MAINTENANCE_MODE: "${VITE_MAINTENANCE_MODE:-false}",
  VITE_SITE_DOMAIN: "${VITE_SITE_DOMAIN:-}",
};
EOF

echo "env-config.js generated successfully."