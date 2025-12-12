"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Plus, Calendar, MapPin } from "lucide-react";
import { toast } from "sonner";

import { createEvent, type ActionState } from "./actions";

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
      className="w-full bg-[#191919] hover:bg-[#2F2F2F] text-white font-medium"
      disabled={pending}
    >
      {pending ? "Menyimpan..." : "Simpan Jadwal"}
    </Button>
  );
}

export function CreateEventDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<ActionState, FormData>(
    createEvent,
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
        <Button className="fixed bottom-20 right-4 z-40 h-12 px-4 bg-[#191919] hover:bg-[#2F2F2F] text-white shadow-lg rounded-full">
          <Plus className="w-5 h-5 mr-2" />
          Buat Jadwal
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-lg font-semibold text-[#37352F]">
            Buat Jadwal Baru
          </DrawerTitle>
          <DrawerDescription>
            Atur jadwal pertemuan komsel untuk kelompok.
          </DrawerDescription>
        </DrawerHeader>
        <form action={formAction} className="px-4 pb-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[#37352F]">Judul Acara *</Label>
            <Input
              id="title"
              name="title"
              placeholder="contoh: Komsel Gabungan"
              required
              className="scroll-m-20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic" className="text-[#37352F]">Topik / Tema</Label>
            <Input
              id="topic"
              name="topic"
              placeholder="contoh: Bertumbuh dalam Iman"
              className="scroll-m-20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event_date" className="flex items-center gap-2 text-[#37352F]">
              <Calendar className="w-4 h-4" />
              Tanggal & Jam *
            </Label>
            <Input
              id="event_date"
              name="event_date"
              type="datetime-local"
              required
              className="scroll-m-20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2 text-[#37352F]">
              <MapPin className="w-4 h-4" />
              Lokasi
            </Label>
            <Input
              id="location"
              name="location"
              placeholder="contoh: Rumah Budi"
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
