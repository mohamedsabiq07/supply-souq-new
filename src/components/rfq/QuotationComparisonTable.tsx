import React, { useState } from 'react';
import { RFQ, Quotation } from '../../types';
import { useAppData } from '../../context/AppDataContext';
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
  AlertCircle,
  Sparkles,
  Percent,
  Gift,
  Lock,
  Unlock,
  CreditCard,
  Layers,
  Flame,
  Star,
  Table,
  LayoutGrid,
  TrendingDown,
  Check,
  ArrowRight
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
  const { isRFQExtendedUnlocked, unlockExtendedQuotes, rateQuotation } = useAppData();
  const [viewMode, setViewMode] = useState<'matrix' | 'cards'>('matrix');
  const [sortBy, setSortBy] = useState<'price_asc' | 'delivery_asc' | 'rating_desc' | 'recommended'>('recommended');
  const [highlightBest, setHighlightBest] = useState<boolean>(true);
  const [expandedQuoteId, setExpandedQuoteId] = useState<string | null>(null);
  const [selectedAwardQuote, setSelectedAwardQuote] = useState<Quotation | null>(null);
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);

  // Rating Modal State
  const [ratingModalQuote, setRatingModalQuote] = useState<Quotation | null>(null);
  const [selectedStars, setSelectedStars] = useState<number>(5);
  const [hoveredStars, setHoveredStars] = useState<number | null>(null);
  const [ratingFeedback, setRatingFeedback] = useState<string>('');

  const isUnlocked = isRFQExtendedUnlocked(rfq.id);

  const starLabels: Record<number, string> = {
    1: '★ 1/5 - Uncompetitive Price / Inadequate Terms',
    2: '★ 2/5 - Below Market Standard',
    3: '★ 3/5 - Fair Average Market Price',
    4: '★ 4/5 - Good Competitive Wholesale Quote',
    5: '★ 5/5 - Exceptional Wholesale Rate & Fast Lead Time',
  };

  const handleOpenRatingModal = (quote: Quotation) => {
    setRatingModalQuote(quote);
    setSelectedStars(quote.buyerRating || 5);
    setHoveredStars(null);
    setRatingFeedback(quote.buyerRatingFeedback || '');
  };

  const handleSaveRating = () => {
    if (!ratingModalQuote) return;
    rateQuotation(rfq.id, ratingModalQuote.id, selectedStars, ratingFeedback);
    setRatingModalQuote(null);
  };

  if (quotations.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-gradient-to-b dark:from-[#111114] dark:to-[#0c0c0e] rounded-2xl sm:rounded-3xl border border-dashed border-slate-200 dark:border-white/[0.08] p-8">
        <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center mb-3">
          <Zap className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">Waiting for Quotations</h4>
        <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md mx-auto mt-1">
          Your RFQ #{rfq.rfqNumber} has been distributed to verified suppliers in {rfq.deliveryEmirate}. As quotations arrive, they will appear here side-by-side in this matrix.
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

  // Decision Intelligence Calculations
  const minPrice = visibleQuotes.length > 0 ? Math.min(...visibleQuotes.map(q => q.grandTotalAED)) : 0;
  const maxPrice = visibleQuotes.length > 0 ? Math.max(...visibleQuotes.map(q => q.grandTotalAED)) : 0;
  const minLeadTime = visibleQuotes.length > 0 ? Math.min(...visibleQuotes.map(q => q.leadTimeDays)) : 0;
  const maxRating = visibleQuotes.length > 0 ? Math.max(...visibleQuotes.map(q => q.supplierRating)) : 5;

  const lowestPriceQuote = visibleQuotes.find(q => q.grandTotalAED === minPrice);
  const highestPriceQuote = visibleQuotes.find(q => q.grandTotalAED === maxPrice);
  const fastestQuote = visibleQuotes.find(q => q.leadTimeDays === minLeadTime);
  const topRatedQuote = visibleQuotes.find(q => q.supplierRating === maxRating);

  const priceSavingsAED = (highestPriceQuote && lowestPriceQuote) ? (highestPriceQuote.grandTotalAED - lowestPriceQuote.grandTotalAED) : 0;
  const priceSavingsPct = (highestPriceQuote && highestPriceQuote.grandTotalAED > 0) ? Math.round((priceSavingsAED / highestPriceQuote.grandTotalAED) * 100) : 0;

  // Best Overall Value: composite heuristic (normalized price + normalized lead time + rating)
  const bestOverallQuote = visibleQuotes.reduce((prev, current) => {
    const priceScorePrev = maxPrice > minPrice ? 1 - (prev.grandTotalAED - minPrice) / (maxPrice - minPrice) : 1;
    const priceScoreCurrent = maxPrice > minPrice ? 1 - (current.grandTotalAED - minPrice) / (maxPrice - minPrice) : 1;
    const speedScorePrev = prev.leadTimeDays <= minLeadTime ? 1 : 0.7;
    const speedScoreCurrent = current.leadTimeDays <= minLeadTime ? 1 : 0.7;
    const totalScorePrev = priceScorePrev * 0.5 + speedScorePrev * 0.3 + (prev.supplierRating / 5) * 0.2;
    const totalScoreCurrent = priceScoreCurrent * 0.5 + speedScoreCurrent * 0.3 + (current.supplierRating / 5) * 0.2;
    return totalScoreCurrent > totalScorePrev ? current : prev;
  }, visibleQuotes[0]);

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
      {/* 1. DECISION INTELLIGENCE BANNER: Quick Strategic Comparison */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Decision Intelligence — Key Procurement Findings
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-zinc-400">
            Analyzed {visibleQuotes.length} supplier offers
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Best Overall Value */}
          {bestOverallQuote && (
            <div className="p-4 rounded-2xl bg-gradient-to-b from-brand-500/10 to-transparent border border-brand-500/25 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-brand-700 dark:text-brand-300 bg-brand-500/15 px-2 py-0.5 rounded-full">
                    Best Overall Value
                  </span>
                  <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400">
                    ★ {bestOverallQuote.supplierRating?.toFixed(1) || '4.9'}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {bestOverallQuote.supplierCompanyName}
                </h4>
                <div className="text-lg font-extrabold font-mono text-slate-900 dark:text-white mt-1">
                  {formatAED(bestOverallQuote.grandTotalAED)}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                  {bestOverallQuote.leadTimeDisplay || `${bestOverallQuote.leadTimeDays} Days`} • Optimal price/speed balance
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => handleOpenAwardModal(bestOverallQuote)}
                className="w-full text-xs font-bold rounded-xl"
              >
                Select Best Value
              </Button>
            </div>
          )}

          {/* Lowest Price Bid */}
          {lowestPriceQuote && (
            <div className="p-4 rounded-2xl bg-gradient-to-b from-emerald-500/10 to-transparent border border-emerald-500/25 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-emerald-800 dark:text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-full">
                    Lowest Price
                  </span>
                  {priceSavingsPct > 0 && (
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5">
                      <TrendingDown className="w-3 h-3" /> Save {priceSavingsPct}%
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {lowestPriceQuote.supplierCompanyName}
                </h4>
                <div className="text-lg font-extrabold font-mono text-emerald-700 dark:text-emerald-400 mt-1">
                  {formatAED(lowestPriceQuote.grandTotalAED)}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                  {priceSavingsAED > 0 ? `Saves ${formatAED(priceSavingsAED)} vs highest bid` : 'Cheapest wholesale offer'}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenAwardModal(lowestPriceQuote)}
                className="w-full text-xs font-bold rounded-xl border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10"
              >
                Select Lowest Price
              </Button>
            </div>
          )}

          {/* Fastest Site Delivery */}
          {fastestQuote && (
            <div className="p-4 rounded-2xl bg-gradient-to-b from-sky-500/10 to-transparent border border-sky-500/25 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-sky-800 dark:text-sky-300 bg-sky-500/15 px-2 py-0.5 rounded-full">
                    Fastest Lead Time
                  </span>
                  <span className="text-[11px] font-semibold text-sky-700 dark:text-sky-400">
                    Express Fulfillment
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {fastestQuote.supplierCompanyName}
                </h4>
                <div className="text-lg font-extrabold font-mono text-sky-700 dark:text-sky-400 mt-1">
                  {fastestQuote.leadTimeDisplay || `${fastestQuote.leadTimeDays} Days`}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                  {formatAED(fastestQuote.grandTotalAED)} • Quickest dispatch to site
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenAwardModal(fastestQuote)}
                className="w-full text-xs font-bold rounded-xl border-sky-500/30 text-sky-700 dark:text-sky-300 hover:bg-sky-500/10"
              >
                Select Fastest
              </Button>
            </div>
          )}

          {/* Highest Rated Supplier */}
          {topRatedQuote && (
            <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/25 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-amber-900 dark:text-amber-200 bg-amber-500/15 px-2 py-0.5 rounded-full">
                    Top Rated Stockist
                  </span>
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300">
                    ★ {topRatedQuote.supplierRating?.toFixed(1) || '4.9'}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {topRatedQuote.supplierCompanyName}
                </h4>
                <div className="text-lg font-extrabold font-mono text-slate-900 dark:text-white mt-1">
                  {formatAED(topRatedQuote.grandTotalAED)}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                  {topRatedQuote.supplierZone || 'Verified Stockist'} • High compliance track record
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenAwardModal(topRatedQuote)}
                className="w-full text-xs font-bold rounded-xl border-amber-500/30 text-amber-800 dark:text-amber-300 hover:bg-amber-500/10"
              >
                Select Top Rated
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 2. PLATFORM REBATE & FTA VAT PROTECTION BANNER */}
      <div className="p-4 bg-slate-900 dark:bg-white/[0.03] text-white rounded-2xl sm:rounded-3xl border border-slate-800 dark:border-white/[0.08] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-base shrink-0 border border-amber-400/30">
            <Percent className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-xs">Direct UAE Stockist Invoicing & PO Delivery Guarantee</span>
              <span className="bg-rose-500/20 text-rose-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-rose-500/30">
                FTA Digital VAT Compliant
              </span>
              {isUnlocked && (
                <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  Extended Pack Active (10 Quotes)
                </span>
              )}
            </div>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Award this PO via SupplySouq to secure <strong>10% Off delivery logistics</strong> and manufacturer test certificate verification.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 bg-white/10 dark:bg-white/[0.06] text-slate-200 border border-white/15 px-3 py-1.5 rounded-full font-semibold text-xs whitespace-nowrap self-start sm:self-auto">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            {isUnlocked ? `${quotations.length} Quotations Unlocked` : `${Math.min(quotations.length, 5)} of 5 Free Quotations`}
          </span>
        </span>
      </div>

      {/* 3. TOOLBAR: View Switcher, Sort & Highlight Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-gradient-to-b dark:from-[#111114] dark:to-[#0c0c0e] p-4 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-xs">
        <div className="flex items-center gap-3">
          {/* Dual-Mode View Switcher */}
          <div className="inline-flex bg-slate-100/80 dark:bg-white/[0.04] p-1 rounded-full border border-slate-200/80 dark:border-white/[0.08] text-xs">
            <button
              onClick={() => setViewMode('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold transition-all ${
                viewMode === 'matrix'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Side-by-Side Matrix</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold transition-all ${
                viewMode === 'cards'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Showcase Cards</span>
            </button>
          </div>

          {/* Highlight Best In Row Toggle */}
          <label className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={highlightBest}
              onChange={(e) => setHighlightBest(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 dark:bg-zinc-800"
            />
            <span>Highlight Best Rates</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
          </span>
          <div className="inline-flex bg-slate-100/80 dark:bg-white/[0.04] p-1 rounded-full border border-slate-200/80 dark:border-white/[0.08] text-xs overflow-x-auto">
            <button
              onClick={() => setSortBy('recommended')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                sortBy === 'recommended'
                  ? 'bg-white dark:bg-white/[0.1] text-brand-700 dark:text-brand-300 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400'
              }`}
            >
              Best Match
            </button>
            <button
              onClick={() => setSortBy('price_asc')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                sortBy === 'price_asc'
                  ? 'bg-white dark:bg-white/[0.1] text-emerald-700 dark:text-emerald-300 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400'
              }`}
            >
              Lowest Price
            </button>
            <button
              onClick={() => setSortBy('delivery_asc')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                sortBy === 'delivery_asc'
                  ? 'bg-white dark:bg-white/[0.1] text-sky-700 dark:text-sky-300 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400'
              }`}
            >
              Fastest Delivery
            </button>
            <button
              onClick={() => setSortBy('rating_desc')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                sortBy === 'rating_desc'
                  ? 'bg-white dark:bg-white/[0.1] text-amber-800 dark:text-amber-300 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400'
              }`}
            >
              Top Rated
            </button>
          </div>
        </div>
      </div>

      {/* 4. VIEW MODE 1: COMPREHENSIVE SIDE-BY-SIDE MATRIX TABLE */}
      {viewMode === 'matrix' ? (
        <div className="bg-white dark:bg-gradient-to-b dark:from-[#111114] dark:to-[#0c0c0e] rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/[0.08] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[760px]">
              {/* Header Row: Quoting Suppliers */}
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-white/[0.06] bg-slate-50/70 dark:bg-white/[0.02]">
                  <th className="p-4 sm:p-5 w-48 sm:w-56 sticky left-0 bg-slate-50 dark:bg-[#111114] z-20 border-r border-slate-200/80 dark:border-white/[0.06] font-bold text-slate-900 dark:text-white">
                    Comparison Dimension
                  </th>
                  {visibleQuotes.map((quote, idx) => {
                    const isBestPrice = quote.grandTotalAED === minPrice;
                    const isFastest = quote.leadTimeDays === minLeadTime;
                    const isAwarded = quote.status === 'awarded' || rfq.awardedQuotationId === quote.id;

                    return (
                      <th
                        key={quote.id}
                        className={`p-4 sm:p-5 min-w-[220px] align-top transition-colors ${
                          isAwarded
                            ? 'bg-emerald-500/10'
                            : isBestPrice && highlightBest
                            ? 'bg-emerald-500/5'
                            : ''
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-mono text-[11px] font-bold text-brand-700 dark:text-brand-300 bg-brand-500/10 px-2 py-0.5 rounded-full">
                              {quote.quotationNumber}
                            </span>
                            <span className="text-[10px] font-medium text-slate-400">
                              Bid {idx + 1}
                            </span>
                          </div>

                          <div className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                            {quote.supplierCompanyName}
                          </div>

                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-400">
                            <span className="font-medium text-amber-700 dark:text-amber-400">
                              ★ {quote.supplierRating?.toFixed(1) || '4.9'}
                            </span>
                            <span>•</span>
                            <span className="truncate">{quote.supplierZone || quote.supplierEmirate}</span>
                          </div>

                          <div className="pt-1">
                            {isAwarded ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-500/15 px-2.5 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Awarded
                              </span>
                            ) : isBestPrice ? (
                              <HighlightBadge type="best_price" />
                            ) : isFastest ? (
                              <HighlightBadge type="fastest" />
                            ) : null}
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
                {/* Row 1: Commercial Total Price */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                  <td className="p-4 sm:p-5 sticky left-0 bg-white dark:bg-[#111114] z-10 border-r border-slate-200/80 dark:border-white/[0.06] font-bold text-slate-900 dark:text-white">
                    Quoted Total (5% VAT Incl.)
                  </td>
                  {visibleQuotes.map((quote) => {
                    const isBestPrice = quote.grandTotalAED === minPrice;
                    return (
                      <td
                        key={quote.id}
                        className={`p-4 sm:p-5 ${
                          isBestPrice && highlightBest ? 'bg-emerald-500/5' : ''
                        }`}
                      >
                        <div className="font-extrabold font-mono text-base sm:text-lg text-slate-900 dark:text-white">
                          {formatAED(quote.grandTotalAED)}
                        </div>
                        {isBestPrice && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                            <Check className="w-3 h-3" /> Lowest Total Price
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Row 2: Delivery Lead Time */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                  <td className="p-4 sm:p-5 sticky left-0 bg-white dark:bg-[#111114] z-10 border-r border-slate-200/80 dark:border-white/[0.06] font-semibold text-slate-700 dark:text-zinc-300">
                    Lead Time to Site
                  </td>
                  {visibleQuotes.map((quote) => {
                    const isFastest = quote.leadTimeDays === minLeadTime;
                    return (
                      <td
                        key={quote.id}
                        className={`p-4 sm:p-5 ${
                          isFastest && highlightBest ? 'bg-sky-500/5' : ''
                        }`}
                      >
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{quote.leadTimeDisplay || `${quote.leadTimeDays} Days`}</span>
                        </div>
                        {isFastest && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-sky-700 dark:text-sky-400 mt-0.5">
                            <Zap className="w-3 h-3 text-sky-500" /> Fastest Fulfillment
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Row 3: Payment Terms */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                  <td className="p-4 sm:p-5 sticky left-0 bg-white dark:bg-[#111114] z-10 border-r border-slate-200/80 dark:border-white/[0.06] font-semibold text-slate-700 dark:text-zinc-300">
                    Payment Terms
                  </td>
                  {visibleQuotes.map((quote) => (
                    <td key={quote.id} className="p-4 sm:p-5 font-medium text-slate-800 dark:text-zinc-200">
                      {quote.paymentTerms || '30 Days PDC'}
                    </td>
                  ))}
                </tr>

                {/* Row 4: Delivery Logistics Fleet */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                  <td className="p-4 sm:p-5 sticky left-0 bg-white dark:bg-[#111114] z-10 border-r border-slate-200/80 dark:border-white/[0.06] font-semibold text-slate-700 dark:text-zinc-300">
                    Logistics & Fleet
                  </td>
                  {visibleQuotes.map((quote) => (
                    <td key={quote.id} className="p-4 sm:p-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                        quote.deliveryMethod === 'supplysouq_managed'
                          ? 'bg-brand-500/10 text-brand-700 dark:text-brand-300'
                          : 'bg-slate-100 dark:bg-white/[0.05] text-slate-700 dark:text-zinc-300'
                      }`}>
                        <Truck className="w-3 h-3" />
                        <span>{quote.deliveryMethod === 'supplysouq_managed' ? 'SupplySouq Logistics' : 'Stockist Fleet'}</span>
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Row 5: Warranty & Compliance */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                  <td className="p-4 sm:p-5 sticky left-0 bg-white dark:bg-[#111114] z-10 border-r border-slate-200/80 dark:border-white/[0.06] font-semibold text-slate-700 dark:text-zinc-300">
                    Warranty & Compliance
                  </td>
                  {visibleQuotes.map((quote) => (
                    <td key={quote.id} className="p-4 sm:p-5">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {quote.warrantyPeriod || '1 Year Standard'}
                      </div>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium block mt-0.5">
                        ✓ Mill Test Certificate
                      </span>
                    </td>
                  ))}
                </tr>

                {/* SECTION DIVIDER: Line-by-Line Material Rates (BOQ) */}
                <tr className="bg-slate-100/60 dark:bg-white/[0.04]">
                  <td
                    colSpan={visibleQuotes.length + 1}
                    className="p-3 sm:px-5 font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider"
                  >
                    Itemized Material Rates (BOQ Unit Price Comparison)
                  </td>
                </tr>

                {/* For each line item in RFQ: Compare unit price across all suppliers */}
                {rfq.items.map((rfqItem, itemIdx) => {
                  // Find all suppliers' unit prices for this line item
                  const unitPricesForLine = visibleQuotes.map((quote) => {
                    const matchedItem = quote.items?.find((qi, qIdx) => qi.rfqItemId === rfqItem.id || qIdx === itemIdx);
                    return matchedItem?.unitPriceAED || 0;
                  }).filter(p => p > 0);

                  const minLineUnitPrice = unitPricesForLine.length > 0 ? Math.min(...unitPricesForLine) : 0;

                  return (
                    <tr key={rfqItem.id || itemIdx} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                      <td className="p-4 sm:p-5 sticky left-0 bg-white dark:bg-[#111114] z-10 border-r border-slate-200/80 dark:border-white/[0.06]">
                        <div className="font-bold text-slate-900 dark:text-white text-xs">
                          {rfqItem.description}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                          Qty: <strong>{rfqItem.quantity} {rfqItem.unit}</strong>
                          {rfqItem.preferredBrand && ` • Brand: ${rfqItem.preferredBrand}`}
                        </div>
                      </td>

                      {visibleQuotes.map((quote) => {
                        const matchedItem = quote.items?.find((qi, qIdx) => qi.rfqItemId === rfqItem.id || qIdx === itemIdx);
                        const unitPrice = matchedItem?.unitPriceAED || 0;
                        const isCheapestUnit = unitPrice > 0 && unitPrice === minLineUnitPrice;

                        return (
                          <td
                            key={quote.id}
                            className={`p-4 sm:p-5 ${
                              isCheapestUnit && highlightBest ? 'bg-emerald-500/5' : ''
                            }`}
                          >
                            {matchedItem ? (
                              <div className="space-y-0.5">
                                <div className="font-extrabold font-mono text-sm text-slate-900 dark:text-white">
                                  {formatAED(matchedItem.unitPriceAED)}
                                  <span className="text-[10px] text-slate-400 font-normal"> / {matchedItem.unit}</span>
                                </div>
                                <div className="text-[10px] text-slate-500 dark:text-zinc-400">
                                  Brand: <strong className="text-slate-700 dark:text-zinc-300">{matchedItem.offeredBrand}</strong>
                                </div>
                                {isCheapestUnit && (
                                  <span className="inline-block text-[9px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 px-1.5 py-0.2 rounded-full">
                                    Best Unit Rate
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-400 text-xs italic">Not quoted</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}

                {/* Action Row: Direct Award & PO Issuance */}
                <tr className="bg-slate-50/70 dark:bg-white/[0.02]">
                  <td className="p-4 sm:p-5 sticky left-0 bg-slate-50 dark:bg-[#111114] z-10 border-r border-slate-200/80 dark:border-white/[0.06] font-bold text-slate-900 dark:text-white">
                    Award & PO Issuance
                  </td>
                  {visibleQuotes.map((quote) => {
                    const isBestPrice = quote.grandTotalAED === minPrice;
                    const isAwarded = quote.status === 'awarded' || rfq.awardedQuotationId === quote.id;

                    return (
                      <td key={quote.id} className="p-4 sm:p-5 space-y-2">
                        {isAwarded ? (
                          <div className="w-full text-center py-2 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-bold text-xs rounded-xl border border-emerald-500/25">
                            ✓ PO Issued
                          </div>
                        ) : (
                          <Button
                            variant={isBestPrice ? 'amber' : 'primary'}
                            size="sm"
                            className="w-full font-bold rounded-xl text-xs"
                            onClick={() => handleOpenAwardModal(quote)}
                            leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                          >
                            Select & Issue PO
                          </Button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleOpenRatingModal(quote)}
                          className="w-full text-center text-[11px] font-semibold text-slate-500 dark:text-zinc-400 hover:text-amber-500 transition-colors py-1 cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Star className="w-3 h-3 text-amber-500" />
                          <span>{quote.buyerRating ? `Rating: ${quote.buyerRating}★` : 'Rate Quote'}</span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* 5. VIEW MODE 2: SHOWCASE CARDS (DE-BOXED & REFINED) */
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
                className={`bg-white dark:bg-gradient-to-b dark:from-[#111114] dark:to-[#0c0c0e] rounded-2xl sm:rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs ${
                  isAwarded
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                    : isBestPrice
                    ? 'border-emerald-500/50 shadow-md'
                    : 'border-slate-200/80 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.14]'
                }`}
              >
                <div>
                  {/* Supplier Header Banner */}
                  <div className="p-5 border-b border-slate-100 dark:border-white/[0.06] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-mono font-bold text-brand-700 dark:text-brand-300 bg-brand-500/10 px-2.5 py-0.5 rounded-full">
                          {quote.quotationNumber}
                        </span>
                        <span className="text-[11px] font-medium text-slate-400">
                          Bid {index + 1} of {visibleQuotes.length}
                        </span>
                      </div>

                      <div>
                        {isAwarded && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-500/15 px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Awarded
                          </span>
                        )}
                        {isBestPrice && !isAwarded && <HighlightBadge type="best_price" />}
                        {isFastest && !isBestPrice && !isAwarded && <HighlightBadge type="fastest" />}
                        {isTopRated && !isFastest && !isBestPrice && !isAwarded && <HighlightBadge type="top_rated" />}
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {quote.supplierCompanyName}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{quote.supplierZone || quote.supplierEmirate || 'Verified Stockist'}</span>
                      <span className="text-slate-300 dark:text-zinc-600">•</span>
                      <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-0.5">
                        ★ {quote.supplierRating?.toFixed(1) || '4.9'}
                      </span>
                    </p>
                  </div>

                  {/* De-boxed Commercial Details */}
                  <div className="p-5 space-y-4">
                    {/* Hero Price */}
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold uppercase tracking-wider block">
                        Total Amount (5% VAT Incl.)
                      </span>
                      <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white mt-0.5">
                        {formatAED(quote.grandTotalAED)}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-zinc-400 block mt-0.5">
                        Includes VAT {formatAED(quote.vatAED || 0)}
                      </span>
                    </div>

                    {/* Operational Metrics */}
                    <div className="grid grid-cols-2 gap-3 text-xs py-2 border-y border-slate-100 dark:border-white/[0.06]">
                      <div>
                        <span className="text-slate-400 dark:text-zinc-500 text-[10px] block font-medium flex items-center gap-1">
                          <Truck className="w-3 h-3 text-slate-400" /> Lead Time
                        </span>
                        <strong className="text-slate-900 dark:text-white font-bold block mt-0.5">
                          {quote.leadTimeDisplay || `${quote.leadTimeDays} Days`}
                        </strong>
                      </div>

                      <div>
                        <span className="text-slate-400 dark:text-zinc-500 text-[10px] block font-medium flex items-center gap-1">
                          <CreditCard className="w-3 h-3 text-slate-400" /> Payment Terms
                        </span>
                        <strong className="text-slate-900 dark:text-white font-bold block mt-0.5 truncate">
                          {quote.paymentTerms || '30 Days PDC'}
                        </strong>
                      </div>
                    </div>

                    {/* Logistics Fleet Pill */}
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-zinc-400">
                      <span className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-slate-400" />
                        <span>{quote.deliveryMethod === 'supplysouq_managed' ? 'SupplySouq Logistics' : 'Stockist Fleet'}</span>
                      </span>
                      <span className="font-mono font-bold text-slate-800 dark:text-zinc-200">
                        {quote.deliveryChargeAED && quote.deliveryChargeAED > 0 ? formatAED(quote.deliveryChargeAED) : 'FREE'}
                      </span>
                    </div>

                    {/* Expandable Item Breakdown */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setExpandedQuoteId(isExpanded ? null : quote.id)}
                        className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:text-brand-600 py-2 border-t border-slate-100 dark:border-white/[0.06] transition-colors cursor-pointer"
                      >
                        <span>BOQ Item Breakdown ({quote.items?.length || 0} items)</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {isExpanded && (
                        <div className="space-y-1.5 pt-2 text-xs">
                          {quote.items?.map((item, i) => (
                            <div
                              key={item.id || i}
                              className="py-1.5 px-2 bg-slate-50/60 dark:bg-white/[0.02] rounded-xl flex items-center justify-between text-[11px]"
                            >
                              <div className="truncate pr-2">
                                <span className="font-semibold text-slate-800 dark:text-zinc-200 block truncate">{item.itemDescription}</span>
                                <span className="text-slate-400 dark:text-zinc-500 text-[10px]">
                                  {item.quantity} {item.unit} @ {formatAED(item.unitPriceAED)}/ea • Brand: {item.offeredBrand}
                                </span>
                              </div>
                              <span className="font-mono font-bold text-slate-900 dark:text-white shrink-0">
                                {formatAED(item.totalPriceAED)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-5 border-t border-slate-100 dark:border-white/[0.06] space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 dark:text-zinc-500 text-[11px]">Supplier Rank:</span>
                    <button
                      type="button"
                      onClick={() => handleOpenRatingModal(quote)}
                      className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Star className="w-3 h-3 text-amber-500 fill-current" />
                      <span>{quote.buyerRating ? `Rated ${quote.buyerRating}★` : 'Rate Quote'}</span>
                    </button>
                  </div>

                  {isAwarded ? (
                    <div className="w-full text-center py-2.5 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-bold text-xs rounded-xl border border-emerald-500/25">
                      ✓ Awarded & Purchase Order Issued
                    </div>
                  ) : (
                    <Button
                      variant={isBestPrice ? 'amber' : 'primary'}
                      className="w-full font-bold rounded-xl"
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
      )}

      {/* 6. EXTENDED QUOTE PACK (If 5 quotes reached and buyer hasn't unlocked more) */}
      {!isUnlocked && quotations.length >= 5 && (
        <div className="bg-slate-900 dark:bg-white/[0.03] text-white rounded-2xl sm:rounded-3xl border border-slate-800 dark:border-white/[0.08] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-400/30">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Deep Liquidity Extended Pack</span>
            </div>
            <h4 className="text-lg font-bold text-white">
              Unlock 5 Additional Stockist Quotations (+5 Quotes)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Reveal verified bids from <strong>JAFZA factory importers</strong>, <strong>Dubai Industrial City stockists</strong>, and <strong>Northern Emirates yards</strong> with wholesale bulk quantity pricing.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-slate-400 block font-medium">One-Time Fee</span>
              <span className="text-lg font-extrabold text-amber-300 font-mono">AED 49.00</span>
            </div>
            <Button
              variant="amber"
              className="font-bold shadow-xs rounded-xl"
              onClick={() => setIsUnlockModalOpen(true)}
              leftIcon={<Unlock className="w-4 h-4" />}
            >
              Unlock 5 More Quotes
            </Button>
          </div>
        </div>
      )}

      {/* 7. UNLOCK 5 MORE QUOTES MODAL */}
      <Modal
        isOpen={isUnlockModalOpen}
        onClose={() => setIsUnlockModalOpen(false)}
        title="Unlock Extended Market Quotation Pack (+5 Bids)"
        subtitle={'Deep Liquidity Sourcing for RFQ #' + rfq.rfqNumber}
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/25 space-y-1.5 text-amber-950 dark:text-amber-200">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-900 dark:text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>5 Additional Verified Stockist Bids Waiting</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
              Expanding this RFQ reveals 5 tier-2 factory importers and regional stockists across JAFZA, Dubai Industrial City, and Sharjah with special wholesale pricing.
            </p>
          </div>

          <div className="p-4 bg-slate-50/70 dark:bg-white/[0.03] rounded-2xl border border-slate-200/80 dark:border-white/[0.08] space-y-2">
            <h5 className="font-bold text-slate-900 dark:text-white">Included in this Extended Pack:</h5>
            <ul className="space-y-1.5 text-slate-600 dark:text-zinc-300 text-xs">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong className="text-slate-900 dark:text-white">5 Additional Commercial Quotations:</strong> Full itemized price breakdown.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong className="text-slate-900 dark:text-white">Flexible Credit Terms:</strong> Extended 30 to 45-day PDC payment options.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong className="text-slate-900 dark:text-white">Complete 10-Way Comparison Matrix:</strong> Compare all offers side-by-side.</span>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-slate-900 dark:bg-white/[0.04] text-white rounded-2xl flex items-center justify-between border border-transparent dark:border-white/[0.08]">
            <div>
              <span className="text-[10px] text-slate-400 dark:text-zinc-400 block font-medium">One-Time RFQ Unlock Fee</span>
              <span className="text-lg font-extrabold text-amber-300 font-mono">AED 49.00</span>
            </div>
            <span className="text-[10px] text-emerald-400 bg-slate-800 dark:bg-white/[0.08] px-2.5 py-1 rounded-full border border-slate-700 dark:border-white/[0.1] font-bold">
              Instant Activation
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
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
              className="font-bold rounded-xl"
            >
              Confirm & Unlock 5 More Quotes
            </Button>
          </div>
        </div>
      </Modal>

      {/* 8. AWARD CONFIRMATION MODAL */}
      <Modal
        isOpen={isAwardModalOpen}
        onClose={() => setIsAwardModalOpen(false)}
        title="Confirm Supplier Selection & Issue Purchase Order"
        subtitle={'Awarding RFQ #' + rfq.rfqNumber}
        maxWidth="lg"
      >
        {selectedAwardQuote && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/25 space-y-1">
              <div className="flex items-center gap-2 text-rose-950 dark:text-rose-100 font-bold text-sm">
                <Gift className="w-4 h-4 text-[#cf2e46]" />
                <span>SupplySouq 10% Platform Protection Active</span>
              </div>
              <p className="text-[11px] text-rose-800 dark:text-rose-300">
                You are covered by SupplySouq's 100% Quality & DEWA Certified Replacement Guarantee with full FTA digital VAT compliance.
              </p>
            </div>

            <div className="p-4 bg-slate-50/70 dark:bg-white/[0.03] rounded-2xl border border-slate-200/80 dark:border-white/[0.08] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-zinc-400 font-medium">Selected Supplier:</span>
                <strong className="text-slate-900 dark:text-white font-bold">{selectedAwardQuote.supplierCompanyName}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-zinc-400 font-medium">Quotation Reference:</span>
                <span className="font-mono font-bold text-brand-700 dark:text-brand-400">{selectedAwardQuote.quotationNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-zinc-400 font-medium">Total PO Value (Incl. 5% VAT):</span>
                <strong className="text-base font-extrabold text-slate-900 dark:text-white font-mono">{formatAED(selectedAwardQuote.grandTotalAED)}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-zinc-400 font-medium">Delivery Lead Time:</span>
                <span className="font-semibold text-slate-800 dark:text-zinc-200">{selectedAwardQuote.leadTimeDisplay}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-zinc-400 font-medium">Payment Terms:</span>
                <span className="font-semibold text-slate-800 dark:text-zinc-200">{selectedAwardQuote.paymentTerms}</span>
              </div>
            </div>

            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/25 text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                Issuing this Purchase Order will generate an official UAE standard digital PO document, notify <strong className="text-slate-900 dark:text-white">{selectedAwardQuote.supplierCompanyName}</strong>, and notify other quoting suppliers that the bid has concluded.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
              <Button variant="outline" onClick={() => setIsAwardModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmAward}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
                className="font-bold rounded-xl"
              >
                Generate & Issue Purchase Order
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* 9. RATE QUOTATION MODAL */}
      <Modal
        isOpen={!!ratingModalQuote}
        onClose={() => setRatingModalQuote(null)}
        title="Rate Supplier Quotation & Pricing"
        subtitle={`RFQ #${rfq.rfqNumber} • ${ratingModalQuote?.supplierCompanyName}`}
        maxWidth="md"
      >
        {ratingModalQuote && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.08] rounded-2xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white text-sm">{ratingModalQuote.supplierCompanyName}</span>
                <span className="font-mono font-bold text-slate-800 dark:text-zinc-200 text-sm">
                  {formatAED(ratingModalQuote.grandTotalAED)}
                </span>
              </div>
              <p className="text-slate-500 dark:text-zinc-400 text-[11px]">
                Quote #{ratingModalQuote.quotationNumber} • Lead Time: {ratingModalQuote.leadTimeDisplay || `${ratingModalQuote.leadTimeDays} Days`} • Terms: {ratingModalQuote.paymentTerms || '30 Days PDC'}
              </p>
            </div>

            {/* Star Rating Interactive Selector */}
            <div className="p-4 bg-gradient-to-b from-amber-500/10 to-transparent rounded-2xl border border-amber-500/25 text-center space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">
                How would you rate this supplier's rates & commercial quote?
              </span>
              <div className="flex items-center justify-center gap-2 py-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= (hoveredStars !== null ? hoveredStars : selectedStars);
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredStars(star)}
                      onMouseLeave={() => setHoveredStars(null)}
                      onClick={() => setSelectedStars(star)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          isFilled
                            ? 'fill-amber-400 text-amber-500 drop-shadow-sm'
                            : 'text-slate-200 dark:text-zinc-700 hover:text-amber-200'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="text-xs font-bold text-amber-900 dark:text-amber-300">
                {starLabels[hoveredStars !== null ? hoveredStars : selectedStars]}
              </div>
            </div>

            {/* Quick Feedback Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-600 dark:text-zinc-400 block">Quick Feedback Tags:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  '🔥 Highly Competitive Price',
                  '⚡ Fast Lead Time',
                  '📄 Clear Mill Specifications',
                  '🤝 Favorable Payment Terms',
                  '📦 Genuine Factory Stock',
                  '⚠️ High Rate vs Market',
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      if (!ratingFeedback.includes(tag)) {
                        setRatingFeedback(prev => prev ? `${prev}, ${tag}` : tag);
                      }
                    }}
                    className="px-2.5 py-1 bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] text-slate-700 dark:text-zinc-200 rounded-full text-[11px] font-medium transition-colors cursor-pointer border border-slate-200/80 dark:border-white/[0.08]"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Comment */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-zinc-300 block mb-1">
                Feedback / Notes for Supplier (Optional):
              </label>
              <textarea
                rows={2}
                value={ratingFeedback}
                onChange={(e) => setRatingFeedback(e.target.value)}
                placeholder="e.g. Excellent rates on Ducab cable drum. Fast turnaround."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#111114] text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
              <Button variant="outline" onClick={() => setRatingModalQuote(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveRating}
                leftIcon={<Star className="w-4 h-4 fill-amber-300 text-amber-300" />}
                className="font-bold rounded-xl"
              >
                Save Rating & Update Score
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};