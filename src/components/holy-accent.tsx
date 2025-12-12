"use client";

import { BookOpen, Bird, Cross, HeartHandshake } from "lucide-react";

type HolyAccentType = "bible" | "dove" | "cross" | "prayer";

type HolyAccentProps = {
  type: HolyAccentType;
  position?: "bottom-right" | "top-left" | "bottom-left" | "top-right";
};

const iconMap = {
  bible: BookOpen,
  dove: Bird,
  cross: Cross,
  prayer: HeartHandshake,
};

const positionMap = {
  "bottom-right": "bottom-[-40px] right-[-40px]",
  "top-left": "top-[-40px] left-[-40px]",
  "bottom-left": "bottom-[-40px] left-[-40px]",
  "top-right": "top-[-40px] right-[-40px]",
};

export function HolyAccent({ type, position = "bottom-right" }: HolyAccentProps) {
  const Icon = iconMap[type];
  
  return (
    <div 
      className={`fixed ${positionMap[position]} z-0 pointer-events-none`}
      aria-hidden="true"
    >
      <Icon 
        className="w-64 h-64 text-[#37352F] opacity-[0.03]" 
        strokeWidth={0.5}
      />
    </div>
  );
}
