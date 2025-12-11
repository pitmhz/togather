"use client";

import { useState } from "react";
import { ArrowUpDown } from "lucide-react";

import { MemberItem } from "./member-item";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  temp_admin_until?: string | null;
};

type SortOption = "name-asc" | "name-desc" | "present-desc" | "present-asc";

type MembersGridProps = {
  members: MemberWithDots[];
};

function getAvatarUrl(name: string, avatarUrl?: string | null): string {
  if (avatarUrl) return avatarUrl;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=80&bold=true`;
}

export function MembersGrid({ members: initialMembers }: MembersGridProps) {
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");

  const sortedMembers = [...initialMembers].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "present-desc": {
        // Most present first (rajin)
        const aPresent = a.attendanceDots.filter((d) => d === "present").length;
        const bPresent = b.attendanceDots.filter((d) => d === "present").length;
        return bPresent - aPresent;
      }
      case "present-asc": {
        // Least present first (malas)
        const aPresent = a.attendanceDots.filter((d) => d === "present").length;
        const bPresent = b.attendanceDots.filter((d) => d === "present").length;
        return aPresent - bPresent;
      }
      default:
        return 0;
    }
  });

  return (
    <div>
      {/* Sort Dropdown */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-muted-foreground text-sm">
          {initialMembers.length} anggota komsel
        </p>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
          <SelectTrigger className="w-[180px]">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Urutkan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Nama (A-Z)</SelectItem>
            <SelectItem value="name-desc">Nama (Z-A)</SelectItem>
            <SelectItem value="present-desc">Kehadiran (Rajin)</SelectItem>
            <SelectItem value="present-asc">Kehadiran (Malas)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 gap-3">
        {sortedMembers.map((member) => (
          <MemberItem
            key={member.id}
            member={member}
            avatarUrl={getAvatarUrl(member.name, member.avatar_url)}
          />
        ))}
      </div>
    </div>
  );
}
