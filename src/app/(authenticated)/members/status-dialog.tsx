"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { updateMemberStatus } from "./actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type StatusDialogProps = {
  memberId: string;
  memberName: string;
  currentStatus: "available" | "unavailable";
  currentReason?: string | null;
  currentUntil?: string | null;
  trigger: React.ReactNode;
};

export function StatusDialog({
  memberId,
  memberName,
  currentStatus,
  currentReason,
  currentUntil,
  trigger,
}: StatusDialogProps) {
  const [open, setOpen] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(currentStatus === "unavailable");
  const [reason, setReason] = useState(currentReason || "");
  const [untilDate, setUntilDate] = useState(currentUntil || "");
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      const status = isUnavailable ? "unavailable" : "available";
      
      const result = await updateMemberStatus(
        memberId,
        status,
        isUnavailable ? reason : null,
        isUnavailable && untilDate ? untilDate : null
      );

      if (result?.success) {
        toast.success(result.message);
        setOpen(false);
      } else {
        toast.error(result?.message || "Gagal mengubah status");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[calc(480px-2rem)]">
        <DialogHeader>
          <DialogTitle className="font-heading">Status Ketersediaan</DialogTitle>
          <DialogDescription>
            Atur status ketersediaan untuk {memberName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-zinc-900">
            <div className="flex items-center gap-3">
              <AlertCircle className={`w-5 h-5 ${isUnavailable ? "text-amber-500" : "text-emerald-500"}`} />
              <div>
                <p className="font-medium text-foreground">
                  {isUnavailable ? "Tidak Tersedia" : "Tersedia"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isUnavailable ? "Tidak bisa ditugaskan" : "Bisa ditugaskan ke peran"}
                </p>
              </div>
            </div>
            <Switch
              checked={isUnavailable}
              onCheckedChange={setIsUnavailable}
            />
          </div>

          {/* Reason & Date (only when unavailable) */}
          {isUnavailable && (
            <>
              <div className="space-y-2">
                <Label htmlFor="reason">Alasan</Label>
                <Input
                  id="reason"
                  placeholder="Mis: Dinas luar kota, Sakit, Cuti"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="untilDate">Sampai Tanggal (Opsional)</Label>
                <Input
                  id="untilDate"
                  type="date"
                  value={untilDate}
                  onChange={(e) => setUntilDate(e.target.value)}
                />
                {untilDate && (
                  <p className="text-xs text-muted-foreground">
                    Tidak tersedia sampai {format(new Date(untilDate), "d MMMM yyyy", { locale: idLocale })}
                  </p>
                )}
              </div>
            </>
          )}

          <Button
            onClick={handleSave}
            disabled={isPending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isPending ? "Menyimpan..." : "Simpan Status"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
