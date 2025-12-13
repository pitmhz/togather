/**
 * Error Metaphors - Human-friendly analogies for error codes
 * Each error code has multiple variations that are randomly selected on the client side
 */

export const ERROR_METAPHORS: Record<number | 'default', string[]> = {
  404: [
    "Ibarat kamu janjian ketemuan di sebuah kafe, tapi pas sampai di lokasi, kafenya sudah jadi lahan parkir kosong. Alamatnya mungkin salah, atau gedungnya sudah pindah.",
    "Seperti mencari buku favoritmu di perpustakaan, tapi ternyata raknya kosong. Mungkin ada orang lain yang sedang meminjamnya, atau bukunya dipindahkan ke rak lain.",
    "Ibarat kamu datang ke konser dengan tiket valid, tapi ternyata venue-nya sudah pindah lokasi bulan lalu. Alamat lama, konser baru.",
    "Seperti pesan makanan delivery, tapi pas kurir sampai, ternyata alamatnya tidak ada. GPS bilang sampai, tapi yang ada cuma lapangan kosong.",
  ],
  500: [
    "Ibarat koki di dapur restoran kami tidak sengaja menyenggol rak piring. *Prang!* Berantakan sedikit. Koki kami sedang membereskannya sekarang. Coba pesan lagi sebentar lagi ya.",
    "Seperti mesin kopi kantor yang tiba-tiba ngadat pas lagi rame. Teknisi kami sudah dipanggil dan sedang ngulik mesinnya. Kopi akan segera ready!",
    "Ibarat orkestra yang sedang perform, tiba-tiba ada satu pemain yang salah ketuk. *Deng!* Konduktor sedang briefing ulang sekarang. Pertunjukan akan segera dilanjutkan.",
    "Seperti sistem kereta yang delay karena ada gangguan sinyal. Tim teknisi sudah turun ke lapangan. Estimasi normal dalam beberapa menit.",
  ],
  403: [
    "Ibarat kamu mau masuk ke ruang VIP tapi security bilang namamu tidak ada di daftar tamu. Mungkin perlu izin khusus untuk masuk ke sini.",
    "Seperti mencoba buka brankas dengan kode yang salah. Brankas tetap terkunci, tapi tidak rusak. Mungkin perlu minta kode yang benar ke yang punya.",
    "Ibarat mau masuk ke backstage konser tapi pass-nya bukan all-access. Area ini khusus untuk kru dan artis saja.",
  ],
  default: [
    "Ada kabel yang keserimpet di belakang layar. Sistem bingung sesaat.",
    "Seperti remote TV yang tiba-tiba tidak responsif. Coba ganti baterai atau tekan tombol sekali lagi.",
    "Ibarat lampu lalu lintas yang berkedip kuning. Situasi tidak berbahaya, tapi perlu hati-hati dan coba lagi.",
  ],
}
