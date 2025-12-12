"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { EyeOff, Eye } from "lucide-react";

import { updatePassword, updatePrivacyMask, type ActionState } from "./actions";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type SecurityFormProps = {
  userData?: {
    firstName?: string;
    lastName?: string;
  };
  privacyMasked?: boolean;
};

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full"
      disabled={pending || disabled}
    >
      {pending ? "Menyimpan..." : "Update Kata Sandi"}
    </Button>
  );
}

export function SecurityForm({ userData, privacyMasked = false }: SecurityFormProps) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    updatePassword,
    null
  );
  const [password, setPassword] = useState("");
  const [isMasked, setIsMasked] = useState(privacyMasked);
  const [isUpdatingMask, setIsUpdatingMask] = useState(false);

  useEffect(() => {
    if (state?.success) {
      toast.success("Kata sandi berhasil diubah! 🔐");
      setPassword(""); // Clear password on success
    } else if (state?.success === false) {
      toast.error(state.message + " ❌");
    }
  }, [state]);

  // Handle privacy mask toggle
  const handlePrivacyToggle = async (checked: boolean) => {
    setIsMasked(checked);
    setIsUpdatingMask(true);

    const result = await updatePrivacyMask(checked);

    setIsUpdatingMask(false);

    if (result?.success) {
      toast.success(result.message);
    } else {
      // Revert on failure
      setIsMasked(!checked);
      toast.error(result?.message || "Gagal update");
    }
  };

  // Calculate if password is strong enough
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const isLongEnough = password.length >= 6;
  const isStrongEnough = isLongEnough && (hasSymbol || hasNumber || hasUppercase);

  return (
    <div className="space-y-6">
      {/* Privacy Shield Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isMasked ? (
            <EyeOff className="w-5 h-5 text-emerald-500" />
          ) : (
            <Eye className="w-5 h-5 text-neutral-400" />
          )}
          <div>
            <p className="text-sm font-medium text-neutral-900">Samarkan Info Pribadi</p>
            <p className="text-xs text-neutral-500">Sembunyikan detail kontak saat profil dilihat</p>
          </div>
        </div>
        <Switch
          checked={isMasked}
          onCheckedChange={handlePrivacyToggle}
          disabled={isUpdatingMask}
          className="data-[state=checked]:bg-emerald-500"
        />
      </div>

      <div className="h-px bg-neutral-100" />

      {/* Password Section */}
      <form action={formAction} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs text-neutral-500">
            Kata Sandi Baru
          </Label>
          <PasswordInput
            value={password}
            onChange={setPassword}
            userData={userData}
            placeholder="Masukkan kata sandi baru"
          />
          {/* Hidden input to pass value to form action */}
          <input type="hidden" name="password" value={password} />
        </div>

        <p className="text-xs text-neutral-400">
          Setelah set password, kamu bisa login dengan email + password
        </p>

        <SubmitButton disabled={!isStrongEnough} />
      </form>
    </div>
  );
}
