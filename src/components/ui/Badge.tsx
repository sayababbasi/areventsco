import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "gold" | "navy" | "success" | "pending" | "danger" | "neutral";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "gold",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    gold: "bg-brand-gold-100 text-brand-gold-900 border-brand-gold-300",
    navy: "bg-brand-navy-100 text-brand-navy-900 border-brand-navy-300",
    success: "bg-emerald-50 text-emerald-800 border-emerald-300",
    pending: "bg-amber-50 text-amber-800 border-amber-300",
    danger: "bg-rose-50 text-rose-800 border-rose-300",
    neutral: "bg-gray-100 text-gray-800 border-gray-300",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs font-semibold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
