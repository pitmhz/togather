"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import { updateProfile, type ActionState } from "./actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Profile = {
  full_name: string | null;
  phone_number: string | null;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
      disabled={pending}
    >
      {pending ? "Menyimpan..." : "Simpan"}
    </Button>
  );
}

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    updateProfile,
    null
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
    } else if (state?.success === false) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="full_name">Nama Lengkap *</Label>
        <Input
          id="full_name"
          name="full_name"
          placeholder="contoh: Pieter Mardi"
          defaultValue={profile?.full_name || ""}
          required
        />
        <p className="text-xs text-muted-foreground">
          Nama ini akan muncul di Laporan Coach
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone_number">No. WhatsApp</Label>
        <Input
          id="phone_number"
          name="phone_number"
          type="tel"
          placeholder="contoh: 081234567890"
          defaultValue={profile?.phone_number || ""}
        />
      </div>
      <SubmitButton />
    </form>
  );
}
