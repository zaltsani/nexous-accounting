import { zodResolver } from "@hookform/resolvers/zod";
import { createAccountSchema, type ICreateAccount } from "@nexous-accounting/types";
import { SheetModal, type SheetModalFooterAction } from "@nexous-accounting/ui";
import { useForm } from "react-hook-form";
import { toast } from "~/components/ui/toast";
import { EditorAccountForm } from "~/features/accounts/components/account-editor.form";
import { useCreateAccount } from "~/features/accounts/data/use-create-account";
import { getFormErrorMessage } from "~/libs/utils/form-errors";

interface CreateAccountProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateAccount = ({ open, onOpenChange }: CreateAccountProps) => {
  const form = useForm<ICreateAccount>({
    resolver: zodResolver(createAccountSchema),
  });

  const createMutation = useCreateAccount();

  const handleCreateSubmit = () => {
    form.handleSubmit(
      (values) => {
        createMutation.mutate(values, {
          onSuccess: () => {
            onOpenChange(false);
          },
          onError: (err) => {
            toast.add({
              type: "error",
              description: err.message,
              priority: "high",
            });
          },
        });
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

  const createAccountModalActions: SheetModalFooterAction[] = [
    {
      label: "Batal",
      onClick: () => {
        onOpenChange(false);
        form.reset();
      },
    },
    { label: "Simpan Akun", onClick: handleCreateSubmit },
  ];

  return (
    <SheetModal
      open={open}
      onOpenChange={onOpenChange}
      title="Tambah Akun Baru"
      description="Tambahkan akun baru ke dalam Daftar Akun (Chart of Accounts) untuk pencatatan keuangan yang rapi."
      actions={createAccountModalActions}
      footerClassName="grid grid-cols-2"
      overlayClassName="supports-backdrop-filter:backdrop-blur-[1px]"
    >
      <EditorAccountForm form={form} />
    </SheetModal>
  );
};
