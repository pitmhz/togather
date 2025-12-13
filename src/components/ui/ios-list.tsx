"use client";

import * as React from "react";
import { ChevronRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * IOSListGroup - A container for grouped list items (like iOS Settings sections)
 * Creates the rounded white box on gray background look.
 */
function IOSListGroup({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="ios-list-group"
      className={cn(
        "bg-white rounded-xl overflow-hidden border border-neutral-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.05)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * IOSListHeader - A section header above a group
 */
function IOSListHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="ios-list-header"
      className={cn(
        "text-xs font-medium text-neutral-500 uppercase tracking-wide px-4 pt-6 pb-2",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

/**
 * IOSListItem - An individual row in the list
 * NOTE: `icon` is a ReactNode (pre-rendered JSX), not a component reference.
 */
type IOSListItemProps = {
  icon?: React.ReactNode;
  label: string;
  value?: React.ReactNode;
  onClick?: () => void;
  isDestructive?: boolean;
  hasChevron?: boolean;
  isExternal?: boolean;
  separator?: boolean;
  className?: string;
  children?: React.ReactNode;
};

function IOSListItem({
  icon,
  label,
  value,
  onClick,
  isDestructive = false,
  hasChevron = true,
  isExternal = false,
  separator = true,
  className,
  children,
}: IOSListItemProps) {
  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      data-slot="ios-list-item"
      onClick={onClick}
      className={cn(
        "w-full flex items-center px-5 py-4 text-left",
        onClick && "cursor-pointer active:bg-neutral-50 transition-colors",
        className
      )}
    >
      {/* Left: Icon + Label */}
      <div className="flex items-center flex-1 min-w-0">
        {icon && (
          <div className="flex-shrink-0">
            {icon}
          </div>
        )}
        <span
          className={cn(
            "font-medium truncate",
            icon ? "ml-3" : "",
            isDestructive ? "text-red-500" : "text-neutral-900"
          )}
        >
          {label}
        </span>
      </div>

      {/* Right: Value + Chevron/External */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {value && (
          <span className="text-sm text-neutral-500">
            {value}
          </span>
        )}
        {children}
        {isExternal && (
          <ExternalLink className="w-4 h-4 text-neutral-300" />
        )}
        {hasChevron && !isExternal && onClick && (
          <ChevronRight className="w-4 h-4 text-neutral-300" />
        )}
      </div>
    </Wrapper>
  );
}

/**
 * IOSListSeparator - Inset separator line between items
 */
function IOSListSeparator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-px bg-neutral-100 ml-12", // Inset from left (icon width + padding)
        className
      )}
    />
  );
}

export { IOSListGroup, IOSListHeader, IOSListItem, IOSListSeparator };
