"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, UserCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { updateRoleAssignment, deleteRole, type ActionState } from "./actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Role = {
  id: string;
  role_name: string;
  assignee_name: string | null;
  is_filled: boolean;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
      disabled={pending}
    >
      {pending ? "Menyimpan..." : "Simpan"}
    </Button>
  );
}

export function RoleItem({ role, eventId }: { role: Role; eventId: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const updateRoleWithIds = updateRoleAssignment.bind(null, role.id, eventId);
  const [state, formAction] = useActionState<ActionState, FormData>(
    updateRoleWithIds,
    null
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      setOpen(false);
    } else if (state?.success === false) {
      toast.error(state.message);
    }
  }, [state]);

  const handleDelete = () => {
    if (!confirm("Hapus posisi ini?")) return;

    startTransition(async () => {
      const result = await deleteRole(role.id, eventId);
      if (result?.success) {
        toast.success(result.message);
        setOpen(false);
      } else {
        toast.error(result?.message || "Gagal menghapus");
      }
    });
  };

  const isFilled = role.is_filled && role.assignee_name;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className={`w-full p-3 rounded-lg border-2 text-left transition-colors ${
            isFilled
              ? "border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/30"
              : "border-dashed border-zinc-300 dark:border-zinc-700"
          }`}
        >
          <div className="flex items-center gap-3">
            {isFilled ? (
              <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            ) : (
              <UserCircle className="w-5 h-5 text-zinc-400 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {role.role_name}
              </p>
              <p
                className={`text-sm font-medium truncate ${
                  isFilled ? "text-indigo-600" : "text-zinc-400"
                }`}
              >
                {isFilled ? role.assignee_name : "Belum diisi"}
              </p>
            </div>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(480px-2rem)]">
        <DialogHeader>
          <DialogTitle className="font-heading">
            Ubah: {role.role_name}
          </DialogTitle>
          <DialogDescription>
            Tunjuk seseorang untuk posisi ini atau kosongkan
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="assignee_name">Nama Petugas</Label>
            <Input
              id="assignee_name"
              name="assignee_name"
              placeholder="Masukkan nama (atau kosongkan)"
              defaultValue={role.assignee_name || ""}
              autoFocus
            />
          </div>
          <div className="flex gap-2">
            <SubmitButton />
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
              className="px-3"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
