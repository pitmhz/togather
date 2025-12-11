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
};

export function AttendanceList({ eventId, members, attendance }: AttendanceListProps) {
  const [isPending, startTransition] = useTransition();

  const getStatus = (memberId: string) => {
    const record = attendance.find((a) => a.member_id === memberId);
    return record?.status || null;
  };

  const handleStatusChange = (memberId: string, newStatus: "present" | "absent") => {
    const currentStatus = getStatus(memberId);
    // Toggle off if clicking same status
    const status = currentStatus === newStatus ? null : newStatus;

    startTransition(async () => {
      const result = await updateAttendance(eventId, memberId, status);
      if (result?.success) {
        // Silent success - UI updates via revalidation
      } else {
        toast.error(result?.message || "Gagal update absensi");
      }
    });
  };

  const presentCount = attendance.filter((a) => a.status === "present").length;
  const absentCount = attendance.filter((a) => a.status === "absent").length;

  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className="flex items-center gap-4 text-sm">
        <span className="flex items-center gap-1 text-emerald-600">
          <Check className="w-4 h-4" />
          <span className="font-medium">{presentCount} Hadir</span>
        </span>
        <span className="flex items-center gap-1 text-amber-600">
          <X className="w-4 h-4" />
          <span className="font-medium">{absentCount} Ijin</span>
        </span>
      </div>

      {/* Member List */}
      <div className="space-y-2">
        {members.map((member) => {
          const status = getStatus(member.id);
          return (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 bg-card border border-border rounded-lg"
            >
              <span className="font-medium text-foreground truncate flex-1">
                {member.name}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isPending}
                  onClick={() => handleStatusChange(member.id, "present")}
                  className={cn(
                    "h-8 w-8 p-0",
                    status === "present" && "bg-emerald-100 border-emerald-500 text-emerald-600 dark:bg-emerald-950"
                  )}
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isPending}
                  onClick={() => handleStatusChange(member.id, "absent")}
                  className={cn(
                    "h-8 w-8 p-0",
                    status === "absent" && "bg-amber-100 border-amber-500 text-amber-600 dark:bg-amber-950"
                  )}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {members.length === 0 && (
        <p className="text-center py-4 text-muted-foreground text-sm">
          Belum ada jemaat. Tambahkan di menu Jemaat terlebih dahulu.
        </p>
      )}
    </div>
  );
}
