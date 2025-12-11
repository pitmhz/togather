import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sparkles, Zap, CalendarX } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

import { ToolsTabs } from "./tools-tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default async function ToolsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get today's date at start of day for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fetch the latest UPCOMING or ACTIVE event (date >= today)
  const { data: upcomingEvent } = await supabase
    .from("events")
    .select("id, title, event_date")
    .eq("user_id", user.id)
    .gte("event_date", today.toISOString())
    .order("event_date", { ascending: true })
    .limit(1)
    .single();

  // Also fetch latest event (for tools that need attendees)
  const { data: latestEvent } = await supabase
    .from("events")
    .select("id, title")
    .eq("user_id", user.id)
    .order("event_date", { ascending: false })
    .limit(1)
    .single();

  let attendees: { id: string; name: string }[] = [];

  if (latestEvent) {
    // Fetch attendees who are present
    const { data: attendanceData } = await supabase
      .from("event_attendance")
      .select("member_id, members(id, name)")
      .eq("event_id", latestEvent.id)
      .eq("status", "present");

    if (attendanceData) {
      attendees = attendanceData
        .filter((a) => a.members)
        .map((a) => {
          const rawMember = Array.isArray(a.members) ? a.members[0] : a.members;
          const member = rawMember as any;
          return {
            id: member?.id || "unknown",
            name: member?.name || "Unknown Member",
          };
        });
    }
  }

  return (
    <main className="min-h-screen flex flex-col pb-24 bg-slate-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="p-4 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h1 className="text-lg font-heading font-semibold text-foreground">
            Live Tools
          </h1>
        </div>
        {latestEvent && (
          <p className="text-xs text-muted-foreground mt-1">
            Event: {latestEvent.title} • {attendees.length} hadir
          </p>
        )}
      </header>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
        {/* Swipe Attendance Card - Featured */}
        <Card className="border-2 border-indigo-200 dark:border-indigo-900 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-semibold text-foreground">
                  ⚡ Absensi Swipe
                </h3>
                {upcomingEvent ? (
                  <>
                    <p className="text-sm text-muted-foreground mt-1">
                      {upcomingEvent.title}
                    </p>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400">
                      {format(new Date(upcomingEvent.event_date), "EEEE, d MMM 'pukul' HH:mm", { locale: idLocale })}
                    </p>
                    <Button asChild className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white">
                      <Link href={`/events/${upcomingEvent.id}/swipe`}>
                        Mulai Swipe
                      </Link>
                    </Button>
                  </>
                ) : (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <CalendarX className="w-4 h-4" />
                      Tidak ada jadwal komsel aktif.
                    </p>
                    <Button disabled className="mt-3 opacity-50">
                      Mulai Swipe
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Other Tools */}
        <div className="pt-2">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Alat Interaktif
          </h2>
          <ToolsTabs attendees={attendees} />
        </div>
      </div>
    </main>
  );
}

