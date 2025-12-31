import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export type BadgeVariant = 'default' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: BadgeVariant;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, variant = 'default', ...props }, ref) => {

        const variants = {
            default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
            secondary: 'border-transparent bg-slate-800 text-slate-200 hover:bg-slate-700',
            success: 'border-transparent bg-green-500/20 text-green-400 hover:bg-green-500/30',
            danger: 'border-transparent bg-red-500/20 text-red-500 hover:bg-red-500/30',
            warning: 'border-transparent bg-amber-500/20 text-amber-500 hover:bg-amber-500/30',
            outline: 'text-slate-200 border-slate-700',
        };

        return (
            <div
                ref={ref}
                className={cn(
                    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2',
                    variants[variant],
                    className
                )}
                {...props}
            />
        );
    }
);
Badge.displayName = 'Badge';

export { Badge };
