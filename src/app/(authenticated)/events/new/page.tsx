"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowLeft, MapPin, Users, Megaphone, Map, Camera, Clock, Calendar } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { createEvent, type ActionState } from "@/app/(authenticated)/dashboard/actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateTimePicker } from "@/components/date-time-picker";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { IOSListGroup, IOSListHeader, IOSListItem, IOSListSeparator } from "@/components/ui/ios-list";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Book } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full h-14 rounded-full bg-black text-white text-lg font-semibold shadow-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Menyimpan..." : "Buat Acara"}
    </button>
  );
}

export default function NewEventPage() {
  const router = useRouter();
  const [eventType, setEventType] = useState("regular");
  const [isOuting, setIsOuting] = useState(false);
  const [location, setLocation] = useState("Via House");
  const [mapsLink, setMapsLink] = useState("");
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");

  // Liturgy state
  const [sermonPassage, setSermonPassage] = useState("");
  const [benediction, setBenediction] = useState("");
  const [songs, setSongs] = useState<Array<{ label: string; number: string; title: string }>>([
    { label: "BE", number: "", title: "" }
  ]);

  const addSong = () => {
    setSongs([...songs, { label: "BE", number: "", title: "" }]);
  };

  const removeSong = (index: number) => {
    setSongs(songs.filter((_, i) => i !== index));
  };

  const updateSong = (index: number, field: 'label' | 'number' | 'title', value: string) => {
    const updated = [...songs];
    updated[index][field] = value;
    setSongs(updated);
  };

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
      toast.success("🎉 " + state.message);
      router.push("/dashboard");
    } else if (state?.success === false) {
      toast.error(state.message + " ❌");
    }
  }, [state, router]);

  return (
    <main className="min-h-screen flex flex-col pb-28 bg-[#F2F2F7] relative overflow-hidden">
      {/* Decorative Gradient Blob */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-100/60 to-purple-100/60 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-32 left-0 w-48 h-48 bg-gradient-to-tr from-amber-100/40 to-pink-100/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      {/* Form */}
      <div className="flex-1 px-4 pt-4 relative z-10">
        <form action={formAction} className="space-y-4">

          {/* Block A: Detail Dasar */}
          <div className="space-y-4">
            {/* Cover Photo Placeholder */}
            <div className="h-48 bg-neutral-200 rounded-2xl border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-neutral-300 transition-colors">
              <Camera className="w-8 h-8 text-neutral-400" />
              <p className="text-sm text-neutral-500 font-medium">Tambah Sampul Acara</p>
              <p className="text-xs text-neutral-400">Opsional</p>
            </div>

            {/* Title Input - Large & Bold */}
            <input
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nama Acara..."
              required
              autoFocus
              className="w-full bg-transparent text-2xl font-bold text-neutral-900 placeholder:text-neutral-300 outline-none py-2"
            />

            {/* Topic / Theme */}
            <input
              name="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Topik atau tema acara (opsional)"
              className="w-full bg-transparent text-base text-neutral-600 placeholder:text-neutral-400 outline-none"
            />
          </div>

          {/* Block B: Tipe Event */}
          <IOSListGroup className="p-0">
            <div className="p-4">
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-3">Tipe Komsel</p>
              <RadioGroup
                value={eventType}
                onValueChange={setEventType}
                className="grid grid-cols-2 gap-3"
              >
                <Label
                  htmlFor="regular"
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${eventType === "regular"
                    ? "bg-indigo-100 ring-2 ring-indigo-500"
                    : "bg-neutral-100 hover:bg-neutral-200"
                    }`}
                >
                  <RadioGroupItem value="regular" id="regular" className="sr-only" />
                  <Users className={`w-5 h-5 ${eventType === "regular" ? "text-indigo-600" : "text-neutral-400"}`} />
                  <div>
                    <p className={`font-medium text-sm ${eventType === "regular" ? "text-indigo-700" : "text-neutral-700"}`}>Regular</p>
                    <p className="text-xs text-neutral-500">Komsel Biasa</p>
                  </div>
                </Label>
                <Label
                  htmlFor="gabungan"
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${eventType === "gabungan"
                    ? "bg-indigo-100 ring-2 ring-indigo-500"
                    : "bg-neutral-100 hover:bg-neutral-200"
                    }`}
                >
                  <RadioGroupItem value="gabungan" id="gabungan" className="sr-only" />
                  <Megaphone className={`w-5 h-5 ${eventType === "gabungan" ? "text-indigo-600" : "text-neutral-400"}`} />
                  <div>
                    <p className={`font-medium text-sm ${eventType === "gabungan" ? "text-indigo-700" : "text-neutral-700"}`}>Gabungan</p>
                    <p className="text-xs text-neutral-500">Joint Service</p>
                  </div>
                </Label>
              </RadioGroup>
              <input type="hidden" name="event_type" value={eventType} />
            </div>
          </IOSListGroup>

          {/* Block C: Waktu */}
          <div>
            <IOSListHeader>Waktu</IOSListHeader>
            <IOSListGroup className="p-4">
              <DateTimePicker name="event_date" required />
            </IOSListGroup>
          </div>

          {/* Block D: Lokasi */}
          <div>
            <IOSListHeader>Lokasi</IOSListHeader>
            <IOSListGroup className="overflow-hidden">
              {/* Outing Toggle */}
              <div className="flex items-center justify-between p-4 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <Map className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Acara di Luar?</p>
                    <p className="text-xs text-neutral-500">Aktifkan jika bukan di rumah biasa</p>
                  </div>
                </div>
                <Switch
                  checked={isOuting}
                  onCheckedChange={setIsOuting}
                />
                <input type="hidden" name="is_outing" value={isOuting ? "true" : "false"} />
              </div>

              {/* Location Input */}
              <div className="p-4 border-b border-neutral-100">
                <label className="text-xs font-medium text-neutral-500 mb-1.5 block">Nama Lokasi</label>
                <input
                  name="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={isOuting ? "contoh: Starbucks Sudirman" : "contoh: Rumah Budi"}
                  className="w-full bg-neutral-100 rounded-xl h-12 px-4 text-base outline-none focus:bg-white focus:ring-2 focus:ring-neutral-200 transition-all"
                />
              </div>

              {/* Maps Link (Outing only) */}
              {isOuting && (
                <div className="p-4 border-b border-neutral-100">
                  <label className="text-xs font-medium text-neutral-500 mb-1.5 block">Link Google Maps</label>
                  <input
                    name="maps_link"
                    value={mapsLink}
                    onChange={(e) => setMapsLink(e.target.value)}
                    placeholder="https://maps.google.com/..."
                    type="url"
                    className="w-full bg-neutral-100 rounded-xl h-12 px-4 text-base outline-none focus:bg-white focus:ring-2 focus:ring-neutral-200 transition-all"
                  />
                </div>
              )}

              {/* Mock Map Preview */}
              <div className="h-32 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center relative rounded-b-xl">
                <div className="absolute inset-0 opacity-30">
                  {/* Faux map pattern */}
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="0" y1="20" x2="100" y2="20" stroke="#10b981" strokeWidth="0.5" />
                    <line x1="0" y1="50" x2="100" y2="50" stroke="#10b981" strokeWidth="0.5" />
                    <line x1="0" y1="80" x2="100" y2="80" stroke="#10b981" strokeWidth="0.5" />
                    <line x1="25" y1="0" x2="25" y2="100" stroke="#10b981" strokeWidth="0.5" />
                    <line x1="50" y1="0" x2="50" y2="100" stroke="#10b981" strokeWidth="0.5" />
                    <line x1="75" y1="0" x2="75" y2="100" stroke="#10b981" strokeWidth="0.5" />
                  </svg>
                </div>
                <div className="bg-white rounded-full p-3 shadow-lg z-10">
                  <MapPin className="w-6 h-6 text-red-500" />
                </div>
                <p className="absolute bottom-2 left-0 right-0 text-center text-xs text-teal-700 font-medium">
                  {location || "Lokasi akan ditampilkan di sini"}
                </p>
              </div>
            </IOSListGroup>
          </div>

          {/* Block E: Liturgy Details (Collapsible) */}
          <div>
            <IOSListGroup className="overflow-hidden">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="liturgy" className="border-0">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-neutral-50">
                    <div className="flex items-center gap-3">
                      <Book className="w-5 h-5 text-purple-500" />
                      <span className="font-medium text-neutral-900">📖 Detail Liturgi & Lagu</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 space-y-4">
                    {/* Sermon Passage */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-neutral-500">Nats / Ayat Khotbah</label>
                      <Textarea
                        name="sermon_passage"
                        value={sermonPassage}
                        onChange={(e) => setSermonPassage(e.target.value)}
                        placeholder="contoh: Yohanes 3:16-17"
                        className="min-h-[60px] bg-neutral-100 border-0 rounded-xl resize-none"
                      />
                    </div>

                    {/* Songs List */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-neutral-500">Daftar Lagu (4-5 Lagu)</label>
                      {songs.map((song, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Select
                            value={song.label}
                            onValueChange={(val) => updateSong(idx, 'label', val)}
                          >
                            <SelectTrigger className="w-20 h-10 bg-neutral-100 border-0 rounded-lg text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="BE">BE</SelectItem>
                              <SelectItem value="KJ">KJ</SelectItem>
                              <SelectItem value="BN">BN</SelectItem>
                              <SelectItem value="PKJ">PKJ</SelectItem>
                              <SelectItem value="Lainnya">Lainnya</SelectItem>
                            </SelectContent>
                          </Select>
                          <input
                            type="text"
                            value={song.number}
                            onChange={(e) => updateSong(idx, 'number', e.target.value)}
                            placeholder="No."
                            className="w-16 h-10 bg-neutral-100 rounded-lg px-2 text-sm outline-none focus:ring-2 focus:ring-neutral-200"
                          />
                          <input
                            type="text"
                            value={song.title}
                            onChange={(e) => updateSong(idx, 'title', e.target.value)}
                            placeholder="Judul Lagu"
                            className="flex-1 h-10 bg-neutral-100 rounded-lg px-3 text-sm outline-none focus:ring-2 focus:ring-neutral-200"
                          />
                          {songs.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSong(idx)}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addSong}
                        className="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-700 font-medium mt-2"
                      >
                        <Plus className="w-4 h-4" />
                        Tambah Lagu
                      </button>
                      {/* Hidden input for songs JSON */}
                      <input type="hidden" name="songs" value={JSON.stringify(songs.filter(s => s.number || s.title))} />
                    </div>

                    {/* Benediction */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-neutral-500">Ayat Berkat / Renungan</label>
                      <Textarea
                        name="benediction"
                        value={benediction}
                        onChange={(e) => setBenediction(e.target.value)}
                        placeholder="contoh: Bilangan 6:24-26 - Tuhan memberkati dan melindungi..."
                        className="min-h-[80px] bg-neutral-100 border-0 rounded-xl resize-none"
                      />
                      <p className="text-xs text-neutral-400">Akan ditampilkan di Dashboard sebagai "Renungan Minggu Ini"</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </IOSListGroup>
          </div>

          {/* Block F: Opsi Tambahan */}
          <div>
            <IOSListHeader>Opsi Lainnya</IOSListHeader>
            <IOSListGroup className="p-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-500">Maksimal Peserta</label>
                <input
                  name="max_participants"
                  type="number"
                  min="1"
                  placeholder="∞ Tak Terbatas"
                  className="w-full bg-neutral-100 rounded-xl h-12 px-4 text-base outline-none focus:bg-white focus:ring-2 focus:ring-neutral-200 transition-all placeholder:text-neutral-400"
                />
                <p className="text-xs text-neutral-400">Kosongkan jika tidak ada batasan</p>
              </div>
            </IOSListGroup>
          </div>

        </form>
      </div>

      {/* Floating Pill Button */}
      <div className="fixed bottom-6 left-4 right-4 z-50 max-w-md mx-auto">
        <SubmitButton />
      </div>
    </main>
  );
}
