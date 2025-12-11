import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LogOut, User } from "lucide-react";

import { signOut } from "@/app/(authenticated)/dashboard/actions";
import { ProfileForm } from "./profile-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Profile = {
  full_name: string | null;
  phone_number: string | null;
};

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone_number")
    .eq("id", user.id)
    .single();

  const userEmail = user.email || "User";
  const displayName = profile?.full_name || userEmail.split("@")[0];

  return (
    <main className="min-h-screen flex flex-col pb-24">
      {/* Header */}
      <header className="p-4 border-b border-border">
        <h1 className="text-xl font-heading font-semibold text-foreground">
          Profil
        </h1>
      </header>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
        {/* Avatar Section */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-950 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <p className="font-medium text-foreground text-lg">{displayName}</p>
            <p className="text-sm text-muted-foreground">{userEmail}</p>
            <p className="text-xs text-indigo-600">Cell Group Leader</p>
          </div>
        </div>

        {/* Edit Profile Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Identitas Leader
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileForm profile={profile} />
          </CardContent>
        </Card>

        {/* Logout */}
        <Card>
          <CardContent className="p-0">
            <form action={signOut}>
              <button
                type="submit"
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-red-600"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Keluar</span>
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
