"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Lock } from "lucide-react";
import { toast } from "sonner";

import { updatePassword, type ActionState } from "./actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="bg-indigo-600 hover:bg-indigo-700 text-white"
      disabled={pending}
    >
      {pending ? "Menyimpan..." : "Simpan Password"}
    </Button>
  );
}

export function SecurityForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(
    updatePassword,
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
    <section>
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4 border-b border-gray-200 dark:border-zinc-700 pb-2 flex items-center gap-2">
        <Lock className="w-4 h-4" />
        Keamanan Akun
      </h3>
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Password Baru</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Min 6 karakter"
            minLength={6}
            required
            className="bg-white dark:bg-zinc-900"
          />
          <p className="text-xs text-muted-foreground">
            Setelah set password, kamu bisa login dengan email + password
          </p>
        </div>
        <SubmitButton />
      </form>
    </section>
  );
}
