import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * IOSGroup - A Luma-style container for grouping settings/inputs
 * Creates the "White Box on Gray Background" look common in iOS apps.
 */
function IOSGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="ios-group"
      className={cn(
        "bg-white rounded-2xl overflow-hidden",
        className
      )}
      {...props}
    />
  )
}

/**
 * IOSGroupItem - An individual item within an IOSGroup
 * Includes subtle bottom border except for last child.
 */
function IOSGroupItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="ios-group-item"
      className={cn(
        "px-4 py-3 border-b border-neutral-100 last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

/**
 * IOSGroupLabel - A label/header for IOSGroup sections
 */
function IOSGroupLabel({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="ios-group-label"
      className={cn(
        "text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-2",
        className
      )}
      {...props}
    />
  )
}

export { IOSGroup, IOSGroupItem, IOSGroupLabel }
