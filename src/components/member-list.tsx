"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ChevronDown, Shield, ArrowUpDown } from "lucide-react";
import { cn, getAvatarUrl, triggerHaptic } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { getMoodEmoji } from "@/components/mood-meter";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SlidersHorizontal, ArrowUp, ArrowDown } from "lucide-react";

type SortOption = "name-asc" | "name-desc" | "age-old" | "age-young" | "streak-high" | "streak-low";

type Member = {
    id: string;
    name: string;
    gender?: string | null;
    role?: string;
    is_active?: boolean | null;
    birth_date?: string | null;
    current_mood?: string | null;
    mbti?: string | null;
    attendanceDots?: string[];
};

type MemberListProps = {
    members: Member[];
    initialLimit?: number;
};

const SORT_LABELS: Record<SortOption, string> = {
    "name-asc": "Nama A-Z",
    "name-desc": "Nama Z-A",
    "age-old": "Usia Tertua",
    "age-young": "Usia Termuda",
    "streak-high": "Paling Rajin",
    "streak-low": "Jarang Hadir",
};

export function MemberList({ members, initialLimit = 8 }: MemberListProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [sortBy, setSortBy] = useState<SortOption>("name-asc");
    const [showSortMenu, setShowSortMenu] = useState(false);

    // Advanced Filters
    const [filterIntrovert, setFilterIntrovert] = useState(false);
    const [filterExtrovert, setFilterExtrovert] = useState(false);

    const activeMembers = members.filter(m => {
        if (m.is_active === false) return false;

        // MBTI Filter Logic
        if (filterIntrovert && filterExtrovert) return true; // Show both if both checked (or logic could be exclusive?)
        if (filterIntrovert && m.mbti?.startsWith("E")) return false;
        if (filterExtrovert && m.mbti?.startsWith("I")) return false;

        // If sorting by introvert specifically
        if (filterIntrovert && !m.mbti?.startsWith("I")) return true; // Wait, let's refine

        // Simplified Logic:
        // If NO filter checked, shold show all? Yes.
        // If Introvert checked, show only I
        // If Extrovert checked, show only E
        // If Both checked, show both (All)

        const isIntrovert = m.mbti?.startsWith("I");
        const isExtrovert = m.mbti?.startsWith("E");

        if (filterIntrovert && !filterExtrovert && !isIntrovert) return false;
        if (filterExtrovert && !filterIntrovert && !isExtrovert) return false;

        return true;
    });

    // Sort members based on selected option
    const sortedMembers = useMemo(() => {
        const sorted = [...activeMembers];

        switch (sortBy) {
            case "name-asc":
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "name-desc":
                sorted.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "age-old":
                sorted.sort((a, b) => {
                    if (!a.birth_date) return 1;
                    if (!b.birth_date) return -1;
                    return new Date(a.birth_date).getTime() - new Date(b.birth_date).getTime();
                });
                break;
            case "age-young":
                sorted.sort((a, b) => {
                    if (!a.birth_date) return 1;
                    if (!b.birth_date) return -1;
                    return new Date(b.birth_date).getTime() - new Date(a.birth_date).getTime();
                });
                break;
            case "streak-high":
                sorted.sort((a, b) => {
                    const countA = (a.attendanceDots || []).filter(s => s === "present").length;
                    const countB = (b.attendanceDots || []).filter(s => s === "present").length;
                    return countB - countA;
                });
                break;
            case "streak-low":
                sorted.sort((a, b) => {
                    const countA = (a.attendanceDots || []).filter(s => s === "present").length;
                    const countB = (b.attendanceDots || []).filter(s => s === "present").length;
                    return countA - countB;
                });
                break;
        }

        return sorted;
    }, [activeMembers, sortBy]);

    const visibleMembers = isExpanded ? sortedMembers : sortedMembers.slice(0, initialLimit);
    const hasMore = sortedMembers.length > initialLimit;
    const remainingCount = sortedMembers.length - initialLimit;

    const handleSortChange = (option: SortOption) => {
        setSortBy(option);
        setShowSortMenu(false);
        triggerHaptic("light");
    };

    return (
        <div>
            {/* Sort Control */}
            <div className="flex gap-2 mb-3">
                <button
                    onClick={() => {
                        setShowSortMenu(!showSortMenu);
                        triggerHaptic("light");
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white border border-neutral-200 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
                >
                    <ArrowUpDown className="w-4 h-4" />
                    <span className="truncate">{SORT_LABELS[sortBy]}</span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform", showSortMenu && "rotate-180")} />
                </button>

                {/* Advanced Filter Button */}
                <Popover>
                    <PopoverTrigger asChild>
                        <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white border border-neutral-200 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors">
                            <SlidersHorizontal className="w-4 h-4" />
                            Filter
                            {(filterIntrovert || filterExtrovert) && (
                                <span className="w-2 h-2 rounded-full bg-indigo-500 absolute top-2 right-2 border border-white" />
                            )}
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-4" align="end">
                        <div className="space-y-4">
                            {/* MBTI Filter */}
                            <div className="space-y-2">
                                <h4 className="font-medium text-sm text-neutral-900 border-b pb-1">Filter MBTI</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="introvert"
                                            checked={filterIntrovert}
                                            onCheckedChange={(checked) => setFilterIntrovert(checked === true)}
                                        />
                                        <Label htmlFor="introvert" className="text-sm cursor-pointer font-normal">Introvert (I)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="extrovert"
                                            checked={filterExtrovert}
                                            onCheckedChange={(checked) => setFilterExtrovert(checked === true)}
                                        />
                                        <Label htmlFor="extrovert" className="text-sm cursor-pointer font-normal">Extrovert (E)</Label>
                                    </div>
                                </div>
                            </div>

                            {/* Streak Sort Shortcuts */}
                            <div className="space-y-2">
                                <h4 className="font-medium text-sm text-neutral-900 border-b pb-1">Urutkan Kehadiran</h4>
                                <div className="grid grid-cols-1 gap-2">
                                    <button
                                        onClick={() => { setSortBy("streak-high"); setShowSortMenu(false); }}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-colors",
                                            sortBy === "streak-high"
                                                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                                                : "bg-white border-neutral-200 hover:bg-neutral-50"
                                        )}
                                    >
                                        <ArrowUp className="w-4 h-4" />
                                        Paling Rajin
                                    </button>
                                    <button
                                        onClick={() => { setSortBy("streak-low"); setShowSortMenu(false); }}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-colors",
                                            sortBy === "streak-low"
                                                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                                                : "bg-white border-neutral-200 hover:bg-neutral-50"
                                        )}
                                    >
                                        <ArrowDown className="w-4 h-4" />
                                        Jarang Hadir
                                    </button>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Sort Dropdown */}
                {showSortMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-white rounded-xl border border-neutral-200 shadow-lg overflow-hidden z-20">
                        {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([option, label]) => (
                            <button
                                key={option}
                                onClick={() => handleSortChange(option)}
                                className={cn(
                                    "w-full px-4 py-2.5 text-left text-sm transition-colors",
                                    sortBy === option
                                        ? "bg-indigo-50 text-indigo-700 font-medium"
                                        : "text-neutral-600 hover:bg-neutral-50"
                                )}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Member List */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden divide-y divide-neutral-100">
                {visibleMembers.map((member) => {
                    const isAdmin = member.role === "admin" || member.role === "owner";

                    return (
                        <Link
                            key={member.id}
                            href={`/members/${member.id}`}
                            className="flex items-center gap-3 p-3 hover:bg-neutral-50 transition-colors active:bg-neutral-100"
                        >
                            {/* Avatar */}
                            <div className={cn(
                                "w-11 h-11 min-w-11 min-h-11 rounded-full overflow-hidden flex-shrink-0",
                                isAdmin && "ring-2 ring-blue-200 ring-offset-1"
                            )}>
                                <Image
                                    src={getAvatarUrl(member.name)}
                                    alt={member.name}
                                    width={44}
                                    height={44}
                                    className="w-full h-full object-cover"
                                    unoptimized
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-neutral-900 break-words flex items-center gap-1.5">
                                    {member.name}
                                    {member.current_mood && (
                                        <span title={member.current_mood}>{getMoodEmoji(member.current_mood as any)}</span>
                                    )}
                                </p>
                                <p className="text-xs text-neutral-500">
                                    {member.gender === "L" ? "Laki-laki" : member.gender === "P" ? "Perempuan" : "Member"}
                                </p>
                            </div>

                            {/* Role Badge */}
                            {isAdmin && (
                                <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 border-0 flex-shrink-0">
                                    <Shield className="w-3 h-3 mr-1" />
                                    {member.role === "owner" ? "Owner" : "Leader"}
                                </Badge>
                            )}

                            <ChevronRight className="w-4 h-4 text-neutral-300 flex-shrink-0" />
                        </Link>
                    );
                })}
            </div>

            {/* Show More Button */}
            {hasMore && !isExpanded && (
                <button
                    onClick={() => setIsExpanded(true)}
                    className="w-full mt-3 py-2.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-colors flex items-center justify-center gap-1"
                >
                    Lihat {remainingCount} Anggota Lainnya
                    <ChevronDown className="w-4 h-4" />
                </button>
            )}

            {/* Show Less Button */}
            {hasMore && isExpanded && (
                <button
                    onClick={() => setIsExpanded(false)}
                    className="w-full mt-3 py-2.5 text-sm font-medium text-neutral-500 hover:text-neutral-600 hover:bg-neutral-50 rounded-xl transition-colors flex items-center justify-center gap-1"
                >
                    Tampilkan Lebih Sedikit
                    <ChevronDown className="w-4 h-4 rotate-180" />
                </button>
            )}
        </div>
    );
}
