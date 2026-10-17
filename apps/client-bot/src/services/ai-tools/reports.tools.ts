import { getReportBalanceSheetQuerySchema } from "@nexous-accounting/types";
import { tool } from "ai";
import { buildQueryString } from "src/utils/build-query-string";
import z from "zod";
import { gatewayFetch } from "../api-client";

export const reportTools = {
  // GET /reports/balance-sheet
  getBalanceSheet: tool({
    description: "Generate the balance sheet financial report complying with PSAK standards",
    inputSchema: z.object({
      query: getReportBalanceSheetQuerySchema,
    }),
    execute: async ({ query }) => {
      const params = buildQueryString(query);
      return gatewayFetch(`/api/reports/balance-sheet${params}`, { method: "GET" });
    },
  }),
};
