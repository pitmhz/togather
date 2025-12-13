/**
 * MBTI Personality Type Summaries in Bahasa Indonesia
 * Used for displaying personality insights on member profiles
 */

export type MBTIType = 
  | "INTJ" | "INTP" | "ENTJ" | "ENTP"
  | "INFJ" | "INFP" | "ENFJ" | "ENFP"
  | "ISTJ" | "ISFJ" | "ESTJ" | "ESFJ"
  | "ISTP" | "ISFP" | "ESTP" | "ESFP";

export type MBTISummary = {
  title: string;
  summary: string;
  strengths: string[];
  inCommunity: string;
};

export const MBTI_SUMMARIES: Record<MBTIType, MBTISummary> = {
  // Analysts (NT)
  INTJ: {
    title: "Sang Ahli Strategi",
    summary: "Visioner yang mandiri dan analitis. Memiliki standar tinggi dan selalu mencari cara untuk memperbaiki sistem. Cenderung pendiam namun penuh ide brilian.",
    strengths: ["Strategis", "Mandiri", "Analitis", "Penuh Wawasan"],
    inCommunity: "Cocok untuk perencanaan jangka panjang dan pemecahan masalah kompleks dalam komunitas.",
  },
  INTP: {
    title: "Sang Pemikir Logis",
    summary: "Pemikir yang kreatif dan inovatif. Haus akan pengetahuan dan senang menganalisis teori. Lebih suka bekerja di belakang layar.",
    strengths: ["Logis", "Kreatif", "Objektif", "Fleksibel"],
    inCommunity: "Hebat dalam memberikan perspektif unik dan solusi inovatif untuk tantangan.",
  },
  ENTJ: {
    title: "Sang Komandan",
    summary: "Pemimpin alami yang percaya diri dan tegas. Mampu melihat gambaran besar dan mengorganisir orang untuk mencapai tujuan bersama.",
    strengths: ["Tegas", "Efisien", "Percaya Diri", "Strategis"],
    inCommunity: "Sangat efektif dalam memimpin proyek dan menggerakkan tim menuju tujuan.",
  },
  ENTP: {
    title: "Sang Pendebat",
    summary: "Inovatif dan berpikir cepat. Senang tantangan intelektual dan selalu punya argumen menarik. Energik dalam diskusi.",
    strengths: ["Inovatif", "Cerdas", "Antusias", "Adaptif"],
    inCommunity: "Membawa energi segar dan ide-ide baru yang memicu pertumbuhan komunitas.",
  },

  // Diplomats (NF)
  INFJ: {
    title: "Sang Advokat",
    summary: "Idealis yang penuh empati dan memiliki visi kuat. Mementingkan makna dan tujuan hidup. Sangat perhatian pada perasaan orang lain.",
    strengths: ["Penuh Wawasan", "Idealis", "Berempati", "Berprinsip"],
    inCommunity: "Menjadi pendengar dan penasihat yang luar biasa bagi sesama anggota.",
  },
  INFP: {
    title: "Sang Mediator",
    summary: "Idealis yang tenang dan kreatif. Memiliki nilai-nilai yang kuat dan selalu berusaha memahami orang lain secara mendalam.",
    strengths: ["Empatik", "Kreatif", "Tulus", "Reflektif"],
    inCommunity: "Membawa kehangatan dan pemahaman mendalam dalam interaksi kelompok.",
  },
  ENFJ: {
    title: "Sang Protagonis",
    summary: "Karismatik dan inspiratif. Pemimpin yang peduli dan mampu membawa yang terbaik dari orang lain. Sangat terampil dalam berkomunikasi.",
    strengths: ["Karismatik", "Empati Tinggi", "Inspiratif", "Terorganisir"],
    inCommunity: "Secara alami menyatukan orang dan memotivasi tim untuk mencapai potensi terbaik.",
  },
  ENFP: {
    title: "Sang Aktivis",
    summary: "Antusias dan kreatif. Melihat potensi di mana-mana dan menularkan semangat. Sangat sosial dan penuh energi positif.",
    strengths: ["Antusias", "Kreatif", "Sosial", "Optimis"],
    inCommunity: "Energi dan antusiasme yang menular, membuat suasana selalu hidup.",
  },

  // Sentinels (SJ)
  ISTJ: {
    title: "Sang Logistik",
    summary: "Praktis dan bertanggung jawab. Sangat dapat diandalkan dan konsisten. Memegang teguh tradisi dan aturan.",
    strengths: ["Andal", "Praktis", "Jujur", "Terorganisir"],
    inCommunity: "Pilar keandalan yang menjaga konsistensi dan keteraturan kelompok.",
  },
  ISFJ: {
    title: "Sang Pelindung",
    summary: "Hangat dan penuh perhatian. Setia dan rela berkorban untuk orang-orang tersayang. Pekerja keras di balik layar.",
    strengths: ["Suportif", "Andal", "Sabar", "Perhatian"],
    inCommunity: "Pendukung setia yang selalu siap membantu tanpa perlu pengakuan.",
  },
  ESTJ: {
    title: "Sang Eksekutif",
    summary: "Terorganisir dan tegas. Sangat baik dalam mengelola tugas dan memastikan segala sesuatu berjalan sesuai rencana.",
    strengths: ["Terorganisir", "Tegas", "Bertanggung Jawab", "Langsung"],
    inCommunity: "Manajer alami yang memastikan acara dan kegiatan berjalan lancar.",
  },
  ESFJ: {
    title: "Sang Konsul",
    summary: "Peduli dan sangat sosial. Menikmati membantu orang lain dan menciptakan harmoni. Sangat perhatian pada kebutuhan kelompok.",
    strengths: ["Peduli", "Sosial", "Loyal", "Praktis"],
    inCommunity: "Perekat sosial yang memastikan setiap orang merasa diterima dan dihargai.",
  },

  // Explorers (SP)
  ISTP: {
    title: "Sang Virtuoso",
    summary: "Praktis dan tenang. Ahli dalam memecahkan masalah teknis dengan tangan. Fleksibel dan adaptif terhadap situasi baru.",
    strengths: ["Praktis", "Tenang", "Fleksibel", "Pemecah Masalah"],
    inCommunity: "Orang yang tepat saat ada masalah teknis atau situasi darurat.",
  },
  ISFP: {
    title: "Sang Petualang",
    summary: "Lembut dan sensitif. Memiliki apresiasi mendalam terhadap keindahan dan pengalaman. Hidup di saat ini.",
    strengths: ["Sensitif", "Kreatif", "Harmonis", "Autentik"],
    inCommunity: "Membawa sentuhan artistik dan keindahan dalam kegiatan komunitas.",
  },
  ESTP: {
    title: "Sang Pengusaha",
    summary: "Energik dan berani. Cepat dalam mengambil tindakan dan senang tantangan. Karismatik dan pandai bergaul.",
    strengths: ["Berani", "Praktis", "Energik", "Langsung"],
    inCommunity: "Pembawa aksi yang membuat kegiatan menjadi lebih dinamis dan menarik.",
  },
  ESFP: {
    title: "Sang Penghibur",
    summary: "Spontan dan penuh energi. Mencintai kehidupan dan membawa kegembiraan ke mana pun. Sangat menyenangkan dan mudah bergaul.",
    strengths: ["Spontan", "Energik", "Menghibur", "Praktis"],
    inCommunity: "Jiwa pesta yang membuat setiap pertemuan menjadi momen yang berkesan.",
  },
};

/**
 * Get MBTI summary by type
 */
export function getMBTISummary(type: string | null): MBTISummary | null {
  if (!type) return null;
  const upperType = type.toUpperCase() as MBTIType;
  return MBTI_SUMMARIES[upperType] || null;
}

/**
 * Get MBTI color classes by type
 */
export function getMBTIColorClass(type: string | null): string {
  if (!type) return "bg-neutral-100 text-neutral-700";
  
  const colors: Record<string, string> = {
    // Analysts (Purple)
    INTJ: "bg-purple-100 text-purple-700",
    INTP: "bg-purple-100 text-purple-700",
    ENTJ: "bg-purple-100 text-purple-700",
    ENTP: "bg-purple-100 text-purple-700",
    // Diplomats (Green)
    INFJ: "bg-green-100 text-green-700",
    INFP: "bg-green-100 text-green-700",
    ENFJ: "bg-green-100 text-green-700",
    ENFP: "bg-green-100 text-green-700",
    // Sentinels (Blue)
    ISTJ: "bg-blue-100 text-blue-700",
    ISFJ: "bg-blue-100 text-blue-700",
    ESTJ: "bg-blue-100 text-blue-700",
    ESFJ: "bg-blue-100 text-blue-700",
    // Explorers (Amber)
    ISTP: "bg-amber-100 text-amber-700",
    ISFP: "bg-amber-100 text-amber-700",
    ESTP: "bg-amber-100 text-amber-700",
    ESFP: "bg-amber-100 text-amber-700",
  };
  
  return colors[type.toUpperCase()] || "bg-neutral-100 text-neutral-700";
}
