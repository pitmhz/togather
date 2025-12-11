"use client";

import { useState } from "react";
import { ClipboardCopy, Check } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

type Member = {
  id: string;
  name: string;
};

type Attendance = {
  member_id: string;
  status: "present" | "absent";
};

type CopyReportButtonProps = {
  event: {
    title: string;
    topic: string | null;
    location: string | null;
    event_date: string;
  };
  leaderName: string;
  members: Member[];
  attendance: Attendance[];
};

export function CopyReportButton({
  event,
  leaderName,
  members,
  attendance,
}: CopyReportButtonProps) {
  const [copied, setCopied] = useState(false);

  const presentMembers = members.filter((m) =>
    attendance.some((a) => a.member_id === m.id && a.status === "present")
  );
  const absentMembers = members.filter((m) =>
    attendance.some((a) => a.member_id === m.id && a.status === "absent")
  );

  const presentCount = presentMembers.length;
  const absentCount = absentMembers.length;
  const totalCount = presentCount + absentCount;

  const handleCopy = async () => {
    const eventDate = new Date(event.event_date);
    const formattedDate = format(eventDate, "EEEE, d MMMM yyyy", { locale: idLocale });

    let report = `*LAPORAN KOMSEL - ${formattedDate}*\n`;
    if (event.location) {
      report += `📍 ${event.location}\n`;
    }
    report += `👤 Leader: ${leaderName}\n\n`;
    
    report += `📊 *Statistik:*\n`;
    report += `- Hadir: ${presentCount}\n`;
    report += `- Ijin: ${absentCount}\n`;
    report += `- Total: ${totalCount}\n\n`;
    
    if (presentMembers.length > 0) {
      report += `✅ *Hadir:*\n`;
      presentMembers.forEach((m, i) => {
        report += `${i + 1}. ${m.name}\n`;
      });
      report += `\n`;
    }
    
    if (absentMembers.length > 0) {
      report += `⚠️ *Ijin:*\n`;
      absentMembers.forEach((m, i) => {
        report += `${i + 1}. ${m.name}\n`;
      });
      report += `\n`;
    }
    
    report += `*Notes:*\n`;
    report += `${event.topic || event.title} berjalan lancar.\n\n`;
    report += `_Powered by Togather_`;

    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      toast.success("Laporan disalin! Kirim ke Coach sekarang. 📋");
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast.error("Gagal menyalin laporan");
    }
  };

  return (
    <Button
      onClick={handleCopy}
      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          Tersalin!
        </>
      ) : (
        <>
          <ClipboardCopy className="w-4 h-4 mr-2" />
          📋 Copy Laporan Coach
        </>
      )}
    </Button>
  );
}
