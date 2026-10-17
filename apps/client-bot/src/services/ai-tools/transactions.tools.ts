import {
  createTransactionSchema,
  getTransactionListQuerySchema,
  updateTransactionSchema,
} from "@nexous-accounting/types";
import { tool } from "ai";
import { buildQueryString } from "../../utils/build-query-string";
import z from "zod";
import { gatewayFetch } from "../api-client";

export const transactionTools = {
  // POST /transactions
  createTransaction: tool({
    description: "Create a new double-entry accounting transaction entry with journal lines",
    inputSchema: createTransactionSchema,
    execute: async (data) =>
      gatewayFetch("/api/transactions", { method: "POST", body: JSON.stringify(data) }),
  }),

  // GET /transactions
  listTransactions: tool({
    description: "Fetch list of accounting transactions with pagination and filters",
    inputSchema: z.object({
      query: getTransactionListQuerySchema,
    }),
    execute: async ({ query }) => {
      const params = buildQueryString(query);
      return gatewayFetch(`/api/transactions${params}`, { method: "GET" });
    },
  }),

  // GET /transactions/:id
  getTransactionById: tool({
    description: "Get detailed information and journal lines for a specific transaction ID",
    inputSchema: z.object({
      id: z.string().describe("Transaction UUID"),
    }),
    execute: async ({ id }) => gatewayFetch(`/api/transactions/${id}`, { method: "GET" }),
  }),

  // PATCH /transactions/:id
  updateTransaction: tool({
    description: "Update an existing transaction entry",
    inputSchema: z.object({
      id: z.string().describe("Transaction UUID"),
      data: updateTransactionSchema,
    }),
    execute: async ({ id, data }) =>
      gatewayFetch(`/api/transactions/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  }),

  // DELETE /transactions/:id
  deleteTransaction: tool({
    description: "Delete or void a transaction entry by ID",
    inputSchema: z.object({
      id: z.string().describe("Transaction UUID"),
    }),
    execute: async ({ id }) => gatewayFetch(`/api/transactions/${id}`, { method: "DELETE" }),
  }),
};
