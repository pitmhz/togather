"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, Users } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

import { cn, getAvatarUrl } from "@/lib/utils";
import { useScrollDirection } from "@/lib/hooks/use-scroll-direction";

type BottomNavClientProps = {
  isAdmin: boolean;
  userName: string;
};

export function BottomNavClient({ isAdmin, userName }: BottomNavClientProps) {
  const pathname = usePathname();
  const { scrollDirection, scrollY } = useScrollDirection({ threshold: 10 });

  // Hide nav on focus mode pages (create event, edit profile, etc.)
  const focusModePages = ["/events/new", "/profile/edit"];
  const isFocusMode = focusModePages.some(page => pathname.includes(page));

  if (isFocusMode) {
    return null;
  }

  const isProfileActive = pathname.startsWith("/profile");
  const avatarUrl = getAvatarUrl(userName);

  // Hide when scrolling down AND past the threshold (50px)
  const isHidden = scrollDirection === "down" && scrollY > 50;

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Home", show: true },
    { href: "/events/new", icon: PlusCircle, label: "Buat", show: isAdmin },
    { href: "/members", icon: Users, label: "Jemaat", show: true },
  ];

  const navVariants = {
    visible: { y: 0 },
    hidden: { y: "100%" },
  };

  return (
    <motion.nav
      variants={navVariants}
      initial="visible"
      animate={isHidden ? "hidden" : "visible"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50"
    >
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-t border-border">
        <div className="flex items-center justify-around h-16">
          {navItems.filter(item => item.show).map((item) => {
            const isActive = pathname === item.href ||
              (item.href === "/dashboard" && pathname === "/") ||
              (item.href !== "/dashboard" && item.href !== "/events/new" && pathname.startsWith(item.href));

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors ${isActive
                  ? "text-indigo-600"
                  : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  }`}
              >
                <Icon className={`w-6 h-6 ${item.href === "/events/new" ? "w-7 h-7" : ""}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}

          {/* Profile Avatar */}
          <Link
            href="/profile"
            className="flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors"
          >
            <div
              className={cn(
                "w-7 h-7 rounded-full overflow-hidden transition-all",
                isAdmin && "ring-2 ring-blue-500 ring-offset-1",
                isProfileActive && "ring-2 ring-indigo-600 ring-offset-1"
              )}
            >
              <Image
                src={avatarUrl}
                alt={userName}
                width={28}
                height={28}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <span className={cn(
              "text-xs font-medium",
              isProfileActive ? "text-indigo-600" : "text-zinc-400"
            )}>
              Profil
            </span>
          </Link>
        </div>
      </div>
      {/* Safe area for iOS home indicator */}
      <div className="h-safe-area-inset-bottom bg-white/80 dark:bg-zinc-900/80" />
    </motion.nav>
  );
}
