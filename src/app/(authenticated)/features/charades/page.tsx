"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Check, X, RotateCcw, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, triggerHaptic } from "@/lib/utils";

type Category = {
    id: string;
    name: string;
    emoji: string;
    words: string[];
};

const CATEGORIES: Category[] = [
    {
        id: "bible-people",
        name: "Tokoh Alkitab",
        emoji: "📖",
        words: [
            "Musa", "Daud", "Salomo", "Abraham", "Yusuf",
            "Maria", "Petrus", "Paulus", "Elia", "Yesus",
            "Nuh", "Rut", "Ester", "Daniel", "Yohanes",
            "Simson", "Gideon", "Samuel", "Yunus", "Zakheus"
        ]
    },
    {
        id: "worship-songs",
        name: "Lagu Rohani",
        emoji: "🎵",
        words: [
            "Besar Allahku", "Tuhan adalah Gembalaku", "Yesus Pokok",
            "Ku Mau Cinta Yesus", "Hosana", "Amazing Grace",
            "Berkat KemurahanMu", "Indah NamaMu", "Nyanyi dan Bersoraklah",
            "Betapa Hatiku", "Haleluyah", "Kaulah Harapan",
            "Bapa Engkau Sungguh Baik", "Di Bawah Sayap-Mu", "10.000 Alasan",
            "Sungguh Indah", "Percaya", "Mujizat Itu Nyata"
        ]
    },
    {
        id: "church-objects",
        name: "Benda Gereja",
        emoji: "⛪",
        words: [
            "Alkitab", "Salib", "Mimbar", "Pengeras suara",
            "Keyboard", "Kursi", "Proyektor", "Buku kidung",
            "Roti perjamuan", "Anggur", "Air baptis", "Jubah paduan suara",
            "Kantong persembahan", "Lilin", "Bunga altar", "Karpet"
        ]
    }
];

const ROUND_TIME = 60;

type GameState = "select" | "ready" | "playing" | "result";

export default function CharadesPage() {
    const [gameState, setGameState] = useState<GameState>("select");
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [currentWords, setCurrentWords] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [skipped, setSkipped] = useState(0);
    const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startGame = useCallback(() => {
        if (!selectedCategory) return;

        // Shuffle words
        const shuffled = [...selectedCategory.words].sort(() => Math.random() - 0.5);
        setCurrentWords(shuffled);
        setCurrentIndex(0);
        setScore(0);
        setSkipped(0);
        setTimeLeft(ROUND_TIME);
        setGameState("playing");
        triggerHaptic("medium");
    }, [selectedCategory]);

    const handleCorrect = () => {
        triggerHaptic("success");
        setScore(prev => prev + 1);
        nextWord();
    };

    const handleSkip = () => {
        triggerHaptic("light");
        setSkipped(prev => prev + 1);
        nextWord();
    };

    const nextWord = () => {
        if (currentIndex + 1 >= currentWords.length) {
            endGame();
        } else {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const endGame = useCallback(() => {
        setGameState("result");
        triggerHaptic("success");
        if (intervalRef.current) clearInterval(intervalRef.current);
    }, []);

    const resetGame = () => {
        setGameState("select");
        setSelectedCategory(null);
        setCurrentWords([]);
        setCurrentIndex(0);
        setScore(0);
        setSkipped(0);
        setTimeLeft(ROUND_TIME);
    };

    // Timer effect
    useEffect(() => {
        if (gameState !== "playing") return;

        intervalRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    endGame();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [gameState, endGame]);

    // Category Selection
    if (gameState === "select") {
        return (
            <main className="min-h-screen flex flex-col bg-[#F2F2F7]">
                <header className="sticky top-0 z-10 flex items-center gap-3 p-4 bg-[#F2F2F7]/80 backdrop-blur-md border-b border-neutral-200/50">
                    <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-neutral-200 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-neutral-600" />
                    </Link>
                    <h1 className="text-lg font-semibold text-neutral-900">🤫 Tebak Kata</h1>
                </header>

                <div className="flex-1 p-4 space-y-3">
                    <p className="text-neutral-500 text-center mb-4">
                        Pilih kategori untuk mulai
                    </p>

                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                setSelectedCategory(cat);
                                setGameState("ready");
                            }}
                            className="w-full bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 text-left hover:border-indigo-300 hover:shadow-md transition-all active:scale-[0.98]"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-4xl">{cat.emoji}</span>
                                <div>
                                    <p className="font-semibold text-neutral-900">{cat.name}</p>
                                    <p className="text-sm text-neutral-500">{cat.words.length} kata</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </main>
        );
    }

    // Ready state
    if (gameState === "ready" && selectedCategory) {
        return (
            <main className="min-h-screen flex flex-col bg-[#F2F2F7]">
                <header className="sticky top-0 z-10 flex items-center gap-3 p-4 bg-[#F2F2F7]/80 backdrop-blur-md border-b border-neutral-200/50">
                    <button onClick={resetGame} className="p-2 -ml-2 rounded-full hover:bg-neutral-200 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-neutral-600" />
                    </button>
                    <h1 className="text-lg font-semibold text-neutral-900">{selectedCategory.emoji} {selectedCategory.name}</h1>
                </header>

                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <span className="text-8xl mb-6">{selectedCategory.emoji}</span>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-2">{selectedCategory.name}</h2>
                    <p className="text-neutral-500 mb-8">
                        {ROUND_TIME} detik untuk peragakan sebanyak mungkin!
                    </p>

                    <Button onClick={startGame} size="lg" className="gap-2">
                        <Play className="w-5 h-5" />
                        Mulai!
                    </Button>
                </div>
            </main>
        );
    }

    // Result state
    if (gameState === "result") {
        return (
            <main className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-500 to-purple-600">
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-white">
                    <span className="text-7xl mb-6">🎉</span>
                    <h1 className="text-4xl font-black mb-2">Selesai!</h1>

                    <div className="flex gap-8 my-8">
                        <div className="text-center">
                            <p className="text-5xl font-bold">{score}</p>
                            <p className="text-white/70">Benar</p>
                        </div>
                        <div className="text-center">
                            <p className="text-5xl font-bold">{skipped}</p>
                            <p className="text-white/70">Dilewati</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button onClick={resetGame} variant="outline" className="border-white text-white hover:bg-white/10">
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Ganti Kategori
                        </Button>
                        <Button onClick={startGame} className="bg-white text-indigo-600 hover:bg-white/90">
                            Main Lagi
                        </Button>
                    </div>
                </div>
            </main>
        );
    }

    // Playing state
    const currentWord = currentWords[currentIndex];
    const timeProgress = (timeLeft / ROUND_TIME) * 100;

    return (
        <main className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            {/* Timer Bar */}
            <div className="h-2 bg-white/20">
                <div
                    className={cn(
                        "h-full transition-all duration-1000",
                        timeLeft > 10 ? "bg-white" : "bg-red-400"
                    )}
                    style={{ width: `${timeProgress}%` }}
                />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between p-4">
                <span className="text-white/70 text-sm">{score} Benar</span>
                <span className={cn(
                    "text-2xl font-bold",
                    timeLeft > 10 ? "text-white" : "text-red-300 animate-pulse"
                )}>
                    {timeLeft}s
                </span>
                <span className="text-white/70 text-sm">{skipped} Skip</span>
            </div>

            {/* Word Display */}
            <div className="flex-1 flex items-center justify-center p-6">
                <h1 className="text-5xl md:text-6xl font-black text-white text-center drop-shadow-lg">
                    {currentWord}
                </h1>
            </div>

            {/* Action Buttons */}
            <div className="p-6 flex items-center justify-center gap-6">
                <button
                    onClick={handleSkip}
                    className="w-20 h-20 rounded-full bg-white/20 backdrop-blur text-white shadow-lg flex items-center justify-center hover:bg-white/30 active:scale-95 transition-all"
                >
                    <X className="w-10 h-10" />
                </button>

                <button
                    onClick={handleCorrect}
                    className="w-24 h-24 rounded-full bg-white text-green-600 shadow-lg flex items-center justify-center hover:bg-green-50 active:scale-95 transition-all"
                >
                    <Check className="w-12 h-12" />
                </button>
            </div>

            <p className="text-center text-white/50 text-sm pb-6">
                {currentIndex + 1} / {currentWords.length}
            </p>
        </main>
    );
}
