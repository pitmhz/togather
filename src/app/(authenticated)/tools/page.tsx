import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sparkles, Zap, CalendarX } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

import { ToolsTabs } from "./tools-tabs";
import { SeedButton } from "./seed-button";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BackgroundPattern } from "@/components/ui/background-pattern";

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

  // Fetch Member Role for Advanced Zone access
  const { data: memberRole } = await supabase
    .from("members")
    .select("role")
    .eq("email", user.email)
    .single();

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
    <main className="min-h-screen flex flex-col pb-24 bg-[#FBFBFA] relative overflow-hidden">
      <BackgroundPattern variant="bible" />
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
        {/* Advanced Zone - Safe Bunker (Admins Only) */}
        {memberRole?.role === 'admin' && (
          <div className="pt-6 border-t border-gray-200 dark:border-zinc-800">
             <div className="flex items-center gap-2 mb-3">
               <div className="h-px flex-1 bg-amber-200"></div>
               <h2 className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                 ⚠️ Advanced Zone (Dev Only)
               </h2>
               <div className="h-px flex-1 bg-amber-200"></div>
             </div>
             
             <Card className="border-dashed border-2 border-amber-200 bg-amber-50/30 dark:bg-amber-950/10">
               <CardContent className="p-4 space-y-4">
                 
                 {/* Feature 1: Data Seeder */}
                 <div className="flex items-center justify-between gap-4">
                   <div>
                     <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-500 flex items-center gap-2">
                       <Sparkles className="w-3 h-3" />
                       Random Data Seeder
                     </h3>
                     <p className="text-xs text-amber-700/70 dark:text-amber-600">
                       Isi data member kosong dengan data dummy acak.
                       <br/>Use responsibly.
                     </p>
                   </div>
                   <SeedButton 
                    variant="outline" 
                    className="border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-800 h-8 text-xs"
                   />
                 </div>

                 <div className="h-px bg-amber-200/50 w-full" />

                 {/* Feature 2: Cache Reset (Placeholder) */}
                 <div className="flex items-center justify-between gap-4 opacity-50">
                    <div>
                     <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-500">
                       Reset App Cache
                     </h3>
                     <p className="text-xs text-amber-700/70 dark:text-amber-600">
                       Clear server actions cache manually.
                     </p>
                   </div>
                   <Button variant="outline" size="sm" disabled className="h-8 text-xs">
                     Coming Soon
                   </Button>
                 </div>

               </CardContent>
             </Card>
          </div>
        )}
      </div>
    </main>
  );
}

