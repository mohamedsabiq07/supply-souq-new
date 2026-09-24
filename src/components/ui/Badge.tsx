import React from 'react';
import { cn } from '../../lib/utils';
import { RFQStatus, OrderStatus, VerificationStatus } from '../../types';
import { CheckCircle2, Clock, AlertCircle, ShieldCheck, Flame, Zap, Award, Truck } from 'lucide-react';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'amber' | 'verified';
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className,
  size = 'md',
}) => {
  const variants = {
    default: 'bg-slate-100 dark:bg-white/[0.05] text-slate-700 dark:text-zinc-300 border-slate-200/80 dark:border-white/[0.08]',
    success: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-500/20',
    warning: 'bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-200/80 dark:border-amber-500/20',
    danger: 'bg-rose-50 dark:bg-rose-500/10 text-rose-800 dark:text-rose-300 border-rose-200/80 dark:border-rose-500/20',
    info: 'bg-sky-50 dark:bg-sky-500/10 text-sky-800 dark:text-sky-300 border-sky-200/80 dark:border-sky-500/20',
    purple: 'bg-violet-50 dark:bg-violet-500/10 text-violet-800 dark:text-violet-300 border-violet-200/80 dark:border-violet-500/20',
    amber: 'bg-amber-50 dark:bg-amber-500/15 text-amber-900 dark:text-amber-200 border-amber-200/80 dark:border-amber-500/30 font-semibold',
    verified: 'bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-500/25 font-semibold',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-0.5 text-xs',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium transition-colors select-none',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: RFQStatus | OrderStatus | VerificationStatus }> = ({ status }) => {
  switch (status) {
    // RFQ Statuses
    case 'draft':
      return <Badge variant="default"><Clock className="w-3 h-3 text-slate-400" /> Draft</Badge>;
    case 'published':
      return <Badge variant="info"><Zap className="w-3 h-3 text-sky-500" /> Published</Badge>;
    case 'receiving_quotes':
      return <Badge variant="warning"><Clock className="w-3 h-3 text-amber-500 animate-pulse" /> Receiving Quotes</Badge>;
    case 'evaluating':
      return <Badge variant="purple"><AlertCircle className="w-3 h-3 text-violet-500" /> Evaluating Quotes</Badge>;
    case 'awarded':
      return <Badge variant="success"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Awarded</Badge>;
    case 'closed':
      return <Badge variant="default">Closed</Badge>;

    // Order Statuses
    case 'po_created':
      return <Badge variant="info"><Clock className="w-3 h-3 text-sky-500" /> PO Issued</Badge>;
    case 'accepted':
      return <Badge variant="purple"><CheckCircle2 className="w-3 h-3 text-violet-500" /> PO Accepted</Badge>;
    case 'processing':
      return <Badge variant="warning"><Clock className="w-3 h-3 text-amber-500" /> In Processing</Badge>;
    case 'dispatched':
      return <Badge variant="info"><Truck className="w-3 h-3 text-sky-500" /> Out for Delivery</Badge>;
    case 'delivered':
      return <Badge variant="success"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Delivered</Badge>;
    case 'completed':
      return <Badge variant="success"><Award className="w-3 h-3 text-emerald-500" /> Completed</Badge>;

    // Verification Statuses
    case 'verified':
      return <Badge variant="verified"><ShieldCheck className="w-3 h-3 text-[#cf2e46]" /> Verified UAE Trader</Badge>;
    case 'pending':
      return <Badge variant="warning"><Clock className="w-3 h-3 text-amber-500" /> Verification Pending</Badge>;
    case 'rejected':
      return <Badge variant="danger"><AlertCircle className="w-3 h-3 text-rose-500" /> License Rejected</Badge>;

    default:
      return <Badge>{status}</Badge>;
  }
};

export const HighlightBadge: React.FC<{ type: 'best_price' | 'fastest' | 'top_rated' | 'best_value' }> = ({ type }) => {
  switch (type) {
    case 'best_price':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
          <Zap className="w-3 h-3 text-emerald-500" /> Lowest Price
        </span>
      );
    case 'fastest':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase bg-sky-500/10 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/25">
          <Truck className="w-3 h-3 text-sky-500" /> Fastest Delivery
        </span>
      );
    case 'top_rated':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase bg-amber-500/10 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/25">
          <Award className="w-3 h-3 text-amber-500" /> Top Rated (4.9★)
        </span>
      );
    case 'best_value':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase bg-brand-500/10 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-500/25">
          <Flame className="w-3 h-3 text-brand-500" /> Best Overall Value
        </span>
      );
  }
};
