"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, triggerHaptic } from "@/lib/utils";

type Dilemma = {
    optionA: string;
    optionB: string;
};

const DILEMMAS: Dilemma[] = [
    { optionA: "Selalu telat 10 menit", optionB: "Selalu datang 1 jam awal" },
    { optionA: "Bisa terbang tapi lambat", optionB: "Bisa lari super cepat tapi capek" },
    { optionA: "Tidak bisa pakai HP 1 tahun", optionB: "Tidak bisa makan gorengan 1 tahun" },
    { optionA: "Punya suara merdu tapi bisu", optionB: "Bisa bicara tapi suara cempreng" },
    { optionA: "Tau semua rahasia orang", optionB: "Tidak ada yang tau rahasiamu" },
    { optionA: "Hidup tanpa musik", optionB: "Hidup tanpa film" },
    { optionA: "Selalu keringatan", optionB: "Selalu kedinginan" },
    { optionA: "Bisa ngobrol sama hewan", optionB: "Bisa bicara semua bahasa" },
    { optionA: "Pelayan di restoran mewah", optionB: "Chef di warung kaki lima" },
    { optionA: "Tidur 4 jam tapi segar", optionB: "Tidur 12 jam tapi tetap ngantuk" },
    { optionA: "Punya 10 teman dekat", optionB: "Punya 1000 kenalan" },
    { optionA: "Makan makanan yang sama selamanya", optionB: "Tidak bisa makan makanan favoritmu lagi" },
    { optionA: "Tau kapan meninggal", optionB: "Tau cara meninggal" },
    { optionA: "Kaya tapi tidak terkenal", optionB: "Terkenal tapi tidak kaya" },
    { optionA: "Bisa mundur waktu 10 menit sekali", optionB: "Bisa pause waktu 10 detik sekali" },
    { optionA: "Tidak pernah bisa berbohong", optionB: "Tidak bisa mendeteksi kebohongan" },
    { optionA: "Selalu lupa nama orang", optionB: "Selalu lupa wajah orang" },
    { optionA: "Hidup di masa lalu dengan ilmu sekarang", optionB: "Hidup di masa depan tanpa pengetahuan" },
    { optionA: "Mimpi buruk setiap malam", optionB: "Tidak pernah mimpi" },
    { optionA: "Bisa membaca pikiran", optionB: "Bisa mengontrol pikiran (sekali sehari)" },
];

export default function RatherPage() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answeredCount, setAnsweredCount] = useState(0);

    const currentDilemma = DILEMMAS[currentIndex];
    const isComplete = currentIndex >= DILEMMAS.length;

    const handleChoice = (choice: "A" | "B") => {
        triggerHaptic("medium");
        setAnsweredCount(prev => prev + 1);

        // Small delay for visual feedback
        setTimeout(() => {
            setCurrentIndex(prev => prev + 1);
        }, 200);
    };

    const resetGame = () => {
        setCurrentIndex(0);
        setAnsweredCount(0);
        triggerHaptic("light");
    };

    // Completion state
    if (isComplete) {
        return (
            <main className="min-h-screen flex flex-col bg-gradient-to-br from-cyan-500 to-blue-600">
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-white">
                    <span className="text-7xl mb-6">🎊</span>
                    <h1 className="text-4xl font-black mb-2">Habis!</h1>
                    <p className="text-white/70 mb-8">
                        {answeredCount} pertanyaan dijawab
                    </p>

                    <Button onClick={resetGame} className="bg-white text-cyan-600 hover:bg-white/90">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Main Lagi dari Awal
                    </Button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4">
                <Link href="/dashboard" className="p-2 rounded-full bg-white/20 backdrop-blur hover:bg-white/30 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-white" />
                </Link>
                <span className="text-white/80 text-sm font-medium">
                    {currentIndex + 1} / {DILEMMAS.length}
                </span>
                <div className="w-9" /> {/* Spacer */}
            </header>

            {/* Option A (Top) */}
            <button
                onClick={() => handleChoice("A")}
                className="flex-1 bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center p-8 active:brightness-110 transition-all"
            >
                <div className="text-center text-white max-w-xs">
                    <span className="text-4xl mb-4 block">🅰️</span>
                    <p className="text-xl md:text-2xl font-bold leading-tight">
                        {currentDilemma.optionA}
                    </p>
                </div>
            </button>

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center z-10">
                        <span className="text-2xl font-black text-neutral-800">VS</span>
                    </div>
                </div>
            </div>

            {/* Option B (Bottom) */}
            <button
                onClick={() => handleChoice("B")}
                className="flex-1 bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center p-8 active:brightness-110 transition-all"
            >
                <div className="text-center text-white max-w-xs">
                    <span className="text-4xl mb-4 block">🅱️</span>
                    <p className="text-xl md:text-2xl font-bold leading-tight">
                        {currentDilemma.optionB}
                    </p>
                </div>
            </button>

            {/* Footer hint */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-white/50 text-xs flex items-center justify-center gap-1">
                    Tap untuk lanjut <ChevronRight className="w-3 h-3" />
                </p>
            </div>
        </main>
    );
}
