"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpDown, Crown, User, MessageCircle, Power } from "lucide-react";
import { toast } from "sonner";

import { deactivateMember } from "./actions";
import { getLifeStage, formatDate, getAvatarUrl } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type MemberWithDots = {
  id: string;
  name: string;
  phone: string | null;
  email?: string | null;
  attendanceDots: ("present" | "absent")[];
  avatar_url?: string | null;
  status?: "active" | "inactive" | "unavailable" | null;
  unavailable_reason?: string | null;
  unavailable_until?: string | null;
  gender?: "L" | "P" | null;
  role?: "admin" | "member" | "owner";
  birth_date?: string | null;
  is_active?: boolean;
};

type SortOption = "name-asc" | "name-desc" | "present-desc" | "present-asc";

type MembersGridProps = {
  members: MemberWithDots[];
  isAdmin: boolean;
  localeCode: string;
};



function AttendanceRate({ dots }: { dots: ("present" | "absent")[] }) {
  if (!dots || dots.length === 0) return null;
  return (
    <div className="flex gap-0.5">
      {dots.slice(0, 5).map((status, i) => (
        <span
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${status === "present" ? "bg-emerald-500" : "bg-red-400"
            }`}
        />
      ))}
    </div>
  );
}

function formatPhoneForWhatsApp(phone: string | null): string | null {
  if (!phone) return null;
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  }
  if (!cleaned.startsWith("62")) {
    cleaned = "62" + cleaned;
  }
  return cleaned;
}

// Reusable Quick Action Item Component (iOS Settings List Style)
function QuickActionItem({
  icon: Icon,
  label,
  onClick,
  variant = "ghost",
  disabled = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  variant?: "ghost" | "destructive";
  disabled?: boolean;
}) {
  const baseStyles =
    "flex items-center gap-3 w-full px-3 py-3 text-sm font-medium rounded-lg transition-colors text-left";
  const variantStyles = {
    ghost: "text-[#37352F] hover:bg-neutral-100",
    destructive: "text-red-600 hover:bg-red-50",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span>{label}</span>
    </button>
  );
}

export function MembersGrid({ members: initialMembers, isAdmin, localeCode }: MembersGridProps) {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [isPending, startTransition] = useTransition();

  // Filter to show only active members by default
  const activeMembers = initialMembers.filter(m => m.is_active !== false);

  const sortedMembers = [...activeMembers].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "present-desc": {
        const aPresent = a.attendanceDots.filter((d) => d === "present").length;
        const bPresent = b.attendanceDots.filter((d) => d === "present").length;
        return bPresent - aPresent;
      }
      case "present-asc": {
        const aPresent = a.attendanceDots.filter((d) => d === "present").length;
        const bPresent = b.attendanceDots.filter((d) => d === "present").length;
        return aPresent - bPresent;
      }
      default:
        return 0;
    }
  });

  const handleViewProfile = (memberId: string) => {
    router.push(`/members/${memberId}`);
  };

  const handleWhatsApp = (member: MemberWithDots) => {
    const whatsappNumber = formatPhoneForWhatsApp(member.phone);
    if (whatsappNumber) {
      const url = `https://wa.me/${whatsappNumber}?text=Halo%20${encodeURIComponent(member.name)}%2C%20`;
      window.open(url, "_blank");
    } else {
      toast.error("Nomor WhatsApp tidak tersedia");
    }
  };

  const handleDeactivate = (member: MemberWithDots) => {
    if (!confirm(`Nonaktifkan ${member.name}? Member tidak akan muncul di daftar.`)) return;

    startTransition(async () => {
      const result = await deactivateMember(member.id);
      if (result?.success) {
        toast.success(result.message + " 🚫");
      } else {
        toast.error(result?.message || "Gagal menonaktifkan member. ❌");
      }
    });
  };

  return (
    <div>
      {/* Sort Dropdown */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-muted-foreground text-sm">
          {activeMembers.length} anggota aktif
        </p>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
          <SelectTrigger className="w-[160px] h-8 text-xs">
            <ArrowUpDown className="w-3 h-3 mr-1" />
            <SelectValue placeholder="Urutkan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Nama (A-Z)</SelectItem>
            <SelectItem value="name-desc">Nama (Z-A)</SelectItem>
            <SelectItem value="present-desc">Kehadiran ↑</SelectItem>
            <SelectItem value="present-asc">Kehadiran ↓</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Accordion List */}
      <Accordion type="single" collapsible className="space-y-2">
        {sortedMembers.map((member) => {
          const avatarUrl = getAvatarUrl(member.name, member.avatar_url);
          return (
            <AccordionItem
              key={member.id}
              value={member.id}
              className="border border-[#E3E3E3] rounded-xl overflow-hidden bg-white data-[state=open]:shadow-sm"
            >
              <AccordionTrigger
                className={`
                  flex items-center gap-3 p-3 w-full text-left
                  hover:bg-neutral-50 transition-colors
                  [&>svg]:ml-auto [&>svg]:text-neutral-400
                  hover:no-underline
                  ${member.is_active === false ? "opacity-50 grayscale" : ""}
                `}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={avatarUrl}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name + Meta */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-[#37352F] truncate text-sm">
                      {member.name}
                    </p>
                    {(member.role === 'admin' || member.role === 'owner') && (
                      <Crown className="w-3.5 h-3.5 text-orange-500 fill-orange-500 flex-shrink-0" />
                    )}
                  </div>

                  {member.birth_date && (
                    <p className="text-[10px] text-muted-foreground mb-1">
                      {formatDate(member.birth_date, "dd MMMM yyyy", localeCode)}
                    </p>
                  )}

                  <div className="flex items-center gap-2">
                    <AttendanceRate dots={member.attendanceDots} />

                    {/* Life Stage Badge */}
                    {(() => {
                      const stage = getLifeStage(member.birth_date);
                      if (!stage) return null;
                      return (
                        <Badge
                          variant="secondary"
                          className={`text-[10px] px-1.5 py-0 shadow-none ${stage.color}`}
                        >
                          {stage.label}
                        </Badge>
                      );
                    })()}
                  </div>
                </div>

                {/* Inactive Badge */}
                {member.is_active === false && (
                  <Badge className="text-[10px] px-1 py-0 bg-[#E3E3E3] text-[#787774]">
                    Off
                  </Badge>
                )}
                {/* Unavailable Badge */}
                {member.status === "unavailable" && member.is_active !== false && (
                  <Badge className="text-[10px] px-1.5 py-0 bg-amber-100 text-amber-700 border-0">
                    ⚠️ {member.unavailable_reason || "Away"}
                  </Badge>
                )}
              </AccordionTrigger>

              {/* Quick Actions Content */}
              <AccordionContent className="pb-0">
                <div className="p-2 bg-neutral-50/50 border-t border-[#E3E3E3]">
                  <QuickActionItem
                    icon={User}
                    label="Lihat Profil Lengkap"
                    onClick={() => handleViewProfile(member.id)}
                    variant="ghost"
                  />

                  <QuickActionItem
                    icon={MessageCircle}
                    label="Hubungi Cepat (WhatsApp)"
                    onClick={() => handleWhatsApp(member)}
                    variant="ghost"
                    disabled={!member.phone}
                  />

                  {isAdmin && (
                    <QuickActionItem
                      icon={Power}
                      label="Nonaktifkan Jemaat"
                      onClick={() => handleDeactivate(member)}
                      variant="destructive"
                      disabled={isPending || member.is_active === false}
                    />
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
