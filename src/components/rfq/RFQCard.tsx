import React from 'react';
import { RFQ } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { StatusBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatDate } from '../../lib/utils';
import {
  MapPin,
  Calendar,
  Layers,
  GitCompare,
  ArrowRight,
  Clock,
  AlertTriangle,
  Lock,
  CheckCircle2,
  Zap,
} from 'lucide-react';

interface RFQCardProps {
  rfq: RFQ;
  onView: (rfq: RFQ) => void;
  onCompare?: (rfq: RFQ) => void;
  onQuote?: (rfq: RFQ) => void;
  onDecline?: (rfq: RFQ) => void;
  onCancelRFQ?: (rfq: RFQ) => void;
  isDeclined?: boolean;
  declineReason?: string;
  isSupplierView?: boolean;
  supplierHasQuoted?: boolean;
  maxQuotes?: number;
}

export const RFQCard: React.FC<RFQCardProps> = ({
  rfq,
  onView,
  onCompare,
  onQuote,
  onDecline,
  onCancelRFQ,
  isDeclined = false,
  declineReason,
  isSupplierView = false,
  supplierHasQuoted = false,
  maxQuotes = 5,
}) => {
  const currentQuotesCount = rfq.quotesCount || 0;
  const spotsLeft = Math.max(0, maxQuotes - currentQuotesCount);
  const isCapacityFull = currentQuotesCount >= maxQuotes;

  return (
    <Card className="w-full hover:border-slate-300 dark:hover:border-white/[0.16] hover:shadow-md dark:hover:shadow-black/50 transition-all duration-200">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
          {/* LEFT SECTION: RFQ Header, Project & Metadata */}
          <div className="lg:w-[36%] shrink-0 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-mono font-bold text-brand-700 dark:text-brand-300 bg-brand-500/10 dark:bg-brand-400/10 px-2.5 py-0.5 rounded-full border border-brand-500/20">
                {rfq.rfqNumber}
              </span>
              <StatusBadge status={rfq.status} />
              <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-300 bg-rose-500/10 dark:bg-rose-400/10 px-2.5 py-0.5 rounded-full border border-rose-500/20 inline-flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#cf2e46]" /> 24-Hour SLA
              </span>
              {rfq.authorityApproval && (
                <span className="text-[11px] font-medium text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-white/[0.05] px-2.5 py-0.5 rounded-full border border-slate-200/80 dark:border-white/[0.08]">
                  {rfq.authorityApproval.split('(')[0].trim()}
                </span>
              )}
              {rfq.priority === 'urgent' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-300 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                  <AlertTriangle className="w-3 h-3" /> URGENT
                </span>
              )}
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                {rfq.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">
                {isSupplierView ? (
                  <>
                    Counterparty:{' '}
                    <span className="text-slate-800 dark:text-zinc-200 font-semibold">
                      ProcureSouq Managed Procurement Desk
                    </span>
                  </>
                ) : (
                  <>
                    Project:{' '}
                    <span className="text-slate-800 dark:text-zinc-200 font-semibold">
                      {rfq.projectName}
                    </span>
                    {rfq.consultantName && (
                      <span className="ml-1 text-slate-400 dark:text-zinc-500">
                        ({rfq.consultantName})
                      </span>
                    )}
                  </>
                )}
                {rfq.category && (
                  <span className="ml-1.5 text-slate-400 dark:text-zinc-500">
                    • Category:{' '}
                    <strong className="text-slate-700 dark:text-zinc-300 font-semibold">
                      {rfq.category}
                    </strong>
                  </span>
                )}
              </p>
            </div>

            {/* Compact Horizontal Metadata Strip */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-slate-600 dark:text-zinc-400">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{rfq.deliveryEmirate}</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{rfq.items.length} Material Items</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Need by: {formatDate(rfq.requiredDeliveryDate)}</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Closes: {formatDate(rfq.closingDate)}</span>
              </span>
            </div>
          </div>

          {/* CENTER SECTION: Material Items List */}
          <div className="lg:flex-1 min-w-0 py-3 lg:py-1 border-y lg:border-y-0 lg:border-x border-slate-100 dark:border-white/[0.06] lg:px-6 text-xs space-y-1.5">
            {rfq.items.slice(0, 3).map((item, idx) => {
              const brandDisplay =
                item.preferredBrands && item.preferredBrands.length > 0
                  ? item.preferredBrands.join(' / ')
                  : item.preferredBrand;

              return (
                <div
                  key={item.id || idx}
                  className="flex items-center justify-between gap-3 text-slate-600 dark:text-zinc-400"
                >
                  <div className="flex items-baseline gap-2 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-600 shrink-0 self-center" />
                    <span className="font-semibold text-slate-900 dark:text-white shrink-0">
                      {item.quantity} {item.unit}
                    </span>
                    <span className="truncate text-slate-700 dark:text-zinc-300">
                      {item.description}
                    </span>
                  </div>
                  {brandDisplay && (
                    <span className="text-[10px] font-medium text-slate-600 dark:text-zinc-300 bg-slate-100 dark:bg-white/[0.05] px-2 py-0.5 rounded-full border border-slate-200/80 dark:border-white/[0.08] shrink-0">
                      {brandDisplay}
                    </span>
                  )}
                </div>
              );
            })}
            {rfq.items.length > 3 && (
              <p className="text-[11px] text-brand-600 dark:text-brand-400 font-medium pl-3.5 pt-0.5">
                + {rfq.items.length - 3} more items in Bill of Quantities (BOQ)
              </p>
            )}
            {isDeclined && (
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-800 dark:text-rose-300 flex items-center justify-between mt-1">
                <span className="font-semibold">⚠️ Declined by you</span>
                {declineReason && (
                  <span className="text-rose-600 dark:text-rose-400 truncate max-w-[180px]">
                    {declineReason}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* RIGHT SECTION: Quotes Capacity & Action Buttons */}
          <div className="lg:w-[240px] shrink-0 flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3">
            <div className="flex flex-col items-start lg:items-end gap-1">
              <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium">
                {isCapacityFull ? 'Capacity Reached' : 'Fastest 5 Bids Rule'}
              </span>
              {isCapacityFull ? (
                <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-white/[0.05] px-2.5 py-0.5 rounded-full border border-slate-200/80 dark:border-white/[0.08] inline-flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-slate-400" /> {maxQuotes} / {maxQuotes} Full
                </span>
              ) : currentQuotesCount === 0 ? (
                <span className="text-xs font-semibold text-[#cf2e46] dark:text-rose-400 bg-rose-500/10 dark:bg-rose-400/10 px-2.5 py-0.5 rounded-full border border-rose-500/20 inline-flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-[#cf2e46]" /> 0 / {maxQuotes} Quotes (5 Open)
                </span>
              ) : (
                <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-500/10 dark:bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-500/25 inline-flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-amber-500 animate-pulse" /> {currentQuotesCount} / {maxQuotes} ({spotsLeft} Spot{spotsLeft > 1 ? 's' : ''} Left)
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(rfq)}
                className="rounded-xl"
              >
                View RFQ Specs
              </Button>

              {isSupplierView ? (
                rfq.status === 'cancelled' ? (
                  <span className="text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-500/10 px-3 py-1.5 rounded-full border border-rose-500/20">
                    Cancelled
                  </span>
                ) : isDeclined ? (
                  <span className="text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-500/10 px-3 py-1.5 rounded-full border border-rose-500/20">
                    Declined
                  </span>
                ) : supplierHasQuoted ? (
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Quoted
                  </span>
                ) : isCapacityFull ? (
                  <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-white/[0.05] px-3 py-1.5 rounded-full border border-slate-200/80 dark:border-white/[0.08] inline-flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    Closed
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDecline && onDecline(rfq)}
                      className="text-slate-600 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50/60 dark:text-zinc-400 text-xs rounded-xl"
                    >
                      Decline
                    </Button>
                    <Button
                      variant="amber"
                      size="sm"
                      onClick={() => onQuote && onQuote(rfq)}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                      className="font-bold shadow-xs rounded-xl"
                    >
                      Quote
                    </Button>
                  </div>
                )
              ) : (
                <div className="flex items-center gap-2">
                  {rfq.status !== 'cancelled' && onCancelRFQ && (
                    <button
                      type="button"
                      onClick={() => onCancelRFQ(rfq)}
                      className="text-xs text-slate-400 hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400 transition-colors px-2 py-1 cursor-pointer"
                      title="Cancel this RFQ"
                    >
                      Cancel
                    </button>
                  )}
                  {rfq.quotesCount > 0 && rfq.status !== 'cancelled' ? (
                    <button
                      type="button"
                      onClick={() => onCompare && onCompare(rfq)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-300/80 dark:border-rose-800/50 transition-colors cursor-pointer shadow-2xs"
                    >
                      <GitCompare className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                      <span>
                        Compare {Math.min(rfq.quotesCount, maxQuotes)} Quote
                        {rfq.quotesCount > 1 ? 's' : ''}
                      </span>
                    </button>
                  ) : rfq.status === 'cancelled' ? (
                    <span className="text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                      Cancelled
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 dark:text-zinc-500 italic">
                      Waiting for stockist bids...
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
