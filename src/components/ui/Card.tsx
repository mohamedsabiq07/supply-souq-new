import React from 'react';
import { cn } from '../../lib/utils';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gradient-to-b dark:from-[#111114] dark:to-[#0c0c0e] rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/[0.08] shadow-xs hover:shadow-md dark:shadow-black/40 transition-all duration-300 overflow-hidden text-slate-900 dark:text-zinc-100',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn('px-6 py-4.5 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn('p-6', className)} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn('px-6 py-4 bg-slate-50/70 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between', className)}
      {...props}
    >
      {children}
    </div>
  );
};
