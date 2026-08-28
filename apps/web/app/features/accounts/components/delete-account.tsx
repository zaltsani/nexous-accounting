import { type IAccount } from "@nexous-accounting/types";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@nexous-accounting/ui";
import { toast } from "~/components/ui/toast";
import { useDeleteAccount } from "../data/use-delete-account";

interface DeleteAccountProps {
  data: IAccount;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteAccount = ({ data, open, onOpenChange }: DeleteAccountProps) => {
  const deleteMutation = useDeleteAccount();

  const handleDeleteSubmit = () => {
    deleteMutation.mutate(data.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
      onError: (err) => {
        console.error(err);
        toast.add({
          type: "error",
          description: err.message,
          priority: "high",
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Akun</DialogTitle>
        </DialogHeader>
        <div>Apakah anda yakin ingin menghapus akun anda?</div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteSubmit}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
