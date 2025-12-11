import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LogOut, User } from "lucide-react";

import { signOut } from "@/app/(authenticated)/dashboard/actions";
import { ProfileForm } from "./profile-form";
import { SecurityForm } from "./security-form";
import { getUserRole } from "@/lib/user-role";

import { Card, CardContent } from "@/components/ui/card";

type Profile = {
  full_name: string | null;
  phone_number: string | null;
  address: string | null;
  maps_link: string | null;
};

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile with all fields
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone_number, address, maps_link")
    .eq("id", user.id)
    .single();

  const userEmail = user.email || "User";
  const displayName = profile?.full_name || userEmail.split("@")[0];

  return (
    <main className="min-h-screen flex flex-col pb-24 bg-slate-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="p-4 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <h1 className="text-xl font-heading font-semibold text-foreground">
          Profil
        </h1>
      </header>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
        {/* Avatar Section */}
        <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-lg">{displayName}</p>
                <p className="text-sm text-muted-foreground">{userEmail}</p>
                <p className="text-xs text-indigo-600 font-medium mt-1">
                  {getUserRole(userEmail).roleLabel}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Card */}
        <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
          <CardContent className="p-5">
            <ProfileForm profile={profile} userEmail={userEmail} />
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
          <CardContent className="p-5">
            <SecurityForm />
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
          <CardContent className="p-0">
            <form action={signOut}>
              <button
                type="submit"
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-red-600 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Keluar dari Akun</span>
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

