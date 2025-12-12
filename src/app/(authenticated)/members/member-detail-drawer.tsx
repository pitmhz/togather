"use client";

import { useState, useTransition } from "react";
import { MessageCircle, UserX, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";

import { deactivateMember, deleteMember } from "./actions";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

type Member = {
  id: string;
  name: string;
  phone: string | null;
  email?: string | null;
  avatar_url?: string | null;
  gender?: "L" | "P" | null;
  is_active?: boolean;
  status?: "available" | "unavailable";
  attendanceDots?: ("present" | "absent")[];
};

type MemberDetailDrawerProps = {
  member: Member | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  avatarUrl?: string;
};

function formatPhoneForWhatsApp(phone: string | null): string | null {
  if (!phone) return null;
  // Remove all non-digits
  let cleaned = phone.replace(/\D/g, "");
  // Convert 08xx to 628xx
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  }
  // Add 62 if not present
  if (!cleaned.startsWith("62")) {
    cleaned = "62" + cleaned;
  }
  return cleaned;
}

function AttendanceRate({ dots }: { dots: ("present" | "absent")[] }) {
  if (!dots || dots.length === 0) return null;
  const present = dots.filter(d => d === "present").length;
  const rate = Math.round((present / dots.length) * 100);
  return (
    <span className="text-sm text-[#9B9A97]">
      Kehadiran: {rate}% ({present}/{dots.length})
    </span>
  );
}

export function MemberDetailDrawer({ 
  member, 
  open, 
  onOpenChange,
  avatarUrl 
}: MemberDetailDrawerProps) {
  const [isPending, startTransition] = useTransition();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!member) return null;

  const whatsappNumber = formatPhoneForWhatsApp(member.phone);
  const whatsappUrl = whatsappNumber 
    ? `https://wa.me/${whatsappNumber}?text=Halo%20${encodeURIComponent(member.name)}%2C%20` 
    : null;

  const handleDeactivate = () => {
    if (!confirm(`Nonaktifkan ${member.name}? Member tidak akan muncul di daftar.`)) return;
    
    startTransition(async () => {
      const result = await deactivateMember(member.id);
      if (result?.success) {
        toast.success(result.message);
        onOpenChange(false);
      } else {
        toast.error(result?.message || "Gagal menonaktifkan member.");
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteMember(member.id);
      if (result?.success) {
        toast.success(result.message);
        onOpenChange(false);
      } else {
        toast.error(result?.message || "Gagal menghapus member.");
      }
    });
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="text-left">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            {avatarUrl && (
              <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#E3E3E3]">
                <img
                  src={avatarUrl}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <DrawerTitle className="text-xl font-semibold text-[#37352F]">
                {member.name}
              </DrawerTitle>
              <DrawerDescription className="flex items-center gap-2 mt-1">
                {member.gender && (
                  <Badge variant="outline" className="text-xs">
                    {member.gender === "L" ? "Laki-laki" : "Perempuan"}
                  </Badge>
                )}
                {member.is_active === false && (
                  <Badge className="text-xs bg-[#E3E3E3] text-[#787774]">
                    Nonaktif
                  </Badge>
                )}
              </DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        <div className="px-4 pb-4 space-y-4">
          {/* Stats */}
          <div className="p-3 bg-[#F7F7F5] rounded-md">
            <AttendanceRate dots={member.attendanceDots || []} />
            {member.phone && (
              <p className="text-sm text-[#9B9A97] mt-1">📞 {member.phone}</p>
            )}
            {member.email && (
              <p className="text-sm text-[#9B9A97] mt-1">✉️ {member.email}</p>
            )}
          </div>

          {/* WhatsApp Button */}
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] hover:bg-[#20BD5A] text-white font-medium rounded-md transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Chat WhatsApp
            </a>
          )}

          {/* Danger Zone */}
          <div className="pt-4 border-t border-[#E3E3E3]">
            <p className="text-xs text-[#9B9A97] uppercase tracking-wide mb-3">
              Zona Berbahaya
            </p>
            
            {!showDeleteConfirm ? (
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-amber-600 border-amber-200 hover:bg-amber-50"
                  onClick={handleDeactivate}
                  disabled={isPending || member.is_active === false}
                >
                  <UserX className="w-4 h-4 mr-2" />
                  {member.is_active === false ? "Sudah Nonaktif" : "Nonaktifkan Member"}
                </Button>
                
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-xs text-[#9B9A97] hover:text-red-500 underline"
                >
                  Hapus permanen...
                </button>
              </div>
            ) : (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700 mb-3">
                  Yakin hapus <strong>{member.name}</strong> secara permanen? Tindakan ini tidak bisa dibatalkan.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isPending}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Ya, Hapus
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Batal
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <DrawerFooter className="pt-0">
          <DrawerClose asChild>
            <Button variant="outline">Tutup</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
