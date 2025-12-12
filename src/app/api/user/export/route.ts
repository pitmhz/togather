import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch user's members data
  const { data: members } = await supabase
    .from("members")
    .select("*")
    .eq("user_id", user.id);

  // Fetch user's events
  const { data: events } = await supabase
    .from("events")
    .select("*, event_roles(*)")
    .eq("user_id", user.id);

  // Fetch user's prayer requests (if exists)
  const { data: prayers } = await supabase
    .from("event_prayers")
    .select("*")
    .eq("user_id", user.id);

  // Build export data
  const exportData = {
    export_info: {
      exported_at: new Date().toISOString(),
      user_email: user.email,
      app_name: "Togather",
      app_version: "1.1.0",
      data_retention_info: "Data disimpan selama akun aktif",
    },
    profile: profile || null,
    members: members || [],
    events: events || [],
    prayers: prayers || [],
    mbti_analysis: profile?.mbti_summary || null,
  };

  // Create downloadable JSON
  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });

  return new NextResponse(blob, {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="togather-user-data-${new Date().toISOString().split("T")[0]}.json"`,
    },
  });
}
