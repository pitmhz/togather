"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, PieChart, MessageCircleHeart, Check, ChevronRight, Bomb, Smile, Scale } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

type DashboardToolsProps = {
    isAdmin: boolean;
};

const tools = [
    {
        id: "attendance",
        title: "Absensi Swipe",
        tagline: "Catat kehadiran kilat.",
        icon: Zap,
        iconColor: "text-amber-600",
        iconBg: "bg-amber-100",
        benefits: ["Cepat & Tanpa Kertas", "Laporan Otomatis", "Mode Offline"],
        howTo: ["Buka fitur ini", "Minta anggota swipe HP", "Data langsung tersimpan"],
        buttonLabel: "⚡ Mulai Sesi Absensi",
        href: "/features/attendance",
    },
    {
        id: "wheel",
        title: "Roda Undian",
        tagline: "Seru-seruan bagi doorprize.",
        icon: PieChart,
        iconColor: "text-purple-600",
        iconBg: "bg-purple-100",
        benefits: ["Adil & Transparan", "Animasi Seru", "Tanpa Setting Ribet"],
        howTo: ["Pilih Event aktif", "Sistem memuat nama yang hadir", "Putar roda!"],
        buttonLabel: "🎡 Putar Roda",
        href: "/features/wheel",
    },
    {
        id: "cards",
        title: "Kartu Sharing",
        tagline: "Pemantik diskusi bermakna.",
        icon: MessageCircleHeart,
        iconColor: "text-rose-600",
        iconBg: "bg-rose-100",
        benefits: ["Pertanyaan Deep Talk", "Ice Breaking", "Membangun Koneksi"],
        howTo: ["Pilih kategori topik", "Bacakan kartu yang muncul"],
        buttonLabel: "🃏 Buka Kartu",
        href: "/features/cards",
    },
    {
        id: "whatsapp",
        title: "WhatsApp Blast",
        tagline: "Undang anggota dengan cepat.",
        icon: MessageCircleHeart,
        iconColor: "text-green-600",
        iconBg: "bg-green-100",
        benefits: ["Template Siap Pakai", "Copy & Paste", "Langsung ke WA"],
        howTo: ["Isi detail acara", "Salin atau buka WhatsApp"],
        buttonLabel: "💬 Buat Undangan",
        href: "/features/whatsapp",
    },
    {
        id: "bomb",
        title: "💣 Bom Waktu",
        tagline: "Siapa kena, dia doa!",
        icon: Bomb,
        iconColor: "text-red-600",
        iconBg: "bg-red-100",
        benefits: ["Seru & Menegangkan", "Offline First", "Ice Breaker"],
        howTo: ["Tekan mulai", "Oper HP ke teman", "Kena? Doa!"],
        buttonLabel: "💣 Mulai Bom",
        href: "/features/bomb",
    },
    {
        id: "charades",
        title: "🤫 Tebak Kata",
        tagline: "Peragakan tokoh Alkitab.",
        icon: Smile,
        iconColor: "text-indigo-600",
        iconBg: "bg-indigo-100",
        benefits: ["Kategori Rohani", "Timer 60 detik", "Kompetitif"],
        howTo: ["Pilih kategori", "Peragakan tanpa bicara", "Tim menebak"],
        buttonLabel: "🎭 Mulai Tebak",
        href: "/features/charades",
    },
    {
        id: "rather",
        title: "⚖️ Mending Mana?",
        tagline: "Pilihan sulit bikin dilema.",
        icon: Scale,
        iconColor: "text-cyan-600",
        iconBg: "bg-cyan-100",
        benefits: ["Pertanyaan Kocak", "Diskusi Seru", "Semua Bisa Main"],
        howTo: ["Baca pilihan A vs B", "Voting angkat tangan", "Diskusi!"],
        buttonLabel: "⚖️ Mulai Dilema",
        href: "/features/rather",
    },
];

const INITIAL_VISIBLE = 3;

export function DashboardTools({ isAdmin }: DashboardToolsProps) {
    const [showAll, setShowAll] = useState(false);

    // Only visible to admins
    if (!isAdmin) return null;

    const visibleTools = showAll ? tools : tools.slice(0, INITIAL_VISIBLE);
    const hasMore = tools.length > INITIAL_VISIBLE;

    return (
        <section className="mb-6">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                🛠️ Alat Bantu Komsel
            </h2>

            <Accordion type="single" collapsible className="flex flex-col gap-3">
                {visibleTools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                        <AccordionItem
                            key={tool.id}
                            value={tool.id}
                            className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden"
                        >
                            <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-neutral-50 [&[data-state=open]]:bg-neutral-50">
                                <div className="flex items-center gap-4 w-full">
                                    {/* Icon */}
                                    <div className={`p-3 rounded-full ${tool.iconBg} flex-shrink-0`}>
                                        <Icon className={`w-5 h-5 ${tool.iconColor}`} />
                                    </div>

                                    {/* Text */}
                                    <div className="flex-1 text-left">
                                        <p className="font-semibold text-neutral-900">{tool.title}</p>
                                        <p className="text-sm text-neutral-500">{tool.tagline}</p>
                                    </div>
                                </div>
                            </AccordionTrigger>

                            <AccordionContent className="px-4 pb-4">
                                <div className="space-y-4 pt-2">
                                    {/* Benefits Section */}
                                    <div>
                                        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
                                            Yang kamu dapat
                                        </p>
                                        <ul className="space-y-1.5">
                                            {tool.benefits.map((benefit, idx) => (
                                                <li key={idx} className="flex items-center gap-2 text-sm text-neutral-700">
                                                    <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                        <Check className="w-2.5 h-2.5 text-green-600" />
                                                    </div>
                                                    {benefit}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* How To Section */}
                                    <div>
                                        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
                                            Cara pakai
                                        </p>
                                        <ol className="space-y-1">
                                            {tool.howTo.map((step, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm text-neutral-600">
                                                    <span className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-medium text-neutral-500 flex-shrink-0">
                                                        {idx + 1}
                                                    </span>
                                                    {step}
                                                </li>
                                            ))}
                                        </ol>
                                    </div>

                                    {/* Action Button */}
                                    <Button asChild className="w-full mt-2">
                                        <Link href={tool.href} className="gap-2">
                                            {tool.buttonLabel}
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>

            {/* Show More / Less Button */}
            {hasMore && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="w-full mt-3 py-2.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-colors flex items-center justify-center gap-1"
                >
                    {showAll ? (
                        <>
                            Tampilkan Lebih Sedikit
                            <ChevronRight className="w-4 h-4 rotate-[-90deg]" />
                        </>
                    ) : (
                        <>
                            Lihat Semua ({tools.length - INITIAL_VISIBLE} lainnya)
                            <ChevronRight className="w-4 h-4 rotate-90" />
                        </>
                    )}
                </button>
            )}
        </section>
    );
}

