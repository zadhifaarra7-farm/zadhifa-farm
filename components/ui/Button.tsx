'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'gold' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    children,
    ...props
}, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const variants = {
        primary: "bg-gradient-to-r from-farm-600 to-farm-500 text-white shadow-lg shadow-farm-900/30 hover:from-farm-500 hover:to-farm-400 hover:shadow-farm-800/50",
        secondary: "bg-surface-elevated text-farm-300 border border-farm-800/50 hover:bg-surface hover:border-farm-500/30",
        gold: "bg-gradient-to-r from-gold-600 to-gold-500 text-white shadow-lg shadow-gold-900/30 hover:from-gold-500 hover:to-gold-400 hover:shadow-gold-800/50",
        outline: "border-2 border-farm-500 text-farm-400 hover:bg-farm-900/10 hover:border-farm-400",
        ghost: "text-farm-300 hover:text-white hover:bg-white/5",
    };

    const sizes = {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-14 px-8 text-lg",
    };

    return (
        <button
            ref={ref}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : null}
            {children}
        </button>
    );
});

Button.displayName = 'Button';

export { Button };
