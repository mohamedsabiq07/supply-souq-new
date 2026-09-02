import React, { useState } from 'react';
import { RFQ, Quotation } from '../../types';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge, HighlightBadge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { formatAED, formatDate } from '../../lib/utils';
import {
  CheckCircle2,
  Award,
  Zap,
  Truck,
  ShieldCheck,
  Building2,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Phone,
  Mail,
  AlertCircle,
  Sparkles,
  Percent,
  Gift,
  Lock,
  Unlock,
  CreditCard,
  Layers,
  Flame
} from 'lucide-react';

interface QuotationComparisonTableProps {
  rfq: RFQ;
  quotations: Quotation[];
  onAward: (rfqId: string, quoteId: string) => void;
  onViewQuotePDF?: (quote: Quotation) => void;
}

export const QuotationComparisonTable: React.FC<QuotationComparisonTableProps> = ({
  rfq,
  quotations,
  onAward,
}) => {
  const [sortBy, setSortBy] = useState<'price_asc' | 'delivery_asc' | 'rating_desc' | 'recommended'>('recommended');
  const [expandedQuoteId, setExpandedQuoteId] = useState<string | null>(null);
  const [selectedAwardQuote, setSelectedAwardQuote] = useState<Quotation | null>(null);
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);

  if (quotations.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center mb-3">
          <Zap className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-slate-900">Waiting for Quotations</h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
          Your RFQ #{rfq.rfqNumber} has been distributed to {rfq.invitedCount} verified suppliers in {rfq.deliveryEmirate}. As quotations arrive, they will appear here side-by-side.
        </p>
      </div>
    );
  }

  // Pool of all real quotations received for this specific RFQ
  const activeQuotationsPool = quotations;

  // Find Best values for badges across active pool
  const minPrice = Math.min(...activeQuotationsPool.map(q => q.grandTotalAED));
  const minLeadTime = Math.min(...activeQuotationsPool.map(q => q.leadTimeDays));
  const maxRating = Math.max(...activeQuotationsPool.map(q => q.supplierRating));

  // Sort logic
  const sortedQuotes = [...activeQuotationsPool].sort((a, b) => {
    if (sortBy === 'price_asc') return a.grandTotalAED - b.grandTotalAED;
    if (sortBy === 'delivery_asc') return a.leadTimeDays - b.leadTimeDays;
    if (sortBy === 'rating_desc') return b.supplierRating - a.supplierRating;
    return a.grandTotalAED - b.grandTotalAED;
  });

  const handleOpenAwardModal = (quote: Quotation) => {
    setSelectedAwardQuote(quote);
    setIsAwardModalOpen(true);
  };

  const handleConfirmAward = () => {
    if (selectedAwardQuote) {
      onAward(rfq.id, selectedAwardQuote.id);
      setIsAwardModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Platform Rebate Banner */}
      <div className="p-4 bg-gradient-to-r from-brand-900 via-navy-900 to-slate-900 text-white rounded-2xl border border-brand-700 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-base shrink-0 shadow-sm">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-amber-300 text-sm">Direct Supplier Invoicing & PO Delivery</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-400/30">
                100% Verified Commercial Offers
              </span>
            </div>
            <p className="text-slate-300 mt-0.5">
              Award this order via SupplySouq to get <strong>10% Off delivery fees</strong>, <strong>DEWA / Batch Test Certificate Guarantee</strong>, and consolidated tax invoicing.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-3 py-1.5 rounded-xl font-bold whitespace-nowrap">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{quotations.length} Quotation{quotations.length > 1 ? 's' : ''} Collected</span>
        </span>
      </div>

      {/* Top Filter & Sort Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-subtle">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              Quotation Comparison Matrix
            </h3>
            <span className="text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{quotations.length} Live Supplier Bids</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Comparing verified UAE stockists under RFQ #{rfq.rfqNumber} ({rfq.title})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Sort Menu */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </span>
            <div className="inline-flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setSortBy('recommended')}
                className={`px-2 py-1 rounded font-medium transition-all ${
                  sortBy === 'recommended' ? 'bg-white shadow-sm font-bold text-brand-700' : 'text-slate-600'
                }`}
              >
                Best Match
              </button>
              <button
                onClick={() => setSortBy('price_asc')}
                className={`px-2 py-1 rounded font-medium transition-all ${
                  sortBy === 'price_asc' ? 'bg-white shadow-sm font-bold text-emerald-700' : 'text-slate-600'
                }`}
              >
                Lowest Price
              </button>
              <button
                onClick={() => setSortBy('delivery_asc')}
                className={`px-2 py-1 rounded font-medium transition-all ${
                  sortBy === 'delivery_asc' ? 'bg-white shadow-sm font-bold text-sky-700' : 'text-slate-600'
                }`}
              >
                Fastest Lead Time
              </button>
              <button
                onClick={() => setSortBy('rating_desc')}
                className={`px-2 py-1 rounded font-medium transition-all ${
                  sortBy === 'rating_desc' ? 'bg-white shadow-sm font-bold text-amber-700' : 'text-slate-600'
                }`}
              >
                Top Rated
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Cards Grid (5+ Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sortedQuotes.map((quote, index) => {
          const isBestPrice = quote.grandTotalAED === minPrice;
          const isFastest = quote.leadTimeDays === minLeadTime;
          const isTopRated = quote.supplierRating === maxRating;
          const isAwarded = quote.status === 'awarded' || rfq.awardedQuotationId === quote.id;
          const isExpanded = expandedQuoteId === quote.id;

          return (
            <div
              key={quote.id}
              className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-subtle ${
                isAwarded
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                  : isBestPrice
                  ? 'border-emerald-400 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-card'
              }`}
            >
              <div>
                {/* Supplier Header Banner */}
                <div className={`p-4 border-b ${
                  isAwarded
                    ? 'bg-emerald-50/80 border-emerald-200'
                    : 'bg-slate-50/60 border-slate-100'
                }`}>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {quote.quotationNumber}
                      </span>
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200">
                        Quote {index + 1} of {sortedQuotes.length}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {isAwarded && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5" /> AWARDED
                        </span>
                      )}
                      {isBestPrice && !isAwarded && <HighlightBadge type="best_price" />}
                      {isFastest && !isBestPrice && !isAwarded && <HighlightBadge type="fastest" />}
                      {isTopRated && !isFastest && !isBestPrice && !isAwarded && <HighlightBadge type="top_rated" />}
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-slate-900">
                    {quote.supplierCompanyName}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                    <span>•</span>
                    <span>{quote.supplierZone}, {quote.supplierEmirate}</span>
                    <span>•</span>
                    <span className="font-bold text-amber-600">★ {quote.supplierRating}</span>
                  </div>
                </div>

                {/* Main Offer Specs */}
                <div className="p-5 space-y-4">
                  {/* Price Display */}
                  <div className="p-3.5 bg-slate-900 text-white rounded-xl flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                        Total Incl. 5% UAE VAT
                      </span>
                      <span className="text-2xl font-extrabold tracking-tight text-white">
                        {formatAED(quote.grandTotalAED)}
                      </span>
                    </div>
                    <div className="text-right text-[11px] text-slate-300">
                      <p>Subtotal: {formatAED(quote.subtotalAED - quote.discountAED)}</p>
                      <p className="text-slate-400">VAT (5%): {formatAED(quote.vatAED)}</p>
                    </div>
                  </div>

                  {/* Attributes Matrix */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                      <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                        <Truck className="w-3.5 h-3.5 text-slate-400" /> Lead Time:
                      </span>
                      <strong className={`font-bold ${isFastest ? 'text-sky-700 font-extrabold' : 'text-slate-800'}`}>
                        {quote.leadTimeDisplay || quote.leadTimeDays + ' Days'}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                      <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                        <Award className="w-3.5 h-3.5 text-slate-400" /> Warranty:
                      </span>
                      <strong className="text-slate-800">{quote.warrantyPeriod}</strong>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                      <span className="text-slate-500 font-medium">Payment Terms:</span>
                      <strong className="text-slate-800">{quote.paymentTerms}</strong>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                      <span className="text-slate-500 font-medium">Validity:</span>
                      <span className="text-slate-700 font-semibold">{formatDate(quote.validityDate)}</span>
                    </div>
                  </div>

                  {/* Supplier Notes */}
                  {quote.notes && (
                    <div className="p-2.5 bg-brand-50/60 rounded-lg border border-brand-100/80 text-[11px] text-slate-700 leading-relaxed">
                      <strong className="text-brand-900 block mb-0.5">Supplier Remarks:</strong>
                      {quote.notes}
                    </div>
                  )}

                  {/* Itemized Breakdown Toggle */}
                  <div>
                    <button
                      onClick={() => setExpandedQuoteId(isExpanded ? null : quote.id)}
                      className="w-full flex items-center justify-between py-1.5 text-xs text-brand-700 font-semibold hover:text-brand-800"
                    >
                      <span>Itemized Pricing Breakdown ({quote.items?.length || rfq.items.length} items)</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-2 space-y-2 border-t border-slate-100 pt-2 animate-in fade-in duration-150">
                        {quote.items && quote.items.length > 0 ? (
                          quote.items.map((item, idx) => (
                            <div key={item.id || idx} className="text-[11px] p-2 bg-slate-50 rounded border border-slate-100 space-y-0.5">
                              <div className="flex justify-between font-semibold text-slate-800">
                                <span className="truncate max-w-[180px]">{item.itemDescription}</span>
                                <span>{formatAED(item.totalPriceAED)}</span>
                              </div>
                              <div className="flex justify-between text-slate-500 text-[10px]">
                                <span>Brand: <strong className="text-slate-700">{item.offeredBrand}</strong></span>
                                <span>{formatAED(item.unitPriceAED, true)} / {item.unit}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-[11px] text-slate-500 italic p-2 bg-slate-50 rounded">
                            Standard package pricing matching all DEWA approved cable and switchgear specifications.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer CTA */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-2">
                {isAwarded ? (
                  <div className="w-full text-center py-2.5 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-lg border border-emerald-200">
                    ✓ Awarded & Purchase Order Issued
                  </div>
                ) : (
                  <Button
                    variant={isBestPrice ? 'amber' : 'primary'}
                    className="w-full font-bold"
                    onClick={() => handleOpenAwardModal(quote)}
                    leftIcon={<CheckCircle2 className="w-4 h-4" />}
                  >
                    Select & Issue Purchase Order
                  </Button>
                )}
              </div>
            </div>
          );
        })}

      </div>

      {/* Award Confirmation Modal with 10% Platform Hook */}
      <Modal
        isOpen={isAwardModalOpen}
        onClose={() => setIsAwardModalOpen(false)}
        title="Confirm Supplier Selection & Issue Purchase Order"
        subtitle={'Awarding RFQ #' + rfq.rfqNumber}
        maxWidth="lg"
      >
        {selectedAwardQuote && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <Gift className="w-4 h-4 text-emerald-700" />
                <span>SupplySouq 10% Platform Protection Active</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                You are covered by SupplySouq's 100% Quality & DEWA Certified Replacement Guarantee with full FTA digital VAT compliance.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Selected Supplier:</span>
                <strong className="text-slate-900">{selectedAwardQuote.supplierCompanyName}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Quotation Reference:</span>
                <span className="font-mono font-bold text-brand-700">{selectedAwardQuote.quotationNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Total PO Value (Incl. 5% VAT):</span>
                <strong className="text-base font-extrabold text-slate-900">{formatAED(selectedAwardQuote.grandTotalAED)}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Delivery Lead Time:</span>
                <span className="font-semibold text-slate-800">{selectedAwardQuote.leadTimeDisplay}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Payment Terms:</span>
                <span className="font-semibold text-slate-800">{selectedAwardQuote.paymentTerms}</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p>
                Issuing this Purchase Order will generate an official UAE standard digital PO document, notify <strong>{selectedAwardQuote.supplierCompanyName}</strong>, and notify other quoting suppliers that the bid has concluded.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <Button variant="outline" onClick={() => setIsAwardModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmAward}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
                className="font-bold"
              >
                Generate & Issue Purchase Order
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};