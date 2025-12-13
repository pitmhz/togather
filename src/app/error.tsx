"use client"

import { useEffect } from "react"
import { ErrorView } from "@/components/ui/error-view"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Optionally log the error to an error reporting service
        console.error("Application error:", error)
    }, [error])

    return (
        <ErrorView
            code={500}
            title="Ada Masalah Teknis"
            message={error.message || "Terjadi kesalahan yang tidak terduga."}
            digest={error.digest}
            reset={reset}
        />
    )
}
