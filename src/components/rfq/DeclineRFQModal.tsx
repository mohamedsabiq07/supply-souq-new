import React, { useState } from 'react';
import { RFQ } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { 
  XCircle, 
  AlertCircle, 
  PackageX, 
  Clock, 
  MapPin, 
  BadgeDollarSign, 
  ShieldAlert, 
  FileQuestion, 
  TrendingDown
} from 'lucide-react';

interface DeclineRFQModalProps {
  isOpen: boolean;
  onClose: () => void;
  rfq: RFQ | null;
  onConfirmDecline: (rfqId: string, reason: string, notes?: string) => void;
}

export const DECLINE_REASONS = [
  {
    id: 'out_of_stock',
    label: 'Out of Stock / Inventory Depleted in UAE Warehouse',
    description: 'Requested cable sizes, breakers, or containment items are currently not in local stock.',
    icon: PackageX,
  },
  {
    id: 'brand_unavailable',
    label: 'Brand / Spec Not Stocked (e.g. Ducab, Schneider, Furse)',
    description: 'We do not distribute the consultant-approved brand specified in this RFQ.',
    icon: ShieldAlert,
  },
  {
    id: 'lead_time',
    label: 'Delivery Lead Time Too Tight / Urgent Schedule',
    description: 'Cannot manufacture or deliver to job site within the required delivery date.',
    icon: Clock,
  },
  {
    id: 'location_limit',
    label: 'Delivery Site Outside Standard Logistics Area',
    description: 'Project location is outside our standard Dubai, Sharjah, or Northern Emirates transport routes.',
    icon: MapPin,
  },
  {
    id: 'below_mov',
    label: 'Order Quantity Below Minimum Order Value (MOV)',
    description: 'Total volume is below our wholesale dispatch threshold.',
    icon: TrendingDown,
  },
  {
    id: 'payment_terms',
    label: 'Requested Credit / Payment Terms Incompatible',
    description: 'Unable to support requested 30/60 days credit or milestone structure.',
    icon: BadgeDollarSign,
  },
  {
    id: 'price_volatility',
    label: 'Copper / Raw Material Price Volatility',
    description: 'Rapid LME copper/metal fluctuations prevent holding fixed prices at this time.',
    icon: AlertCircle,
  },
  {
    id: 'other',
    label: 'Other Commercial or Technical Reason',
    description: 'Specific reason detailed in remarks below.',
    icon: FileQuestion,
  },
];

export const DeclineRFQModal: React.FC<DeclineRFQModalProps> = ({
  isOpen,
  onClose,
  rfq,
  onConfirmDecline,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>(DECLINE_REASONS[0].label);
  const [customNotes, setCustomNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!rfq) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmDecline(rfq.id, selectedReason, customNotes.trim() || undefined);
      setIsSubmitting(false);
      onClose();
    }, 200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Decline RFQ / Pass on Quoting"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300">
              {rfq.rfqNumber}
            </span>
            <span className="text-amber-800 font-semibold">{rfq.deliveryEmirate}</span>
          </div>
          <h4 className="text-sm font-bold text-slate-900">{rfq.title}</h4>
          <p className="text-xs text-slate-600">
            Project: <strong className="text-slate-800">{rfq.projectName}</strong> • {rfq.items?.length || 0} Material Items
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-900 block">
            Select Reason for Declining this RFQ:
          </label>
          <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-1">
            {DECLINE_REASONS.map((opt) => {
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
                    name="declineReason"
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

        {/* Additional Optional Note */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 block">
            Additional Remarks / Notes for Buyer (Optional):
          </label>
          <textarea
            rows={2}
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            placeholder="e.g. We can supply alternative 4Cx25mm² Oman Cables from stock if acceptable to consultant..."
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
            Cancel & Keep in Inbox
          </Button>

          <Button
            type="submit"
            variant="outline"
            size="sm"
            disabled={isSubmitting}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold border-rose-600 shadow-sm"
            leftIcon={<XCircle className="w-4 h-4" />}
          >
            {isSubmitting ? 'Declining...' : 'Confirm & Decline RFQ'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
