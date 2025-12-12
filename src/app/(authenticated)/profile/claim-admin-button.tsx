"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { claimAdmin } from "./admin-action";

export function ClaimAdminButton() {
  const [isPending, startTransition] = useTransition();

  const handleClaim = () => {
    startTransition(async () => {
      const result = await claimAdmin();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <button
      onClick={handleClaim}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 text-xs text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors disabled:opacity-50"
    >
      <span>{isPending ? "Claiming..." : "👑 Claim Admin Access"}</span>
    </button>
  );
}
