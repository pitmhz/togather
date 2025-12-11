"use client";

import * as React from "react";
import { Check, ChevronsUpDown, UserPlus, AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Member = {
  id: string;
  name: string;
  status?: "available" | "unavailable" | null;
  unavailable_reason?: string | null;
  unavailable_until?: string | null;
};

type MemberComboboxProps = {
  members: Member[];
  memberAttendanceStats?: { [memberId: string]: ("present" | "absent" | "unknown")[] };
  excludeMemberIds?: string[]; // Members already assigned to other roles in this event
  value: string;
  onChange: (value: string, memberId?: string) => void;
  placeholder?: string;
};

function AttendanceDots({ stats }: { stats: ("present" | "absent" | "unknown")[] }) {
  if (!stats || stats.length === 0) return null;
  
  return (
    <span className="flex gap-0.5 ml-2">
      {stats.slice(0, 5).map((status, i) => (
        <span
          key={i}
          className={cn(
            "w-2 h-2 rounded-full",
            status === "present" && "bg-emerald-500",
            status === "absent" && "bg-red-500",
            status === "unknown" && "bg-zinc-300 dark:bg-zinc-600"
          )}
        />
      ))}
    </span>
  );
}

export function MemberCombobox({
  members,
  memberAttendanceStats = {},
  excludeMemberIds = [],
  value,
  onChange,
  placeholder = "Pilih atau ketik nama...",
}: MemberComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);

  // Sync internal state with external value
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleSelect = (member: Member) => {
    onChange(member.name, member.id);
    setInputValue(member.name);
    setOpen(false);
  };

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    // Check if input matches a member
    const matchedMember = members.find(
      (m) => m.name.toLowerCase() === newValue.toLowerCase()
    );
    if (matchedMember) {
      onChange(matchedMember.name, matchedMember.id);
    } else {
      onChange(newValue, undefined);
    }
  };

  // Filter members based on input
  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Separate available and unavailable members
  const availableMembers = filteredMembers.filter(
    (m) => m.status !== "unavailable" && !excludeMemberIds.includes(m.id)
  );
  
  const unavailableMembers = filteredMembers.filter(
    (m) => m.status === "unavailable" || excludeMemberIds.includes(m.id)
  );

  const isNewName = inputValue && !members.some(
    (m) => m.name.toLowerCase() === inputValue.toLowerCase()
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          <span className="flex items-center">
            {inputValue || placeholder}
            {inputValue && memberAttendanceStats[members.find(m => m.name === inputValue)?.id || ""] && (
              <AttendanceDots stats={memberAttendanceStats[members.find(m => m.name === inputValue)?.id || ""]} />
            )}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Cari atau ketik nama..."
            value={inputValue}
            onValueChange={handleInputChange}
          />
          <CommandList>
            <CommandEmpty>
              {inputValue ? (
                <div className="flex items-center gap-2 p-2 text-sm">
                  <UserPlus className="w-4 h-4" />
                  Gunakan "{inputValue}" sebagai nama baru
                </div>
              ) : (
                "Tidak ada jemaat ditemukan."
              )}
            </CommandEmpty>
            
            {/* Available Members */}
            {availableMembers.length > 0 && (
              <CommandGroup heading="Tersedia">
                {availableMembers.map((member) => {
                  const stats = memberAttendanceStats[member.id] || [];
                  return (
                    <CommandItem
                      key={member.id}
                      value={member.name}
                      onSelect={() => handleSelect(member)}
                      className="flex items-center justify-between"
                    >
                      <span className="flex items-center">
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            inputValue.toLowerCase() === member.name.toLowerCase()
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {member.name}
                      </span>
                      <AttendanceDots stats={stats} />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}

            {/* Unavailable Members (Disabled) */}
            {unavailableMembers.length > 0 && (
              <CommandGroup heading="Tidak Tersedia">
                {unavailableMembers.map((member) => {
                  const isExcluded = excludeMemberIds.includes(member.id);
                  const reason = isExcluded 
                    ? "Sudah ditugaskan" 
                    : member.unavailable_reason || "Tidak tersedia";
                  
                  return (
                    <CommandItem
                      key={member.id}
                      value={member.name}
                      disabled
                      className="flex items-center justify-between opacity-50 cursor-not-allowed"
                    >
                      <span className="flex items-center">
                        <AlertCircle className="mr-2 h-4 w-4 text-amber-500" />
                        {member.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({reason})
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}

            {isNewName && (
              <CommandGroup heading="Nama Baru">
                <CommandItem
                  value={inputValue}
                  onSelect={() => {
                    onChange(inputValue, undefined);
                    setOpen(false);
                  }}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Gunakan "{inputValue}"
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

