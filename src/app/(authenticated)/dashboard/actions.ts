"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ActionState = {
  success: boolean;
  message: string;
} | null;

// Standard GMS Komsel roles for auto-seeding
const STANDARD_ROLES = [
  "CG Leader",
  "Worship Leader",
  "Fellowship",
  "Games / Ice Breaker",
  "Pembawa Doa",
  "Tuan Rumah"
];

export async function createEvent(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to create an event.",
    };
  }

  const title = formData.get("title") as string;
  const topic = formData.get("topic") as string;
  const eventDate = formData.get("event_date") as string;
  const location = formData.get("location") as string;
  const eventType = formData.get("event_type") as string || "regular";
  const isOuting = formData.get("is_outing") === "true";
  const mapsLink = formData.get("maps_link") as string;

  if (!title || !eventDate) {
    return {
      success: false,
      message: "Title and date are required.",
    };
  }

  // Insert event and get the created event ID
  const { data: newEvent, error } = await supabase
    .from("events")
    .insert({
      user_id: user.id,
      title,
      topic: topic || null,
      event_date: eventDate,
      location: location || null,
      event_type: eventType,
      is_outing: isOuting,
      maps_link: mapsLink || null,
    })
    .select("id")
    .single();

  if (error || !newEvent) {
    console.error("Create event error:", error);
    return {
      success: false,
      message: error?.message || "Failed to create event.",
    };
  }

  // Auto-seed standard roles for REGULAR events only
  if (eventType === "regular") {
    const rolesToInsert = STANDARD_ROLES.map((roleName) => ({
      event_id: newEvent.id,
      role_name: roleName,
      assignee_name: null,
      is_filled: false,
    }));

    const { error: rolesError } = await supabase
      .from("event_roles")
      .insert(rolesToInsert);

    if (rolesError) {
      console.error("Auto-seed roles error:", rolesError);
      // Event was created, roles failed - still return success but log the error
    }
  }

  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Jadwal berhasil dibuat!",
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
