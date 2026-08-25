import { useGetTransactionList } from "../hooks/use-get-transaction-list";

export default function () {
  const { data } = useGetTransactionList();
  console.log({ data });
  return <></>;
}
