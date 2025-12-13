"use client";

import { useState, useTransition } from "react";
import { Crown, ArrowUp, ArrowDown, UserX, Trash2, MessageCircle } from "lucide-react";
import { toast } from "sonner";

import { promoteMember, demoteMember, deactivateMember, deleteMember } from "../actions";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

type AdminActionsProps = {
    member: {
        id: string;
        name: string;
        role?: string;
        is_active?: boolean;
        phone?: string | null;
    };
};

export function AdminActions({ member }: AdminActionsProps) {
    const [open, setOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isPending, startTransition] = useTransition();

    const isOwner = member.role === "owner";
    const isAdmin = member.role === "admin";
    const isInactive = member.is_active === false;

    // Format WhatsApp URL
    const formatPhoneForWhatsApp = (phone: string | null | undefined): string | null => {
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

    const handlePromote = () => {
        startTransition(async () => {
            const result = await promoteMember(member.id);
            if (result?.success) {
                toast.success(result.message + " 👑");
                setOpen(false);
            } else {
                toast.error(result?.message || "Gagal mempromosikan member.");
            }
        });
    };

    const handleDemote = () => {
        startTransition(async () => {
            const result = await demoteMember(member.id);
            if (result?.success) {
                toast.success(result.message + " ⬇️");
                setOpen(false);
            } else {
                toast.error(result?.message || "Gagal menurunkan member.");
            }
        });
    };

    const handleDeactivate = () => {
        startTransition(async () => {
            const result = await deactivateMember(member.id);
            if (result?.success) {
                toast.success(result.message + " 🚫");
                setOpen(false);
            } else {
                toast.error(result?.message || "Gagal menonaktifkan member.");
            }
        });
    };

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deleteMember(member.id);
            if (result?.success) {
                toast.success(result.message + " 🗑️");
                setOpen(false);
                // Redirect will happen via revalidation
            } else {
                toast.error(result?.message || "Gagal menghapus member.");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                    ⚙️ Kelola Anggota
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[340px] rounded-2xl">
                <DialogHeader>
                    <DialogTitle>Kelola {member.name}</DialogTitle>
                    <DialogDescription>
                        Pilih aksi untuk anggota ini
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 py-2">
                    {/* WhatsApp */}
                    {whatsappUrl && (
                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="w-full justify-start bg-green-50 border-green-200 text-green-700 hover:bg-green-100">
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Chat WhatsApp
                            </Button>
                        </a>
                    )}

                    {/* Promote/Demote */}
                    {isOwner ? (
                        <p className="text-sm text-muted-foreground italic text-center py-2">
                            Owner tidak dapat diubah.
                        </p>
                    ) : isAdmin ? (
                        <Button
                            variant="outline"
                            className="w-full justify-start text-indigo-600 bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
                            onClick={handleDemote}
                            disabled={isPending}
                        >
                            <ArrowDown className="w-4 h-4 mr-2" />
                            Turunkan jadi Member
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            className="w-full justify-start text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100"
                            onClick={handlePromote}
                            disabled={isPending}
                        >
                            <Crown className="w-4 h-4 mr-2" />
                            Promosikan jadi Admin
                        </Button>
                    )}

                    {/* Deactivate */}
                    {!isOwner && (
                        <Button
                            variant="outline"
                            className="w-full justify-start text-orange-600 border-orange-200 hover:bg-orange-50"
                            onClick={handleDeactivate}
                            disabled={isPending || isInactive}
                        >
                            <UserX className="w-4 h-4 mr-2" />
                            {isInactive ? "Sudah Nonaktif" : "Nonaktifkan Member"}
                        </Button>
                    )}

                    {/* Delete */}
                    {!isOwner && !showDeleteConfirm && (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-full text-xs text-neutral-400 hover:text-red-500 py-2"
                        >
                            Hapus permanen...
                        </button>
                    )}

                    {showDeleteConfirm && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-sm text-red-700 mb-3">
                                Yakin hapus <strong>{member.name}</strong>? Tindakan ini tidak bisa dibatalkan.
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleDelete}
                                    disabled={isPending}
                                >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    Ya, Hapus
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Batal
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)}>
                        Tutup
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
