import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  Brain,
  Globe,
  Cake,
  Users,
  Mail,
  Phone,
  MapPin,
  Map,
  Palette,
  LogOut,
  Shield,
  Lock
} from "lucide-react";

import { ClaimAdminButton } from "./claim-admin-button";
import { LogoutDialog } from "./logout-dialog";
import { isAdminAsync } from "@/lib/user-role";
import { formatDate, maskData } from "@/lib/utils";

import { IOSListGroup, IOSListHeader, IOSListItem, IOSListSeparator } from "@/components/ui/ios-list";
import { ProfileAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChangelogList } from "@/components/changelog-list";

// MBTI Type names in Indonesian
const MBTI_NAMES: Record<string, string> = {
  "INTJ": "Arsitek",
  "INTP": "Pemikir",
  "ENTJ": "Komandan",
  "ENTP": "Pendebat",
  "INFJ": "Advokat",
  "INFP": "Mediator",
  "ENFJ": "Protagonis",
  "ENFP": "Juru Kampanye",
  "ISTJ": "Logistik",
  "ISFJ": "Pelindung",
  "ESTJ": "Eksekutif",
  "ESFJ": "Konsul",
  "ISTP": "Virtuoso",
  "ISFP": "Petualang",
  "ESTP": "Pengusaha",
  "ESFP": "Penghibur",
};

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile with all fields
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone_number, address, maps_link, gender, birth_date, mbti, mbti_summary")
    .eq("id", user.id)
    .single();

  // Fetch locale and privacy settings from members table
  const { data: member } = await supabase
    .from("members")
    .select("locale, role, privacy_masked")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  const userEmail = user.email || "User";
  const displayName = profile?.full_name || userEmail.split("@")[0];
  const isAdmin = await isAdminAsync(userEmail);
  const privacyMasked = member?.privacy_masked ?? false;

  // Locale display
  const localeLabels: Record<string, string> = {
    "id-ID": "Indonesia",
    "en-US": "Amerika Serikat",
    "en-AU": "Australia"
  };
  const currentLocale = member?.locale || "id-ID";
  const localeDisplay = localeLabels[currentLocale] || "Indonesia";

  // MBTI display
  const mbtiType = profile?.mbti;
  const mbtiDisplay = mbtiType
    ? `${mbtiType} - ${MBTI_NAMES[mbtiType] || ""}`
    : "Belum diisi";

  // Gender display
  const genderDisplay = profile?.gender === "L" ? "Laki-laki" : profile?.gender === "P" ? "Perempuan" : "Belum diisi";

  // Birth date display
  const birthDateDisplay = profile?.birth_date
    ? formatDate(profile.birth_date, "dd MMMM yyyy", currentLocale)
    : "Belum diisi";

  // Phone display (with optional masking)
  const phoneDisplay = profile?.phone_number
    ? (privacyMasked ? maskData(profile.phone_number, 'phone') : profile.phone_number)
    : "Belum diisi";

  // Address display (with optional masking)
  const addressDisplay = profile?.address
    ? (privacyMasked
      ? maskData(profile.address, 'address')
      : (profile.address.length > 30 ? profile.address.slice(0, 30) + "..." : profile.address))
    : "Belum diisi";

  // Maps link display (with optional masking)
  const mapsDisplay = profile?.maps_link
    ? (privacyMasked ? maskData(profile.maps_link, 'map') : "Terpasang")
    : "Belum set";

  // Email display (with optional masking)
  const emailDisplay = privacyMasked ? maskData(userEmail, 'email') : userEmail;

  return (
    <main className="min-h-screen flex flex-col pb-24 bg-[#F2F2F7]">
      {/* Content */}
      <div className="flex-1 px-4 pt-4">

        {/* Section A: Profile Header (No Box) */}
        <div className="flex flex-col items-center mb-8">
          <ProfileAvatar name={displayName} size="xl" />
          <h2 className="text-2xl font-bold text-neutral-900 mt-4 tracking-tight">
            {displayName}
          </h2>
          {isAdmin && (
            <Badge className="mt-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
              Administrator
            </Badge>
          )}
          <Link
            href="/profile/edit#identity"
            className="mt-2 text-sm text-neutral-500 flex items-center gap-1 hover:text-neutral-700"
          >
            Edit Profil <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Section B: Kepribadian (Data Diri) */}
        <IOSListHeader>Data Diri</IOSListHeader>
        <IOSListGroup className="mb-6">
          <Link href="/profile/edit#mbti">
            <IOSListItem
              icon={<Brain size={20} className="text-purple-500" />}
              label="Tipe MBTI"
              value={mbtiDisplay}
            />
          </Link>
          <IOSListSeparator />
          <Link href="/profile/edit#identity">
            <IOSListItem
              icon={<Cake size={20} className="text-pink-500" />}
              label="Tanggal Lahir"
              value={birthDateDisplay}
            />
          </Link>
          <IOSListSeparator />
          <Link href="/profile/edit#identity">
            <IOSListItem
              icon={<Users size={20} className="text-blue-500" />}
              label="Gender"
              value={genderDisplay}
            />
          </Link>
        </IOSListGroup>

        {/* Section C: Kontak (Hubungi Saya) */}
        <IOSListHeader>Kontak</IOSListHeader>
        <IOSListGroup className="mb-6">
          <Link href="/profile/edit#contact">
            <IOSListItem
              icon={<Mail size={20} className={privacyMasked ? "text-neutral-300" : "text-neutral-400"} />}
              label="Email"
              value={<span className={privacyMasked ? "text-neutral-400" : ""}>{emailDisplay}</span>}
              hasChevron={false}
            />
          </Link>
          <IOSListSeparator />
          <Link href="/profile/edit#contact">
            <IOSListItem
              icon={<Phone size={20} className="text-green-500" />}
              label="WhatsApp"
              value={phoneDisplay}
            />
          </Link>
          <IOSListSeparator />
          <Link href="/profile/edit#contact">
            <IOSListItem
              icon={<MapPin size={20} className="text-red-500" />}
              label="Alamat Rumah"
              value={addressDisplay}
            />
          </Link>
          <IOSListSeparator />
          <Link href="/profile/edit#contact">
            <IOSListItem
              icon={<Map size={20} className="text-emerald-500" />}
              label="Titik Peta (Gmaps)"
              value={mapsDisplay}
            />
          </Link>
        </IOSListGroup>

        {/* Section D: Preferensi (Aplikasi) */}
        <IOSListHeader>Preferensi</IOSListHeader>
        <IOSListGroup className="mb-6">
          <Link href="/profile/edit#localization">
            <IOSListItem
              icon={<Globe size={20} className="text-blue-500" />}
              label="Format Regional"
              value={localeDisplay}
            />
          </Link>
          <IOSListSeparator />
          <IOSListItem
            icon={<Palette size={20} className="text-orange-500" />}
            label="Tema Tampilan"
            value="Otomatis"
            hasChevron={false}
          />
          {isAdmin && (
            <>
              <IOSListSeparator />
              <Link href="/tools">
                <IOSListItem
                  icon={<Shield size={20} className="text-indigo-500" />}
                  label="Zona Admin"
                  value="Tools"
                />
              </Link>
            </>
          )}
        </IOSListGroup>

        {/* Section E: Keamanan */}
        <IOSListHeader>Keamanan</IOSListHeader>
        <IOSListGroup className="mb-6">
          <Link href="/profile/edit#security">
            <IOSListItem
              icon={<Lock size={20} className="text-amber-500" />}
              label="Kata Sandi"
              value="Ubah"
            />
          </Link>
          <IOSListSeparator />
          <LogoutDialog />
        </IOSListGroup>

        {/* Dev Only: Claim Admin */}
        <div className="flex justify-center mb-4">
          <ClaimAdminButton />
        </div>

        {/* Changelog */}
        <div className="mb-6 px-1">
          <ChangelogList />
        </div>

        {/* Footer */}
        <div className="text-center mt-4 pb-4">
          <p className="text-lg font-semibold text-neutral-300 tracking-tight">
            togather
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            Versi 1.3.0
          </p>
          <p className="text-xs text-neutral-400 mt-2">
            <Link href="/privacy" className="hover:underline">Syarat & Privasi</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
