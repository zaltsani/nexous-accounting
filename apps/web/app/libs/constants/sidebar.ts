import {
  BanknoteIcon,
  FileBarChartIcon,
  LandmarkIcon,
  LayoutGridIcon,
  NetworkIcon,
  ReceiptTextIcon,
  ShoppingCartIcon,
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
        icon: LayoutGridIcon,
        title: "Dashboard",
        url: "/",
      },
      {
        icon: NetworkIcon,
        title: "Akun",
        url: "/accounts",
      },
      {
        icon: FileBarChartIcon,
        title: "Report Neraca",
        url: "/report",
      },
    ],
  },
  {
    title: "Transaksi",
    items: [
      {
        icon: LandmarkIcon,
        title: "Jurnal Umum",
        url: "/general-ledger",
      },
      {
        icon: ReceiptTextIcon,
        title: "Penjualan",
        url: "/sales",
      },
      {
        icon: ShoppingCartIcon,
        title: "Pembelian",
        url: "/purchases",
      },
      {
        icon: BanknoteIcon,
        title: "Pembayaran",
        url: "/payments",
      },
    ],
  },
];
