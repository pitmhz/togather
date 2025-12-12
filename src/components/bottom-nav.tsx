import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { headers } from "next/headers";
import { Home, PlusCircle, Users, Sparkles } from "lucide-react";

import { isAdminAsync } from "@/lib/user-role";
import { BottomNavClient } from "./bottom-nav-client";

export async function BottomNav() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin = await isAdminAsync(user?.email);

  return <BottomNavClient isAdmin={isAdmin} />;
}
