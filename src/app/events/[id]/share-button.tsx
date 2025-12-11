"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type ShareButtonProps = {
  title: string;
  topic?: string | null;
  date: string;
  location?: string | null;
};

export function ShareButton({ title, topic, date, location }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // Build Indonesian share message
    let message = `Shalom! Yuk datang ke ${title}`;
    if (topic) {
      message += ` - ${topic}`;
    }
    message += `\n\n📅 ${date}`;
    if (location) {
      message += `\n📍 ${location}`;
    }
    message += `\n\nLihat detail & petugas di sini:\n${window.location.href}`;

    try {
      // Try native share first (mobile)
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: message,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(message);
        toast.success("Link tersalin ke clipboard!");
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // User cancelled share or error
      console.error("Failed to share:", err);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleShare}
      className="text-muted-foreground hover:text-foreground"
    >
      {copied ? (
        <Check className="w-5 h-5 text-green-600" />
      ) : (
        <Share2 className="w-5 h-5" />
      )}
    </Button>
  );
}
