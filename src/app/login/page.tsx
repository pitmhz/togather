"use client";

import { useActionState, useTransition, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";
import { Mail, ArrowRight, Ticket, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { login, signInAsDev, type LoginState } from "./actions";
import { redeemInviteCode } from "@/app/actions/demo";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full h-14"
      disabled={pending}
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Mengirim...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          Continue with Email
          <ArrowRight className="w-4 h-4" />
        </span>
      )}
    </Button>
  );
}

function InviteCodeSection({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error("Masukkan kode undangan");
      return;
    }

    startTransition(async () => {
      const result = await redeemInviteCode(code);
      if (result.success) {
        toast.success(result.message);
        if (result.redirectTo) {
          router.push(result.redirectTo);
        }
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="space-y-4 pt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500 block">
                Kode Undangan
              </label>
              <Input
                type="text"
                placeholder="Contoh: GMS-BETA..."
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="text-center font-mono tracking-widest uppercase"
                disabled={isPending}
              />
            </div>
            <Button
              type="submit"
              className="w-full h-14"
              disabled={isPending || !code.trim()}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyiapkan...
                </>
              ) : (
                "Masuk dengan Kode"
              )}
            </Button>
            <button
              type="button"
              onClick={onToggle}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-700 py-2"
            >
              ← Kembali
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState<LoginState, FormData>(login, null);
  const [showInviteCode, setShowInviteCode] = useState(false);

  useEffect(() => {
    if (state?.success) {
      toast.success("Magic Link terkirim! Cek email kamu. 📧");
    } else if (state?.success === false) {
      toast.error(state.message + " ❌");
    }
  }, [state]);

  const isDev = process.env.NODE_ENV === "development";

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-white via-gray-50/50 to-gray-100/30 relative overflow-hidden">
      {/* Subtle Decorative Blur */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-purple-100/20 to-blue-100/20 rounded-full blur-3xl" />

      {/* Content - Centered Bottom Sheet Style */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          {/* Bottom Sheet Container */}
          <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-8">
            {/* Logo & Branding */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-sm mb-5"
              >
                <span className="text-3xl">🤝</span>
              </motion.div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Get Started
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Masuk atau daftar untuk melanjutkan
              </p>
            </div>

            {/* Main Content - Toggle between Email and Invite */}
            <AnimatePresence mode="wait">
              {!showInviteCode ? (
                <motion.div
                  key="email-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Magic Link Form */}
                  <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500 block">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          name="email"
                          type="email"
                          placeholder="nama@email.com"
                          required
                          autoComplete="email"
                          className="pl-12"
                        />
                      </div>
                    </div>
                    <SubmitButton />
                  </form>

                  {/* Success State Hint */}
                  {state?.success && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-emerald-50 rounded-2xl text-center"
                    >
                      <p className="text-sm text-emerald-700">
                        ✨ Cek inbox email kamu untuk link login
                      </p>
                    </motion.div>
                  )}

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-100" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-4 text-xs text-gray-400 uppercase tracking-wider">
                        atau
                      </span>
                    </div>
                  </div>

                  {/* Invite Code Button */}
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full h-14"
                    onClick={() => setShowInviteCode(true)}
                  >
                    <Ticket className="w-4 h-4 mr-2" />
                    Use Invite Code
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="invite-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <InviteCodeSection
                    isOpen={true}
                    onToggle={() => setShowInviteCode(false)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dev Login (only in development) */}
            {isDev && (
              <div className="mt-6 pt-4 border-t border-dashed border-gray-200">
                <p className="text-xs text-gray-400 text-center mb-3">
                  🛠️ Dev Mode Only
                </p>
                <DevLoginButtons />
              </div>
            )}
          </div>

          {/* Sign Up Link - Outside the card */}
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Belum punya akun?{" "}
              <Link
                href="/onboarding"
                className="text-foreground font-medium hover:underline"
              >
                Daftar
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-10 pb-8 text-center">
        <p className="text-xs text-gray-400">
          Dengan melanjutkan, kamu menyetujui{" "}
          <span className="underline cursor-pointer hover:text-gray-600">
            Ketentuan Layanan
          </span>{" "}
          dan{" "}
          <Link href="/privacy" className="underline hover:text-gray-600">
            Kebijakan Privasi
          </Link>
          .
        </p>
      </div>
    </main>
  );
}

function DevLoginButtons() {
  const [isPending1, startTransition1] = useTransition();
  const [isPending2, startTransition2] = useTransition();

  const handleDevLogin = (email: string, startTransition: typeof startTransition1) => {
    startTransition(async () => {
      const result = await signInAsDev(email);
      if (result?.success === false) {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="flex-1 text-xs"
        onClick={() => handleDevLogin("pietermardi@gmail.com", startTransition1)}
        disabled={isPending1}
      >
        {isPending1 ? "..." : "Leader"}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="flex-1 text-xs"
        onClick={() => handleDevLogin("212011557@stis.ac.id", startTransition2)}
        disabled={isPending2}
      >
        {isPending2 ? "..." : "Member"}
      </Button>
    </div>
  );
}
