"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, MessageCircleHeart } from "lucide-react";

import { Button } from "@/components/ui/button";

// Deep Talk Questions for fellowship
const DEEP_QUESTIONS = [
  "Apa hal yang paling kamu syukuri minggu ini?",
  "Kapan terakhir kali kamu merasa benar-benar bahagia?",
  "Apa mimpimu yang belum tercapai?",
  "Siapa orang yang paling berpengaruh dalam hidupmu?",
  "Apa ketakutan terbesarmu dan bagaimana kamu menghadapinya?",
  "Kapan terakhir kali kamu keluar dari zona nyaman?",
  "Apa pelajaran hidup terpenting yang kamu dapat tahun ini?",
  "Jika bisa mengulang waktu, apa yang ingin kamu ubah?",
  "Apa doa yang paling sering kamu panjatkan?",
  "Bagaimana kamu mendefinisikan kesuksesan?",
  "Apa kebiasaan baik yang ingin kamu bangun?",
  "Siapa yang kamu rindukan saat ini?",
  "Apa yang membuatmu merasa paling hidup?",
  "Bagaimana cara kamu menghadapi kekecewaan?",
  "Apa ayat Alkitab favoritmu dan mengapa?",
];

export function DeepTalkCards() {
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [usedQuestions, setUsedQuestions] = useState<Set<number>>(new Set());
  const [isFlipping, setIsFlipping] = useState(false);

  const drawCard = useCallback(() => {
    setIsFlipping(true);
    
    setTimeout(() => {
      // Get available questions
      const availableIndices = DEEP_QUESTIONS
        .map((_, i) => i)
        .filter((i) => !usedQuestions.has(i));

      // Reset if all used
      if (availableIndices.length === 0) {
        setUsedQuestions(new Set());
        const randomIndex = Math.floor(Math.random() * DEEP_QUESTIONS.length);
        setCurrentQuestion(DEEP_QUESTIONS[randomIndex]);
        setUsedQuestions(new Set([randomIndex]));
      } else {
        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        setCurrentQuestion(DEEP_QUESTIONS[randomIndex]);
        setUsedQuestions((prev) => new Set([...prev, randomIndex]));
      }

      setIsFlipping(false);
    }, 300);
  }, [usedQuestions]);

  return (
    <div className="flex flex-col items-center py-8">
      {/* Card Display */}
      <div className="relative w-72 h-48 mb-8 perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion || "back"}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`absolute inset-0 rounded-2xl shadow-xl flex items-center justify-center p-6 ${
              currentQuestion
                ? "bg-gradient-to-br from-amber-400 via-orange-400 to-red-400"
                : "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
            }`}
          >
            {currentQuestion ? (
              <div className="text-center">
                <MessageCircleHeart className="w-8 h-8 text-white/80 mx-auto mb-3" />
                <p className="text-white font-medium text-lg leading-relaxed">
                  {currentQuestion}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-5xl mb-3">🃏</div>
                <p className="text-white/90 font-medium">
                  Deep Talk Cards
                </p>
                <p className="text-white/70 text-sm mt-1">
                  Tekan tombol untuk ambil kartu
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress */}
      <p className="text-xs text-muted-foreground mb-4">
        {usedQuestions.size} / {DEEP_QUESTIONS.length} pertanyaan
      </p>

      {/* Draw Button */}
      <Button
        onClick={drawCard}
        disabled={isFlipping}
        size="lg"
        className="w-48 h-14 text-lg font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white rounded-full shadow-lg"
      >
        <RefreshCw className={`w-5 h-5 mr-2 ${isFlipping ? "animate-spin" : ""}`} />
        {currentQuestion ? "Ambil Lagi" : "Ambil Kartu"}
      </Button>

      {/* Reset */}
      {usedQuestions.size > 0 && (
        <button
          onClick={() => {
            setUsedQuestions(new Set());
            setCurrentQuestion(null);
          }}
          className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Reset semua kartu
        </button>
      )}
    </div>
  );
}
