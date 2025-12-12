"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, X, RotateCcw, CalendarX, Loader2, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn, getAvatarUrl, triggerHaptic } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

type Member = {
    id: string;
    name: string;
    gender: string | null;
};

type Event = {
    id: string;
    title: string;
    event_date: string;
};

type AttendanceRecord = {
    memberId: string;
    status: "present" | "absent";
};

export default function AttendancePage() {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [members, setMembers] = useState<Member[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const supabase = createClient();

    // Fetch active events on mount
    useEffect(() => {
        async function fetchEvents() {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch events from today onwards
            const { data } = await supabase
                .from("events")
                .select("id, title, event_date")
                .eq("user_id", user.id)
                .gte("event_date", today.toISOString())
                .order("event_date", { ascending: true })
                .limit(5);

            if (data && data.length > 0) {
                setEvents(data);
                // Auto-select if only one event
                if (data.length === 1) {
                    setSelectedEvent(data[0]);
                }
            }
            setLoading(false);
        }
        fetchEvents();
    }, [supabase]);

    // Fetch members when event is selected
    useEffect(() => {
        async function fetchMembers() {
            if (!selectedEvent) return;

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from("members")
                .select("id, name, gender")
                .eq("user_id", user.id)
                .eq("is_active", true)
                .order("name");

            if (data) {
                setMembers(data);
            }
        }
        fetchMembers();
    }, [selectedEvent, supabase]);

    const currentMember = members[currentIndex];
    const progress = records.length;
    const total = members.length;

    const handleSwipe = async (status: "present" | "absent") => {
        if (!currentMember || !selectedEvent || isSaving) return;

        // 1. OPTIMISTIC: Immediately update UI
        triggerHaptic(status === "present" ? "success" : "medium");
        setSwipeDirection(status === "present" ? "right" : "left");

        // Optimistically add to records
        const newRecord = { memberId: currentMember.id, status };
        const previousRecords = [...records];
        setRecords([...records, newRecord]);

        setIsSaving(true);

        try {
            // 2. SAVE: Call database
            const { error } = await supabase.from("event_attendance").upsert({
                event_id: selectedEvent.id,
                member_id: currentMember.id,
                status,
            }, { onConflict: "event_id,member_id" });

            if (error) throw error;

            // 3. SUCCESS: Move to next card
            setTimeout(() => {
                setSwipeDirection(null);
                if (currentIndex + 1 >= members.length) {
                    setIsComplete(true);
                    triggerHaptic("success");
                } else {
                    setCurrentIndex(currentIndex + 1);
                }
                setIsSaving(false);
            }, 300);

        } catch {
            // 4. ROLLBACK: Revert on error
            triggerHaptic("error");
            setRecords(previousRecords);
            setSwipeDirection(null);
            setIsSaving(false);
            toast.error("Gagal menyimpan absen. Cek koneksi!");
        }
    };

    const handleUndo = () => {
        if (records.length === 0) return;

        const newRecords = [...records];
        newRecords.pop();
        setRecords(newRecords);
        setCurrentIndex(Math.max(0, currentIndex - 1));
        setIsComplete(false);
    };

    const presentCount = records.filter(r => r.status === "present").length;
    const absentCount = records.filter(r => r.status === "absent").length;

    // Loading State
    if (loading) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-[#F2F2F7]">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
                <p className="mt-4 text-neutral-500">Memuat...</p>
            </main>
        );
    }

    // No Events State
    if (events.length === 0) {
        return (
            <main className="min-h-screen flex flex-col bg-[#F2F2F7]">
                <header className="sticky top-0 z-10 flex items-center gap-3 p-4 bg-[#F2F2F7]/80 backdrop-blur-md border-b border-neutral-200/50">
                    <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-neutral-200 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-neutral-600" />
                    </Link>
                    <h1 className="text-lg font-semibold text-neutral-900">⚡ Absensi Swipe</h1>
                </header>
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <CalendarX className="w-16 h-16 text-neutral-300 mb-4" />
                    <h2 className="text-xl font-semibold text-neutral-900 mb-2">Tidak Ada Acara</h2>
                    <p className="text-neutral-500 mb-6">Buat acara dulu untuk mulai absensi.</p>
                    <Button asChild>
                        <Link href="/events/new">Buat Acara Baru</Link>
                    </Button>
                </div>
            </main>
        );
    }

    // Event Selection State
    if (!selectedEvent) {
        return (
            <main className="min-h-screen flex flex-col bg-[#F2F2F7]">
                <header className="sticky top-0 z-10 flex items-center gap-3 p-4 bg-[#F2F2F7]/80 backdrop-blur-md border-b border-neutral-200/50">
                    <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-neutral-200 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-neutral-600" />
                    </Link>
                    <h1 className="text-lg font-semibold text-neutral-900">⚡ Pilih Acara</h1>
                </header>
                <div className="flex-1 p-4 space-y-3">
                    {events.map((event) => (
                        <button
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className="w-full bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 text-left hover:border-indigo-300 hover:shadow-md transition-all"
                        >
                            <p className="font-semibold text-neutral-900">{event.title}</p>
                            <p className="text-sm text-neutral-500">
                                {new Date(event.event_date).toLocaleDateString("id-ID", {
                                    weekday: "long", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                                })}
                            </p>
                        </button>
                    ))}
                </div>
            </main>
        );
    }

    // Completion State
    if (isComplete) {
        return (
            <main className="min-h-screen flex flex-col bg-[#F2F2F7]">
                <header className="sticky top-0 z-10 flex items-center gap-3 p-4 bg-[#F2F2F7]/80 backdrop-blur-md border-b border-neutral-200/50">
                    <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-neutral-200 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-neutral-600" />
                    </Link>
                    <h1 className="text-lg font-semibold text-neutral-900">⚡ Absensi Selesai</h1>
                </header>
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
                        <PartyPopper className="w-12 h-12 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-2">Selesai! 🎉</h2>
                    <p className="text-neutral-500 mb-6">{selectedEvent.title}</p>

                    <div className="flex gap-8 mb-8">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-green-600">{presentCount}</p>
                            <p className="text-sm text-neutral-500">Hadir</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-red-500">{absentCount}</p>
                            <p className="text-sm text-neutral-500">Absen</p>
                        </div>
                    </div>

                    <div className="flex gap-3 w-full max-w-xs">
                        <Button variant="outline" onClick={handleUndo} className="flex-1">
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Undo
                        </Button>
                        <Button asChild className="flex-1">
                            <Link href={`/events/${selectedEvent.id}`}>
                                Lihat Detail
                            </Link>
                        </Button>
                    </div>
                </div>
            </main>
        );
    }

    // Swipe Mode
    return (
        <main className="min-h-screen flex flex-col bg-[#F2F2F7]">
            {/* Header */}
            <header className="sticky top-0 z-10 flex items-center gap-3 p-4 bg-[#F2F2F7]/80 backdrop-blur-md border-b border-neutral-200/50">
                <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-neutral-200 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-neutral-600" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-lg font-semibold text-neutral-900 truncate">{selectedEvent.title}</h1>
                    <p className="text-xs text-neutral-500">{progress}/{total} dicek</p>
                </div>
                {records.length > 0 && (
                    <button onClick={handleUndo} className="p-2 rounded-full hover:bg-neutral-200 transition-colors">
                        <RotateCcw className="w-5 h-5 text-neutral-500" />
                    </button>
                )}
            </header>

            {/* Progress Bar */}
            <div className="px-4 py-2">
                <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${(progress / total) * 100}%` }}
                    />
                </div>
            </div>

            {/* Card Stack */}
            <div className="flex-1 flex items-center justify-center p-6">
                {currentMember && (
                    <Card
                        className={cn(
                            "w-full max-w-sm shadow-2xl rounded-3xl border-0 transition-all duration-300",
                            swipeDirection === "left" && "-translate-x-full rotate-[-15deg] opacity-0",
                            swipeDirection === "right" && "translate-x-full rotate-[15deg] opacity-0"
                        )}
                    >
                        <CardContent className="p-8 flex flex-col items-center text-center">
                            {/* Avatar */}
                            <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg mb-6 ring-4 ring-white">
                                <Image
                                    src={getAvatarUrl(currentMember.name)}
                                    alt={currentMember.name}
                                    width={128}
                                    height={128}
                                    className="w-full h-full object-cover"
                                    unoptimized
                                />
                            </div>

                            {/* Name */}
                            <h2 className="text-2xl font-bold text-neutral-900 mb-1">
                                {currentMember.name}
                            </h2>
                            <p className="text-neutral-500">
                                {currentMember.gender === "L" ? "👨 Laki-laki" : currentMember.gender === "P" ? "👩 Perempuan" : "Member"}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Action Buttons */}
            <div className="p-6 flex items-center justify-center gap-8">
                <button
                    onClick={() => handleSwipe("absent")}
                    className="w-20 h-20 rounded-full bg-red-500 text-white shadow-lg flex items-center justify-center hover:bg-red-600 active:scale-95 transition-all"
                >
                    <X className="w-10 h-10" />
                </button>

                <button
                    onClick={() => handleSwipe("present")}
                    className="w-20 h-20 rounded-full bg-green-500 text-white shadow-lg flex items-center justify-center hover:bg-green-600 active:scale-95 transition-all"
                >
                    <Check className="w-10 h-10" />
                </button>
            </div>

            {/* Quick Stats */}
            <div className="px-6 pb-8 flex justify-center gap-6 text-sm">
                <span className="flex items-center gap-1.5 text-green-600">
                    <Check className="w-4 h-4" />
                    {presentCount} Hadir
                </span>
                <span className="flex items-center gap-1.5 text-red-500">
                    <X className="w-4 h-4" />
                    {absentCount} Absen
                </span>
            </div>
        </main>
    );
}
