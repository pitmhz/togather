import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#FBFBFA]">
      <div className="max-w-2xl mx-auto py-12 px-6">
        {/* Back Link */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#9B9A97] hover:text-[#37352F] mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Link>

        {/* Header */}
        <h1 className="text-3xl font-heading font-semibold text-[#37352F] mb-4">
          Kebijakan Privasi & Penggunaan AI
        </h1>
        
        <p className="text-[#787774] mb-8">
          Togather menghargai privasi Anda. Dokumen ini menjelaskan bagaimana kami mengumpulkan, 
          menggunakan, dan melindungi data Anda.
        </p>

        {/* Section 1 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#37352F] mb-3">
            1. Data yang Kami Kumpulkan
          </h2>
          <p className="text-[#787774] mb-3">
            Untuk menyediakan layanan aplikasi, kami mengumpulkan data berikut:
          </p>
          <ul className="list-disc list-inside text-[#787774] space-y-1.5 ml-2">
            <li>Nama dan alamat email (untuk autentikasi)</li>
            <li>Detail acara/komsel yang Anda buat</li>
            <li>Data kehadiran anggota</li>
            <li>Catatan sesi dan materi diskusi</li>
          </ul>
          <p className="text-[#787774] mt-3 text-sm">
            Semua data disimpan secara aman di Supabase dan hanya dapat diakses oleh pemilik akun.
          </p>
        </section>

        {/* Section 2 - AI */}
        <section className="mb-8 p-4 bg-purple-50 border border-purple-100 rounded-lg">
          <h2 className="text-xl font-semibold text-[#37352F] mb-3">
            2. 🤖 Penggunaan Artificial Intelligence
          </h2>
          <p className="text-[#787774] mb-3">
            Aplikasi ini menggunakan teknologi <strong>Google Gemini API (Free Tier)</strong> untuk 
            fitur <strong>Asisten Materi AI</strong>.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-3">
            <p className="text-amber-800 text-sm font-medium">
              ⚠️ Peringatan Penting:
            </p>
            <p className="text-amber-700 text-sm mt-1">
              Data yang Anda masukkan ke dalam fitur AI (seperti Topik Diskusi) diproses oleh 
              Google dan tunduk pada <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">Kebijakan Privasi Google</a>.
            </p>
            <p className="text-amber-700 text-sm mt-2 font-medium">
              Mohon TIDAK memasukkan informasi pribadi sensitif (nama lengkap, NIK, alamat, 
              nomor telepon) ke dalam kolom input AI.
            </p>
          </div>
        </section>

        {/* Section 3 - Disclaimer */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#37352F] mb-3">
            3. Batasan Tanggung Jawab (Disclaimer)
          </h2>
          <p className="text-[#787774] mb-3">
            Pengembang Togather <strong>tidak bertanggung jawab</strong> atas:
          </p>
          <ul className="list-disc list-inside text-[#787774] space-y-1.5 ml-2">
            <li>Insiden keamanan data yang terjadi di sisi pihak ketiga (Google, Supabase)</li>
            <li>Kerugian akibat kelalaian pengguna dalam menjaga kerahasiaan akun</li>
            <li>Ketidakakuratan output yang dihasilkan oleh AI</li>
          </ul>
        </section>

        {/* Section 4 - Contact */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#37352F] mb-3">
            4. Kontak
          </h2>
          <p className="text-[#787774]">
            Jika ada pertanyaan mengenai kebijakan privasi ini, silakan hubungi pengembang 
            melalui halaman profil aplikasi.
          </p>
        </section>

        {/* Footer */}
        <div className="pt-8 border-t border-[#E3E3E3]">
          <p className="text-xs text-[#9B9A97]">
            Terakhir diperbarui: 12 Desember 2025
          </p>
          <p className="text-xs text-[#9B9A97] mt-1">
            Togather Beta v1.1.0
          </p>
        </div>
      </div>
    </main>
  );
}
