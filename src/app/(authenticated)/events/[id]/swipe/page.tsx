import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SwipeCards } from "./swipe-cards";

// Force dynamic rendering
export const dynamic = "force-dynamic";

type Member = {
  id: string;
  name: string;
  avatar_url: string | null;
};

type Attendance = {
  member_id: string;
  status: string;
};

export default async function SwipeAttendancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: eventId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Verify event ownership
  const { data: event } = await supabase
    .from("events")
    .select("id, title")
    .eq("id", eventId)
    .eq("user_id", user.id)
    .single();

  if (!event) {
    notFound();
  }

  // Fetch all members
  const { data: membersData } = await supabase
    .from("members")
    .select("id, name, avatar_url")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  const members: Member[] = membersData || [];

  // Fetch existing attendance for this event
  const { data: attendanceData } = await supabase
    .from("event_attendance")
    .select("member_id, status")
    .eq("event_id", eventId);

  const attendance: Attendance[] = attendanceData || [];

  // Filter: Only show members who are NOT marked as 'present'
  const presentMemberIds = new Set(
    attendance.filter((a) => a.status === "present").map((a) => a.member_id)
  );

  const pendingMembers = members.filter((m) => !presentMemberIds.has(m.id));

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 border-b border-border bg-white dark:bg-zinc-900">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/events/${eventId}`}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="font-heading font-semibold text-foreground">
            Mode Absensi Swipe
          </h1>
          <p className="text-xs text-muted-foreground">{event.title}</p>
        </div>
      </header>

      {/* Swipe Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <SwipeCards members={pendingMembers} eventId={eventId} />
      </div>
    </main>
  );
}
