"use client";

import { useState } from "react";
import { 
  ExternalLink, 
  Clock, 
  Target, 
  Palette, 
  Brain, 
  Scale,
  ChevronRight
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

type Provider = {
  name: string;
  url: string;
  icon: React.ReactNode;
  badges: string[];
  time: string;
  accuracy: number;
  difficulty: string;
  recommended?: boolean;
};

const providers: Provider[] = [
  {
    name: "16Personalities",
    url: "https://www.16personalities.com/id/tes-kepribadian",
    icon: <Palette className="w-5 h-5 text-purple-500" />,
    badges: ["Bahasa Indonesia", "Visual Bagus"],
    time: "10 Menit",
    accuracy: 3,
    difficulty: "Mudah",
    recommended: true,
  },
  {
    name: "Sakinorva",
    url: "https://sakinorva.net/functions",
    icon: <Brain className="w-5 h-5 text-blue-500" />,
    badges: ["English Only", "Analisa Mendalam"],
    time: "25 Menit",
    accuracy: 5,
    difficulty: "Rumit",
  },
  {
    name: "Truity",
    url: "https://www.truity.com/test/type-finder-personality-test-new",
    icon: <Scale className="w-5 h-5 text-green-500" />,
    badges: ["English", "Standar Psikologi"],
    time: "15 Menit",
    accuracy: 4,
    difficulty: "Sedang",
  },
];

function renderStars(count: number) {
  return "⭐".repeat(count);
}

export function MbtiPicker() {
  const [open, setOpen] = useState(false);

  const handleSelect = (url: string) => {
    window.open(url, "_blank");
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 hover:underline">
          <ExternalLink className="w-3 h-3" />
          Belum tau MBTI? Tes di sini
          <ChevronRight className="w-3 h-3" />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-lg font-semibold text-[#37352F]">
            🧪 Pilih Penyedia Tes
          </DrawerTitle>
          <DrawerDescription>
            Pilih situs tes yang sesuai dengan waktu dan preferensi bahasamu.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-4 space-y-3">
          {providers.map((provider) => (
            <button
              key={provider.name}
              onClick={() => handleSelect(provider.url)}
              className="w-full text-left p-4 rounded-lg border border-[#E3E3E3] bg-white hover:bg-[#F7F7F5] transition-colors"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-2">
                {provider.icon}
                <span className="font-medium text-[#37352F] flex-1">
                  {provider.name}
                </span>
                {provider.recommended && (
                  <Badge className="bg-purple-100 text-purple-700 text-[10px] border-0">
                    Rekomendasi
                  </Badge>
                )}
                <ExternalLink className="w-4 h-4 text-[#9B9A97]" />
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {provider.badges.map((badge) => (
                  <Badge 
                    key={badge} 
                    variant="secondary"
                    className="text-[10px] bg-[#F7F7F5] text-[#787774] border-0"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>

              {/* Stats Bar */}
              <div className="flex items-center gap-4 text-xs text-[#9B9A97]">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{provider.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  <span>{renderStars(provider.accuracy)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                    provider.difficulty === "Mudah" 
                      ? "bg-green-100 text-green-700" 
                      : provider.difficulty === "Sedang"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {provider.difficulty}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <DrawerFooter className="pt-0">
          <DrawerClose asChild>
            <Button variant="outline">Batal</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
