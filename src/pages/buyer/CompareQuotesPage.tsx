import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { QuotationComparisonTable } from '../../components/rfq/QuotationComparisonTable';
import { Button } from '../../components/ui/Button';
import { formatAED } from '../../lib/utils';
import { ArrowLeft, GitCompare, CheckCircle2, Sparkles, ShieldCheck, Layers, Clock, AlertCircle } from 'lucide-react';

interface CompareQuotesPageProps {
  rfqId?: string;
  onNavigate: (view: string, params?: any) => void;
}

export const CompareQuotesPage: React.FC<CompareQuotesPageProps> = ({ rfqId, onNavigate }) => {
  const { currentCompany } = useAuth();
  const { rfqs, quotations, awardQuotation, isRFQExtendedUnlocked } = useAppData();

  const myRFQs = rfqs
    .filter(r => r.buyerCompanyId === currentCompany.id)
    .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());
  
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
      <div className="text-center py-16 bg-white dark:bg-[#0c0c0e] rounded-2xl border border-slate-200 dark:border-zinc-800 p-8 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
          <GitCompare className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <p className="text-base font-bold text-slate-900 dark:text-white">No RFQs Available</p>
          <p className="text-xs text-slate-500 dark:text-zinc-400">You haven't posted any material RFQs yet. Post an RFQ to start receiving supplier quotes.</p>
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
      {/* Top Header & Back Button */}
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
              Quotation Comparison Center
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Select which material RFQ you want to compare, evaluate supplier bids side-by-side, and award Purchase Orders.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>UAE DET Verified Stockists</span>
        </div>
      </div>

      {/* RFQ SELECTOR SECTION: "Which RFQ do you want to compare?" */}
      <div className="bg-white dark:bg-[#0c0c0e] p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-subtle space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-400 text-xs font-extrabold flex items-center justify-center border border-brand-200 dark:border-brand-800">
              1
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Which RFQ would you like to compare?
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
            {myRFQs.length} Total RFQ{myRFQs.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Interactive RFQ Selection Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          {myRFQs.map((rfq) => {
            const isSelected = rfq.id === targetRFQ.id;
            const isUnlocked = isRFQExtendedUnlocked(rfq.id);
            const quotesCount = quotations.filter(q => q.rfqId === rfq.id || q.rfqNumber === rfq.rfqNumber).length;
            const rfqQuotesPool = quotations.filter(q => q.rfqId === rfq.id || q.rfqNumber === rfq.rfqNumber);
            const visibleQuotes = isUnlocked ? rfqQuotesPool : rfqQuotesPool.slice(0, 5);
            const lowestPrice = visibleQuotes.length > 0 
              ? Math.min(...visibleQuotes.map(q => q.grandTotalAED)) 
              : null;

            return (
              <button
                key={rfq.id}
                type="button"
                onClick={() => setSelectedRFQId(rfq.id)}
                className={`text-left p-4 rounded-xl border transition-all relative flex flex-col justify-between space-y-3 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-b from-brand-50/50 to-white dark:from-brand-950/30 dark:to-[#121215] border-brand-500 dark:border-brand-500 ring-2 ring-brand-500/20 shadow-md'
                    : 'bg-slate-50/60 dark:bg-[#121215] border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 hover:bg-white dark:hover:bg-zinc-900'
                }`}
              >
                <div className="space-y-1.5 w-full">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                      isSelected ? 'bg-brand-500 text-white border-brand-600' : 'bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700'
                    }`}>
                      {rfq.rfqNumber}
                    </span>

                    {isSelected ? (
                      <span className="text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>Active Selection</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500">
                        Click to compare
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1">
                    {rfq.title}
                  </h4>

                  <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">
                    {rfq.projectName} • {rfq.deliveryEmirate}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-zinc-800 flex items-center justify-between w-full text-xs">
                  {quotesCount > 0 ? (
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>
                        {isUnlocked 
                          ? `${quotesCount} Quotes (Unlocked)` 
                          : `${Math.min(quotesCount, 5)} / 5 Quotes${quotesCount > 5 ? ` (+${quotesCount - 5} Locked)` : ''}`}
                      </span>
                    </span>
                  ) : (
                    <span className="text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-700 text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400 dark:text-zinc-500" />
                      <span>0 Quotes • In Bidding</span>
                    </span>
                  )}

                  {lowestPrice !== null && (
                    <span className="font-extrabold text-slate-900 dark:text-white font-mono">
                      From {formatAED(lowestPrice)}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SELECTED RFQ COMPARISON MATRIX BANNER & TABLE */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-400 text-xs font-extrabold flex items-center justify-center border border-brand-200 dark:border-brand-800">
            2
          </span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Side-by-Side Quotation Comparison for <span className="text-brand-700 dark:text-brand-400 font-extrabold">{targetRFQ.rfqNumber}</span>
          </h3>
        </div>

        <QuotationComparisonTable
          rfq={targetRFQ}
          quotations={rfqQuotes}
          onAward={handleAward}
        />
      </div>
    </div>
  );
};