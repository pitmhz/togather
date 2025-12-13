/**
 * Supabase Middleware for Session Management
 * 
 * SECURITY RESPONSIBILITIES:
 * 1. Refresh auth tokens on every request (keeps cookies alive)
 * 2. Enforce route protection for authenticated pages
 * 3. Redirect unauthenticated users away from protected routes
 * 4. Enforce onboarding completion for new users
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

  // ===== ROUTE DEFINITIONS =====
  // Protected routes (require authentication AND completed onboarding)
  const protectedRoutes = ["/dashboard", "/profile", "/members", "/events", "/tools", "/features"];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // Public routes (accessible without authentication)
  const publicRoutes = ["/login", "/auth/callback", "/error", "/intro", "/privacy"];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Onboarding route (requires authentication, but NOT completed onboarding)
  const isOnboardingRoute = pathname.startsWith("/onboarding");
  
  // Root URL
  const isRootPath = pathname === "/";

  // ===== STEP 1: NO SESSION (Not logged in) =====
  if (!user) {
    // Allow access to public routes (login, auth callback, error pages)
    if (isPublicRoute) {
      return supabaseResponse;
    }
    
    // Root path -> redirect to login
    if (isRootPath) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      return NextResponse.redirect(redirectUrl);
    }
    
    // Protected routes OR onboarding -> redirect to login with redirect param
    if (isProtectedRoute || isOnboardingRoute) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }
    
    // Any other route without session -> redirect to login
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }

  // ===== STEP 2: HAS SESSION (Logged in) =====
  // Fetch user's onboarding status from profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_onboarded")
    .eq("id", user.id)
    .single();

  const isOnboarded = profile?.is_onboarded ?? false;

  // ===== STEP 2A: NOT ONBOARDED =====
  if (!isOnboarded) {
    // Already on onboarding page -> allow
    if (isOnboardingRoute) {
      return supabaseResponse;
    }
    
    // Trying to access protected routes, root, or anywhere else -> redirect to onboarding
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/onboarding";
    return NextResponse.redirect(redirectUrl);
  }

  // ===== STEP 2B: ONBOARDED (Completed setup) =====
  // Redirect away from login, onboarding, and root to dashboard
  if (isPublicRoute || isOnboardingRoute || isRootPath) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  // Allow access to protected routes
  return supabaseResponse;
}
