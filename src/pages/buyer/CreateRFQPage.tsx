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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-5">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate(isAuthenticated ? 'buyer-dashboard' : 'home')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            {isAuthenticated ? 'Back to Workspace' : 'Back to Home'}
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Create Material Requirement / RFQ
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
              Specify line items, upload BOQ sheets, and broadcast directly to verified UAE stockists.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Fastest 5 Bids Guaranteed</span>
          </span>
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