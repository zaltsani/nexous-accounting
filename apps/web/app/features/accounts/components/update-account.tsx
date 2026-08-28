import { zodResolver } from "@hookform/resolvers/zod";
import { editorAccountSchema, type IAccount, type IEditorAccount } from "@nexous-accounting/types";
import { SheetModal, type SheetModalFooterAction } from "@nexous-accounting/ui";
import { useForm } from "react-hook-form";
import { toast } from "~/components/ui/toast";
import { useUpdateAccount } from "~/features/accounts/data/use-update-account";
import { getFormErrorMessage } from "~/libs/utils/form-errors";
import { EditorAccountForm } from "./account-editor.form";

interface UpdateAccountProps {
  data: IAccount;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UpdateAccount = ({ data, open, onOpenChange }: UpdateAccountProps) => {
  const form = useForm<IEditorAccount>({
    resolver: zodResolver(editorAccountSchema),
    defaultValues: data,
  });

  const updateMutation = useUpdateAccount();

  const handleUpdateSubmit = () => {
    form.handleSubmit(
      (values) => {
        updateMutation.mutate(
          { id: data.id, data: values },
          {
            onSuccess: () => {
              onOpenChange(false);
            },
          },
        );
      },
      (err) => {
        console.error(err);
        const errorMessage = getFormErrorMessage(err);

        if (errorMessage)
          toast.add({
            type: "error",
            description: errorMessage,
            priority: "high",
          });
      },
    )();
  };

  const updateAccountModalActions: SheetModalFooterAction[] = [
    { label: "Batal", onClick: () => onOpenChange(false) },
    { label: "Edit Akun", onClick: handleUpdateSubmit },
  ];

  return (
    <SheetModal
      open={open}
      onOpenChange={onOpenChange}
      description="Kelola Chart of Akun untuk memudahkan pengelolaan akuntansi"
      title="Edit Akun"
      actions={updateAccountModalActions}
      footerClassName="grid grid-cols-2"
    >
      <EditorAccountForm form={form} />
    </SheetModal>
  );
};
