"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

const CONSENT_KEY = "togather_cookie_consent";

export function CookieConsent() {
  const [hasConsented, setHasConsented] = useState(true); // Default true to avoid flash

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      setHasConsented(false);
      // Show the toast after a short delay
      setTimeout(() => {
        toast(
          <div className="flex flex-col gap-2">
            <p className="text-sm">
              🍪 Aplikasi ini menggunakan penyimpanan lokal untuk menjamin Anda tetap login. 
              Kami tidak melacak aktivitas Anda di luar aplikasi ini.
            </p>
            <button
              onClick={() => {
                localStorage.setItem(CONSENT_KEY, "true");
                setHasConsented(true);
                toast.dismiss();
              }}
              className="self-end px-3 py-1 bg-[#191919] text-white text-xs rounded-md hover:bg-[#2F2F2F]"
            >
              Mengerti
            </button>
          </div>,
          {
            duration: Infinity,
            id: "cookie-consent",
          }
        );
      }, 2000);
    }
  }, []);

  return null; // This component just triggers the toast
}
