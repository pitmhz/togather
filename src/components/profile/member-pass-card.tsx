"use client";

import { useState } from "react";
import Image from "next/image";
import { Crown, QrCode, Flame, CloudRain, PartyPopper, Sparkles, ChevronDown } from "lucide-react";
import { cn, getAvatarUrl, getLifeStage, analyzeAttendance, type AttendanceRecord, type AttendanceInsight } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type MemberPassCardProps = {
    name: string;
    birthDate?: string | null;
    mbti?: string | null;
    role?: "admin" | "member" | "owner";
    gender?: "L" | "P" | null;
    avatarUrl?: string | null;
    attendanceHistory?: AttendanceRecord[];
    hideGreeting?: boolean;
    isInactive?: boolean;
    unavailableReason?: string | null;
};

const MBTI_COLORS: Record<string, string> = {
    "INTJ": "bg-purple-100 text-purple-700",
    "INTP": "bg-purple-100 text-purple-700",
    "ENTJ": "bg-purple-100 text-purple-700",
    "ENTP": "bg-purple-100 text-purple-700",
    "INFJ": "bg-green-100 text-green-700",
    "INFP": "bg-green-100 text-green-700",
    "ENFJ": "bg-green-100 text-green-700",
    "ENFP": "bg-green-100 text-green-700",
    "ISTJ": "bg-blue-100 text-blue-700",
    "ISFJ": "bg-blue-100 text-blue-700",
    "ESTJ": "bg-blue-100 text-blue-700",
    "ESFJ": "bg-blue-100 text-blue-700",
    "ISTP": "bg-amber-100 text-amber-700",
    "ISFP": "bg-amber-100 text-amber-700",
    "ESTP": "bg-amber-100 text-amber-700",
    "ESFP": "bg-amber-100 text-amber-700",
};

const INSIGHT_ICONS: Record<AttendanceInsight, typeof Flame> = {
    rajin: Flame,
    bolong: PartyPopper,
    hilang: CloudRain,
    new: Sparkles,
};

const INSIGHT_COLORS: Record<AttendanceInsight, string> = {
    rajin: "text-orange-500 bg-orange-100",
    bolong: "text-yellow-600 bg-yellow-100",
    hilang: "text-blue-500 bg-blue-100",
    new: "text-purple-500 bg-purple-100",
};

const STATUS_COLORS: Record<string, string> = {
    present: "bg-green-100 text-green-700 border-green-200",
    permission: "bg-yellow-100 text-yellow-700 border-yellow-200",
    absent: "bg-red-100 text-red-700 border-red-200",
};

export function MemberPassCard({
    name,
    birthDate,
    mbti,
    role = "member",
    gender,
    avatarUrl,
    attendanceHistory = [],
    hideGreeting = false,
    isInactive = false,
    unavailableReason,
}: MemberPassCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const displayAvatarUrl = getAvatarUrl(name, avatarUrl);
    const lifeStage = getLifeStage(birthDate);
    const attendanceInsight = analyzeAttendance(attendanceHistory);
    const InsightIcon = INSIGHT_ICONS[attendanceInsight.insight];
    const isAdmin = role === "admin" || role === "owner";

    return (
        <div className={cn(
            "relative rounded-3xl bg-gradient-to-br from-white to-neutral-50 border border-neutral-100 shadow-sm overflow-hidden",
            isInactive && "opacity-60 grayscale"
        )}>
            {/* Decorative Gradient Blob */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-full blur-3xl pointer-events-none" />

            {/* Main Content */}
            <div className="p-5 relative z-10">
                {/* QR Button (Top Right) */}
                <div className="absolute top-4 right-4 z-10">
                    <button className="p-2 rounded-full hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-neutral-600">
                        <QrCode className="w-4 h-4" />
                    </button>
                </div>

                {/* Identity Row */}
                <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div
                        className={cn(
                            "w-20 h-20 rounded-2xl overflow-hidden shadow-lg flex-shrink-0 bg-neutral-100",
                            isAdmin && "ring-4 ring-blue-100 ring-offset-2"
                        )}
                    >
                        <Image
                            src={displayAvatarUrl}
                            alt={name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                            unoptimized
                        />
                    </div>

                    {/* Identity */}
                    <div className="flex-1 min-w-0">
                        {!hideGreeting && (
                            <p className="text-sm text-neutral-500">Member Profile</p>
                        )}
                        <h1 className="text-xl font-bold text-neutral-900 break-words flex items-center gap-2">
                            {name}
                            {isAdmin && <Crown className="w-4 h-4 text-amber-500 fill-amber-500 flex-shrink-0" />}
                        </h1>

                        {/* Badges Row */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            {lifeStage && (
                                <Badge
                                    variant="secondary"
                                    className={cn("text-[10px] px-2 py-0.5 font-medium border-0", lifeStage.color)}
                                >
                                    {lifeStage.label}
                                </Badge>
                            )}

                            {mbti && (
                                <Badge
                                    variant="secondary"
                                    className={cn(
                                        "text-[10px] px-2 py-0.5 font-medium border-0",
                                        MBTI_COLORS[mbti] || "bg-neutral-100 text-neutral-700"
                                    )}
                                >
                                    {mbti}
                                </Badge>
                            )}

                            {isAdmin && (
                                <Badge
                                    variant="secondary"
                                    className="text-[10px] px-2 py-0.5 font-medium border-0 bg-blue-100 text-blue-700"
                                >
                                    {role === "owner" ? "Owner" : "Leader"}
                                </Badge>
                            )}

                            {isInactive && (
                                <Badge
                                    variant="secondary"
                                    className="text-[10px] px-2 py-0.5 font-medium border-0 bg-neutral-200 text-neutral-600"
                                >
                                    🚫 Nonaktif
                                </Badge>
                            )}

                            {unavailableReason && !isInactive && (
                                <Badge
                                    variant="secondary"
                                    className="text-[10px] px-2 py-0.5 font-medium border-0 bg-amber-100 text-amber-700"
                                >
                                    ⚠️ {unavailableReason}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                {/* Attendance Insight Bar (Clickable) */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between hover:bg-neutral-50/50 -mx-1 px-1 rounded-lg transition-colors"
                >
                    <div className="flex items-center gap-2.5">
                        <div className={cn("p-1.5 rounded-lg", INSIGHT_COLORS[attendanceInsight.insight])}>
                            <InsightIcon className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                            <span className="text-sm font-medium text-neutral-700">
                                {attendanceInsight.text} {attendanceInsight.emoji}
                            </span>
                            {attendanceInsight.streak > 0 && (
                                <span className="text-xs text-neutral-400 ml-2">
                                    ({attendanceInsight.streak}x streak)
                                </span>
                            )}
                        </div>
                    </div>
                    <ChevronDown className={cn(
                        "w-4 h-4 text-neutral-400 transition-transform",
                        isExpanded && "rotate-180"
                    )} />
                </button>
            </div>

            {/* Expanded History */}
            <div className={cn(
                "overflow-hidden transition-all duration-300 ease-out",
                isExpanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
            )}>
                <div className="px-5 pb-5">
                    <p className="text-xs text-neutral-400 mb-3 uppercase tracking-wide">Riwayat Kehadiran</p>

                    {/* Timeline */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-2">
                        {attendanceHistory.length > 0 ? (
                            attendanceHistory.slice(0, 6).map((record, idx) => (
                                <div key={idx} className="flex items-center">
                                    {/* Circle */}
                                    <div className={cn(
                                        "min-w-12 min-h-12 rounded-full border-2 flex flex-col items-center justify-center flex-shrink-0 p-1",
                                        STATUS_COLORS[record.status]
                                    )}>
                                        <span className="text-sm font-bold leading-none">
                                            {record.date.getDate()}
                                        </span>
                                        <span className="text-[9px] font-medium uppercase leading-tight">
                                            {record.day}
                                        </span>
                                    </div>
                                    {/* Connector Line */}
                                    {idx < Math.min(attendanceHistory.length - 1, 5) && (
                                        <div className="w-2 h-0.5 bg-neutral-200 flex-shrink-0" />
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-neutral-400 italic">Belum ada data kehadiran</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
