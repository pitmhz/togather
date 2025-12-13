"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import {
    MapPinOff,
    ServerCrash,
    ShieldX,
    AlertTriangle,
    BookOpen,
    Terminal,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { ERROR_METAPHORS } from "@/lib/constants/error-texts"

interface ErrorViewProps {
    code: number
    title: string
    message: string
    digest?: string
    reset?: () => void
}

/**
 * Get the appropriate icon for an error code
 */
function getErrorIcon(code: number) {
    switch (code) {
        case 404:
            return MapPinOff
        case 500:
            return ServerCrash
        case 403:
            return ShieldX
        default:
            return AlertTriangle
    }
}

export function ErrorView({
    code,
    title,
    message,
    digest,
    reset,
}: ErrorViewProps) {
    const Icon = getErrorIcon(code)

    // Use state for the metaphor to avoid hydration mismatch
    // Math.random() during SSR would produce different results than on client
    const [metaphor, setMetaphor] = useState<string>("")

    useEffect(() => {
        // Pick a random metaphor only on the client side (on mount)
        const messages = ERROR_METAPHORS[code] || ERROR_METAPHORS['default']
        const randomMsg = messages[Math.floor(Math.random() * messages.length)]
        setMetaphor(randomMsg)
    }, [code])

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-6 py-12">
            <div className="w-full max-w-md text-center">
                {/* Error Icon */}
                <div className="mb-6 flex justify-center">
                    <div className="rounded-full bg-violet-100 p-6">
                        <Icon className="h-16 w-16 text-violet-500" strokeWidth={1.5} />
                    </div>
                </div>

                {/* Error Code */}
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                    Error {code}
                </p>

                {/* Title */}
                <h1 className="mb-3 font-heading text-3xl font-bold tracking-tight text-foreground">
                    {title}
                </h1>

                {/* Message */}
                <p className="mb-8 text-base text-muted-foreground">{message}</p>

                {/* Action Buttons */}
                <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button asChild>
                        <Link href="/">Kembali ke Home</Link>
                    </Button>
                    {reset && (
                        <Button variant="outline" onClick={reset}>
                            Coba Lagi
                        </Button>
                    )}
                </div>

                {/* Accordion Sections */}
                <div className="rounded-lg border bg-card text-left">
                    <Accordion type="single" collapsible className="w-full">
                        {/* Human Analogy Section */}
                        <AccordionItem value="analogy">
                            <AccordionTrigger className="px-4 text-sm">
                                <span className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-violet-500" />
                                    Apa yang sebenarnya terjadi? (Analogi)
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className="px-4">
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {metaphor || "Sedang mendiagnosa masalah..."}
                                </p>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Developer Log Section */}
                        <AccordionItem value="devlog" className="border-b-0">
                            <AccordionTrigger className="px-4 text-sm">
                                <span className="flex items-center gap-2">
                                    <Terminal className="h-4 w-4 text-violet-500" />
                                    Error Log (Developer Only)
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className="px-4">
                                <div className="rounded-md bg-slate-100 p-3 dark:bg-slate-800">
                                    <code className="block text-xs font-mono text-slate-700 dark:text-slate-300">
                                        {digest && (
                                            <span className="block mb-1">
                                                <span className="text-violet-600 dark:text-violet-400">digest:</span>{" "}
                                                {digest}
                                            </span>
                                        )}
                                        <span className="block">
                                            <span className="text-violet-600 dark:text-violet-400">message:</span>{" "}
                                            {message || "No additional details available"}
                                        </span>
                                        <span className="block mt-1">
                                            <span className="text-violet-600 dark:text-violet-400">code:</span>{" "}
                                            {code}
                                        </span>
                                    </code>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </div>
    )
}
