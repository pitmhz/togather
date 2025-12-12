import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Users } from "lucide-react";

import { isAdminAsync } from "@/lib/user-role";

import { AddMemberDialog } from "./add-member-dialog";
import { MembersGrid } from "./members-grid";

import { Card, CardContent } from "@/components/ui/card";
import { BackgroundPattern } from "@/components/ui/background-pattern";

type AttendanceRecord = {
  status: string;
  created_at: string;
};

type MemberWithAttendance = {
  id: string;
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

  // Fetch members - simplified query to avoid column issues
  // RLS policy handles visibility - all authenticated users can read
  const { data: members, error: membersError } = await supabase
    .from("members")
    .select("*")
    .order("name", { ascending: true });
  
  if (membersError) {
    console.error("[MembersPage] Fetch error:", membersError);
  }
  console.log("[MembersPage] Fetched members count:", members?.length || 0);

  // Process members to add attendance dots
  const membersWithDots = (members || []).map((member: MemberWithAttendance) => {
    // Sort attendance by date desc and take last 5
    const sortedAttendance = [...(member.event_attendance || [])]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
    
    const attendanceDots = sortedAttendance.map((a) => a.status as "present" | "absent");
    
    return {
      id: member.id,
      name: member.name,
      phone: member.phone,
      email: member.email,
      avatar_url: member.avatar_url,
      status: member.status || "available",
      unavailable_reason: member.unavailable_reason,
      unavailable_until: member.unavailable_until,
      gender: member.gender,
      role: member.role || "member", // Pass role
      birth_date: member.birth_date, // Pass birth_date
      is_active: member.is_active ?? true,
      attendanceDots,
    };
  });

  return (
    <main className="min-h-screen flex flex-col bg-[#FBFBFA] relative overflow-hidden">
      <BackgroundPattern variant="prayer" />
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-950 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="font-heading font-semibold text-lg text-foreground">
            Jemaat
          </span>
        </div>
        {isAdmin && <AddMemberDialog />}
      </header>

      {/* Content */}
      <div className="flex-1 p-4 pb-24">
        {membersWithDots.length > 0 ? (
          <MembersGrid members={membersWithDots} isAdmin={isAdmin} />
        ) : (
          /* Empty State */
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
        )}
      </div>
    </main>
  );
}

