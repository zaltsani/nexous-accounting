import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
  layout("providers/app-provider.tsx", [
    route("login", "features/auth/pages/login.tsx"),
    route("select-tenant", "features/tenants/pages/select-tenant.tsx"),

    layout("providers/tenant-provider.tsx", [
      layout("components/layouts/app-layout.tsx", [
        index("features/dashboard/pages/index.tsx"),
        route("report", "features/reports/pages/balance-sheet.tsx"),

        // ===== Chart of Accounts =====
        ...prefix("accounts", [
          index("features/accounts/pages/index.tsx"),
          route(":id", "features/accounts/pages/detail.tsx"),
        ]),

        // ===== General Ledger =====
        ...prefix("general-ledger", [
          index("features/transactions/modules/general-ledger/pages/index.tsx"),
          route("create", "features/transactions/modules/general-ledger/pages/create.tsx"),
        ]),

        // ===== Sales =====
        ...prefix("sales", [
          index("features/transactions/modules/sales/pages/index.tsx"),
          route("create", "features/transactions/modules/sales/pages/create.tsx"),
        ]),

        // ===== Settlements =====
        ...prefix("settlements", [
          index("features/transactions/modules/settlements/pages/index.tsx"),
          route("create", "features/transactions/modules/settlements/pages/create.tsx"),
        ]),

        // ===== Purchases =====
        ...prefix("purchases", [
          index("features/transactions/modules/purchases/pages/index.tsx"),
          route("create", "features/transactions/modules/purchases/pages/create.tsx"),
        ]),

        // ===== Payments =====
        ...prefix("payments", [
          index("features/transactions/modules/payments/pages/index.tsx"),
          route("create", "features/transactions/modules/payments/pages/create.tsx"),
        ]),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
