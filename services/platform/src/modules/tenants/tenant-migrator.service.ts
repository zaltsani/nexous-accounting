import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { buildTenantConnectionString, quoteIdent } from "@nexous-accounting/common";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { Client } from "pg";
import { PrismaService } from "../../database/prisma.service";
import { TENANT_SCHEMAS, TenantSchemaDefinition } from "./tenant-schemas.config";

const execFileAsync = promisify(execFile);
const COMMAND_TIMEOUT_MS = 5 * 60 * 1000;

export interface MigrateAllResult {
  migrated: string[];
  failed: { tenantId: string; error: string }[];
}

/**
 * Applies the Prisma migrations of every registered service to a tenant database,
 * each inside its own Postgres schema (core, finops, ...), using `prisma migrate deploy`.
 * Idempotent: running it again only applies migrations that are still pending.
 */
@Injectable()
export class TenantMigrator {
  private readonly logger = new Logger(TenantMigrator.name);

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    @Inject(TENANT_SCHEMAS) private readonly schemas: TenantSchemaDefinition[],
  ) {}

  /** Set `seed` for a brand-new tenant so seedOnCreate schemas also get their seed data. */
  async migrateTenant(tenantId: string, options: { seed?: boolean } = {}): Promise<void> {
    for (const def of this.schemas) {
      const started = Date.now();
      await this.ensureSchema(tenantId, def);

      const url = this.schemaUrl(tenantId, def);
      await this.runPrisma(def, url, ["migrate", "deploy"]);
      if (options.seed && def.seedOnCreate) {
        await this.runPrisma(def, url, ["db", "seed"]);
      }
      this.logger.log(`Tenant ${tenantId}: ${def.service} ready in ${Date.now() - started}ms`);
    }
  }

  /** Roll new migrations out to every active tenant (run after deploying a new service version). */
  async migrateAll(concurrency = 3): Promise<MigrateAllResult> {
    const tenants = await this.prisma.tenant.findMany({
      where: { isActive: true },
      select: { id: true },
      orderBy: { createdAt: "asc" },
    });

    const result: MigrateAllResult = { migrated: [], failed: [] };
    const queue = tenants.map((t) => t.id);

    const worker = async () => {
      for (let id = queue.shift(); id; id = queue.shift()) {
        try {
          await this.migrateTenant(id);
          result.migrated.push(id);
        } catch (error) {
          this.logger.error(`Migrating tenant ${id} failed`, error as Error);
          result.failed.push({ tenantId: id, error: (error as Error).message });
        }
      }
    };
    await Promise.all(Array.from({ length: Math.max(1, concurrency) }, worker));
    return result;
  }

  /** Same credentials as the platform admin connection, pointed at the tenant database + schema. */
  private schemaUrl(tenantId: string, def: TenantSchemaDefinition): string {
    const adminUrl = this.config.getOrThrow<string>("SYSTEM_DATABASE_URL");
    const url = new URL(buildTenantConnectionString(adminUrl, tenantId));
    url.searchParams.set("schema", def.schema);
    return url.toString();
  }

  private async ensureSchema(tenantId: string, def: TenantSchemaDefinition): Promise<void> {
    const adminUrl = this.config.getOrThrow<string>("SYSTEM_DATABASE_URL");
    const client = new Client({
      connectionString: buildTenantConnectionString(adminUrl, tenantId),
    });
    await client.connect();
    try {
      await client.query(`CREATE SCHEMA IF NOT EXISTS ${quoteIdent(def.schema)}`);
    } finally {
      await client.end();
    }
  }

  private async runPrisma(def: TenantSchemaDefinition, url: string, args: string[]): Promise<void> {
    const cli = this.config.get<string>("PRISMA_CLI_PATH") ?? this.resolvePrismaCli(def);
    try {
      await execFileAsync(process.execPath, [cli, ...args], {
        cwd: def.packageDir,
        env: { ...process.env, [def.urlEnvVar]: url },
        timeout: COMMAND_TIMEOUT_MS,
        maxBuffer: 10 * 1024 * 1024,
      });
    } catch (error) {
      const e = error as Error & { stdout?: string; stderr?: string };
      const output = `${e.stderr ?? ""}\n${e.stdout ?? ""}`.trim().slice(-2000);
      throw new Error(`prisma ${args.join(" ")} failed for ${def.service}: ${output || e.message}`);
    }
  }

  private resolvePrismaCli(def: TenantSchemaDefinition): string {
    return require.resolve("prisma/build/index.js", { paths: [def.packageDir, process.cwd()] });
  }
}
