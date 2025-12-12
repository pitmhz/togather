"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { addMember, type ActionState } from "./actions";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { triggerHaptic } from "@/lib/utils";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full h-14 rounded-full bg-black text-white text-lg font-semibold shadow-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Menyimpan...
        </>
      ) : (
        "Tambah Jemaat"
      )}
    </button>
  );
}

export function AddMemberDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<string>("");
  const [birthDate, setBirthDate] = useState("");

  const [state, formAction] = useActionState<ActionState, FormData>(
    addMember,
    null
  );

  useEffect(() => {
    if (state?.success) {
      triggerHaptic("success");
      toast.success(state.message + " 🎉");
      setOpen(false);
      // Reset form
      setName("");
      setPhone("");
      setGender("");
      setBirthDate("");
    } else if (state?.success === false) {
      triggerHaptic("error");
      toast.error(state.message + " ❌");
    }
  }, [state]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button
          className="w-14 h-14 rounded-full bg-black text-white shadow-lg hover:bg-neutral-800 active:scale-95 transition-all flex items-center justify-center"
        >
          <UserPlus className="w-6 h-6" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="text-center pb-2">
          <DrawerTitle className="text-xl font-bold text-neutral-900">
            Tambah Jemaat Baru
          </DrawerTitle>
          <p className="text-sm text-neutral-500">
            Masukkan data anggota komsel
          </p>
        </DrawerHeader>

        <form action={formAction} className="px-4 pb-4 overflow-y-auto">
          {/* iOS-style Input Group */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden mb-4">
            {/* Name */}
            <div className="flex items-center px-4 py-3.5 border-b border-neutral-100">
              <span className="text-neutral-500 w-20 text-sm flex-shrink-0">Nama</span>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Budi Santoso"
                required
                autoFocus
                className="flex-1 bg-transparent text-neutral-900 placeholder:text-neutral-400 focus:outline-none text-base"
              />
            </div>

            {/* Phone */}
            <div className="flex items-center px-4 py-3.5 border-b border-neutral-100">
              <span className="text-neutral-500 w-20 text-sm flex-shrink-0">WhatsApp</span>
              <input
                type="tel"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="081234567890"
                className="flex-1 bg-transparent text-neutral-900 placeholder:text-neutral-400 focus:outline-none text-base"
              />
            </div>

            {/* Birth Date */}
            <div className="flex items-center px-4 py-3.5">
              <span className="text-neutral-500 w-20 text-sm flex-shrink-0">Lahir</span>
              <input
                type="date"
                name="birth_date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="flex-1 bg-transparent text-neutral-900 focus:outline-none text-base"
              />
            </div>
          </div>

          {/* Gender Selection */}
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2 px-1">
            Gender
          </p>
          <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={() => {
                setGender("L");
                triggerHaptic("light");
              }}
              className={`flex-1 py-3.5 rounded-2xl border-2 text-base font-medium transition-all active:scale-95 ${gender === "L"
                ? "bg-blue-50 border-blue-400 text-blue-700"
                : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300"
                }`}
            >
              👨 Laki-laki
            </button>
            <button
              type="button"
              onClick={() => {
                setGender("P");
                triggerHaptic("light");
              }}
              className={`flex-1 py-3.5 rounded-2xl border-2 text-base font-medium transition-all active:scale-95 ${gender === "P"
                ? "bg-pink-50 border-pink-400 text-pink-700"
                : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300"
                }`}
            >
              👩 Perempuan
            </button>
          </div>
          <input type="hidden" name="gender" value={gender} />

          <DrawerFooter className="px-0 pt-2">
            <SubmitButton />
            <DrawerClose asChild>
              <button
                type="button"
                className="w-full py-3 text-neutral-500 font-medium hover:text-neutral-700 transition-colors"
              >
                Batal
              </button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
