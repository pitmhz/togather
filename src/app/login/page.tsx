"use client";

import { useActionState, useTransition, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";
import { Mail, ArrowRight, Ticket, Loader2, ChevronDown } from "lucide-react";
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
      className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-xl transition-all shadow-lg shadow-neutral-200"
      disabled={pending}
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Mengirim...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          Lanjutkan dengan Email
          <ArrowRight className="w-4 h-4" />
        </span>
      )}
    </Button>
  );
}

function InviteCodeSection() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
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
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 transition-colors py-2"
      >
        <Ticket className="w-4 h-4" />
        <span>Masuk pakai kode undangan</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-purple-100 rounded-lg">
                  <Ticket className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-purple-900">Sandbox Beta Pass</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                  type="text"
                  placeholder="GMS-BETA..."
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="text-center font-mono tracking-widest uppercase bg-white border-purple-200 focus:ring-purple-500"
                  disabled={isPending}
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl"
                  disabled={isPending || !code.trim()}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Menyiapkan Sandbox...
                    </>
                  ) : (
                    "Masuk Sandbox"
                  )}
                </Button>
              </form>

              <p className="text-[10px] text-purple-400 text-center mt-2">
                Kode didapat dari undangan atau event Togather
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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

  const isDev = process.env.NODE_ENV === "development";

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50/50 via-white to-rose-50/30 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-orange-200/30 to-rose-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-amber-200/30 to-orange-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Logo & Branding */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg shadow-neutral-200/50 mb-5"
            >
              <span className="text-3xl">🤝</span>
            </motion.div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">
              Selamat Datang Kembali
            </h1>
            <p className="text-neutral-500 text-sm">
              Masuk ke Togather untuk melanjutkan
            </p>
          </div>

          {/* Magic Link Form */}
          <form action={formAction} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <Input
                name="email"
                type="email"
                placeholder="nama@email.com"
                required
                autoComplete="email"
                className="h-12 pl-12 pr-4 bg-white border-neutral-200 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 shadow-sm"
              />
            </div>
            <SubmitButton />
          </form>

          {/* Success State Hint */}
          {state?.success && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center"
            >
              <p className="text-sm text-emerald-700">
                ✨ Cek inbox email kamu untuk link login
              </p>
            </motion.div>
          )}

          {/* Invite Code Section (Collapsible) */}
          <InviteCodeSection />

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gradient-to-r from-amber-50/50 via-white to-rose-50/30 px-4 text-xs text-neutral-400 uppercase tracking-wider">
                atau
              </span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-neutral-500">
              Belum punya akun?{" "}
              <Link
                href="/onboarding"
                className="text-neutral-900 font-medium hover:underline"
              >
                Daftar
              </Link>
            </p>
          </div>

          {/* Dev Login (only in development) */}
          {isDev && (
            <div className="mt-8 pt-6 border-t border-dashed border-neutral-200">
              <p className="text-xs text-neutral-400 text-center mb-3">
                🛠️ Dev Mode Only
              </p>
              <DevLoginButtons />
            </div>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-10 pb-8 text-center">
        <p className="text-xs text-neutral-400">
          Dengan melanjutkan, kamu menyetujui{" "}
          <span className="underline cursor-pointer hover:text-neutral-600">
            Ketentuan Layanan
          </span>{" "}
          dan{" "}
          <Link href="/privacy" className="underline hover:text-neutral-600">
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
