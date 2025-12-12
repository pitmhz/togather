"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, triggerHaptic } from "@/lib/utils";

type GameState = "ready" | "playing" | "exploded";

export default function BombPage() {
    const [gameState, setGameState] = useState<GameState>("ready");
    const [timeLeft, setTimeLeft] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [pulseSpeed, setPulseSpeed] = useState(1000);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const hapticRef = useRef<NodeJS.Timeout | null>(null);

    const startGame = useCallback(() => {
        // Random time between 10-60 seconds
        const duration = Math.floor(Math.random() * 50) + 10;
        setTotalTime(duration);
        setTimeLeft(duration);
        setGameState("playing");
        triggerHaptic("heavy");
    }, []);

    const resetGame = () => {
        setGameState("ready");
        setTimeLeft(0);
        setTotalTime(0);
        setPulseSpeed(1000);
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (hapticRef.current) clearInterval(hapticRef.current);
    };

    // Countdown effect
    useEffect(() => {
        if (gameState !== "playing") return;

        intervalRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    // BOOM!
                    setGameState("exploded");
                    triggerHaptic("error");
                    setTimeout(() => triggerHaptic("error"), 100);
                    setTimeout(() => triggerHaptic("error"), 200);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [gameState]);

    // Pulse speed effect
    useEffect(() => {
        if (gameState !== "playing" || totalTime === 0) return;

        const progress = timeLeft / totalTime;

        if (progress > 0.5) {
            setPulseSpeed(1000);
        } else if (progress > 0.25) {
            setPulseSpeed(500);
        } else if (progress > 0.1) {
            setPulseSpeed(250);
        } else {
            setPulseSpeed(100);
        }
    }, [timeLeft, totalTime, gameState]);

    // Haptic feedback effect
    useEffect(() => {
        if (gameState !== "playing") {
            if (hapticRef.current) clearInterval(hapticRef.current);
            return;
        }

        hapticRef.current = setInterval(() => {
            triggerHaptic("light");
        }, pulseSpeed);

        return () => {
            if (hapticRef.current) clearInterval(hapticRef.current);
        };
    }, [pulseSpeed, gameState]);

    // Ready state
    if (gameState === "ready") {
        return (
            <main className="min-h-screen flex flex-col bg-[#F2F2F7]">
                <header className="sticky top-0 z-10 flex items-center gap-3 p-4 bg-[#F2F2F7]/80 backdrop-blur-md border-b border-neutral-200/50">
                    <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-neutral-200 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-neutral-600" />
                    </Link>
                    <h1 className="text-lg font-semibold text-neutral-900">💣 Bom Waktu</h1>
                </header>

                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <p className="text-neutral-500 mb-8 max-w-xs">
                        Oper HP ke teman-teman. Siapa yang kena bom, dia yang doa!
                    </p>

                    <button
                        onClick={startGame}
                        className="w-48 h-48 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-2xl flex items-center justify-center text-white active:scale-95 transition-transform"
                    >
                        <Play className="w-20 h-20 ml-2" />
                    </button>

                    <p className="text-sm text-neutral-400 mt-8">
                        Tekan untuk mulai
                    </p>
                </div>
            </main>
        );
    }

    // Exploded state
    if (gameState === "exploded") {
        return (
            <main className="min-h-screen flex flex-col bg-black animate-pulse">
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <div className="text-8xl mb-6">💥</div>
                    <h1 className="text-4xl font-black text-red-500 mb-4">BOOM!</h1>
                    <p className="text-2xl text-white mb-2">KAMU KENA! 🫵</p>
                    <p className="text-neutral-400 mb-8">Waktunya doa...</p>

                    <Button onClick={resetGame} variant="outline" className="border-white text-white hover:bg-white/10">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Main Lagi
                    </Button>
                </div>
            </main>
        );
    }

    // Playing state
    return (
        <main className="min-h-screen flex flex-col bg-gradient-to-br from-red-900 via-red-800 to-orange-900">
            <div className="flex-1 flex flex-col items-center justify-center p-6">
                {/* The Bomb */}
                <div
                    className={cn(
                        "w-56 h-56 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-2xl flex items-center justify-center",
                        "animate-pulse"
                    )}
                    style={{ animationDuration: `${pulseSpeed}ms` }}
                >
                    <span className="text-8xl">💣</span>
                </div>

                <p className="text-white/60 mt-8 text-lg">
                    Cepat oper ke teman!
                </p>

                {/* Hidden indicator for debugging - remove in prod */}
                {/* <p className="text-white/20 text-xs mt-4">{timeLeft}s</p> */}
            </div>
        </main>
    );
}
