import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Users } from "lucide-react";

import { isAdminAsync } from "@/lib/user-role";

import { AddMemberDialog } from "./add-member-dialog";
import { BirthdaySpotlight } from "@/components/birthday-spotlight";
import { MemberList } from "@/components/member-list";

import { Card, CardContent } from "@/components/ui/card";
import { BackgroundPattern } from "@/components/ui/background-pattern";

type AttendanceRecord = {
  status: string;
  created_at: string;
};

type MemberWithAttendance = {
  id: string;
  user_id?: string | null;
  name: string;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
  status: "available" | "unavailable" | null;
  unavailable_reason: string | null;
  unavailable_until: string | null;
  gender: "L" | "P" | null;
  role: "admin" | "member" | "owner"; // Added role
  birth_date: string | null; // Added birth_date
  mbti: string | null; // Added mbti
  is_active: boolean | null;
  event_attendance: AttendanceRecord[];
};

export default async function MembersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if user is admin (database-based check)
  const isAdmin = await isAdminAsync(user.email);

  // Fetch members and profile MBTI data in parallel
  const [membersResult, profilesResult] = await Promise.all([
    supabase
      .from("members")
      .select("*")
      .order("name", { ascending: true }),
    supabase
      .from("profiles")
      .select("id, mbti")
  ]);

  const members = membersResult.data || [];
  const profiles = profilesResult.data || [];

  if (membersResult.error) {
    console.error("[MembersPage] Fetch error:", membersResult.error);
  }

  // Create lookup map for MBTI by user_id
  const mbtiMap = new Map(profiles.map(p => [p.id, p.mbti]));

  // Process members to add attendance dots and MBTI
  const membersWithDots = members.map((member: any) => {
    // Sort attendance by date desc and take last 5
    const sortedAttendance = [...(member.event_attendance || [])]
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    const attendanceDots = sortedAttendance.map((a: any) => a.status as "present" | "absent");

    // Get MBTI from map if user_id exists
    const mbti = member.user_id ? mbtiMap.get(member.user_id) : null;

    return {
      id: member.id,
      user_id: member.user_id,
      name: member.name,
      phone: member.phone,
      email: member.email,
      avatar_url: member.avatar_url,
      status: member.status || "available",
      unavailable_reason: member.unavailable_reason,
      unavailable_until: member.unavailable_until,
      gender: member.gender,
      role: member.role || "member",
      birth_date: member.birth_date,
      mbti: mbti || null,
      is_active: member.is_active ?? true,
      attendanceDots,
    };
  });

  const activeCount = membersWithDots.filter(m => m.is_active).length;

  return (
    <>
      <main className="min-h-screen flex flex-col bg-[#FBFBFA] relative overflow-hidden">
        <BackgroundPattern variant="prayer" />

        {/* Content */}
        <div className="flex-1 pb-24">
          {membersWithDots.length > 0 ? (
            <>
              {/* Birthday Spotlight */}
              <div className="pt-4">
                <BirthdaySpotlight members={membersWithDots} />
              </div>

              {/* Member List Section */}
              <section className="px-4">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  👥 Daftar Jemaat ({activeCount})
                </h2>
                <MemberList members={membersWithDots} />
              </section>
            </>
          ) : (
            /* Empty State */
            <div className="p-4">
              <Card className="border-dashed border-2 border-border rounded-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-3 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                    <Users className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-foreground mb-1 text-sm">
                    Belum ada jemaat
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Tambahkan anggota komsel pertamamu!
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button - Fixed position within container */}
      {isAdmin && (
        <div className="fixed bottom-[100px] z-40 left-1/2 -translate-x-1/2 w-full max-w-[480px] pointer-events-none">
          <div className="pointer-events-auto ml-auto mr-5 w-fit">
            <AddMemberDialog />
          </div>
        </div>
      )}
    </>
  );
}


