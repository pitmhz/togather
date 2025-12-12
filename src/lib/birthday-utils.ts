import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

type Member = {
  name: string;
  birth_date: string;
  gender?: string | null;
};

export function generateBirthdayWish(member: Member): string {
  const pronoun = member.gender === 'L' ? 'kakak' : member.gender === 'P' ? 'cici' : 'kak';
  const eventDate = new Date(member.birth_date);
  const formattedDate = format(eventDate, "d MMMM", { locale: idLocale });
  
  const text = `🎂 *Selamat Ulang Tahun ${pronoun} ${member.name}!* 🎉

Semoga di usia yang baru ini, Tuhan terus memberkati langkah-langkahmu, menjaga kesehatanmu, dan menyertai setiap rencana hidupmu.

"Sebab Aku ini mengetahui rancangan-rancangan apa yang ada pada-Ku mengenai kamu, demikianlah firman TUHAN, yaitu rancangan damai sejahtera dan bukan rancangan kecelakaan, untuk memberikan kepadamu hari depan yang penuh harapan." - Yeremia 29:11

🙏 Tuhan Yesus memberkati selalu!`;

  return encodeURIComponent(text);
}

export function generateBirthdayWishRaw(member: Member): string {
  return decodeURIComponent(generateBirthdayWish(member));
}

// Get months until birthday
export function getDaysUntilBirthday(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  
  // Set birth date to this year
  const thisYearBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  
  // If birthday has passed this year, use next year
  if (thisYearBirthday < today) {
    thisYearBirthday.setFullYear(today.getFullYear() + 1);
  }
  
  const diffTime = thisYearBirthday.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Check if birthday is this month
export function isBirthdayThisMonth(birthDate: string): boolean {
  const today = new Date();
  const birth = new Date(birthDate);
  return birth.getMonth() === today.getMonth();
}
