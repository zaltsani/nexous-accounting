import type { TenantDatabaseManager, TenantDisconnectable } from "./tenant-database.manager.js";

// Properties Nest, Jest or Node probe on an injected object. They must NOT be forwarded to the
// tenant client, otherwise the app would fail at startup, where no tenant exists yet.
const NOT_CLIENT_PROPS = new Set<string>([
  "then",
  "constructor",
  "toJSON",
  "inspect",
  "asymmetricMatch",
  "onModuleInit",
  "onModuleDestroy",
  "onApplicationBootstrap",
  "onApplicationShutdown",
  "beforeApplicationShutdown",
]);

/**
 * Returns an object that behaves like the tenant's PrismaClient: `proxy.account.findMany()` and
 * `proxy.$transaction()` are resolved against the tenant of the current request on every access.
 */
export function createTenantClientProxy<T extends TenantDisconnectable>(
  manager: TenantDatabaseManager<T>,
): T {
  return new Proxy({} as T, {
    get(target, prop) {
      if (typeof prop === "symbol" || NOT_CLIENT_PROPS.has(prop)) {
        return Reflect.get(target, prop);
      }
      const client = manager.current() as unknown as Record<string, unknown>;
      const value = client[prop];
      return typeof value === "function" ? value.bind(client) : value;
    },
  });
}
