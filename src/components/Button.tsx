import React from 'react';
import { cn } from '../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-emerald-700 text-white hover:bg-emerald-800',
      secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
      outline: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
      danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
      ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
    };
    const sizes = {
      sm: 'px-3 py-1.5 text-[10px]',
      md: 'px-4 py-2 text-xs',
      lg: 'px-6 py-3 text-sm',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-bold uppercase tracking-wider rounded transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
