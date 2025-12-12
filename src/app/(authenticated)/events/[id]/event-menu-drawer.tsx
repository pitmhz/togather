"use client";

import { useState, useTransition } from "react";
import { 
  FileText, 
  Pencil, 
  Share2, 
  ClipboardList,
  ChevronLeft,
  Save,
  Sparkles,
  Copy,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { updateEventNotes, generateAIContent } from "./actions";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/drawer";

type Event = {
  id: string;
  title: string;
  topic: string | null;
  event_date: string;
  location: string | null;
  notes: string | null;
};

type EventMenuDrawerProps = {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formattedDate: string;
  onShare: () => void;
  onCopyReport: () => void;
};

type MenuView = "main" | "notes" | "ai";

export function EventMenuDrawer({
  event,
  open,
  onOpenChange,
  formattedDate,
  onShare,
  onCopyReport,
}: EventMenuDrawerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [view, setView] = useState<MenuView>("main");
  const [notes, setNotes] = useState(event.notes || "");
  
  // AI state
  const [aiTopic, setAiTopic] = useState(event.topic || "");
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSaveNotes = () => {
    startTransition(async () => {
      const result = await updateEventNotes(event.id, notes);
      if (result?.success) {
        toast.success(result.message);
        setView("main");
      } else {
        toast.error(result?.message || "Gagal menyimpan catatan.");
      }
    });
  };

  const handleEditEvent = () => {
    onOpenChange(false);
    router.push(`/events/${event.id}/edit`);
  };

  const handleShare = () => {
    onShare();
    onOpenChange(false);
  };

  const handleCopyReport = () => {
    onCopyReport();
    onOpenChange(false);
  };

  const handleGenerateAI = async () => {
    if (!aiTopic.trim()) {
      toast.error("Topik harus diisi");
      return;
    }

    setIsGenerating(true);
    setAiResult(null);

    try {
      const result = await generateAIContent(aiTopic);
      if (result.success && result.content) {
        setAiResult(result.content);
      } else {
        toast.error(result.message || "Gagal generate materi");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyAIResult = () => {
    if (aiResult) {
      navigator.clipboard.writeText(aiResult);
      toast.success("Materi disalin ke clipboard!");
    }
  };

  // Reset view when drawer closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setView("main");
      setAiResult(null);
    }
    onOpenChange(open);
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        {view === "main" ? (
          <>
            <DrawerHeader className="text-left">
              <DrawerTitle className="text-lg font-semibold text-[#37352F]">
                Menu Event
              </DrawerTitle>
              <DrawerDescription>
                {event.title}
              </DrawerDescription>
            </DrawerHeader>

            <div className="px-4 pb-4 space-y-1">
              {/* AI Assistant - Featured */}
              <button
                onClick={() => setView("ai")}
                className="w-full flex items-center gap-3 p-3 rounded-md bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 transition-colors text-left border border-purple-100"
              >
                <Sparkles className="w-5 h-5 text-purple-500" />
                <div className="flex-1">
                  <p className="font-medium text-[#37352F]">✨ Asisten Materi AI</p>
                  <p className="text-xs text-[#9B9A97]">Generate panduan diskusi otomatis</p>
                </div>
              </button>

              {/* Notes */}
              <button
                onClick={() => setView("notes")}
                className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-[#F7F7F5] transition-colors text-left"
              >
                <FileText className="w-5 h-5 text-blue-500" />
                <div className="flex-1">
                  <p className="font-medium text-[#37352F]">Catatan Sesi</p>
                  <p className="text-xs text-[#9B9A97]">
                    {event.notes ? "Ada catatan tersimpan" : "Belum ada catatan"}
                  </p>
                </div>
              </button>

              {/* Edit Event */}
              <button
                onClick={handleEditEvent}
                className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-[#F7F7F5] transition-colors text-left"
              >
                <Pencil className="w-5 h-5 text-orange-500" />
                <div className="flex-1">
                  <p className="font-medium text-[#37352F]">Ubah Jadwal</p>
                  <p className="text-xs text-[#9B9A97]">Edit judul, tanggal, lokasi</p>
                </div>
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-[#F7F7F5] transition-colors text-left"
              >
                <Share2 className="w-5 h-5 text-green-500" />
                <div className="flex-1">
                  <p className="font-medium text-[#37352F]">Bagikan Undangan</p>
                  <p className="text-xs text-[#9B9A97]">Kirim via WhatsApp</p>
                </div>
              </button>

              {/* Coach Report */}
              <button
                onClick={handleCopyReport}
                className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-[#F7F7F5] transition-colors text-left"
              >
                <ClipboardList className="w-5 h-5 text-purple-500" />
                <div className="flex-1">
                  <p className="font-medium text-[#37352F]">Kirim Laporan Coach</p>
                  <p className="text-xs text-[#9B9A97]">Salin ke clipboard</p>
                </div>
              </button>
            </div>

            <DrawerFooter className="pt-0">
              <DrawerClose asChild>
                <Button variant="outline">Tutup</Button>
              </DrawerClose>
            </DrawerFooter>
          </>
        ) : view === "notes" ? (
          <>
            {/* Notes Editor View */}
            <DrawerHeader className="text-left">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setView("main")}
                  className="p-1 rounded hover:bg-[#F7F7F5]"
                >
                  <ChevronLeft className="w-5 h-5 text-[#9B9A97]" />
                </button>
                <DrawerTitle className="text-lg font-semibold text-[#37352F]">
                  Catatan Sesi
                </DrawerTitle>
              </div>
              <DrawerDescription>
                Tulis catatan untuk pertemuan ini
              </DrawerDescription>
            </DrawerHeader>

            <div className="px-4 pb-4">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Pembahasan tentang kasih Allah, diskusi grup sangat aktif, perlu follow up Budi..."
                className="min-h-[200px] resize-none scroll-m-20"
              />
            </div>

            <DrawerFooter className="pt-0">
              <Button
                onClick={handleSaveNotes}
                disabled={isPending}
                className="bg-[#191919] hover:bg-[#2F2F2F] text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {isPending ? "Menyimpan..." : "Simpan Catatan"}
              </Button>
              <Button variant="outline" onClick={() => setView("main")}>
                Batal
              </Button>
            </DrawerFooter>
          </>
        ) : (
          <>
            {/* AI Assistant View */}
            <DrawerHeader className="text-left">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setView("main")}
                  className="p-1 rounded hover:bg-[#F7F7F5]"
                >
                  <ChevronLeft className="w-5 h-5 text-[#9B9A97]" />
                </button>
                <DrawerTitle className="text-lg font-semibold text-[#37352F]">
                  ✨ Asisten Materi AI
                </DrawerTitle>
              </div>
              <DrawerDescription>
                Generate panduan diskusi otomatis dengan Gemini
              </DrawerDescription>
            </DrawerHeader>

            <div className="px-4 pb-4 space-y-4 overflow-y-auto max-h-[50vh]">
              {/* Topic Input */}
              <div className="space-y-2">
                <Label htmlFor="ai-topic" className="text-[#37352F]">Topik Bahasan</Label>
                <Input
                  id="ai-topic"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="contoh: Mengatasi Kecemasan"
                  className="scroll-m-20"
                />
              </div>

              {/* Generate Button */}
              {!aiResult && (
                <Button
                  onClick={handleGenerateAI}
                  disabled={isGenerating || !aiTopic.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Gemini sedang berpikir...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Materi
                    </>
                  )}
                </Button>
              )}

              {/* Result Area */}
              {aiResult && (
                <div className="space-y-3">
                  <div className="p-4 bg-[#F7F7F5] rounded-md border border-[#E3E3E3]">
                    <pre className="whitespace-pre-wrap text-sm text-[#37352F] font-sans">
                      {aiResult}
                    </pre>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCopyAIResult}
                      variant="outline"
                      className="flex-1"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Materi
                    </Button>
                    <Button
                      onClick={() => setAiResult(null)}
                      variant="outline"
                    >
                      Generate Ulang
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <DrawerFooter className="pt-0">
              <Button variant="outline" onClick={() => setView("main")}>
                Kembali
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
