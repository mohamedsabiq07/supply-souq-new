import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { BuyerCancelRFQModal } from '../../components/rfq/BuyerCancelRFQModal';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { formatDate, formatAED } from '../../lib/utils';
import {
  MapPin,
  Calendar,
  Layers,
  GitCompare,
  FileText,
  Building2,
  Clock,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Store,
  ArrowRight,
  Trash2
} from 'lucide-react';

interface RFQDetailPageProps {
  rfqId: string;
  onNavigate: (view: string, params?: any) => void;
}

export const RFQDetailPage: React.FC<RFQDetailPageProps> = ({ rfqId, onNavigate }) => {
  const { rfqs, quotations, isRFQExtendedUnlocked, cancelRFQByBuyer } = useAppData();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const rfq = rfqs.find(r => r.id === rfqId || r.rfqNumber === rfqId);

  if (!rfq) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
        <p className="text-base font-bold text-slate-900">RFQ Not Found</p>
        <Button variant="primary" className="mt-4" onClick={() => onNavigate('buyer-rfqs')}>
          Back to RFQs
        </Button>
      </div>
    );
  }

  const rfqQuotes = quotations.filter(q => q.rfqId === rfq.id || q.rfqNumber === rfq.rfqNumber);
  const isUnlocked = isRFQExtendedUnlocked(rfq.id);
  const visibleQuotes = isUnlocked ? rfqQuotes : rfqQuotes.slice(0, 5);
  const lockedCount = isUnlocked ? 0 : Math.max(0, rfqQuotes.length - 5);

  const handleConfirmCancel = (rfqIdToCancel: string, reason: string, notes?: string) => {
    cancelRFQByBuyer(rfqIdToCancel, reason, notes);
    onNavigate('buyer-rfqs');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('buyer-rfqs')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to RFQs
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded border border-brand-100 dark:border-brand-900/60">
                {rfq.rfqNumber}
              </span>
              <StatusBadge status={rfq.status} />
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 24-Hour Stockist SLA
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {rfq.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {rfq.status !== 'cancelled' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCancelModalOpen(true)}
              className="text-slate-600 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50/60 dark:text-zinc-400 dark:hover:text-rose-400"
              leftIcon={<Trash2 className="w-4 h-4 text-rose-500" />}
            >
              Cancel / Remove RFQ
            </Button>
          )}

          {rfqQuotes.length > 0 && rfq.status !== 'cancelled' && (
            <button
              type="button"
              onClick={() => onNavigate('buyer-compare', { rfqId: rfq.id })}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-300/80 dark:border-rose-800/50 hover:border-rose-400 dark:hover:border-rose-700 transition-all shadow-2xs active:scale-[0.99] cursor-pointer shrink-0"
            >
              <GitCompare className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Compare {visibleQuotes.length} Quotation{visibleQuotes.length > 1 ? 's' : ''} in Matrix</span>
            </button>
          )}
        </div>
      </div>

      {/* RFQ Project Specification Dossier (De-boxed Unified Grid) */}
      <div className="bg-white dark:bg-gradient-to-b dark:from-[#111114] dark:to-[#0c0c0e] rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/[0.08] shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-white/[0.06]">
          <div className="p-5 space-y-1">
            <span className="text-slate-400 dark:text-zinc-500 text-[11px] font-semibold uppercase tracking-wider block">Material Category</span>
            <strong className="text-sm sm:text-base text-slate-900 dark:text-white font-bold block truncate">{rfq.category}</strong>
            <p className="text-xs text-brand-600 dark:text-brand-400 font-medium">
              {rfq.items.length} Material Line Items Specified
            </p>
          </div>

          <div className="p-5 space-y-1">
            <span className="text-slate-400 dark:text-zinc-500 text-[11px] font-semibold uppercase tracking-wider block">Delivery Destination</span>
            <strong className="text-sm sm:text-base text-slate-900 dark:text-white font-bold block truncate">{rfq.deliveryEmirate}</strong>
            <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">
              {rfq.deliveryAddress || 'Site delivery direct'}
            </p>
          </div>

          <div className="p-5 space-y-1">
            <span className="text-slate-400 dark:text-zinc-500 text-[11px] font-semibold uppercase tracking-wider block">Compliance & Commercial</span>
            <strong className="text-sm sm:text-base text-slate-900 dark:text-white font-bold block truncate">
              {rfq.authorityApproval || 'Standard UAE Spec'}
            </strong>
            <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">
              Payment Terms: <span className="font-semibold text-slate-700 dark:text-zinc-300">{rfq.paymentTermsPreference || '30 Days PDC'}</span>
            </p>
          </div>

          <div className="p-5 space-y-1">
            <span className="text-slate-400 dark:text-zinc-500 text-[11px] font-semibold uppercase tracking-wider block">Stockist Response SLA</span>
            <strong className="text-sm sm:text-base text-slate-900 dark:text-white font-bold block">
              {rfqQuotes.length > 0 
                ? isUnlocked ? `${rfqQuotes.length} Quotes (Extended)` : `${Math.min(rfqQuotes.length, 5)} / 5 Bids Received`
                : 'Broadcast in Progress'}
            </strong>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3" /> Closes: {formatDate(rfq.closingDate)}
            </p>
          </div>
        </div>
      </div>

      {/* Received Supplier Quotations Showcase Cards (De-boxed) */}
      {rfqQuotes.length > 0 ? (
        <div className="bg-white dark:bg-gradient-to-b dark:from-[#111114] dark:to-[#0c0c0e] rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/[0.08] p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/[0.06] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>
                    {isUnlocked ? `${rfqQuotes.length} Quotations Unlocked` : `${Math.min(rfqQuotes.length, 5)} of 5 Stockist Offers`}
                  </span>
                </span>
                {lockedCount > 0 && (
                  <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/25">
                    +{lockedCount} More Locked (AED 49)
                  </span>
                )}
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Received Supplier Quotations
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                Direct binding commercial offers from verified UAE stockists collected for RFQ #{rfq.rfqNumber}.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('buyer-compare', { rfqId: rfq.id })}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-300/80 dark:border-rose-800/50 hover:border-rose-400 dark:hover:border-rose-700 transition-all shadow-2xs active:scale-[0.99] cursor-pointer"
            >
              <GitCompare className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Compare {visibleQuotes.length} Quotation{visibleQuotes.length > 1 ? 's' : ''} in Matrix</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleQuotes.map((quote, idx) => (
              <div
                key={quote.id}
                className="bg-slate-50/50 dark:bg-white/[0.02] p-5 rounded-2xl border border-slate-200/80 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/[0.14] transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-brand-700 dark:text-brand-300 bg-brand-500/10 px-2 py-0.5 rounded-full text-[11px]">
                      {quote.quotationNumber}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {quote.buyerRating ? (
                        <span className="font-semibold text-amber-800 dark:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 text-[10px]">
                          ★ {quote.buyerRating}/5
                        </span>
                      ) : null}
                      <span className="font-medium text-slate-500 dark:text-zinc-400 text-[11px]">
                        Offer {idx + 1} of {visibleQuotes.length}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{quote.supplierCompanyName}</h4>
                    <span className="text-[11px] text-slate-500 dark:text-zinc-400 block">{quote.supplierZone || quote.supplierEmirate}</span>
                  </div>

                  {/* Clean Hero Price - De-boxed */}
                  <div className="pt-2 pb-1 border-t border-slate-200/60 dark:border-white/[0.06]">
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold uppercase tracking-wider block">
                      Total Quoted Amount (5% VAT Incl.)
                    </span>
                    <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white mt-0.5">
                      {formatAED(quote.grandTotalAED)}
                    </div>
                  </div>

                  {/* Floating Operational Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-xs py-1">
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">Lead Time</span>
                      <strong className="text-slate-800 dark:text-zinc-200 font-semibold">
                        {quote.leadTimeDisplay || `${quote.leadTimeDays} Days`}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">Payment Terms</span>
                      <strong className="text-slate-800 dark:text-zinc-200 font-semibold truncate block">
                        {quote.paymentTerms || '30 Days PDC'}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {lockedCount > 0 && (
              <div
                onClick={() => onNavigate('buyer-compare', { rfqId: rfq.id })}
                className="p-5 rounded-2xl border-2 border-dashed border-amber-400/40 dark:border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 transition-all space-y-3 flex flex-col justify-between cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded-full">
                      +5 Extended Pack
                    </span>
                    <span className="text-xs font-bold text-amber-800 dark:text-amber-300 font-mono">AED 49.00</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">+{lockedCount} More Supplier Quotations</h5>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">Tier-2 factory importers & regional stockist bids</p>
                  </div>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 leading-relaxed">
                    Pay AED 49 to unlock 5 additional supplier quotations for this RFQ.
                  </p>
                </div>
                <Button
                  variant="amber"
                  size="sm"
                  onClick={() => onNavigate('buyer-compare', { rfqId: rfq.id })}
                  className="w-full text-xs font-bold shadow-xs rounded-xl"
                >
                  Unlock 5 More Quotes
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center space-y-3 rounded-2xl sm:rounded-3xl border border-dashed border-emerald-500/30 bg-emerald-500/5">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mx-auto font-bold">
            <Clock className="w-6 h-6 animate-pulse text-emerald-500" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">RFQ Dispatched to 5 Verified Stockists</h4>
            <p className="text-xs text-slate-600 dark:text-zinc-400">
              Your material requirement has been delivered to 5 matching stockists. Stockists are submitting commercial quotations within our 24-hour SLA.
            </p>
            {rfq.matchedSupplierNames && rfq.matchedSupplierNames.length > 0 && (
              <div className="pt-2 flex flex-wrap justify-center gap-1.5 text-[11px]">
                {rfq.matchedSupplierNames.map((name, i) => (
                  <span key={i} className="bg-white dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/[0.08] px-2.5 py-1 rounded-full text-slate-700 dark:text-zinc-200 font-semibold shadow-xs">
                    ✓ {name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Materials Schedule Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Materials Schedule (BOQ)</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{rfq.items.length} line items specified for procurement.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-white/[0.03] text-slate-600 dark:text-zinc-400 font-semibold border-b border-slate-200/80 dark:border-white/[0.06]">
              <tr>
                <th className="p-3.5">#</th>
                <th className="p-3.5 min-w-[200px]">Description</th>
                <th className="p-3.5 min-w-[220px]">Technical Specification</th>
                <th className="p-3.5">Preferred Brand</th>
                <th className="p-3.5">Quantity</th>
                <th className="p-3.5">Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
              {rfq.items.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.03] transition-colors">
                  <td className="p-3.5 font-mono text-slate-400 dark:text-zinc-500">{idx + 1}</td>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">{item.description}</td>
                  <td className="p-3.5 text-slate-600 dark:text-zinc-400">{item.specification || 'Standard Mill Spec'}</td>
                  <td className="p-3.5 font-medium text-slate-800 dark:text-zinc-200">
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {(item.preferredBrands && item.preferredBrands.length > 0) ? (
                        item.preferredBrands.map((b) => (
                          <span key={b} className="bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/20 font-semibold px-2.5 py-0.5 rounded-full text-[10px]">
                            {b}
                          </span>
                        ))
                      ) : (
                        <span className="bg-slate-100 dark:bg-white/[0.05] text-slate-700 dark:text-zinc-300 border border-slate-200/80 dark:border-white/[0.08] px-2.5 py-0.5 rounded-full text-[11px] font-medium">
                          {item.preferredBrand || 'Open Spec'}
                        </span>
                      )}
                      {item.allowAlternatives && (
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          (Equiv. OK)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3.5 font-extrabold text-slate-900 dark:text-white font-mono text-sm">{item.quantity}</td>
                  <td className="p-3.5 text-slate-600 dark:text-zinc-400 font-medium">{item.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Buyer Cancel RFQ Modal */}
      <BuyerCancelRFQModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        rfq={rfq}
        onConfirmCancel={handleConfirmCancel}
      />
    </div>
  );
};