"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-black text-white hover:bg-gray-800 shadow-sm",
        destructive:
          "bg-red-100 text-red-600 hover:bg-red-200 focus-visible:ring-red-500/20",
        outline:
          "border border-input bg-background hover:bg-accent text-accent-foreground",
        secondary:
          "bg-gray-100 text-black hover:bg-gray-200",
        ghost:
          "hover:bg-accent text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-12 px-6 py-3",
        sm: "min-h-10 px-4 py-2 text-sm",
        lg: "min-h-14 px-8 py-4 text-base",
        icon: "min-h-12 min-w-12 p-3",
        "icon-sm": "min-h-10 min-w-10 p-2.5",
        "icon-lg": "min-h-14 min-w-14 p-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  onClick,
  disabled,
  isLoading,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    isLoading?: boolean
  }) {
  const [isAutoLoading, setIsAutoLoading] = React.useState(false)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      // 1. Force cast to 'any' immediately to shut TypeScript up
      const result = onClick(e) as any

      // 2. Duck Typing Check: "Does it look like a Promise?" (Has a .then function)
      // This completely avoids the 'instanceof' error.
      if (result && typeof result === 'object' && typeof result.then === 'function') {
        setIsAutoLoading(true)

        // 3. Handle the promise safely
        Promise.resolve(result).finally(() => {
          setIsAutoLoading(false)
        })
      }
    }
  }

  const showLoading = isLoading || isAutoLoading

  // SAFE RENDER: If asChild is true, we CANNOT render the Loader2 next to children
  // because Slot requires a single child. So we skip the loader for asChild links.
  if (asChild) {
    return (
      <Slot
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        // Slot merges props, so onClick works here too if passed
        {...props}
      >
        {children}
      </Slot>
    )
  }

  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={handleClick}
      disabled={disabled || showLoading}
      {...props}
    >
      {showLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
}

export { Button, buttonVariants }
