import React from 'react';
import { AdminRole } from '../../types';
import {
  ShieldCheck,
  UserCheck,
  FileText,
  DollarSign,
  Lock,
} from 'lucide-react';

interface AdminRBACSelectorProps {
  currentRole: AdminRole;
  onChangeRole: (role: AdminRole) => void;
}

export const AdminRBACSelector: React.FC<AdminRBACSelectorProps> = ({
  currentRole,
  onChangeRole,
}) => {
  const rolesConfig: Record<AdminRole, { title: string; shortTitle: string; desc: string; icon: any; color: string }> = {
    super_admin: {
      title: 'Super Admin',
      shortTitle: 'Super Admin',
      desc: 'Master clearance: Full control over finances, commissions, KYB, user management & system settings.',
      icon: Lock,
      color: 'bg-emerald-500 text-slate-950 font-black shadow-sm',
    },
    procurement_ops: {
      title: 'Procurement Operations Agent',
      shortTitle: 'Procurement Ops',
      desc: 'SLA Tower, 1-Click WhatsApp stockist nudges, manual supplier assignment, and BOQ sanitization.',
      icon: FileText,
      color: 'bg-brand-500 text-white font-black shadow-sm',
    },
    verification_officer: {
      title: 'Verification Officer',
      shortTitle: 'Verification Officer',
      desc: 'DET / DED trade license review, licensed activity verification, and 30-day expiry tracking.',
      icon: ShieldCheck,
      color: 'bg-amber-400 text-slate-950 font-black shadow-sm',
    },
    finance_officer: {
      title: 'Accounts & Finance Officer',
      shortTitle: 'Accounts & Finance',
      desc: 'UAE FTA Tax Invoices (TRN), 1.3% commission tracking (waived during launch), AED 1/day supplier memberships, and PDC maturities.',
      icon: DollarSign,
      color: 'bg-indigo-500 text-white font-black shadow-sm',
    },
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur-md p-3 rounded-xl border border-slate-700/80 shadow-md text-xs space-y-2 w-full">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            Operator Clearance:
          </span>
        </div>

        <div className="inline-flex flex-wrap bg-slate-950/80 p-1 rounded-lg border border-slate-700/80 gap-1">
          {(Object.keys(rolesConfig) as AdminRole[]).map((rKey) => {
            const cfg = rolesConfig[rKey];
            const isSelected = currentRole === rKey;
            const Icon = cfg.icon;
            return (
              <button
                key={rKey}
                type="button"
                onClick={() => onChangeRole(rKey)}
                className={`px-3 py-1.5 rounded-md font-bold transition-all text-xs flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? cfg.color
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
                title={cfg.desc}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cfg.shortTitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1 border-t border-slate-700/40">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
        <span className="truncate">{rolesConfig[currentRole].desc}</span>
      </div>
    </div>
  );
};
