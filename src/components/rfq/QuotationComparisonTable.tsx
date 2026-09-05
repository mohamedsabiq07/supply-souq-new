import React, { useState } from 'react';
import { RFQ, Quotation } from '../../types';
import { useAppData } from '../../context/AppDataContext';
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
  const { isRFQExtendedUnlocked, unlockExtendedQuotes } = useAppData();
  const [sortBy, setSortBy] = useState<'price_asc' | 'delivery_asc' | 'rating_desc' | 'recommended'>('recommended');
  const [expandedQuoteId, setExpandedQuoteId] = useState<string | null>(null);
  const [selectedAwardQuote, setSelectedAwardQuote] = useState<Quotation | null>(null);
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);

  const isUnlocked = isRFQExtendedUnlocked(rfq.id);

  if (quotations.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center mb-3">
          <Zap className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-slate-900">Waiting for Quotations</h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
          Your RFQ #{rfq.rfqNumber} has been distributed to 5 verified suppliers in {rfq.deliveryEmirate}. As quotations arrive, they will appear here side-by-side.
        </p>
      </div>
    );
  }


  // Sort logic across pool
  const sortedQuotes = [...quotations].sort((a, b) => {
    if (sortBy === 'price_asc') return a.grandTotalAED - b.grandTotalAED;
    if (sortBy === 'delivery_asc') return a.leadTimeDays - b.leadTimeDays;
    if (sortBy === 'rating_desc') return b.supplierRating - a.supplierRating;
    return a.grandTotalAED - b.grandTotalAED;
  });

  // Free limit is strictly 5 quotations; paying AED 49 unlocks 5 more (up to 10)
  const visibleQuotes = isUnlocked ? sortedQuotes : sortedQuotes.slice(0, 5);

  // Find Best values for badges across visible pool
  const minPrice = visibleQuotes.length > 0 ? Math.min(...visibleQuotes.map(q => q.grandTotalAED)) : 0;
  const minLeadTime = visibleQuotes.length > 0 ? Math.min(...visibleQuotes.map(q => q.leadTimeDays)) : 0;
  const maxRating = visibleQuotes.length > 0 ? Math.max(...visibleQuotes.map(q => q.supplierRating)) : 5;

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
              {isUnlocked && (
                <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded">
                  Extended Pack Active (10 Quotes)
                </span>
              )}
            </div>
            <p className="text-slate-300 mt-0.5">
              Award this order via SupplySouq to get <strong>10% Off delivery fees</strong>, <strong>DEWA / Batch Test Certificate Guarantee</strong>, and consolidated tax invoicing.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-3 py-1.5 rounded-xl font-bold whitespace-nowrap">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>
            {isUnlocked ? `${quotations.length} Quotations Unlocked` : `${Math.min(quotations.length, 5)} of 5 Free Quotations`}
          </span>
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
              <span>{visibleQuotes.length} Quotes Displayed {isUnlocked ? '(Unlocked Pack)' : '(Free Limit: 5)'}</span>
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
        {visibleQuotes.map((quote, index) => {
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
                        Quote {index + 1} of {visibleQuotes.length}
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
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{quote.supplierZone || quote.supplierEmirate || 'Verified Stockist'}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-amber-600 font-semibold flex items-center gap-0.5">
                      ★ {quote.supplierRating?.toFixed(1) || '4.9'}
                    </span>
                  </p>
                </div>

                {/* Price & Commercial Highlights */}
                <div className="p-4 space-y-3">
                  <div className="bg-slate-900 text-white p-3.5 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">
                        Total Amount (5% VAT Incl.)
                      </span>
                      <span className="text-xl font-extrabold tracking-tight font-mono">
                        {formatAED(quote.grandTotalAED)}
                      </span>
                    </div>
                    {/* Assuming quote object has vatAmountAED, otherwise 0 */}
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-1 rounded border border-slate-700">
                      VAT {formatAED(quote.vatAED || 0)}
                    </span>
                  </div>

                  {/* Operational Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="text-slate-400 text-[10px] block font-medium flex items-center gap-1">
                        <Truck className="w-3 h-3 text-slate-400" /> Lead Time
                      </span>
                      <strong className="text-slate-900 font-bold block mt-0.5">
                        {quote.leadTimeDisplay || `${quote.leadTimeDays} Days`}
                      </strong>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="text-slate-400 text-[10px] block font-medium flex items-center gap-1">
                        <CreditCard className="w-3 h-3 text-slate-400" /> Payment Terms
                      </span>
                      <strong className="text-slate-900 font-bold block mt-0.5 truncate">
                        {quote.paymentTerms || '30 Days PDC'}
                      </strong>
                    </div>
                  </div>

                  {/* Delivery & Fleet Badge */}
                  <div className={`p-2 rounded-lg text-xs border flex items-center justify-between gap-2 ${
                    quote.deliveryMethod === 'supplysouq_managed'
                      ? 'bg-brand-50/70 border-brand-200 text-brand-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <div className="flex items-center gap-1.5 truncate">
                      <Truck className={`w-3.5 h-3.5 shrink-0 ${quote.deliveryMethod === 'supplysouq_managed' ? 'text-brand-600' : 'text-slate-500'}`} />
                      <span className="font-semibold truncate">
                        {quote.deliveryMethod === 'supplysouq_managed' ? 'SupplySouq Logistics' : 'Supplier In-House Fleet'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold shrink-0">
                      {quote.deliveryDetails?.estimatedDistanceKm ? `${quote.deliveryDetails.estimatedDistanceKm} km • ` : ''}
                      {quote.deliveryChargeAED && quote.deliveryChargeAED > 0 ? formatAED(quote.deliveryChargeAED) : 'FREE'}
                    </span>
                  </div>

                  {/* Itemized Material Rates Summary */}
                  <div className="space-y-1 pt-1">
                    <button
                      type="button"
                      onClick={() => setExpandedQuoteId(isExpanded ? null : quote.id)}
                      className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-brand-600 py-1.5 px-2 bg-slate-50 rounded-lg border border-slate-100 transition-colors"
                    >
                      <span>Item Breakdown ({quote.items?.length || 0} items)</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="space-y-1.5 pt-1 text-xs">
                        {quote.items?.map((item, i) => (
                          <div
                            key={item.id || i}
                            className="bg-white p-2 rounded-lg border border-slate-100 flex items-center justify-between text-[11px]"
                          >
                            <div className="truncate pr-2">
                              <span className="font-semibold text-slate-800 block truncate">{item.itemDescription}</span>
                              <span className="text-slate-400 text-[10px]">
                                {item.quantity} {item.unit} @ {formatAED(item.unitPriceAED)}/ea
                              </span>
                            </div>
                            <span className="font-mono font-bold text-slate-900 shrink-0">
                              {formatAED(item.totalPriceAED)}
                            </span>
                          </div>
                        ))}
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

        {/* LOCKED 5 MORE QUOTES CARD IF NOT UNLOCKED */}
        {!isUnlocked && (
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-navy-950 text-white rounded-2xl border-2 border-dashed border-amber-400/60 p-6 flex flex-col justify-between shadow-lg">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold">
                <Lock className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-400/30">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>5 Additional Stockist Bids Available</span>
                </div>
                <h4 className="text-lg font-extrabold text-white">
                  Unlock Extended Market Pack (+5 Quotes)
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Unlock bids from <strong>JAFZA Factory Importers</strong>, <strong>Dubai Industrial City Stockists</strong>, and <strong>Northern Emirates Direct Yards</strong> with bulk volume discounts.
                </p>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Reveals 5 additional verified supplier quotations</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Includes 45-day extended corporate credit terms</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>Same-day express site dispatch options</span>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-2">
              <div className="flex items-center justify-between text-xs pb-1">
                <span className="text-slate-400">One-Time RFQ Unlock Fee:</span>
                <span className="text-base font-extrabold text-amber-300 font-mono">AED 49.00</span>
              </div>

              <Button
                variant="amber"
                className="w-full font-bold shadow-lg"
                onClick={() => setIsUnlockModalOpen(true)}
                leftIcon={<Unlock className="w-4 h-4" />}
              >
                Pay AED 49 & Unlock 5 More Quotes
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* UNLOCK 5 MORE QUOTES MODAL */}
      <Modal
        isOpen={isUnlockModalOpen}
        onClose={() => setIsUnlockModalOpen(false)}
        title="Unlock Extended Market Quotation Pack (+5 Bids)"
        subtitle={'Deep Liquidity Sourcing for RFQ #' + rfq.rfqNumber}
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2 text-amber-950">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>5 Additional Verified Stockist Bids Waiting</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800">
              Expanding this RFQ reveals 5 tier-2 factory importers and regional stockists across JAFZA, Dubai Industrial City, and Sharjah with special wholesale pricing.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
            <h5 className="font-bold text-slate-900">Included in this Extended Pack:</h5>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>5 Additional Commercial Quotations:</strong> Full itemized price breakdown.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Flexible Credit Terms:</strong> Extended 30 to 45-day PDC payment options.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Complete 10-Way Comparison Matrix:</strong> Compare all offers side-by-side.</span>
              </li>
            </ul>
          </div>

          <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">One-Time RFQ Unlock Fee</span>
              <span className="text-lg font-extrabold text-amber-300 font-mono">AED 49.00</span>
            </div>
            <span className="text-[10px] text-emerald-400 bg-slate-800 px-2.5 py-1 rounded border border-slate-700 font-bold">
              Instant Activation
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button variant="outline" onClick={() => setIsUnlockModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="amber"
              onClick={() => {
                unlockExtendedQuotes(rfq.id);
                setIsUnlockModalOpen(false);
              }}
              leftIcon={<CreditCard className="w-4 h-4" />}
              className="font-bold"
            >
              Confirm & Unlock 5 More Quotes
            </Button>
          </div>
        </div>
      </Modal>

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