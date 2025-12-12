"use client";

import { useState, useRef, useTransition } from "react";
import { format, differenceInDays, isToday } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { CalendarDays, MapPin, MoreHorizontal, Camera } from "lucide-react";
import { toast } from "sonner";

import { EventMenuDrawer } from "./event-menu-drawer";
import { uploadEventCover } from "./actions";
import { compressImage } from "@/lib/image-upload";
import { 
  generateInvitationText, 
  generateInvitationTextRaw,
  generateCoachReport,
  generateCoachReportRaw 
} from "@/lib/whatsapp-generator";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Event = {
  id: string;
  title: string;
  topic: string | null;
  event_date: string;
  location: string | null;
  maps_link: string | null;
  notes: string | null;
  cover_url: string | null;
};

type EventInfoCardProps = {
  event: Event;
  formattedDate: string;
  shareData: {
    title: string;
    topic: string | null;
    date: string;
    location: string | null;
  };
  reportData: {
    title: string;
    date: string;
    members: { name: string }[];
    roles: { role_name: string; assignee_name: string | null }[];
    attendance: { member_id: string; status: string }[];
  };
};

function getCountdownBadge(eventDate: Date, hasCover: boolean) {
  const textColor = hasCover ? "text-white" : "";
  
  if (isToday(eventDate)) {
    return (
      <Badge className="text-[10px] px-2 py-0.5 bg-[#EB5757] text-white border-0 rounded-sm animate-pulse">
        HARI INI
      </Badge>
    );
  }
  
  const daysUntil = differenceInDays(eventDate, new Date());
  
  if (daysUntil > 0 && daysUntil <= 3) {
    return (
      <Badge className={`text-[10px] px-2 py-0.5 ${hasCover ? "bg-white/20 text-white" : "bg-[#FADEC9] text-[#D9730D]"} border-0 rounded-sm`}>
        H-{daysUntil}
      </Badge>
    );
  }
  
  return null;
}

export function EventInfoCard({ 
  event, 
  formattedDate,
  shareData,
  reportData 
}: EventInfoCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isUploading, startUpload] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const eventDate = new Date(event.event_date);
  const hasCover = !!event.cover_url;

  const handleShare = () => {
    const invitationText = generateInvitationText(event, reportData.roles);
    const rawText = generateInvitationTextRaw(event, reportData.roles);
    
    const whatsappUrl = `https://wa.me/?text=${invitationText}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(rawText);
    toast.success("Teks undangan disalin!");
    
    // Open WhatsApp
    window.open(whatsappUrl, "_blank");
  };

  const handleCopyReport = () => {
    const { members, attendance } = reportData;
    
    const presentCount = attendance.filter(a => a.status === "present").length;
    const absentCount = members.length - presentCount;
    
    const stats = {
      present: presentCount,
      absent: absentCount,
      total: members.length
    };
    
    const reportText = generateCoachReport(event, stats, event.notes);
    const rawText = generateCoachReportRaw(event, stats, event.notes);
    
    const whatsappUrl = `https://wa.me/?text=${reportText}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(rawText);
    toast.success("Laporan disalin ke clipboard!");
    
    // Open WhatsApp
    window.open(whatsappUrl, "_blank");
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    toast.loading("Mengkompresi gambar...", { id: "cover-upload" });

    try {
      const compressed = await compressImage(file);
      
      toast.loading("Mengupload sampul...", { id: "cover-upload" });

      const formData = new FormData();
      formData.append("cover", compressed);

      startUpload(async () => {
        const result = await uploadEventCover(event.id, formData);
        if (result?.success) {
          toast.success(result.message, { id: "cover-upload" });
        } else {
          toast.error(result?.message || "Gagal upload", { id: "cover-upload" });
        }
      });
    } catch (error) {
      toast.error("Gagal memproses gambar", { id: "cover-upload" });
    }
  };

  return (
    <>
      <Card 
        className={`relative overflow-hidden border border-[#E3E3E3] mb-6 cursor-pointer transition-colors ${
          hasCover ? "bg-black" : "bg-white hover:bg-[#F7F7F5]"
        }`}
        onClick={() => setMenuOpen(true)}
      >
        {/* Cover Image */}
        {hasCover && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${event.cover_url})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          </>
        )}

        {/* Upload Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          disabled={isUploading}
          className={`absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
            hasCover 
              ? "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm" 
              : "bg-[#F7F7F5] text-[#9B9A97] hover:bg-[#E3E3E3]"
          }`}
        >
          <Camera className="w-3 h-3" />
          {isUploading ? "..." : "Sampul"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleCoverUpload}
          className="hidden"
        />

        <CardContent className={`relative pt-5 pb-4 ${hasCover ? "pt-24" : ""}`}>
          {/* Header with title and countdown */}
          <div className="flex items-start justify-between mb-2">
            <h1 className={`text-xl font-heading font-semibold flex-1 ${hasCover ? "text-white" : "text-[#37352F]"}`}>
              {event.title}
            </h1>
            <div className="flex items-center gap-2">
              {getCountdownBadge(eventDate, hasCover)}
              <MoreHorizontal className={`w-5 h-5 ${hasCover ? "text-white/70" : "text-[#9B9A97]"}`} />
            </div>
          </div>

          {event.topic && (
            <p className={`text-sm mb-4 ${hasCover ? "text-white/80" : "text-[#9B9A97]"}`}>
              {event.topic}
            </p>
          )}

          <div className={`flex flex-wrap gap-4 text-sm ${hasCover ? "text-white/80" : "text-[#9B9A97]"}`}>
            <div className="flex items-center gap-2">
              <CalendarDays className={`w-4 h-4 ${hasCover ? "text-white" : "text-[#37352F]"}`} />
              <span>
                {format(eventDate, "EEEE, d MMM yyyy", { locale: idLocale })} • {format(eventDate, "HH:mm")}
              </span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className={`w-4 h-4 ${hasCover ? "text-white" : "text-[#37352F]"}`} />
                <span>{event.location}</span>
              </div>
            )}
          </div>

          {/* Notes indicator */}
          {event.notes && !hasCover && (
            <div className="mt-3 p-2 bg-[#F7F7F5] rounded-md">
              <p className="text-xs text-[#9B9A97] line-clamp-2">
                📝 {event.notes}
              </p>
            </div>
          )}

          {/* Maps Link Button */}
          {event.maps_link && (
            <a
              href={event.maps_link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                hasCover 
                  ? "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                  : "bg-[#DBEDDB] text-[#0F7B6C] hover:bg-[#DBEDDB]/80"
              }`}
            >
              📍 Buka Peta
            </a>
          )}
        </CardContent>
      </Card>

      <EventMenuDrawer
        event={event}
        open={menuOpen}
        onOpenChange={setMenuOpen}
        formattedDate={formattedDate}
        onShare={handleShare}
        onCopyReport={handleCopyReport}
      />
    </>
  );
}
