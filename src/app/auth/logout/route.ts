import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Logout Route - Clears Supabase session and all auth cookies
 * GET /auth/logout
 */
export async function GET(request: Request) {
  const supabase = await createClient();
  
  // Sign out from Supabase (invalidates session)
  await supabase.auth.signOut();
  
  // Clear all Supabase cookies manually
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  
  // Create response that redirects to login
  const response = NextResponse.redirect(new URL("/login", request.url));
  
  // Delete all cookies that might be related to Supabase auth
  for (const cookie of allCookies) {
    if (
      cookie.name.includes("supabase") ||
      cookie.name.includes("sb-") ||
      cookie.name.includes("auth")
    ) {
      response.cookies.delete(cookie.name);
    }
  }
  
  // Also set explicit deletion for common Supabase cookie names
  response.cookies.delete("sb-access-token");
  response.cookies.delete("sb-refresh-token");
  
  return response;
}
