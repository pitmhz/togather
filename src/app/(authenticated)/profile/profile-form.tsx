"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Cake, Users, Brain, Sparkles } from "lucide-react";

import { updateProfile, type ActionState } from "./actions";
import { MbtiPicker } from "@/components/mbti-picker";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Profile = {
  full_name: string | null;
  phone_number: string | null;
  address: string | null;
  maps_link: string | null;
  gender: string | null;
  birth_date: string | null;
  mbti: string | null;
  mbti_summary: string | null;
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
  const [gender, setGender] = useState<string>(profile?.gender || "");

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

      {/* Demographics Section */}
      <section>
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4 border-b border-gray-200 dark:border-zinc-700 pb-2">
          Data Pribadi
        </h3>
        <div className="space-y-4">
          {/* Gender */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Gender
            </Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setGender("L")}
                className={`flex-1 py-2 px-3 rounded-md border text-sm font-medium transition-colors ${
                  gender === "L" 
                    ? "bg-blue-100 border-blue-300 text-blue-700" 
                    : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                👨 Laki-laki
              </button>
              <button
                type="button"
                onClick={() => setGender("P")}
                className={`flex-1 py-2 px-3 rounded-md border text-sm font-medium transition-colors ${
                  gender === "P" 
                    ? "bg-pink-100 border-pink-300 text-pink-700" 
                    : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                👩 Perempuan
              </button>
            </div>
            <input type="hidden" name="gender" value={gender} />
          </div>

          {/* Birthday */}
          <div className="space-y-2">
            <Label htmlFor="birth_date" className="flex items-center gap-2">
              <Cake className="w-4 h-4" />
              Tanggal Lahir
            </Label>
            <Input
              id="birth_date"
              name="birth_date"
              type="date"
              defaultValue={profile?.birth_date || ""}
              className="bg-white dark:bg-zinc-900"
            />
          </div>
        </div>
      </section>

      {/* MBTI Section */}
      <section>
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4 border-b border-gray-200 dark:border-zinc-700 pb-2 flex items-center gap-2">
          <Brain className="w-4 h-4" />
          Kepribadian (MBTI)
        </h3>
        <div className="space-y-4">
          {/* External Test Link */}
          <MbtiPicker />

          {/* MBTI Select */}
          <div className="space-y-2">
            <Label htmlFor="mbti">Tipe MBTI</Label>
            <Select name="mbti" defaultValue={profile?.mbti || ""}>
              <SelectTrigger className="bg-white dark:bg-zinc-900">
                <SelectValue placeholder="Pilih tipe MBTI..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INTJ">INTJ - Architect</SelectItem>
                <SelectItem value="INTP">INTP - Logician</SelectItem>
                <SelectItem value="ENTJ">ENTJ - Commander</SelectItem>
                <SelectItem value="ENTP">ENTP - Debater</SelectItem>
                <SelectItem value="INFJ">INFJ - Advocate</SelectItem>
                <SelectItem value="INFP">INFP - Mediator</SelectItem>
                <SelectItem value="ENFJ">ENFJ - Protagonist</SelectItem>
                <SelectItem value="ENFP">ENFP - Campaigner</SelectItem>
                <SelectItem value="ISTJ">ISTJ - Logistician</SelectItem>
                <SelectItem value="ISFJ">ISFJ - Defender</SelectItem>
                <SelectItem value="ESTJ">ESTJ - Executive</SelectItem>
                <SelectItem value="ESFJ">ESFJ - Consul</SelectItem>
                <SelectItem value="ISTP">ISTP - Virtuoso</SelectItem>
                <SelectItem value="ISFP">ISFP - Adventurer</SelectItem>
                <SelectItem value="ESTP">ESTP - Entrepreneur</SelectItem>
                <SelectItem value="ESFP">ESFP - Entertainer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* MBTI Summary Display */}
          {profile?.mbti_summary && (
            <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-purple-700">Analisa AI</span>
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                {profile.mbti_summary}
              </div>
              <p className="text-xs text-purple-500 mt-3">
                ✨ Simpan profil untuk refresh analisa jika MBTI berubah
              </p>
            </div>
          )}
        </div>
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
