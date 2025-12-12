"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowLeft, Calendar, MapPin, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { updateEvent, type ActionState } from "../actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Event = {
  id: string;
  title: string;
  topic: string | null;
  event_date: string;
  location: string | null;
  event_type: string | null;
  maps_link: string | null;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full bg-[#191919] hover:bg-[#2F2F2F] text-white font-medium"
      disabled={pending}
    >
      {pending ? "Menyimpan..." : "Simpan Perubahan"}
    </Button>
  );
}

export function EditEventForm({ event }: { event: Event }) {
  const router = useRouter();
  const [eventType, setEventType] = useState(event.event_type || "regular");
  
  const updateEventWithId = updateEvent.bind(null, event.id);
  const [state, formAction] = useActionState<ActionState, FormData>(
    updateEventWithId,
    null
  );

  // Format date for datetime-local input
  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      router.push(`/events/${event.id}`);
    } else if (state?.success === false) {
      toast.error(state.message);
    }
  }, [state, router, event.id]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA]">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 border-b border-[#E3E3E3] bg-white">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/events/${event.id}`}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-lg font-semibold text-[#37352F]">
          Ubah Jadwal
        </h1>
      </header>

      {/* Form */}
      <div className="flex-1 p-4">
        <form action={formAction} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[#37352F]">Judul Acara *</Label>
            <Input
              id="title"
              name="title"
              placeholder="contoh: Komsel Gabungan"
              required
              defaultValue={event.title}
              className="scroll-m-20"
            />
          </div>

          {/* Topic */}
          <div className="space-y-2">
            <Label htmlFor="topic" className="text-[#37352F]">Topik / Tema</Label>
            <Input
              id="topic"
              name="topic"
              placeholder="contoh: Bertumbuh dalam Iman"
              defaultValue={event.topic || ""}
              className="scroll-m-20"
            />
          </div>

          {/* Event Type */}
          <div className="space-y-2">
            <Label className="text-[#37352F]">Tipe Acara</Label>
            <Select 
              name="event_type" 
              value={eventType} 
              onValueChange={setEventType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">🏠 Regular (Komsel Biasa)</SelectItem>
                <SelectItem value="gabungan">🎉 Gabungan / Outing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date & Time */}
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
              defaultValue={formatDateForInput(event.event_date)}
              className="scroll-m-20"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2 text-[#37352F]">
              <MapPin className="w-4 h-4" />
              Lokasi
            </Label>
            <Input
              id="location"
              name="location"
              placeholder="contoh: Rumah Budi"
              defaultValue={event.location || ""}
              className="scroll-m-20"
            />
          </div>

          {/* Maps Link (for Gabungan) */}
          {eventType === "gabungan" && (
            <div className="space-y-2">
              <Label htmlFor="maps_link" className="flex items-center gap-2 text-[#37352F]">
                <LinkIcon className="w-4 h-4" />
                Link Google Maps
              </Label>
              <Input
                id="maps_link"
                name="maps_link"
                placeholder="https://maps.google.com/..."
                defaultValue={event.maps_link || ""}
                className="scroll-m-20"
              />
            </div>
          )}

          <div className="pt-4">
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}
