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
    })
    .eq("id", memberId);

  if (error) {
    console.error("Error updating member:", error);
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
