"use client";

import { useState } from "react";
import { Camera, Shuffle } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { getAvatarUrl } from "@/lib/utils";

type AvatarSelectorProps = {
  currentSeed?: string;
  userName?: string;
  onSeedChange: (seed: string, url: string) => void;
  size?: "sm" | "md" | "lg";
  showHeader?: boolean;
  showPresets?: boolean;
};

function generateRandomSeed(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Preset seeds for avatar options
const PRESET_SEEDS = [
  "avatar_1", "avatar_2", "avatar_3",
  "avatar_4", "avatar_5", "avatar_6",
  "avatar_7", "avatar_8", "avatar_9",
];

export function AvatarSelector({
  currentSeed,
  userName = "",
  onSeedChange,
  size = "md",
  showHeader = true,
  showPresets = true,
}: AvatarSelectorProps) {
  const [seed, setSeed] = useState(currentSeed || userName || generateRandomSeed());

  // Use userName as seed if provided, otherwise use random seed
  const effectiveSeed = userName || seed;
  const avatarUrl = getAvatarUrl(effectiveSeed);

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

  const handlePresetClick = (presetSeed: string) => {
    setSeed(presetSeed);
    onSeedChange(presetSeed, getAvatarUrl(presetSeed));
  };

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Header */}
      {showHeader && (
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground">Pilih Avatar</h2>
          <p className="text-sm text-muted-foreground">Tap untuk acak atau pilih dari preset</p>
        </div>
      )}

      {/* Main Avatar with Gradient + Camera Badge */}
      <motion.div
        className="relative cursor-pointer group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleShuffle}
      >
        {/* Soft Background Circle */}
        <div className={`${sizeClasses[size]} rounded-full bg-neutral-100 flex items-center justify-center shadow-sm overflow-hidden ring-4 ring-neutral-50`}>
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

      {/* Preset Grid */}
      {showPresets && (
        <div className="grid grid-cols-3 gap-3">
          {PRESET_SEEDS.map((presetSeed) => (
            <motion.button
              key={presetSeed}
              type="button"
              onClick={() => handlePresetClick(presetSeed)}
              className={`w-14 h-14 rounded-full overflow-hidden bg-neutral-100 transition-all ${seed === presetSeed ? "ring-2 ring-black ring-offset-2" : "hover:ring-2 hover:ring-neutral-300"
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={getAvatarUrl(presetSeed)}
                alt={`Preset ${presetSeed}`}
                className="w-full h-full object-cover"
              />
            </motion.button>
          ))}
        </div>
      )}

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

// Export helper for getting URL from seed (uses utils version)
export { generateRandomSeed };
export { getAvatarUrl } from "@/lib/utils";
