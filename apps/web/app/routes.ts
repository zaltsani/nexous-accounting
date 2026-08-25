import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
  layout("providers/app-provider.tsx", [
    layout("components/layouts/app-layout.tsx", [
      index("features/dashboard/pages/index.tsx"),

      // ===== Chart of Accounts =====
      ...prefix("accounts", [index("features/accounts/pages/index.tsx")]),

      // ===== General Ledger =====
      ...prefix("general-ledger", [
        index("features/transactions/general-ledger/pages/index.tsx"),
        route("create", "features/transactions/general-ledger/pages/create.tsx"),
      ]),

      // ===== Sales =====
      ...prefix("sales", [
        index("features/transactions/sales/pages/index.tsx"),
        route("create", "features/transactions/sales/pages/create.tsx"),
      ]),

      // ===== Purchases =====
      ...prefix("purchases", [
        index("features/transactions/purchases/pages/index.tsx"),
        route("create", "features/transactions/purchases/pages/create.tsx"),
      ]),

      // ===== Payments =====
      ...prefix("payments", [
        index("features/transactions/payments/pages/index.tsx"),
        route("create", "features/transactions/payments/pages/create.tsx"),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
