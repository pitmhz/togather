import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LogOut, User } from "lucide-react";

import { signOut } from "@/app/(authenticated)/dashboard/actions";
import { ClaimAdminButton } from "./claim-admin-button";
import { ProfileForm } from "./profile-form";
import { SecurityForm } from "./security-form";
import { PrivacyControl } from "@/components/privacy-control";
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
    .select("full_name, phone_number, address, maps_link, gender, birth_date, mbti, mbti_summary")
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

        {/* Privacy & Data Control */}
        <PrivacyControl />

        {/* Spacer */}
        <div className="flex-1 min-h-8" />

        {/* Footer - Logout & Version */}
        <div className="text-center mt-8 pb-4 space-y-4">
          {/* Bootstrap Admin (Dev Only) */}
          <ClaimAdminButton />

          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 text-sm text-red-600 opacity-60 hover:opacity-100 transition-opacity"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar dari Akun</span>
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-3">
            Togather Beta v1.1.0 · <a href="/privacy" className="underline hover:text-gray-500">Kebijakan Privasi</a>
          </p>
        </div>
      </div>
    </main>
  );
}

