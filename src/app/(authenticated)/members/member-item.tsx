"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { MoreHorizontal, Pencil, Trash2, Phone } from "lucide-react";
import { toast } from "sonner";

import { updateMember, deleteMember, type ActionState } from "./actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Member = {
  id: string;
  name: string;
  phone: string | null;
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

export function MemberItem({ member }: { member: Member }) {
  const [editOpen, setEditOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const updateMemberWithId = updateMember.bind(null, member.id);
  const [state, formAction] = useActionState<ActionState, FormData>(
    updateMemberWithId,
    null
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      setEditOpen(false);
    } else if (state?.success === false) {
      toast.error(state.message);
    }
  }, [state]);

  const handleDelete = () => {
    if (!confirm("Hapus jemaat ini?")) return;

    startTransition(async () => {
      const result = await deleteMember(member.id);
      if (result?.success) {
        toast.success(result.message);
      } else {
        toast.error(result?.message || "Gagal menghapus");
      }
    });
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{member.name}</p>
          {member.phone && (
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
              <Phone className="w-3 h-3" />
              {member.phone}
            </p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-red-600 focus:text-red-600"
              disabled={isPending}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-[calc(480px-2rem)]">
          <DialogHeader>
            <DialogTitle className="font-heading">Edit Jemaat</DialogTitle>
            <DialogDescription>
              Perbarui data anggota komsel.
            </DialogDescription>
          </DialogHeader>
          <form action={formAction} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama *</Label>
              <Input
                id="name"
                name="name"
                defaultValue={member.name}
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">No. Telepon</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={member.phone || ""}
              />
            </div>
            <SubmitButton />
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
