import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";

import { ToolsTabs } from "./tools-tabs";

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

  // Fetch the latest event for this user
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
          const member = Array.isArray(a.members) ? a.members[0] : a.members;
          return {
            id: (member as { id: string; name: string }).id,
            name: (member as { id: string; name: string }).name,
          };
        });
    }
  }

  return (
    <main className="min-h-screen flex flex-col pb-24">
      {/* Header */}
      <header className="p-4 border-b border-border">
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

      {/* Tabs Content */}
      <div className="flex-1 p-4">
        <ToolsTabs attendees={attendees} />
      </div>
    </main>
  );
}
