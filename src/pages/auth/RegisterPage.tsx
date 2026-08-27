import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { UserRole, Emirate } from '../../types';

interface RegisterPageProps {
  onSuccess: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [role, setRole] = useState<UserRole>('buyer');
  const [companyName, setCompanyName] = useState('');
  const [tradeLicense, setTradeLicense] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [emirate, setEmirate] = useState<Emirate>('Dubai');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, role);
    onSuccess();
  };

  return (
    <div className="max-w-lg mx-auto py-12 px-4">
      <Card className="p-8 space-y-6 shadow-card">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900">Create Corporate Account</h2>
          <p className="text-xs text-slate-500">Join the UAE B2B Procurement Network</p>
        </div>

        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setRole('buyer')}
            className={`py-2 rounded-lg transition-all ${
              role === 'buyer' ? 'bg-white shadow-sm font-bold text-brand-700' : 'text-slate-600'
            }`}
          >
            I am a Contractor / Buyer
          </button>
          <button
            type="button"
            onClick={() => setRole('supplier')}
            className={`py-2 rounded-lg transition-all ${
              role === 'supplier' ? 'bg-white shadow-sm font-bold text-amber-900' : 'text-slate-600'
            }`}
          >
            I am a Material Supplier
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Company Registered Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Al Wasl Electromechanical LLC"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">UAE Trade License # *</label>
              <input
                type="text"
                required
                placeholder="e.g. CN-1094821"
                value={tradeLicense}
                onChange={(e) => setTradeLicense(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Emirate *</label>
              <select
                value={emirate}
                onChange={(e) => setEmirate(e.target.value as Emirate)}
                className="w-full p-2.5 rounded-lg border border-slate-200 font-semibold"
              >
                <option value="Dubai">Dubai</option>
                <option value="Sharjah">Sharjah</option>
                <option value="Abu Dhabi">Abu Dhabi</option>
                <option value="Ajman">Ajman</option>
                <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                <option value="Fujairah">Fujairah</option>
                <option value="Umm Al Quwain">Umm Al Quwain</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Contact Person Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Tariq Mansour"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Corporate Email *</label>
              <input
                type="email"
                required
                placeholder="procurement@company.ae"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full py-2.5 font-bold">
            Create Account & Verify
          </Button>
        </form>
      </Card>
    </div>
  );
};