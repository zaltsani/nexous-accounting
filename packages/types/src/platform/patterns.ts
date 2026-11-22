export const PLATFORM_PATTERNS = {
  auth: {
    register: "platform.auth.register",
    login: "platform.auth.login",
    selectTenant: "platform.auth.select-tenant",
    refresh: "platform.auth.refresh",
  },
  users: {
    create: "platform.users.create",
    get: "platform.users.get",
  },
  tenants: {
    create: "platform.tenants.create",
    get: "platform.tenants.get",
    listForUser: "platform.tenants.list-for-user",
    addMember: "platform.tenants.add-member",
    delete: "platform.tenants.delete",
  },
} as const;
