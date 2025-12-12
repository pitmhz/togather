"use client";

import * as React from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Generate hourly time slots (more relevant for komsel times)
const timeSlots = [
  "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00"
];

type DateTimePickerProps = {
  name: string;
  required?: boolean;
  defaultDate?: Date;
};

export function DateTimePicker({ name, required, defaultDate }: DateTimePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(defaultDate);
  const [time, setTime] = React.useState<string>("19:00");

  // Combine date and time into ISO string for form submission
  const combinedDateTime = React.useMemo(() => {
    if (!date) return "";
    const [hours, minutes] = time.split(":").map(Number);
    const combined = new Date(date);
    combined.setHours(hours, minutes, 0, 0);
    return combined.toISOString();
  }, [date, time]);

  return (
    <div className="space-y-3">
      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={combinedDateTime} required={required} />

      <div className="flex gap-3">
        {/* Date Picker */}
        <div className="flex-1 space-y-1.5">
          <Label className="text-xs text-neutral-500">Tanggal</Label>
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "w-full h-12 px-4 flex items-center text-left font-normal bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors",
                  !date && "text-neutral-400"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0 text-neutral-500" />
                <span className="truncate text-base">
                  {date ? format(date, "d MMM yyyy", { locale: idLocale }) : "Pilih tanggal"}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-xl shadow-xl border-border" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                locale={idLocale}
                initialFocus
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Picker */}
        <div className="flex-1 space-y-1.5">
          <Label className="text-xs text-neutral-500">Jam</Label>
          <Select value={time} onValueChange={setTime}>
            <SelectTrigger className="w-full h-12 bg-neutral-100 border-0 rounded-xl">
              <SelectValue placeholder="Pilih jam" />
            </SelectTrigger>
            <SelectContent className="max-h-60 rounded-xl shadow-xl border-border">
              {timeSlots.map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {slot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
