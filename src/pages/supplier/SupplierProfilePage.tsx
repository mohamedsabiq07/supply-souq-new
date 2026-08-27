import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ShieldCheck, Building2, MapPin, Star, Phone, Mail, FileText, CheckCircle2 } from 'lucide-react';

export const SupplierProfilePage: React.FC = () => {
  const { currentCompany, currentUser } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Company & Trade Verification Profile</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage your UAE commercial registration, trade license document, and trading categories.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-extrabold flex items-center justify-center text-lg">
              {currentCompany.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{currentCompany.name}</h3>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> DET Verified
                </span>
              </div>
              <p className="text-xs text-slate-500">{currentCompany.legalName}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 block font-medium">UAE Trade License Number:</span>
              <strong className="text-sm font-mono text-slate-900">{currentCompany.tradeLicenseNumber}</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Industrial Zone & Emirate:</span>
              <strong className="text-sm text-slate-900">{currentCompany.industrialZone}, {currentCompany.emirate}</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Official Phone & Email:</span>
              <p className="text-slate-800 font-semibold">{currentCompany.phone} • {currentCompany.email}</p>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Physical Warehouse / Office:</span>
              <p className="text-slate-800 font-medium">{currentCompany.address}</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-2">Registered Procurement Categories</h4>
            <div className="flex flex-wrap gap-2">
              {currentCompany.categories.map((cat, idx) => (
                <span key={idx} className="bg-brand-50 text-brand-800 font-semibold px-3 py-1 rounded-lg border border-brand-200">
                  ✓ {cat}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-2">Trade License & Verification Document</h4>
            <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-emerald-700" />
                <div>
                  <p className="font-bold text-emerald-950">Commercial_Trade_License_2026.pdf</p>
                  <p className="text-[11px] text-emerald-700">Verified by SupplySouq Compliance Desk on 15 Jan 2026</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-md border border-emerald-300">
                Active & Verified
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};