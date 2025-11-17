import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "default", 
  children,
  color,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors";

  const variants = {
    default: "bg-slate-100 text-slate-800 border border-slate-200",
    primary: "bg-primary-100 text-primary-800 border border-primary-200",
    secondary: "bg-slate-100 text-slate-600 border border-slate-200",
    success: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    warning: "bg-amber-100 text-amber-800 border border-amber-200",
    danger: "bg-red-100 text-red-800 border border-red-200",
    custom: ""
  };

  // Custom color styling
  const customStyle = color ? {
    backgroundColor: `${color}20`,
    color: color,
    borderColor: `${color}40`
  } : {};

  return (
    <span
      ref={ref}
      className={cn(
        baseClasses,
        variant === "custom" ? "border" : variants[variant],
        className
      )}
      style={variant === "custom" ? customStyle : {}}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;