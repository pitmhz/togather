"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import { updateProfile, type ActionState } from "./actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Profile = {
  full_name: string | null;
  phone_number: string | null;
  address: string | null;
  maps_link: string | null;
};

type ProfileFormProps = {
  profile: Profile | null;
  userEmail: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
      disabled={pending}
    >
      {pending ? "Menyimpan..." : "Simpan Perubahan"}
    </Button>
  );
}

// Split full_name into first and last name for display
function splitName(fullName: string | null): { firstName: string; lastName: string } {
  if (!fullName) return { firstName: "", lastName: "" };
  const parts = fullName.trim().split(" ");
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || "";
  return { firstName, lastName };
}

export function ProfileForm({ profile, userEmail }: ProfileFormProps) {
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

  const { firstName, lastName } = splitName(profile?.full_name || null);

  return (
    <form action={formAction} className="space-y-8">
      {/* Personal Info Section */}
      <section>
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4 border-b border-gray-200 dark:border-zinc-700 pb-2">
          Informasi Pribadi
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">Nama Depan *</Label>
            <Input
              id="first_name"
              name="first_name"
              placeholder="Pieter"
              defaultValue={firstName}
              required
              className="bg-white dark:bg-zinc-900"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Nama Belakang</Label>
            <Input
              id="last_name"
              name="last_name"
              placeholder="Mardi"
              defaultValue={lastName}
              className="bg-white dark:bg-zinc-900"
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Nama ini akan muncul di Laporan Coach
        </p>
      </section>

      {/* Contact Section */}
      <section>
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4 border-b border-gray-200 dark:border-zinc-700 pb-2">
          Kontak
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={userEmail}
              disabled
              className="bg-gray-100 dark:bg-zinc-800 text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">
              Email tidak dapat diubah
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone_number">Nomor WhatsApp</Label>
            <Input
              id="phone_number"
              name="phone_number"
              type="tel"
              placeholder="081234567890"
              defaultValue={profile?.phone_number || ""}
              className="bg-white dark:bg-zinc-900"
            />
          </div>
        </div>
      </section>

      {/* Home Address Section */}
      <section>
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4 border-b border-gray-200 dark:border-zinc-700 pb-2">
          Alamat Rumah
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Alamat Lengkap</Label>
            <Textarea
              id="address"
              name="address"
              rows={3}
              placeholder="Jl. Sudirman No. 123, RT 01/RW 02, Kelurahan ABC, Jakarta Selatan"
              defaultValue={profile?.address || ""}
              className="bg-white dark:bg-zinc-900 resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maps_link">Link Google Maps</Label>
            <Input
              id="maps_link"
              name="maps_link"
              type="url"
              placeholder="https://goo.gl/maps/..."
              defaultValue={profile?.maps_link || ""}
              className="bg-white dark:bg-zinc-900"
            />
            <p className="text-xs text-muted-foreground">
              Paste link lokasi rumahmu agar mudah dicari saat visitasi
            </p>
          </div>
        </div>
      </section>

      <SubmitButton />
    </form>
  );
}
