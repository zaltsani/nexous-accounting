FROM node:24-alpine AS base
WORKDIR /app

# Copy root package files for workspace resolution
COPY package.json package-lock.json tsconfig*.json ./

# Copy shared package definitions
COPY packages/types/package.json  ./packages/types/
COPY packages/database/system/package.json  ./packages/database/system/
COPY libs/nodejs/common/package.json  ./libs/nodejs/common/

# Copy app package definition
COPY services/platform/package.json ./services/platform/

# Install all dependencies (uses workspace resolution)
RUN npm ci

# Copy shared package source code
COPY packages/types/ ./packages/types/
COPY packages/database/system ./packages/database/system/
COPY libs/nodejs/common/ ./libs/nodejs/common/

# Copy app source code
COPY services/platform/ ./services/platform/

# Dummy DATABASE_URL for Prisma Client code generation
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder?schema=core"

# Generate Prisma client before building TypeScript
RUN npm run db:generate --workspace=@nexous-accounting/database-system

# Build shared packages first, then the app
RUN npm run build --workspace=@nexous-accounting/types && \
    npm run build --workspace=@nexous-accounting/database-system && \
    npm run build --workspace=@nexous-accounting/common && \
    npm run build --workspace=services/platform

# Production stage - only include what is needed at runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=base /app/package.json /app/package-lock.json ./
COPY --from=base /app/packages/types/package.json ./packages/types/
COPY --from=base /app/packages/database/system/package.json ./packages/database/system/
COPY --from=base /app/libs/nodejs/common/package.json ./libs/nodejs/common/
COPY --from=base /app/services/platform/package.json ./services/platform/

RUN npm ci --omit=dev

COPY --from=base /app/packages/types/dist/ ./packages/types/dist/
COPY --from=base /app/packages/database/system/dist/ ./packages/database/system/dist/
COPY --from=base /app/libs/nodejs/common/dist/ ./libs/nodejs/common/dist/
COPY --from=base /app/services/platform/dist/ ./services/platform/dist/

# Copy schema, migrations, AND prisma.config.ts
COPY --from=base /app/packages/database/system/prisma/ ./packages/database/system/prisma/
COPY --from=base /app/packages/database/system/prisma.config.ts ./packages/database/system/prisma.config.ts

# Copy and configure the dedicated migration entrypoint
COPY services/platform/database-migrate-deploy.sh /usr/local/bin/database-migrate-deploy.sh
RUN chmod +x /usr/local/bin/database-migrate-deploy.sh

EXPOSE 3000

ENTRYPOINT ["database-migrate-deploy.sh"]
CMD ["node", "services/platform/dist/main"]
