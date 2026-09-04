import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { QuotationForm } from '../../components/supplier/QuotationForm';
import { DeclineRFQModal } from '../../components/rfq/DeclineRFQModal';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, XCircle, Lock, CheckCircle2, Zap } from 'lucide-react';

interface SubmitQuotePageProps {
  rfqId?: string;
  onNavigate: (view: string, params?: any) => void;
}

export const SubmitQuotePage: React.FC<SubmitQuotePageProps> = ({ rfqId, onNavigate }) => {
  const { currentCompany } = useAuth();
  const { rfqs, submitQuotation, declineRFQ, getRFQQuoteCapacity, hasSupplierQuoted, isRFQExtendedUnlocked } = useAppData();
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);

  const targetRFQ = rfqId ? rfqs.find(r => r.id === rfqId || r.rfqNumber === rfqId) : rfqs[0];

  if (!targetRFQ) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
        <p className="text-base font-bold text-slate-900">RFQ Not Found</p>
        <Button variant="primary" className="mt-4" onClick={() => onNavigate('supplier-inbox')}>
          Back to Inbox
        </Button>
      </div>
    );
  }

  if (targetRFQ.status === 'cancelled') {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-rose-200 p-8 space-y-4 max-w-xl mx-auto shadow-sm my-12">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto font-bold text-lg">
          <XCircle className="w-6 h-6 text-rose-600" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900">RFQ Cancelled by Contractor</h2>
          <p className="text-xs text-slate-500">
            RFQ #{targetRFQ.rfqNumber} ("{targetRFQ.title}") has been cancelled by the buyer and is closed for new quotation submissions.
          </p>
        </div>
        <Button variant="primary" onClick={() => onNavigate('supplier-inbox')}>
          Return to Live Inbox
        </Button>
      </div>
    );
  }

  const alreadyQuoted = hasSupplierQuoted(targetRFQ.id, currentCompany.id);
  const capacity = getRFQQuoteCapacity(targetRFQ.id);
  const maxQuotes = isRFQExtendedUnlocked(targetRFQ.id) ? 10 : 5;

  if (alreadyQuoted) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-emerald-200 p-8 space-y-4 max-w-xl mx-auto shadow-sm my-12">
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-300">
            ✅ Quotation Already Submitted
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            You Already Quoted for {targetRFQ.rfqNumber}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
            Your commercial quotation has been delivered to the contractor buyer. The buyer is currently reviewing the first 5 supplier bids.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button variant="outline" onClick={() => onNavigate('supplier-inbox')}>
            Back to Live Inbox
          </Button>
          <Button variant="primary" onClick={() => onNavigate('supplier-quotes')}>
            View My Quotations
          </Button>
        </div>
      </div>
    );
  }

  if (capacity.isCapped) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-amber-200 p-8 space-y-4 max-w-xl mx-auto shadow-sm my-12">
        <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8 text-amber-600" />
        </div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full border border-amber-300">
            <Zap className="w-3.5 h-3.5 text-amber-600" /> Fastest 5 Bids Rule: Quota Full
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Quotation Capacity Reached ({maxQuotes}/{maxQuotes} Slots)
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
            The first {maxQuotes} UAE verified stockists have already submitted competitive quotations for RFQ #{targetRFQ.rfqNumber} ("{targetRFQ.title}"). 
            To ensure prompt decisions for buyers, bidding has closed for this RFQ. Please watch the Live Inbox to be the first to quote on new contractor RFQs!
          </p>
        </div>
        <div className="pt-2">
          <Button variant="primary" onClick={() => onNavigate('supplier-inbox')}>
            Return to Live RFQ Inbox
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = (quoteData: any) => {
    submitQuotation(quoteData);
    onNavigate('supplier-quotes');
  };

  const handleDecline = (rfqIdToDecline: string, reason: string, notes?: string) => {
    declineRFQ(rfqIdToDecline, currentCompany.id, currentCompany.name, reason, notes);
    onNavigate('supplier-inbox');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('supplier-inbox')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Inbox
          </Button>
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Building Commercial Quotation
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Submit Quotation for {targetRFQ.rfqNumber}
            </h1>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsDeclineModalOpen(true)}
          className="text-slate-600 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50/50"
          leftIcon={<XCircle className="w-4 h-4 text-rose-500" />}
        >
          Unable to Quote? Decline RFQ
        </Button>
      </div>

      <QuotationForm
        rfq={targetRFQ}
        supplierCompany={{
          id: currentCompany.id,
          name: currentCompany.name,
          emirate: currentCompany.emirate,
          industrialZone: currentCompany.industrialZone,
          rating: currentCompany.rating,
        }}
        onSubmitQuote={handleSubmit}
        onCancel={() => onNavigate('supplier-inbox')}
      />

      <DeclineRFQModal
        isOpen={isDeclineModalOpen}
        onClose={() => setIsDeclineModalOpen(false)}
        rfq={targetRFQ}
        onConfirmDecline={handleDecline}
      />
    </div>
  );
};