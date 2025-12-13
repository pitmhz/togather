import { ErrorView } from "@/components/ui/error-view"

export default function NotFound() {
    return (
        <ErrorView
            code={404}
            title="Halaman Tersesat"
            message="Kami tidak dapat menemukan halaman yang kamu cari."
        />
    )
}
