"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ActionState = {
  success: boolean;
  message: string;
} | null;

export async function addMember(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string | null;
  const gender = formData.get("gender") as string | null;
  const birthDate = formData.get("birth_date") as string | null;

  if (!name || name.trim() === "") {
    return {
      success: false,
      message: "Nama jemaat harus diisi.",
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "Kamu harus login terlebih dahulu.",
    };
  }

  const { error } = await supabase.from("members").insert({
    user_id: user.id,
    name: name.trim(),
    phone: phone?.trim() || null,
    gender: gender || null,
    birth_date: birthDate || null,
  });

  if (error) {
    console.error("Error adding member:", error);
    return {
      success: false,
      message: "Gagal menambahkan jemaat. Coba lagi.",
    };
  }

  revalidatePath("/members");

  return {
    success: true,
    message: "Jemaat berhasil ditambahkan!",
  };
}

export async function updateMember(
  memberId: string,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string | null;
  const email = formData.get("email") as string | null;

  if (!name || name.trim() === "") {
    return {
      success: false,
      message: "Nama jemaat harus diisi.",
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "Kamu harus login terlebih dahulu.",
    };
  }

  // Verify ownership
  const { data: member } = await supabase
    .from("members")
    .select("user_id")
    .eq("id", memberId)
    .single();

  if (!member || member.user_id !== user.id) {
    return {
      success: false,
      message: "Kamu tidak punya akses untuk mengedit jemaat ini.",
    };
  }

  const { error } = await supabase
    .from("members")
    .update({
      name: name.trim(),
      phone: phone?.trim() || null,
      email: email?.trim().toLowerCase() || null,
    })
    .eq("id", memberId);

  if (error) {
    console.error("Error updating member:", error);
    if (error.message.includes("unique")) {
      return {
        success: false,
        message: "Email sudah digunakan oleh member lain.",
      };
    }
    return {
      success: false,
      message: "Gagal mengupdate jemaat. Coba lagi.",
    };
  }

  revalidatePath("/members");

  return {
    success: true,
    message: "Data jemaat berhasil diupdate!",
  };
}

export async function deleteMember(memberId: string): Promise<ActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "Kamu harus login terlebih dahulu.",
    };
  }

  // Verify ownership
  const { data: member } = await supabase
    .from("members")
    .select("user_id")
    .eq("id", memberId)
    .single();

  if (!member || member.user_id !== user.id) {
    return {
      success: false,
      message: "Kamu tidak punya akses untuk menghapus jemaat ini.",
    };
  }

  const { error } = await supabase.from("members").delete().eq("id", memberId);

  if (error) {
    console.error("Error deleting member:", error);
    return {
      success: false,
      message: "Gagal menghapus jemaat. Coba lagi.",
    };
  }

  revalidatePath("/members");

  return {
    success: true,
    message: "Jemaat berhasil dihapus.",
  };
}

export async function deactivateMember(memberId: string): Promise<ActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "Kamu harus login terlebih dahulu.",
    };
  }

  const { error } = await supabase
    .from("members")
    .update({ is_active: false })
    .eq("id", memberId);

  if (error) {
    console.error("Error deactivating member:", error);
    return {
      success: false,
      message: "Gagal menonaktifkan member. Coba lagi.",
    };
  }

  revalidatePath("/members");

  return {
    success: true,
    message: "Member berhasil dinonaktifkan.",
  };
}

export async function updateMemberStatus(
  memberId: string,
  status: "available" | "unavailable",
  reason?: string | null,
  untilDate?: string | null
): Promise<ActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "Kamu harus login terlebih dahulu.",
    };
  }

  // Verify ownership
  const { data: member } = await supabase
    .from("members")
    .select("user_id")
    .eq("id", memberId)
    .single();

  if (!member || member.user_id !== user.id) {
    return {
      success: false,
      message: "Kamu tidak punya akses untuk mengubah status jemaat ini.",
    };
  }

  const { error } = await supabase
    .from("members")
    .update({
      status,
      unavailable_reason: status === "unavailable" ? reason : null,
      unavailable_until: status === "unavailable" ? untilDate : null,
    })
    .eq("id", memberId);

  if (error) {
    console.error("Error updating member status:", error);
    return {
      success: false,
      message: "Gagal mengubah status jemaat. Coba lagi.",
    };
  }

  revalidatePath("/members");
  revalidatePath("/events");

  return {
    success: true,
    message: status === "available" 
      ? "Status berhasil diubah ke Tersedia!" 
      : "Status berhasil diubah ke Tidak Tersedia.",
  };
}

export async function updateMemberEmail(
  memberId: string,
  email: string | null
): Promise<ActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Kamu harus login terlebih dahulu." };
  }

  // Verify ownership
  const { data: member } = await supabase
    .from("members")
    .select("user_id")
    .eq("id", memberId)
    .single();

  if (!member || member.user_id !== user.id) {
    return { success: false, message: "Kamu tidak punya akses." };
  }

  const { error } = await supabase
    .from("members")
    .update({ email: email?.toLowerCase() || null })
    .eq("id", memberId);

  if (error) {
    console.error("Error updating member email:", error);
    return { success: false, message: error.message.includes("unique") 
      ? "Email sudah digunakan oleh member lain." 
      : "Gagal update email." };
  }

  revalidatePath("/members");
  return { success: true, message: "Email berhasil diupdate!" };
}

export async function grantTempAdmin(memberId: string): Promise<ActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Kamu harus login terlebih dahulu." };
  }

  // Verify ownership
  const { data: member } = await supabase
    .from("members")
    .select("user_id, name, email")
    .eq("id", memberId)
    .single();

  if (!member || member.user_id !== user.id) {
    return { success: false, message: "Kamu tidak punya akses." };
  }

  if (!member.email) {
    return { success: false, message: "Member harus punya email terlebih dahulu." };
  }

  // Grant 24-hour temp admin
  const tempAdminUntil = new Date();
  tempAdminUntil.setHours(tempAdminUntil.getHours() + 24);

  const { error } = await supabase
    .from("members")
    .update({ temp_admin_until: tempAdminUntil.toISOString() })
    .eq("id", memberId);

  if (error) {
    console.error("Error granting temp admin:", error);
    return { success: false, message: "Gagal memberikan akses. Coba lagi." };
  }

  revalidatePath("/members");
  return { 
    success: true, 
    message: `${member.name} sekarang Acting Leader selama 24 jam!` 
  };
}

export async function revokeTempAdmin(memberId: string): Promise<ActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Kamu harus login terlebih dahulu." };
  }

  // Verify ownership
  const { data: member } = await supabase
    .from("members")
    .select("user_id, name")
    .eq("id", memberId)
    .single();

  if (!member || member.user_id !== user.id) {
    return { success: false, message: "Kamu tidak punya akses." };
  }

  const { error } = await supabase
    .from("members")
    .update({ temp_admin_until: null })
    .eq("id", memberId);

  if (error) {
    console.error("Error revoking temp admin:", error);
    return { success: false, message: "Gagal mencabut akses. Coba lagi." };
  }

  revalidatePath("/members");
  return { 
    success: true, 
    message: `Akses Acting Leader ${member.name} telah dicabut.` 
  };
}

export async function promoteMember(memberId: string): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, message: "Unauthorized" };

  // Verify Admin
  const { data: currentUser } = await supabase
    .from("members")
    .select("role")
    .eq("email", user.email)
    .single();

  if (currentUser?.role !== 'admin') {
    return { success: false, message: "Only admins can promote members." };
  }

  const { error } = await supabase
    .from("members")
    .update({ role: 'admin' })
    .eq("id", memberId);

  if (error) {
    console.error("Promote Error:", error);
    return { success: false, message: "Failed to promote member." };
  }

  revalidatePath("/members");
  return { success: true, message: "Member promoted to Admin!" };
}

export async function demoteMember(memberId: string): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, message: "Unauthorized" };

  // Verify Admin
  const { data: currentUser } = await supabase
    .from("members")
    .select("role")
    .eq("email", user.email)
    .single();

   if (currentUser?.role !== 'admin') {
    return { success: false, message: "Only admins can demote members." };
  }

  const { error } = await supabase
    .from("members")
    .update({ role: 'member' })
    .eq("id", memberId);

  if (error) {
    console.error("Demote Error:", error);
    return { success: false, message: "Failed to demote member." };
  }

  revalidatePath("/members");
  return { success: true, message: "Admin demoted to Member." };
}


