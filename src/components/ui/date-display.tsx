"use client";

import { formatDate } from "@/lib/utils";

type SmartDateProps = {
  date: Date | string | null | undefined;
  format?: string;
  className?: string;
  // In a real app, we'd pull this from a Context or Hook. 
  // For now, we'll accept it as a prop or eventually adding a React Context.
  localeCode?: string; 
};

export function SmartDate({ date, format = "dd MMMM yyyy", className, localeCode = "id-ID" }: SmartDateProps) {
  if (!date) return <span className={className}>-</span>;

  // Render the formatted date
  // Since this is a client component, user preference could be injected here
  return (
    <span className={className}>
      {formatDate(date, format, localeCode)}
    </span>
  );
}
