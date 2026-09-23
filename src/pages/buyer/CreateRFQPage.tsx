import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { RFQWizard } from '../../components/rfq/RFQWizard';
import { QuickBundle } from '../../types';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

interface CreateRFQPageProps {
  initialBundle?: QuickBundle | null;
  targetSupplier?: any;
  initialCategory?: string;
  onNavigate: (view: string, params?: any) => void;
}

export const CreateRFQPage: React.FC<CreateRFQPageProps> = ({ 
  initialBundle, 
  targetSupplier,
  initialCategory,
  onNavigate 
}) => {
  const { currentCompany, currentUser, isAuthenticated } = useAuth();
  const { createRFQ } = useAppData();

  const handlePublish = (rfqData: any) => {
    const newRFQ = createRFQ(rfqData);
    onNavigate('buyer-rfqs', { highlightId: newRFQ.id });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Top Action Bar & Title */}
      <div>
        <button
          onClick={() => onNavigate(isAuthenticated ? 'buyer-dashboard' : 'home')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer group mb-3"
        >
          <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.06] group-hover:bg-slate-200 dark:group-hover:bg-white/[0.1] border border-slate-200/60 dark:border-white/[0.08] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
          </span>
          <span>{isAuthenticated ? 'Back to Workspace Dashboard' : 'Back to Home'}</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/[0.08] pb-5">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Create Material Requirement / RFQ
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-normal">
              Specify line items, upload BOQ sheets, and broadcast directly to verified UAE stockists.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-full border border-emerald-200/80 dark:border-emerald-800/60 flex items-center gap-1.5 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Fastest 5 Bids Guaranteed</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Full-Screen RFQ Wizard */}
      <RFQWizard
        buyerCompany={currentCompany ? {
          id: currentCompany.id,
          name: currentCompany.name,
          contactName: currentUser?.fullName || currentCompany.name || 'Purchasing Department',
          phone: currentCompany.phone,
          email: currentCompany.email,
          emirate: currentCompany.emirate,
        } : {
          id: 'guest',
          name: 'New Contractor Buyer',
          contactName: 'Procurement Engineer',
          phone: '',
          email: '',
          emirate: 'Dubai',
        }}
        initialBundle={initialBundle}
        targetSupplier={targetSupplier}
        initialCategory={initialCategory}
        onPublish={handlePublish}
        onCancel={() => onNavigate(isAuthenticated ? 'buyer-dashboard' : 'home')}
      />
    </div>
  );
};