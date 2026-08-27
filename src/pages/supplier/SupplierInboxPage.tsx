import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { RFQCard } from '../../components/rfq/RFQCard';
import { Search } from 'lucide-react';

interface SupplierInboxPageProps {
  onNavigate: (view: string, params?: any) => void;
}

export const SupplierInboxPage: React.FC<SupplierInboxPageProps> = ({ onNavigate }) => {
  const { rfqs } = useAppData();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const openRFQs = rfqs.filter(r => r.status !== 'draft');

  const filtered = openRFQs.filter(r => {
    const matchesCategory = categoryFilter === 'All' || r.category.includes(categoryFilter);
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.rfqNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.deliveryEmirate.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Live Contractor RFQ Inbox</h1>
        <p className="text-xs text-slate-500 mt-0.5">Direct material requirements from UAE construction companies waiting for quotation.</p>
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
          {['All', 'Electrical', 'MEP', 'Safety'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

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
    </div>
  );
};