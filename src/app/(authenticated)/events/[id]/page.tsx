import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { ArrowLeft, Users, ClipboardList, Megaphone, Rocket, Crown } from "lucide-react";

import { isAdminAsync } from "@/lib/user-role";
import Link from "next/link";

import { AddRoleDialog } from "./add-role-dialog";
import { RoleItem } from "./role-item";
import { AttendanceList } from "./attendance-list";
import { MarketingBlast } from "./marketing-blast";
import { EventInfoCard } from "./event-info-card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HolyAccent } from "@/components/holy-accent";

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

  // Check if user is admin (database-based check)
  const isAdmin = await isAdminAsync(user.email);

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

  // Fetch members for combobox (RLS handles visibility)
  const { data: membersData } = await supabase
    .from("members")
    .select("id, name, status, unavailable_reason, unavailable_until")
    .order("name", { ascending: true });
  
  const members = membersData || [];

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
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      <HolyAccent type="bible" />
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-[#E3E3E3] bg-white">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-sm font-medium text-[#37352F]">
          Detail Event
        </h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </header>

      {/* Content */}
      <div className="flex-1 p-4 pb-24 bg-[#FBFBFA]">
        {/* Event Info Card (Clickable -> Opens Menu) */}
        <EventInfoCard
          event={event}
          formattedDate={formattedDate}
          isAdmin={isAdmin}
          shareData={{
            title: event.title,
            topic: event.topic,
            date: formattedDate,
            location: event.location,
          }}
          reportData={{
            title: event.title,
            date: formattedDate,
            members: members,
            roles: roles,
            attendance: attendance,
          }}
        />

        {/* Conditional: Roles Section (Regular only) */}
        {event.event_type !== "gabungan" && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Daftar Petugas
            </h2>
          </div>

          {/* Virtual CG Leader Card (Pinned, Read-only) */}
          <div className="mb-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                  <Crown className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">CG Leader</p>
                  <p className="font-medium text-foreground">{leaderName}</p>
                </div>
              </div>
              <Badge className="bg-indigo-600 text-white text-xs">Tetap</Badge>
            </div>
          </div>

          {/* Roles List (Filter out CG Leader if exists) */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {roles && roles.length > 0 ? (
              roles
                .filter((role: Role) => role.role_name.toLowerCase() !== "cg leader")
                .map((role: Role) => (
                  <RoleItem key={role.id} role={role} eventId={id} members={members} isAdmin={isAdmin} />
                ))
            ) : (
              <div className="col-span-2 text-center py-4 text-muted-foreground text-sm">
                Tidak ada posisi petugas lainnya.
              </div>
            )}
          </div>
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
            isAdmin={isAdmin}
          />
        </section>
      </div>
    </main>
  );
}
