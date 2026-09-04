import React from 'react';
import { RFQ } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { StatusBadge } from '../ui/Badge';
import { Button } from '../../components/ui/Button';
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
  Zap 
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
    <Card className="hover:border-brand-300 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-mono font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                {rfq.rfqNumber}
              </span>
              <StatusBadge status={rfq.status} />
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-600" /> 24-Hour SLA
              </span>
              {rfq.priority === 'urgent' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  <AlertTriangle className="w-3 h-3" /> URGENT
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
              {rfq.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Project: <span className="text-slate-700 font-semibold">{rfq.projectName}</span>
              {rfq.category && (
                <span className="ml-2 text-slate-400">• Category: <strong className="text-slate-600">{rfq.category}</strong></span>
              )}
            </p>
          </div>

          <div className="sm:text-right shrink-0">
            <div className="inline-flex sm:flex-col items-center sm:items-end gap-1.5 bg-slate-50 sm:bg-transparent p-2 sm:p-0 rounded-lg">
              <span className="text-[11px] text-slate-500 font-semibold">
                {isCapacityFull ? 'Capacity Reached' : 'Fastest 5 Bids Rule'}
              </span>
              {isCapacityFull ? (
                <span className="text-xs font-extrabold text-slate-600 bg-slate-200/80 px-2.5 py-1 rounded-md border border-slate-300 inline-flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-500" /> {maxQuotes} / {maxQuotes} Full
                </span>
              ) : currentQuotesCount === 0 ? (
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 inline-flex items-center gap-1">
                  <Zap className="w-3 h-3 text-emerald-600" /> 0 / {maxQuotes} Quotes (5 Open)
                </span>
              ) : (
                <span className="text-xs font-extrabold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-300 inline-flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-600 animate-pulse" /> {currentQuotesCount} / {maxQuotes} ({spotsLeft} Spot{spotsLeft > 1 ? 's' : ''} Left!)
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 my-3 border-y border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{rfq.deliveryEmirate}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{rfq.items.length} Material Items</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">Need by: {formatDate(rfq.requiredDeliveryDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">Closes: {formatDate(rfq.closingDate)}</span>
          </div>
        </div>

        <div className="bg-slate-50 p-2.5 rounded-lg mb-4 text-xs space-y-1">
          {rfq.items.slice(0, 2).map((item, idx) => (
            <div key={item.id || idx} className="flex items-center justify-between text-slate-600">
              <span className="truncate font-medium text-slate-800">
                • {item.quantity} {item.unit} — {item.description}
              </span>
              {item.preferredBrand && (
                <span className="text-[10px] text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200 shrink-0 ml-2">
                  {item.preferredBrand}
                </span>
              )}
            </div>
          ))}
          {rfq.items.length > 2 && (
            <p className="text-[11px] text-brand-600 font-semibold pt-0.5">
              + {rfq.items.length - 2} more items in BOQ
            </p>
          )}
        </div>

        {isDeclined && (
          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between mb-3">
            <span className="font-semibold">⚠️ You declined to quote on this RFQ</span>
            {declineReason && (
              <span className="text-[11px] text-rose-600 font-medium truncate max-w-[240px]">
                Reason: {declineReason}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(rfq)}
          >
            View RFQ Specs
          </Button>

          {isSupplierView ? (
            rfq.status === 'cancelled' ? (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
                RFQ Cancelled by Buyer
              </span>
            ) : isDeclined ? (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
                Declined by You
              </span>
            ) : supplierHasQuoted ? (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-300 inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Quote Submitted
              </span>
            ) : isCapacityFull ? (
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 inline-flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                5/5 Slots Filled (Closed)
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDecline && onDecline(rfq)}
                  className="text-slate-600 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50/60 text-xs"
                >
                  Decline RFQ
                </Button>
                <Button
                  variant="amber"
                  size="sm"
                  onClick={() => onQuote && onQuote(rfq)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="font-bold shadow-sm"
                >
                  Submit Quotation ({spotsLeft} Spot{spotsLeft > 1 ? 's' : ''} Left)
                </Button>
              </div>
            )
          ) : (
            <div className="flex items-center gap-2">
              {rfq.status !== 'cancelled' && onCancelRFQ && (
                <button
                  type="button"
                  onClick={() => onCancelRFQ(rfq)}
                  className="text-xs text-slate-400 hover:text-rose-600 transition-colors px-2 py-1"
                  title="Cancel this RFQ"
                >
                  Cancel
                </button>
              )}
              {rfq.quotesCount > 0 && rfq.status !== 'cancelled' ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onCompare && onCompare(rfq)}
                  leftIcon={<GitCompare className="w-4 h-4" />}
                  className="bg-brand-600 hover:bg-brand-700 font-bold"
                >
                  Compare {Math.min(rfq.quotesCount, maxQuotes)} Quotation{rfq.quotesCount > 1 ? 's' : ''}
                </Button>
              ) : rfq.status === 'cancelled' ? (
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
                  Cancelled
                </span>
              ) : (
                <span className="text-xs text-slate-400 italic">Waiting for first 5 bids...</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
