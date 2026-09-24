import React from 'react';
import { cn } from '../../lib/utils';

interface StatWidgetProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
  onClick?: () => void;
}

export const StatWidget: React.FC<StatWidgetProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group p-6 rounded-3xl bg-white/90 dark:bg-gradient-to-b dark:from-[#111114] dark:to-[#0c0c0e] border border-slate-200/70 dark:border-white/[0.06] shadow-2xs hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col justify-between',
        onClick && 'cursor-pointer hover:border-slate-300 dark:hover:border-white/[0.15]',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[11px] font-mono font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest">
            {title}
          </p>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight pt-0.5">
            {value}
          </div>
        </div>

        {/* Clean, de-boxed icon glyph with gentle radial aura */}
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-slate-600 dark:text-zinc-300 bg-slate-100/70 dark:bg-white/[0.05] group-hover:scale-105 transition-transform duration-300 shrink-0">
          {icon}
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="pt-4 mt-2 border-t border-slate-100/80 dark:border-white/[0.04] flex items-center justify-between text-xs">
          {subtitle && (
            <span className="text-slate-500 dark:text-zinc-400 text-[11px] font-medium truncate">
              {subtitle}
            </span>
          )}
          {trend && (
            <span className={cn(
              'font-mono text-[11px] font-bold shrink-0 ml-auto',
              trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-zinc-400'
            )}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
