"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Demo member names (Indonesian)
const DEMO_NAMES = [
  "Budi Santoso", "Sarah Wijaya", "Kevin Pratama", "Putri Andini",
  "Andre Gunawan", "Jessica Lim", "Daniel Pranoto", "Grace Hartono",
  "Michael Tanudjaja", "Elizabeth Surya", "David Kusuma", "Rachel Anggraeni",
  "Jonathan Halim", "Maria Sari", "Timothy Budiman"
];

const MBTI_TYPES = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP"
];

const MOOD_OPTIONS = ["sick", "traveling", "exam", "mourning", "happy", null, null, null];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(startYear: number, endYear: number): string {
  const year = startYear + Math.floor(Math.random() * (endYear - startYear));
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// Generate a birthday that's guaranteed to be within the next 30 days
function randomUpcomingBirthday(): string {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();
  
  // Random days ahead (0-30)
  const daysAhead = Math.floor(Math.random() * 31);
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + daysAhead);
  
  // Use a random birth year (1985-2005) but keep the upcoming month/day
  const birthYear = 1985 + Math.floor(Math.random() * 20);
  const month = futureDate.getMonth() + 1;
  const day = futureDate.getDate();
  
  return `${birthYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}


function generateShortId(): string {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

export type RedeemResult = {
  success: boolean;
  message: string;
  redirectTo?: string;
};

export async function redeemInviteCode(code: string): Promise<RedeemResult> {
  const supabase = await createClient();
  
  // 1. Validate invite code
  const { data: invite, error: inviteError } = await supabase
    .from("invite_codes")
    .select("*")
    .eq("code", code.toUpperCase().trim())
    .single();

  if (inviteError || !invite) {
    return { success: false, message: "Kode undangan tidak valid." };
  }

  if (invite.used_count >= invite.quota_limit) {
    return { success: false, message: "Kode undangan sudah mencapai batas penggunaan." };
  }

  // 2. Generate demo credentials
  const demoId = generateShortId();
  const demoEmail = `demo-${demoId.toLowerCase()}@togather.local`;
  const demoPassword = `Demo${generateShortId()}${generateShortId()}!`;

  // 3. Create auth user using ADMIN client (service role can create users)
  const adminClient = createAdminClient();
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email: demoEmail,
    password: demoPassword,
    email_confirm: true, // Auto-confirm email for demo users
  });

  if (authError || !authData.user) {
    console.error("[redeemInviteCode] Auth error:", authError);
    return { success: false, message: "Gagal membuat akun demo. Coba lagi." };
  }

  const userId = authData.user.id;

  // 4. Create demo profile with is_demo flag (use admin client to bypass RLS)
  const { error: profileError } = await adminClient
    .from("profiles")
    .upsert({
      id: userId,
      full_name: `Demo User ${demoId}`,
      is_demo: true,
      mbti: randomItem(MBTI_TYPES),
    });

  if (profileError) {
    console.error("[redeemInviteCode] Profile error:", profileError);
  }

  // 5. Create demo community/group (use admin client)
  const groupName = `Komsel Beta ${demoId}`;
  const { data: group, error: groupError } = await adminClient
    .from("groups")
    .insert({
      name: groupName,
      community_name: "Togather Demo",
      owner_id: userId,
    })
    .select()
    .single();

  if (groupError) {
    console.error("[redeemInviteCode] Group error:", groupError);
    return { success: false, message: "Gagal membuat komunitas demo." };
  }

  const groupId = group.id;

  // 6. Generate 15 demo members (use admin client)
  // First 5 members get upcoming birthdays to populate the birthday spotlight
  const memberInserts = DEMO_NAMES.map((name, idx) => ({
    group_id: groupId,
    user_id: idx === 0 ? userId : null, // First member linked to demo user
    name,
    role: idx === 0 ? "owner" : (idx < 3 ? "admin" : "member"),
    gender: Math.random() > 0.5 ? "L" : "P",
    birth_date: idx < 5 ? randomUpcomingBirthday() : randomDate(1985, 2005), // First 5 get upcoming birthdays
    current_mood: randomItem(MOOD_OPTIONS),
    is_active: true,
    phone: `08${Math.floor(1000000000 + Math.random() * 9000000000)}`.slice(0, 12),
  }));

  const { data: members, error: membersError } = await adminClient
    .from("members")
    .insert(memberInserts)
    .select("id, name");

  if (membersError) {
    console.error("[redeemInviteCode] Members error:", membersError);
  }

  const memberList = members || [];

  // 7. Create demo events
  const now = new Date();
  
  // Event 1: Past event (7 days ago) - Fully completed
  const pastDate = new Date(now);
  pastDate.setDate(pastDate.getDate() - 7);
  pastDate.setHours(17, 0, 0, 0);

  const { data: pastEvent, error: pastEventError } = await adminClient
    .from("events")
    .insert({
      user_id: userId,
      group_id: groupId,
      title: "Komsel Gabungan: Kasih Mula-mula",
      topic: "Menjaga Api Pertama",
      event_date: pastDate.toISOString(),
      location: "Rumah Kak Budi, Serpong",
      event_type: "regular",
      liturgy_wl: "Grace Hartono",
      liturgy_singer: "Kevin Pratama, Sarah Wijaya",
      liturgy_song1: "Ku Mau Cinta Yesus",
      liturgy_song2: "Hari Ini Kami Datang",
      liturgy_offering: "Daniel Pranoto",
      benediction: "Jangan biarkan apimu padam. Tetaplah berkobar untuk Tuhan dan untuk sesama.",
      notes: "Suasana sangat cair, Budi bawa snack enak! 🍪",
    })
    .select()
    .single();

  if (pastEventError) {
    console.error("[redeemInviteCode] Past event error:", pastEventError);
  }

  // Add roles to past event
  if (pastEvent && memberList.length >= 5) {
    const roleInserts = [
      { event_id: pastEvent.id, role_name: "Worship Leader", assignee_name: memberList[7]?.name || "Grace", member_id: memberList[7]?.id, is_filled: true },
      { event_id: pastEvent.id, role_name: "Singer", assignee_name: memberList[2]?.name || "Kevin", member_id: memberList[2]?.id, is_filled: true },
      { event_id: pastEvent.id, role_name: "Usher", assignee_name: memberList[3]?.name || "Putri", member_id: memberList[3]?.id, is_filled: true },
    ];
    
    await adminClient.from("event_roles").insert(roleInserts);
  }

  // Add attendance for past event (80% present, 10% permission, 10% absent)
  if (pastEvent && memberList.length > 0) {
    const attendanceInserts = memberList.map((m, idx) => {
      let status: "present" | "permission" | "absent";
      if (idx < 12) status = "present";
      else if (idx < 14) status = "permission";
      else status = "absent";
      
      return {
        event_id: pastEvent.id,
        member_id: m.id,
        status,
        created_at: pastDate.toISOString(),
      };
    });
    
    await adminClient.from("event_attendance").insert(attendanceInserts);
  }

  // Event 2: Upcoming event (3 days from now) - Needs roles
  const futureDate = new Date(now);
  futureDate.setDate(futureDate.getDate() + 3);
  futureDate.setHours(17, 0, 0, 0);

  const { data: futureEvent, error: futureEventError } = await adminClient
    .from("events")
    .insert({
      user_id: userId,
      group_id: groupId,
      title: "Ibadah Padang: Visi 2026",
      topic: "Bermimpi Besar Bersama Tuhan",
      event_date: futureDate.toISOString(),
      location: "Taman Kota BSD",
      event_type: "regular",
      liturgy_wl: memberList[7]?.name || "Grace Hartono",
    })
    .select()
    .single();

  if (futureEventError) {
    console.error("[redeemInviteCode] Future event error:", futureEventError);
  }

  // Add roles to future event (WL filled, Singer & Usher EMPTY - triggers badge)
  if (futureEvent) {
    const roleInserts = [
      { event_id: futureEvent.id, role_name: "Worship Leader", assignee_name: memberList[7]?.name || "Grace", member_id: memberList[7]?.id, is_filled: true },
      { event_id: futureEvent.id, role_name: "Singer", assignee_name: null, member_id: null, is_filled: false },
      { event_id: futureEvent.id, role_name: "Usher", assignee_name: null, member_id: null, is_filled: false },
    ];
    
    await adminClient.from("event_roles").insert(roleInserts);
  }

  // Add partial attendance for future event (3 present, 2 permission)
  if (futureEvent && memberList.length > 0) {
    const attendanceInserts = memberList.slice(0, 5).map((m, idx) => ({
      event_id: futureEvent.id,
      member_id: m.id,
      status: idx < 3 ? "present" : "permission",
      created_at: new Date().toISOString(),
    }));
    
    await adminClient.from("event_attendance").insert(attendanceInserts);
  }

  // 8. Update invite code usage
  await adminClient
    .from("invite_codes")
    .update({
      used_count: invite.used_count + 1,
      used_at: new Date().toISOString(),
    })
    .eq("code", code.toUpperCase().trim());

  // 9. Sign in the user (auto-login after signup) - use regular client for session cookies
  await supabase.auth.signInWithPassword({
    email: demoEmail,
    password: demoPassword,
  });

  revalidatePath("/dashboard");
  
  return {
    success: true,
    message: "Selamat datang di Togather! 🎉",
    redirectTo: "/dashboard",
  };
}

/**
 * Check if demo user has exceeded their quota for an action
 */
export async function checkDemoQuota(action: "create_event" | "add_member" | "edit_profile"): Promise<{
  allowed: boolean;
  message?: string;
}> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { allowed: false, message: "Unauthorized" };
  }

  // Check if user is a demo user
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_demo")
    .eq("id", user.id)
    .single();

  // Not a demo user - no limits
  if (!profile?.is_demo) {
    return { allowed: true };
  }

  // Demo user - check limits
  switch (action) {
    case "create_event": {
      const { count } = await supabase
        .from("events")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      
      // Demo limit: 3 events total (2 seeded + 1 user-created)
      if ((count || 0) >= 3) {
        return { allowed: false, message: "Mode Demo terbatas 1 Event baru." };
      }
      break;
    }
    case "add_member": {
      const { data: member } = await supabase
        .from("members")
        .select("group_id")
        .eq("user_id", user.id)
        .single();
      
      if (member) {
        const { count } = await supabase
          .from("members")
          .select("*", { count: "exact", head: true })
          .eq("group_id", member.group_id);
        
        // Demo limit: 16 members (15 seeded + 1 user-created)
        if ((count || 0) >= 16) {
          return { allowed: false, message: "Mode Demo terbatas 1 Member baru." };
        }
      }
      break;
    }
    case "edit_profile": {
      // Allow profile edits without limit for demo
      return { allowed: true };
    }
  }

  return { allowed: true };
}
