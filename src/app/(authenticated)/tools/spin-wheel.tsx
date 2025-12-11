"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { RotateCcw, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type Attendee = {
  id: string;
  name: string;
};

type SpinWheelProps = {
  attendees: Attendee[];
};

export function SpinWheel({ attendees }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Attendee | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fireConfetti = useCallback(() => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, []);

  const spin = useCallback(() => {
    if (isSpinning || attendees.length < 2) return;

    setIsSpinning(true);
    setWinner(null);

    // Animation: cycle through names rapidly, then slow down
    let speed = 50;
    let iterations = 0;
    const maxIterations = 30 + Math.floor(Math.random() * 20);

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % attendees.length);
      iterations++;

      // Slow down progressively
      if (iterations > maxIterations * 0.6) {
        speed += 30;
      }
      if (iterations > maxIterations * 0.8) {
        speed += 50;
      }

      if (iterations >= maxIterations) {
        clearInterval(interval);
        const winnerIndex = Math.floor(Math.random() * attendees.length);
        setCurrentIndex(winnerIndex);
        setWinner(attendees[winnerIndex]);
        setIsSpinning(false);
        setTimeout(fireConfetti, 200);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [isSpinning, attendees, fireConfetti]);

  if (attendees.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center mb-4">
          <span className="text-4xl">🎯</span>
        </div>
        <p className="text-muted-foreground text-sm">
          Check-in member dulu di menu Event!
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Minimal 2 orang hadir untuk memutar roda.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-8">
      {/* Name Display */}
      <div className="relative w-64 h-32 flex items-center justify-center mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-20" />
        <div className="absolute inset-1 bg-card rounded-xl" />
        <AnimatePresence mode="wait">
          <motion.div
            key={isSpinning ? currentIndex : winner?.id || "idle"}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: isSpinning ? 0.05 : 0.3 }}
            className="relative text-center"
          >
            <p className={`font-heading font-bold ${winner ? "text-3xl" : "text-2xl"} bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent`}>
              {winner ? winner.name : attendees[currentIndex]?.name || "?"}
            </p>
            {winner && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-muted-foreground mt-1"
              >
                🎉 Pemenang! 🎉
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Attendee Pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-xs">
        {attendees.map((attendee, i) => (
          <motion.span
            key={attendee.id}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              (isSpinning && i === currentIndex) || winner?.id === attendee.id
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white scale-110"
                : "bg-muted text-muted-foreground"
            }`}
            animate={{
              scale: (isSpinning && i === currentIndex) || winner?.id === attendee.id ? 1.15 : 1,
            }}
          >
            {attendee.name}
          </motion.span>
        ))}
      </div>

      {/* Spin Button */}
      <Button
        onClick={spin}
        disabled={isSpinning}
        size="lg"
        className="w-48 h-14 text-lg font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-full shadow-lg"
      >
        {isSpinning ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Spinning...
          </>
        ) : winner ? (
          <>
            <RotateCcw className="w-5 h-5 mr-2" />
            Putar Lagi
          </>
        ) : (
          "🎰 PUTAR!"
        )}
      </Button>
    </div>
  );
}
