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
              <span className="text-xs font-mono font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                {rfq.rfqNumber}
              </span>
              <StatusBadge status={rfq.status} />
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 24-Hour Stockist SLA
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
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
              className="text-slate-600 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50/60"
              leftIcon={<Trash2 className="w-4 h-4 text-rose-500" />}
            >
              Cancel / Remove RFQ
            </Button>
          )}

          {rfqQuotes.length > 0 && rfq.status !== 'cancelled' && (
            <Button
              variant="primary"
              onClick={() => onNavigate('buyer-compare', { rfqId: rfq.id })}
              leftIcon={<GitCompare className="w-4 h-4" />}
              className="font-bold shadow-sm"
            >
              Compare {visibleQuotes.length} Quotations in Matrix
            </Button>
          )}
        </div>
      </div>

      {/* RFQ Meta Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-slate-400 text-xs font-medium block">Project</span>
          <strong className="text-sm text-slate-900 font-bold">{rfq.projectName}</strong>
          <span className="text-[11px] text-slate-500 block mt-0.5">Category: {rfq.category}</span>
        </Card>

        <Card className="p-4">
          <span className="text-slate-400 text-xs font-medium block">Delivery Site</span>
          <strong className="text-sm text-slate-900 font-bold">{rfq.deliveryEmirate}</strong>
          <span className="text-[11px] text-slate-500 block mt-0.5 truncate">{rfq.deliveryAddress}</span>
        </Card>

        <Card className="p-4">
          <span className="text-slate-400 text-xs font-medium block">Required Date</span>
          <strong className="text-sm text-slate-900 font-bold">{formatDate(rfq.requiredDeliveryDate)}</strong>
          <span className="text-[11px] text-slate-500 block mt-0.5">Closing: {formatDate(rfq.closingDate)}</span>
        </Card>

        <Card className="p-4">
          <span className="text-slate-400 text-xs font-medium block">Suppliers Quoting</span>
          <strong className="text-sm text-slate-900 font-bold">5 Matched Stockists</strong>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">
            {rfqQuotes.length > 0 
              ? isUnlocked ? `${rfqQuotes.length} Quotes (Unlocked)` : `${Math.min(rfqQuotes.length, 5)} / 5 Quotes In`
              : '24-Hour SLA Active'}
          </span>
        </Card>
      </div>

      {/* Received Supplier Quotations Showcase Cards */}
      {rfqQuotes.length > 0 ? (
        <Card className="p-5 border-brand-200 bg-gradient-to-b from-brand-50/30 to-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-100/60 pb-3.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {isUnlocked ? `${rfqQuotes.length} Quotations (Unlocked)` : `${Math.min(rfqQuotes.length, 5)} / 5 Free Quotations`}
                  </span>
                </span>
                {lockedCount > 0 && (
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    +{lockedCount} More Locked (AED 49)
                  </span>
                )}
                <h3 className="text-base font-bold text-slate-900">
                  Received Supplier Quotations
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Direct binding commercial offers from verified UAE stockists collected for RFQ #{rfq.rfqNumber}.
              </p>
            </div>

            <Button
              variant="primary"
              onClick={() => onNavigate('buyer-compare', { rfqId: rfq.id })}
              leftIcon={<GitCompare className="w-4 h-4 text-amber-300" />}
              className="font-bold shadow-sm"
            >
              Compare {visibleQuotes.length} Quotation{visibleQuotes.length > 1 ? 's' : ''} in Matrix
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {visibleQuotes.map((quote, idx) => (
              <div
                key={quote.id}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-brand-500 shadow-subtle flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-mono font-bold text-slate-700">{quote.quotationNumber}</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      Offer {idx + 1} of {visibleQuotes.length}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{quote.supplierCompanyName}</h4>
                  <span className="text-[10px] text-slate-500 block">{quote.supplierZone || quote.supplierEmirate}</span>

                  <div className="my-2.5 p-2.5 bg-slate-900 text-white rounded-lg">
                    <span className="text-[9px] text-slate-400 block uppercase font-medium">Quoted Total (5% VAT Incl.)</span>
                    <span className="text-base font-extrabold font-mono">{formatAED(quote.grandTotalAED)}</span>
                  </div>

                  <div className="text-[11px] text-slate-600 space-y-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Lead Time:</span>
                      <strong className="text-slate-800">{quote.leadTimeDisplay || `${quote.leadTimeDays} Days`}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Payment:</span>
                      <strong className="text-slate-800 truncate">{quote.paymentTerms || '30 Days'}</strong>
                    </div>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  className="w-full text-xs font-bold"
                  onClick={() => onNavigate('buyer-compare', { rfqId: rfq.id })}
                >
                  Compare in Matrix
                </Button>
              </div>
            ))}

            {lockedCount > 0 && (
              <div
                onClick={() => onNavigate('buyer-compare', { rfqId: rfq.id })}
                className="p-4 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/40 hover:bg-amber-50 transition-all space-y-3 flex flex-col justify-between cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                      +5 Extended Pack
                    </span>
                    <span className="text-xs font-bold text-amber-800 font-mono">AED 49.00</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">+{lockedCount} More Supplier Quotations</h5>
                    <p className="text-[11px] text-slate-500">Tier-2 factory importers & regional stockist bids</p>
                  </div>
                  <p className="text-[11px] text-amber-800 bg-white/80 p-2 rounded border border-amber-200 leading-snug">
                    Pay AED 49 to unlock 5 additional supplier quotations for this RFQ.
                  </p>
                </div>
                <Button
                  variant="amber"
                  size="sm"
                  onClick={() => onNavigate('buyer-compare', { rfqId: rfq.id })}
                  className="w-full text-xs font-bold shadow-xs"
                >
                  Unlock 5 More Quotes
                </Button>
              </div>
            )}
          </div>
        </Card>
      ) : (
        <Card className="p-8 text-center space-y-3 border-dashed border-2 border-emerald-200 bg-emerald-50/30">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto font-bold">
            <Clock className="w-6 h-6 animate-pulse text-emerald-700" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h4 className="text-base font-bold text-slate-900">RFQ Dispatched to 5 Verified Stockists</h4>
            <p className="text-xs text-slate-600">
              Your material requirement has been delivered to 5 matching stockists. Stockists are submitting commercial quotations within our 24-hour SLA.
            </p>
            {rfq.matchedSupplierNames && rfq.matchedSupplierNames.length > 0 && (
              <div className="pt-2 flex flex-wrap justify-center gap-1.5 text-[11px]">
                {rfq.matchedSupplierNames.map((name, i) => (
                  <span key={i} className="bg-white border border-slate-200 px-2.5 py-1 rounded-full text-slate-700 font-semibold shadow-xs">
                    ✓ {name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Materials Schedule Table */}
      <Card>
        <CardHeader>
          <div>
            <h3 className="text-base font-bold text-slate-900">Materials Schedule (BOQ)</h3>
            <p className="text-xs text-slate-500">{rfq.items.length} line items specified for procurement.</p>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3 min-w-[200px]">Description</th>
                <th className="p-3 min-w-[200px]">Technical Specification</th>
                <th className="p-3">Preferred Brand</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rfq.items.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-50/50">
                  <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                  <td className="p-3 font-bold text-slate-900">{item.description}</td>
                  <td className="p-3 text-slate-600">{item.specification || 'Standard Spec'}</td>
                  <td className="p-3 font-medium text-slate-800">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {item.preferredBrand || 'Open Spec'}
                    </span>
                  </td>
                  <td className="p-3 font-extrabold text-slate-900">{item.quantity}</td>
                  <td className="p-3 text-slate-600">{item.unit}</td>
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