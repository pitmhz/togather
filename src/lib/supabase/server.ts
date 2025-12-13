/**
 * Supabase Server Client
 * 
 * SECURITY REMINDERS:
 * - All Supabase tables MUST have Row Level Security (RLS) enabled
 * - NEVER expose the service_role key on the client side
 * - Always use this client for server-side operations (RSC, Routes, Actions)
 * - The anon key is safe for client-side use with RLS protections
 */

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Apply strict security settings to all cookies
              const secureOptions: CookieOptions = {
                ...options,
                httpOnly: true, // CRITICAL: Prevent XSS from reading cookies
                secure: process.env.NODE_ENV === "production", // HTTPS only in prod
                sameSite: "lax", // CSRF protection
                maxAge: options?.maxAge || 60 * 60 * 24 * 7, // 1 week default
                path: "/", // Ensure cookie is available site-wide
              };
              cookieStore.set(name, value, secureOptions);
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
