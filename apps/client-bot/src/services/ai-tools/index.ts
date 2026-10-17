import { accountTools } from "./accounts.tools";
import { reportTools } from "./reports.tools";
import { salesTools } from "./sales.tools";
import { transactionTools } from "./transactions.tools";

export const allGatewayTools = {
  ...accountTools,
  ...transactionTools,
  ...salesTools,
  ...reportTools,
};
