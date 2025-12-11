import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Togather",
  description: "Cell Group Management for Churches",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${plusJakartaSans.variable} font-sans antialiased bg-zinc-100 dark:bg-zinc-950`}
      >
        {/* Mobile-first container - looks like a phone even on desktop */}
        <div className="max-w-[480px] mx-auto min-h-screen bg-background shadow-2xl border-x border-border">
          {children}
        </div>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
