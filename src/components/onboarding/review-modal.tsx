"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type CommunityInfo = {
    name: string;
    location: string;
    leader?: string;
    schedule?: string;
};

type ReviewModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    community: CommunityInfo | null;
    isLoading?: boolean;
};

export function ReviewModal({
    isOpen,
    onClose,
    onConfirm,
    community,
    isLoading = false,
}: ReviewModalProps) {
    if (!community) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm mx-4"
                    >
                        <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors z-10"
                            >
                                <X className="w-4 h-4 text-gray-600" />
                            </button>

                            {/* Content */}
                            <div className="p-8 pt-12">
                                {/* Success Icon */}
                                <div className="flex justify-center mb-6">
                                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                                    </div>
                                </div>

                                {/* Heading */}
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold text-foreground mb-1">
                                        Konfirmasi Gabung
                                    </h2>
                                    <p className="text-muted-foreground text-sm">
                                        Pastikan data komunitas ini benar
                                    </p>
                                </div>

                                {/* Community Card */}
                                <div className="bg-gray-50 rounded-2xl p-5 mb-6">
                                    <h3 className="font-bold text-lg mb-3">{community.name}</h3>

                                    <div className="flex items-start gap-2 text-gray-600 mb-2">
                                        <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                                        <span className="text-sm">{community.location}</span>
                                    </div>

                                    {community.leader && (
                                        <div className="text-sm text-gray-600">
                                            <span className="text-gray-400">Leader:</span>{" "}
                                            <span className="font-medium">{community.leader}</span>
                                        </div>
                                    )}

                                    {community.schedule && (
                                        <div className="text-sm text-gray-600 mt-1">
                                            <span className="text-gray-400">Jadwal:</span>{" "}
                                            <span>{community.schedule}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Buttons - Luma Style */}
                                <div className="space-y-3">
                                    {/* Secondary Action (Check Again) - Per Luma: Primary styled but for "go back" */}
                                    <Button
                                        variant="default"
                                        className="w-full h-14 text-base"
                                        onClick={onClose}
                                        disabled={isLoading}
                                    >
                                        Periksa Lagi
                                    </Button>

                                    {/* Primary Action (Confirm) - Per Luma: Secondary styled for "confirm" */}
                                    <Button
                                        variant="secondary"
                                        className="w-full h-14 text-base"
                                        onClick={onConfirm}
                                        disabled={isLoading}
                                        isLoading={isLoading}
                                    >
                                        Ya, Gabung
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
