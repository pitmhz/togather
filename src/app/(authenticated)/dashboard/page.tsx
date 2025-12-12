import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { format, differenceInDays, isToday } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { CalendarDays, MapPin, User, History } from "lucide-react";
import Link from "next/link";

import { DailyVerse } from "@/components/daily-verse";
import { BackgroundPattern } from "@/components/ui/background-pattern";
import { BirthdayWidget } from "./birthday-widget";

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

function EventCard({ event, isPast = false, isSlider = false }: { event: EventWithRoles; isPast?: boolean; isSlider?: boolean }) {
  if (isSlider) {
    return (
      <Link href={`/events/${event.id}`} className="block h-full">
        <Card className="transition-colors h-full bg-white border border-[#E3E3E3] hover:bg-[#F7F7F5] cursor-pointer">
          <CardContent className="p-5 h-full flex flex-col relative">
            {/* Top: Date & Status */}
            <div className="flex justify-between items-start mb-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-md flex flex-col items-center justify-center bg-[#F7F7F5] border border-[#E3E3E3] relative">
                <span className="text-xs font-medium uppercase text-[#9B9A97]">
                  {format(new Date(event.event_date), "EEE", { locale: idLocale })}
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
                  {format(new Date(event.event_date), "EEEE, dd MMMM • HH:mm", { locale: idLocale })}
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
      <Card className={`border-border transition-colors ${
        isPast 
          ? "opacity-50 grayscale bg-zinc-50 dark:bg-zinc-900" 
          : "hover:border-indigo-300 dark:hover:border-indigo-800 cursor-pointer"
      }`}>
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 w-11 h-11 rounded-lg flex flex-col items-center justify-center ${
              isPast ? "bg-zinc-100 dark:bg-zinc-800" : "bg-indigo-50 dark:bg-indigo-950"
            }`}>
              <span className={`text-xs font-medium uppercase ${
                isPast ? "text-zinc-500" : "text-indigo-600"
              }`}>
                {format(new Date(event.event_date), "EEE", { locale: idLocale })}
              </span>
              <span className={`text-lg font-bold ${
                isPast ? "text-zinc-500" : "text-indigo-600"
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
  const displayName = userEmail.split("@")[0];

  return (
    <main className="min-h-screen flex flex-col bg-[#FBFBFA] relative overflow-hidden">
      <BackgroundPattern variant="dove" />
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-[#E3E3E3] bg-white">
        <div className="flex items-center gap-2">
          <div className="text-xl">🤝</div>
          <span className="font-heading font-semibold text-lg text-[#37352F]">
            {groupName}
          </span>
        </div>
        <Link
          href="/profile"
          className="w-8 h-8 bg-[#F7F7F5] rounded-full flex items-center justify-center text-[#9B9A97] hover:text-[#37352F] hover:bg-[#E3E3E3] transition-colors"
        >
          <User className="w-4 h-4" />
        </Link>
      </header>

      {/* Content */}
      <div className="flex-1 p-4 pb-24">
        {/* Welcome */}
        <section className="mb-6">
          <h1 className="text-2xl font-heading font-semibold text-foreground">
            Halo, {displayName}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Kelola jadwal komsel kamu
          </p>
        </section>

        {/* Daily Verse */}
        <section className="mb-6">
          <DailyVerse />
        </section>

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
                    <EventCard event={event} isSlider />
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
                <EventCard key={event.id} event={event} isPast />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
