'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'defualt' | 'glass' | 'premium';
}

const Card = forwardRef<HTMLDivElement, CardProps>(({
    className,
    variant = 'defualt',
    children,
    ...props
}, ref) => {
    const baseStyles = "rounded-2xl transition-all duration-300";

    const variants = {
        defualt: "bg-surface-elevated border border-white/5",
        glass: "glass hover:border-farm-500/30",
        premium: "glass border-gold-500/20 hover:border-gold-500/40 hover:shadow-gold-500/10 hover:shadow-xl",
    };

    return (
        <div
            ref={ref}
            className={cn(baseStyles, variants[variant], className)}
            {...props}
        >
            {children}
        </div>
    );
});

Card.displayName = 'Card';

export { Card };
