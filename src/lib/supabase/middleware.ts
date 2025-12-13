/**
 * Supabase Middleware for Session Management
 * 
 * SECURITY RESPONSIBILITIES:
 * 1. Refresh auth tokens on every request (keeps cookies alive)
 * 2. Enforce route protection for authenticated pages
 * 3. Redirect unauthenticated users away from protected routes
 * 
 * IMPORTANT: This middleware runs on Edge, not Node.js
 */

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            // Apply strict cookie security in middleware as well
            const secureOptions: CookieOptions = {
              ...options,
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
            };
            supabaseResponse.cookies.set(name, value, secureOptions);
          });
        },
      },
    }
  );

  // CRITICAL: Refresh the auth token on every request
  // This keeps the session alive and updates the cookie
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Route Protection Logic
  const { pathname } = request.nextUrl;

  // Define protected routes (require authentication)
  const protectedRoutes = ["/dashboard", "/members", "/events", "/profile", "/tools", "/features"];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // Define auth routes (shouldn't be accessible when logged in)
  const isAuthRoute = pathname === "/login" || pathname === "/onboarding";

  // SECURITY: Redirect unauthenticated users away from protected routes
  if (!user && isProtectedRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    // Preserve the original URL for post-login redirect
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // UX: Redirect authenticated users away from login page
  if (user && isAuthRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
