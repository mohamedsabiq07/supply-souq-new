import React from 'react';
import { InvoiceAuditScanner, SampleInvoice } from '../../components/audit/InvoiceAuditScanner';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { QuickBundle } from '../../types';
import { 
  FileSpreadsheet, 
  TrendingDown, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Store,
  Building2,
  Clock,
  Zap
} from 'lucide-react';

interface InvoiceAuditPageProps {
  onStartRFQWithAudit: (bundle: QuickBundle) => void;
}

export const InvoiceAuditPage: React.FC<InvoiceAuditPageProps> = ({ onStartRFQWithAudit }) => {

  const handleSwitchToRFQ = (auditedInvoice: SampleInvoice) => {
    const convertedBundle: QuickBundle = {
      id: 'audit-' + auditedInvoice.id,
      title: 'Audited Procurement: ' + auditedInvoice.title,
      category: 'LV & MV Power Cables & Wires',
      description: 'Items benchmarked from past electrical invoice with projected ' + auditedInvoice.savingsPercent + '% cost savings.',
      icon: 'Zap',
      badge: 'Audited ' + auditedInvoice.savingsPercent + '% Savings',
      estimatedTotalAED: auditedInvoice.supplySouqTotalAED,
      items: auditedInvoice.items.map(it => ({
        description: it.itemDescription,
        specification: it.specMatch,
        preferredBrand: it.matchedBrand,
        quantity: it.quantity,
        unit: it.unit as any,
      }))
    };

    onStartRFQWithAudit(convertedBundle);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Zero-Risk Electrical Price Benchmark</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Electrical Procurement & Cable Invoice Audit
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Most UAE MEP contractors and fit-out companies overpay 15% to 22% on copper power cables, Schneider switchgear, and commercial LED luminaires. Upload your recent bill to see exact wholesale price differences in 30 seconds.
        </p>
      </div>

      {/* Interactive Scanner */}
      <InvoiceAuditScanner onSwitchToRFQ={handleSwitchToRFQ} />

      {/* How the Audit Works in 3 Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="border-slate-200">
          <CardContent className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900">Upload or Select Invoice</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload any PDF bill, photo, or handwritten list from your current building materials or janitorial supplier.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900">Al Quoz & Sharjah Benchmark</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our automated engine cross-checks each SKU against live inventory lists from 50+ verified UAE stockists.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900">Switch & Lock In Savings</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Convert the audited item list into a live SupplySouq RFQ with 1-click to receive binding competitive offers within 24 hours.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};