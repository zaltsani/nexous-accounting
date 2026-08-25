import { FinancialOverview } from "../components/financial-overview";
import { MonthlyCashFlow } from "../components/monthly-cash-flow";
import { RecentActivity } from "../components/recent-activity";

export default function () {
  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      <div className="sm:space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <h2>Financial Overview</h2>
      </div>
      <FinancialOverview />
      <div className="grid md:grid-cols-5 gap-4">
        <MonthlyCashFlow className="md:col-span-3" />
        <RecentActivity className="md:col-span-2" />
      </div>
    </div>
  );
}
