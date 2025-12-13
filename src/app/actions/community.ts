"use server";

import { createClient } from "@/lib/supabase/server";

export type CommunityValidationResult = {
  isValid: boolean;
  community?: {
    id: string;
    name: string;
    location: string;
    schedule: string | null;
    description: string | null;
  };
  leader?: {
    name: string;
  };
  error?: string;
};

export async function validateInviteCode(code: string): Promise<CommunityValidationResult> {
  const supabase = await createClient();

  try {
    // 1. Find community by invite code
    const { data: community, error } = await supabase
      .from("communities")
      .select("id, name, location, schedule, description, leader_id")
      .eq("invite_code", code)
      .single();

    if (error || !community) {
      return { isValid: false, error: "Kode undangan tidak ditemukan." };
    }

    // 2. Fetch leader details
    const { data: leader } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", community.leader_id)
      .single();

    return {
      isValid: true,
      community: {
        id: community.id,
        name: community.name,
        location: community.location,
        schedule: community.schedule || null,
        description: community.description || null,
      },
      leader: {
        name: leader?.name || "Leader Komunitas",
      },
    };
  } catch (err) {
    console.error("Error validating invite code:", err);
    return { isValid: false, error: "Terjadi kesalahan sistem." };
  }
}

export async function joinCommunity(inviteCode: string, onbData: { fullName: string; phone: string; gender: string; birthDate: string }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    // 1. Get community ID from code
    const { data: community } = await supabase
      .from("communities")
      .select("id")
      .eq("invite_code", inviteCode)
      .single();

    if (!community) {
      return { error: "Komunitas tidak ditemukan" };
    }

    // 2. Update profile
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        name: onbData.fullName,
        phone: onbData.phone,
        gender: onbData.gender,
        birth_date: onbData.birthDate,
        community_id: community.id,
        is_onboarded: true,
      })
      .eq("id", user.id);

    if (profileError) {
      console.error("Join error:", profileError);
      return { error: "Gagal bergabung. Coba lagi." };
    }

    return { success: true };
  } catch (error) {
    console.error("Join exception:", error);
    return { error: "Terjadi kesalahan sistem" };
  }
}
