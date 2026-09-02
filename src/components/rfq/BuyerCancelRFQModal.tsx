import React, { useState } from 'react';
import { RFQ } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { 
  Trash2, 
  AlertTriangle, 
  Building, 
  Layers, 
  DollarSign, 
  CopyX, 
  HelpCircle,
  FileEdit
} from 'lucide-react';

interface BuyerCancelRFQModalProps {
  isOpen: boolean;
  onClose: () => void;
  rfq: RFQ | null;
  onConfirmCancel: (rfqId: string, reason: string, notes?: string) => void;
}

export const BUYER_CANCEL_REASONS = [
  {
    id: 'project_postponed',
    label: 'Project Postponed or Cancelled by Client / Consultant',
    description: 'The overall site project timeline has been pushed back or put on hold.',
    icon: Building,
  },
  {
    id: 'procured_offline',
    label: 'Procured Directly / Offline from Existing Stockist',
    description: 'Material requirement was fulfilled via existing credit account or direct warehouse pickup.',
    icon: DollarSign,
  },
  {
    id: 'spec_changed',
    label: 'Material Specifications or BOQ Changed (Reissuing RFQ)',
    description: 'Cable sizes, breaker ratings, or quantities changed. A revised RFQ will be created.',
    icon: FileEdit,
  },
  {
    id: 'budget_reallocated',
    label: 'Budget / Project Funding Reallocated',
    description: 'Procurement budget for this package has been adjusted or cancelled.',
    icon: Layers,
  },
  {
    id: 'duplicate_mistake',
    label: 'Duplicate RFQ Created by Mistake',
    description: 'Accidentally submitted duplicate requirement.',
    icon: CopyX,
  },
  {
    id: 'pricing_high',
    label: 'Quotation Prices Exceeded Target Project Budget',
    description: 'Received quotes were above the commercial target cost.',
    icon: AlertTriangle,
  },
  {
    id: 'other',
    label: 'Other Reason',
    description: 'Specify your custom reason in the text box below.',
    icon: HelpCircle,
  },
];

export const BuyerCancelRFQModal: React.FC<BuyerCancelRFQModalProps> = ({
  isOpen,
  onClose,
  rfq,
  onConfirmCancel,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>(BUYER_CANCEL_REASONS[0].label);
  const [customNotes, setCustomNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!rfq) return null;

  const isOther = selectedReason === 'Other Reason' || selectedReason.startsWith('Other');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isOther && !customNotes.trim()) {
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      const finalReason = isOther ? `Other: ${customNotes.trim()}` : selectedReason;
      onConfirmCancel(rfq.id, finalReason, customNotes.trim() || undefined);
      setIsSubmitting(false);
      onClose();
    }, 200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cancel & Remove RFQ"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-bold text-rose-900 bg-rose-100/80 px-2 py-0.5 rounded border border-rose-300">
              {rfq.rfqNumber}
            </span>
            <span className="text-rose-800 font-semibold">{rfq.deliveryEmirate}</span>
          </div>
          <h4 className="text-sm font-bold text-slate-900">{rfq.title}</h4>
          <p className="text-xs text-slate-600">
            Project: <strong className="text-slate-800">{rfq.projectName}</strong> • {rfq.items?.length || 0} Material Items • {rfq.quotesCount} Received Quotes
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-900 block">
            Why do you want to cancel / remove this RFQ?
          </label>
          <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-1">
            {BUYER_CANCEL_REASONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedReason === opt.label;
              return (
                <label
                  key={opt.id}
                  onClick={() => setSelectedReason(opt.label)}
                  className={`p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-rose-50/60 border-rose-400 ring-2 ring-rose-400/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="buyerCancelReason"
                    checked={isSelected}
                    onChange={() => setSelectedReason(opt.label)}
                    className="mt-1 text-rose-600 focus:ring-rose-500 shrink-0"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-rose-600' : 'text-slate-400'}`} />
                      <span>{opt.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      {opt.description}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Custom text for 'Other' or additional remarks */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 block">
            {isOther ? 'Please explain your reason *' : 'Additional Notes (Optional):'}
          </label>
          <textarea
            rows={2}
            required={isOther}
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            placeholder={isOther ? 'Type your specific cancellation reason here...' : 'Optional details or notes...'}
            className="w-full p-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Keep RFQ Active
          </Button>

          <Button
            type="submit"
            variant="outline"
            size="sm"
            disabled={isSubmitting || (isOther && !customNotes.trim())}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold border-rose-600 shadow-sm"
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            {isSubmitting ? 'Cancelling...' : 'Confirm & Cancel RFQ'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
