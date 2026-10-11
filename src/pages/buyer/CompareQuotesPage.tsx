import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { QuotationComparisonTable } from '../../components/rfq/QuotationComparisonTable';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { formatAED, formatDate } from '../../lib/utils';
import { CustomerOffer } from '../../types';
import {
  ArrowLeft,
  GitCompare,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Truck,
  FileText,
  Upload,
  ArrowUpDown,
  Award,
  Check,
  X,
  Building2,
  Scale,
} from 'lucide-react';
import { CreateRFQButton } from '../../components/common/CreateRFQButton';

interface CompareQuotesPageProps {
  rfqId?: string;
  onNavigate: (view: string, params?: any) => void;
}

export const CompareQuotesPage: React.FC<CompareQuotesPageProps> = ({ rfqId, onNavigate }) => {
  const { currentCompany } = useAuth();
  const {
    rfqs,
    quotations,
    customerOffers,
    commercialSettings,
    getCustomerOffersForRFQ,
    selectOfferAndCreateCustomerPO,
    awardQuotation,
  } = useAppData();

  const myRFQs = rfqs
    .filter((r) => r.buyerCompanyId === currentCompany.id)
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt).getTime() -
        new Date(a.updatedAt || a.createdAt).getTime()
    );

  const [selectedRFQId, setSelectedRFQId] = useState<string>(() => {
    if (rfqId) return rfqId;
    const withOffers = myRFQs.find(
      (r) => customerOffers.some((o) => o.rfqId === r.id) || r.quotesCount > 0
    );
    return withOffers ? withOffers.id : myRFQs[0]?.id || '';
  });

  const [sortBy, setSortBy] = useState<
    'best_value' | 'lowest_price' | 'fastest_delivery' | 'best_technical'
  >('best_value');

  // Step 7 & 8: Selected Offer & PO Creation Modal State
  const [selectedOfferForOrder, setSelectedOfferForOrder] = useState<CustomerOffer | null>(null);
  const [orderingMethod, setOrderingMethod] = useState<'uploaded_po' | 'platform_generated_po'>(
    'uploaded_po'
  );
  const [customerPoRef, setCustomerPoRef] = useState('');
  const [uploadedPoFileName, setUploadedPoFileName] = useState(
    'Official_Signed_Company_PO_2026.pdf'
  );
  const [orderNotes, setOrderNotes] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const targetRFQ =
    myRFQs.find((r) => r.id === selectedRFQId || r.rfqNumber === selectedRFQId) ||
    rfqs.find((r) => r.id === selectedRFQId || r.rfqNumber === selectedRFQId) ||
    myRFQs[0];

  if (!targetRFQ) {
    return (
      <div className="text-center py-16 bg-white dark:bg-gradient-to-b dark:from-[#111114] dark:to-[#0c0c0e] rounded-3xl border border-slate-200/80 dark:border-white/[0.08] p-8 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
          <GitCompare className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <p className="text-base font-bold text-slate-900 dark:text-white">No RFQs Available</p>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            You haven't submitted any material RFQs yet. Submit an RFQ and ProcureSouq will source up to 5 verified quotations for you.
          </p>
        </div>
        <div className="flex justify-center">
          <CreateRFQButton size="md" onClick={() => onNavigate('create-rfq')}>
            Submit Your First RFQ
          </CreateRFQButton>
        </div>
      </div>
    );
  }

  const publishedOffers = getCustomerOffersForRFQ(targetRFQ.id);
  const rfqQuotes = quotations.filter(
    (q) => q.rfqId === targetRFQ.id || q.rfqNumber === targetRFQ.rfqNumber
  );

  // Sort Customer Offers by transparent rule-based criteria
  const sortedOffers = [...publishedOffers].sort((a, b) => {
    if (sortBy === 'lowest_price') {
      // Put full coverage offers ahead of partial offers when sorting by price
      if (a.isPartialOffer !== b.isPartialOffer) return a.isPartialOffer ? 1 : -1;
      return a.estimatedLandedTotalAED - b.estimatedLandedTotalAED;
    }
    if (sortBy === 'fastest_delivery') {
      return a.leadTimeDays - b.leadTimeDays;
    }
    if (sortBy === 'best_technical') {
      const score = (o: CustomerOffer) =>
        o.technicalCompliance === '100% Compliant to BOQ' && !o.isPartialOffer
          ? 3
          : o.technicalCompliance === 'Approved Equivalent'
          ? 2
          : 1;
      return score(b) - score(a);
    }
    // Best overall value: prioritize 'Best Overall Value' badge, then full coverage + lowest landed cost
    const aHasBest = a.ruleRecommendations.includes('Best Overall Value') ? 1 : 0;
    const bHasBest = b.ruleRecommendations.includes('Best Overall Value') ? 1 : 0;
    if (aHasBest !== bHasBest) return bHasBest - aHasBest;
    if (a.isPartialOffer !== b.isPartialOffer) return a.isPartialOffer ? 1 : -1;
    return a.estimatedLandedTotalAED - b.estimatedLandedTotalAED;
  });

  const handleConfirmCustomerPO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOfferForOrder || !termsAccepted) return;

    const newCPO = selectOfferAndCreateCustomerPO({
      rfqId: targetRFQ.id,
      customerOfferId: selectedOfferForOrder.id,
      orderingMethod,
      customerPoReference:
        orderingMethod === 'uploaded_po' ? customerPoRef || 'CUST-PO-2026' : undefined,
      uploadedPoFileName:
        orderingMethod === 'uploaded_po' ? uploadedPoFileName : undefined,
      uploadedPoUrl:
        orderingMethod === 'uploaded_po' ? `#${uploadedPoFileName}` : undefined,
      notes: orderNotes || undefined,
    });

    setSelectedOfferForOrder(null);
    onNavigate('buyer-orders', { poId: newCPO.id });
  };

  const handleLegacyAward = (rId: string, qId: string) => {
    const newPO = awardQuotation(rId, qId);
    onNavigate('buyer-orders', { poId: newPO.id });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('buyer-dashboard')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Dashboard
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              ProcureSouq Five-Quote Comparison Dashboard
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Compare up to 5 technical & commercial offers vetted by ProcureSouq Engineers. Single point of contact from PO to site delivery.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Managed by {commercialSettings.contractingEntityName}</span>
        </div>
      </div>

      {/* STEP 1: SELECT RFQ TO COMPARE */}
      <div className="bg-white dark:bg-gradient-to-b dark:from-[#111114] dark:to-[#0c0c0e] p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-400 text-xs font-extrabold flex items-center justify-center border border-brand-200 dark:border-brand-800">
              1
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Select RFQ to View Qualified ProcureSouq Offers
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
            {myRFQs.length} Active RFQ{myRFQs.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          {myRFQs.map((rfq) => {
            const isSelected = rfq.id === targetRFQ.id;
            const offersForRfq = getCustomerOffersForRFQ(rfq.id);
            const lowestOffer =
              offersForRfq.filter((o) => !o.isPartialOffer).length > 0
                ? Math.min(
                    ...offersForRfq
                      .filter((o) => !o.isPartialOffer)
                      .map((o) => o.estimatedLandedTotalAED)
                  )
                : offersForRfq.length > 0
                ? Math.min(...offersForRfq.map((o) => o.estimatedLandedTotalAED))
                : null;

            return (
              <button
                key={rfq.id}
                type="button"
                onClick={() => setSelectedRFQId(rfq.id)}
                className={`text-left p-4 sm:p-5 rounded-2xl border transition-all relative flex flex-col justify-between space-y-3 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-b from-brand-50/40 to-white dark:from-brand-950/20 dark:to-[#121215] border-brand-500/80 ring-2 ring-brand-500/20 shadow-md'
                    : 'bg-slate-50/50 dark:bg-white/[0.02] border-slate-200/80 dark:border-white/[0.06] hover:bg-white'
                }`}
              >
                <div className="space-y-1.5 w-full">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                        isSelected
                          ? 'bg-brand-500 text-white border-brand-600'
                          : 'bg-white dark:bg-white/[0.05] text-slate-700 dark:text-zinc-300 border-slate-200/80'
                      }`}
                    >
                      {rfq.rfqNumber}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      {rfq.items.length} BOQ Items
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {rfq.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">
                    {rfq.projectName} • {rfq.deliveryEmirate}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-200/60 dark:border-white/[0.06] flex items-center justify-between w-full text-xs">
                  {offersForRfq.length > 0 ? (
                    <span className="font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>{offersForRfq.length} / 5 Offers Ready</span>
                    </span>
                  ) : (
                    <span className="text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 text-[11px] flex items-center gap-1 font-semibold">
                      <Clock className="w-3 h-3" />
                      <span>ProcureSouq Sourcing</span>
                    </span>
                  )}

                  {lowestOffer !== null && (
                    <span className="font-extrabold text-slate-900 dark:text-white font-mono text-xs">
                      From {formatAED(lowestOffer)}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 2: FIVE-QUOTE CUSTOMER COMPARISON TABLE */}
      {publishedOffers.length > 0 ? (
        <div className="space-y-5">
          {/* Fewer-than-5-Offers Transparent Notice (if < 5 received) */}
          {publishedOffers.length < 5 && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <strong className="font-extrabold block">
                    {publishedOffers.length} of 5 Target Offers Published ({5 - publishedOffers.length} Slots Unpopulated)
                  </strong>
                  <span>
                    ProcureSouq never fabricates missing quotations. Only the {publishedOffers.length} verified supplier offers received for {targetRFQ.rfqNumber} are displayed below.
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-white/80 dark:bg-black/40 font-mono font-bold text-amber-900 dark:text-amber-300 border border-amber-300">
                Actual Verified Offers: {publishedOffers.length} / 5
              </span>
            </div>
          )}

          {/* Rule-Based Recommendation Cards & Sort Bar */}
          <div className="bg-white dark:bg-[#111114] p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#9e1c2e]" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Transparent Rule-Based Offer Evaluation ({publishedOffers.length} Qualified Offers)
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                All prices shown are your all-inclusive ProcureSouq selling rates with UAE VAT and coordinated site delivery breakdown.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" /> Sort Offers:
              </span>
              {[
                { id: 'best_value', label: 'Best Overall Value' },
                { id: 'lowest_price', label: 'Lowest Price' },
                { id: 'fastest_delivery', label: 'Fastest Delivery' },
                { id: 'best_technical', label: 'Best Technical Match' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSortBy(opt.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    sortBy === opt.id
                      ? 'bg-[#9e1c2e] text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-zinc-300 hover:bg-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Side-by-Side Five-Offer Comparison Table */}
          <div className="bg-white dark:bg-[#111114] rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/[0.08] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[820px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/[0.08] bg-slate-900 text-white">
                    <th className="p-4 w-52 sticky left-0 bg-slate-900 z-20 border-r border-slate-800 font-extrabold uppercase text-[11px]">
                      ProcureSouq Offer Dimension
                    </th>
                    {sortedOffers.map((offer) => (
                      <th
                        key={offer.id}
                        className={`p-4 min-w-[230px] align-top border-r border-slate-800 ${
                          offer.status === 'selected' ? 'bg-emerald-950/60' : ''
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-md bg-[#cf2e46] text-white font-black text-xs">
                              {offer.offerLabel}
                            </span>
                            <span className="font-mono text-[10px] text-slate-300">
                              {offer.offerNumber}
                            </span>
                          </div>

                          {/* Rule-Based Recommendation Badges */}
                          {offer.ruleRecommendations.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {offer.ruleRecommendations.map((rec) => (
                                <span
                                  key={rec}
                                  className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-extrabold"
                                >
                                  ★ {rec}
                                </span>
                              ))}
                            </div>
                          )}

                          {offer.isPartialOffer && (
                            <div className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-black uppercase inline-block">
                              ⚠️ Partial Offer ({offer.quotedItemsCount}/{offer.totalRfqItemsCount} Items)
                            </div>
                          )}

                          <div className="text-[11px] text-slate-300">
                            Counterparty: ProcureSouq Managed Supply
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-white/[0.06]">
                  {/* Overall Estimated Landed Cost */}
                  <tr className="bg-rose-50/30 dark:bg-white/[0.02]">
                    <td className="p-4 sticky left-0 bg-white dark:bg-[#111114] z-10 border-r border-slate-200 font-extrabold text-slate-900 dark:text-white">
                      Overall Estimated Landed Cost (Incl. 5% VAT & Delivery)
                    </td>
                    {sortedOffers.map((offer) => (
                      <td key={offer.id} className="p-4 border-r border-slate-100">
                        <div className="text-lg font-black font-mono text-[#9e1c2e] dark:text-rose-400">
                          {formatAED(offer.estimatedLandedTotalAED)}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Materials: <strong>{formatAED(offer.sellingSubtotalAED)}</strong> • Delivery:{' '}
                          <strong>{formatAED(offer.deliveryFeeAED)}</strong> • VAT:{' '}
                          <strong>{formatAED(offer.vatAED)}</strong>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Brand Offered */}
                  <tr>
                    <td className="p-4 sticky left-0 bg-white dark:bg-[#111114] z-10 border-r border-slate-200 font-bold text-slate-700 dark:text-zinc-300">
                      Brand(s) Offered
                    </td>
                    {sortedOffers.map((offer) => (
                      <td key={offer.id} className="p-4 border-r border-slate-100 font-bold text-slate-900 dark:text-white">
                        {offer.brandOffered}
                      </td>
                    ))}
                  </tr>

                  {/* Technical Compliance & Deviations */}
                  <tr>
                    <td className="p-4 sticky left-0 bg-white dark:bg-[#111114] z-10 border-r border-slate-200 font-bold text-slate-700 dark:text-zinc-300">
                      Technical Compliance & BOQ Coverage
                    </td>
                    {sortedOffers.map((offer) => (
                      <td key={offer.id} className="p-4 border-r border-slate-100 space-y-1.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                            offer.technicalCompliance === '100% Compliant to BOQ'
                              ? 'bg-emerald-100 text-emerald-800'
                              : offer.technicalCompliance === 'Approved Equivalent'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {offer.technicalCompliance} ({offer.quotedItemsCount}/{offer.totalRfqItemsCount} Items)
                        </span>
                        {offer.deviationWarning && (
                          <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                            {offer.deviationWarning}
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Delivery Lead Time & Availability */}
                  <tr>
                    <td className="p-4 sticky left-0 bg-white dark:bg-[#111114] z-10 border-r border-slate-200 font-bold text-slate-700 dark:text-zinc-300">
                      Delivery Lead Time & Stock Availability
                    </td>
                    {sortedOffers.map((offer) => (
                      <td key={offer.id} className="p-4 border-r border-slate-100">
                        <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-[#9e1c2e]" />
                          <span>{offer.leadTimeDisplay}</span>
                        </div>
                        <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                          {offer.availabilityStatus}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Payment Terms, Warranty & Validity */}
                  <tr>
                    <td className="p-4 sticky left-0 bg-white dark:bg-[#111114] z-10 border-r border-slate-200 font-bold text-slate-700 dark:text-zinc-300">
                      Payment Terms, Warranty & Validity
                    </td>
                    {sortedOffers.map((offer) => (
                      <td key={offer.id} className="p-4 border-r border-slate-100 space-y-1">
                        <div>
                          <span className="text-slate-400">Payment:</span>{' '}
                          <strong className="text-slate-900 dark:text-white">{offer.paymentTerms}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400">Warranty:</span>{' '}
                          <strong className="text-slate-900 dark:text-white">{offer.warrantyTerms}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400">Valid Until:</span>{' '}
                          <strong className="text-slate-900 dark:text-white">{offer.validityDate}</strong>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Section Divider: Line-by-Line BOQ Unit & Total Price Comparison */}
                  <tr className="bg-slate-100 dark:bg-white/[0.04]">
                    <td
                      colSpan={sortedOffers.length + 1}
                      className="p-3 px-4 font-black text-[11px] uppercase tracking-wider text-slate-800 dark:text-white"
                    >
                      Line-by-Line BOQ Selling Rates ({targetRFQ.items.length} Requested Materials)
                    </td>
                  </tr>

                  {targetRFQ.items.map((boqItem, idx) => (
                    <tr key={boqItem.id} className="hover:bg-slate-50/70">
                      <td className="p-3.5 sticky left-0 bg-white dark:bg-[#111114] z-10 border-r border-slate-200">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {idx + 1}. {boqItem.description}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Qty: <strong>{boqItem.quantity} {boqItem.unit}</strong> • Pref:{' '}
                          {boqItem.preferredBrand || 'Standard'}
                        </div>
                      </td>
                      {sortedOffers.map((offer) => {
                        const line = offer.items.find(
                          (oi, oIdx) => oi.rfqItemId === boqItem.id || oIdx === idx
                        );
                        return (
                          <td key={offer.id} className="p-3.5 border-r border-slate-100">
                            {line && line.isIncluded ? (
                              <div className="space-y-0.5">
                                <div className="font-mono font-extrabold text-slate-900 dark:text-white">
                                  {formatAED(line.customerUnitPriceAED)}{' '}
                                  <span className="text-[10px] font-normal text-slate-400">
                                    / {line.unit}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-600 font-mono">
                                  Line Total: <strong>{formatAED(line.customerLineTotalAED)}</strong>
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  Brand: <strong>{line.offeredBrand}</strong>
                                  {line.isAlternative && (
                                    <span className="ml-1 px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-bold">
                                      Alt. Brand
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                                Not Quoted in Partial Offer
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Action Row: Proceed with Selected Offer */}
                  <tr className="bg-slate-50 dark:bg-white/[0.02]">
                    <td className="p-4 sticky left-0 bg-slate-50 dark:bg-[#111114] z-10 border-r border-slate-200 font-extrabold text-slate-900 dark:text-white">
                      Step 7: Select Offer & Place Order
                    </td>
                    {sortedOffers.map((offer) => (
                      <td key={offer.id} className="p-4 border-r border-slate-100">
                        {offer.status === 'selected' ? (
                          <div className="space-y-2">
                            <div className="w-full py-2 px-3 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold text-center">
                              ✓ Offer Selected & PO Issued
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onNavigate('buyer-orders')}
                              className="w-full text-xs"
                            >
                              View Order & Delivery Status →
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              setSelectedOfferForOrder(offer);
                              setTermsAccepted(false);
                            }}
                            className="w-full font-extrabold rounded-xl py-2.5 shadow-md"
                          >
                            Proceed with Selected Offer
                          </Button>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Fallback to existing V1 table if no V2 CustomerOffers published yet */
        <QuotationComparisonTable
          rfq={targetRFQ}
          quotations={rfqQuotes}
          onAward={handleLegacyAward}
        />
      )}

      {/* =================================================================== */}
      {/* STEP 7 & 8 MODAL: ORDER SUMMARY & ISSUE PURCHASE ORDER              */}
      {/* =================================================================== */}
      {selectedOfferForOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <Card className="max-w-2xl w-full p-6 bg-white border-slate-200 space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#9e1c2e]">
                  Steps 7 & 8 — Order Summary & Purchase Order Issuance
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Proceed with {selectedOfferForOrder.offerLabel} ({selectedOfferForOrder.offerNumber})
                </h3>
                <p className="text-xs text-slate-500">
                  Contracting Entity: <strong>{commercialSettings.contractingEntityName}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedOfferForOrder(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmCustomerPO} className="space-y-4 text-xs">
              {/* Order Summary Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">RFQ Reference & Project:</span>
                  <strong className="text-slate-900">
                    {targetRFQ.rfqNumber} — {targetRFQ.projectName}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Selected Materials & Brands:</span>
                  <strong className="text-slate-900">
                    {selectedOfferForOrder.quotedItemsCount} of {selectedOfferForOrder.totalRfqItemsCount} BOQ Items ({selectedOfferForOrder.brandOffered})
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Agreed Technical Compliance:</span>
                  <strong className="text-slate-900">
                    {selectedOfferForOrder.technicalCompliance}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Estimated Delivery & Payment Terms:</span>
                  <strong className="text-slate-900">
                    {selectedOfferForOrder.leadTimeDisplay} • {selectedOfferForOrder.paymentTerms}
                  </strong>
                </div>
                <div className="border-t border-slate-200 pt-2 mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Selling Price (Before VAT):</span>
                    <span className="font-mono font-bold">
                      {formatAED(selectedOfferForOrder.sellingSubtotalAED)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Coordinated Site Delivery Fee:</span>
                    <span className="font-mono font-bold">
                      {formatAED(selectedOfferForOrder.deliveryFeeAED)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">UAE VAT (5%):</span>
                    <span className="font-mono font-bold">
                      {formatAED(selectedOfferForOrder.vatAED)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-[#9e1c2e] pt-1 border-t border-slate-200">
                    <span>Total Payable (Incl. VAT):</span>
                    <span className="font-mono">
                      {formatAED(selectedOfferForOrder.estimatedLandedTotalAED)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 8: Two Ordering Methods */}
              <div className="space-y-2.5">
                <label className="block font-extrabold text-slate-900">
                  Step 8: Select Purchase Order Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setOrderingMethod('uploaded_po')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      orderingMethod === 'uploaded_po'
                        ? 'border-[#9e1c2e] bg-rose-50/40 ring-2 ring-[#9e1c2e]/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-extrabold text-slate-900">
                      Method A: Upload Official Company PO
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Upload your company's signed Purchase Order addressed to {commercialSettings.contractingEntityName}.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderingMethod('platform_generated_po')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      orderingMethod === 'platform_generated_po'
                        ? 'border-[#9e1c2e] bg-rose-50/40 ring-2 ring-[#9e1c2e]/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-extrabold text-slate-900">
                      Method B: Create PO Through ProcureSouq
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Generate a digital order reference (`PS-CPO-2026-XXXX`) directly on the platform.
                    </p>
                  </button>
                </div>
              </div>

              {orderingMethod === 'uploaded_po' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Your Internal PO Reference Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. APEX-PO-2026-881"
                      value={customerPoRef}
                      onChange={(e) => setCustomerPoRef(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-300 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Upload Official PO PDF / Document
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setUploadedPoFileName(file.name);
                      }}
                      className="w-full p-1.5 rounded-lg border border-slate-300 bg-white text-[11px]"
                    />
                  </div>
                </div>
              ) : (
                !commercialSettings.isCommercialConfigApproved && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[11px] text-amber-900">
                    <strong>Commercial Governance Gate Active:</strong> Your order will be generated with reference <code>PS-CPO-2026-XXXX</code> as a provisional order pending final ProcureSouq Administrator commercial sign-off before legally binding invoicing is issued.
                  </div>
                )
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Site Delivery Instructions / Gate Pass Contact
                </label>
                <input
                  type="text"
                  placeholder="Site Engineer name, gate number, crane/offloading timing..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              {/* Terms Acceptance Checkbox */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#9e1c2e]"
                />
                <span className="text-[11px] text-slate-700 leading-relaxed">
                  I confirm acceptance of the selected offer specifications, quantities, delivery schedule, payment terms ({selectedOfferForOrder.paymentTerms}), and authorize order placement with <strong>{commercialSettings.contractingEntityName}</strong>.
                </span>
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedOfferForOrder(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={!termsAccepted}>
                  Issue Customer PO & Place Order (PS-CPO)
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};