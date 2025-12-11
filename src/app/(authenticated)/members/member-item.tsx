"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { MoreHorizontal, Pencil, Trash2, Phone, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { toast } from "sonner";

import { updateMember, deleteMember, type ActionState } from "./actions";
import { StatusDialog } from "./status-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

type Member = {
  id: string;
  name: string;
  phone: string | null;
  email?: string | null;
  attendanceDots?: ("present" | "absent")[];
  avatar_url?: string | null;
  status?: "available" | "unavailable";
  unavailable_reason?: string | null;
  unavailable_until?: string | null;
};

type MemberItemProps = {
  member: Member;
  avatarUrl?: string;
};

function AttendanceDots({ dots }: { dots: ("present" | "absent")[] }) {
  if (!dots || dots.length === 0) return null;
  
  return (
    <div className="flex gap-0.5">
      {dots.map((status, i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full ${
            status === "present" ? "bg-emerald-500" : "bg-red-500"
          }`}
        />
      ))}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
      disabled={pending}
    >
      {pending ? "Menyimpan..." : "Simpan"}
    </Button>
  );
}

export function MemberItem({ member, avatarUrl }: MemberItemProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const updateMemberWithId = updateMember.bind(null, member.id);
  const [state, formAction] = useActionState<ActionState, FormData>(
    updateMemberWithId,
    null
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      setEditOpen(false);
    } else if (state?.success === false) {
      toast.error(state.message);
    }
  }, [state]);

  const handleDelete = () => {
    if (!confirm("Hapus jemaat ini?")) return;

    startTransition(async () => {
      const result = await deleteMember(member.id);
      if (result?.success) {
        toast.success(result.message);
      } else {
        toast.error(result?.message || "Gagal menghapus");
      }
    });
  };

  return (
    <>
      <div className={`flex items-center justify-between p-3 bg-card border border-border rounded-lg ${
        member.status === "unavailable" ? "opacity-70 bg-amber-50/50 dark:bg-amber-950/20" : ""
      }`}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Avatar */}
          {avatarUrl && (
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 relative">
              <img
                src={avatarUrl}
                alt={member.name}
                className="w-full h-full object-cover"
              />
              {member.status === "unavailable" && (
                <div className="absolute inset-0 bg-amber-500/30 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                </div>
              )}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate text-sm">{member.name}</p>
            {member.status === "unavailable" ? (
              <Badge variant="outline" className="text-xs bg-amber-100 text-amber-700 border-amber-300 mt-0.5">
                ⛔ {member.unavailable_reason || "Tidak Tersedia"}
                {member.unavailable_until && (
                  <span className="ml-1">
                    (s.d {format(new Date(member.unavailable_until), "d MMM", { locale: idLocale })})
                  </span>
                )}
              </Badge>
            ) : (
              member.phone && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3" />
                  {member.phone}
                </p>
              )
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Attendance Dots */}
          <AttendanceDots dots={member.attendanceDots || []} />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <StatusDialog
                memberId={member.id}
                memberName={member.name}
                currentStatus={member.status || "available"}
                currentReason={member.unavailable_reason}
                currentUntil={member.unavailable_until}
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Set Status
                  </DropdownMenuItem>
                }
              />
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-red-600 focus:text-red-600"
                disabled={isPending}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-[calc(480px-2rem)]">
          <DialogHeader>
            <DialogTitle className="font-heading">Edit Jemaat</DialogTitle>
            <DialogDescription>
              Perbarui data anggota komsel.
            </DialogDescription>
          </DialogHeader>
          <form action={formAction} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama *</Label>
              <Input
                id="name"
                name="name"
                defaultValue={member.name}
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">No. Telepon</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={member.phone || ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (untuk akses login)</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email@example.com"
                defaultValue={member.email || ""}
              />
              <p className="text-xs text-muted-foreground">
                Diperlukan jika ingin menjadikan Acting Leader
              </p>
            </div>
            <SubmitButton />
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
