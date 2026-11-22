import {
  apiListQueryParamsSchema,
  createInvoiceSchema,
  getSalesInvoiceListQuerySchema,
} from "@nexous-accounting/types";
import { tool } from "ai";
import z from "zod";
import { buildQueryString } from "../../utils/build-query-string";
import { gatewayFetch } from "../api-client";

export const salesTools = {
  // POST /sales/invoice
  createSalesInvoice: tool({
    description: "Create a new commercial sales invoice (Jurnal Penjualan)",
    inputSchema: createInvoiceSchema,
    execute: async (data) =>
      gatewayFetch("/api/sales/invoice", { method: "POST", body: JSON.stringify(data) }),
  }),

  // GET /sales/invoice
  listSalesInvoices: tool({
    description: "Fetch list of sales invoices with filtering options",
    inputSchema: z.object({
      query: getSalesInvoiceListQuerySchema,
    }),
    execute: async ({ query }) => {
      const params = buildQueryString(query);
      return gatewayFetch(`/api/sales/invoice${params}`, { method: "GET" });
    },
  }),

  // POST /sales/settlement
  createSalesSettlement: tool({
    description: "Create a new payment settlement for sales invoices (Jurnal Pembayaran)",
    inputSchema: createInvoiceSchema,
    execute: async (data) =>
      gatewayFetch("/api/sales/settlement", { method: "POST", body: JSON.stringify(data) }),
  }),

  // GET /sales/settlement
  listSalesSettlements: tool({
    description: "Fetch list of payment settlements for sales invoices",
    inputSchema: z.object({
      query: apiListQueryParamsSchema,
    }),
    execute: async ({ query }) => {
      const params = buildQueryString(query);
      return gatewayFetch(`/api/sales/settlement${params}`, { method: "GET" });
    },
  }),
};
