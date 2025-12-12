"use client";

import { useState, useTransition } from "react";
import { Download, Trash2, Shield, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

export function PrivacyControl() {
  const [deleteDrawerOpen, setDeleteDrawerOpen] = useState(false);
  const [isExporting, startExport] = useTransition();

  const handleExportData = () => {
    startExport(async () => {
      try {
        toast.loading("Mempersiapkan data...", { id: "export" });
        
        const response = await fetch("/api/user/export");
        
        if (!response.ok) {
          throw new Error("Export gagal");
        }

        // Get the blob and create download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `togather-data-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast.success("Data berhasil diunduh!", { id: "export" });
      } catch (error) {
        toast.error("Gagal mengunduh data", { id: "export" });
      }
    });
  };

  const handleDeleteRequest = () => {
    setDeleteDrawerOpen(false);
    toast.info("Silakan hubungi admin untuk penghapusan akun permanen.", {
      duration: 5000,
    });
  };

  return (
    <>
      <Card className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-green-600" />
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Privasi & Data
            </h3>
            <Badge className="bg-green-100 text-green-700 text-[10px] border-0">
              🛡️ GDPR / UU PDP
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Data Anda adalah milik Anda. Kami tidak menjual data Anda ke pihak ketiga.
          </p>

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleExportData}
              disabled={isExporting}
              variant="outline"
              className="justify-start"
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? "Mengunduh..." : "📥 Unduh Data Saya (JSON)"}
            </Button>

            <Button
              onClick={() => setDeleteDrawerOpen(true)}
              variant="outline"
              className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              ⚠️ Hapus Akun Permanen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Drawer */}
      <Drawer open={deleteDrawerOpen} onOpenChange={setDeleteDrawerOpen}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <DrawerTitle className="text-lg font-semibold text-red-600">
                Hapus Akun Permanen
              </DrawerTitle>
            </div>
            <DrawerDescription>
              Tindakan ini tidak dapat dibatalkan.
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-2">
              <p className="text-sm text-red-700 font-medium">
                ⚠️ Dengan menghapus akun, Anda akan kehilangan:
              </p>
              <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                <li>Semua data profil dan pengaturan</li>
                <li>Riwayat komsel dan kehadiran</li>
                <li>Analisa MBTI yang sudah di-generate</li>
                <li>Akses ke semua fitur aplikasi</li>
              </ul>
            </div>
          </div>

          <DrawerFooter className="pt-0 grid grid-cols-2 gap-3">
            <Button
              onClick={handleDeleteRequest}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Ya, Hapus Akun
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Batal</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
