"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { UserPlus, Cake, Users } from "lucide-react";
import { toast } from "sonner";

import { addMember, type ActionState } from "./actions";

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
      {pending ? "Menyimpan..." : "Tambah Jemaat"}
    </Button>
  );
}

export function AddMemberDialog() {
  const [open, setOpen] = useState(false);
  const [gender, setGender] = useState<string>("");
  const [state, formAction] = useActionState<ActionState, FormData>(
    addMember,
    null
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      setOpen(false);
      setGender("");
    } else if (state?.success === false) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="icon" className="bg-[#191919] hover:bg-[#2F2F2F] text-white w-9 h-9">
          <UserPlus className="w-4 h-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="font-heading text-[#37352F]">Tambah Jemaat Baru</DrawerTitle>
          <DrawerDescription>
            Masukkan data anggota komsel baru.
          </DrawerDescription>
        </DrawerHeader>
        
        <form action={formAction} className="px-4 space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#37352F]">Nama *</Label>
            <Input
              id="name"
              name="name"
              placeholder="contoh: Budi Santoso"
              required
              autoFocus
              className="scroll-m-20"
            />
          </div>
          
          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-[#37352F]">No. WhatsApp</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="contoh: 081234567890"
              className="scroll-m-20"
            />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-[#37352F]">
              <Users className="w-4 h-4" />
              Gender
            </Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setGender("L")}
                className={`flex-1 py-2 px-3 rounded-md border text-sm font-medium transition-colors ${
                  gender === "L" 
                    ? "bg-blue-100 border-blue-300 text-blue-700" 
                    : "bg-white border-[#E3E3E3] text-[#9B9A97] hover:bg-[#F7F7F5]"
                }`}
              >
                👨 Laki-laki
              </button>
              <button
                type="button"
                onClick={() => setGender("P")}
                className={`flex-1 py-2 px-3 rounded-md border text-sm font-medium transition-colors ${
                  gender === "P" 
                    ? "bg-pink-100 border-pink-300 text-pink-700" 
                    : "bg-white border-[#E3E3E3] text-[#9B9A97] hover:bg-[#F7F7F5]"
                }`}
              >
                👩 Perempuan
              </button>
            </div>
            <input type="hidden" name="gender" value={gender} />
          </div>

          {/* Birthday */}
          <div className="space-y-2">
            <Label htmlFor="birth_date" className="flex items-center gap-2 text-[#37352F]">
              <Cake className="w-4 h-4" />
              Tanggal Lahir
            </Label>
            <Input
              id="birth_date"
              name="birth_date"
              type="date"
              className="scroll-m-20"
            />
          </div>

          <DrawerFooter className="px-0">
            <SubmitButton />
            <DrawerClose asChild>
              <Button variant="outline">Batal</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
