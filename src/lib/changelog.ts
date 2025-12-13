export type ChangelogEntry = {
  version: string;
  date: string;
  title: string;
  changes: string[];
};

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "1.3.0",
    date: "2024-12-13",
    title: "Mood Tracking & Social",
    changes: [
      "Tambah fitur Mood Meter - beri tahu kondisi kamu",
      "Halaman profil anggota publik",
      "Changelog di halaman profil",
      "Logout dengan konfirmasi",
    ],
  },
  {
    version: "1.2.0",
    date: "2024-12-10",
    title: "Privacy & Data",
    changes: [
      "Fitur ekspor data pribadi (GDPR)",
      "Mode privasi - sembunyikan data sensitif",
      "Cookie consent banner",
    ],
  },
  {
    version: "1.1.0",
    date: "2024-12-08",
    title: "UI Polish",
    changes: [
      "Aksesibilitas text scaling",
      "Auto-hide navigation bars",
      "Onboarding carousel",
      "Login page redesign",
    ],
  },
  {
    version: "1.0.0",
    date: "2024-12-01",
    title: "Launch! 🚀",
    changes: [
      "Manajemen jadwal komsel",
      "Daftar anggota dengan filter & sort",
      "Absensi dengan swipe",
      "Alat bantu: Roda Undian, Tebak Kata, dll",
    ],
  },
];
