"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { cn, triggerHaptic } from "@/lib/utils";

type RefreshButtonProps = {
    className?: string;
    size?: "sm" | "md";
};

export function RefreshButton({ className, size = "sm" }: RefreshButtonProps) {
    const router = useRouter();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        if (isRefreshing) return;

        setIsRefreshing(true);
        triggerHaptic("light");

        // Trigger Next.js cache invalidation
        router.refresh();

        // Visual feedback duration
        setTimeout(() => {
            setIsRefreshing(false);
            triggerHaptic("success");
        }, 1000);
    };

    const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
    const buttonSize = size === "sm" ? "p-2" : "p-2.5";

    return (
        <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={cn(
                "rounded-full transition-all hover:bg-neutral-100 active:scale-95",
                buttonSize,
                isRefreshing ? "text-indigo-500" : "text-neutral-400 hover:text-neutral-600",
                className
            )}
            title="Refresh data"
        >
            <RefreshCw
                className={cn(
                    iconSize,
                    isRefreshing && "animate-spin"
                )}
            />
        </button>
    );
}
