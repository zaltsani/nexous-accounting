import {
  HandCoinsIcon,
  LayoutDashboardIcon,
  NotebookTabsIcon,
  WalletCardsIcon,
  type LucideIcon,
} from "lucide-react";

interface ISidebarData {
  title?: string;
  items: {
    icon: LucideIcon;
    title: string;
    url: string;
    createUrl?: string;
  }[];
}

export const SidebarData: ISidebarData[] = [
  {
    items: [
      {
        icon: LayoutDashboardIcon,
        title: "Dashboard",
        url: "/",
      },
      {
        icon: WalletCardsIcon,
        title: "Akun",
        url: "/accounts",
      },
      // {
      //   icon: ScaleIcon,
      //   title: "Neraca",
      //   url: "/neraca"
      // },
    ],
  },
  {
    title: "Transaksi",
    items: [
      {
        icon: NotebookTabsIcon,
        title: "Jurnal Umum",
        url: "/general-ledger",
      },
      {
        icon: HandCoinsIcon,
        title: "Penjualan",
        url: "/sales",
      },
      {
        icon: HandCoinsIcon,
        title: "Pembelian",
        url: "/purchases",
      },
      {
        icon: HandCoinsIcon,
        title: "Pembayaran",
        url: "/payments",
      },
    ],
  },
];
