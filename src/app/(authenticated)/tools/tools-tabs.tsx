"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dices, MessageCircleHeart } from "lucide-react";

import { SpinWheel } from "./spin-wheel";
import { DeepTalkCards } from "./deep-talk-cards";

type Attendee = {
  id: string;
  name: string;
};

type ToolsTabsProps = {
  attendees: Attendee[];
};

export function ToolsTabs({ attendees }: ToolsTabsProps) {
  return (
    <Tabs defaultValue="wheel" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="wheel" className="flex items-center gap-2">
          <Dices className="w-4 h-4" />
          Roda Undian
        </TabsTrigger>
        <TabsTrigger value="cards" className="flex items-center gap-2">
          <MessageCircleHeart className="w-4 h-4" />
          Kartu Sharing
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="wheel" className="mt-0">
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/50 dark:via-purple-950/50 dark:to-pink-950/50 rounded-2xl border border-border">
          <SpinWheel attendees={attendees} />
        </div>
      </TabsContent>
      
      <TabsContent value="cards" className="mt-0">
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-950/50 dark:via-orange-950/50 dark:to-red-950/50 rounded-2xl border border-border">
          <DeepTalkCards />
        </div>
      </TabsContent>
    </Tabs>
  );
}
