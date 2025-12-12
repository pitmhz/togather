import { BottomNav } from "@/components/bottom-nav";
import { CookieConsent } from "@/components/cookie-consent";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <BottomNav />
      <CookieConsent />
    </>
  );
}
