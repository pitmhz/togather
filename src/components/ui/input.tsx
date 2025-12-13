import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-gray-400 selection:bg-primary selection:text-primary-foreground min-h-14 w-full min-w-0 bg-[#F3F4F6] border-none px-5 py-4 text-lg rounded-2xl transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus:bg-white focus:ring-2 focus:ring-black/10 focus:scale-[1.01]",
        "aria-invalid:ring-red-200 aria-invalid:bg-red-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
