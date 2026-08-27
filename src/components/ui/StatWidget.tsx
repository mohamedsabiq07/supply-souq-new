import React from 'react';
import { Card } from './Card';
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
}

export const StatWidget: React.FC<StatWidgetProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
}) => {
  return (
    <Card className={cn('p-5 flex items-start justify-between relative overflow-hidden', className)}>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <h4 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">{value}</h4>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        {trend && (
          <div className="flex items-center gap-1 mt-2 text-xs font-medium">
            <span className={trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </span>
            <span className="text-slate-400">vs last month</span>
          </div>
        )}
      </div>
      <div className="p-3 bg-brand-50 text-brand-600 rounded-xl border border-brand-100/80 shrink-0">
        {icon}
      </div>
    </Card>
  );
};
