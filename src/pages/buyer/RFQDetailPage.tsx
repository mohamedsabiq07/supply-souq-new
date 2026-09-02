import React from 'react';
import { useAppData } from '../../context/AppDataContext';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
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
  ArrowRight
} from 'lucide-react';

interface RFQDetailPageProps {
  rfqId: string;
  onNavigate: (view: string, params?: any) => void;
}

export const RFQDetailPage: React.FC<RFQDetailPageProps> = ({ rfqId, onNavigate }) => {
  const { rfqs, quotations } = useAppData();

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
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded border border-brand-200">
                {rfq.rfqNumber}
              </span>
              <StatusBadge status={rfq.status} />
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                5 Free Quotations Active
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{rfq.title}</h1>
          </div>
        </div>

        {rfqQuotes.length > 0 && (
          <Button
            variant="primary"
            onClick={() => onNavigate('buyer-compare', { rfqId: rfq.id })}
            leftIcon={<GitCompare className="w-4 h-4" />}
            className="bg-brand-600 hover:bg-brand-700 font-bold"
          >
            Compare All 5 Quotations
          </Button>
        )}
      </div>

      {/* Overview Specs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-slate-400 text-xs font-medium block">Project Name</span>
          <strong className="text-sm text-slate-900 font-bold">{rfq.projectName}</strong>
          <span className="text-[11px] text-slate-500 block mt-0.5">{rfq.projectLocation}</span>
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
          <strong className="text-sm text-slate-900 font-bold">{rfq.invitedCount || 5} Matched Stockists</strong>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">
            {rfqQuotes.length > 0 ? `${rfqQuotes.length} Quotes Received` : '24-Hour SLA Active'}
          </span>
        </Card>
      </div>

      {/* 5 Received Supplier Quotations Showcase Cards or Dispatch Waiting State */}
      {rfqQuotes.length > 0 ? (
        <Card className="p-5 border-brand-200 bg-gradient-to-b from-brand-50/30 to-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  {rfqQuotes.length === 5 ? '5/5 Complete Benchmark' : `${rfqQuotes.length} of 5 Quotes In`}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Received Supplier Quotations ({rfqQuotes.length})
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Direct binding commercial offers from verified UAE stockists for your evaluation.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigate('buyer-compare', { rfqId: rfq.id })}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="font-bold"
            >
              Open Comparison Matrix
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {rfqQuotes.map((quote, idx) => (
              <div
                key={quote.id}
                className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-brand-500 shadow-subtle flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-mono">{quote.quotationNumber}</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-1 rounded">
                      Quote {idx + 1} of {rfqQuotes.length}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{quote.supplierCompanyName}</h4>
                  <span className="text-[10px] text-slate-500 block">{quote.supplierZone || quote.supplierEmirate}</span>

                  <div className="my-2 p-2 bg-slate-900 text-white rounded-lg">
                    <span className="text-[9px] text-slate-400 block uppercase">Total (Incl. VAT)</span>
                    <span className="text-sm font-extrabold">{formatAED(quote.grandTotalAED)}</span>
                  </div>

                  <div className="text-[10px] text-slate-600 space-y-0.5">
                    <p>Lead Time: <strong className="text-slate-800">{quote.leadTimeDisplay || quote.leadTimeDays + ' Day'}</strong></p>
                    <p>Terms: <strong className="text-slate-800">{quote.paymentTerms}</strong></p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 text-xs font-semibold"
                  onClick={() => onNavigate('buyer-compare', { rfqId: rfq.id })}
                >
                  Review Quote
                </Button>
              </div>
            ))}
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
    </div>
  );
};