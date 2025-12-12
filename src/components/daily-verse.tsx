"use client";

import { useMemo } from "react";

// Golden Verses - Ayat Emas Alkitab (Indonesian)
const GOLDEN_VERSES = [
  {
    verse: "Karena begitu besar kasih Allah akan dunia ini, sehingga Ia telah mengaruniakan Anak-Nya yang tunggal, supaya setiap orang yang percaya kepada-Nya tidak binasa, melainkan beroleh hidup yang kekal.",
    reference: "Yohanes 3:16"
  },
  {
    verse: "Akulah jalan dan kebenaran dan hidup. Tidak ada seorangpun yang datang kepada Bapa, kalau tidak melalui Aku.",
    reference: "Yohanes 14:6"
  },
  {
    verse: "Segala perkara dapat kutanggung di dalam Dia yang memberi kekuatan kepadaku.",
    reference: "Filipi 4:13"
  },
  {
    verse: "Sebab Aku ini mengetahui rancangan-rancangan apa yang ada pada-Ku mengenai kamu, demikianlah firman TUHAN, yaitu rancangan damai sejahtera dan bukan rancangan kecelakaan, untuk memberikan kepadamu hari depan yang penuh harapan.",
    reference: "Yeremia 29:11"
  },
  {
    verse: "TUHAN adalah gembalaku, takkan kekurangan aku.",
    reference: "Mazmur 23:1"
  },
  {
    verse: "Percayalah kepada TUHAN dengan segenap hatimu, dan janganlah bersandar kepada pengertianmu sendiri.",
    reference: "Amsal 3:5"
  },
  {
    verse: "Tetapi carilah dahulu Kerajaan Allah dan kebenarannya, maka semuanya itu akan ditambahkan kepadamu.",
    reference: "Matius 6:33"
  },
  {
    verse: "Janganlah takut, sebab Aku menyertai engkau, janganlah bimbang, sebab Aku ini Allahmu; Aku akan meneguhkan, bahkan akan menolong engkau.",
    reference: "Yesaya 41:10"
  },
  {
    verse: "Kita tahu sekarang, bahwa Allah turut bekerja dalam segala sesuatu untuk mendatangkan kebaikan bagi mereka yang mengasihi Dia.",
    reference: "Roma 8:28"
  },
  {
    verse: "Berbahagialah orang yang lemah lembut, karena mereka akan memiliki bumi.",
    reference: "Matius 5:5"
  },
  {
    verse: "Kasih itu sabar; kasih itu murah hati; ia tidak cemburu. Ia tidak memegahkan diri dan tidak sombong.",
    reference: "1 Korintus 13:4"
  },
  {
    verse: "Bersukacitalah senantiasa. Tetaplah berdoa. Mengucap syukurlah dalam segala hal.",
    reference: "1 Tesalonika 5:16-18"
  },
  {
    verse: "Mintalah, maka akan diberikan kepadamu; carilah, maka kamu akan mendapat; ketoklah, maka pintu akan dibukakan bagimu.",
    reference: "Matius 7:7"
  },
  {
    verse: "Sebab upah dosa ialah maut; tetapi karunia Allah ialah hidup yang kekal dalam Kristus Yesus, Tuhan kita.",
    reference: "Roma 6:23"
  },
  {
    verse: "Hai anak-Ku, janganlah engkau menolak ajaran TUHAN, dan janganlah engkau bosan diperingati-Nya.",
    reference: "Amsal 3:11"
  }
];

export function DailyVerse() {
  // Pick a verse based on day of month (consistent throughout the day)
  const todaysVerse = useMemo(() => {
    const dayOfMonth = new Date().getDate();
    return GOLDEN_VERSES[dayOfMonth % GOLDEN_VERSES.length];
  }, []);

  return (
    <div className="border-l-4 border-[#37352F] pl-4 py-2 bg-white rounded-r-md">
      <p className="text-[#37352F] italic text-sm leading-relaxed">
        "{todaysVerse.verse}"
      </p>
      <p className="text-[#9B9A97] text-xs mt-2 font-medium">
        — {todaysVerse.reference}
      </p>
    </div>
  );
}
