"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function claimAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, message: "Unauthorized" };

  // Set current user as admin in members table
  const { error } = await supabase
    .from("members")
    .update({ role: "admin" })
    .eq("email", user.email);

  if (error) {
    console.error("Claim Admin Error:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/profile");
  revalidatePath("/members");
  revalidatePath("/dashboard");
  
  return { success: true, message: "You are now an Admin!" };
}
