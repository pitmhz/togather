"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ActionState = {
  success: boolean;
  message: string;
} | null;

export async function updateAttendance(
  eventId: string,
  memberId: string,
  status: "present" | "absent" | null
): Promise<ActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Unauthorized" };
  }

  // Verify event ownership
  const { data: event } = await supabase
    .from("events")
    .select("id")
    .eq("id", eventId)
    .eq("user_id", user.id)
    .single();

  if (!event) {
    return { success: false, message: "Event not found or access denied" };
  }

  if (status === null) {
    // Remove attendance record
    const { error } = await supabase
      .from("event_attendance")
      .delete()
      .eq("event_id", eventId)
      .eq("member_id", memberId);

    if (error) {
      console.error("[updateAttendance] Delete Error:", error);
      return { success: false, message: error.message };
    }
  } else {
    // Upsert attendance record
    const { error } = await supabase
      .from("event_attendance")
      .upsert(
        {
          event_id: eventId,
          member_id: memberId,
          status: status,
        },
        {
          onConflict: "event_id,member_id",
        }
      );

    if (error) {
      console.error("[updateAttendance] Upsert Error:", error);
      return { success: false, message: error.message };
    }
  }

  revalidatePath(`/events/${eventId}`);
  return { success: true, message: "Absensi berhasil diupdate!" };
}
