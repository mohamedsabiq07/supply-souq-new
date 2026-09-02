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
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Quotation Comparison Center
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Select which material RFQ you want to compare, evaluate supplier bids side-by-side, and award Purchase Orders.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>UAE DET Verified Stockists</span>
        </div>
      </div>

      {/* RFQ SELECTOR SECTION: "Which RFQ do you want to compare?" */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-700 text-xs font-extrabold flex items-center justify-center border border-brand-200">
              1
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              Which RFQ would you like to compare?
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {myRFQs.length} Total RFQ{myRFQs.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Interactive RFQ Selection Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          {myRFQs.map((rfq) => {
            const isSelected = rfq.id === targetRFQ.id;
            const quotesCount = quotations.filter(q => q.rfqId === rfq.id || q.rfqNumber === rfq.rfqNumber).length;
            const rfqQuotesPool = quotations.filter(q => q.rfqId === rfq.id || q.rfqNumber === rfq.rfqNumber);
            const lowestPrice = rfqQuotesPool.length > 0 
              ? Math.min(...rfqQuotesPool.map(q => q.grandTotalAED)) 
              : null;

            return (
              <button
                key={rfq.id}
                type="button"
                onClick={() => setSelectedRFQId(rfq.id)}
                className={`text-left p-4 rounded-xl border transition-all relative flex flex-col justify-between space-y-3 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-b from-brand-50/50 to-white border-brand-500 ring-2 ring-brand-500/20 shadow-md'
                    : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="space-y-1.5 w-full">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                      isSelected ? 'bg-brand-500 text-white border-brand-600' : 'bg-white text-slate-700 border-slate-200'
                    }`}>
                      {rfq.rfqNumber}
                    </span>

                    {isSelected ? (
                      <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Active Selection</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-400">
                        Click to compare
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-extrabold text-slate-900 line-clamp-1">
                    {rfq.title}
                  </h4>

                  <p className="text-xs text-slate-500 truncate">
                    {rfq.projectName} • {rfq.deliveryEmirate}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between w-full text-xs">
                  {quotesCount > 0 ? (
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{quotesCount} Quotation{quotesCount > 1 ? 's' : ''} Received</span>
                    </span>
                  ) : (
                    <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>0 Quotes • In Bidding</span>
                    </span>
                  )}

                  {lowestPrice !== null && (
                    <span className="font-extrabold text-slate-900 font-mono">
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
          <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-700 text-xs font-extrabold flex items-center justify-center border border-brand-200">
            2
          </span>
          <h3 className="text-sm font-bold text-slate-900">
            Side-by-Side Quotation Comparison for <span className="text-brand-700 font-extrabold">{targetRFQ.rfqNumber}</span>
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