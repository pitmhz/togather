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
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
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

/**
 * Admin Client - Bypasses RLS using Service Role Key
 * 
 * USE WITH CAUTION:
 * - Only use for admin operations where RLS would block legitimate actions
 * - Examples: onboarding registration, admin bulk operations
 * - NEVER expose to client-side code
 * - Always validate user identity via auth before using
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
  }

  return createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

