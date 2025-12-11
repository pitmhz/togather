"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Send, Copy, Check } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type MarketingBlastProps = {
  event: {
    title: string;
    topic: string | null;
    location: string | null;
    event_date: string;
  };
  eventUrl: string;
};

export function MarketingBlast({ event, eventUrl }: MarketingBlastProps) {
  const [caption, setCaption] = useState("");
  const [copied, setCopied] = useState(false);

  const eventDate = new Date(event.event_date);
  const formattedDate = format(eventDate, "EEEE, d MMMM yyyy", { locale: idLocale });
  const formattedTime = format(eventDate, "HH:mm");

  const defaultCaption = `🎉 *${event.title}*

📅 ${formattedDate}
⏰ ${formattedTime} WIB
📍 ${event.location || "TBA"}

${event.topic ? `📖 Tema: ${event.topic}\n\n` : ""}Yuk gabung dan dipersilakan share ke teman-teman!

🔗 Detail: ${eventUrl}

_Togather - Bertumbuh Bersama_`;

  const handleSendWhatsApp = () => {
    const text = caption || defaultCaption;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCopy = async () => {
    const text = caption || defaultCaption;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Caption tersalin!");
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error("Gagal menyalin");
    }
  };

  return (
    <Card className="border-2 border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-heading flex items-center gap-2">
          📣 Marketing Blast
        </CardTitle>
        <CardDescription>
          Broadcast ke grup WhatsApp untuk Komsel Gabungan
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="caption">Caption (Edit sesuai kebutuhan)</Label>
          <Textarea
            id="caption"
            placeholder="Paste caption dari pusat atau edit default..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={8}
            className="text-sm"
          />
          {!caption && (
            <p className="text-xs text-muted-foreground">
              💡 Kosongkan untuk menggunakan template default
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleSendWhatsApp}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Send className="w-4 h-4 mr-2" />
            Kirim ke WhatsApp
          </Button>
          <Button
            variant="outline"
            onClick={handleCopy}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
