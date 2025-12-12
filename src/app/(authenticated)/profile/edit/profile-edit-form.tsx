"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import { updateProfile, generateMbtiSummaryAction, updateLocale, type ActionState } from "../actions";
import { MbtiPicker } from "@/components/mbti-picker";
import { MbtiCard } from "@/components/mbti-card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IOSListGroup, IOSListHeader } from "@/components/ui/ios-list";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type Profile = {
    full_name: string | null;
    phone_number: string | null;
    address: string | null;
    maps_link: string | null;
    gender: string | null;
    birth_date: string | null;
    mbti: string | null;
    mbti_summary: string | null;
    locale?: string | null;
};

type ProfileEditFormProps = {
    profile: Profile | null;
    userEmail: string;
};

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            className="w-full"
            disabled={pending}
        >
            {pending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
    );
}

// Split full_name into first and last name for display
function splitName(fullName: string | null): { firstName: string; lastName: string } {
    if (!fullName) return { firstName: "", lastName: "" };
    const parts = fullName.trim().split(" ");
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ") || "";
    return { firstName, lastName };
}

export function ProfileEditForm({ profile, userEmail }: ProfileEditFormProps) {
    const [state, formAction] = useActionState<ActionState, FormData>(
        updateProfile,
        null
    );

    useEffect(() => {
        if (state?.success) {
            toast.success("Profil berhasil diperbarui! ✅");
        } else if (state?.success === false) {
            toast.error(state.message + " ❌");
        }
    }, [state]);

    const { firstName, lastName } = splitName(profile?.full_name || null);
    const [gender, setGender] = useState<string>(profile?.gender || "");
    const [locale, setLocale] = useState<string>(profile?.locale || "id-ID");

    const handleLocaleChange = async (val: string) => {
        setLocale(val);
        const result = await updateLocale(val);
        if (result?.success) {
            toast.success("Format regional diperbarui! 🌏");
        }
    };

    return (
        <form action={formAction} className="space-y-6">

            {/* Section 1: Identitas Diri */}
            <div id="identity" className="scroll-mt-24">
                <IOSListHeader>Identitas Diri</IOSListHeader>
                <IOSListGroup className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="first_name" className="text-xs text-neutral-500">Nama Depan *</Label>
                            <Input
                                id="first_name"
                                name="first_name"
                                placeholder="Pieter"
                                defaultValue={firstName}
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="last_name" className="text-xs text-neutral-500">Nama Belakang</Label>
                            <Input
                                id="last_name"
                                name="last_name"
                                placeholder="Santoso"
                                defaultValue={lastName}
                            />
                        </div>
                    </div>

                    {/* Birthday */}
                    <div className="space-y-1.5">
                        <Label htmlFor="birth_date" className="text-xs text-neutral-500">Tanggal Lahir</Label>
                        <Input
                            id="birth_date"
                            name="birth_date"
                            type="date"
                            defaultValue={profile?.birth_date || ""}
                        />
                    </div>

                    {/* Gender */}
                    <div className="space-y-1.5">
                        <Label className="text-xs text-neutral-500">Gender</Label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setGender("L")}
                                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-colors ${gender === "L"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                                    }`}
                            >
                                👨 Laki-laki
                            </button>
                            <button
                                type="button"
                                onClick={() => setGender("P")}
                                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-colors ${gender === "P"
                                    ? "bg-pink-100 text-pink-700"
                                    : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                                    }`}
                            >
                                👩 Perempuan
                            </button>
                        </div>
                        <input type="hidden" name="gender" value={gender} />
                    </div>
                </IOSListGroup>
            </div>

            {/* Section 2: Kepribadian / MBTI */}
            <div id="mbti" className="scroll-mt-24">
                <IOSListHeader>Profil Psikologis</IOSListHeader>
                <IOSListGroup className="p-4 space-y-4">
                    {/* External Test Link */}
                    <MbtiPicker />

                    {/* MBTI Select */}
                    <div className="space-y-1.5">
                        <Label htmlFor="mbti" className="text-xs text-neutral-500">Tipe MBTI</Label>
                        <Select name="mbti" defaultValue={profile?.mbti || ""}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih tipe MBTI..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="INTJ">INTJ - Arsitek</SelectItem>
                                <SelectItem value="INTP">INTP - Pemikir</SelectItem>
                                <SelectItem value="ENTJ">ENTJ - Komandan</SelectItem>
                                <SelectItem value="ENTP">ENTP - Pendebat</SelectItem>
                                <SelectItem value="INFJ">INFJ - Advokat</SelectItem>
                                <SelectItem value="INFP">INFP - Mediator</SelectItem>
                                <SelectItem value="ENFJ">ENFJ - Protagonis</SelectItem>
                                <SelectItem value="ENFP">ENFP - Juru Kampanye</SelectItem>
                                <SelectItem value="ISTJ">ISTJ - Logistik</SelectItem>
                                <SelectItem value="ISFJ">ISFJ - Pelindung</SelectItem>
                                <SelectItem value="ESTJ">ESTJ - Eksekutif</SelectItem>
                                <SelectItem value="ESFJ">ESFJ - Konsul</SelectItem>
                                <SelectItem value="ISTP">ISTP - Virtuoso</SelectItem>
                                <SelectItem value="ISFP">ISFP - Petualang</SelectItem>
                                <SelectItem value="ESTP">ESTP - Pengusaha</SelectItem>
                                <SelectItem value="ESFP">ESFP - Penghibur</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* MBTI Card Display */}
                    <MbtiCard
                        mbtiType={profile?.mbti || null}
                        summary={profile?.mbti_summary || null}
                        memberName={firstName}
                        onGenerate={async () => {
                            if (!profile?.mbti) return { success: false, message: "No MBTI" };
                            return await generateMbtiSummaryAction(profile.mbti);
                        }}
                        canGenerate={true}
                    />
                </IOSListGroup>
            </div>

            {/* Section 3: Kontak */}
            <div id="contact" className="scroll-mt-24">
                <IOSListHeader>Informasi Kontak</IOSListHeader>
                <IOSListGroup className="p-4 space-y-4">
                    {/* Email (Read-only) */}
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs text-neutral-500">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={userEmail}
                            disabled
                            className="bg-neutral-200 text-neutral-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-neutral-400">
                            Email tidak dapat diubah
                        </p>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                        <Label htmlFor="phone_number" className="text-xs text-neutral-500">WhatsApp</Label>
                        <Input
                            id="phone_number"
                            name="phone_number"
                            type="tel"
                            placeholder="081234567890"
                            defaultValue={profile?.phone_number || ""}
                        />
                    </div>

                    {/* Address */}
                    <div className="space-y-1.5">
                        <Label htmlFor="address" className="text-xs text-neutral-500">Alamat Rumah</Label>
                        <Textarea
                            id="address"
                            name="address"
                            rows={2}
                            placeholder="Jl. Sudirman No. 123, Jakarta"
                            defaultValue={profile?.address || ""}
                            className="resize-none"
                        />
                    </div>

                    {/* Maps Link */}
                    <div className="space-y-1.5">
                        <Label htmlFor="maps_link" className="text-xs text-neutral-500">Link Google Maps</Label>
                        <Input
                            id="maps_link"
                            name="maps_link"
                            type="url"
                            placeholder="https://goo.gl/maps/..."
                            defaultValue={profile?.maps_link || ""}
                        />
                        <p className="text-xs text-neutral-400">
                            Untuk kemudahan visitasi
                        </p>
                    </div>
                </IOSListGroup>
            </div>

            {/* Section 4: Pengaturan Regional */}
            <div id="localization" className="scroll-mt-24">
                <IOSListHeader>Pengaturan Regional</IOSListHeader>
                <IOSListGroup className="p-4 space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="locale" className="text-xs text-neutral-500">Format Tanggal & Bahasa</Label>
                        <Select
                            name="locale"
                            value={locale}
                            onValueChange={handleLocaleChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih region..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="id-ID">🇮🇩 Indonesia (Senin, 25/12)</SelectItem>
                                <SelectItem value="en-US">🇺🇸 United States (Monday, 12/25)</SelectItem>
                                <SelectItem value="en-AU">🇦🇺 Australia (Monday, 25/12)</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-neutral-400">
                            Mengubah format tanggal dan mata uang di aplikasi
                        </p>
                    </div>
                </IOSListGroup>
            </div>

            {/* Sticky Submit Button */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-4 bg-[#F2F2F7]/90 backdrop-blur-md border-t border-neutral-200/50">
                <SubmitButton />
            </div>
        </form>
    );
}
