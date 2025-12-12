"use client";

import { BookOpen, Bird, Cross, HeartHandshake } from "lucide-react";

type PatternVariant = "dove" | "bible" | "cross" | "prayer";

type BackgroundPatternProps = {
  variant: PatternVariant;
};

const iconMap = {
  dove: Bird,
  bible: BookOpen,
  cross: Cross,
  prayer: HeartHandshake,
};

// Generate consistent rotations for organic feel
const rotations = [
  "rotate-0", "rotate-12", "-rotate-12", "rotate-6", "-rotate-6",
  "rotate-3", "-rotate-3", "rotate-[15deg]", "-rotate-[15deg]", "rotate-0"
];

export function BackgroundPattern({ variant }: BackgroundPatternProps) {
  const Icon = iconMap[variant];
  
  // Create grid of icons
  const iconCount = 24;
  
  return (
    <div 
      className="absolute bottom-0 left-0 right-0 h-[35vh] -z-10 overflow-hidden pointer-events-none"
      style={{ 
        maskImage: 'linear-gradient(to top, black 20%, transparent)',
        WebkitMaskImage: 'linear-gradient(to top, black 20%, transparent)'
      }}
      aria-hidden="true"
    >
      <div className="grid grid-cols-4 gap-8 p-4">
        {Array.from({ length: iconCount }).map((_, i) => (
          <div 
            key={i} 
            className={`flex items-center justify-center ${rotations[i % rotations.length]}`}
          >
            <Icon 
              className="w-8 h-8 text-neutral-900 opacity-[0.03]" 
              strokeWidth={1}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
