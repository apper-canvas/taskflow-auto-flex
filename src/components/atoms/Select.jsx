import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = forwardRef(({ 
  className, 
  children,
  error,
  ...props 
}, ref) => {
  return (
    <div className="relative">
      <select
        className={cn(
          "flex w-full px-3 py-2 text-sm bg-white border rounded-lg shadow-sm transition-colors duration-200 appearance-none pr-8",
          "focus:outline-none focus:ring-2 focus:ring-offset-0",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
            : "border-slate-300 focus:border-primary-400 focus:ring-primary-100 hover:border-slate-400",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <ApperIcon name="ChevronDown" className="w-4 h-4 text-slate-400" />
      </div>
    </div>
  );
});

Select.displayName = "Select";

export default Select;