"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { addRole, type ActionState } from "./actions";

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

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
      disabled={pending}
    >
      {pending ? "Menambahkan..." : "Tambah Posisi"}
    </Button>
  );
}

export function AddRoleDialog({ eventId }: { eventId: string }) {
  const [open, setOpen] = useState(false);
  const addRoleWithId = addRole.bind(null, eventId);
  const [state, formAction] = useActionState<ActionState, FormData>(
    addRoleWithId,
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full border-dashed border-2 text-muted-foreground hover:text-foreground hover:border-indigo-400"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Posisi
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(480px-2rem)]">
        <DialogHeader>
          <DialogTitle className="font-heading">Tambah Posisi Baru</DialogTitle>
          <DialogDescription>
            Buat posisi petugas untuk acara ini (misal: WL, Pendoa, MC)
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="role_name">Nama Posisi *</Label>
            <Input
              id="role_name"
              name="role_name"
              placeholder="contoh: Worship Leader"
              required
              autoFocus
            />
          </div>
          <SubmitButton />
        </form>
      </DialogContent>
    </Dialog>
  );
}
