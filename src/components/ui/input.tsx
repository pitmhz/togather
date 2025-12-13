import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground min-h-12 w-full min-w-0 rounded-xl border-0 bg-neutral-100 px-4 py-3 text-base transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus:bg-white focus:ring-2 focus:ring-neutral-200",
        "aria-invalid:ring-red-200 aria-invalid:bg-red-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
