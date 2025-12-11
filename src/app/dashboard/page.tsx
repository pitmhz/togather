import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { LogOut, Users, CalendarDays, MapPin } from "lucide-react";
import Link from "next/link";

import { signOut } from "./actions";
import { CreateEventDialog } from "./create-event-dialog";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Event = {
  id: string;
  title: string;
  topic: string | null;
  event_date: string;
  location: string | null;
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch events for current user, sorted by date
  const { data: events } = await supabase
    .from("events")
    .select("id, title, topic, event_date, location")
    .eq("user_id", user.id)
    .gte("event_date", new Date().toISOString())
    .order("event_date", { ascending: true });

  const userEmail = user.email || "User";
  const displayName = userEmail.split("@")[0];

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-950 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="font-heading font-semibold text-lg text-foreground">
            Togather
          </span>
        </div>
        <form action={signOut}>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <LogOut className="w-4 h-4 mr-1" />
            Keluar
          </Button>
        </form>
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

        {/* Events List */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Jadwal Komsel
          </h2>

          {events && events.length > 0 ? (
            <div className="space-y-3">
              {events.map((event: Event) => (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <Card className="border-border hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Date Badge */}
                      <div className="flex-shrink-0 w-12 h-12 bg-indigo-50 dark:bg-indigo-950 rounded-lg flex flex-col items-center justify-center">
                        <span className="text-xs font-medium text-indigo-600 uppercase">
                          {format(new Date(event.event_date), "EEE")}
                        </span>
                        <span className="text-lg font-bold text-indigo-600">
                          {format(new Date(event.event_date), "d")}
                        </span>
                      </div>

                      {/* Event Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">
                          {event.title}
                        </h3>
                        {event.topic && (
                          <p className="text-sm text-muted-foreground truncate mt-0.5">
                            {event.topic}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" />
                            {format(new Date(event.event_date), "h:mm a")}
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
              ))}
            </div>
          ) : (
            /* Empty State */
            <Card className="border-dashed border-2 border-border">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                  <CalendarDays className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-foreground mb-1">
                  Belum ada jadwal
                </h3>
                <p className="text-sm text-muted-foreground">
                  Yuk buat jadwal komsel pertamamu!
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </div>

      {/* Floating Action Button */}
      <CreateEventDialog />
    </main>
  );
}
