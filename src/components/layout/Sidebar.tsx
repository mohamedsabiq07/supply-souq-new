import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import {
  LayoutDashboard,
  FileText,
  GitCompare,
  Package,
  Store,
  MessageSquare,
  ShieldCheck,
  PlusCircle,
  Settings,
  Building2,
  Award,
  User,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const { role, currentUser, currentCompany, logout } = useAuth();
  const { rfqs, quotations, purchaseOrders, messages, verifications } = useAppData();

  const companyId = currentCompany?.id || '';
  const pendingVerifications = verifications.filter(v => v.status === 'pending').length;
  
  // Buyer accurate counts
  const buyerRFQs = rfqs.filter(r => r.buyerCompanyId === companyId);
  const comparingRFQs = buyerRFQs.filter(r => (r.quotesCount && r.quotesCount > 0) || r.status === 'evaluating' || r.status === 'receiving_quotes');
  const buyerOrders = purchaseOrders.filter(p => p.buyerCompanyId === companyId);
  const buyerUnreadMessages = messages.filter(m => m.recipientCompanyId === companyId && !m.isRead).length;

  const buyerLinks = [
    { id: 'buyer-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'buyer-rfqs', label: 'My RFQs', icon: FileText, count: buyerRFQs.length },
    { id: 'buyer-compare-quick', label: 'Compare Quotes', icon: GitCompare, count: comparingRFQs.length, highlight: true },
    { id: 'buyer-orders', label: 'Purchase Orders', icon: Package, count: buyerOrders.length },
    { id: 'buyer-messages', label: 'Messages', icon: MessageSquare, count: buyerUnreadMessages },
    { id: 'buyer-profile', label: 'Company & Profile', icon: User },
  ];

  // Supplier accurate counts
  const supplierLiveRFQs = rfqs.filter(r => r.status !== 'draft');
  const supplierQuotes = quotations.filter(q => q.supplierCompanyId === companyId);
  const supplierOrders = purchaseOrders.filter(p => p.supplierCompanyId === companyId);
  const supplierUnreadMessages = messages.filter(m => m.recipientCompanyId === companyId && !m.isRead).length;

  const supplierLinks = [
    { id: 'supplier-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'supplier-inbox', label: 'RFQ Inbox (Live)', icon: FileText, count: supplierLiveRFQs.length, highlight: true },
    { id: 'supplier-quotes', label: 'My Quotations', icon: GitCompare, count: supplierQuotes.length },
    { id: 'supplier-orders', label: 'Orders & POs', icon: Package, count: supplierOrders.length },
    { id: 'supplier-profile', label: 'Company & Profile', icon: Building2 },
    { id: 'supplier-messages', label: 'Messages', icon: MessageSquare, count: supplierUnreadMessages },
  ];

  const adminLinks = [
    { id: 'admin-dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'admin-verifications', label: 'Trade License Verification', icon: ShieldCheck, count: pendingVerifications, highlight: true },
    { id: 'admin-rfqs', label: 'Global RFQs Monitor', icon: FileText, count: rfqs.length },
    { id: 'admin-profile', label: 'Admin Profile', icon: User },
  ];

  const links = role === 'buyer' ? buyerLinks : role === 'supplier' ? supplierLinks : adminLinks;

  if (!currentUser || !currentCompany) {
    return null;
  }

  return (
    <aside className="w-64 bg-white border-r border-slate-200 shrink-0 hidden md:flex flex-col justify-between p-4 min-h-[calc(100vh-6.5rem)]">
      <div>
        {/* User Card */}
        <button
          type="button"
          onClick={() => setCurrentView(role === 'buyer' ? 'buyer-profile' : role === 'supplier' ? 'supplier-profile' : 'admin-profile')}
          className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100/90 rounded-xl border border-slate-200/80 mb-5 transition-all group cursor-pointer shadow-2xs hover:shadow-xs"
          title="Click to view and edit profile"
        >
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={currentUser.fullName}
              className="w-10 h-10 rounded-full object-cover border border-slate-200 group-hover:ring-2 group-hover:ring-brand-500/30 transition-all"
            />
            <div className="overflow-hidden flex-1">
              <div className="flex items-center justify-between gap-1">
                <p className="text-xs font-bold text-slate-900 truncate group-hover:text-brand-600 transition-colors">{currentUser.fullName}</p>
                <span className="text-[10px] text-slate-400 group-hover:text-brand-500 font-medium">Edit ✎</span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">{currentCompany.name}</p>
              <span className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded mt-0.5 ${
                role === 'buyer' ? 'bg-brand-100 text-brand-800' : role === 'supplier' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {role === 'buyer' ? 'Contractor Buyer' : role === 'supplier' ? 'Verified Trader' : 'Marketplace Admin'}
              </span>
            </div>
          </div>
        </button>

        {/* Action Button */}
        {role === 'buyer' && (
          <button
            onClick={() => setCurrentView('create-rfq')}
            className="w-full mb-5 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-sm transition-all hover:shadow"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New RFQ</span>
          </button>
        )}

        {/* Navigation Items */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = currentView === link.id || (link.id === 'buyer-dashboard' && currentView === 'buyer');
            return (
              <button
                key={link.id}
                onClick={() => setCurrentView(link.id)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-xs transition-all group ${
                  isActive
                    ? 'bg-slate-900 text-white font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1 text-left">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-brand-400' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span className="truncate whitespace-nowrap">{link.label}</span>
                </div>
                {link.count !== undefined && link.count > 0 && (
                  <span
                    className={`shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[10px] font-extrabold rounded-full ${
                      isActive
                        ? 'bg-brand-500 text-white'
                        : link.highlight
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'bg-slate-100 text-slate-700 border border-slate-200/60'
                    }`}
                  >
                    {link.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Sign Out & Session Area */}
      <div className="space-y-3 pt-4 border-t border-slate-200 mt-6">
        <button
          onClick={() => {
            logout();
            setCurrentView('home');
          }}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 bg-red-50/60 hover:bg-red-100/80 hover:text-red-700 transition-colors border border-red-200/60 shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Sign Out</span>
          </div>
          <span className="text-[10px] text-red-400 font-medium">End Session</span>
        </button>

        {/* UAE Compliance Note */}
        <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] text-slate-500 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>UAE Verified Session</span>
          </div>
          <p className="leading-tight text-slate-500">
            {currentCompany.name} ({currentCompany.emirate})
          </p>
        </div>
      </div>
    </aside>
  );
};
