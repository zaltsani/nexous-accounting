import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardContent,
  DatePicker,
  Field,
  FieldError,
  FieldLabel,
  Textarea,
} from "@nexous-accounting/ui";
import { Controller, useForm } from "react-hook-form";
import { href, useNavigate } from "react-router";
import { toast } from "~/components/ui/toast";
import { DetailItemEntryForm } from "../components/detail-item-entry.form";
import { useCreateGeneralLedgerTransaction } from "../hooks/use-create-general-ledger-transaction";
import { ledgerEditorSchema, type ILedgerEditor } from "../types/ledger.type";

export default function () {
  const navigate = useNavigate();

  const form = useForm<ILedgerEditor>({
    resolver: zodResolver(ledgerEditorSchema),
    defaultValues: {
      date: new Date(),
      entries: Array.from({ length: 5 }).map(() => ({})),
    },
  });

  const createMutation = useCreateGeneralLedgerTransaction();

  const handleCreateSubmit = () => {
    form.handleSubmit(
      (values) => {
        createMutation.mutate(values, {
          onSuccess: () => {
            navigate(href("/general-ledger"));
          },
        });
      },
      (err) => {
        console.error(err);
        if (err.entries?.root?.type === "too_small") {
          toast.add({
            type: "error",
            description: err.entries.root.message,
            priority: "high",
          });
        }
      },
    )();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Buat Jurnal Umum</h1>
        <Button onClick={handleCreateSubmit}>Simpan Data</Button>
      </div>

      <form className="grid gap-3">
        {/* Date */}
        <Controller
          name="date"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel required>Tanggal</FieldLabel>
              <DatePicker date={field.value} setDate={field.onChange} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Description */}
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Deskripsi</FieldLabel>
              <Textarea
                {...field}
                placeholder="Deskripsi transaksi"
                aria-invalid={fieldState.invalid}
                value={field.value ?? ""}
                onChange={field.onChange}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Entries */}
        <Card>
          <CardContent>
            <DetailItemEntryForm form={form} />
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
