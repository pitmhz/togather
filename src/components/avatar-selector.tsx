"use client";

import { useState } from "react";
import { Camera, Shuffle } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

type AvatarSelectorProps = {
  currentSeed?: string;
  onSeedChange: (seed: string, url: string) => void;
  size?: "sm" | "md" | "lg";
  showHeader?: boolean;
};

function generateRandomSeed(): string {
  return Math.random().toString(36).substring(2, 15);
}

function getAvatarUrl(seed: string): string {
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${seed}&backgroundColor=transparent`;
}

export function AvatarSelector({
  currentSeed,
  onSeedChange,
  size = "md",
  showHeader = true
}: AvatarSelectorProps) {
  const [seed, setSeed] = useState(currentSeed || generateRandomSeed());

  const avatarUrl = getAvatarUrl(seed);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32"
  };

  const handleShuffle = () => {
    const newSeed = generateRandomSeed();
    setSeed(newSeed);
    onSeedChange(newSeed, getAvatarUrl(newSeed));
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Header */}
      {showHeader && (
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground">Your Profile</h2>
          <p className="text-sm text-muted-foreground">Introduce yourself to others</p>
        </div>
      )}

      {/* Avatar with Gradient + Camera Badge */}
      <motion.div
        className="relative cursor-pointer group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleShuffle}
      >
        {/* Gradient Background Circle */}
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-tr from-purple-100 to-blue-100 flex items-center justify-center shadow-sm overflow-hidden`}>
          <img
            src={avatarUrl}
            alt="Avatar preview"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Camera Badge */}
        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
          <Camera className="w-4 h-4 text-white" />
        </div>
      </motion.div>

      {/* Shuffle Button */}
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={handleShuffle}
        className="gap-2 rounded-full"
      >
        <Shuffle className="w-4 h-4" />
        Acak Avatar
      </Button>
    </div>
  );
}

// Export helper for getting URL from seed
export { getAvatarUrl, generateRandomSeed };
