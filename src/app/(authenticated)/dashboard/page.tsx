import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { format, differenceInDays, isToday } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { CalendarDays, MapPin, User, History, Book } from "lucide-react";
import Link from "next/link";

import { DailyVerse } from "@/components/daily-verse";
import { BackgroundPattern } from "@/components/ui/background-pattern";
import { BirthdayWidget } from "./birthday-widget";
import { DashboardTools } from "@/components/dashboard-tools";
import { DashboardHero } from "@/components/dashboard-hero";
import { RefreshButton } from "@/components/refresh-button";
import { isAdminAsync } from "@/lib/user-role";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type EventWithRoles = {
  id: string;
  title: string;
  topic: string | null;
  event_date: string;
  location: string | null;
  event_roles: { is_filled: boolean }[];
};

function getStatusBadge(roles: { is_filled: boolean }[]) {
  const totalRoles = roles.length;
  const filledRoles = roles.filter((r) => r.is_filled).length;

  if (totalRoles === 0) {
    return (
      <Badge variant="secondary" className="text-xs bg-[#E3E3E3] text-[#787774] border-0 rounded-sm">
        Draft
      </Badge>
    );
  }

  if (filledRoles < totalRoles) {
    return (
      <Badge className="text-xs bg-[#FADEC9] text-[#D9730D] border-0 rounded-sm hover:bg-[#FADEC9]">
        Butuh Petugas
      </Badge>
    );
  }

  return (
    <Badge className="text-xs bg-[#DBEDDB] text-[#0F7B6C] border-0 rounded-sm hover:bg-[#DBEDDB]">
      Siap Melayani
    </Badge>
  );
}

function getCountdownBadge(eventDate: Date) {
  if (isToday(eventDate)) {
    return (
      <Badge className="text-[10px] px-2 py-0.5 bg-[#EB5757] text-white border-0 rounded-sm animate-pulse">
        HARI INI
      </Badge>
    );
  }

  const daysUntil = differenceInDays(eventDate, new Date());

  if (daysUntil > 0 && daysUntil <= 3) {
    return (
      <Badge className="text-[10px] px-2 py-0.5 bg-[#FADEC9] text-[#D9730D] border-0 rounded-sm">
        H-{daysUntil}
      </Badge>
    );
  }

  return null;
}

function EventCard({ event, isPast = false, isSlider = false, locale = idLocale }: { event: EventWithRoles; isPast?: boolean; isSlider?: boolean; locale?: any }) {
  if (isSlider) {
    return (
      <Link href={`/events/${event.id}`} className="block h-full">
        <Card className="transition-colors h-full bg-white border border-[#E3E3E3] hover:bg-[#F7F7F5] cursor-pointer">
          <CardContent className="p-5 h-full flex flex-col relative">
            {/* Top: Date & Status */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-shrink-0 w-14 h-14 rounded-md flex flex-col items-center justify-center bg-[#F7F7F5] border border-[#E3E3E3] relative">
                <span className="text-xs font-medium uppercase text-[#9B9A97]">
                  {format(new Date(event.event_date), "EEE", { locale })}
                </span>
                <span className="text-xl font-semibold text-[#37352F]">
                  {format(new Date(event.event_date), "d")}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                {getCountdownBadge(new Date(event.event_date))}
                {getStatusBadge(event.event_roles || [])}
              </div>
            </div>

            {/* Middle: Title & Topic */}
            <div className="flex-1 mb-4">
              <h3 className="text-lg font-bold text-foreground leading-tight mb-1">
                {event.title}
              </h3>
              {event.topic && (
                <p className="text-sm text-muted-foreground font-medium italic">
                  "{event.topic}"
                </p>
              )}
            </div>

            {/* Bottom: Logistics */}
            <div className="mt-auto pt-3 border-t border-black/5 dark:border-white/5 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-foreground/80">
                <CalendarDays className="w-4 h-4 text-indigo-500" />
                <span className="font-medium">
                  {format(new Date(event.event_date), "EEEE, dd MMMM • HH:mm", { locale })}
                </span>
              </div>
              {event.location && (
                <div className="flex items-center gap-2 text-sm text-foreground/80">
                  <MapPin className="w-4 h-4 text-indigo-500" />
                  <span className="font-medium truncate">
                    {event.location}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  // Fallback for non-slider (Past Events)
  return (
    <Link href={`/events/${event.id}`}>
      <Card className={`border-border transition-colors ${isPast
        ? "opacity-50 grayscale bg-zinc-50 dark:bg-zinc-900"
        : "hover:border-indigo-300 dark:hover:border-indigo-800 cursor-pointer"
        }`}>
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 w-11 h-11 rounded-lg flex flex-col items-center justify-center ${isPast ? "bg-zinc-100 dark:bg-zinc-800" : "bg-indigo-50 dark:bg-indigo-950"
              }`}>
              <span className={`text-xs font-medium uppercase ${isPast ? "text-zinc-500" : "text-indigo-600"
                }`}>
                {format(new Date(event.event_date), "EEE", { locale })}
              </span>
              <span className={`text-lg font-bold ${isPast ? "text-zinc-500" : "text-indigo-600"
                }`}>
                {format(new Date(event.event_date), "d")}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-foreground truncate text-sm">
                  {event.title}
                </h3>
              </div>
              {event.topic && (
                <p className="text-xs text-muted-foreground truncate mb-1">
                  {event.topic}
                </p>
              )}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" />
                  {format(new Date(event.event_date), "HH:mm")}
                </span>
                {event.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {event.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user's group (for MVP, just get the first group)
  const { data: groups } = await supabase
    .from("groups")
    .select("id, name")
    .limit(1);

  const userGroup = groups?.[0];
  const groupName = userGroup?.name || "Togather";

  // Fetch user profile for hero card
  const { data: userProfile } = await supabase
    .from("profiles")
    .select("full_name, birth_date, mbti")
    .eq("id", user.id)
    .single();

  const displayName = userProfile?.full_name || user.email?.split("@")[0] || "User";

  // Fetch ALL events (RLS handles visibility)
  const { data: allEvents } = await supabase
    .from("events")
    .select("id, title, topic, event_date, location, event_roles(is_filled)")
    .order("event_date", { ascending: true });

  // Separate into upcoming and past based on current date
  const now = new Date();
  const upcomingEvents: EventWithRoles[] = [];
  const pastEvents: EventWithRoles[] = [];

  (allEvents || []).forEach((event: EventWithRoles) => {
    if (new Date(event.event_date) >= now) {
      upcomingEvents.push(event);
    } else {
      pastEvents.push(event);
    }
  });

  // Sort past events in reverse order (most recent first)
  pastEvents.reverse();

  // Fetch members with birthdays
  const { data: members } = await supabase
    .from("members")
    .select("id, name, birth_date, gender, phone")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .not("birth_date", "is", null);

  const birthdayMembers = (members || []).map(m => ({
    id: m.id,
    name: m.name,
    birth_date: m.birth_date as string,
    gender: m.gender as string | null,
    phone: m.phone as string | null
  }));

  const userEmail = user.email || "User";

  // Fetch locale (MVP: using first membership found)
  const { data: currentMember } = await supabase
    .from("members")
    .select("locale")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  // Get locale object or default to id
  const userLocaleCode = currentMember?.locale || "id-ID";
  // Helper to get actual locale object for server-side date-fns
  const localeMap: Record<string, any> = { "id-ID": idLocale, "en-US": require("date-fns/locale").enUS, "en-AU": require("date-fns/locale").enAU };
  const currentLocale = localeMap[userLocaleCode] || idLocale;

  // Check if user is admin
  const isAdmin = await isAdminAsync(user.email);

  // Fetch latest event with benediction for Devotional Card
  const { data: devotionalEvent } = await supabase
    .from("events")
    .select("id, title, benediction, event_date")
    .not("benediction", "is", null)
    .order("event_date", { ascending: false })
    .limit(1)
    .single();

  return (
    <main className="min-h-screen flex flex-col bg-[#FBFBFA] relative overflow-hidden">
      <BackgroundPattern variant="dove" />

      {/* Content */}
      <div className="flex-1 p-4 pb-24">
        {/* 1. Member Pass (Hero) */}
        <section className="mb-6">
          <DashboardHero
            userName={displayName}
            fullName={userProfile?.full_name}
            birthDate={userProfile?.birth_date}
            mbti={userProfile?.mbti}
            isAdmin={isAdmin}
            attendanceHistory={[
              { date: new Date(2024, 11, 8), day: "Min", status: "present" },
              { date: new Date(2024, 11, 1), day: "Min", status: "present" },
              { date: new Date(2024, 10, 24), day: "Min", status: "permission" },
              { date: new Date(2024, 10, 17), day: "Min", status: "present" },
              { date: new Date(2024, 10, 10), day: "Min", status: "absent" },
            ]}
          />
        </section>

        {/* 2. Ayat of the Day */}
        <section className="mb-6">
          <DailyVerse />
        </section>

        {/* Devotional / Benediction Card */}
        {devotionalEvent?.benediction && (
          <section className="mb-6">
            <Card className="border-0 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-200/30 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <CardContent className="p-4 relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-purple-100 rounded-lg">
                    <Book className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-purple-900">
                    🍞 Renungan Minggu Ini
                  </h3>
                </div>
                <blockquote className="text-sm text-purple-800 italic leading-relaxed mb-3 border-l-2 border-purple-300 pl-3">
                  "{devotionalEvent.benediction}"
                </blockquote>
                <Link
                  href={`/events/${devotionalEvent.id}`}
                  className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                >
                  Dari acara: {devotionalEvent.title} →
                </Link>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Birthday Widget */}
        <BirthdayWidget members={birthdayMembers} />

        {/* Upcoming Events Carousel */}
        <section className="mb-8">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Jadwal Komsel
          </h2>

          {upcomingEvents.length > 0 ? (
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full overflow-visible py-2"
            >
              <CarouselContent className="-ml-4">
                {upcomingEvents.map((event) => (
                  <CarouselItem key={event.id} className="pl-4 basis-[90%]">
                    <EventCard event={event} isSlider locale={currentLocale} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {upcomingEvents.length > 1 && (
                <>
                  <CarouselPrevious className="hidden md:flex -left-3" />
                  <CarouselNext className="hidden md:flex -right-3" />
                </>
              )}
            </Carousel>
          ) : (
            /* Empty State */
            <Card className="border-dashed border-2 border-border rounded-lg">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-3 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                  <CalendarDays className="w-7 h-7 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-foreground mb-1 text-sm">
                  Belum ada jadwal
                </h3>
                <p className="text-xs text-muted-foreground">
                  Yuk buat jadwal komsel pertamamu!
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* 4. Alat Bantu Komsel */}
        <DashboardTools isAdmin={isAdmin} />
        {/* Past Events (Riwayat) - Compact Vertical List */}
        {pastEvents.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Riwayat
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} isPast locale={currentLocale} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
