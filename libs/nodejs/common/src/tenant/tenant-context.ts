import { AsyncLocalStorage } from "node:async_hooks";

/** NATS headers the gateway sets on every call that belongs to a tenant. */
export const TENANT_ID_HEADER = "x-tenant-id";
export const USER_ID_HEADER = "x-user-id";

export interface TenantContextStore {
  tenantId: string;
  userId?: string;
}

export class TenantContextMissingError extends Error {
  constructor() {
    super("No tenant in the current request context");
    this.name = "TenantContextMissingError";
  }
}

const storage = new AsyncLocalStorage<TenantContextStore>();

export const TenantContext = {
  run<R>(store: TenantContextStore, fn: () => R): R {
    return storage.run(store, fn);
  },

  get(): TenantContextStore | undefined {
    return storage.getStore();
  },

  requireTenantId(): string {
    const store = storage.getStore();
    if (!store) throw new TenantContextMissingError();
    return store.tenantId;
  },
};
