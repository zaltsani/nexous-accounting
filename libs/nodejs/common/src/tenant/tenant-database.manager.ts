import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { TenantContext } from './tenant-context.js';
import { assertTenantId, buildTenantConnectionString } from './tenant-db-name.js';

export const TENANT_DATABASE_OPTIONS = Symbol('TENANT_DATABASE_OPTIONS');

/** Anything with $disconnect() works, so every service can bring its own PrismaClient. */
export interface TenantDisconnectable {
  $disconnect(): Promise<void>;
}

export interface TenantClientFactoryArgs {
  tenantId: string;
  connectionString: string;
  /** Postgres schema owned by the service (e.g. "core", "finops"). */
  schema?: string;
  poolMax: number;
}

export interface TenantDatabaseOptions<T extends TenantDisconnectable> {
  /** Connection string without database name, e.g. postgresql://user:pass@host:5432 */
  baseUrl: string;
  schema?: string;
  /** Connections per tenant client. Default 3. */
  poolMax?: number;
  /** Max tenant clients kept open (least recently used are closed). Default 50. */
  maxClients?: number;
  createClient: (args: TenantClientFactoryArgs) => T;
}

@Injectable()
export class TenantDatabaseManager<T extends TenantDisconnectable> implements OnModuleDestroy {
  private readonly logger = new Logger(TenantDatabaseManager.name);
  // Map keeps insertion order, so the first key is always the least recently used.
  private readonly clients = new Map<string, T>();

  constructor(
    @Inject(TENANT_DATABASE_OPTIONS)
    private readonly options: TenantDatabaseOptions<T>
  ) {}

  /** Client of the tenant in the current request context (set by TenantContextInterceptor). */
  current(): T {
    return this.get(TenantContext.requireTenantId());
  }

  /** Client of a specific tenant, created lazily and cached. */
  get(tenantId: string): T {
    assertTenantId(tenantId);
    const key = tenantId.toLowerCase();

    const existing = this.clients.get(key);
    if (existing) {
      this.clients.delete(key);
      this.clients.set(key, existing);
      return existing;
    }

    const client = this.options.createClient({
      tenantId: key,
      connectionString: buildTenantConnectionString(this.options.baseUrl, key),
      schema: this.options.schema,
      poolMax: this.options.poolMax ?? 3,
    });
    this.clients.set(key, client);
    this.evictOverflow();
    return client;
  }

  /** Close and forget a tenant's client (e.g. tenant suspended or database dropped). */
  async evict(tenantId: string): Promise<void> {
    const key = tenantId.toLowerCase();
    const client = this.clients.get(key);
    if (!client) return;
    this.clients.delete(key);
    await client.$disconnect();
  }

  async onModuleDestroy(): Promise<void> {
    const all = [...this.clients.values()];
    this.clients.clear();
    await Promise.allSettled(all.map((c) => c.$disconnect()));
  }

  private evictOverflow(): void {
    const max = this.options.maxClients ?? 50;
    while (this.clients.size > max) {
      const oldest = this.clients.keys().next().value as string;
      const client = this.clients.get(oldest)!;
      this.clients.delete(oldest);
      client.$disconnect().catch((err: unknown) => {
        this.logger.warn(`Failed to disconnect client of ${oldest}: ${String(err)}`);
      });
    }
  }
}
