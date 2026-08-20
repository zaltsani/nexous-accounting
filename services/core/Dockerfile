FROM node:24-alpine AS base
WORKDIR /app

# Copy root package files for workspace resolution
COPY package.json package-lock.json tsconfig*.json ./

# Copy shared package definitions
COPY packages/types/package.json  ./packages/types/
COPY packages/database/core/package.json  ./packages/database/core/
COPY libs/nodejs/common/package.json  ./libs/nodejs/common/

# Copy app package definition
COPY services/core/package.json ./services/core/

# Install all dependencies (uses workspace resolution)
RUN npm ci

# Copy shared package source code
COPY packages/types/ ./packages/types/
COPY packages/database/core ./packages/database/core/
COPY libs/nodejs/common/ ./libs/nodejs/common/

# Copy app source code
COPY services/core/ ./services/core/

# Dummy DATABASE_URL for Prisma Client code generation
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"

# Generate Prisma client before building TypeScript
RUN npm run db:generate --workspace=@nexous-accounting/database-core

# Build shared packages first, then the app
RUN npm run build --workspace=@nexous-accounting/types && \
    npm run build --workspace=@nexous-accounting/database-core && \
    npm run build --workspace=@nexous-accounting/common && \
    npm run build --workspace=services/core

# Production stage - only include what is needed at runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=base /app/package.json /app/package-lock.json ./
COPY --from=base /app/packages/types/package.json ./packages/types/
COPY --from=base /app/packages/database/core/package.json ./packages/database/core/
COPY --from=base /app/libs/nodejs/common/package.json ./libs/nodejs/common/
COPY --from=base /app/services/core/package.json ./services/core/

RUN npm ci --omit=dev

COPY --from=base /app/packages/types/dist/ ./packages/types/dist/
COPY --from=base /app/packages/database/core/dist/ ./packages/database/core/dist/
COPY --from=base /app/libs/nodejs/common/dist/ ./libs/nodejs/common/dist/
COPY --from=base /app/services/core/dist/ ./services/core/dist/

# Copy schema, migrations, AND prisma.config.ts
COPY --from=base /app/packages/database/core/prisma/ ./packages/database/core/prisma/
COPY --from=base /app/packages/database/core/prisma.config.ts ./packages/database/core/prisma.config.ts

# Copy and configure the dedicated migration entrypoint
COPY services/core/database-migrate-deploy.sh /usr/local/bin/database-migrate-deploy.sh
RUN chmod +x /usr/local/bin/database-migrate-deploy.sh

EXPOSE 3000

ENTRYPOINT ["database-migrate-deploy.sh"]
CMD ["node", "apps/api/dist/main"]
