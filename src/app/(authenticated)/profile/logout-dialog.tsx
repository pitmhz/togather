"use client";

import { useState, useTransition } from "react";
import { LogOut } from "lucide-react";
import { signOut } from "@/app/(authenticated)/dashboard/actions";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { IOSListItem } from "@/components/ui/ios-list";

export function LogoutDialog() {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleLogout = () => {
        startTransition(async () => {
            await signOut();
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button type="button" className="w-full text-left">
                    <IOSListItem
                        icon={<LogOut size={20} className="text-red-500" />}
                        label="Keluar"
                        isDestructive
                        hasChevron={false}
                    />
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-[320px] rounded-2xl">
                <DialogHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-2">
                        <LogOut className="w-6 h-6 text-red-500" />
                    </div>
                    <DialogTitle className="text-lg">Yakin mau keluar?</DialogTitle>
                    <DialogDescription className="text-sm text-neutral-500">
                        Kamu perlu login lagi untuk mengakses aplikasi.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col gap-2 sm:flex-col">
                    <Button
                        onClick={() => setOpen(false)}
                        className="w-full bg-neutral-900 hover:bg-neutral-800 text-white"
                    >
                        Batal
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        disabled={isPending}
                        className="w-full text-neutral-500/50 hover:text-neutral-500 hover:bg-neutral-50"
                    >
                        {isPending ? "Keluar..." : "Bawa saya keluar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
