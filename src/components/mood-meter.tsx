"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { updateMood } from "@/app/(authenticated)/profile/actions";

export type MoodOption = "sick" | "traveling" | "exam" | "mourning" | "happy" | null;

const MOOD_OPTIONS: { value: MoodOption; label: string; emoji: string }[] = [
    { value: "sick", label: "Sakit", emoji: "😷" },
    { value: "traveling", label: "Luar Kota", emoji: "✈️" },
    { value: "exam", label: "Ujian", emoji: "📚" },
    { value: "mourning", label: "Berduka", emoji: "🥀" },
    { value: "happy", label: "Happy", emoji: "🥳" },
];

type MoodMeterProps = {
    currentMood?: MoodOption;
    onDismiss?: () => void;
    className?: string;
};

export function MoodMeter({ currentMood, onDismiss, className }: MoodMeterProps) {
    const [selectedMood, setSelectedMood] = useState<MoodOption>(currentMood || null);
    const [isPending, startTransition] = useTransition();
    const [isDismissed, setIsDismissed] = useState(false);

    const handleMoodSelect = (mood: MoodOption) => {
        // Toggle off if already selected
        const newMood = selectedMood === mood ? null : mood;
        setSelectedMood(newMood);

        startTransition(async () => {
            const result = await updateMood(newMood);
            if (result?.success) {
                toast.success(result.message);
            } else {
                toast.error(result?.message || "Gagal menyimpan mood");
                setSelectedMood(currentMood || null); // Revert on failure
            }
        });
    };

    const handleDismiss = () => {
        setIsDismissed(true);
        onDismiss?.();
    };

    if (isDismissed) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                    "relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-4 border border-indigo-100/50",
                    className
                )}
            >
                {/* Dismiss Button */}
                <button
                    onClick={handleDismiss}
                    className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/50 transition-colors text-neutral-400 hover:text-neutral-600"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Header */}
                <div className="mb-3">
                    <h3 className="font-semibold text-neutral-800 text-sm">
                        Apa kabar harimu? 💭
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                        Beri tahu komsel kondisimu saat ini
                    </p>
                </div>

                {/* Mood Options */}
                <div className="flex flex-wrap gap-2">
                    {MOOD_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleMoodSelect(option.value)}
                            disabled={isPending}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                                "border border-transparent",
                                selectedMood === option.value
                                    ? "bg-white shadow-sm border-indigo-200 text-indigo-700"
                                    : "bg-white/50 text-neutral-600 hover:bg-white hover:shadow-sm",
                                isPending && "opacity-50 cursor-wait"
                            )}
                        >
                            <span>{option.emoji}</span>
                            <span>{option.label}</span>
                        </button>
                    ))}
                </div>

                {/* Current Status */}
                {selectedMood && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-indigo-600 mt-3"
                    >
                        Status kamu tersimpan! Komsel bisa melihat kondisimu.
                    </motion.p>
                )}
            </motion.div>
        </AnimatePresence>
    );
}

// Helper to get mood emoji for display in member list
export function getMoodEmoji(mood: MoodOption): string {
    const option = MOOD_OPTIONS.find((o) => o.value === mood);
    return option?.emoji || "";
}
