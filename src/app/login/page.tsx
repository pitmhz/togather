"use client";

import { useActionState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { useEffect } from "react";

import { login, signInAsDev, type LoginState } from "./actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-md"
      disabled={pending}
    >
      {pending ? "Mengirim..." : "Lanjutkan dengan Email"}
    </Button>
  );
}

function DevLoginButton({ 
  email, 
  label, 
  icon 
}: { 
  email: string; 
  label: string; 
  icon: string;
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
      className="w-full h-11 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 font-medium rounded-md"
      onClick={handleClick}
      disabled={isPending}
    >
      <span className="mr-2">{icon}</span>
      {isPending ? "Logging in..." : label}
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState<LoginState, FormData>(login, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
    } else if (state?.success === false) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <main className="min-h-screen flex flex-col items-center pt-16 md:pt-24 px-4 bg-white dark:bg-zinc-950">
      <div className="w-full max-w-[400px] space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="text-5xl mb-4">🤝</div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            Log in to Togather
          </h1>
          <p className="text-zinc-500 text-sm">
            Kelola jadwal dan absensi komsel dengan mudah.
          </p>
        </div>

        {/* Magic Link Form */}
        <form action={formAction} className="space-y-3">
          <Input
            name="email"
            type="email"
            placeholder="Masukkan email kamu"
            required
            autoComplete="email"
            className="h-11 px-4 border-zinc-200 rounded-md focus:ring-zinc-900 focus:border-zinc-900"
          />
          <SubmitButton />
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-zinc-950 px-2 text-zinc-500">
              atau
            </span>
          </div>
        </div>

        {/* Dev Login Buttons */}
        <div className="space-y-3">
          <DevLoginButton 
            email="pietermardi@gmail.com" 
            label="Login as Leader (Serlie)" 
            icon="👤"
          />
          <DevLoginButton 
            email="212011557@stis.ac.id" 
            label="Login as Member" 
            icon="👋"
          />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-zinc-400">
          Dengan melanjutkan, kamu menyetujui{" "}
          <span className="underline cursor-pointer">Ketentuan Layanan</span>
          {" "}dan{" "}
          <span className="underline cursor-pointer">Kebijakan Privasi</span>.
        </p>
      </div>
    </main>
  );
}
