import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { QuotationForm } from '../../components/supplier/QuotationForm';
import { DeclineRFQModal } from '../../components/rfq/DeclineRFQModal';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, XCircle } from 'lucide-react';

interface SubmitQuotePageProps {
  rfqId?: string;
  onNavigate: (view: string, params?: any) => void;
}

export const SubmitQuotePage: React.FC<SubmitQuotePageProps> = ({ rfqId, onNavigate }) => {
  const { currentCompany } = useAuth();
  const { rfqs, submitQuotation, declineRFQ } = useAppData();
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