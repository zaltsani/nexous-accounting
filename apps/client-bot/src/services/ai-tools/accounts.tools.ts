import { createAccountSchema, getAccountListQuerySchema } from "@nexous-accounting/types";
import { tool } from "ai";
import { buildQueryString } from "../../utils/build-query-string";
import z from "zod";
import { gatewayFetch } from "../api-client";

export const accountTools = {
  // POST /accounts
  createAccount: tool({
    description: "Create a new accounting chart of account entry",
    inputSchema: createAccountSchema,
    execute: async (data) =>
      gatewayFetch("/api/accounts", { method: "POST", body: JSON.stringify(data) }),
  }),

  // GET /accounts
  listAccounts: tool({
    description: "Fetch list of accounts or search accounts by code/name",
    inputSchema: z.object({
      query: getAccountListQuerySchema,
    }),
    execute: async ({ query }) => {
      const params = buildQueryString(query);
      return gatewayFetch(`/api/accounts${params}`, { method: "GET" });
    },
  }),

  // GET /accounts/:id
  getAccountById: tool({
    description: "Get detailed information for a specific account ID",
    inputSchema: z.object({
      id: z.string().describe("Account UUID"),
    }),
    execute: async ({ id }) => gatewayFetch(`/api/accounts/${id}`, { method: "GET" }),
  }),
};
