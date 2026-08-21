FROM node:24-alpine AS base
WORKDIR /app

# Copy root package files for workspace resolution
COPY package.json package-lock.json ./

# Copy shared package definitions
COPY packages/types/package.json  ./packages/types/

# Copy app package definition
COPY apps/web/package.json ./apps/web/

# Install all dependencies (uses workspace resolution)
RUN npm ci

# Copy shared package source code
COPY packages/types/ ./packages/types/
COPY packages/ui/ ./packages/ui/

# Copy app source code
COPY apps/web/ ./apps/web/

# Build shared packages first, then the app
RUN npm run build --workspace=packages/types && \
    npm run build --workspace=packages/ui && \
    npm run build --workspace=apps/web

# Production stage
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# Delete default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy static files
COPY --from=base /app/apps/web/build/client .

COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

# Setup runtime environment variable script
COPY apps/web/generate-env.sh /docker-entrypoint.d/99-generate-env.sh
RUN chmod +x /docker-entrypoint.d/99-generate-env.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]