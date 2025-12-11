"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowLeft, MapPin, Users, Megaphone, Map } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { createEvent, type ActionState } from "@/app/(authenticated)/dashboard/actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateTimePicker } from "@/components/date-time-picker";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

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

export default function NewEventPage() {
  const router = useRouter();
  const [eventType, setEventType] = useState("regular");
  const [isOuting, setIsOuting] = useState(false);
  const [location, setLocation] = useState("Via House");
  const [mapsLink, setMapsLink] = useState("");
  
  const [state, formAction] = useActionState<ActionState, FormData>(
    createEvent,
    null
  );

  // Reset location when outing status changes
  useEffect(() => {
    if (isOuting) {
      setLocation("");
    } else {
      setLocation("Via House");
    }
  }, [isOuting]);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      router.push("/dashboard");
    } else if (state?.success === false) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <main className="min-h-screen flex flex-col pb-24">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 border-b border-border">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-lg font-heading font-semibold text-foreground">
          Buat Jadwal Baru
        </h1>
      </header>

      {/* Form */}
      <div className="flex-1 p-4">
        <form action={formAction} className="space-y-4">
          {/* Event Type Selection */}
          <div className="space-y-3">
            <Label>Tipe Komsel</Label>
            <RadioGroup
              value={eventType}
              onValueChange={setEventType}
              className="grid grid-cols-2 gap-2"
            >
              <Label
                htmlFor="regular"
                className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  eventType === "regular"
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950"
                    : "border-border hover:border-indigo-300"
                }`}
              >
                <RadioGroupItem value="regular" id="regular" className="sr-only" />
                <Users className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="font-medium text-sm">Regular</p>
                  <p className="text-xs text-muted-foreground">Komsel Biasa</p>
                </div>
              </Label>
              <Label
                htmlFor="gabungan"
                className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  eventType === "gabungan"
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950"
                    : "border-border hover:border-indigo-300"
                }`}
              >
                <RadioGroupItem value="gabungan" id="gabungan" className="sr-only" />
                <Megaphone className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="font-medium text-sm">Gabungan</p>
                  <p className="text-xs text-muted-foreground">Joint Service</p>
                </div>
              </Label>
            </RadioGroup>
            <input type="hidden" name="event_type" value={eventType} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Judul Acara *</Label>
            <Input
              id="title"
              name="title"
              placeholder={eventType === "gabungan" ? "contoh: Komsel Gabungan Tahun Baru" : "contoh: Komsel Minggu Ini"}
              required
              autoFocus
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

          <DateTimePicker name="event_date" required />

          {/* Outing Switch */}
          <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900">
            <div className="flex items-center gap-2">
              <Map className="w-4 h-4 text-amber-600" />
              <div>
                <p className="text-sm font-medium">Acara Outing / Di Luar?</p>
                <p className="text-xs text-muted-foreground">Aktifkan jika bukan di rumah biasa</p>
              </div>
            </div>
            <Switch
              checked={isOuting}
              onCheckedChange={setIsOuting}
            />
            <input type="hidden" name="is_outing" value={isOuting ? "true" : "false"} />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Lokasi
            </Label>
            <Input
              id="location"
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={isOuting ? "contoh: Starbucks Sudirman" : "contoh: Rumah Budi"}
            />
          </div>

          {/* Maps Link (Outing only) */}
          {isOuting && (
            <div className="space-y-2">
              <Label htmlFor="maps_link" className="flex items-center gap-2">
                <Map className="w-4 h-4" />
                Link Google Maps
              </Label>
              <Input
                id="maps_link"
                name="maps_link"
                value={mapsLink}
                onChange={(e) => setMapsLink(e.target.value)}
                placeholder="https://maps.google.com/..."
                type="url"
              />
              <p className="text-xs text-muted-foreground">
                💡 Paste link dari Google Maps untuk memudahkan navigasi
              </p>
            </div>
          )}

          <SubmitButton />
        </form>
      </div>
    </main>
  );
}
