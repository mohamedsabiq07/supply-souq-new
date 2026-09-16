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
        'bg-white dark:bg-[#0c0c0e] rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-subtle hover:shadow-card transition-all duration-200 overflow-hidden text-slate-900 dark:text-zinc-100',
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
      className={cn('px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between', className)}
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
      className={cn('px-6 py-4 bg-slate-50/70 dark:bg-[#121215] border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between', className)}
      {...props}
    >
      {children}
    </div>
  );
};
