"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { generateDiscussionGuide } from "@/lib/gemini";

export type ActionState = {
  success: boolean;
  message: string;
} | null;

export async function addRole(
  eventId: string,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Unauthorized" };
  }

  const roleName = formData.get("role_name") as string;

  if (!roleName?.trim()) {
    return { success: false, message: "Role name is required" };
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

  const { error } = await supabase.from("event_roles").insert({
    event_id: eventId,
    role_name: roleName.trim(),
    assignee_name: null,
    is_filled: false,
  });

  if (error) {
    console.error("[addRole] Error:", error);
    return { success: false, message: error.message };
  }

  console.log("[addRole] Success - Revalidating path:", `/events/${eventId}`);
  revalidatePath(`/events/${eventId}`);
  revalidatePath("/dashboard");
  return { success: true, message: "Role added successfully" };
}

export async function updateRoleAssignment(
  roleId: string,
  eventId: string,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Unauthorized" };
  }

  const assigneeName = formData.get("assignee_name") as string;
  const memberId = formData.get("member_id") as string | null;
  const trimmedName = assigneeName?.trim() || null;

  // Verify ownership through event
  const { data: role } = await supabase
    .from("event_roles")
    .select("id, events!inner(user_id)")
    .eq("id", roleId)
    .single();

  if (!role || (role.events as unknown as { user_id: string }).user_id !== user.id) {
    return { success: false, message: "Role not found or access denied" };
  }

  const { error } = await supabase
    .from("event_roles")
    .update({
      assignee_name: trimmedName,
      member_id: memberId || null,
      is_filled: !!trimmedName,
    })
    .eq("id", roleId);

  if (error) {
    console.error("[updateRoleAssignment] Error:", error);
    return { success: false, message: error.message };
  }

  console.log("[updateRoleAssignment] Success - Revalidating path:", `/events/${eventId}`);
  revalidatePath(`/events/${eventId}`);
  revalidatePath("/dashboard");
  return { success: true, message: "Petugas berhasil diupdate!" };
}

export async function deleteRole(
  roleId: string,
  eventId: string
): Promise<ActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Unauthorized" };
  }

  // Verify ownership through event
  const { data: role } = await supabase
    .from("event_roles")
    .select("id, events!inner(user_id)")
    .eq("id", roleId)
    .single();

  if (!role || (role.events as unknown as { user_id: string }).user_id !== user.id) {
    return { success: false, message: "Role not found or access denied" };
  }

  const { error } = await supabase
    .from("event_roles")
    .delete()
    .eq("id", roleId);

  if (error) {
    console.error("[deleteRole] Error:", error);
    return { success: false, message: error.message };
  }

  console.log("[deleteRole] Success - Revalidating path:", `/events/${eventId}`);
  revalidatePath(`/events/${eventId}`);
  return { success: true, message: "Role deleted successfully" };
}

export async function updateEventNotes(
  eventId: string,
  notes: string
): Promise<ActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Unauthorized" };
  }

  const { error } = await supabase
    .from("events")
    .update({ notes })
    .eq("id", eventId);

  if (error) {
    console.error("[updateEventNotes] Error:", error);
    return { success: false, message: error.message };
  }

  revalidatePath(`/events/${eventId}`);
  return { success: true, message: "Catatan berhasil disimpan!" };
}

export async function updateEvent(
  eventId: string,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const topic = formData.get("topic") as string | null;
  const eventDate = formData.get("event_date") as string;
  const location = formData.get("location") as string | null;
  const eventType = formData.get("event_type") as string | null;
  const mapsLink = formData.get("maps_link") as string | null;

  if (!title?.trim()) {
    return { success: false, message: "Judul acara harus diisi" };
  }

  if (!eventDate) {
    return { success: false, message: "Tanggal harus diisi" };
  }

  // Verify ownership
  const { data: event } = await supabase
    .from("events")
    .select("id")
    .eq("id", eventId)
    .eq("user_id", user.id)
    .single();

  if (!event) {
    return { success: false, message: "Event not found or access denied" };
  }

  const { error } = await supabase
    .from("events")
    .update({
      title: title.trim(),
      topic: topic?.trim() || null,
      event_date: eventDate,
      location: location?.trim() || null,
      event_type: eventType || "regular",
      maps_link: mapsLink?.trim() || null,
    })
    .eq("id", eventId);

  if (error) {
    console.error("[updateEvent] Error:", error);
    return { success: false, message: error.message };
  }

  revalidatePath(`/events/${eventId}`);
  revalidatePath("/dashboard");
  return { success: true, message: "Jadwal berhasil diupdate!" };
}

export async function uploadEventCover(
  eventId: string,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Unauthorized" };
  }

  const file = formData.get("cover") as File | null;

  if (!file || file.size === 0) {
    return { success: false, message: "File tidak ditemukan" };
  }

  // Verify ownership
  const { data: event } = await supabase
    .from("events")
    .select("id")
    .eq("id", eventId)
    .eq("user_id", user.id)
    .single();

  if (!event) {
    return { success: false, message: "Event not found or access denied" };
  }

  // Generate filename
  const filename = `${eventId}-${Date.now()}.webp`;

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from("event-covers")
    .upload(filename, file, {
      contentType: "image/webp",
      upsert: true,
    });

  if (uploadError) {
    console.error("[uploadEventCover] Upload error:", uploadError);
    return { success: false, message: "Gagal upload gambar: " + uploadError.message };
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from("event-covers")
    .getPublicUrl(filename);

  const coverUrl = urlData.publicUrl;

  // Update event
  const { error: updateError } = await supabase
    .from("events")
    .update({ cover_url: coverUrl })
    .eq("id", eventId);

  if (updateError) {
    console.error("[uploadEventCover] Update error:", updateError);
    return { success: false, message: "Gagal update event: " + updateError.message };
  }

  revalidatePath(`/events/${eventId}`);
  revalidatePath("/dashboard");
  return { success: true, message: "Sampul berhasil diupload!" };
}

export type AIContentResult = {
  success: boolean;
  content?: string;
  message?: string;
};

export async function generateAIContent(topic: string): Promise<AIContentResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Unauthorized" };
  }

  if (!topic?.trim()) {
    return { success: false, message: "Topik harus diisi" };
  }

  try {
    const content = await generateDiscussionGuide(topic);
    return { success: true, content };
  } catch (error) {
    console.error("[generateAIContent] Error:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Gagal generate materi"
    };
  }
}
