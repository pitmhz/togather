"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Shuffle, Heart, Brain, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Deep talk questions categorized
const questions = {
    personal: [
        "Apa ketakutan terbesarmu yang belum pernah kamu ceritakan?",
        "Momen apa yang paling mengubah hidupmu?",
        "Apa hal yang paling ingin kamu maafkan dari dirimu sendiri?",
        "Siapa orang yang paling mempengaruhi hidupmu dan mengapa?",
        "Apa impianmu yang belum berani kamu kejar?",
    ],
    faith: [
        "Kapan terakhir kali kamu merasakan kehadiran Tuhan dengan sangat nyata?",
        "Ayat Alkitab apa yang paling sering kamu ingat saat sulit?",
        "Bagaimana imanmu berubah dalam 5 tahun terakhir?",
        "Apa pertanyaan terbesarmu tentang Tuhan?",
        "Momen apa yang membuatmu paling bersyukur tahun ini?",
    ],
    community: [
        "Apa yang membuatmu merasa diterima di komunitas ini?",
        "Bagaimana kita bisa saling mendukung lebih baik?",
        "Apa talenta yang ingin kamu kontribusikan ke kelompok?",
        "Momen apa bersama komunitas ini yang paling berkesan?",
        "Apa harapanmu untuk masa depan komunitas kita?",
    ],
    icebreaker: [
        "Kalau bisa makan malam dengan siapa saja (hidup/mati), siapa?",
        "Apa skill yang pengen banget kamu pelajari?",
        "Film atau lagu apa yang bisa kamu tonton/dengar berulang kali?",
        "Kalau menang lotre, hal pertama yang kamu lakukan?",
        "Apa hal konyol yang pernah kamu lakukan demi orang yang kamu cintai?",
    ],
};

const categories = [
    { id: "personal", label: "Personal", icon: Heart, color: "from-rose-500 to-pink-500" },
    { id: "faith", label: "Iman", icon: Sparkles, color: "from-amber-500 to-orange-500" },
    { id: "community", label: "Komunitas", icon: Users, color: "from-blue-500 to-indigo-500" },
    { id: "icebreaker", label: "Ice Breaker", icon: Brain, color: "from-green-500 to-teal-500" },
];

type CategoryId = keyof typeof questions;

export default function CardsPage() {
    const [category, setCategory] = useState<CategoryId>("icebreaker");
    const [currentQuestion, setCurrentQuestion] = useState(questions.icebreaker[0]);
    const [isFlipping, setIsFlipping] = useState(false);

    const getRandomQuestion = () => {
        setIsFlipping(true);
        setTimeout(() => {
            const categoryQuestions = questions[category];
            const randomIndex = Math.floor(Math.random() * categoryQuestions.length);
            setCurrentQuestion(categoryQuestions[randomIndex]);
            setIsFlipping(false);
        }, 300);
    };

    const selectedCategory = categories.find(c => c.id === category)!;

    return (
        <main className="min-h-screen flex flex-col bg-[#F2F2F7]">
            {/* Header */}
            <header className="sticky top-0 z-10 flex items-center gap-3 p-4 bg-[#F2F2F7]/80 backdrop-blur-md border-b border-neutral-200/50">
                <Link
                    href="/dashboard"
                    className="p-2 -ml-2 rounded-full hover:bg-neutral-200 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-neutral-600" />
                </Link>
                <h1 className="text-lg font-semibold text-neutral-900">
                    🃏 Deep Talk Cards
                </h1>
            </header>

            {/* Content */}
            <div className="flex-1 flex flex-col p-6 gap-6">
                {/* Category Selector */}
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = category === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setCategory(cat.id as CategoryId);
                                    setCurrentQuestion(questions[cat.id as CategoryId][0]);
                                }}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                                    isActive
                                        ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                                        : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                {/* The Card */}
                <div className="flex-1 flex items-center justify-center">
                    <div
                        className={cn(
                            "w-full max-w-sm aspect-[3/4] rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300",
                            `bg-gradient-to-br ${selectedCategory.color}`,
                            isFlipping && "scale-95 opacity-50"
                        )}
                    >
                        {/* Decorative elements */}
                        <div className="absolute top-4 left-4 opacity-20">
                            <selectedCategory.icon className="w-12 h-12 text-white" />
                        </div>
                        <div className="absolute bottom-4 right-4 opacity-20">
                            <selectedCategory.icon className="w-12 h-12 text-white" />
                        </div>

                        {/* Question */}
                        <p className="text-xl md:text-2xl font-semibold text-white leading-relaxed">
                            "{currentQuestion}"
                        </p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col gap-3">
                    <Button
                        onClick={getRandomQuestion}
                        size="lg"
                        variant="outline"
                        className="w-full py-6 text-lg font-semibold rounded-2xl bg-white border-2 border-neutral-200 hover:bg-neutral-50"
                    >
                        <Shuffle className="w-5 h-5 mr-2" />
                        Kartu Selanjutnya
                    </Button>

                    <p className="text-center text-sm text-neutral-500">
                        Kategori: {selectedCategory.label} • {questions[category].length} pertanyaan
                    </p>
                </div>
            </div>
        </main>
    );
}
