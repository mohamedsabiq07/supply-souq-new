import React from 'react';
import { RFQ } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { StatusBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatDate } from '../../lib/utils';
import { MapPin, Calendar, Layers, GitCompare, ArrowRight, Clock, AlertTriangle } from 'lucide-react';

interface RFQCardProps {
  rfq: RFQ;
  onView: (rfq: RFQ) => void;
  onCompare?: (rfq: RFQ) => void;
  onQuote?: (rfq: RFQ) => void;
  isSupplierView?: boolean;
}

export const RFQCard: React.FC<RFQCardProps> = ({
  rfq,
  onView,
  onCompare,
  onQuote,
  isSupplierView = false,
}) => {
  return (
    <Card className="hover:border-brand-300 transition-all">
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
              <span className="text-xs text-slate-500 font-medium">5-Stockist Response</span>
              <span className="text-lg font-extrabold text-slate-900 bg-brand-50 text-brand-700 px-2.5 py-0.5 rounded-md border border-brand-200">
                {rfq.quotesCount} / {rfq.invitedCount || 5} Quotes
              </span>
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

        <div className="flex items-center justify-between gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(rfq)}
          >
            View RFQ Specs
          </Button>

          {isSupplierView ? (
            <Button
              variant="amber"
              size="sm"
              onClick={() => onQuote && onQuote(rfq)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Submit Quotation
            </Button>
          ) : (
            rfq.quotesCount > 0 ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onCompare && onCompare(rfq)}
                leftIcon={<GitCompare className="w-4 h-4" />}
                className="bg-brand-600 hover:bg-brand-700"
              >
                Compare {rfq.quotesCount} Quotations
              </Button>
            ) : (
              <span className="text-xs text-slate-400 italic">Waiting for supplier bids...</span>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
};
