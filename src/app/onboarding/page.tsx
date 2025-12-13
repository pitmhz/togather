"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Crown,
    Users,
    ChevronRight,
    ChevronLeft,
    Loader2,
    CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvatarSelector, generateRandomSeed, getAvatarUrl } from "@/components/avatar-selector";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { submitOnboarding, type OnboardingData } from "@/app/actions/onboarding";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { validateInviteCode, joinCommunity, type CommunityValidationResult } from "@/app/actions/community";
import { ReviewModal } from "@/components/onboarding/review-modal";

type Role = "leader" | "member";

const ROLE_DETAILS = {
    leader: {
        title: "Leader",
        subtitle: "Saya ingin mengelola komsel.",
        icon: Crown,
        details: [
            "✨ Buat & kelola profil komunitas.",
            "📅 Jadwalkan event & ibadah rutin.",
            "📊 Pantau grafik kehadiran member.",
            "🛠️ Akses penuh tools leader.",
        ],
    },
    member: {
        title: "Member",
        subtitle: "Saya ingin bergabung ke komsel.",
        icon: Users,
        details: [
            "🔑 Gabung instan via kode invite.",
            "📍 Lihat info lokasi & jadwal event.",
            "🔥 Track streak kehadiran pribadimu.",
            "🎉 Akses games & fitur seru.",
        ],
    },
} as const;

export default function OnboardingWizardPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [role, setRole] = useState<Role | null>(null);
    const [communityName, setCommunityName] = useState("");
    const [inviteCode, setInviteCode] = useState("");
    const [churchType, setChurchType] = useState("");
    const [location, setLocation] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState<"L" | "P" | "">("");
    const [birthDate, setBirthDate] = useState("");
    const [gmapsLink, setGmapsLink] = useState("");
    const [avatarSeed, setAvatarSeed] = useState(generateRandomSeed());
    const [avatarUrl, setAvatarUrl] = useState(getAvatarUrl(avatarSeed));

    // Member Join State
    const [memberInviteCode, setMemberInviteCode] = useState("");
    const [isValidatingCode, setIsValidatingCode] = useState(false);
    const [validationResult, setValidationResult] = useState<CommunityValidationResult | null>(null);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [isJoining, setIsJoining] = useState(false);

    // Load user's name from auth if available
    useEffect(() => {
        const loadUserData = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.user_metadata?.name || user?.user_metadata?.full_name) {
                setFullName(user.user_metadata.name || user.user_metadata.full_name);
            }
        };
        loadUserData();
    }, []);

    const totalSteps = role === "member" ? 3 : 3; // Both have 3 logical steps now (Role -> Data -> Action)

    const canProceed = () => {
        if (step === 1) return role !== null;

        // LEADER PATH
        if (role === "leader") {
            if (step === 2) return churchType && communityName.trim() && location.trim();
            if (step === 3) return fullName.trim() && phone.trim() && gender && birthDate;
        }

        // MEMBER PATH
        if (role === "member") {
            // Step 2 is Personal Data (skipped Community Data)
            if (step === 2) return fullName.trim() && phone.trim() && gender && birthDate;
            // Step 3 is Join Community (Invite Code)
            if (step === 3) return memberInviteCode.length >= 5; // Basic length check
        }

        return false;
    };

    const goNext = () => {
        if (!canProceed()) return;

        // Skip community step for members
        if (step === 1 && role === "member") {
            setStep(2); // Directly to Personal Data
            return;
        }

        if (step < totalSteps) {
            setStep(step + 1);
        }
    };

    const goPrev = () => {
        // Skip community step when going back for members
        if (step === 2 && role === "member") {
            setStep(1);
        } else if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSubmit = async () => {
        if (!role || !gender) return;

        setIsSubmitting(true);
        setError(null);

        const data: OnboardingData = {
            role,
            fullName,
            phone,
            gender,
            birthDate,
            gmapsLink: gmapsLink || undefined,
            ...(role === "leader" && {
                communityName,
                churchType,
                location,
            }),
        };

        // DEBUG: Log form data before submission
        console.log("CLIENT [Onboarding] Submitting Data:", JSON.stringify(data, null, 2));

        try {
            const result = await submitOnboarding(data);

            if ('error' in result && result.error) {
                // DEBUG: Log error to browser console for DevTools visibility
                console.error("CLIENT ERROR [Onboarding]:", result.error);
                setError(result.error);
                setIsSubmitting(false);
            } else if ('inviteCode' in result && result.inviteCode) {
                console.log("CLIENT [Onboarding] Success! Invite code:", result.inviteCode);
                setInviteCode(result.inviteCode);
                if ('communityName' in result && result.communityName) {
                    setCommunityName(result.communityName);
                }
                setStep(4);
            } else if ('redirectTo' in result && result.redirectTo) {
                console.log("CLIENT [Onboarding] Redirecting to:", result.redirectTo);
                router.push(result.redirectTo);
            }
            // For leaders, redirect happens in the server action
        } catch (err) {
            // DEBUG: Log caught exception to browser console
            console.error("CLIENT ERROR [Onboarding] Caught exception:", err);
            const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan. Silakan coba lagi.";
            setError(errorMessage);
            setIsSubmitting(false);
        }
    };

    const handleValidateCode = async () => {
        if (!memberInviteCode) return;
        setIsValidatingCode(true);
        setError(null);

        const result = await validateInviteCode(memberInviteCode);
        setIsValidatingCode(false);
        setValidationResult(result);

        if (!result.isValid) {
            setError(result.error || "Kode tidak valid");
        } else {
            if (!result.isValid) {
                setError(result.error || "Kode tidak valid");
            } else {
                // Open confirmation modal
                setShowJoinModal(true);
            }
        }
    };

    const handleJoinCommunity = async () => {
        if (!validationResult?.community || !memberInviteCode) return;

        setIsJoining(true);
        try {
            const result = await joinCommunity(memberInviteCode, {
                fullName,
                phone,
                gender: gender as string,
                birthDate
            });

            if (result.success) {
                // Determine redirect based on role (Member -> Dashboard)
                window.location.href = '/dashboard?new=true';
            } else {
                setError(result.error || "Gagal bergabung");
                setShowJoinModal(false);
            }
        } catch (err) {
            setError("Terjadi kesalahan saat bergabung");
        } finally {
            setIsJoining(false);
        }
    };

    const isLastStep = (step === 3 && role === "leader"); // Member finishes via modal in Step 3
    const isFirstStep = step === 1;

    return (
        <main className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="w-full max-w-2xl">
                {/* Thin Progress Bar */}
                <div className="mb-8">
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-black rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(step / totalSteps) * 100}%` }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        />
                    </div>
                </div>

                {/* Step 1: Role Selection - Expandable Cards */}
                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h1 className="text-2xl font-bold text-foreground mb-8">
                            Bagaimana kamu ingin bergabung?
                        </h1>

                        <div className="flex flex-col gap-4 mb-8">
                            {(["leader", "member"] as const).map((roleKey) => {
                                const data = ROLE_DETAILS[roleKey];
                                const Icon = data.icon;
                                const isSelected = role === roleKey;

                                return (
                                    <motion.button
                                        key={roleKey}
                                        onClick={() => setRole(roleKey)}
                                        layout
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        className={`
                                            w-full p-6 rounded-3xl text-left relative overflow-hidden
                                            ${isSelected
                                                ? "bg-white border-2 border-black ring-1 ring-black/5 shadow-lg"
                                                : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                                            }
                                        `}
                                    >
                                        {/* Check Circle for Selected */}
                                        <AnimatePresence>
                                            {isSelected && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.5 }}
                                                    className="absolute top-4 right-4"
                                                >
                                                    <CheckCircle2 className="w-6 h-6 text-black" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Header Row: Icon + Title/Subtitle */}
                                        <div className="flex items-center gap-4">
                                            <div className={`
                                                w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-colors
                                                ${isSelected ? "bg-black" : "bg-gray-200"}
                                            `}>
                                                <Icon className={`w-7 h-7 ${isSelected ? "text-white" : "text-gray-500"}`} />
                                            </div>
                                            <div>
                                                <h3 className={`text-xl font-bold ${isSelected ? "text-black" : "text-gray-600"}`}>
                                                    {data.title}
                                                </h3>
                                                <p className="text-sm text-gray-400">
                                                    {data.subtitle}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Expandable Details */}
                                        <AnimatePresence>
                                            {isSelected && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="border-t border-gray-100 mt-4 pt-4">
                                                        <ul className="space-y-2">
                                                            {data.details.map((detail, idx) => (
                                                                <li
                                                                    key={idx}
                                                                    className="text-sm text-gray-600 flex items-start gap-2"
                                                                >
                                                                    <span>{detail}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Continue Button for Step 1 */}
                        <Button
                            onClick={goNext}
                            className="w-full h-14 text-base"
                            disabled={!canProceed()}
                        >
                            Lanjut
                            <ChevronRight className="w-5 h-5 ml-1" />
                        </Button>
                    </motion.div>
                )}

                {/* Steps 2-4 Container */}
                {step !== 1 && (
                    <div className="bg-card rounded-2xl border shadow-sm p-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >

                                {/* Step 2: Community Data (Leader Only) */}
                                {step === 2 && role === "leader" && (
                                    <div>
                                        <div className="text-center mb-8">
                                            <h1 className="text-2xl font-bold text-foreground mb-2">
                                                Data Komunitas
                                            </h1>
                                            <p className="text-muted-foreground">
                                                Informasi tentang komsel kamu
                                            </p>
                                        </div>

                                        <div className="space-y-6 mb-8">
                                            {/* Church Type */}
                                            <div className="space-y-2">
                                                <Label htmlFor="church-type">Tipe Gereja</Label>
                                                <Select value={churchType} onValueChange={setChurchType}>
                                                    <SelectTrigger id="church-type" className="w-full h-12">
                                                        <SelectValue placeholder="Pilih tipe gereja" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="GMS">GMS</SelectItem>
                                                        <SelectItem value="HKBP">HKBP</SelectItem>
                                                        <SelectItem value="Tiberias">Tiberias</SelectItem>
                                                        <SelectItem value="GBI">GBI</SelectItem>
                                                        <SelectItem value="Lainnya">Lainnya</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Community Name */}
                                            <div className="space-y-2">
                                                <Label htmlFor="community-name">Nama Komunitas</Label>
                                                <Input
                                                    id="community-name"
                                                    placeholder="Contoh: CG Pro 36"
                                                    value={communityName}
                                                    onChange={(e) => setCommunityName(e.target.value)}
                                                />
                                            </div>

                                            {/* Location */}
                                            <div className="space-y-2">
                                                <Label htmlFor="location">Domisili</Label>
                                                <Input
                                                    id="location"
                                                    placeholder="Contoh: Medan"
                                                    value={location}
                                                    onChange={(e) => setLocation(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Personal Data (Leader) OR Step 2: Personal Data (Member) */}
                                {((step === 3 && role === "leader") || (step === 2 && role === "member")) && (
                                    <div>
                                        {/* Avatar Selector - Luma Style */}
                                        <div className="flex justify-center mb-8">
                                            <AvatarSelector
                                                currentSeed={avatarSeed}
                                                onSeedChange={(seed, url) => {
                                                    setAvatarSeed(seed);
                                                    setAvatarUrl(url);
                                                }}
                                                size="lg"
                                                showHeader={true}
                                            />
                                        </div>

                                        <div className="space-y-6 mb-8">
                                            {/* Full Name */}
                                            <div className="space-y-2">
                                                <Label htmlFor="full-name">Nama Lengkap</Label>
                                                <Input
                                                    id="full-name"
                                                    placeholder="Nama lengkap kamu"
                                                    value={fullName}
                                                    onChange={(e) => setFullName(e.target.value)}
                                                />
                                            </div>

                                            {/* WhatsApp Number */}
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Nomor WhatsApp</Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    placeholder="08123456789"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                />
                                            </div>

                                            {/* Gender */}
                                            <div className="space-y-2">
                                                <Label>Jenis Kelamin</Label>
                                                <RadioGroup
                                                    value={gender}
                                                    onValueChange={(value) => setGender(value as "L" | "P")}
                                                    className="flex gap-6"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="L" id="gender-l" />
                                                        <Label htmlFor="gender-l" className="font-normal cursor-pointer">
                                                            Laki-laki
                                                        </Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="P" id="gender-p" />
                                                        <Label htmlFor="gender-p" className="font-normal cursor-pointer">
                                                            Perempuan
                                                        </Label>
                                                    </div>
                                                </RadioGroup>
                                            </div>

                                            {/* Birth Date */}
                                            <div className="space-y-2">
                                                <Label htmlFor="birth-date">Tanggal Lahir</Label>
                                                <Input
                                                    id="birth-date"
                                                    type="date"
                                                    value={birthDate}
                                                    onChange={(e) => setBirthDate(e.target.value)}
                                                    max={new Date().toISOString().split('T')[0]}
                                                />
                                            </div>

                                            {/* Google Maps Link */}
                                            <div className="space-y-2">
                                                <Label htmlFor="gmaps-link">Link Google Maps Rumah (Opsional)</Label>
                                                <Input
                                                    id="gmaps-link"
                                                    type="url"
                                                    placeholder="https://maps.google.com/..."
                                                    value={gmapsLink}
                                                    onChange={(e) => setGmapsLink(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Error Display */}
                                {error && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-sm text-red-600">{error}</p>
                                    </div>
                                )}
                                {/* Step 3 (Member): Join Community */}
                                {step === 3 && role === "member" && (
                                    <div>
                                        <div className="text-center mb-8">
                                            <h1 className="text-2xl font-bold text-foreground mb-2">
                                                Gabung Komsel
                                            </h1>
                                            <p className="text-muted-foreground">
                                                Masukkan kode undangan dari Leadermu
                                            </p>
                                        </div>

                                        <div className="space-y-6 mb-8">
                                            <div className="space-y-2">
                                                <Label htmlFor="invite-code">Kode Undangan</Label>
                                                <Input
                                                    id="invite-code"
                                                    placeholder="Contoh: UNIFY-2849"
                                                    value={memberInviteCode}
                                                    onChange={(e) => setMemberInviteCode(e.target.value.toUpperCase())}
                                                    className="uppercase font-mono tracking-widest text-center text-lg h-14"
                                                />
                                            </div>
                                        </div>

                                        {/* Validation Result Preview (Temporary until Modal) */}
                                        {validationResult?.isValid && (
                                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                                                <p className="font-semibold text-green-800">Komunitas Ditemukan!</p>
                                                <p className="text-green-700">{validationResult.community?.name}</p>
                                                <p className="text-sm text-green-600">Leader: {validationResult.leader?.name}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Step 4: Success & Invite (Leader Only) */}
                                {step === 4 && (
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <span className="text-4xl">🎉</span>
                                        </div>

                                        <h1 className="text-2xl font-bold text-foreground mb-2">
                                            Komunitas Berhasil Dibuat!
                                        </h1>
                                        <p className="text-muted-foreground mb-8">
                                            Bagikan kode ini ke anggota komsel kamu
                                        </p>

                                        <div className="bg-zinc-50 dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-6 mb-8 relative group">
                                            <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wide font-medium">
                                                KODE KOMUNITAS
                                            </p>
                                            <p className="text-4xl font-mono font-bold tracking-wider text-foreground select-all">
                                                {inviteCode}
                                            </p>
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-xs bg-black/10 px-2 py-1 rounded">
                                                    Klik untuk copy
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <a
                                                href={`https://wa.me/?text=Halo guys, join aplikasi Togather komunitas kita ya! Kode: ${inviteCode} Link: https://togather.app/invite`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                                            >
                                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                                </svg>
                                                Undang Member via WhatsApp
                                            </a>

                                            <Button
                                                onClick={() => window.location.href = '/dashboard?new=true'}
                                                className="w-full h-12 text-base"
                                                variant="outline"
                                            >
                                                Masuk Dashboard
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        {step !== 4 && (
                            <div className="flex gap-3">
                                {!isFirstStep && (
                                    <Button
                                        variant="outline"
                                        onClick={goPrev}
                                        className="flex-1"
                                        disabled={isSubmitting}
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-1" />
                                        Kembali
                                    </Button>
                                )}

                                <Button
                                    onClick={isLastStep ? handleSubmit : goNext}
                                    className={`flex-1 ${isFirstStep ? "w-full" : ""}`}
                                    disabled={!canProceed() || isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : isLastStep ? (
                                        "Selesai"
                                    ) : (step === 3 && role === "member") ? (
                                        "Cek Kode"
                                    ) : (
                                        <>
                                            Lanjut
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer */}
                <p className="text-center text-xs text-muted-foreground mt-6">
                    Data kamu aman dan tidak akan dibagikan ke pihak lain.
                </p>
            </div>

            {/* Join Confirmation Modal - Luma Style */}
            <ReviewModal
                isOpen={showJoinModal}
                onClose={() => setShowJoinModal(false)}
                onConfirm={handleJoinCommunity}
                isLoading={isJoining}
                community={validationResult?.community ? {
                    name: validationResult.community.name,
                    location: validationResult.community.location,
                    leader: validationResult.leader?.name,
                    schedule: validationResult.community.schedule ?? undefined,
                } : null}
            />
        </main>
    );
}
