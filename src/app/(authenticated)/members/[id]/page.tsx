import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Crown, Calendar, Brain, Flame, QrCode, MessageCircle } from "lucide-react";

import { isAdminAsync } from "@/lib/user-role";
import { ProfileAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLifeStage, maskData, analyzeAttendance, type AttendanceRecord } from "@/lib/utils";
import { getMoodEmoji } from "@/components/mood-meter";
import { AdminActions } from "./admin-actions";

type PageProps = {
    params: Promise<{ id: string }>;
};

const MOOD_LABELS: Record<string, string> = {
    sick: "Sedang sakit",
    traveling: "Luar kota",
    exam: "Sedang ujian",
    mourning: "Sedang berduka",
    happy: "Baik-baik saja",
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

export default async function MemberProfilePage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Check if viewer is admin
    const viewerIsAdmin = await isAdminAsync(user.email);

    // Fetch member data with attendance
    const { data: member, error } = await supabase
        .from("members")
        .select("*, event_attendance(*)")
        .eq("id", id)
        .single();

    if (error || !member) {
        notFound();
    }

    // Fetch MBTI from profiles if user_id exists
    let mbti: string | null = null;
    if (member.user_id) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("mbti")
            .eq("id", member.user_id)
            .single();
        mbti = profile?.mbti || null;
    }

    // Check if viewer is the member themselves
    const isOwnProfile = member.user_id === user.id;
    const privacyMasked = member.privacy_masked ?? false;

    // Process attendance
    const attendanceRecords: AttendanceRecord[] = (member.event_attendance || [])
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 6)
        .map((a: any) => ({
            date: new Date(a.created_at),
            day: format(new Date(a.created_at), "EEE", { locale: idLocale }).slice(0, 3),
            status: a.status as "present" | "permission" | "absent",
        }));

    const attendanceInsight = analyzeAttendance(attendanceRecords);

    // WhatsApp URL
    const formatPhoneForWhatsApp = (phone: string | null): string | null => {
        if (!phone) return null;
        let cleaned = phone.replace(/\D/g, "");
        if (cleaned.startsWith("0")) cleaned = "62" + cleaned.slice(1);
        if (!cleaned.startsWith("62")) cleaned = "62" + cleaned;
        return cleaned;
    };

    const whatsappNumber = formatPhoneForWhatsApp(member.phone);
    const whatsappUrl = whatsappNumber
        ? `https://wa.me/${whatsappNumber}?text=Halo%20${encodeURIComponent(member.name)}%2C%20`
        : null;

    const lifeStage = getLifeStage(member.birth_date);
    const isMemberAdmin = member.role === "admin" || member.role === "owner";
    const moodEmoji = member.current_mood ? getMoodEmoji(member.current_mood) : null;
    const moodLabel = member.current_mood ? MOOD_LABELS[member.current_mood] : null;

    // Masked displays
    const phoneDisplay = member.phone
        ? (privacyMasked && !isOwnProfile ? maskData(member.phone, "phone") : member.phone)
        : null;

    return (
        <main className="min-h-screen flex flex-col pb-24 bg-[#F2F2F7]">
            {/* Profile Header - No duplicate nav, GlobalHeader handles it */}
            <div className="bg-white px-6 py-8 text-center">
                <ProfileAvatar name={member.name} size="xl" className="mx-auto" />

                <h1 className="text-2xl font-bold text-neutral-900 mt-4 flex items-center justify-center gap-2">
                    {member.name}
                    {isMemberAdmin && <Crown className="w-5 h-5 text-amber-500 fill-amber-500" />}
                </h1>

                {/* Badges Row */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                    {lifeStage && (
                        <Badge className={`text-xs border-0 ${lifeStage.color}`}>
                            {lifeStage.label}
                        </Badge>
                    )}
                    {mbti && (
                        <Badge className={`text-xs border-0 ${MBTI_COLORS[mbti] || "bg-neutral-100 text-neutral-700"}`}>
                            <Brain className="w-3 h-3 mr-1" />
                            {mbti}
                        </Badge>
                    )}
                    {member.gender && (
                        <Badge variant="outline" className="text-xs">
                            {member.gender === "L" ? "Laki-laki" : "Perempuan"}
                        </Badge>
                    )}
                    {isMemberAdmin && (
                        <Badge className="text-xs bg-indigo-100 text-indigo-700 border-0">
                            {member.role === "owner" ? "Owner" : "Leader"}
                        </Badge>
                    )}
                </div>

                {/* Mood Status */}
                {moodEmoji && moodLabel && (
                    <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-neutral-50 rounded-full">
                        <span className="text-lg">{moodEmoji}</span>
                        <span className="text-sm text-neutral-600">{moodLabel}</span>
                    </div>
                )}
            </div>

            {/* Content Cards */}
            <div className="px-4 py-4 space-y-4">
                {/* Attendance Insight Card */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-orange-100">
                                <Flame className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                                <p className="font-medium text-neutral-800">
                                    {attendanceInsight.text} {attendanceInsight.emoji}
                                </p>
                                {attendanceInsight.streak > 0 && (
                                    <p className="text-xs text-neutral-500">
                                        🔥 {attendanceInsight.streak}x streak hadir berturut-turut
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Card */}
                <Card>
                    <CardContent className="p-4 space-y-3">
                        <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                            Informasi
                        </h3>

                        {phoneDisplay && (
                            <div className="flex items-center gap-3 text-sm">
                                <span className="text-neutral-400">📞</span>
                                <span className={privacyMasked && !isOwnProfile ? "text-neutral-400" : "text-neutral-700"}>
                                    {phoneDisplay}
                                </span>
                            </div>
                        )}

                        {member.email && !privacyMasked && (
                            <div className="flex items-center gap-3 text-sm">
                                <span className="text-neutral-400">✉️</span>
                                <span className="text-neutral-700">{member.email}</span>
                            </div>
                        )}

                        {member.birth_date && (
                            <div className="flex items-center gap-3 text-sm">
                                <Calendar className="w-4 h-4 text-neutral-400" />
                                <span className="text-neutral-700">
                                    {format(new Date(member.birth_date), "dd MMMM yyyy", { locale: idLocale })}
                                </span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* QR Code Card (Placeholder) */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-neutral-100">
                                    <QrCode className="w-5 h-5 text-neutral-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-neutral-800">QR Code Profil</p>
                                    <p className="text-xs text-neutral-500">Scan untuk tambah kontak</p>
                                </div>
                            </div>
                            <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center">
                                <QrCode className="w-8 h-8 text-neutral-300" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* WhatsApp Button */}
                {whatsappUrl && !privacyMasked && (
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white">
                            <MessageCircle className="w-5 h-5 mr-2" />
                            Chat WhatsApp
                        </Button>
                    </a>
                )}

                {/* Admin Actions */}
                {viewerIsAdmin && !isOwnProfile && (
                    <AdminActions member={member} />
                )}

                {/* Privacy Notice */}
                {privacyMasked && !isOwnProfile && (
                    <p className="text-xs text-neutral-400 text-center italic">
                        🔒 Anggota ini menyembunyikan sebagian data pribadinya
                    </p>
                )}
            </div>
        </main>
    );
}
