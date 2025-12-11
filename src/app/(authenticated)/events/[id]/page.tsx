import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { ArrowLeft, CalendarDays, MapPin, Users, ClipboardList, Megaphone } from "lucide-react";
import Link from "next/link";

import { ShareButton } from "./share-button";
import { AddRoleDialog } from "./add-role-dialog";
import { RoleItem } from "./role-item";
import { AttendanceList } from "./attendance-list";
import { CopyReportButton } from "./copy-report-button";
import { MarketingBlast } from "./marketing-blast";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// STRICT: Force dynamic rendering - disable all caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Role = {
  id: string;
  role_name: string;
  assignee_name: string | null;
  member_id?: string | null;
  is_filled: boolean;
};

type Member = {
  id: string;
  name: string;
};

type Attendance = {
  member_id: string;
  status: "present" | "absent";
};

// Next.js 15: params is a Promise
export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // STRICT: Await params (Next.js 15 breaking change)
  const { id } = await params;

  console.log("[EventDetailPage] Starting render for event ID:", id);

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log("[EventDetailPage] No user, redirecting to login");
    redirect("/login");
  }

  console.log("[EventDetailPage] User ID:", user.id);

  // Fetch event
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (eventError) {
    console.error("[EventDetailPage] Event Error:", eventError);
  }

  if (!event) {
    console.log("[EventDetailPage] Event not found, showing 404");
    notFound();
  }

  console.log("[EventDetailPage] Event found:", event.title);

  // ROBUST: Fresh query for roles with fallback
  const { data: rolesData, error: rolesError } = await supabase
    .from("event_roles")
    .select("*")
    .eq("event_id", id);

  // Debug logging
  console.log("[EventDetailPage] Roles Query for event_id:", id);
  console.log("[EventDetailPage] Roles Data:", JSON.stringify(rolesData));
  
  if (rolesError) {
    console.error("[EventDetailPage] Roles Error:", rolesError);
  }

  // FORCE FALLBACK: If data is null, use empty array
  const roles = rolesData || [];

  // Fetch members for combobox
  const { data: membersData } = await supabase
    .from("members")
    .select("id, name")
    .eq("user_id", user.id)
    .order("name", { ascending: true });
  
  const members: Member[] = membersData || [];

  // Fetch attendance records
  const { data: attendanceData } = await supabase
    .from("event_attendance")
    .select("member_id, status")
    .eq("event_id", id);
  
  const attendance: Attendance[] = (attendanceData || []) as Attendance[];

  // Fetch leader profile for coach report
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const leaderName = profile?.full_name || user.email?.split("@")[0] || "Leader";
  const eventDate = new Date(event.event_date);
  const formattedDate = format(eventDate, "EEEE, d MMMM yyyy 'pukul' HH:mm", { locale: idLocale });

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <ShareButton 
          title={event.title}
          topic={event.topic}
          date={formattedDate}
          location={event.location}
        />
      </header>

      {/* Content */}
      <div className="flex-1 p-4 pb-24">
        {/* Event Info Card */}
        <Card className="relative overflow-hidden border-2 border-indigo-200 dark:border-indigo-900 mb-6">
          {/* Gradient accent */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
          <CardContent className="pt-6 pb-4">
            <h1 className="text-xl font-heading font-semibold text-foreground mb-2">
              {event.title}
            </h1>
            {event.topic && (
              <p className="text-muted-foreground text-sm mb-4">
                {event.topic}
              </p>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-indigo-600" />
                <span>
                  {format(eventDate, "EEEE, d MMM yyyy")} at{" "}
                  {format(eventDate, "h:mm a")}
                </span>
              </div>
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
            {/* Maps Link Button */}
            {event.maps_link && (
              <a
                href={event.maps_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors"
              >
                📍 Buka Peta
              </a>
            )}
          </CardContent>
        </Card>

        {/* Conditional: Roles Section (Regular only) */}
        {event.event_type !== "gabungan" && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Daftar Petugas
            </h2>
          </div>

          {/* Roles List */}
          <div className="space-y-2 mb-4">
            {roles && roles.length > 0 ? (
              roles.map((role: Role) => (
                <RoleItem key={role.id} role={role} eventId={id} members={members} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Belum ada petugas. Tambahkan posisi baru di bawah!
              </div>
            )}
          </div>

          {/* Add Role Button */}
          <AddRoleDialog eventId={id} />
        </section>
        )}

        {/* Conditional: Marketing Blast (Gabungan only) */}
        {event.event_type === "gabungan" && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Megaphone className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Marketing
            </h2>
          </div>
          <MarketingBlast
            event={event}
            eventUrl={typeof window !== "undefined" ? window.location.href : `https://togather.vercel.app/events/${id}`}
          />
        </section>
        )}

        {/* Attendance Section */}
        <section className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Absensi
            </h2>
          </div>

          <AttendanceList
            eventId={id}
            members={members}
            attendance={attendance}
          />

          {/* Copy Report Button */}
          <div className="mt-4">
            <CopyReportButton
              event={event}
              leaderName={leaderName}
              members={members}
              attendance={attendance}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
