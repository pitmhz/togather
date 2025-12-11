import Link from "next/link";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AuthCodeError() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <Card className="w-full max-w-md shadow-lg border-zinc-200 dark:border-zinc-800">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Authentication Error
            </CardTitle>
            <CardDescription className="text-zinc-600 dark:text-zinc-400">
              There was a problem verifying your login link. It may have expired
              or already been used.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <Button
            asChild
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
          >
            <Link href="/login">Try Again</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
