FROM node:24-alpine AS base
WORKDIR /app

# Copy root package files for workspace resolution
COPY package.json package-lock.json tsconfig*.json ./

# Copy shared package definitions
COPY packages/types/package.json  ./packages/types/
COPY packages/database/finops/package.json  ./packages/database/finops/
COPY libs/nodejs/common/package.json  ./libs/nodejs/common/

# Copy app package definition
COPY services/finops/package.json ./services/finops/

# Install all dependencies (uses workspace resolution)
RUN npm ci

# Copy shared package source code
COPY packages/types/ ./packages/types/
COPY packages/database/finops ./packages/database/finops/
COPY libs/nodejs/common/ ./libs/nodejs/common/

# Copy app source code
COPY services/finops/ ./services/finops/

# Dummy DATABASE_URL for Prisma Client code generation
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder?schema=finops"

# Generate Prisma client before building TypeScript
RUN npm run db:generate --workspace=@nexous-accounting/database-finops

# Build shared packages first, then the app
RUN npm run build --workspace=@nexous-accounting/types && \
    npm run build --workspace=@nexous-accounting/database-finops && \
    npm run build --workspace=@nexous-accounting/common && \
    npm run build --workspace=services/finops

# Production stage - only include what is needed at runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=base /app/package.json /app/package-lock.json ./
COPY --from=base /app/packages/types/package.json ./packages/types/
COPY --from=base /app/packages/database/finops/package.json ./packages/database/finops/
COPY --from=base /app/libs/nodejs/common/package.json ./libs/nodejs/common/
COPY --from=base /app/services/finops/package.json ./services/finops/

RUN npm ci --omit=dev

COPY --from=base /app/packages/types/dist/ ./packages/types/dist/
COPY --from=base /app/packages/database/finops/dist/ ./packages/database/finops/dist/
COPY --from=base /app/libs/nodejs/common/dist/ ./libs/nodejs/common/dist/
COPY --from=base /app/services/finops/dist/ ./services/finops/dist/

# Copy schema, migrations, AND prisma.config.ts
COPY --from=base /app/packages/database/finops/prisma/ ./packages/database/finops/prisma/
COPY --from=base /app/packages/database/finops/prisma.config.ts ./packages/database/finops/prisma.config.ts

# Copy and configure the dedicated migration entrypoint
COPY services/finops/database-migrate-deploy.sh /usr/local/bin/database-migrate-deploy.sh
RUN chmod +x /usr/local/bin/database-migrate-deploy.sh

EXPOSE 3000

ENTRYPOINT ["database-migrate-deploy.sh"]
CMD ["node", "services/finops/dist/main"]
