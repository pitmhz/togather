// User role utilities for access control
// Hardcoded owner + temp admin check

import { createClient } from "@/lib/supabase/server";

const OWNER_EMAIL = "pietermardi@gmail.com";

/**
 * Check if the given email belongs to the permanent owner
 * @param email - User's email address
 * @returns true if the user is the owner
 */
export function isOwner(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase() === OWNER_EMAIL.toLowerCase();
}

/**
 * Synchronous check - only checks owner status (use in client components)
 * For full leader check including temp admin, use isLeaderAsync on server
 */
export function isLeader(email: string | null | undefined): boolean {
  return isOwner(email);
}

/**
 * Get user role details (synchronous, for client components)
 * @param email - User's email address
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
 * Check if user has temporary admin privileges (server-side only)
 * @param email - User's email address
 * @returns Promise<boolean>
 */
export async function checkTempAdmin(email: string | null | undefined): Promise<boolean> {
  if (!email) return false;
  if (isOwner(email)) return true; // Owner always has access
  
  const supabase = await createClient();
  
  const { data: member } = await supabase
    .from("members")
    .select("temp_admin_until")
    .eq("email", email.toLowerCase())
    .single();
  
  if (!member?.temp_admin_until) return false;
  
  return new Date(member.temp_admin_until) > new Date();
}

/**
 * Full leader check including temp admin (server-side only)
 * @param email - User's email address
 * @returns Promise with isLeader status and details
 */
export async function isLeaderAsync(email: string | null | undefined): Promise<{
  isLeader: boolean;
  isOwner: boolean;
  isTempAdmin: boolean;
  roleLabel: string;
}> {
  if (!email) {
    return { isLeader: false, isOwner: false, isTempAdmin: false, roleLabel: "Guest" };
  }
  
  const owner = isOwner(email);
  if (owner) {
    return { isLeader: true, isOwner: true, isTempAdmin: false, roleLabel: "Cell Group Leader" };
  }
  
  const tempAdmin = await checkTempAdmin(email);
  return {
    isLeader: tempAdmin,
    isOwner: false,
    isTempAdmin: tempAdmin,
    roleLabel: tempAdmin ? "👑 Acting Leader" : "Member Komsel",
  };
}

