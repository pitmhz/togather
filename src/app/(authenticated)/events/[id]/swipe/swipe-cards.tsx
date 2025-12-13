"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Check, X, PartyPopper } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { updateAttendance } from "../attendance-actions";
import { getAvatarUrl } from "@/lib/utils";

type Member = {
  id: string;
  name: string;
  avatar_url: string | null;
};

type SwipeCardsProps = {
  members: Member[];
  eventId: string;
};



export function SwipeCards({ members: initialMembers, eventId }: SwipeCardsProps) {
  const [members, setMembers] = useState(initialMembers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);
  const [isPending, startTransition] = useTransition();

  const currentMember = members[currentIndex];
  const isComplete = currentIndex >= members.length;

  const handleSwipe = (direction: "left" | "right") => {
    if (!currentMember || isPending) return;

    setExitDirection(direction);

    startTransition(async () => {
      const status = direction === "right" ? "present" : "absent";
      await updateAttendance(eventId, currentMember.id, status);

      // Move to next card after animation
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setExitDirection(null);
      }, 200);
    });
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      handleSwipe("right");
    } else if (info.offset.x < -threshold) {
      handleSwipe("left");
    }
  };

  // Completion State
  if (isComplete) {
    return (
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-emerald-100 dark:bg-emerald-950 rounded-full flex items-center justify-center">
          <PartyPopper className="w-12 h-12 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          Selesai! 🎉
        </h2>
        <p className="text-muted-foreground mb-6">
          Absensi tuntas. Semua anggota sudah diabsen.
        </p>
        <Button asChild>
          <Link href={`/events/${eventId}`}>Kembali ke Event</Link>
        </Button>
      </div>
    );
  }

  // No members to swipe
  if (members.length === 0) {
    return (
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-amber-100 dark:bg-amber-950 rounded-full flex items-center justify-center">
          <Check className="w-12 h-12 text-amber-600" />
        </div>
        <h2 className="text-xl font-heading font-bold text-foreground mb-2">
          Semua Hadir!
        </h2>
        <p className="text-muted-foreground mb-6">
          Tidak ada anggota yang perlu diabsen lagi.
        </p>
        <Button asChild>
          <Link href={`/events/${eventId}`}>Kembali ke Event</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      {/* Progress */}
      <div className="text-center mb-4">
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} / {members.length}
        </span>
      </div>

      {/* Card Stack */}
      <div className="relative h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMember.id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              x: 0,
              rotate: 0,
            }}
            exit={{
              x: exitDirection === "right" ? 300 : exitDirection === "left" ? -300 : 0,
              opacity: 0,
              rotate: exitDirection === "right" ? 15 : exitDirection === "left" ? -15 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            whileDrag={{ cursor: "grabbing" }}
            className="absolute inset-0 cursor-grab"
          >
            <Card className="h-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-lg">
              <CardContent className="h-full flex flex-col items-center justify-center p-8">
                {/* Avatar */}
                <div className="w-32 h-32 rounded-full overflow-hidden mb-6 shadow-md bg-neutral-100">
                  <img
                    src={getAvatarUrl(currentMember.name, currentMember.avatar_url)}
                    alt={currentMember.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name */}
                <h3 className="text-2xl font-heading font-bold text-foreground text-center">
                  {currentMember.name}
                </h3>

                {/* Swipe Hint */}
                <p className="text-sm text-muted-foreground mt-4">
                  ← Geser untuk absen | Hadir →
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-8 mt-6">
        <Button
          variant="outline"
          size="lg"
          className="w-16 h-16 rounded-full border-2 border-red-300 hover:bg-red-50 hover:border-red-500"
          onClick={() => handleSwipe("left")}
          disabled={isPending}
        >
          <X className="w-8 h-8 text-red-500" />
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-16 h-16 rounded-full border-2 border-emerald-300 hover:bg-emerald-50 hover:border-emerald-500"
          onClick={() => handleSwipe("right")}
          disabled={isPending}
        >
          <Check className="w-8 h-8 text-emerald-500" />
        </Button>
      </div>
    </div>
  );
}
