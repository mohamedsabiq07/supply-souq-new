import React from 'react';
import { AdminRole } from '../../types';
import {
  ShieldCheck,
  UserCheck,
  FileText,
  DollarSign,
  Lock
} from 'lucide-react';

interface AdminRBACSelectorProps {
  currentRole: AdminRole;
  onChangeRole: (role: AdminRole) => void;
}

export const AdminRBACSelector: React.FC<AdminRBACSelectorProps> = ({
  currentRole,
  onChangeRole,
}) => {
  const rolesConfig: Record<AdminRole, { title: string; desc: string; icon: any; color: string }> = {
    super_admin: {
      title: 'Super Admin',
      desc: 'Master clearance: Full control over finances, commissions, KYB, user management & system settings.',
      icon: Lock,
      color: 'bg-emerald-600 text-white',
    },
    procurement_ops: {
      title: 'Procurement Operations Agent',
      desc: 'SLA Tower, 1-Click WhatsApp stockist nudges, manual supplier assignment, and BOQ sanitization.',
      icon: FileText,
      color: 'bg-brand-600 text-white',
    },
    verification_officer: {
      title: 'Verification Officer',
      desc: 'DET / DED trade license review, licensed activity verification, and 30-day expiry tracking.',
      icon: ShieldCheck,
      color: 'bg-amber-500 text-slate-950 font-bold',
    },
    finance_officer: {
      title: 'Accounts & Finance Officer',
      desc: 'UAE FTA Tax Invoices (TRN), 3% commission tracking, PDC maturities, and escrow disbursement ledger.',
      icon: DollarSign,
      color: 'bg-indigo-600 text-white',
    },
  };

  return (
    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <UserCheck className="w-3.5 h-3.5 text-brand-600" />
          Operator Clearance:
        </span>
        <div className="inline-flex bg-slate-100 p-1 rounded-lg border border-slate-200">
          {(Object.keys(rolesConfig) as AdminRole[]).map((rKey) => {
            const cfg = rolesConfig[rKey];
            const isSelected = currentRole === rKey;
            return (
              <button
                key={rKey}
                type="button"
                onClick={() => onChangeRole(rKey)}
                className={`px-3 py-1.5 rounded-md font-bold transition-all text-xs flex items-center gap-1 ${
                  isSelected
                    ? cfg.color + ' shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={cfg.desc}
              >
                <span>{cfg.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="text-[11px] text-slate-500 italic max-w-md truncate">
        {rolesConfig[currentRole].desc}
      </div>
    </div>
  );
};
