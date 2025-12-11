"use client";

import { useRouter } from "next/navigation";
import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";

type Event = {
  id: string;
  title: string;
  topic: string | null;
  location: string | null;
  event_type: string;
};

export function DuplicateButton({ event }: { event: Event }) {
  const router = useRouter();

  const handleDuplicate = () => {
    // Store event data in sessionStorage and redirect to new event page
    const duplicateData = {
      title: event.title,
      topic: event.topic,
      location: event.location,
      event_type: event.event_type || "regular",
    };
    sessionStorage.setItem("duplicateEvent", JSON.stringify(duplicateData));
    router.push("/events/new?duplicate=true");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleDuplicate();
      }}
      className="h-8 w-8 text-muted-foreground hover:text-foreground"
      title="Duplikasi event"
    >
      <Copy className="w-4 h-4" />
    </Button>
  );
}
