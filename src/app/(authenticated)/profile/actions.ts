"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ActionState = {
  success: boolean;
  message: string;
} | null;

export async function updateProfile(
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

  const firstName = formData.get("first_name") as string;
  const lastName = formData.get("last_name") as string;
  const phoneNumber = formData.get("phone_number") as string;
  const address = formData.get("address") as string;
  const mapsLink = formData.get("maps_link") as string;

  if (!firstName) {
    return { success: false, message: "Nama depan wajib diisi!" };
  }

  // Combine first and last name
  const fullName = lastName ? `${firstName} ${lastName}` : firstName;

  // Upsert profile
  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      full_name: fullName,
      phone_number: phoneNumber || null,
      address: address || null,
      maps_link: mapsLink || null,
    });

  if (error) {
    console.error("[updateProfile] Error:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/profile");
  revalidatePath("/events");
  revalidatePath("/dashboard");

  return { success: true, message: "Profil berhasil diupdate!" };
}

export async function updatePassword(
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

  const password = formData.get("password") as string;

  if (!password || password.length < 6) {
    return { success: false, message: "Password minimal 6 karakter!" };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error("[updatePassword] Error:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/profile");

  return { success: true, message: "Password berhasil diupdate!" };
}


