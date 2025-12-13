"use client";

import { useState, useTransition } from "react";
import { AlertTriangle, Clock, UserX, Power } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

import { updateMemberStatus } from "../actions";

import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type DangerZoneProps = {
    member: {
        id: string;
        name: string;
        status?: string | null;
        unavailable_reason?: string | null;
        unavailable_until?: string | null;
        is_active?: boolean;
    };
};

const TEMPORARY_REASONS = [
    { value: "sakit", label: "Sakit" },
    { value: "luar_kota", label: "Luar Kota" },
    { value: "cuti_melahirkan", label: "Cuti Melahirkan" },
    { value: "ujian", label: "Ujian/Tugas Akhir" },
];

const INACTIVE_REASONS = [
    { value: "pindah_komsel", label: "Pindah Komsel" },
    { value: "pindah_kota", label: "Pindah Kota" },
    { value: "mengundurkan_diri", label: "Mengundurkan Diri" },
    { value: "tidak_aktif_3bulan", label: "Tidak Aktif 3 Bulan" },
];

export function DangerZone({ member }: DangerZoneProps) {
    const [isPending, startTransition] = useTransition();

    // Temporary unavailable form state
    const [tempReason, setTempReason] = useState<string>("");
    const [tempUntilDate, setTempUntilDate] = useState<string>("");

    // Permanent inactive form state
    const [inactiveReason, setInactiveReason] = useState<string>("");
    const [showInactiveConfirm, setShowInactiveConfirm] = useState(false);

    const isInactive = member.is_active === false || member.status === "inactive";
    const isUnavailable = member.status === "unavailable";

    const handleSetUnavailable = () => {
        if (!tempReason) {
            toast.error("Pilih alasan terlebih dahulu.");
            return;
        }

        startTransition(async () => {
            const result = await updateMemberStatus(
                member.id,
                "unavailable",
                tempReason,
                tempUntilDate || null
            );
            if (result?.success) {
                toast.success(result.message + " ⏰");
                setTempReason("");
                setTempUntilDate("");
            } else {
                toast.error(result?.message || "Gagal mengubah status.");
            }
        });
    };

    const handleSetActive = () => {
        startTransition(async () => {
            const result = await updateMemberStatus(member.id, "active");
            if (result?.success) {
                toast.success(result.message + " ✅");
            } else {
                toast.error(result?.message || "Gagal mengubah status.");
            }
        });
    };

    const handleSetInactive = () => {
        if (!inactiveReason) {
            toast.error("Pilih alasan terlebih dahulu.");
            return;
        }

        startTransition(async () => {
            const result = await updateMemberStatus(
                member.id,
                "inactive",
                inactiveReason
            );
            if (result?.success) {
                toast.success(result.message + " 🚫");
                setShowInactiveConfirm(false);
                setInactiveReason("");
            } else {
                toast.error(result?.message || "Gagal menonaktifkan member.");
            }
        });
    };

    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem
                value="danger-zone"
                className="border border-red-200 rounded-xl bg-red-50/30 overflow-hidden"
            >
                <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-red-50/50">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <span className="font-semibold text-red-600">Danger Zone</span>
                    </div>
                </AccordionTrigger>

                <AccordionContent className="pb-0">
                    <div className="px-5 pb-5 space-y-6">
                        {/* Current Status Display */}
                        {(isUnavailable || isInactive) && (
                            <div className={`p-4 rounded-xl border ${isInactive ? "bg-neutral-100 border-neutral-200" : "bg-amber-50 border-amber-200"}`}>
                                <p className="text-sm font-medium text-neutral-700 mb-2">
                                    Status Saat Ini:
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm ${isInactive ? "text-neutral-600" : "text-amber-700"}`}>
                                        {isInactive ? "🚫 Nonaktif" : `⚠️ ${member.unavailable_reason || "Tidak Tersedia"}`}
                                        {member.unavailable_until && (
                                            <span className="text-xs text-neutral-500 ml-2">
                                                (sampai {format(new Date(member.unavailable_until), "dd MMM yyyy", { locale: idLocale })})
                                            </span>
                                        )}
                                    </span>
                                    {!isInactive && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={handleSetActive}
                                            disabled={isPending}
                                            className="border-green-200 text-green-700 hover:bg-green-50"
                                        >
                                            Aktifkan Kembali
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Section A: Set Temporary Unavailable */}
                        {!isInactive && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-amber-500" />
                                    <h4 className="font-medium text-neutral-800">
                                        Set Status Sementara
                                    </h4>
                                </div>

                                <div className="space-y-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-neutral-500">Alasan</Label>
                                        <Select value={tempReason} onValueChange={setTempReason}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Pilih alasan..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {TEMPORARY_REASONS.map((r) => (
                                                    <SelectItem key={r.value} value={r.value}>
                                                        {r.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-neutral-500">Sampai Kapan?</Label>
                                        <Input
                                            type="date"
                                            value={tempUntilDate}
                                            onChange={(e) => setTempUntilDate(e.target.value)}
                                            min={new Date().toISOString().split("T")[0]}
                                        />
                                    </div>

                                    <Button
                                        onClick={handleSetUnavailable}
                                        disabled={isPending || !tempReason}
                                        className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                                    >
                                        <Power className="w-4 h-4 mr-2" />
                                        Set Tidak Tersedia
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Divider */}
                        {!isInactive && (
                            <div className="border-t border-red-200" />
                        )}

                        {/* Section B: Permanent Deactivation */}
                        {!isInactive && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <UserX className="w-4 h-4 text-red-500" />
                                    <h4 className="font-medium text-neutral-800">
                                        Nonaktifkan Member
                                    </h4>
                                </div>

                                {!showInactiveConfirm ? (
                                    <div className="space-y-3">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-neutral-500">Alasan Nonaktif</Label>
                                            <Select value={inactiveReason} onValueChange={setInactiveReason}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Pilih alasan..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {INACTIVE_REASONS.map((r) => (
                                                        <SelectItem key={r.value} value={r.value}>
                                                            {r.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Button
                                            variant="destructive"
                                            onClick={() => setShowInactiveConfirm(true)}
                                            disabled={!inactiveReason}
                                            className="w-full"
                                        >
                                            <UserX className="w-4 h-4 mr-2" />
                                            Nonaktifkan Permanen
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-red-100 border border-red-300 rounded-xl">
                                        <p className="text-sm text-red-700 mb-3">
                                            Yakin nonaktifkan <strong>{member.name}</strong>?
                                            Member tidak akan muncul di daftar aktif.
                                        </p>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={handleSetInactive}
                                                disabled={isPending}
                                            >
                                                Ya, Nonaktifkan
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setShowInactiveConfirm(false)}
                                            >
                                                Batal
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Inactive member message */}
                        {isInactive && (
                            <p className="text-sm text-neutral-500 italic text-center py-2">
                                Member ini sudah dinonaktifkan.
                            </p>
                        )}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
