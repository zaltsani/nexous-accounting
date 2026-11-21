const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const TENANT_DB_PREFIX = 'tenant_';

export function isTenantId(value: unknown): value is string {
  return typeof value === 'string' && UUID_RE.test(value);
}

export function assertTenantId(value: unknown): asserts value is string {
  if (!isTenantId(value)) {
    throw new Error('Invalid tenant id');
  }
}

/** tenant_<id>. The id is validated as a UUID, so the result is safe to use as an identifier. */
export function tenantDbName(tenantId: string): string {
  assertTenantId(tenantId);
  return `${TENANT_DB_PREFIX}${tenantId.toLowerCase()}`;
}

/** Quote a SQL identifier (database names can't be bound as parameters). */
export function quoteIdent(name: string): string {
  return `"${name.replace(/"/g, '""')}"`;
}

/**
 * baseUrl is a connection string WITHOUT a database name,
 * e.g. postgresql://user:pass@host:5432 (query params such as sslmode are kept).
 */
export function buildTenantConnectionString(baseUrl: string, tenantId: string): string {
  const url = new URL(baseUrl);
  url.pathname = `/${tenantDbName(tenantId)}`;
  return url.toString();
}
