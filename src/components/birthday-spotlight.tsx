"use client";

import Image from "next/image";
import { PartyPopper, Cake } from "lucide-react";
import { cn, getAvatarUrl, getUpcomingBirthdays } from "@/lib/utils";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

type Member = {
    id: string;
    name: string;
    birth_date: string | null;
    gender?: string | null;
};

type BirthdaySpotlightProps = {
    members: Member[];
};

export function BirthdaySpotlight({ members }: BirthdaySpotlightProps) {
    const upcomingBirthdays = getUpcomingBirthdays(members, 5);

    if (upcomingBirthdays.length === 0) {
        return null;
    }

    return (
        <section className="mb-6">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3 px-4">
                🎂 Ulang Tahun Terdekat
            </h2>

            <div className="flex overflow-x-auto gap-3 px-4 pb-2 scrollbar-hide">
                {upcomingBirthdays.map((member, index) => {
                    const isHero = index === 0;
                    const isToday = member.daysUntil === 0;
                    const firstName = member.name.split(" ")[0];

                    return (
                        <div
                            key={member.id}
                            className={cn(
                                "flex-shrink-0 w-28 rounded-2xl p-3 shadow-sm border relative overflow-hidden",
                                isHero
                                    ? "bg-gradient-to-br from-amber-50 to-yellow-100 border-amber-200"
                                    : "bg-white border-neutral-100"
                            )}
                        >
                            {/* Hero Decoration */}
                            {isHero && (
                                <div className="absolute top-2 right-2">
                                    <PartyPopper className="w-4 h-4 text-amber-500" />
                                </div>
                            )}

                            {/* Avatar */}
                            <div className={cn(
                                "w-14 h-14 rounded-full overflow-hidden mx-auto mb-2 shadow-md",
                                isHero && "ring-2 ring-amber-300 ring-offset-1"
                            )}>
                                <Image
                                    src={getAvatarUrl(member.name)}
                                    alt={member.name}
                                    width={56}
                                    height={56}
                                    className="w-full h-full object-cover"
                                    unoptimized
                                />
                            </div>

                            {/* Name */}
                            <p className="text-sm font-semibold text-neutral-900 text-center truncate">
                                {firstName}
                            </p>

                            {/* Countdown */}
                            <p className={cn(
                                "text-xs text-center font-medium mt-1",
                                isToday ? "text-amber-600" : "text-neutral-500"
                            )}>
                                {isToday ? (
                                    <span className="flex items-center justify-center gap-1">
                                        <Cake className="w-3 h-3" />
                                        Hari Ini!
                                    </span>
                                ) : member.daysUntil === 1 ? (
                                    "Besok!"
                                ) : (
                                    `${member.daysUntil} hari lagi`
                                )}
                            </p>

                            {/* Date */}
                            <p className="text-[10px] text-neutral-400 text-center mt-0.5">
                                {format(member.birthdayDate, "d MMM", { locale: idLocale })}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
