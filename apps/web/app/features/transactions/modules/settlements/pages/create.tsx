import { zodResolver } from "@hookform/resolvers/zod";
import { createSalesSettlementSchema, type ICreateSalesSettlement } from "@nexous-accounting/types";
import { Button } from "@nexous-accounting/ui";
import { useForm } from "react-hook-form";
import { href, useNavigate } from "react-router";
import PageHeader from "~/components/common/page-header";
import { toast } from "~/components/ui/toast";
import { getFormErrorMessage } from "~/libs/utils/form-errors";
import { SettlementForm } from "../components/forms/settlement.form";
import { useCreateSalesSettlement } from "../hooks/use-create-sales-settlement";

export default function () {
  const navigate = useNavigate();
  const form = useForm<ICreateSalesSettlement>({
    resolver: zodResolver(createSalesSettlementSchema),
    defaultValues: {
      settlementDate: new Date().toISOString(),
    },
  });

  const createMutation = useCreateSalesSettlement();

  const handleCreateSubmit = () => {
    form.handleSubmit(
      (values) => {
        createMutation.mutate(values, {
          onSuccess: () => {
            navigate(href("/sales"));
            toast.add({
              description: "Berhasil membuat data settlement",
            });
          },
        });
      },
      (err) => {
        console.error(err);
        const errorMessage = getFormErrorMessage(err);
        if (errorMessage) {
          toast.add({
            type: "error",
            description: errorMessage,
            priority: "high",
          });
        }
      },
    )();
  };

  return (
    <>
      <PageHeader title="Buat Sales Invoice">
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={handleCreateSubmit}>Simpan Data</Button>
        </div>
      </PageHeader>
      <SettlementForm form={form} />
    </>
  );
}
