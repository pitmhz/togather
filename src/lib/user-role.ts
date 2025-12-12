// User role utilities for access control
// Database-based RBAC with fallback to hardcoded owner

import { createClient } from "@/lib/supabase/server";

const OWNER_EMAIL = "pietermardi@gmail.com";

/**
 * Check if the given email belongs to the permanent owner (fallback)
 * @param email - User's email address
 * @returns true if the user is the owner
 */
export function isOwner(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase() === OWNER_EMAIL.toLowerCase();
}

/**
 * Synchronous check - only checks owner status (use in client components)
 * For full admin check, use isAdminAsync on server
 * @deprecated Use isAdminAsync for proper DB-based role check
 */
export function isLeader(email: string | null | undefined): boolean {
  return isOwner(email);
}

/**
 * Get user role details (synchronous, for client components)
 * @param email - User's email address
 * @deprecated Use getUserRoleAsync for proper DB-based role check
 */
export function getUserRole(email: string | null | undefined) {
  const leader = isOwner(email);
  return {
    isLeader: leader,
    isOwner: leader,
    roleLabel: leader ? "Cell Group Leader" : "Member Komsel",
  };
}

/**
 * Check if user is admin in their group (server-side only)
 * This is the PREFERRED method for role checking
 * @param email - User's email address
 * @returns Promise<boolean>
 */
export async function isAdminAsync(email: string | null | undefined): Promise<boolean> {
  if (!email) return false;
  
  // Fallback: Owner is always admin
  if (isOwner(email)) return true;
  
  const supabase = await createClient();
  
  // Check database role column
  const { data: member } = await supabase
    .from("members")
    .select("role, temp_admin_until")
    .eq("email", email.toLowerCase())
    .single();
  
  // Check explicit admin role
  if (member?.role === "admin") return true;
  
  // Check temp admin (legacy support)
  if (member?.temp_admin_until) {
    return new Date(member.temp_admin_until) > new Date();
  }
  
  return false;
}

/**
 * Full role details (server-side only)
 * @param email - User's email address
 * @returns Promise with role details
 */
export async function getUserRoleAsync(email: string | null | undefined): Promise<{
  isAdmin: boolean;
  isOwner: boolean;
  isTempAdmin: boolean;
  role: "admin" | "member" | "guest";
  roleLabel: string;
}> {
  if (!email) {
    return { isAdmin: false, isOwner: false, isTempAdmin: false, role: "guest", roleLabel: "Guest" };
  }
  
  const ownerStatus = isOwner(email);
  if (ownerStatus) {
    return { 
      isAdmin: true, 
      isOwner: true, 
      isTempAdmin: false, 
      role: "admin",
      roleLabel: "Cell Group Leader" 
    };
  }
  
  const supabase = await createClient();
  
  const { data: member } = await supabase
    .from("members")
    .select("role, temp_admin_until")
    .eq("email", email.toLowerCase())
    .single();
  
  // Check explicit admin role
  if (member?.role === "admin") {
    return {
      isAdmin: true,
      isOwner: false,
      isTempAdmin: false,
      role: "admin",
      roleLabel: "Admin"
    };
  }
  
  // Check temp admin
  const isTempAdmin = member?.temp_admin_until 
    ? new Date(member.temp_admin_until) > new Date()
    : false;
  
  if (isTempAdmin) {
    return {
      isAdmin: true,
      isOwner: false,
      isTempAdmin: true,
      role: "admin",
      roleLabel: "👑 Acting Leader"
    };
  }
  
  return {
    isAdmin: false,
    isOwner: false,
    isTempAdmin: false,
    role: "member",
    roleLabel: "Member Komsel"
  };
}

// Legacy alias for backward compatibility
export const isLeaderAsync = isAdminAsync;
export const checkTempAdmin = isAdminAsync;
