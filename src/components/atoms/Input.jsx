import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text", 
  error,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex w-full px-3 py-2 text-sm bg-white border rounded-lg shadow-sm transition-colors duration-200",
        "placeholder:text-slate-400",
        "focus:outline-none focus:ring-2 focus:ring-offset-0",
        "disabled:cursor-not-allowed disabled:opacity-50",
        error
          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
          : "border-slate-300 focus:border-primary-400 focus:ring-primary-100 hover:border-slate-400",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;