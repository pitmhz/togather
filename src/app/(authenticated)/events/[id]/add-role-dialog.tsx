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
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full bg-[#191919] hover:bg-[#2F2F2F] text-white"
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
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="w-full border-dashed border-2 text-[#9B9A97] hover:text-[#37352F] hover:border-[#37352F]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Posisi
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-lg font-semibold text-[#37352F]">
            Tambah Posisi Baru
          </DrawerTitle>
          <DrawerDescription>
            Buat posisi petugas untuk acara ini (misal: WL, Pendoa, MC)
          </DrawerDescription>
        </DrawerHeader>
        <form action={formAction} className="px-4 pb-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role_name" className="text-[#37352F]">Nama Posisi *</Label>
            <Input
              id="role_name"
              name="role_name"
              placeholder="contoh: Worship Leader"
              required
              autoFocus
              className="scroll-m-20"
            />
          </div>
          <SubmitButton />
        </form>
        <DrawerFooter className="pt-0">
          <DrawerClose asChild>
            <Button variant="outline">Batal</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
