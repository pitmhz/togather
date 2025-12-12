"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ActionState = {
  success: boolean;
  message: string;
} | null;

const MBTI_TYPES = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP"
];

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(startYear: number, endYear: number) {
  const year = getRandomInt(startYear, endYear);
  const month = getRandomInt(0, 11);
  const day = getRandomInt(1, 28); // Safe day for all months
  const date = new Date(year, month, day);
  // Format as YYYY-MM-DD for PostgreSQL
  return date.toISOString().split("T")[0];
}

function generateRandomBirthDate() {
  const rand = Math.random() * 100;
  const currentYear = new Date().getFullYear();

  // Weighted Distribution
  // 15% Lansia (60-75)
  if (rand < 15) {
    return getRandomDate(currentYear - 75, currentYear - 60);
  }
  // 20% Dewasa (41-59)
  else if (rand < 35) { // 15 + 20
    return getRandomDate(currentYear - 59, currentYear - 41);
  }
  // 40% Young Pro (23-40) - Largest group
  else if (rand < 75) { // 35 + 40
    return getRandomDate(currentYear - 40, currentYear - 23);
  }
  // 15% Pemuda (18-22)
  else if (rand < 90) { // 75 + 15
    return getRandomDate(currentYear - 22, currentYear - 18);
  }
  // 10% Remaja (12-17)
  else {
    return getRandomDate(currentYear - 17, currentYear - 12);
  }
}

export async function seedMemberData(): Promise<ActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Unauthorized" };
  }

  // Check if user is admin (optional safety, similar to other actions)
  // Ideally we check DB role, but for dev tool we might just trust the authenticated user
  // or checks strictly if we want.
  // Implementation: Let's assume anyone with access to /tools (which might be protected by middleware or layout later) can run this,
  // BUT the prompt explicitly says "Security: Ensure this page/button is ONLY visible to Admins."
  // effectively hiding the UI is the first step, enforcing here is second.
  // I will check role here for safety.
  
  const { data: currentUser } = await supabase
    .from("members")
    .select("role")
    .eq("email", user.email)
    .single();

  if (currentUser?.role !== "admin" && currentUser?.role !== "owner") {
     return { success: false, message: "Akses ditolak. Hanya Admin." };
  }

  // Fetch members with missing data
  const { data: members, error } = await supabase
    .from("members")
    .select("id")
    .is("birth_date", null);

  if (error) {
    console.error("Fetch Error:", error);
    return { success: false, message: "Gagal mengambil data member." };
  }

  if (!members || members.length === 0) {
    return { success: true, message: "Semua member sudah memiliki data! Tidak ada yang diubah." };
  }

  let updateCount = 0;

  // Process updates in parallel
  const updates = members.map(async (member) => {
    const randomMbti = MBTI_TYPES[Math.floor(Math.random() * MBTI_TYPES.length)];
    const randomBirthDate = generateRandomBirthDate();

    const { error: updateError } = await supabase
      .from("members")
      .update({
        mbti: randomMbti,
        birth_date: randomBirthDate
      })
      .eq("id", member.id);
    
    if (!updateError) updateCount++;
  });

  await Promise.all(updates);

  revalidatePath("/members");
  revalidatePath("/dashboard");
  revalidatePath("/tools");

  return {
    success: true,
    message: `Berhasil generate data untuk ${updateCount} member! 🎲`,
  };
}
