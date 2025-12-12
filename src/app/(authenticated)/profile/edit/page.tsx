import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ProfileEditForm } from "./profile-edit-form";
import { SecurityForm } from "../security-form";
import { IOSListGroup, IOSListHeader } from "@/components/ui/ios-list";

// Split full_name into first and last name
function splitName(fullName: string | null): { firstName: string; lastName: string } {
  if (!fullName) return { firstName: "", lastName: "" };
  const parts = fullName.trim().split(" ");
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || "";
  return { firstName, lastName };
}

export default async function ProfileEditPage() {
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
    .select("locale, privacy_masked")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  const userEmail = user.email || "User";
  const { firstName, lastName } = splitName(profile?.full_name || null);
  const privacyMasked = member?.privacy_masked ?? false;

  // Merge profiles data with member locale
  const fullProfile = {
    full_name: profile?.full_name ?? null,
    phone_number: profile?.phone_number ?? null,
    address: profile?.address ?? null,
    maps_link: profile?.maps_link ?? null,
    gender: profile?.gender ?? null,
    birth_date: profile?.birth_date ?? null,
    mbti: profile?.mbti ?? null,
    mbti_summary: profile?.mbti_summary ?? null,
    locale: member?.locale ?? "id-ID"
  };

  return (
    <main className="min-h-screen flex flex-col pb-32 bg-[#F2F2F7]">
      {/* Content */}
      <div className="flex-1 px-4 pt-4">
        <ProfileEditForm profile={fullProfile} userEmail={userEmail} />

        {/* Security Section */}
        <div id="security" className="scroll-mt-24">
          <IOSListHeader>Keamanan</IOSListHeader>
          <IOSListGroup className="mb-6 p-4">
            <SecurityForm
              userData={{ firstName, lastName }}
              privacyMasked={privacyMasked}
            />
          </IOSListGroup>
        </div>
      </div>
    </main>
  );
}

