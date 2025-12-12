"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { generateMBTISummary } from "@/lib/gemini";

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
  const gender = formData.get("gender") as string;
  const birthDate = formData.get("birth_date") as string;
  const mbti = formData.get("mbti") as string;

  if (!firstName) {
    return { success: false, message: "Nama depan wajib diisi!" };
  }

  // Combine first and last name
  const fullName = lastName ? `${firstName} ${lastName}` : firstName;

  // Check if MBTI changed and generate summary
  let mbtiSummary: string | null = null;
  if (mbti) {
    // Fetch current profile to check if MBTI changed
    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("mbti, mbti_summary")
      .eq("id", user.id)
      .single();

    if (currentProfile?.mbti !== mbti || !currentProfile?.mbti_summary) {
      try {
        mbtiSummary = await generateMBTISummary(mbti, fullName);
      } catch (error) {
        console.error("[updateProfile] MBTI generation error:", error);
        // Continue without summary if AI fails
      }
    } else {
      mbtiSummary = currentProfile.mbti_summary;
    }
  }

  // Upsert profile
  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      full_name: fullName,
      phone_number: phoneNumber || null,
      address: address || null,
      maps_link: mapsLink || null,
      gender: gender || null,
      birth_date: birthDate || null,
      mbti: mbti || null,
      mbti_summary: mbtiSummary,
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

  revalidatePath("/profile");
  return { success: true, message: "Password berhasil diupdate!" };
}

export async function generateMbtiSummaryAction(mbti: string): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, message: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  if (!profile) return { success: false, message: "Profile not found" };

  try {
    const summary = await generateMBTISummary(mbti, profile.full_name || "User");
    
    const { error } = await supabase
      .from("profiles")
      .update({ mbti_summary: summary })
      .eq("id", user.id);

    if (error) throw error;

    revalidatePath("/profile");
    return { success: true, message: "Analisa MBTI berhasil dibuat! ✨" };
  } catch (error) {
    console.error("Geneartion Error:", error);
    return { success: false, message: "Gagal generate analisa." };
  }
}


