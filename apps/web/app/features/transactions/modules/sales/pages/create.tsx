import { zodResolver } from "@hookform/resolvers/zod";
import {
  editorInvoiceSchema,
  type IEditorInvoice,
  type IInvoiceActionStatus,
} from "@nexous-accounting/types";
import { Button } from "@nexous-accounting/ui";
import { useForm } from "react-hook-form";
import { href, useNavigate } from "react-router";
import PageHeader from "~/components/common/page-header";
import { useCreateSalesInvoice } from "../hooks/use-create-sales-invoice";
import { toast } from "~/components/ui/toast";
import { getFormErrorMessage } from "~/libs/utils/form-errors";
import { InvoiceOverviewForm } from "../components/forms/invoice-overview.form";
import { SalesItemsForm } from "../components/forms/sales-items.form";

export default function () {
  const navigate = useNavigate();
  const form = useForm<IEditorInvoice>({
    resolver: zodResolver(editorInvoiceSchema),
    defaultValues: {
      issueDate: new Date().toISOString(),
      items: [{}],
    },
  });

  const createMutation = useCreateSalesInvoice();

  const handleCreateSubmit = (action: IInvoiceActionStatus) => {
    form.setValue("action", action);
    form.handleSubmit(
      (values) => {
        createMutation.mutate(
          { ...values, action },
          {
            onSuccess: () => {
              navigate(href("/sales"));
              toast.add({
                description: "Berhasil Membuat Data Invoice Sales",
              });
            },
          },
        );
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
          <Button variant="secondary" onClick={() => handleCreateSubmit("DRAFT")}>
            Save as Draft
          </Button>
          <Button onClick={() => handleCreateSubmit("POST")}>Simpan Data</Button>
        </div>
      </PageHeader>
      <InvoiceOverviewForm form={form} />

      <SalesItemsForm form={form} />
    </>
  );
}
