import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLifeStage(birthDate: Date | string | null | undefined): { label: string; color: string } | null {
  if (!birthDate) return null;

  const bdate = new Date(birthDate);
  const now = new Date();
  
  // Calculate age
  let age = now.getFullYear() - bdate.getFullYear();
  const m = now.getMonth() - bdate.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < bdate.getDate())) {
    age--;
  }

  if (age < 12) return { label: "Anak", color: "bg-blue-100 text-blue-700" };
  if (age < 18) return { label: "Remaja", color: "bg-pink-100 text-pink-700" };
  if (age < 26) return { label: "Pemuda", color: "bg-purple-100 text-purple-700" };
  if (age < 41) return { label: "Young Pro", color: "bg-emerald-100 text-emerald-700" };
  if (age < 60) return { label: "Dewasa", color: "bg-amber-100 text-amber-700" };
  return { label: "Lansia", color: "bg-slate-100 text-slate-700" };
}
