import Link from "next/link";
import { Shield, Lock, Eye, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto py-20 px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-green-100 text-green-700 border-0">
              Last Updated: December 2025
            </Badge>
            <Badge className="bg-blue-100 text-blue-700 border-0">
              Open Audit Ready
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#37352F] mb-4 leading-tight">
            Data Anda Adalah Milik Anda.
          </h1>
          <p className="text-xl text-[#787774] leading-relaxed">
            Transparansi total tentang Cookies, AI, dan janji kami menjaga privasi komunitas Anda.
          </p>
        </div>

        <article className="prose prose-neutral lg:prose-lg max-w-none">
          {/* Section 1: Filosofi Kami */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#37352F] mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-indigo-600" />
              Filosofi Kami
            </h2>
            
            <div className="bg-[#F7F7F5] border-l-4 border-indigo-600 p-6 rounded-r-lg mb-6">
              <p className="text-[#37352F] font-medium mb-0">
                Togather tidak dibangun untuk menjual iklan. Togather dibangun untuk melayani komunitas.
              </p>
            </div>

            <p className="text-[#787774] leading-relaxed">
              Kami tidak menjual data Anda, tidak memasang pelacak iklan (Meta Pixel/Google Ads), 
              dan tidak mengintip percakapan pribadi Anda. Aplikasi ini adalah alat untuk memperkuat 
              persaudaraan dalam komunitas, bukan untuk mengeksploitasi informasi pribadi Anda.
            </p>
          </section>

          {/* Section 2: Cookie Policy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#37352F] mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6 text-amber-600" />
              Kebijakan Cookie
            </h2>
            
            <p className="text-[#787774] leading-relaxed mb-4">
              Kami hanya menggunakan <strong>"Strictly Necessary Cookies"</strong> — cookies yang 
              diperlukan agar aplikasi dapat berfungsi dengan baik.
            </p>

            <div className="bg-white border border-[#E3E3E3] rounded-lg p-6 mb-4">
              <h3 className="text-lg font-semibold text-[#37352F] mb-3">Yang Kami Simpan:</h3>
              <ul className="space-y-3 text-[#787774]">
                <li>
                  <code className="bg-[#F7F7F5] px-2 py-1 rounded text-sm text-indigo-600">sb-access-token</code>
                  <span className="ml-2">— Autentikasi Supabase (Agar Anda tetap login)</span>
                </li>
                <li>
                  <code className="bg-[#F7F7F5] px-2 py-1 rounded text-sm text-indigo-600">theme-preference</code>
                  <span className="ml-2">— Preferensi tema (Dark/Light mode)</span>
                </li>
                <li>
                  <code className="bg-[#F7F7F5] px-2 py-1 rounded text-sm text-indigo-600">group-context</code>
                  <span className="ml-2">— Menyimpan ID grup aktif</span>
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
              <p className="text-amber-900 font-medium mb-0">
                ⚠️ Kami TIDAK menggunakan 3rd party cookies untuk membuntuti Anda di internet.
              </p>
            </div>
          </section>

          {/* Section 3: Inventaris Data */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#37352F] mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6 text-purple-600" />
              Inventaris Data
            </h2>
            
            <p className="text-[#787774] leading-relaxed mb-4">
              Berikut adalah data yang kami kumpulkan dan simpan:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#F7F7F5]">
                    <th className="border border-[#E3E3E3] px-4 py-3 text-left text-[#37352F] font-semibold">
                      Kategori
                    </th>
                    <th className="border border-[#E3E3E3] px-4 py-3 text-left text-[#37352F] font-semibold">
                      Detail
                    </th>
                    <th className="border border-[#E3E3E3] px-4 py-3 text-left text-[#37352F] font-semibold">
                      Keamanan
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-[#E3E3E3] px-4 py-3 font-medium text-[#37352F]">
                      Identitas
                    </td>
                    <td className="border border-[#E3E3E3] px-4 py-3 text-[#787774]">
                      Nama, Email, Avatar
                    </td>
                    <td className="border border-[#E3E3E3] px-4 py-3 text-[#787774]">
                      Disimpan di Supabase Secure Database
                    </td>
                  </tr>
                  <tr className="bg-[#FAFAFA]">
                    <td className="border border-[#E3E3E3] px-4 py-3 font-medium text-[#37352F]">
                      Profil Psikologis
                    </td>
                    <td className="border border-[#E3E3E3] px-4 py-3 text-[#787774]">
                      MBTI, Gender, Tanggal Lahir
                    </td>
                    <td className="border border-[#E3E3E3] px-4 py-3 text-[#787774]">
                      Opsional, untuk fitur komunitas
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-[#E3E3E3] px-4 py-3 font-medium text-[#37352F]">
                      Spiritual
                    </td>
                    <td className="border border-[#E3E3E3] px-4 py-3 text-[#787774]">
                      Pokok Doa
                    </td>
                    <td className="border border-[#E3E3E3] px-4 py-3 text-[#787774]">
                      Terenkripsi, hanya Leader/Member grup
                    </td>
                  </tr>
                  <tr className="bg-[#FAFAFA]">
                    <td className="border border-[#E3E3E3] px-4 py-3 font-medium text-[#37352F]">
                      Aktivitas
                    </td>
                    <td className="border border-[#E3E3E3] px-4 py-3 text-[#787774]">
                      Log Kehadiran
                    </td>
                    <td className="border border-[#E3E3E3] px-4 py-3 text-[#787774]">
                      Untuk laporan komsel
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4: Integrasi AI */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#37352F] mb-4">
              Integrasi AI (Google Gemini)
            </h2>
            
            <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-r-lg mb-6">
              <p className="text-purple-900 font-medium mb-2">
                🤖 Fitur "Asisten Materi" & "Profil MBTI" menggunakan Google Gemini API.
              </p>
              <p className="text-purple-800 text-sm mb-0">
                Data Anda diproses oleh Google untuk menghasilkan konten, lalu dikembalikan ke server kami.
              </p>
            </div>

            <h3 className="text-lg font-semibold text-[#37352F] mb-3">Alur Data:</h3>
            <ol className="list-decimal pl-6 space-y-2 text-[#787774] mb-4">
              <li>Anda memasukkan Topik atau Tipe MBTI</li>
              <li>Data dikirim ke Google Gemini API untuk diproses</li>
              <li>Google mengembalikan hasil analisa/materi</li>
              <li>Hasil disimpan di database Anda</li>
            </ol>

            <div className="bg-white border border-[#E3E3E3] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#37352F] mb-3">Janji Kami:</h3>
              <p className="text-[#787774] leading-relaxed mb-0">
                Kami tidak mengirim data pribadi sensitif (Email/Nomor Telepon/Pokok Doa) ke API AI. 
                Hanya data yang diperlukan untuk konteks (misal: Nama Anda untuk personalisasi MBTI summary) 
                yang dikirim, dan kami selalu meminimalisir data yang terekspos.
              </p>
            </div>
          </section>

          {/* Section 5: Open Audit */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#37352F] mb-4">
              Open Audit & Transparansi
            </h2>
            
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg mb-6">
              <p className="text-blue-900 font-semibold mb-2">
                💎 "Don't trust, verify."
              </p>
              <p className="text-blue-800 text-sm mb-0">
                Kami percaya bahwa privasi yang sejati harus dapat diverifikasi, bukan hanya dijanjikan.
              </p>
            </div>

            <p className="text-[#787774] leading-relaxed mb-4">
              Codebase kami terbuka untuk audit keamanan. Jika Anda adalah ahli keamanan siber atau 
              pimpinan organisasi yang ingin melakukan audit keamanan sebelum penggunaan skala besar, 
              silakan hubungi kami.
            </p>

            <p className="text-[#787774] leading-relaxed">
              <strong>Kami tidak menyembunyikan apapun.</strong> Setiap baris kode, setiap query database, 
              setiap API call — semuanya dapat diaudit.
            </p>
          </section>

          {/* Section 6: Hak Anda */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#37352F] mb-4 flex items-center gap-2">
              <Download className="w-6 h-6 text-green-600" />
              Hak Anda (GDPR / UU PDP)
            </h2>
            
            <p className="text-[#787774] leading-relaxed mb-4">
              Sesuai dengan regulasi GDPR (Eropa) dan UU Perlindungan Data Pribadi (Indonesia), 
              Anda memiliki hak penuh atas data Anda:
            </p>

            <div className="space-y-4">
              <div className="bg-white border-l-4 border-green-500 p-4 rounded-r-lg">
                <h3 className="font-semibold text-[#37352F] mb-1">
                  1. Hak untuk Mengakses
                </h3>
                <p className="text-[#787774] text-sm mb-0">
                  Unduh seluruh data Anda dalam format JSON kapanpun dari halaman Profil.
                </p>
              </div>

              <div className="bg-white border-l-4 border-red-500 p-4 rounded-r-lg">
                <h3 className="font-semibold text-[#37352F] mb-1">
                  2. Hak untuk Dihapus (Right to be Forgotten)
                </h3>
                <p className="text-[#787774] text-sm mb-0">
                  Hapus akun Anda secara permanen. Semua data akan dihapus dari server kami.
                </p>
              </div>

              <div className="bg-white border-l-4 border-yellow-500 p-4 rounded-r-lg">
                <h3 className="font-semibold text-[#37352F] mb-1">
                  3. Hak untuk Mengoreksi
                </h3>
                <p className="text-[#787774] text-sm mb-0">
                  Update atau koreksi data Anda kapanpun melalui halaman Profil.
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <section className="border-t border-[#E3E3E3] pt-8 mt-12">
            <h3 className="text-lg font-semibold text-[#37352F] mb-3">
              Kontak Privasi
            </h3>
            <p className="text-[#787774] leading-relaxed mb-2">
              Jika Anda memiliki pertanyaan tentang privasi data Anda, silakan hubungi:
            </p>
            <p className="text-indigo-600 font-medium">
              📧 privacy@pieter.com
            </p>
            <p className="text-[#9B9A97] text-sm mt-6">
              Terakhir diperbarui: 12 Desember 2025
            </p>
          </section>
        </article>

        {/* Back Link */}
        <div className="mt-12 pt-8 border-t border-[#E3E3E3]">
          <Link 
            href="/profile" 
            className="text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-2"
          >
            ← Kembali ke Profil
          </Link>
        </div>
      </div>
    </main>
  );
}
