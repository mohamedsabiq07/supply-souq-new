import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Building2, Store, ShieldAlert, LogOut } from 'lucide-react';

interface DemoRoleBarProps {
  onNavigate?: (view: string) => void;
}

export const DemoRoleBar: React.FC<DemoRoleBarProps> = ({ onNavigate }) => {
  const { isAuthenticated, role, currentUser, currentCompany, logout } = useAuth();
  const { isSupabaseConnected } = useAppData();

  // If user is logged out, show absolutely NO private portal or company information
  if (!isAuthenticated || !currentUser || !currentCompany || !role) {
    return null;
  }

  const handleLogout = () => {
    logout();
    if (onNavigate) onNavigate('home');
  };

  return (
    <div className="bg-slate-900 text-white text-xs border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live Cloud DB</span>
        </span>

        <span className="hidden sm:inline text-slate-400">|</span>

        {role === 'buyer' ? (
          <span className="inline-flex items-center gap-1.5 text-brand-300 font-bold bg-brand-950/60 px-2 py-0.5 rounded border border-brand-800">
            <Building2 className="w-3.5 h-3.5 text-brand-400" />
            <span>CONTRACTOR PORTAL:</span>
            <strong className="text-white font-extrabold">{currentCompany.name}</strong> ({currentCompany.emirate})
          </span>
        ) : role === 'supplier' ? (
          <span className="inline-flex items-center gap-1.5 text-amber-300 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
            <Store className="w-3.5 h-3.5 text-amber-400" />
            <span>VERIFIED SUPPLIER PORTAL:</span>
            <strong className="text-white font-extrabold">{currentCompany.name}</strong> ({currentCompany.emirate})
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-emerald-300 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
            <span>ADMIN OPERATIONS DESK</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-slate-400 text-[11px] hidden md:inline">
          Active User: <strong className="text-white">{currentUser.fullName}</strong>
        </span>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1 bg-slate-800 hover:bg-red-950/50 text-slate-300 hover:text-red-300 px-2.5 py-1 rounded-md border border-slate-700 hover:border-red-800/50 transition-colors font-bold text-xs"
        >
          <LogOut className="w-3 h-3" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
