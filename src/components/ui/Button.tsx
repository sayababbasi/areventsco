import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "gold" | "navy" | "outline-gold" | "outline-navy" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "gold", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const variantStyles = {
      gold: "bg-gradient-to-r from-brand-gold-600 via-brand-gold-500 to-brand-gold-600 text-white shadow-gold hover:from-brand-gold-700 hover:to-brand-gold-500 hover:shadow-lg",
      navy: "bg-brand-navy-900 text-white shadow-subtle hover:bg-brand-navy-800 hover:shadow-md",
      "outline-gold": "bg-transparent border border-brand-gold-400 text-brand-gold-700 hover:bg-brand-gold-50 hover:border-brand-gold-600",
      "outline-navy": "bg-transparent border border-brand-navy-300 text-brand-navy-900 hover:bg-brand-navy-50 hover:border-brand-navy-600",
      ghost: "bg-transparent text-brand-navy-800 hover:bg-brand-warm-100",
    };

    const sizeStyles = {
      sm: "px-3.5 py-1.5 text-xs font-medium rounded-md",
      md: "px-5 py-2.5 text-sm font-semibold rounded-lg",
      lg: "px-7 py-3.5 text-base font-semibold rounded-xl",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
