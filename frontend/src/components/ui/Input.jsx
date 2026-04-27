import React from "react";
import { twMerge } from "tailwind-merge";

export const Input = React.forwardRef(({ className, type, icon: Icon, ...props }, ref) => {
    return (
        <div className="relative w-full">
            {Icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 z-10">
                    <Icon size={18} />
                </div>
            )}
            <input
                type={type}
                className={twMerge(
                    "flex h-12 w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-base ring-offset-white transition-all placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:opacity-50 text-slate-900 shadow-sm",
                    Icon ? "pl-11" : "pl-4",
                    className
                )}
                ref={ref}
                {...props}
            />
        </div>
    );
});
