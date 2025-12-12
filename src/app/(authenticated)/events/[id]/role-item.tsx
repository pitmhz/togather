"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, Crown, Home, Utensils, Music, Gamepad2, HeartHandshake, User, Eraser } from "lucide-react";
import { toast } from "sonner";

import { updateRoleAssignment, type ActionState } from "./actions";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { MemberCombobox } from "@/components/member-combobox";

type Role = {
  id: string;
  role_name: string;
  assignee_name: string | null;
  member_id?: string | null;
  is_filled: boolean;
};

type Member = {
  id: string;
  name: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="flex-1 bg-[#191919] hover:bg-[#2F2F2F] text-white"
      disabled={pending}
    >
      {pending ? "Menyimpan..." : "Simpan"}
    </Button>
  );
}

export function RoleItem({ 
  role, 
  eventId,
  members = []
}: { 
  role: Role; 
  eventId: string;
  members?: Member[];
}) {
  const [open, setOpen] = useState(false);
  const [assigneeName, setAssigneeName] = useState(role.assignee_name || "");
  const [memberId, setMemberId] = useState<string | undefined>(role.member_id || undefined);

  const updateRoleWithIds = updateRoleAssignment.bind(null, role.id, eventId);
  const [state, formAction] = useActionState<ActionState, FormData>(
    updateRoleWithIds,
    null
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      setOpen(false);
    } else if (state?.success === false) {
      toast.error(state.message);
    }
  }, [state]);

  // Reset form when drawer opens
  useEffect(() => {
    if (open) {
      setAssigneeName(role.assignee_name || "");
      setMemberId(role.member_id || undefined);
    }
  }, [open, role.assignee_name, role.member_id]);

  const handleMemberChange = (name: string, selectedMemberId?: string) => {
    setAssigneeName(name);
    setMemberId(selectedMemberId);
  };

  const [isUnassigning, startUnassign] = useTransition();

  const handleUnassign = () => {
    const formData = new FormData();
    formData.append("assignee_name", "");
    formData.append("member_id", "");
    
    startUnassign(async () => {
      const result = await updateRoleWithIds(null, formData);
      if (result?.success) {
        toast.success("Petugas berhasil dikosongkan");
        setOpen(false);
        setAssigneeName("");
        setMemberId(undefined);
      } else {
        toast.error(result?.message || "Gagal mengosongkan petugas");
      }
    });
  };

  const isFilled = role.is_filled && role.assignee_name;

  // Role-specific icons based on role name
  const getRoleIcon = (roleName: string) => {
    const lower = roleName.toLowerCase();
    if (lower.includes('leader') || lower.includes('ketua') || lower.includes('wl')) 
      return <Crown className="w-4 h-4 text-yellow-500" />;
    if (lower.includes('rumah') || lower.includes('host') || lower.includes('tempat')) 
      return <Home className="w-4 h-4 text-blue-500" />;
    if (lower.includes('fellowship') || lower.includes('makan') || lower.includes('snack') || lower.includes('konsumsi')) 
      return <Utensils className="w-4 h-4 text-orange-500" />;
    if (lower.includes('worship') || lower.includes('lagu') || lower.includes('gitar') || lower.includes('singer') || lower.includes('musik')) 
      return <Music className="w-4 h-4 text-purple-500" />;
    if (lower.includes('game') || lower.includes('ice') || lower.includes('breaker')) 
      return <Gamepad2 className="w-4 h-4 text-pink-500" />;
    if (lower.includes('doa') || lower.includes('pray') || lower.includes('pendoa')) 
      return <HeartHandshake className="w-4 h-4 text-green-500" />;
    return <User className="w-4 h-4 text-[#9B9A97]" />;
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button
          className={`w-full p-3 rounded-md border text-left transition-colors ${
            isFilled
              ? "border-[#DBEDDB] bg-[#DBEDDB]/20"
              : "border-dashed border-[#E3E3E3]"
          } hover:bg-[#F7F7F5]`}
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {getRoleIcon(role.role_name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#9B9A97] uppercase tracking-wide">
                {role.role_name}
              </p>
              <p
                className={`text-sm font-medium truncate ${
                  isFilled ? "text-[#0F7B6C]" : "text-[#9B9A97]"
                }`}
              >
                {isFilled ? role.assignee_name : "Belum diisi"}
              </p>
            </div>
          </div>
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-lg font-semibold text-[#37352F]">
            {role.role_name}
          </DrawerTitle>
          <DrawerDescription>
            Pilih jemaat atau ketik nama baru
          </DrawerDescription>
        </DrawerHeader>
        <form action={formAction} className="px-4 pb-4">
          {/* Hidden inputs for form submission */}
          <input type="hidden" name="assignee_name" value={assigneeName} />
          <input type="hidden" name="member_id" value={memberId || ""} />
          
          <div className="space-y-2 mb-4">
            <Label className="text-[#37352F]">Nama Petugas</Label>
            <MemberCombobox
              members={members}
              value={assigneeName}
              onChange={handleMemberChange}
              placeholder="Pilih atau ketik nama..."
            />
          </div>
          <SubmitButton />
        </form>
        <DrawerFooter className="pt-0 grid grid-cols-2 gap-3">
          {isFilled && (
            <Button
              type="button"
              variant="outline"
              onClick={handleUnassign}
              disabled={isUnassigning}
              className="border-red-200 bg-red-50/50 text-red-600 hover:bg-red-100 hover:text-red-700"
            >
              <Eraser className="w-4 h-4 mr-2" />
              {isUnassigning ? "..." : "Kosongkan"}
            </Button>
          )}
          <DrawerClose asChild>
            <Button variant="outline" className={isFilled ? "" : "col-span-2"}>Batal</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
