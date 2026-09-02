import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { QuotationComparisonTable } from '../../components/rfq/QuotationComparisonTable';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, GitCompare, CheckCircle2, Sparkles, ShieldCheck, ChevronDown } from 'lucide-react';

interface CompareQuotesPageProps {
  rfqId?: string;
  onNavigate: (view: string, params?: any) => void;
}

export const CompareQuotesPage: React.FC<CompareQuotesPageProps> = ({ rfqId, onNavigate }) => {
  const { currentCompany } = useAuth();
  const { rfqs, quotations, awardQuotation } = useAppData();

  const myRFQs = rfqs.filter(r => r.buyerCompanyId === currentCompany.id);
  
  const [selectedRFQId, setSelectedRFQId] = useState<string>(() => {
    if (rfqId) return rfqId;
    const rfqWithQuotes = myRFQs.find(r => r.quotesCount > 0);
    return rfqWithQuotes ? rfqWithQuotes.id : myRFQs[0]?.id || '';
  });

  const targetRFQ = myRFQs.find(r => r.id === selectedRFQId || r.rfqNumber === selectedRFQId) || 
                    rfqs.find(r => r.id === selectedRFQId || r.rfqNumber === selectedRFQId) || 
                    myRFQs[0];

  if (!targetRFQ) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <GitCompare className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <p className="text-base font-bold text-slate-900">No RFQs Available</p>
          <p className="text-xs text-slate-500">You haven't posted any material RFQs yet. Post an RFQ to start receiving supplier quotes.</p>
        </div>
        <Button variant="primary" onClick={() => onNavigate('create-rfq')}>
          Create Your First RFQ
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
            onClick={() => onNavigate('buyer-dashboard')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Dashboard
          </Button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                RFQ #{targetRFQ.rfqNumber}
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{rfqQuotes.length} Quotation{rfqQuotes.length === 1 ? '' : 's'} Collected</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">
                • {targetRFQ.category}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
              {targetRFQ.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* RFQ Switcher if buyer has multiple RFQs */}
          {myRFQs.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium hidden md:inline">Switch RFQ:</span>
              <select
                value={targetRFQ.id}
                onChange={(e) => setSelectedRFQId(e.target.value)}
                className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {myRFQs.map((r) => {
                  const qCount = quotations.filter(q => q.rfqId === r.id || q.rfqNumber === r.rfqNumber).length;
                  return (
                    <option key={r.id} value={r.id}>
                      {r.rfqNumber} — {r.title.slice(0, 24)}... ({qCount} quotes)
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-slate-500 border-l border-slate-200 pl-3">
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> UAE DET Verified
            </span>
          </div>
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