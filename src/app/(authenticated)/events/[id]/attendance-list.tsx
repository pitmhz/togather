"use client";

import { useTransition } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

import { updateAttendance } from "./attendance-actions";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Member = {
  id: string;
  name: string;
};

type Attendance = {
  member_id: string;
  status: "present" | "absent";
};

type AttendanceListProps = {
  eventId: string;
  members: Member[];
  attendance: Attendance[];
  isAdmin?: boolean;
};

export function AttendanceList({ eventId, members, attendance, isAdmin = true }: AttendanceListProps) {
  const [isPending, startTransition] = useTransition();

  const getStatus = (memberId: string) => {
    const record = attendance.find((a) => a.member_id === memberId);
    return record?.status || null;
  };

  const handleToggleStatus = (memberId: string) => {
    if (!isAdmin) return;
    
    const currentStatus = getStatus(memberId);
    let nextStatus: "present" | "absent" | null = "present";

    // Cycle: Null (Absent) -> Present -> Absent (Ijin) -> Null
    if (currentStatus === "present") nextStatus = "absent";
    else if (currentStatus === "absent") nextStatus = null;
    
    startTransition(async () => {
      await updateAttendance(eventId, memberId, nextStatus);
    });
  };

  const handleMarkAllPresent = () => {
    if (!confirm("Tandai semua jemaat sebagai HADIR?")) return;
    
    startTransition(async () => {
      // Loop parallel execution is acceptable for this small scale (~20 users)
      // Ideally this should be a bulk server action, but for now reuse existing
      await Promise.all(members.map(m => updateAttendance(eventId, m.id, "present")));
      toast.success("Semua ditandai hadir! 🙌");
    });
  };

  const presentCount = attendance.filter((a) => a.status === "present").length;
  const absentCount = attendance.filter((a) => a.status === "absent").length;

  return (
    <div className="space-y-4">
      {/* Header Stats & Quick Action */}
      <div className="flex items-center justify-between p-3 bg-white border border-[#E3E3E3] rounded-lg shadow-sm">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Hadir</span>
            <span className="text-lg font-bold text-emerald-600">{presentCount}</span>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Ijin</span>
            <span className="text-lg font-bold text-amber-600">{absentCount}</span>
          </div>
        </div>
        
        {isAdmin && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
            onClick={handleMarkAllPresent}
            disabled={isPending}
          >
            Hadir Semua
          </Button>
        )}
      </div>

      {/* Modern Grid Layout */}
      <div className="grid grid-cols-2 gap-2">
        {members.map((member) => {
          const status = getStatus(member.id);
          return (
            <button
              key={member.id}
              onClick={() => handleToggleStatus(member.id)}
              disabled={isPending || !isAdmin}
              className={cn(
                "group relative flex items-center gap-3 p-2.5 rounded-lg border text-left transition-all duration-200 active:scale-95",
                status === "present" 
                  ? "bg-emerald-50 border-emerald-200 shadow-sm" 
                  : status === "absent"
                    ? "bg-amber-50 border-amber-200 opacity-80"
                    : "bg-white border-transparent hover:border-gray-200 hover:bg-gray-50 text-gray-400"
              )}
            >
              {/* Status Indicator Dot */}
              <div className={cn(
                "w-2.5 h-2.5 rounded-full ring-2 ring-white shadow-sm transition-colors",
                status === "present" 
                  ? "bg-emerald-500" 
                  : status === "absent"
                    ? "bg-amber-500"
                    : "bg-gray-200"
              )} />
              
              <span className={cn(
                "text-sm font-medium truncate transition-colors",
                status === "present" 
                  ? "text-emerald-900" 
                  : status === "absent"
                    ? "text-amber-900"
                    : "text-gray-600"
              )}>
                {member.name}
              </span>

              {/* Status icon for clarity */}
              {status === "absent" && <span className="absolute right-2 text-[10px] font-bold text-amber-600 uppercase tracking-wide">IJIN</span>}
            </button>
          );
        })}
      </div>

      {members.length === 0 && (
        <p className="text-center py-8 text-muted-foreground text-sm bg-gray-50 rounded-lg border border-dashed border-gray-200">
          Belum ada jemaat. <br/> Tambahkan di menu Jemaat.
        </p>
      )}
    </div>
  );
}
