import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { UserRole } from '../../types';
import { Shield, Building2, Store, RefreshCw, Zap } from 'lucide-react';

export const DemoRoleBar: React.FC = () => {
  const { role, setRole, currentUser, currentCompany } = useAuth();
  const { resetToDefaults, rfqs, quotations } = useAppData();

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
  };

  return (
    <div className="bg-slate-900 text-white text-xs border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30">
          <Zap className="w-3 h-3 text-amber-400 fill-amber-400" /> DUBAI • SHARJAH • AJMAN
        </span>
        <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Supabase Connected</span>
        </span>
        <span className="hidden sm:inline text-slate-400">|</span>
        <span className="text-slate-300 hidden md:inline">
          Workspace: <strong className="text-white">{currentCompany.name}</strong> ({currentCompany.emirate})
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-slate-400 hidden sm:inline">Switch Role:</span>
        <div className="inline-flex bg-slate-800 rounded-lg p-0.5 border border-slate-700">
          <button
            onClick={() => handleRoleChange('buyer')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all font-medium ${
              role === 'buyer'
                ? 'bg-brand-600 text-white shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Buyer (Contractor)</span>
          </button>

          <button
            onClick={() => handleRoleChange('supplier')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all font-medium ${
              role === 'supplier'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Supplier (Trader)</span>
          </button>

          <button
            onClick={() => handleRoleChange('admin')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all font-medium ${
              role === 'admin'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Desk</span>
          </button>
        </div>

        <button
          onClick={() => {
            if (confirm('Reset demo data back to default UAE construction seed items?')) {
              resetToDefaults();
            }
          }}
          title="Reset Seed Data"
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
