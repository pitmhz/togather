import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LogOut, Settings } from "lucide-react";

import { signOut } from "@/app/(authenticated)/dashboard/actions";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userEmail = user.email || "User";

  return (
    <main className="min-h-screen flex flex-col pb-24">
      {/* Header */}
      <header className="p-4 border-b border-border">
        <h1 className="text-xl font-heading font-semibold text-foreground">
          Profil
        </h1>
      </header>

      {/* Content */}
      <div className="flex-1 p-4">
        {/* User Info Card */}
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Akun
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-950 rounded-full flex items-center justify-center">
                <span className="text-xl font-semibold text-indigo-600">
                  {userEmail.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-foreground">{userEmail}</p>
                <p className="text-sm text-muted-foreground">Cell Group Leader</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
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
