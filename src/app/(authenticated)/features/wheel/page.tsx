"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Dummy participants for demo
const participants = [
    { name: "Budi", color: "#FF6B6B" },
    { name: "Siti", color: "#4ECDC4" },
    { name: "Joko", color: "#45B7D1" },
    { name: "Sarah", color: "#96CEB4" },
    { name: "Andi", color: "#FFEAA7" },
    { name: "Maya", color: "#DDA0DD" },
    { name: "Rudi", color: "#98D8C8" },
    { name: "Dewi", color: "#F7DC6F" },
];

export default function WheelPage() {
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [winner, setWinner] = useState<string | null>(null);
    const wheelRef = useRef<HTMLDivElement>(null);

    const segmentAngle = 360 / participants.length;

    const spinWheel = () => {
        if (isSpinning) return;

        setIsSpinning(true);
        setWinner(null);

        // Random rotation between 5-10 full spins + random segment
        const spins = 5 + Math.random() * 5;
        const randomAngle = Math.random() * 360;
        const totalRotation = rotation + (spins * 360) + randomAngle;

        setRotation(totalRotation);

        // Calculate winner after animation
        setTimeout(() => {
            const normalizedAngle = (360 - (totalRotation % 360) + 90) % 360;
            const winnerIndex = Math.floor(normalizedAngle / segmentAngle) % participants.length;
            setWinner(participants[winnerIndex].name);
            setIsSpinning(false);
        }, 4000);
    };

    const reset = () => {
        setRotation(0);
        setWinner(null);
    };

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
                    🎡 Roda Keberuntungan
                </h1>
            </header>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
                {/* The Wheel */}
                <div className="relative">
                    {/* Pointer */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
                        <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-neutral-900" />
                    </div>

                    {/* Wheel Container */}
                    <div
                        ref={wheelRef}
                        className="w-72 h-72 rounded-full border-4 border-neutral-900 overflow-hidden shadow-2xl transition-transform duration-[4000ms] ease-out"
                        style={{ transform: `rotate(${rotation}deg)` }}
                    >
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                            {participants.map((participant, index) => {
                                const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
                                const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);

                                const x1 = 50 + 50 * Math.cos(startAngle);
                                const y1 = 50 + 50 * Math.sin(startAngle);
                                const x2 = 50 + 50 * Math.cos(endAngle);
                                const y2 = 50 + 50 * Math.sin(endAngle);

                                const largeArcFlag = segmentAngle > 180 ? 1 : 0;

                                const textAngle = (index * segmentAngle + segmentAngle / 2 - 90) * (Math.PI / 180);
                                const textX = 50 + 32 * Math.cos(textAngle);
                                const textY = 50 + 32 * Math.sin(textAngle);
                                const textRotation = index * segmentAngle + segmentAngle / 2;

                                return (
                                    <g key={participant.name}>
                                        <path
                                            d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                                            fill={participant.color}
                                            stroke="#fff"
                                            strokeWidth="0.5"
                                        />
                                        <text
                                            x={textX}
                                            y={textY}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                                            className="text-[6px] font-bold fill-neutral-900"
                                        >
                                            {participant.name}
                                        </text>
                                    </g>
                                );
                            })}
                            {/* Center circle */}
                            <circle cx="50" cy="50" r="8" fill="#1a1a1a" />
                        </svg>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-center gap-4">
                    <Button
                        onClick={spinWheel}
                        disabled={isSpinning}
                        size="lg"
                        className="px-12 py-6 text-lg font-bold rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg"
                    >
                        {isSpinning ? (
                            <RotateCw className="w-6 h-6 animate-spin" />
                        ) : (
                            "🎯 PUTAR!"
                        )}
                    </Button>

                    {winner && (
                        <button
                            onClick={reset}
                            className="text-sm text-neutral-500 hover:text-neutral-700 underline"
                        >
                            Reset
                        </button>
                    )}
                </div>

                {/* Winner Announcement */}
                {winner && (
                    <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-yellow-400 animate-bounce-slow text-center">
                        <p className="text-sm text-neutral-500 uppercase tracking-wide">Pemenang</p>
                        <p className="text-3xl font-bold text-neutral-900 mt-1">🎉 {winner}!</p>
                        <p className="text-sm text-neutral-500 mt-2">Selamat!</p>
                    </div>
                )}
            </div>
        </main>
    );
}
