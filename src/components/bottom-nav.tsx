import { createClient } from "@/lib/supabase/server";
import { isAdminAsync } from "@/lib/user-role";
import { BottomNavClient } from "./bottom-nav-client";

export async function BottomNav() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch user profile for avatar
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const isAdmin = await isAdminAsync(user?.email);
  const displayName = profile?.full_name || user.email || "User";

  return (
    <BottomNavClient
      isAdmin={isAdmin}
      userName={displayName}
    />
  );
}
