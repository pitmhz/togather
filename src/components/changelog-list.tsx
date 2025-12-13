"use client";

import { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

import { CHANGELOG, type ChangelogEntry } from "@/lib/changelog";
import { cn } from "@/lib/utils";

export function ChangelogList() {
    const [isExpanded, setIsExpanded] = useState(false);
    const latestVersion = CHANGELOG[0];
    const olderVersions = CHANGELOG.slice(1);

    return (
        <div className="space-y-3">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between text-left"
            >
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium text-neutral-700">Apa yang baru?</span>
                </div>
                <ChevronDown
                    className={cn(
                        "w-4 h-4 text-neutral-400 transition-transform",
                        isExpanded && "rotate-180"
                    )}
                />
            </button>

            {/* Latest Version (Always visible) */}
            <VersionCard entry={latestVersion} isLatest />

            {/* Older Versions (Expandable) */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3 overflow-hidden"
                    >
                        {olderVersions.map((entry) => (
                            <VersionCard key={entry.version} entry={entry} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {!isExpanded && olderVersions.length > 0 && (
                <button
                    onClick={() => setIsExpanded(true)}
                    className="text-xs text-neutral-400 hover:text-neutral-600"
                >
                    + {olderVersions.length} versi sebelumnya
                </button>
            )}
        </div>
    );
}

function VersionCard({ entry, isLatest = false }: { entry: ChangelogEntry; isLatest?: boolean }) {
    return (
        <div
            className={cn(
                "p-3 rounded-xl border",
                isLatest
                    ? "bg-purple-50/50 border-purple-100"
                    : "bg-neutral-50 border-neutral-100"
            )}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span
                        className={cn(
                            "text-xs font-semibold px-2 py-0.5 rounded-full",
                            isLatest
                                ? "bg-purple-100 text-purple-700"
                                : "bg-neutral-200 text-neutral-600"
                        )}
                    >
                        v{entry.version}
                    </span>
                    {isLatest && (
                        <span className="text-[10px] font-medium text-purple-600 uppercase tracking-wide">
                            Terbaru
                        </span>
                    )}
                </div>
                <span className="text-[10px] text-neutral-400">
                    {format(new Date(entry.date), "dd MMM yyyy", { locale: idLocale })}
                </span>
            </div>
            <h4 className="font-medium text-sm text-neutral-800 mb-1.5">{entry.title}</h4>
            <ul className="space-y-1">
                {entry.changes.map((change, idx) => (
                    <li key={idx} className="text-xs text-neutral-600 flex items-start gap-1.5">
                        <span className="text-neutral-300">•</span>
                        {change}
                    </li>
                ))}
            </ul>
        </div>
    );
}
