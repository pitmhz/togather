"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Dna, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { seedMemberData } from "./actions";

interface SeedButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
}

export function SeedButton({ variant = "default", className }: SeedButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleSeed = () => {
    if (!confirm("Yakin mau generate data dummy? Ini akan mengubah data member yang kosong dengan data acak.")) {
      return;
    }

    startTransition(async () => {
      const result = await seedMemberData();
      if (result?.success) {
        toast.success(result.message);
      } else {
        toast.error(result?.message || "Gagal generate data.");
      }
    });
  };

  return (
    <Button 
      onClick={handleSeed} 
      disabled={isPending}
      variant={variant}
      className={className}
    >
      {isPending ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Dna className="w-4 h-4 mr-2" />
          🌱 Seed Random Data
        </>
      )}
    </Button>
  );
}
