import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { RFQCard } from '../../components/rfq/RFQCard';
import { DeclineRFQModal } from '../../components/rfq/DeclineRFQModal';
import { Card } from '../../components/ui/Card';
import { Search, Zap, CheckCircle2, ShieldCheck, Filter, XCircle } from 'lucide-react';
import { RFQ } from '../../types';

interface SupplierInboxPageProps {
  onNavigate: (view: string, params?: any) => void;
}

export const SupplierInboxPage: React.FC<SupplierInboxPageProps> = ({ onNavigate }) => {
  const { currentCompany } = useAuth();
  const { rfqs, declineRFQ, isRFQDeclinedBySupplier, declinedRFQs, hasSupplierQuoted, isRFQExtendedUnlocked } = useAppData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'direct' | 'cables' | 'switchgear' | 'containment' | 'lighting' | 'earthing' | 'solar' | 'declined'>('all');
  const [targetDecliningRFQ, setTargetDecliningRFQ] = useState<RFQ | null>(null);

  const openRFQs = rfqs.filter(r => r.status !== 'draft' && r.status !== 'cancelled');
  const myDeclinedRecords = declinedRFQs.filter(d => d.supplierCompanyId === currentCompany.id);

  const directCount = openRFQs.filter(r => 
    !isRFQDeclinedBySupplier(r.id, currentCompany.id) &&
    (r.targetSupplierId === currentCompany.id || 
    (r.matchedSupplierCompanyIds && r.matchedSupplierCompanyIds.includes(currentCompany.id)))
  ).length;

  const activeRFQsCount = openRFQs.filter(r => !isRFQDeclinedBySupplier(r.id, currentCompany.id)).length;

  const filtered = openRFQs.filter(r => {
    const isDeclined = isRFQDeclinedBySupplier(r.id, currentCompany.id);

    // If declined tab is selected
    if (activeTab === 'declined') {
      if (!isDeclined) return false;
    } else {
      // Hide declined RFQs from active tabs
      if (isDeclined) return false;
    }

    // Tab filter
    if (activeTab === 'direct') {
      const isDirect = r.targetSupplierId === currentCompany.id || (r.matchedSupplierCompanyIds && r.matchedSupplierCompanyIds.includes(currentCompany.id));
      if (!isDirect) return false;
    } else if (activeTab === 'cables') {
      const isCables = (r.category && (r.category.toLowerCase().includes('cable') || r.category.toLowerCase().includes('wire'))) ||
                       (r.title && (r.title.toLowerCase().includes('cable') || r.title.toLowerCase().includes('wire')));
      if (!isCables) return false;
    } else if (activeTab === 'switchgear') {
      const isSwitchgear = (r.category && (r.category.toLowerCase().includes('switchgear') || r.category.toLowerCase().includes('mcb') || r.category.toLowerCase().includes('db') || r.category.toLowerCase().includes('breaker'))) ||
                           (r.title && (r.title.toLowerCase().includes('switchgear') || r.title.toLowerCase().includes('panel') || r.title.toLowerCase().includes('db')));
      if (!isSwitchgear) return false;
    } else if (activeTab === 'containment') {
      const isContainment = (r.category && (r.category.toLowerCase().includes('containment') || r.category.toLowerCase().includes('tray') || r.category.toLowerCase().includes('conduit') || r.category.toLowerCase().includes('ladder'))) ||
                            (r.title && (r.title.toLowerCase().includes('tray') || r.title.toLowerCase().includes('conduit') || r.title.toLowerCase().includes('trunking')));
      if (!isContainment) return false;
    } else if (activeTab === 'lighting') {
      const isLighting = (r.category && (r.category.toLowerCase().includes('lighting') || r.category.toLowerCase().includes('led') || r.category.toLowerCase().includes('fixture'))) ||
                         (r.title && (r.title.toLowerCase().includes('light') || r.title.toLowerCase().includes('led') || r.title.toLowerCase().includes('panel')));
      if (!isLighting) return false;
    } else if (activeTab === 'earthing') {
      const isEarthing = (r.category && (r.category.toLowerCase().includes('earth') || r.category.toLowerCase().includes('lightning') || r.category.toLowerCase().includes('rod'))) ||
                         (r.title && (r.title.toLowerCase().includes('earth') || r.title.toLowerCase().includes('rod') || r.title.toLowerCase().includes('tape')));
      if (!isEarthing) return false;
    } else if (activeTab === 'solar') {
      const isSolar = (r.category && (r.category.toLowerCase().includes('solar') || r.category.toLowerCase().includes('ups') || r.category.toLowerCase().includes('generator') || r.category.toLowerCase().includes('transformer'))) ||
                      (r.title && (r.title.toLowerCase().includes('solar') || r.title.toLowerCase().includes('inverter') || r.title.toLowerCase().includes('generator')));
      if (!isSolar) return false;
    }

    // Search query
    const query = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      (r.title && r.title.toLowerCase().includes(query)) ||
      (r.rfqNumber && r.rfqNumber.toLowerCase().includes(query)) ||
      (r.deliveryEmirate && r.deliveryEmirate.toLowerCase().includes(query)) ||
      (r.category && r.category.toLowerCase().includes(query)) ||
      (r.items && r.items.some(i => i.description.toLowerCase().includes(query)));

    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Live Contractor Electrical RFQ Inbox</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Direct electrical material requirements from verified UAE contractors ready for competitive quoting.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>24-Hour SLA Quoting Active</span>
        </div>
      </div>

      {/* 5-Bids Algorithm Rules Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3.5 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            ⚡
          </div>
          <div>
            <strong className="text-slate-900 font-bold">First 5 Suppliers Rule: </strong>
            <span className="text-slate-600">Only the first 5 stockists to submit a quotation reach the contractor buyer. Once 5 bids are submitted, bidding closes automatically.</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-bold text-amber-900 bg-amber-100/90 px-2.5 py-1 rounded-md border border-amber-300 text-[11px]">
            Fastest Submissions Win
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-subtle">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by cable sizes, switchgear, LED panels, RFQ #..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white font-bold shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Live RFQs ({activeRFQsCount})
          </button>
          <button
            onClick={() => setActiveTab('direct')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'direct'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Matched to You ({directCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('cables')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'cables'
                ? 'bg-slate-900 text-white font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ⚡ Cables & Wires
          </button>
          <button
            onClick={() => setActiveTab('switchgear')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'switchgear'
                ? 'bg-slate-900 text-white font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🔌 Switchgear & DBs
          </button>
          <button
            onClick={() => setActiveTab('containment')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'containment'
                ? 'bg-slate-900 text-white font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🛡️ Trays & Conduits
          </button>
          <button
            onClick={() => setActiveTab('lighting')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'lighting'
                ? 'bg-slate-900 text-white font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            💡 LED Lighting
          </button>
          <button
            onClick={() => setActiveTab('earthing')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'earthing'
                ? 'bg-slate-900 text-white font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ⚡ Earthing & Lightning
          </button>
          <button
            onClick={() => setActiveTab('solar')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'solar'
                ? 'bg-slate-900 text-white font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ☀️ Solar & Power
          </button>
          {myDeclinedRecords.length > 0 && (
            <button
              onClick={() => setActiveTab('declined')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-1 ${
                activeTab === 'declined'
                  ? 'bg-rose-900 text-white font-bold shadow-xs'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>Declined ({myDeclinedRecords.length})</span>
            </button>
          )}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((rfq) => {
            const isDeclined = isRFQDeclinedBySupplier(rfq.id, currentCompany.id);
            const decRec = myDeclinedRecords.find(d => d.rfqId === rfq.id);
            const supplierHasQuoted = hasSupplierQuoted(rfq.id, currentCompany.id);
            const maxQuotes = isRFQExtendedUnlocked(rfq.id) ? 10 : 5;
            return (
              <RFQCard
                key={rfq.id}
                rfq={rfq}
                isSupplierView={true}
                isDeclined={isDeclined}
                declineReason={decRec?.reason}
                supplierHasQuoted={supplierHasQuoted}
                maxQuotes={maxQuotes}
                onView={(r) => onNavigate('rfq-detail', { rfqId: r.id })}
                onQuote={(r) => onNavigate('submit-quote', { rfqId: r.id })}
                onDecline={(r) => setTargetDecliningRFQ(r)}
              />
            );
          })}
        </div>
      ) : (
        <Card className="p-12 text-center space-y-4 border-dashed border-2 border-slate-200 bg-white">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto font-bold">
            <Zap className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-base font-bold text-slate-900">
              {activeTab === 'declined' ? 'No Declined RFQs' : 'No RFQs Matching Filter'}
            </h3>
            <p className="text-xs text-slate-500">
              {activeTab === 'direct' 
                ? "No direct RFQs targeted to your company currently. Switch to 'All Live RFQs' to browse open contractor requirements across UAE." 
                : activeTab === 'declined'
                ? "You haven't declined any contractor RFQs yet. Declined RFQs will appear here for your records."
                : "Try clearing your search or switching to another category tab."}
            </p>
          </div>
          {activeTab !== 'all' && (
            <button
              onClick={() => {
                setActiveTab('all');
                setSearchTerm('');
              }}
              className="text-xs font-bold text-brand-600 hover:underline"
            >
              Show All Live RFQs
            </button>
          )}
        </Card>
      )}

      {/* Decline RFQ Modal */}
      <DeclineRFQModal
        isOpen={!!targetDecliningRFQ}
        onClose={() => setTargetDecliningRFQ(null)}
        rfq={targetDecliningRFQ}
        onConfirmDecline={(rfqId, reason, notes) => {
          declineRFQ(rfqId, currentCompany.id, currentCompany.name, reason, notes);
        }}
      />
    </div>
  );
};