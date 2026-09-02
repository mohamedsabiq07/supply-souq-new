import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { RFQCard } from '../../components/rfq/RFQCard';
import { Card } from '../../components/ui/Card';
import { Search, Zap, CheckCircle2, ShieldCheck, Filter } from 'lucide-react';

interface SupplierInboxPageProps {
  onNavigate: (view: string, params?: any) => void;
}

export const SupplierInboxPage: React.FC<SupplierInboxPageProps> = ({ onNavigate }) => {
  const { currentCompany } = useAuth();
  const { rfqs } = useAppData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'direct' | 'electrical' | 'plumbing' | 'hvac' | 'chemicals' | 'safety'>('all');

  const openRFQs = rfqs.filter(r => r.status !== 'draft');

  const directCount = openRFQs.filter(r => 
    r.targetSupplierId === currentCompany.id || 
    (r.matchedSupplierCompanyIds && r.matchedSupplierCompanyIds.includes(currentCompany.id))
  ).length;

  const filtered = openRFQs.filter(r => {
    // Tab filter
    if (activeTab === 'direct') {
      const isDirect = r.targetSupplierId === currentCompany.id || (r.matchedSupplierCompanyIds && r.matchedSupplierCompanyIds.includes(currentCompany.id));
      if (!isDirect) return false;
    } else if (activeTab === 'electrical') {
      const isElec = (r.category && r.category.toLowerCase().includes('cable')) || 
                     (r.category && r.category.toLowerCase().includes('electric')) ||
                     (r.title && r.title.toLowerCase().includes('cable'));
      if (!isElec) return false;
    } else if (activeTab === 'plumbing') {
      const isPlumb = (r.category && r.category.toLowerCase().includes('plumb')) || 
                      (r.category && r.category.toLowerCase().includes('pipe')) ||
                      (r.title && r.title.toLowerCase().includes('pipe'));
      if (!isPlumb) return false;
    } else if (activeTab === 'hvac') {
      const isHVAC = (r.category && r.category.toLowerCase().includes('hvac')) || 
                     (r.category && r.category.toLowerCase().includes('duct')) ||
                     (r.title && r.title.toLowerCase().includes('ac'));
      if (!isHVAC) return false;
    } else if (activeTab === 'chemicals') {
      const isChem = (r.category && r.category.toLowerCase().includes('chem')) || 
                     (r.category && r.category.toLowerCase().includes('clean')) ||
                     (r.title && r.title.toLowerCase().includes('clean'));
      if (!isChem) return false;
    } else if (activeTab === 'safety') {
      const isSafety = (r.category && r.category.toLowerCase().includes('safety')) || 
                       (r.category && r.category.toLowerCase().includes('ppe'));
      if (!isSafety) return false;
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
          <h1 className="text-2xl font-extrabold text-slate-900">Live Contractor RFQ Inbox</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Direct material requirements from verified UAE contractors ready for competitive quoting.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>24-Hour SLA Quoting Active</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-subtle">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by cable, breakers, project location, RFQ #..."
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
            All Live RFQs ({openRFQs.length})
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
            onClick={() => setActiveTab('electrical')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'electrical'
                ? 'bg-slate-900 text-white font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ⚡ Electrical
          </button>
          <button
            onClick={() => setActiveTab('plumbing')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'plumbing'
                ? 'bg-slate-900 text-white font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🚿 Plumbing
          </button>
          <button
            onClick={() => setActiveTab('hvac')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'hvac'
                ? 'bg-slate-900 text-white font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ❄️ HVAC
          </button>
          <button
            onClick={() => setActiveTab('chemicals')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'chemicals'
                ? 'bg-slate-900 text-white font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🧪 Chemicals
          </button>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((rfq) => (
            <RFQCard
              key={rfq.id}
              rfq={rfq}
              isSupplierView={true}
              onView={(r) => onNavigate('rfq-detail', { rfqId: r.id })}
              onQuote={(r) => onNavigate('submit-quote', { rfqId: r.id })}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center space-y-4 border-dashed border-2 border-slate-200 bg-white">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto font-bold">
            <Zap className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-base font-bold text-slate-900">No RFQs Matching Filter</h3>
            <p className="text-xs text-slate-500">
              {activeTab === 'direct' 
                ? "No direct RFQs targeted to your company currently. Switch to 'All Live RFQs' to browse open contractor requirements across UAE." 
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
    </div>
  );
};