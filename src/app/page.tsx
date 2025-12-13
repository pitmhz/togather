import { Loader2 } from "lucide-react";

/**
 * Root page - purely a loading state
 * All authentication and onboarding redirects are handled by middleware.
 * This prevents conflicting server-side redirects and race conditions.
 */
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </main>
  );
}
