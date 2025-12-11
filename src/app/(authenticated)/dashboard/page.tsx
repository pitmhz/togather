import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Users, CalendarDays, MapPin, User } from "lucide-react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      <Badge variant="secondary" className="text-xs">
        Draft
      </Badge>
    );
  }

  if (filledRoles < totalRoles) {
    return (
      <Badge variant="destructive" className="text-xs bg-amber-500 hover:bg-amber-600">
        Butuh Petugas
      </Badge>
    );
  }

  return (
    <Badge className="text-xs bg-emerald-500 hover:bg-emerald-600">
      Siap Melayani
    </Badge>
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

  // Fetch events with role counts
  const { data: events } = await supabase
    .from("events")
    .select("id, title, topic, event_date, location, event_roles(is_filled)")
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
        <Link
          href="/profile"
          className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
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

        {/* Events List */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Jadwal Komsel
          </h2>

          {events && events.length > 0 ? (
            <div className="space-y-3">
              {events.map((event: EventWithRoles) => (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <Card className="border-border hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Date Badge */}
                      <div className="flex-shrink-0 w-12 h-12 bg-indigo-50 dark:bg-indigo-950 rounded-lg flex flex-col items-center justify-center">
                        <span className="text-xs font-medium text-indigo-600 uppercase">
                          {format(new Date(event.event_date), "EEE", { locale: idLocale })}
                        </span>
                        <span className="text-lg font-bold text-indigo-600">
                          {format(new Date(event.event_date), "d")}
                        </span>
                      </div>

                      {/* Event Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground truncate">
                            {event.title}
                          </h3>
                          {getStatusBadge(event.event_roles || [])}
                        </div>
                        {event.topic && (
                          <p className="text-sm text-muted-foreground truncate">
                            {event.topic}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
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
    </main>
  );
}
