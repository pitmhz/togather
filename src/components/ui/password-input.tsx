"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { Eye, EyeOff, Check, X, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

type PasswordInputProps = {
    value: string;
    onChange: (value: string) => void;
    userData?: {
        firstName?: string;
        lastName?: string;
    };
    placeholder?: string;
    className?: string;
};

type ValidationCheck = {
    id: string;
    label: string;
    isValid: boolean;
};

/**
 * PasswordInput - iOS-style password input with strength meter
 * Features:
 * - Toggle password visibility
 * - Animated strength bar (Red → Orange → Green)
 * - Real-time validation checklist
 */
export function PasswordInput({
    value,
    onChange,
    userData,
    placeholder = "Masukkan kata sandi baru",
    className,
}: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // Validation checks
    const validations = useMemo<ValidationCheck[]>(() => {
        const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasUppercase = /[A-Z]/.test(value);

        // Check if password contains user's name (case insensitive)
        let noNameInPassword = true;
        if (userData) {
            const lowerValue = value.toLowerCase();
            if (userData.firstName && userData.firstName.length >= 2) {
                if (lowerValue.includes(userData.firstName.toLowerCase())) {
                    noNameInPassword = false;
                }
            }
            if (userData.lastName && userData.lastName.length >= 2) {
                if (lowerValue.includes(userData.lastName.toLowerCase())) {
                    noNameInPassword = false;
                }
            }
        }

        return [
            { id: "symbol", label: "Mengandung simbol (!@#$%)", isValid: hasSymbol },
            { id: "number", label: "Mengandung angka (0-9)", isValid: hasNumber },
            { id: "uppercase", label: "Mengandung huruf kapital", isValid: hasUppercase },
            { id: "no-name", label: "Bukan nama sendiri", isValid: value.length === 0 || noNameInPassword },
        ];
    }, [value, userData]);

    // Calculate strength score (0-4)
    const strengthScore = useMemo(() => {
        if (value.length === 0) return 0;
        if (value.length < 6) return 1;
        return validations.filter((v) => v.isValid).length;
    }, [value, validations]);

    // Strength bar styling
    const strengthConfig = useMemo(() => {
        switch (strengthScore) {
            case 0:
                return { width: "0%", color: "bg-neutral-200", label: "" };
            case 1:
                return { width: "25%", color: "bg-red-500", label: "Lemah" };
            case 2:
                return { width: "50%", color: "bg-orange-500", label: "Cukup" };
            case 3:
                return { width: "75%", color: "bg-yellow-500", label: "Baik" };
            case 4:
                return { width: "100%", color: "bg-green-500", label: "Kuat" };
            default:
                return { width: "0%", color: "bg-neutral-200", label: "" };
        }
    }, [strengthScore]);

    return (
        <div className={cn("space-y-3", className)}>
            {/* Password Input */}
            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className={cn(
                        "w-full h-12 px-4 pr-12 rounded-xl border-0 bg-neutral-100 text-base transition-all outline-none",
                        "placeholder:text-neutral-400",
                        isFocused && "bg-white ring-2 ring-neutral-200"
                    )}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                    {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                    ) : (
                        <Eye className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Strength Bar */}
            {value.length > 0 && (
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <div className="h-1.5 flex-1 bg-neutral-200 rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    "h-full rounded-full transition-all duration-500 ease-out",
                                    strengthConfig.color
                                )}
                                style={{ width: strengthConfig.width }}
                            />
                        </div>
                        {strengthConfig.label && (
                            <span
                                className={cn(
                                    "ml-3 text-xs font-medium transition-colors",
                                    strengthScore <= 1 && "text-red-500",
                                    strengthScore === 2 && "text-orange-500",
                                    strengthScore === 3 && "text-yellow-600",
                                    strengthScore === 4 && "text-green-500"
                                )}
                            >
                                {strengthConfig.label}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Validation Checklist */}
            {value.length > 0 && (
                <ul className="space-y-1.5">
                    {validations.map((check) => (
                        <li
                            key={check.id}
                            className={cn(
                                "flex items-center gap-2 text-sm transition-all duration-300",
                                check.isValid ? "text-green-600" : "text-neutral-400"
                            )}
                        >
                            <div
                                className={cn(
                                    "w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300",
                                    check.isValid
                                        ? "bg-green-100 text-green-600"
                                        : "bg-neutral-100 text-neutral-400"
                                )}
                            >
                                {check.isValid ? (
                                    <Check className="w-3 h-3" />
                                ) : (
                                    <Circle className="w-2.5 h-2.5" />
                                )}
                            </div>
                            <span>{check.label}</span>
                        </li>
                    ))}
                </ul>
            )}

            {/* Minimum length hint */}
            {value.length > 0 && value.length < 6 && (
                <p className="text-xs text-orange-500">
                    Kata sandi minimal 6 karakter
                </p>
            )}
        </div>
    );
}
