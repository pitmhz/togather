import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export function formatDate(date: Date | string | null | undefined, formatStr: string = "dd MMMM yyyy"): string {
  if (!date) return "-";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";
  return format(d, formatStr, { locale: idLocale });
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
