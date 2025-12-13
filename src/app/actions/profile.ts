"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateOptionalProfile(data: { mbti: string | null; hobbies: string[] | null }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    const { error } = await supabase
      .from("profiles")
      .update({
        mbti: data.mbti,
        interests: data.hobbies, // Assuming 'interests' is the column name for hobbies based on convention
      })
      .eq("id", user.id);

    if (error) {
      console.error("Update profile error:", error);
      return { error: "Failed to update profile" };
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { error: "Internal server error" };
  }
}
