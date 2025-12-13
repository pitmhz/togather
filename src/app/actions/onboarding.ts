"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type OnboardingData = {
  role: "leader" | "member";
  // Community data (for leaders)
  communityName?: string;
  churchType?: string;
  location?: string;
  // Personal data
  fullName: string;
  phone: string;
  gender: "L" | "P";
  birthDate: string;
  gmapsLink?: string;
};

function generateInviteCode(communityName?: string): string {
  // Generate code based on community name + random 3 digits
  // e.g., CGPRO36-778
  const prefix = communityName
    ? communityName
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 8)
    : "KOMSEL";
  
  const suffix = Math.floor(100 + Math.random() * 900).toString(); // 3 random digits
  return `${prefix}-${suffix}`;
}

export async function submitOnboarding(data: OnboardingData) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Tidak terautentikasi. Silakan login ulang." };
  }

  try {
    if (data.role === "leader") {
      // Leader path: Create community first, then update profile
      
      // 1. Create the community
      const inviteCode = generateInviteCode(data.communityName);
      const { data: community, error: communityError } = await supabase
        .from("communities")
        .insert({
          leader_id: user.id,
          name: data.communityName,
          church_type: data.churchType,
          location: data.location,
          invite_code: inviteCode,
        })
        .select("id, invite_code")
        .single();

      if (communityError) {
        console.error("Error creating community:", communityError);
        return { error: "Gagal membuat komunitas. Coba lagi." };
      }

      // 2. Update the user's profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          name: data.fullName,
          phone: data.phone,
          gender: data.gender,
          birth_date: data.birthDate,
          maps_link: data.gmapsLink,
          community_id: community.id,
          is_onboarded: true,
        })
        .eq("id", user.id);

      if (profileError) {
        console.error("Error updating profile:", profileError);
        return { error: "Gagal menyimpan profil. Coba lagi." };
      }

      revalidatePath("/");
      
      // Return success with invite code for Step 4 display
      return { 
        success: true, 
        inviteCode: community.invite_code,
        communityName: data.communityName,
      };
    } else {
      // Member path: Just update profile, redirect to join screen
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          name: data.fullName,
          phone: data.phone,
          gender: data.gender,
          birth_date: data.birthDate,
          maps_link: data.gmapsLink,
          // Note: community_id will be set when they join a community
          // is_onboarded stays false until they join
        })
        .eq("id", user.id);

      if (profileError) {
        console.error("Error updating profile:", profileError);
        return { error: "Gagal menyimpan profil. Coba lagi." };
      }

      revalidatePath("/");
      // For members, redirect to join page (to be implemented)
      // For now, just return success
      return { success: true, redirectTo: "/join" };
    }
  } catch (error) {
    console.error("Onboarding error:", error);
    return { error: "Terjadi kesalahan. Coba lagi." };
  }
}
