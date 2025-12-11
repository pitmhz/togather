import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Users } from "lucide-react";

import { AddMemberDialog } from "./add-member-dialog";
import { MemberItem } from "./member-item";

import { Card, CardContent } from "@/components/ui/card";

type Member = {
  id: string;
  name: string;
  phone: string | null;
};

export default async function MembersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch members for current user
  const { data: members } = await supabase
    .from("members")
    .select("id, name, phone")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-950 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="font-heading font-semibold text-lg text-foreground">
            Jemaat
          </span>
        </div>
        <AddMemberDialog />
      </header>

      {/* Content */}
      <div className="flex-1 p-4 pb-24">
        <p className="text-muted-foreground text-sm mb-4">
          Kelola daftar anggota komsel kamu.
        </p>

        {members && members.length > 0 ? (
          <div className="space-y-2">
            {members.map((member: Member) => (
              <MemberItem key={member.id} member={member} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <Card className="border-dashed border-2 border-border">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground mb-1">
                Belum ada jemaat
              </h3>
              <p className="text-sm text-muted-foreground">
                Tambahkan anggota komsel pertamamu!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
