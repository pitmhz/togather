import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

import { EditEventForm } from "./edit-event-form";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch event
  const { data: event } = await supabase
    .from("events")
    .select("id, title, topic, event_date, location, event_type, maps_link")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!event) {
    notFound();
  }

  return <EditEventForm event={event} />;
}
