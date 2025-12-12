"use client";

import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Cake, MessageCircle } from "lucide-react";
import { toast } from "sonner";

import { generateBirthdayWish, generateBirthdayWishRaw, isBirthdayThisMonth, getDaysUntilBirthday } from "@/lib/birthday-utils";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Member = {
  id: string;
  name: string;
  birth_date: string;
  gender: string | null;
  phone: string | null;
};

type BirthdayWidgetProps = {
  members: Member[];
};

export function BirthdayWidget({ members }: BirthdayWidgetProps) {
  // Filter members with birthdays this month
  const birthdayMembers = members
    .filter(m => m.birth_date && isBirthdayThisMonth(m.birth_date))
    .sort((a, b) => {
      const dayA = new Date(a.birth_date).getDate();
      const dayB = new Date(b.birth_date).getDate();
      return dayA - dayB;
    });

  if (birthdayMembers.length === 0) {
    return null;
  }

  const handleSendWish = (member: Member) => {
    const wishText = generateBirthdayWish(member);
    const rawText = generateBirthdayWishRaw(member);
    
    // Copy to clipboard
    navigator.clipboard.writeText(rawText);
    toast.success("Ucapan ulang tahun disalin!");
    
    // Open WhatsApp
    if (member.phone) {
      const cleanPhone = member.phone.replace(/\D/g, "");
      const waLink = `https://wa.me/${cleanPhone}?text=${wishText}`;
      window.open(waLink, "_blank");
    } else {
      const waLink = `https://wa.me/?text=${wishText}`;
      window.open(waLink, "_blank");
    }
  };

  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Cake className="w-4 h-4 text-pink-500" />
        <h2 className="text-sm font-medium text-[#9B9A97] uppercase tracking-wide">
          🎉 Ulang Tahun Bulan Ini
        </h2>
      </div>
      
      <Card className="border border-[#E3E3E3] bg-white">
        <CardContent className="p-4 space-y-3">
          {birthdayMembers.map((member) => {
            const birthDate = new Date(member.birth_date);
            const formattedDate = format(birthDate, "d MMM", { locale: idLocale });
            const daysUntil = getDaysUntilBirthday(member.birth_date);
            const isToday = daysUntil === 0;
            
            return (
              <div 
                key={member.id}
                className={`flex items-center gap-3 p-3 rounded-md ${
                  isToday ? "bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100" : "bg-[#F7F7F5]"
                }`}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                  isToday ? "bg-pink-500 text-white animate-pulse" : "bg-[#E3E3E3] text-[#9B9A97]"
                }`}>
                  🎂
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${isToday ? "text-pink-700" : "text-[#37352F]"}`}>
                    {member.name}
                  </p>
                  <p className={`text-xs ${isToday ? "text-pink-500" : "text-[#9B9A97]"}`}>
                    {isToday ? "🎉 HARI INI!" : formattedDate}
                    {!isToday && daysUntil <= 7 && ` (H-${daysUntil})`}
                  </p>
                </div>
                
                {/* Send Wish Button */}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleSendWish(member)}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </section>
  );
}
