"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
  // Use standard client just for auth check
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("SERVER ERROR [submitOnboarding] Auth:", authError);
    return { error: "Tidak terautentikasi. Silakan login ulang." };
  }

  // Use Admin Client for all DB operations (bypasses RLS)
  const adminClient = createAdminClient();

  console.log("SERVER [submitOnboarding] Starting for user:", user.id, "Role:", data.role);
  console.log("SERVER [submitOnboarding] Data payload:", JSON.stringify(data, null, 2));

  try {
    if (data.role === "leader") {
      // Leader path: Create community first, then update profile
      
      // 1. Create the community
      const inviteCode = generateInviteCode(data.communityName);
      console.log("SERVER [submitOnboarding] Creating community with invite code:", inviteCode);

      const { data: community, error: communityError } = await adminClient
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
        console.error("SERVER ERROR [submitOnboarding] Community creation failed:", JSON.stringify(communityError, null, 2));
        return { error: `Gagal membuat komunitas: ${communityError.message}` };
      }

      console.log("SERVER [submitOnboarding] Community created:", community.id);

      // 2. Update the user's profile
      const { error: profileError } = await adminClient
        .from("profiles")
        .update({
          full_name: data.fullName,
          phone: data.phone,
          gender: data.gender,
          birth_date: data.birthDate,
          maps_link: data.gmapsLink,
          community_id: community.id,
          is_onboarded: true,
        })
        .eq("id", user.id);

      if (profileError) {
        console.error("SERVER ERROR [submitOnboarding] Profile update failed:", JSON.stringify(profileError, null, 2));
        return { error: `Gagal menyimpan profil: ${profileError.message}` };
      }

      console.log("SERVER [submitOnboarding] Profile updated successfully");
      revalidatePath("/");
      
      // Return success with invite code for Step 4 display
      return { 
        success: true, 
        inviteCode: community.invite_code,
        communityName: data.communityName,
      };
    } else {
      // Member path: Just update profile, redirect to join screen
      console.log("SERVER [submitOnboarding] Updating member profile");

      const { error: profileError } = await adminClient
        .from("profiles")
        .update({
          full_name: data.fullName,
          phone: data.phone,
          gender: data.gender,
          birth_date: data.birthDate,
          maps_link: data.gmapsLink,
          // Note: community_id will be set when they join a community
          // is_onboarded stays false until they join
        })
        .eq("id", user.id);

      if (profileError) {
        console.error("SERVER ERROR [submitOnboarding] Member profile update failed:", JSON.stringify(profileError, null, 2));
        return { error: `Gagal menyimpan profil: ${profileError.message}` };
      }

      console.log("SERVER [submitOnboarding] Member profile updated successfully");
      revalidatePath("/");
      // For members, redirect to join page (to be implemented)
      // For now, just return success
      return { success: true, redirectTo: "/join" };
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown server error";
    console.error("SERVER ERROR [submitOnboarding] Caught exception:", JSON.stringify(error, null, 2));
    return { error: errorMessage };
  }
}
