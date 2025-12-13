"use client"

import { useEffect } from "react"
import {
    ServerCrash,
    BookOpen,
    Terminal,
} from "lucide-react"

/**
 * Global Error Page
 * 
 * This component handles errors in the root layout.
 * It MUST render its own <html> and <body> tags as per Next.js requirements.
 * We can't use ErrorView here because we don't have access to the app's providers.
 */
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Global error:", error)
    }, [error])

    return (
        <html lang="id">
            <body
                style={{
                    margin: 0,
                    fontFamily:
                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    backgroundColor: "#F3F4F6",
                    color: "#1F2937",
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1.5rem",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: "28rem",
                        textAlign: "center",
                    }}
                >
                    {/* Error Icon */}
                    <div
                        style={{
                            marginBottom: "1.5rem",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: "#EDE9FE",
                                borderRadius: "9999px",
                                padding: "1.5rem",
                            }}
                        >
                            <ServerCrash
                                style={{
                                    width: "4rem",
                                    height: "4rem",
                                    color: "#8B5CF6",
                                }}
                                strokeWidth={1.5}
                            />
                        </div>
                    </div>

                    {/* Error Code */}
                    <p
                        style={{
                            marginBottom: "0.5rem",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            color: "#6B7280",
                        }}
                    >
                        Error 500
                    </p>

                    {/* Title */}
                    <h1
                        style={{
                            marginBottom: "0.75rem",
                            fontSize: "1.875rem",
                            fontWeight: 700,
                            letterSpacing: "-0.025em",
                            color: "#1F2937",
                        }}
                    >
                        Terjadi Kesalahan Kritis
                    </h1>

                    {/* Message */}
                    <p
                        style={{
                            marginBottom: "2rem",
                            fontSize: "1rem",
                            color: "#6B7280",
                        }}
                    >
                        Sistem mengalami masalah yang tidak terduga. Tim kami sudah
                        diberitahu.
                    </p>

                    {/* Action Buttons */}
                    <div
                        style={{
                            marginBottom: "2rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.75rem",
                        }}
                    >
                        <button
                            onClick={reset}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "0.75rem 1.5rem",
                                backgroundColor: "#000000",
                                color: "#FFFFFF",
                                border: "none",
                                borderRadius: "9999px",
                                fontSize: "0.875rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "background-color 0.2s",
                            }}
                            onMouseOver={(e) =>
                                (e.currentTarget.style.backgroundColor = "#374151")
                            }
                            onMouseOut={(e) =>
                                (e.currentTarget.style.backgroundColor = "#000000")
                            }
                        >
                            Coba Lagi
                        </button>
                        <a
                            href="/"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "0.75rem 1.5rem",
                                backgroundColor: "#FFFFFF",
                                color: "#1F2937",
                                border: "1px solid #E5E7EB",
                                borderRadius: "9999px",
                                fontSize: "0.875rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                textDecoration: "none",
                                transition: "background-color 0.2s",
                            }}
                            onMouseOver={(e) =>
                                (e.currentTarget.style.backgroundColor = "#F9FAFB")
                            }
                            onMouseOut={(e) =>
                                (e.currentTarget.style.backgroundColor = "#FFFFFF")
                            }
                        >
                            Kembali ke Home
                        </a>
                    </div>

                    {/* Info Cards */}
                    <div
                        style={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: "0.5rem",
                            border: "1px solid #E5E7EB",
                            textAlign: "left",
                            overflow: "hidden",
                        }}
                    >
                        {/* Human Analogy */}
                        <details style={{ borderBottom: "1px solid #E5E7EB" }}>
                            <summary
                                style={{
                                    padding: "1rem",
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                }}
                            >
                                <BookOpen
                                    style={{ width: "1rem", height: "1rem", color: "#8B5CF6" }}
                                />
                                Apa yang sebenarnya terjadi? (Analogi)
                            </summary>
                            <div style={{ padding: "0 1rem 1rem 1rem" }}>
                                <p
                                    style={{
                                        fontSize: "0.875rem",
                                        lineHeight: 1.6,
                                        color: "#6B7280",
                                        margin: 0,
                                    }}
                                >
                                    Ibarat koki di dapur restoran kami tidak sengaja menyenggol
                                    rak piring. <em>Prang!</em> Berantakan sedikit. Koki kami
                                    sedang membereskannya sekarang. Coba pesan lagi sebentar lagi
                                    ya.
                                </p>
                            </div>
                        </details>

                        {/* Developer Log */}
                        <details>
                            <summary
                                style={{
                                    padding: "1rem",
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                }}
                            >
                                <Terminal
                                    style={{ width: "1rem", height: "1rem", color: "#8B5CF6" }}
                                />
                                Error Log (Developer Only)
                            </summary>
                            <div style={{ padding: "0 1rem 1rem 1rem" }}>
                                <div
                                    style={{
                                        backgroundColor: "#F1F5F9",
                                        borderRadius: "0.375rem",
                                        padding: "0.75rem",
                                    }}
                                >
                                    <code
                                        style={{
                                            display: "block",
                                            fontSize: "0.75rem",
                                            fontFamily: "monospace",
                                            color: "#475569",
                                        }}
                                    >
                                        {error.digest && (
                                            <span style={{ display: "block", marginBottom: "0.25rem" }}>
                                                <span style={{ color: "#7C3AED" }}>digest:</span>{" "}
                                                {error.digest}
                                            </span>
                                        )}
                                        <span style={{ display: "block" }}>
                                            <span style={{ color: "#7C3AED" }}>message:</span>{" "}
                                            {error.message || "No additional details available"}
                                        </span>
                                    </code>
                                </div>
                            </div>
                        </details>
                    </div>
                </div>
            </body>
        </html>
    )
}
