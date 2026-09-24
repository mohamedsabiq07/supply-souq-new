import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import {
  LayoutDashboard,
  FileText,
  GitCompare,
  Package,
  MessageSquare,
  ShieldCheck,
  PlusCircle,
  Building2,
  LogOut,
  ChevronRight,
  Sparkles,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { CreateRFQButton } from '../common/CreateRFQButton';

interface WorkspaceNavProps {
  currentView: string;
  setCurrentView: (view: string, params?: any) => void;
}

export const WorkspaceNav: React.FC<WorkspaceNavProps> = ({ currentView, setCurrentView }) => {
  const { role, currentUser, currentCompany, logout } = useAuth();
  const { rfqs, quotations, purchaseOrders, messages, verifications } = useAppData();

  if (!currentUser || !currentCompany) {
    return null;
  }

  const companyId = currentCompany.id || '';
  const pendingVerifications = verifications.filter(v => v.status === 'pending').length;

  // Buyer counts
  const buyerRFQs = rfqs.filter(r => r.buyerCompanyId === companyId);
  const comparingRFQs = buyerRFQs.filter(r => (r.quotesCount && r.quotesCount > 0) || r.status === 'evaluating' || r.status === 'receiving_quotes');
  const buyerOrders = purchaseOrders.filter(p => p.buyerCompanyId === companyId);
  const buyerUnreadMessages = messages.filter(m => m.recipientCompanyId === companyId && !m.isRead).length;

  // Supplier counts
  const supplierLiveRFQs = rfqs.filter(r => r.status !== 'draft');
  const supplierQuotes = quotations.filter(q => q.supplierCompanyId === companyId);
  const supplierOrders = purchaseOrders.filter(p => p.supplierCompanyId === companyId);
  const supplierUnreadMessages = messages.filter(m => m.recipientCompanyId === companyId && !m.isRead).length;

  const buyerTabs = [
    { id: 'buyer-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'buyer-rfqs', label: 'My RFQs', icon: FileText, count: buyerRFQs.length },
    { id: 'buyer-compare-quick', label: 'Compare Quotes', icon: GitCompare, count: comparingRFQs.length, highlight: true },
    { id: 'buyer-orders', label: 'Purchase Orders', icon: Package, count: buyerOrders.length },
    { id: 'buyer-messages', label: 'Messages', icon: MessageSquare, count: buyerUnreadMessages },
  ];

  const supplierTabs = [
    { id: 'supplier-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'supplier-inbox', label: 'RFQ Inbox (Live)', icon: FileText, count: supplierLiveRFQs.length, highlight: true },
    { id: 'supplier-quotes', label: 'My Quotations', icon: GitCompare, count: supplierQuotes.length },
    { id: 'supplier-orders', label: 'Orders & POs', icon: Package, count: supplierOrders.length },
    { id: 'supplier-messages', label: 'Messages', icon: MessageSquare, count: supplierUnreadMessages },
  ];

  const adminTabs = [
    { id: 'admin-dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'admin-verifications', label: 'License Verification', icon: ShieldCheck, count: pendingVerifications, highlight: true },
    { id: 'admin-rfqs', label: 'Global RFQs Monitor', icon: FileText, count: rfqs.length },
  ];

  const tabs = role === 'buyer' ? buyerTabs : role === 'supplier' ? supplierTabs : adminTabs;

  return (
    <div className="w-full bg-white/95 dark:bg-[#0c0c0e]/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/[0.08] shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4">
        {/* Left: Organization Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/70 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.06] shrink-0">
          <Building2 className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400 shrink-0" />
          <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate max-w-[160px]">
            {currentCompany.name}
          </span>
          <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
            role === 'buyer'
              ? 'bg-rose-100 dark:bg-rose-950/60 text-[#cf2e46] dark:text-rose-300'
              : role === 'supplier'
              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300'
              : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-300'
          }`}>
            {role === 'buyer' ? 'Buyer' : role === 'supplier' ? 'Supplier' : 'Admin'}
          </span>
        </div>

        {/* Center: Horizontal Navigation Tabs (Clean Pill Arrangement) */}
        <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentView === tab.id ||
              (tab.id === 'buyer-rfqs' && (currentView === 'rfq-detail' || currentView === 'create-rfq')) ||
              (tab.id === 'buyer-compare-quick' && (currentView === 'buyer-compare' || currentView === 'buyer-compare-quick')) ||
              (tab.id === 'supplier-inbox' && currentView === 'submit-quote');

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCurrentView(tab.id)}
                className={`relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer select-none active:scale-95 ${
                  isActive
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white dark:text-slate-950' : 'text-slate-400 dark:text-zinc-500'}`} />
                <span>{tab.label}</span>

                {typeof tab.count === 'number' && tab.count > 0 && (
                  <span
                    className={`inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-[10px] font-black font-mono leading-none ${
                      isActive
                        ? 'bg-white/20 dark:bg-black/20 text-white dark:text-black'
                        : tab.highlight
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-slate-200 dark:bg-white/[0.1] text-slate-700 dark:text-zinc-200'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Fast Action CTA */}
        <div className="flex items-center gap-2 shrink-0">
          {role === 'buyer' && (
            <CreateRFQButton
              size="sm"
              onClick={() => setCurrentView('create-rfq')}
            >
              <span className="hidden sm:inline">Post RFQ</span>
              <span className="sm:hidden">RFQ</span>
            </CreateRFQButton>
          )}

          {role === 'supplier' && (
            <button
              type="button"
              onClick={() => setCurrentView('supplier-inbox')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Browse Live RFQs</span>
            </button>
          )}

          <button
            type="button"
            onClick={logout}
            title="Sign Out"
            className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
