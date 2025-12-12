# Togather: Community Super App 🚀

> **v1.2-beta (The Luma Update)**

 \![Design System](https://www.google.com/search?q=https://img.shields.io/badge/design-Luma%252F iOS-000000) 

**Togather** adalah platform manajemen komunitas modern yang dirancang untuk memanusiakan interaksi digital. Bukan sekadar alat administrasi, tetapi sebuah "Super App" yang menggabungkan produktivitas, gamifikasi, dan *pastoral care* dalam satu genggaman.

Dibangun dengan pendekatan **"PWA-First"** dan arsitektur **Micro-Apps**, aplikasi ini memberikan pengalaman *native-like* yang sat-set, estetik (iOS Style), dan siap menemani dinamika komunitas (Komsel/CG).

-----

## ✨ Fitur Unggulan (v1.2)

### 🎨 Visual & Experience (Luma-inspired)

  - **iOS Design Language:** Antarmuka yang bersih, *rounded corners*, dan *glassmorphism* yang elegan.
  - **Dynamic Dashboard:** Kartu "Member Pass" yang menyapa user sesuai waktu (Pagi/Malam) dengan latar ilustrasi dinamis.
  - **Emotional Streak:** Pelacak kehadiran yang memberikan respon emosional ("Kamu rajin\!" vs "Kangen nih..") berdasarkan riwayat user.
  - **Smart Header:** Navigasi *auto-hide* yang memberikan ruang baca imersif.

### 🧩 Micro-Apps Architecture

Alih-alih menu yang membosankan, fitur-fitur utilitas hadir sebagai aplikasi mini yang interaktif:

  - **⚡ Absensi Swipe:** Cara absen seru ala Tinder (Geser Kanan = Hadir).
  - **🎡 Roda Undian:** Gamifikasi pembagian doorprize atau giliran tugas.
  - **🃏 Kartu Sharing:** Alat pemantik *Deep Talk* digital.
  - **💣 Bom Waktu & Charades:** *Ice breaking games* offline-first untuk mencairkan suasana.

### 🛡️ Security & Privacy

  - **Privacy Shield:** Mode penyamaran data sensitif (WA/Alamat) saat demonstrasi aplikasi.
  - **Audit Trail:** "Kotak Hitam" digital yang mencatat setiap aksi krusial Admin.
  - **RBAC:** Kontrol akses bertingkat (Member vs Leader vs Admin).

### ⚡ Performance (The "Sat-Set" Protocol)

  - **Optimistic UI:** Feedback instan pada interaksi tombol (Like/Swipe) tanpa menunggu server.
  - **Haptic Feedback:** Getaran fisik halus pada interaksi penting (memberikan rasa *tactile*).
  - **Safe Rollback:** Mekanisme keamanan yang mengembalikan status UI jika sinkronisasi server gagal.

-----

## 🛠️ Tech Stack

Project ini dibangun di atas fondasi teknologi modern yang *scalable*:

  - **Framework:** [Next.js 15 (App Router)](https://nextjs.org/) - React Server Components.
  - **Database & Auth:** [Supabase](https://supabase.com/) - PostgreSQL, Realtime, Auth.
  - **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/).
  - **Animation:** [Framer Motion](https://www.framer.com/motion/) - Transisi halaman & elemen mulus.
  - **State & Cache:** React Query / SWR - Manajemen data sisi klien.
  - **Assets:** [DiceBear API](https://www.dicebear.com/) (Avatar Dinamis).
  - **Mobile Engine:** [Capacitor 6](https://capacitorjs.com/) (Ready) - Jembatan menuju Native Android/iOS.

-----

## 🚀 Cara Menjalankan (Local Development)

Pastikan Node.js (v18+) sudah terinstall.

1.  **Clone Repositori**

    ```bash
    git clone https://github.com/username/togather.git
    cd togather
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    # atau
    pnpm install
    ```

3.  **Setup Environment Variables**
    Buat file `.env.local` dan isi kredensial Supabase Anda:

    ```bash
    NEXT_PUBLIC_SUPABASE_URL=your_url_here
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
    ```

4.  **Jalankan Server**

    ```bash
    npm run dev
    ```

    Buka [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) di browser Anda.
-----

*Dibuat dengan ❤️ dan kopi (serta sesi vibecoding 10 jam).*
