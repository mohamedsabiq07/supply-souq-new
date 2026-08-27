import React from 'react';
import { useAppData } from '../../context/AppDataContext';
import { QuotationComparisonTable } from '../../components/rfq/QuotationComparisonTable';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, GitCompare, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';

interface CompareQuotesPageProps {
  rfqId?: string;
  onNavigate: (view: string, params?: any) => void;
}

export const CompareQuotesPage: React.FC<CompareQuotesPageProps> = ({ rfqId, onNavigate }) => {
  const { rfqs, quotations, awardQuotation } = useAppData();

  const targetRFQ = rfqId 
    ? rfqs.find(r => r.id === rfqId || r.rfqNumber === rfqId) 
    : rfqs.find(r => r.quotesCount > 0) || rfqs[0];

  if (!targetRFQ) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
        <p className="text-base font-bold text-slate-900">No Active RFQ Selected</p>
        <Button variant="primary" className="mt-4" onClick={() => onNavigate('buyer-rfqs')}>
          View My RFQs
        </Button>
      </div>
    );
  }

  const rfqQuotes = quotations.filter(q => q.rfqId === targetRFQ.id || q.rfqNumber === targetRFQ.rfqNumber);

  const handleAward = (rId: string, qId: string) => {
    const newPO = awardQuotation(rId, qId);
    onNavigate('buyer-orders', { poId: newPO.id });
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle">
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
              <span className="text-xs font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                RFQ #{targetRFQ.rfqNumber}
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>5 Free Quotations Active</span>
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
              {targetRFQ.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="flex items-center gap-1 font-semibold text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> DEWA Approved Verification
          </span>
        </div>
      </div>

      {/* Comparison Matrix Component */}
      <QuotationComparisonTable
        rfq={targetRFQ}
        quotations={rfqQuotes}
        onAward={handleAward}
      />
    </div>
  );
};