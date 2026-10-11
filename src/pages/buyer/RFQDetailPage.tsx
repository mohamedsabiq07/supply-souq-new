import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
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
  Trash2,
  Printer,
  Zap,
  Lock
} from 'lucide-react';
import { SupportDeskInlineBox } from '../../components/common/SupportChatWidget';

interface RFQDetailPageProps {
  rfqId: string;
  onNavigate: (view: string, params?: any) => void;
}

export const RFQDetailPage: React.FC<RFQDetailPageProps> = ({ rfqId, onNavigate }) => {
  const { role, currentCompany } = useAuth();
  const {
    rfqs,
    quotations,
    customerOffers,
    commercialSettings,
    isRFQExtendedUnlocked,
    cancelRFQByBuyer,
    hasSupplierQuoted
  } = useAppData();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const isSupplier = role === 'supplier';
  const rfq = rfqs.find(r => r.id === rfqId || r.rfqNumber === rfqId);

  if (!rfq) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
        <p className="text-base font-bold text-slate-900">RFQ Not Found</p>
        <Button variant="primary" className="mt-4" onClick={() => onNavigate(isSupplier ? 'supplier-inbox' : 'buyer-rfqs')}>
          {isSupplier ? 'Back to RFQ Inbox' : 'Back to RFQs'}
        </Button>
      </div>
    );
  }

  const publishedOffers = customerOffers
    .filter(o => (o.rfqId === rfq.id || o.rfqNumber === rfq.rfqNumber) && o.status !== 'withdrawn')
    .sort((a, b) => a.offerSlot - b.offerSlot);

  const rfqQuotes = quotations.filter(q => q.rfqId === rfq.id || q.rfqNumber === rfq.rfqNumber);
  const mySupplierQuote = isSupplier
    ? rfqQuotes.find(q => q.supplierCompanyId === currentCompany.id)
    : undefined;
  const supplierAlreadyQuoted = isSupplier && hasSupplierQuoted(rfq.id, currentCompany.id);

  const isUnlocked = isRFQExtendedUnlocked(rfq.id);
  const visibleQuotes = isUnlocked ? rfqQuotes : rfqQuotes.slice(0, 5);

  const handleConfirmCancel = (rfqIdToCancel: string, reason: string, notes?: string) => {
    cancelRFQByBuyer(rfqIdToCancel, reason, notes);
    onNavigate('buyer-rfqs');
  };

  const handlePrintSupplierRFQPdf = () => {
    const win = window.open('', '_blank', 'width=900,height=700');
    if (!win) return;
    const rowsHtml = rfq.items.map((it, idx) => `
      <tr>
        <td style="padding:8px;border:1px solid #cbd5e1;">${idx + 1}</td>
        <td style="padding:8px;border:1px solid #cbd5e1;"><strong>${it.description}</strong><br/><span style="font-size:11px;color:#64748b;">${it.specification || ''}</span></td>
        <td style="padding:8px;border:1px solid #cbd5e1;">${it.preferredBrand || 'Open Spec'} ${it.allowAlternatives ? '(Equiv. OK)' : ''}</td>
        <td style="padding:8px;border:1px solid #cbd5e1;text-align:right;font-weight:bold;">${it.quantity} ${it.unit}</td>
      </tr>
    `).join('');
    win.document.write(`
      <html>
        <head><title>ProcureSouq Official Supplier RFQ - ${rfq.rfqNumber}</title></head>
        <body style="font-family:Inter,Arial,sans-serif;padding:32px;color:#0f172a;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #0f172a;padding-bottom:16px;margin-bottom:20px;">
            <div>
              <h1 style="margin:0;font-size:22px;">PROCURESOUQ — REQUEST FOR QUOTATION</h1>
              <p style="margin:4px 0 0;font-size:12px;color:#475569;">Issued by: ${commercialSettings.contractingEntityName} • Managed Procurement Desk</p>
            </div>
            <div style="text-align:right;">
              <div style="font-family:monospace;font-size:16px;font-weight:bold;color:#cf2e46;">${rfq.rfqNumber}</div>
              <div style="font-size:12px;color:#64748b;">Closing Date: ${rfq.closingDate}</div>
            </div>
          </div>
          <p style="font-size:13px;"><strong>Requirement Title:</strong> ${rfq.title}</p>
          <p style="font-size:12px;color:#334155;">
            <strong>Contracting Counterparty:</strong> ProcureSouq Managed Procurement Desk (Confidential End-Client) •
            <strong>Delivery Emirate:</strong> ${rfq.deliveryEmirate} •
            <strong>Required Delivery Date:</strong> ${rfq.requiredDeliveryDate} •
            <strong>Authority Compliance:</strong> ${rfq.authorityApproval || 'Standard UAE Spec'}
          </p>
          ${rfq.specialRequirements ? `<p style="font-size:12px;background:#f8fafc;padding:10px;border:1px solid #e2e8f0;"><strong>Special Instructions:</strong> ${rfq.specialRequirements}</p>` : ''}
          <table style="width:100%;border-collapse:collapse;font-size:12px;margin-top:16px;">
            <thead style="background:#f1f5f9;">
              <tr>
                <th style="padding:8px;border:1px solid #cbd5e1;text-align:left;">#</th>
                <th style="padding:8px;border:1px solid #cbd5e1;text-align:left;">Material Description & Technical Spec</th>
                <th style="padding:8px;border:1px solid #cbd5e1;text-align:left;">Approved Brands</th>
                <th style="padding:8px;border:1px solid #cbd5e1;text-align:right;">Qty & Unit</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
          <p style="margin-top:24px;font-size:11px;color:#64748b;">
            Note: All supplier quotations must be addressed to <strong>${commercialSettings.contractingEntityName}</strong> and submitted via the ProcureSouq Supplier Portal. Direct end-buyer solicitation is strictly prohibited under platform terms.
          </p>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate(isSupplier ? 'supplier-inbox' : 'buyer-rfqs')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            {isSupplier ? 'Back to RFQ Inbox' : 'Back to RFQs'}
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded border border-brand-100 dark:border-brand-900/60">
                {rfq.rfqNumber}
              </span>
              <StatusBadge status={rfq.status} />
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> ProcureSouq Managed RFQ
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {rfq.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrintSupplierRFQPdf}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Download RFQ PDF
          </Button>

          {isSupplier ? (
            supplierAlreadyQuoted ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Your Quotation Submitted
              </span>
            ) : rfq.status !== 'cancelled' ? (
              <Button
                variant="amber"
                size="sm"
                onClick={() => onNavigate('submit-quote', { rfqId: rfq.id })}
                leftIcon={<Zap className="w-4 h-4" />}
                className="font-bold"
              >
                Submit Supplier Quotation
              </Button>
            ) : null
          ) : (
            <>
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

              {(publishedOffers.length > 0 || rfqQuotes.length > 0) && rfq.status !== 'cancelled' && (
                <button
                  type="button"
                  onClick={() => onNavigate('buyer-compare', { rfqId: rfq.id })}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-300/80 dark:border-rose-800/50 hover:border-rose-400 dark:hover:border-rose-700 transition-all shadow-2xs active:scale-[0.99] cursor-pointer shrink-0"
                >
                  <GitCompare className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>
                    Compare {publishedOffers.length > 0 ? publishedOffers.length : visibleQuotes.length} Qualified Offer{(publishedOffers.length || visibleQuotes.length) > 1 ? 's' : ''}
                  </span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Supplier Confidentiality Notice when viewed by Supplier */}
      {isSupplier && (
        <div className="p-3.5 rounded-xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>ProcureSouq Managed Intermediary Notice:</strong> You are quoting directly to <strong>{commercialSettings.contractingEntityName}</strong>. End-buyer contact details and competing supplier quotations are strictly confidential.
            </span>
          </div>
          <span className="text-[11px] font-mono text-amber-300 shrink-0">
            Deadline: {rfq.supplierQuoteDeadline || rfq.closingDate}
          </span>
        </div>
      )}

      {/* RFQ Project Specification Dossier */}
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
              {isSupplier ? `${rfq.deliveryEmirate} Project Site (Coordinated via ProcureSouq)` : (rfq.deliveryAddress || 'Site delivery direct')}
            </p>
          </div>

          <div className="p-5 space-y-1">
            <span className="text-slate-400 dark:text-zinc-500 text-[11px] font-semibold uppercase tracking-wider block">Compliance & Commercial</span>
            <strong className="text-sm sm:text-base text-slate-900 dark:text-white font-bold block truncate">
              {rfq.authorityApproval || 'Standard UAE Spec'}
            </strong>
            <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">
              Payment Terms: <span className="font-semibold text-slate-700 dark:text-zinc-300">{rfq.paymentTermsPreference || '30 Days Net'}</span>
            </p>
          </div>

          <div className="p-5 space-y-1">
            <span className="text-slate-400 dark:text-zinc-500 text-[11px] font-semibold uppercase tracking-wider block">
              {isSupplier ? 'Contracting Counterparty' : 'Procurement Desk Status'}
            </span>
            <strong className="text-sm sm:text-base text-slate-900 dark:text-white font-bold block truncate">
              {isSupplier
                ? 'ProcureSouq Managed Desk'
                : publishedOffers.length > 0
                ? `${publishedOffers.length} of 5 Qualified Offers Ready`
                : 'Sourcing & Vetting in Progress'}
            </strong>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3" /> Need by: {formatDate(rfq.requiredDeliveryDate)}
            </p>
          </div>
        </div>
      </div>

      {/* Supplier View: Show ONLY their own quotation if submitted */}
      {isSupplier && mySupplierQuote && (
        <Card className="border-emerald-200 bg-emerald-50/30">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Your Confidential Quotation to ProcureSouq</h3>
                  <p className="text-xs text-slate-500">Ref: {mySupplierQuote.quotationNumber} • Submitted on {formatDate(mySupplierQuote.submittedAt)}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Your Quoted Total (Incl. VAT)</span>
                <span className="text-lg font-extrabold font-mono text-slate-900">{formatAED(mySupplierQuote.grandTotalAED)}</span>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Buyer View: Qualified ProcureSouq Offers Showcase (Sanitized) */}
      {!isSupplier && (
        publishedOffers.length > 0 ? (
          <div className="bg-white dark:bg-gradient-to-b dark:from-[#111114] dark:to-[#0c0c0e] rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/[0.08] p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/[0.06] pb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{publishedOffers.length} of 5 Qualified Offers Published</span>
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    ProcureSouq Qualified Customer Offers
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                  Technically vetted commercial offers prepared by ProcureSouq Managed Procurement Desk for RFQ #{rfq.rfqNumber}.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('buyer-compare', { rfqId: rfq.id })}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-300/80 dark:border-rose-800/50 hover:border-rose-400 dark:hover:border-rose-700 transition-all shadow-2xs active:scale-[0.99] cursor-pointer"
              >
                <GitCompare className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>Open Five-Quote Comparison Matrix</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {publishedOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="bg-slate-50/50 dark:bg-white/[0.02] p-5 rounded-2xl border border-slate-200/80 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/[0.14] transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-brand-700 dark:text-brand-300 bg-brand-500/10 px-2.5 py-0.5 rounded-full text-[11px]">
                        {offer.offerLabel} ({offer.offerNumber})
                      </span>
                      {offer.ruleRecommendations && offer.ruleRecommendations.length > 0 && (
                        <span className="font-bold text-amber-800 dark:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 text-[10px]">
                          ★ {offer.ruleRecommendations[0]}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {`ProcureSouq Verified Stockist (${offer.offerLabel})`}
                      </h4>
                      <span className="text-[11px] text-slate-500 dark:text-zinc-400 block">
                        Brands: <strong>{offer.brandOffered}</strong>
                      </span>
                    </div>

                    <div className="pt-2 pb-1 border-t border-slate-200/60 dark:border-white/[0.06]">
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold uppercase tracking-wider block">
                        Total Landed Selling Price (5% VAT Incl.)
                      </span>
                      <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white mt-0.5">
                        {formatAED(offer.estimatedLandedTotalAED)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs py-1">
                      <div>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">Lead Time</span>
                        <strong className="text-slate-800 dark:text-zinc-200 font-semibold">
                          {offer.leadTimeDays} Days
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">Compliance</span>
                        <strong className="text-slate-800 dark:text-zinc-200 font-semibold truncate block">
                          {offer.isPartialOffer ? `Partial (${offer.quotedItemsCount}/${offer.totalRfqItemsCount})` : '100% Full BOQ'}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center space-y-3 rounded-2xl sm:rounded-3xl border border-dashed border-emerald-500/30 bg-emerald-500/5">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mx-auto font-bold">
              <Clock className="w-6 h-6 animate-pulse text-emerald-500" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">ProcureSouq Procurement Team is Sourcing Quotations</h4>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                Your RFQ has been assigned to our procurement specialists. We are collecting and verifying up to 5 competitive supplier quotations before publishing your comparison table.
              </p>
            </div>
          </div>
        )
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

      {/* Direct Text Box for Customer Service & Procurement Officers */}
      <SupportDeskInlineBox defaultRfqNumber={rfq.rfqNumber} />

      {/* Buyer Cancel RFQ Modal */}
      {!isSupplier && (
        <BuyerCancelRFQModal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          rfq={rfq}
          onConfirmCancel={handleConfirmCancel}
        />
      )}
    </div>
  );
};