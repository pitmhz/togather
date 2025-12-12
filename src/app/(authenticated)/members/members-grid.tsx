"use client";

import { useState } from "react";
import { ArrowUpDown, Crown } from "lucide-react";

import { MemberDetailDrawer } from "./member-detail-drawer";
import { getLifeStage, formatDate } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type MemberWithDots = {
  id: string;
  name: string;
  phone: string | null;
  email?: string | null;
  attendanceDots: ("present" | "absent")[];
  avatar_url?: string | null;
  status?: "available" | "unavailable";
  unavailable_reason?: string | null;
  unavailable_until?: string | null;
  gender?: "L" | "P" | null;
  role?: "admin" | "member" | "owner"; // Added role
  birth_date?: string | null; // Added birth_date
  is_active?: boolean;
};

type SortOption = "name-asc" | "name-desc" | "present-desc" | "present-asc";

type MembersGridProps = {
  members: MemberWithDots[];
  isAdmin: boolean;
};

function getAvatarUrl(name: string, avatarUrl?: string | null): string {
  if (avatarUrl) return avatarUrl;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=80&bold=true`;
}

function AttendanceRate({ dots }: { dots: ("present" | "absent")[] }) {
  if (!dots || dots.length === 0) return null;
  const present = dots.filter(d => d === "present").length;
  return (
    <div className="flex gap-0.5">
      {dots.slice(0, 5).map((status, i) => (
        <span
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${
            status === "present" ? "bg-emerald-500" : "bg-red-400"
          }`}
        />
      ))}
    </div>
  );
}

export function MembersGrid({ members: initialMembers, isAdmin }: MembersGridProps) {
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [selectedMember, setSelectedMember] = useState<MemberWithDots | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const handleMemberClick = (member: MemberWithDots) => {
    setSelectedMember(member);
    setDrawerOpen(true);
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

      {/* Grid Layout - Simplified Cards */}
      <div className="grid grid-cols-2 gap-2">
        {sortedMembers.map((member) => {
          const avatarUrl = getAvatarUrl(member.name, member.avatar_url);
          return (
            <button
              key={member.id}
              onClick={() => handleMemberClick(member)}
              className={`
                flex items-center gap-2 p-2.5 bg-white border border-[#E3E3E3] rounded-md
                hover:bg-[#F7F7F5] transition-colors text-left
                ${member.is_active === false ? "opacity-50 grayscale" : ""}
              `}
            >
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={avatarUrl}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Name + Attendance */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-[#37352F] truncate text-sm">
                    {member.name}
                  </p>
                </div>
                {member.birth_date && (
                  <p className="text-[10px] text-muted-foreground mb-1">
                    {formatDate(member.birth_date, "dd MMMM yyyy")}
                  </p>
                )}
                <AttendanceRate dots={member.attendanceDots} />
                
                {/* Meta Badges */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                   {/* Leader Badge */}
                   {(member.role === 'admin' || member.role === 'owner') && (
                    <Badge className="text-[10px] px-1.5 py-0 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-0 gap-1 pl-1">
                      <Crown className="w-3 h-3" />
                      Leader
                    </Badge>
                  )}

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
            </button>
          );
        })}
      </div>

      {/* Member Detail Drawer */}
      <MemberDetailDrawer
        member={selectedMember}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        avatarUrl={selectedMember ? getAvatarUrl(selectedMember.name, selectedMember.avatar_url) : undefined}
        isAdmin={isAdmin}
      />
    </div>
  );
}
