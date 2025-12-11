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
      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 right-6 max-w-[480px] w-auto h-14 px-5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg rounded-full">
          <Plus className="w-5 h-5 mr-2" />
          Buat Jadwal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(480px-2rem)] mx-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            Buat Jadwal Baru
          </DialogTitle>
          <DialogDescription>
            Atur jadwal pertemuan komsel untuk kelompok selmu.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Acara *</Label>
            <Input
              id="title"
              name="title"
              placeholder="contoh: Komsel Gabungan"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Topik / Tema</Label>
            <Input
              id="topic"
              name="topic"
              placeholder="contoh: Bertumbuh dalam Iman"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event_date" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Tanggal & Jam *
            </Label>
            <Input
              id="event_date"
              name="event_date"
              type="datetime-local"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Lokasi
            </Label>
            <Input
              id="location"
              name="location"
              placeholder="contoh: Rumah Budi"
            />
          </div>

          <SubmitButton />
        </form>
      </DialogContent>
    </Dialog>
  );
}
