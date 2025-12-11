"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Users } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

import { login, type LoginState } from "./actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
      disabled={pending}
    >
      {pending ? "Mengirim..." : "Kirim Link Masuk"}
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
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <Card className="w-full border-0 shadow-none bg-transparent">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="mx-auto w-14 h-14 bg-indigo-100 dark:bg-indigo-950 rounded-full flex items-center justify-center">
            <Users className="w-7 h-7 text-indigo-600" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold font-heading text-foreground">
              Selamat Datang di Togather
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Masukkan email untuk menerima link masuk
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Alamat Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="w-full"
                autoComplete="email"
              />
            </div>
            <SubmitButton />
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Tanpa password — kami akan kirim link aman ke email kamu.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

