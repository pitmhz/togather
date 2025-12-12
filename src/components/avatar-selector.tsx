"use client";

import { useState } from "react";
import { Shuffle } from "lucide-react";

import { Button } from "@/components/ui/button";

type AvatarSelectorProps = {
  currentSeed?: string;
  onSeedChange: (seed: string, url: string) => void;
  size?: "sm" | "md" | "lg";
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
  size = "md"
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
    <div className="flex flex-col items-center gap-3">
      {/* Avatar Preview */}
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-[#F7F7F5] border-2 border-[#E3E3E3]`}>
        <img 
          src={avatarUrl} 
          alt="Avatar preview" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Shuffle Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleShuffle}
        className="gap-2"
      >
        <Shuffle className="w-4 h-4" />
        Acak Avatar
      </Button>
    </div>
  );
}

// Export helper for getting URL from seed
export { getAvatarUrl, generateRandomSeed };
