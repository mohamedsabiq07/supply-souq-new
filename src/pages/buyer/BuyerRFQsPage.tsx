import React, { useState } from 'react';
import { BorderBeam } from 'border-beam';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { RFQCard } from '../../components/rfq/RFQCard';
import { BuyerCancelRFQModal } from '../../components/rfq/BuyerCancelRFQModal';
import { Button } from '../../components/ui/Button';
import { PlusCircle, Search } from 'lucide-react';
import { RFQ } from '../../types';
import { CreateRFQButton } from '../../components/common/CreateRFQButton';

interface BuyerRFQsPageProps {
  onNavigate: (view: string, params?: any) => void;
}

export const BuyerRFQsPage: React.FC<BuyerRFQsPageProps> = ({ onNavigate }) => {
  const { currentCompany } = useAuth();
  const { rfqs, cancelRFQByBuyer } = useAppData();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [targetCancellingRFQ, setTargetCancellingRFQ] = useState<RFQ | null>(null);

  const myRFQs = rfqs.filter(r => r.buyerCompanyId === currentCompany.id);

  const filteredRFQs = myRFQs.filter(r => {
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.rfqNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Requests for Quotation (RFQs)</h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Manage material requirements, active vendor bids, and quote evaluations.</p>
        </div>
        <CreateRFQButton
          size="md"
          onClick={() => onNavigate('create-rfq')}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-gradient-to-b dark:from-[#111114] dark:to-[#0c0c0e] p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-xs">
        <BorderBeam size="line" theme="light" className="flex-1">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by RFQ #, material title, project name..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-white/[0.08] dark:bg-black/30 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </BorderBeam>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {[
            { id: 'all', label: 'All', count: myRFQs.length },
            { id: 'published', label: 'Published', count: myRFQs.filter(r => r.status === 'published').length },
            { id: 'receiving_quotes', label: 'Receiving Quotes', count: myRFQs.filter(r => r.status === 'receiving_quotes').length },
            { id: 'evaluating', label: 'Evaluating', count: myRFQs.filter(r => r.status === 'evaluating').length },
            { id: 'awarded', label: 'Awarded', count: myRFQs.filter(r => r.status === 'awarded').length },
            { id: 'cancelled', label: 'Cancelled', count: myRFQs.filter(r => r.status === 'cancelled').length },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setStatusFilter(item.id)}
              className={`px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap flex items-center gap-1.5 text-xs ${
                statusFilter === item.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-black font-bold shadow-xs'
                  : 'bg-slate-100/80 dark:bg-white/[0.04] text-slate-600 dark:text-zinc-300 hover:bg-slate-200/70 dark:hover:bg-white/[0.08] border border-transparent dark:border-white/[0.04]'
              }`}
            >
              <span>{item.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                statusFilter === item.id
                  ? 'bg-white/20 dark:bg-black/20 text-white dark:text-black font-extrabold'
                  : 'bg-slate-200/80 dark:bg-white/[0.08] text-slate-500 dark:text-zinc-400'
              }`}>
                {item.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {filteredRFQs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRFQs.map((rfq) => (
            <RFQCard
              key={rfq.id}
              rfq={rfq}
              onView={(r) => onNavigate('rfq-detail', { rfqId: r.id })}
              onCompare={(r) => onNavigate('buyer-compare', { rfqId: r.id })}
              onCancelRFQ={(r) => setTargetCancellingRFQ(r)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gradient-to-b dark:from-[#111114] dark:to-[#0c0c0e] rounded-2xl sm:rounded-3xl border border-dashed border-slate-200 dark:border-white/[0.08] p-8">
          <p className="text-sm font-bold text-slate-700 dark:text-zinc-200">No RFQs Found</p>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Try adjusting your search or create your first material requirement.</p>
        </div>
      )}

      {/* Buyer Cancel RFQ Modal */}
      <BuyerCancelRFQModal
        isOpen={!!targetCancellingRFQ}
        onClose={() => setTargetCancellingRFQ(null)}
        rfq={targetCancellingRFQ}
        onConfirmCancel={(rfqId, reason, notes) => {
          cancelRFQByBuyer(rfqId, reason, notes);
        }}
      />
    </div>
  );
};