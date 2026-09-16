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
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700',
    success: 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-900',
    warning: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900',
    danger: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900',
    info: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-900',
    purple: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-900',
    amber: 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700 font-semibold',
    verified: 'bg-[#cf2e46] text-white border-red-700 font-medium',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border font-medium transition-colors',
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
      return <Badge variant="default"><Clock className="w-3 h-3" /> Draft</Badge>;
    case 'published':
      return <Badge variant="info"><Zap className="w-3 h-3" /> Published</Badge>;
    case 'receiving_quotes':
      return <Badge variant="warning"><Clock className="w-3 h-3" /> Receiving Quotes</Badge>;
    case 'evaluating':
      return <Badge variant="purple"><AlertCircle className="w-3 h-3" /> Evaluating Quotes</Badge>;
    case 'awarded':
      return <Badge variant="success"><CheckCircle2 className="w-3 h-3" /> Awarded</Badge>;
    case 'closed':
      return <Badge variant="default">Closed</Badge>;

    // Order Statuses
    case 'po_created':
      return <Badge variant="info"><Clock className="w-3 h-3" /> PO Issued</Badge>;
    case 'accepted':
      return <Badge variant="purple"><CheckCircle2 className="w-3 h-3" /> PO Accepted</Badge>;
    case 'processing':
      return <Badge variant="warning"><Clock className="w-3 h-3" /> In Processing</Badge>;
    case 'dispatched':
      return <Badge variant="info"><Truck className="w-3 h-3" /> Out for Delivery</Badge>;
    case 'delivered':
      return <Badge variant="success"><CheckCircle2 className="w-3 h-3" /> Delivered</Badge>;
    case 'completed':
      return <Badge variant="success"><Award className="w-3 h-3" /> Completed</Badge>;

    // Verification Statuses
    case 'verified':
      return <Badge variant="success"><ShieldCheck className="w-3 h-3 text-[#cf2e46]" /> Verified UAE Trader</Badge>;
    case 'pending':
      return <Badge variant="warning"><Clock className="w-3 h-3 text-amber-600" /> Verification Pending</Badge>;
    case 'rejected':
      return <Badge variant="danger"><AlertCircle className="w-3 h-3" /> License Rejected</Badge>;

    default:
      return <Badge>{status}</Badge>;
  }
};

export const HighlightBadge: React.FC<{ type: 'best_price' | 'fastest' | 'top_rated' | 'best_value' }> = ({ type }) => {
  switch (type) {
    case 'best_price':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-[#cf2e46] text-white shadow-sm">
          <Zap className="w-3 h-3" /> BEST PRICE
        </span>
      );
    case 'fastest':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-sky-600 text-white shadow-sm">
          <Truck className="w-3 h-3" /> FASTEST DELIVERY
        </span>
      );
    case 'top_rated':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500 text-slate-900 shadow-sm">
          <Award className="w-3 h-3" /> TOP RATED (4.9★)
        </span>
      );
    case 'best_value':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-600 text-white shadow-sm">
          <Flame className="w-3 h-3" /> BEST VALUE
        </span>
      );
  }
};
