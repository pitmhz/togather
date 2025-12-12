import * as React from "react";
import Image from "next/image";
import { cn, getAvatarUrl } from "@/lib/utils";

/**
 * ProfileAvatar - A circular avatar with DiceBear image
 * Uses the global getAvatarUrl for consistent avatars across the app
 */
type ProfileAvatarProps = {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  isAdmin?: boolean;
};

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

// Consistent color palette for avatars (soft, muted colors) - fallback
const avatarColors = [
  "bg-rose-100 text-rose-600",
  "bg-orange-100 text-orange-600",
  "bg-amber-100 text-amber-600",
  "bg-emerald-100 text-emerald-600",
  "bg-teal-100 text-teal-600",
  "bg-cyan-100 text-cyan-600",
  "bg-blue-100 text-blue-600",
  "bg-indigo-100 text-indigo-600",
  "bg-violet-100 text-violet-600",
  "bg-purple-100 text-purple-600",
  "bg-pink-100 text-pink-600",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index];
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
};

const imageSizes = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
};

function ProfileAvatar({ name, size = "lg", className, isAdmin = false }: ProfileAvatarProps) {
  const avatarUrl = getAvatarUrl(name);
  const imageSize = imageSizes[size];

  return (
    <div
      className={cn(
        "rounded-full overflow-hidden flex-shrink-0",
        sizeClasses[size],
        isAdmin && "ring-2 ring-blue-300 ring-offset-2",
        className
      )}
    >
      <Image
        src={avatarUrl}
        alt={name}
        width={imageSize}
        height={imageSize}
        className="w-full h-full object-cover"
        unoptimized
      />
    </div>
  );
}

export { ProfileAvatar, getInitials, getAvatarColor };

