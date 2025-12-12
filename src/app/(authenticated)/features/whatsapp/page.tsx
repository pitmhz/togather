"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, ExternalLink, CheckCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// WhatsApp invitation template
function generateInvitation(eventName: string, date: string, time: string, location: string) {
    return `🙏 *Undangan Komsel*

Hai! Kamu diundang untuk menghadiri:

📌 *${eventName}*
📅 ${date}
⏰ ${time}
📍 ${location}

Mari bersama-sama bertumbuh dalam iman!

Sampai jumpa! 🤝`;
}

export default function WhatsAppPage() {
    const [eventName, setEventName] = useState("Komsel Mingguan");
    const [date, setDate] = useState("Sabtu, 14 Desember 2024");
    const [time, setTime] = useState("19:00 WIB");
    const [location, setLocation] = useState("Rumah Budi");
    const [copied, setCopied] = useState(false);

    const invitation = generateInvitation(eventName, date, time, location);

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(invitation);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const openWhatsApp = () => {
        const encoded = encodeURIComponent(invitation);
        window.open(`https://wa.me/?text=${encoded}`, "_blank");
    };

    return (
        <main className="min-h-screen flex flex-col bg-[#F2F2F7]">
            {/* Header */}
            <header className="sticky top-0 z-10 flex items-center gap-3 p-4 bg-[#F2F2F7]/80 backdrop-blur-md border-b border-neutral-200/50">
                <Link
                    href="/dashboard"
                    className="p-2 -ml-2 rounded-full hover:bg-neutral-200 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-neutral-600" />
                </Link>
                <h1 className="text-lg font-semibold text-neutral-900">
                    💬 WhatsApp Invitation
                </h1>
            </header>

            {/* Content */}
            <div className="flex-1 p-4 space-y-4">
                {/* Form */}
                <div className="bg-white rounded-2xl p-4 space-y-4 shadow-sm border border-neutral-100">
                    <div>
                        <label className="text-sm font-medium text-neutral-500 mb-1.5 block">
                            Nama Acara
                        </label>
                        <input
                            type="text"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            className="w-full bg-neutral-100 rounded-xl h-12 px-4 text-base outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium text-neutral-500 mb-1.5 block">
                                Tanggal
                            </label>
                            <input
                                type="text"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-neutral-100 rounded-xl h-12 px-4 text-base outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-neutral-500 mb-1.5 block">
                                Waktu
                            </label>
                            <input
                                type="text"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full bg-neutral-100 rounded-xl h-12 px-4 text-base outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-neutral-500 mb-1.5 block">
                            Lokasi
                        </label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full bg-neutral-100 rounded-xl h-12 px-4 text-base outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                </div>

                {/* Preview */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
                    <p className="text-sm font-medium text-neutral-500 mb-2">Preview</p>
                    <div className="bg-[#DCF8C6] rounded-xl p-4 font-mono text-sm whitespace-pre-wrap">
                        {invitation}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <Button
                        onClick={copyToClipboard}
                        variant="outline"
                        className={cn(
                            "flex-1 h-14 rounded-xl text-base font-semibold transition-all",
                            copied && "bg-green-50 border-green-500 text-green-600"
                        )}
                    >
                        {copied ? (
                            <>
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Tersalin!
                            </>
                        ) : (
                            <>
                                <Copy className="w-5 h-5 mr-2" />
                                Salin Teks
                            </>
                        )}
                    </Button>

                    <Button
                        onClick={openWhatsApp}
                        className="flex-1 h-14 rounded-xl text-base font-semibold bg-green-600 hover:bg-green-700"
                    >
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Buka WhatsApp
                    </Button>
                </div>
            </div>
        </main>
    );
}
