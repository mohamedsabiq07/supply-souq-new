import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { RFQWizard } from '../../components/rfq/RFQWizard';
import { QuickBundle } from '../../types';

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
  const { currentCompany, currentUser } = useAuth();
  const { createRFQ } = useAppData();

  const handlePublish = (rfqData: any) => {
    const newRFQ = createRFQ(rfqData);
    onNavigate('buyer-rfqs', { highlightId: newRFQ.id });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Create Material Requirement / RFQ</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Select a 1-click package, snap a photo of your handwritten list, or customize line items.
        </p>
      </div>

      <RFQWizard
        buyerCompany={{
          id: currentCompany.id,
          name: currentCompany.name,
          contactName: currentUser?.fullName || currentCompany.name || 'Purchasing Department',
          phone: currentCompany.phone,
          email: currentCompany.email,
          emirate: currentCompany.emirate,
        }}
        initialBundle={initialBundle}
        targetSupplier={targetSupplier}
        initialCategory={initialCategory}
        onPublish={handlePublish}
        onCancel={() => onNavigate('buyer-dashboard')}
      />
    </div>
  );
};