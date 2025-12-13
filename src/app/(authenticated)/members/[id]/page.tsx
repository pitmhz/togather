import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Phone, Mail, Calendar, MessageCircle } from "lucide-react";

import { isAdminAsync } from "@/lib/user-role";
import { maskData, analyzeAttendance, type AttendanceRecord } from "@/lib/utils";
import { AdminActions } from "./admin-actions";
import { DangerZone } from "./danger-zone";
import { MBTICard } from "./mbti-card";
import { MemberPassCard } from "@/components/profile/member-pass-card";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type PageProps = {
    params: Promise<{ id: string }>;
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

    // Masked displays
    const phoneDisplay = member.phone
        ? (privacyMasked && !isOwnProfile ? maskData(member.phone, "phone") : member.phone)
        : null;

    return (
        <main className="min-h-screen flex flex-col pb-24 bg-[#F2F2F7]">
            {/* Member Pass Hero Card */}
            <div className="px-4 pt-4">
                <MemberPassCard
                    name={member.name}
                    birthDate={member.birth_date}
                    mbti={mbti}
                    role={member.role}
                    gender={member.gender}
                    avatarUrl={member.avatar_url}
                    attendanceHistory={attendanceRecords}
                    hideGreeting={true}
                    isInactive={member.is_active === false}
                    unavailableReason={member.status === "unavailable" ? member.unavailable_reason : null}
                />
            </div>

            {/* Content Cards */}
            <div className="px-4 py-6 space-y-4">
                {/* MBTI Personality Card (with fallback jokes) */}
                <MBTICard mbti={mbti} memberName={member.name} />

                {/* Contact Information Card */}
                <Card className="shadow-sm border-neutral-100 rounded-2xl">
                    <CardContent className="p-5 space-y-3">
                        <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                            Informasi Kontak
                        </h3>

                        {/* Phone with inline WhatsApp */}
                        {phoneDisplay && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-neutral-100">
                                        <Phone className="w-4 h-4 text-neutral-500" />
                                    </div>
                                    <span className={`text-sm ${privacyMasked && !isOwnProfile ? "text-neutral-400" : "text-neutral-700"}`}>
                                        {phoneDisplay}
                                    </span>
                                </div>
                                {/* Inline WhatsApp Button */}
                                {whatsappUrl && !privacyMasked && (
                                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-9 px-3 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                                        >
                                            <MessageCircle className="w-4 h-4 mr-1.5" />
                                            Chat
                                        </Button>
                                    </a>
                                )}
                            </div>
                        )}

                        {member.email && !privacyMasked && (
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-neutral-100">
                                    <Mail className="w-4 h-4 text-neutral-500" />
                                </div>
                                <span className="text-sm text-neutral-700">{member.email}</span>
                            </div>
                        )}

                        {member.birth_date && (
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-neutral-100">
                                    <Calendar className="w-4 h-4 text-neutral-500" />
                                </div>
                                <span className="text-sm text-neutral-700">
                                    {format(new Date(member.birth_date), "dd MMMM yyyy", { locale: idLocale })}
                                </span>
                            </div>
                        )}

                        {/* No contact info */}
                        {!phoneDisplay && !member.email && !member.birth_date && (
                            <p className="text-sm text-neutral-400 italic">Tidak ada informasi kontak</p>
                        )}
                    </CardContent>
                </Card>

                {/* Admin Actions */}
                {viewerIsAdmin && !isOwnProfile && (
                    <AdminActions member={member} />
                )}

                {/* Danger Zone - Admin Only */}
                {viewerIsAdmin && !isOwnProfile && (
                    <DangerZone member={member} />
                )}

                {/* Privacy Notice */}
                {privacyMasked && !isOwnProfile && (
                    <p className="text-xs text-neutral-400 text-center italic pt-2">
                        🔒 Anggota ini menyembunyikan sebagian data pribadinya
                    </p>
                )}
            </div>
        </main>
    );
}
