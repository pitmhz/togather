"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, Users, Sparkles } from "lucide-react";

type BottomNavClientProps = {
  isAdmin: boolean;
};

export function BottomNavClient({ isAdmin }: BottomNavClientProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Home", show: true },
    { href: "/events/new", icon: PlusCircle, label: "Buat", show: isAdmin }, // Conditional show
    { href: "/tools", icon: Sparkles, label: "Tools", show: true },
    { href: "/members", icon: Users, label: "Jemaat", show: true },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50">
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
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors ${
                  isActive
                    ? "text-indigo-600"
                    : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                }`}
              >
                <Icon className={`w-6 h-6 ${item.href === "/events/new" ? "w-7 h-7" : ""}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
      {/* Safe area for iOS home indicator */}
      <div className="h-safe-area-inset-bottom bg-white/80 dark:bg-zinc-900/80" />
    </nav>
  );
}
