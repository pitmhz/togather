"use client";

import { useActionState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { useEffect } from "react";
import { Mail, User, Users } from "lucide-react";

import { login, signInAsDev, type LoginState } from "./actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full h-11 bg-[#191919] hover:bg-[#2F2F2F] text-white font-medium rounded-md transition-colors"
      disabled={pending}
    >
      <Mail className="w-4 h-4 mr-2" />
      {pending ? "Mengirim..." : "Lanjutkan dengan Email"}
    </Button>
  );
}

function AuthButton({ 
  email, 
  label, 
  icon: Icon
}: { 
  email: string; 
  label: string; 
  icon: React.ElementType;
}) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = await signInAsDev(email);
      if (result?.success === false) {
        toast.error(result.message);
      }
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full h-11 bg-white hover:bg-[#F7F7F5] border border-[#E3E3E3] text-[#37352F] font-medium rounded-md transition-colors"
      onClick={handleClick}
      disabled={isPending}
    >
      <Icon className="w-4 h-4 mr-2 text-[#9B9A97]" />
      {isPending ? "Logging in..." : label}
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState<LoginState, FormData>(login, null);

  useEffect(() => {
    if (state?.success) {
      toast.success("Magic Link terkirim! Cek email kamu. 📧");
    } else if (state?.success === false) {
      toast.error(state.message + " ❌");
    }
  }, [state]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      <div className="w-full max-w-[340px] space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="text-4xl mb-3">🤝</div>
          <h1 className="text-[28px] font-semibold text-[#37352F] tracking-tight">
            Log in to Togather
          </h1>
          <p className="text-[#9B9A97] text-sm">
            Kelola jadwal dan absensi komsel dengan mudah.
          </p>
        </div>

        {/* Magic Link Form */}
        <form action={formAction} className="space-y-3">
          <Input
            name="email"
            type="email"
            placeholder="Masukkan email kamu..."
            required
            autoComplete="email"
            className="h-11 px-3 bg-[#F7F7F5] border-[#E3E3E3] rounded-md text-[#37352F] placeholder:text-[#9B9A97] focus:ring-2 focus:ring-[#2383E2] focus:border-transparent"
          />
          <SubmitButton />
        </form>

        {/* Divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E3E3E3]" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-[#9B9A97] uppercase tracking-wide">
              atau
            </span>
          </div>
        </div>

        {/* Dev Login Buttons */}
        <div className="space-y-2">
          <AuthButton 
            email="pietermardi@gmail.com" 
            label="Login as Leader (Serlie)" 
            icon={User}
          />
          <AuthButton 
            email="212011557@stis.ac.id" 
            label="Login as Member" 
            icon={Users}
          />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#9B9A97] pt-4">
          Dengan melanjutkan, kamu menyetujui{" "}
          <span className="underline cursor-pointer hover:text-[#37352F]">Ketentuan Layanan</span>
          {" "}dan{" "}
          <a href="/privacy" className="underline hover:text-[#37352F]">Kebijakan Privasi</a>.
        </p>
      </div>
    </main>
  );
}
