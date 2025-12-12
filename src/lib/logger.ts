"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Log an activity to the audit trail
 * Should be called from server actions for critical operations
 * 
 * @param action - Action type (e.g., "CREATE_EVENT", "UPDATE_PROFILE")
 * @param details - Human-readable description of what was done
 */
export async function logActivity(action: string, details: string): Promise<void> {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn("[logActivity] No user session, skipping log");
      return;
    }
    
    // Get user's name for the snapshot
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();
    
    const userName = profile?.full_name || user.email || "Unknown User";
    
    // Insert audit log
    const { error } = await supabase
      .from("audit_logs")
      .insert({
        user_id: user.id,
        user_name: userName,
        action,
        details,
      });
    
    if (error) {
      // Silently log errors - don't break main app flow
      console.error("[logActivity] Failed to insert audit log:", error);
    }
  } catch (error) {
    // Silently handle any errors - logging should never break the app
    console.error("[logActivity] Error:", error);
  }
}

/**
 * Fetch audit logs for admin viewing
 * Only returns results if user is admin (enforced by RLS)
 * 
 * @param limit - Maximum number of logs to return (default 20)
 * @returns Array of audit logs or empty array
 */
export async function getAuditLogs(limit: number = 20) {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error("[getAuditLogs] Error:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("[getAuditLogs] Error:", error);
    return [];
  }
}
