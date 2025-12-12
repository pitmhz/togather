import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { format, Locale } from "date-fns";
import { id as idLocale, enUS, enAU } from "date-fns/locale";

const locales: Record<string, Locale> = {
  'id-ID': idLocale,
  'en-US': enUS,
  'en-AU': enAU,
};

export function formatDate(
  date: Date | string | null | undefined, 
  formatStr: string = "dd MMMM yyyy",
  localeCode: string = "id-ID"
): string {
  if (!date) return "-";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";
  
  const locale = locales[localeCode] || idLocale;
  return format(d, formatStr, { locale });
}

export function getLifeStage(birthDate: Date | string | null | undefined): { label: string; color: string } | null {
  if (!birthDate) return null;

  let bdate: Date;
  if (typeof birthDate === 'string') {
    // Handle YYYY-MM-DD manually to avoid timezone shifts
    const [year, month, day] = birthDate.split('-').map(Number);
    if (!year || !month || !day) {
        // Fallback for unexpected formats
        bdate = new Date(birthDate);
    } else {
        bdate = new Date(year, month - 1, day);
    }
  } else {
    bdate = birthDate;
  }

  // Check validity
  if (isNaN(bdate.getTime())) return null;

  const now = new Date();
  
  // Calculate age
  let age = now.getFullYear() - bdate.getFullYear();
  const m = now.getMonth() - bdate.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < bdate.getDate())) {
    age--;
  }

  if (age < 0) age = 0; // Handle future dates safely

  if (age < 12) return { label: "Anak", color: "bg-blue-100 text-blue-700 hover:bg-blue-100/80" };
  if (age < 18) return { label: "Remaja", color: "bg-pink-100 text-pink-700 hover:bg-pink-100/80" };
  if (age < 26) return { label: "Pemuda", color: "bg-purple-100 text-purple-700 hover:bg-purple-100/80" };
  if (age < 41) return { label: "Young Pro", color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80" };
  if (age < 60) return { label: "Dewasa", color: "bg-amber-100 text-amber-700 hover:bg-amber-100/80" };
  return { label: "Lansia", color: "bg-slate-100 text-slate-700 hover:bg-slate-100/80" };
}

/**
 * Mask sensitive data for privacy protection
 * @param text - The text to mask
 * @param type - Type of data: 'email', 'phone', 'address', 'map'
 * @returns Masked string
 */
export function maskData(text: string | null | undefined, type: 'email' | 'phone' | 'address' | 'map'): string {
  if (!text) return "-";

  switch (type) {
    case 'email': {
      // Show first 2 chars, mask until @, show domain
      // e.g., jo****@gmail.com
      const atIndex = text.indexOf('@');
      if (atIndex <= 0) return '****';
      const localPart = text.slice(0, atIndex);
      const domain = text.slice(atIndex);
      const visible = localPart.slice(0, 2);
      const masked = '*'.repeat(Math.max(localPart.length - 2, 2));
      return `${visible}${masked}${domain}`;
    }

    case 'phone': {
      // Show first 4, mask middle, show last 3
      // e.g., 0812****789
      if (text.length <= 7) return '****';
      const first = text.slice(0, 4);
      const last = text.slice(-3);
      const middle = '*'.repeat(Math.max(text.length - 7, 4));
      return `${first}${middle}${last}`;
    }

    case 'address': {
      // Show first word, mask the rest
      // e.g., Jalan ****
      const firstSpace = text.indexOf(' ');
      if (firstSpace <= 0) return '****';
      const firstWord = text.slice(0, firstSpace);
      return `${firstWord} ****`;
    }

    case 'map': {
      // Return hidden location text
      return "📍 Lokasi Tersembunyi";
    }

    default:
      return '****';
  }
}

/**
 * Generate a DiceBear avatar URL
 * Uses 'notionists' style for cute/cool avatars
 * 
 * @param seed - Unique identifier (e.g., user name or email)
 * @param style - DiceBear style (default: 'notionists')
 * @returns Avatar URL string
 */
export function getAvatarUrl(seed: string, style: 'notionists' | 'adventurer' | 'lorelei' = 'notionists'): string {
  const encodedSeed = encodeURIComponent(seed || 'default');
  const backgrounds = 'b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf';
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodedSeed}&backgroundColor=${backgrounds}`;
}

/**
 * Get time-based greeting and theme
 * @returns Object with greeting text and theme identifier
 */
export type TimeTheme = 'morning' | 'afternoon' | 'evening' | 'night';

export function getTimeGreeting(): { greeting: string; theme: TimeTheme; emoji: string } {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 11) {
    return { greeting: 'Selamat Pagi', theme: 'morning', emoji: '☀️' };
  } else if (hour >= 11 && hour < 15) {
    return { greeting: 'Selamat Siang', theme: 'afternoon', emoji: '🌤️' };
  } else if (hour >= 15 && hour < 18) {
    return { greeting: 'Selamat Sore', theme: 'evening', emoji: '🌅' };
  } else {
    return { greeting: 'Selamat Malam', theme: 'night', emoji: '🌙' };
  }
}

/**
 * Attendance record type for history tracking
 */
export type AttendanceRecord = {
  date: Date;
  day: string;
  status: 'present' | 'permission' | 'absent';
};

export type AttendanceInsight = 'rajin' | 'bolong' | 'hilang' | 'new';

/**
 * Analyze attendance history and return emotional insight
 */
export function analyzeAttendance(history: AttendanceRecord[]): {
  insight: AttendanceInsight;
  text: string;
  emoji: string;
  streak: number;
} {
  if (!history || history.length === 0) {
    return {
      insight: 'new',
      text: 'Selamat datang di komsel! 🎉',
      emoji: '🌟',
      streak: 0,
    };
  }

  // Calculate streak (consecutive present from most recent)
  let streak = 0;
  for (const record of history) {
    if (record.status === 'present') {
      streak++;
    } else {
      break;
    }
  }

  // Analyze last 3 records
  const recent = history.slice(0, 3);
  const presentCount = recent.filter(r => r.status === 'present').length;
  const absentCount = recent.filter(r => r.status === 'absent').length;

  // Condition A: Rajin (mostly present)
  if (presentCount >= 2) {
    return {
      insight: 'rajin',
      text: 'Kamu cukup rajin minggu ini. Pertahankan!',
      emoji: '🔥',
      streak,
    };
  }

  // Condition C: Hilang (mostly absent)
  if (absentCount >= 2) {
    return {
      insight: 'hilang',
      text: 'Kamu ada masalah apa? Cerita dong..',
      emoji: '🥺',
      streak,
    };
  }

  // Condition B: Bolong-bolong (mixed)
  return {
    insight: 'bolong',
    text: 'Ciee jarang datang.. kangen nih!',
    emoji: '👉👈',
    streak,
  };
}

/**
 * Trigger haptic feedback for touch interactions
 * @param type - Type of haptic feedback
 */
export function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') {
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return;

  try {
    switch (type) {
      case 'light':
        navigator.vibrate(10);
        break;
      case 'medium':
        navigator.vibrate(20);
        break;
      case 'heavy':
        navigator.vibrate(50);
        break;
      case 'success':
        navigator.vibrate([10, 50, 10]); // Quick double tap
        break;
      case 'error':
        navigator.vibrate([100, 50, 100]); // Long buzz pattern
        break;
      default:
        navigator.vibrate(10);
    }
  } catch {
    // Silently fail if vibration not supported
  }
}

/**
 * Calculate upcoming birthdays for members
 * @param members - Array of members with birth_date
 * @param limit - Number of upcoming birthdays to return
 * @returns Sorted array of members with daysUntil property
 */
export function getUpcomingBirthdays<T extends { birth_date: string | null; name: string }>(
  members: T[],
  limit: number = 5
): (T & { daysUntil: number; birthdayDate: Date })[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const membersWithBirthdays = members
    .filter(m => m.birth_date)
    .map(member => {
      const birthDate = new Date(member.birth_date!);
      
      // Create this year's birthday
      const thisYearBirthday = new Date(
        today.getFullYear(),
        birthDate.getMonth(),
        birthDate.getDate()
      );
      
      // If birthday already passed this year, use next year
      if (thisYearBirthday < today) {
        thisYearBirthday.setFullYear(today.getFullYear() + 1);
      }
      
      const diffTime = thisYearBirthday.getTime() - today.getTime();
      const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return {
        ...member,
        daysUntil,
        birthdayDate: thisYearBirthday,
      };
    })
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, limit);
  
  return membersWithBirthdays;
}
