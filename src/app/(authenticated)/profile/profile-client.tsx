"use client";

import { ReactNode } from "react";

type ProfileClientProps = {
  type: "locale";
  profile: {
    locale?: string | null;
  };
  userEmail: string;
  children: ReactNode;
};

/**
 * ProfileClient - A client wrapper for interactive profile elements
 * Currently supports locale switching (can be expanded for other settings)
 */
export function ProfileClient({ type, profile, userEmail, children }: ProfileClientProps) {
  // For now, just render children - locale editing is done in ProfileForm
  // This is a placeholder for future interactive settings
  return <>{children}</>;
}
