"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { updateOptionalProfile } from "@/app/actions/profile";
import { Loader2 } from "lucide-react";

type UserProfile = {
    mbti: string | null;
    hobbies: string[] | null;
    [key: string]: any;
};

export function OptionalDataSheet({ userProfile }: { userProfile: UserProfile | null }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mbti, setMbti] = useState("");
    const [hobbies, setHobbies] = useState("");
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        // Check if we should show the popup
        const isNewUser = searchParams.get("new") === "true";
        const hasDismissed = localStorage.getItem("optional_data_dismissed");
        const needsData = !userProfile?.mbti; // Basic check: if no MBTI, likely incomplete

        if ((isNewUser || needsData) && !hasDismissed) {
            // Small delay for better UX
            const timer = setTimeout(() => setIsOpen(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [searchParams, userProfile]);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            // Convert comma-separated hobbies to array
            const hobbyList = hobbies
                .split(",")
                .map(h => h.trim())
                .filter(h => h.length > 0);

            const result = await updateOptionalProfile({
                mbti: mbti || null,
                hobbies: hobbyList.length > 0 ? hobbyList : null
            });

            if (result.success) {
                setIsOpen(false);
                localStorage.setItem("optional_data_dismissed", "true");
                // Clear the URL param without refresh
                router.replace("/dashboard");
            }
        } catch (error) {
            console.error("Failed to save optional data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDismiss = () => {
        setIsOpen(false);
        localStorage.setItem("optional_data_dismissed", "true");
    };

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle className="text-2xl text-center">👋 Satu Langkah Lagi!</DrawerTitle>
                        <DrawerDescription className="text-center">
                            Lengkapi profilmu biar teman-teman komsel makin kenal sama kamu via fitur Spotlight.
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="p-4 space-y-6">
                        {/* MBTI Input */}
                        <div className="space-y-2">
                            <Label>Tipe Kepribadian (MBTI)</Label>
                            <Select value={mbti} onValueChange={setMbti}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih MBTI kamu" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="INTJ">INTJ - Arsitek</SelectItem>
                                    <SelectItem value="INTP">INTP - Ahli Logika</SelectItem>
                                    <SelectItem value="ENTJ">ENTJ - Komandan</SelectItem>
                                    <SelectItem value="ENTP">ENTP - Pendebat</SelectItem>
                                    <SelectItem value="INFJ">INFJ - Advokat</SelectItem>
                                    <SelectItem value="INFP">INFP - Mediator</SelectItem>
                                    <SelectItem value="ENFJ">ENFJ - Protagonis</SelectItem>
                                    <SelectItem value="ENFP">ENFP - Juru Kampanye</SelectItem>
                                    <SelectItem value="ISTJ">ISTJ - Ahli Logistik</SelectItem>
                                    <SelectItem value="ISFJ">ISFJ - Pembela</SelectItem>
                                    <SelectItem value="ESTJ">ESTJ - Eksekutif</SelectItem>
                                    <SelectItem value="ESFJ">ESFJ - Konsul</SelectItem>
                                    <SelectItem value="ISTP">ISTP - Pengrajin</SelectItem>
                                    <SelectItem value="ISFP">ISFP - Petualang</SelectItem>
                                    <SelectItem value="ESTP">ESTP - Pengusaha</SelectItem>
                                    <SelectItem value="ESFP">ESFP - Penghibur</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Hobbies Input */}
                        <div className="space-y-2">
                            <Label>Hobi / Minat</Label>
                            <Input
                                placeholder="Contoh: Musik, Basket, Masak"
                                value={hobbies}
                                onChange={(e) => setHobbies(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">Pisahkan dengan koma</p>
                        </div>
                    </div>

                    <DrawerFooter>
                        <Button onClick={handleSave} disabled={isLoading || !mbti}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                "Simpan Profil"
                            )}
                        </Button>
                        <DrawerClose asChild>
                            <Button variant="outline" onClick={handleDismiss}>Nanti Saja</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
