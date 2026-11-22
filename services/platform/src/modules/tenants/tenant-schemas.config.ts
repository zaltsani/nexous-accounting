import { ConfigService } from "@nestjs/config";
import * as path from "node:path";

/** One application service that owns a Postgres schema inside every tenant database. */
export interface TenantSchemaDefinition {
  /** Service name, used for logs. */
  service: string;
  /** Postgres schema inside tenant_<id> (also the ?schema= used by the service at runtime). */
  schema: string;
  /** Directory of the Prisma package (has prisma.config.ts and prisma/migrations). */
  packageDir: string;
  /** Name of the env var the package's prisma.config.ts reads the URL from. */
  urlEnvVar: string;
  /** Run `prisma db seed` after the first migration of a new tenant. */
  seedOnCreate: boolean;
}

export const TENANT_SCHEMAS = Symbol("TENANT_SCHEMAS");

/**
 * Registry of schemas created in every tenant database. ORDER MATTERS: earlier entries are
 * migrated first. Add an entry here when a new service (e.g. pos) gets its own Prisma package.
 */
export function buildTenantSchemas(config: ConfigService): TenantSchemaDefinition[] {
  const root = config.get<string>(
    "DATABASE_PACKAGES_DIR",
    path.resolve(process.cwd(), "../../packages/database"),
  );

  return [
    {
      service: "core",
      schema: "core",
      packageDir: path.join(root, "core"),
      urlEnvVar: "DATABASE_URL",
      // System accounts / journals must exist in every tenant. Make sure prisma/seed.ts only
      // seeds those (idempotently) and not demo data like transactions.seed.ts.
      seedOnCreate: true,
    },
    {
      service: "finops",
      schema: "finops",
      packageDir: path.join(root, "finops"),
      urlEnvVar: "DATABASE_URL",
      seedOnCreate: false,
    },
  ];
}
