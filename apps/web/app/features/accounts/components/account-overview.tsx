import type { IAccount } from "@nexous-accounting/types";
import { Card, CardContent, CardHeader, CardTitle } from "@nexous-accounting/ui";
import { ArrowDownLeftIcon, ArrowUpRightIcon, WalletIcon, type LucideIcon } from "lucide-react";
import { formatIndonesiaCurrency } from "~/libs/utils/format-indonesia-currency";
import { useGetAccountSummary } from "../data/use-get-account-summary";

interface AccountOverviewProps {
  accountData: IAccount;
}

export const AccountOverview = ({ accountData }: AccountOverviewProps) => {
  const { data } = useGetAccountSummary(accountData.id);

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <OverviewCard
        title="Saldo Akhir"
        value={formatIndonesiaCurrency(accountData.balance)}
        icon={WalletIcon}
      />
      <OverviewCard
        title="Total Mutasi Debit (Periode Ini)"
        value={data?.summary.totalDebit ? formatIndonesiaCurrency(data?.summary.totalDebit) : "-"}
        icon={ArrowDownLeftIcon}
      />
      <OverviewCard
        title="Total Mutasi Kredit (Periode Ini)"
        value={data?.summary.totalCredit ? formatIndonesiaCurrency(data?.summary.totalCredit) : "-"}
        icon={ArrowUpRightIcon}
      />
    </div>
  );
};

const OverviewCard = ({
  title,
  icon: Icon,
  value,
}: {
  title: string;
  value: string;
  icon: LucideIcon;
}) => (
  <Card>
    <CardHeader className="flex items-center justify-between">
      <CardTitle>{title}</CardTitle>
      <Icon size={16} />
    </CardHeader>
    <CardContent className="text-2xl font-semibold">{value}</CardContent>
  </Card>
);
