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
  TrendingUp,
  Award
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const { role, currentUser, currentCompany } = useAuth();
  const { rfqs, quotations, purchaseOrders, messages, verifications } = useAppData();

  const buyerRFQs = rfqs.filter(r => r.buyerCompanyId === currentCompany.id || role === 'admin');
  const evaluatingRFQs = rfqs.filter(r => r.status === 'evaluating' || r.quotesCount > 0);
  const activeOrders = purchaseOrders.length;
  const pendingVerifications = verifications.filter(v => v.status === 'pending').length;

  const buyerLinks = [
    { id: 'buyer-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'buyer-rfqs', label: 'My RFQs', icon: FileText, count: buyerRFQs.length },
    { id: 'buyer-compare-quick', label: 'Quotation Comparison', icon: GitCompare, count: evaluatingRFQs.length, highlight: true },
    { id: 'invoice-audit', label: 'Invoice Cost Audit', icon: TrendingUp },
    { id: 'buyer-orders', label: 'Purchase Orders', icon: Package, count: activeOrders },
    { id: 'suppliers', label: 'UAE Suppliers Directory', icon: Store },
    { id: 'buyer-messages', label: 'Messages', icon: MessageSquare },
  ];

  const supplierLinks = [
    { id: 'supplier-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'supplier-inbox', label: 'RFQ Inbox (Live)', icon: FileText, count: rfqs.filter(r => r.status !== 'draft').length, highlight: true },
    { id: 'supplier-quotes', label: 'My Quotations', icon: GitCompare, count: quotations.filter(q => q.supplierCompanyId === currentCompany.id).length },
    { id: 'supplier-orders', label: 'Orders & POs', icon: Package, count: purchaseOrders.filter(p => p.supplierCompanyId === currentCompany.id).length },
    { id: 'supplier-profile', label: 'Company & Trade License', icon: Building2 },
    { id: 'supplier-messages', label: 'Messages', icon: MessageSquare },
  ];

  const adminLinks = [
    { id: 'admin-dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'admin-verifications', label: 'Trade License Verification', icon: ShieldCheck, count: pendingVerifications, highlight: true },
    { id: 'admin-rfqs', label: 'Global RFQs Monitor', icon: FileText, count: rfqs.length },
    { id: 'suppliers', label: 'Suppliers Directory', icon: Store },
  ];

  const links = role === 'buyer' ? buyerLinks : role === 'supplier' ? supplierLinks : adminLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 shrink-0 hidden md:flex flex-col justify-between p-4 min-h-[calc(100vh-6.5rem)]">
      <div>
        {/* User Card */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-5">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={currentUser.fullName}
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate">{currentUser.fullName}</p>
              <p className="text-[11px] text-slate-500 truncate">{currentCompany.name}</p>
              <span className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded mt-0.5 ${
                role === 'buyer' ? 'bg-brand-100 text-brand-800' : role === 'supplier' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {role === 'buyer' ? 'Contractor Buyer' : role === 'supplier' ? 'Verified Trader' : 'Marketplace Admin'}
              </span>
            </div>
          </div>
        </div>

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
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </div>
                {link.count !== undefined && link.count > 0 && (
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                      isActive
                        ? 'bg-brand-500 text-white'
                        : link.highlight
                        ? 'bg-amber-500 text-slate-950 animate-pulse'
                        : 'bg-slate-100 text-slate-700'
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

      {/* UAE Procurement Advisory Box */}
      <div className="p-3 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl text-xs space-y-2 mt-6">
        <div className="flex items-center gap-1.5 text-amber-400 font-bold">
          <Award className="w-4 h-4" />
          <span>UAE Compliance</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          All suppliers undergo valid UAE Department of Economy & Tourism (DET) Trade License verification.
        </p>
      </div>
    </aside>
  );
};
