import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
  layout("providers/app-provider.tsx", [
    layout("components/layouts/app-layout.tsx", [
      index("features/dashboard/pages/index.tsx"),

      // ===== Chart of Accounts =====
      ...prefix("accounts", [index("features/accounts/pages/index.tsx")]),

      // ===== General Ledger =====
      ...prefix("ledger", [
        index("features/ledger/pages/index.tsx"),
        route("create", "features/ledger/pages/create.tsx"),
      ]),

      // ===== Sales =====
      ...prefix("sales", [
        index("features/sales/pages/index.tsx"),
        route("create", "features/sales/pages/create.tsx"),
      ]),

      // ===== Purchases =====
      ...prefix("purchases", [
        index("features/purchases/pages/index.tsx"),
        route("create", "features/purchases/pages/create.tsx"),
      ]),

      // ===== Payments =====
      ...prefix("payments", [
        index("features/payments/pages/index.tsx"),
        route("create", "features/payments/pages/create.tsx"),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
