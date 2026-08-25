import { Card, CardContent, CardHeader, CardTitle } from "@nexous-accounting/ui";
import { ReceiptIcon, TrendingDownIcon, TrendingUpIcon, WalletIcon, type LucideIcon } from "lucide-react";
import { formatIndonesiaCurrency } from "~/libs/utils/format-indonesia-currency";

export const FinancialOverview = () => {
  return (
    <div className="grid md:grid-cols-4 gap-4">
      <OverviewCard
        title="TOTAL REVENUE"
        value={formatIndonesiaCurrency(20200000)}
        icon={TrendingUpIcon}
      />
      <OverviewCard
        title="TOTAL EXPENSES"
        value={formatIndonesiaCurrency(18000000)}
        icon={TrendingDownIcon}
      />
      <OverviewCard
        title="NET PROFIT"
        value={formatIndonesiaCurrency(4200000)}
        icon={WalletIcon}
      />
      <OverviewCard
        title="ACCOUNT RECEIVABLE"
        value={formatIndonesiaCurrency(3250000)}
        icon={ReceiptIcon}
      />
    </div>
  )
}

const OverviewCard = ({
  title,
  icon: Icon,
  value,
}: {
  title: string,
  value: string,
  icon: LucideIcon,
}) => (
  <Card>
    <CardHeader className="flex items-center justify-between">
      <CardTitle>{title}</CardTitle>
      <Icon size={16} />
    </CardHeader>
    <CardContent className="text-2xl font-semibold">
      {value}
    </CardContent>
  </Card>
)