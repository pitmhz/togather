"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
