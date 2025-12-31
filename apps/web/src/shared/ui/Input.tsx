import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, leftIcon, ...props }, ref) => {
        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-300">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        type={type}
                        className={cn(
                            "flex h-10 w-full rounded-md border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                            leftIcon && "pl-10",
                            error && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-xs text-red-500">{error}</p>
                )}
            </div>
        );
    }
);
Input.displayName = 'Input';

export { Input };
