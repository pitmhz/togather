"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Bell, Settings, UserPlus, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollDirection } from "@/lib/hooks/use-scroll-direction";
import { cn } from "@/lib/utils";

// Route to title mapping
const ROUTE_TITLES: Record<string, string> = {
    "/dashboard": "",
    "/members": "Jemaat",
    "/profile": "Profil",
    "/profile/edit": "Edit Profil",
    "/events/new": "Buat Acara",
    "/features/attendance": "Absensi Swipe",
    "/features/wheel": "Roda Undian",
    "/features/cards": "Kartu Sharing",
    "/features/whatsapp": "WhatsApp Blast",
    "/features/bomb": "Bom Waktu",
    "/features/charades": "Tebak Kata",
    "/features/rather": "Mending Mana?",
};

function getPageTitle(pathname: string): string {
    // Check exact match first
    if (ROUTE_TITLES[pathname]) {
        return ROUTE_TITLES[pathname];
    }

    // Check partial matches for dynamic routes
    if (pathname.startsWith("/events/")) {
        return "Detail Acara";
    }
    if (pathname.startsWith("/members/")) {
        return "Detail Anggota";
    }

    return "";
}

export function GlobalHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const { scrollDirection, isScrolledTop, scrollY } = useScrollDirection({ threshold: 10 });

    // Don't render on auth pages
    if (pathname === "/login" || pathname === "/signup" || pathname === "/") {
        return null;
    }

    const isDashboard = pathname === "/dashboard";
    const isMembers = pathname === "/members";
    const isProfile = pathname === "/profile";
    const pageTitle = getPageTitle(pathname);

    // Hide when scrolling down AND past the threshold (50px)
    const isHidden = scrollDirection === "down" && scrollY > 50;

    const headerVariants = {
        visible: { y: 0 },
        hidden: { y: "-100%" },
    };

    return (
        <motion.header
            variants={headerVariants}
            initial="visible"
            animate={isHidden ? "hidden" : "visible"}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 h-14",
                "bg-white/80 backdrop-blur-lg border-b border-neutral-200/50",
                "flex items-center justify-between px-4",
                // Max width container for desktop
                "max-w-[480px] mx-auto"
            )}
        >
            {/* Left Slot */}
            <div className="w-10 flex items-center justify-start">
                {isDashboard ? (
                    // Dashboard: Show brand icon
                    <div className="text-xl">🤝</div>
                ) : (
                    // Other pages: Show back button
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="h-9 w-9 rounded-full"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                )}
            </div>

            {/* Center Slot - Page Title */}
            <div className="flex-1 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.h1
                        key={pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="font-semibold text-neutral-900"
                    >
                        {pageTitle}
                    </motion.h1>
                </AnimatePresence>
            </div>

            {/* Right Slot */}
            <div className="w-10 flex items-center justify-end">
                {isDashboard && (
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full relative">
                        <Bell className="w-5 h-5" />
                        {/* Notification dot */}
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                    </Button>
                )}

                {/* Empty spacer for other routes to maintain balance */}
                {!isDashboard && <div className="w-9" />}
            </div>
        </motion.header>
    );
}
