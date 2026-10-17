FROM node:24-alpine AS base
WORKDIR /app

# Copy root package files for workspace resolution
COPY package.json package-lock.json tsconfig*.json ./

# Copy shared package definitions
COPY packages/types/package.json  ./packages/types/

# Copy app package definition
COPY apps/client-bot/package.json ./apps/client-bot/

# Install all dependencies (uses workspace resolution)
RUN npm ci

# Copy shared package source code
COPY packages/types/ ./packages/types/

# Copy app source code
COPY apps/client-bot/ ./apps/client-bot/

# Build shared packages first, then the app
RUN npm run build --workspace=@nexous-accounting/types && \
    npm run build --workspace=apps/client-bot

# Production stage - only include what is needed at runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=base /app/package.json /app/package-lock.json ./
COPY --from=base /app/packages/types/package.json ./packages/types/
COPY --from=base /app/apps/client-bot/package.json ./apps/client-bot/

RUN npm ci --omit=dev

COPY --from=base /app/packages/types/dist/ ./packages/types/dist/
COPY --from=base /app/apps/client-bot/dist/ ./apps/client-bot/dist/

EXPOSE 3000

CMD ["node", "apps/client-bot/dist/main"]
