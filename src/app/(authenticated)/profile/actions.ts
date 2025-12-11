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

  const fullName = formData.get("full_name") as string;
  const phoneNumber = formData.get("phone_number") as string;

  if (!fullName) {
    return { success: false, message: "Nama wajib diisi!" };
  }

  // Upsert profile
  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      full_name: fullName,
      phone_number: phoneNumber || null,
    });

  if (error) {
    console.error("[updateProfile] Error:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/profile");
  revalidatePath("/events");

  return { success: true, message: "Profil berhasil diupdate!" };
}
