import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { UserRole } from '../../types';
import { Layers } from 'lucide-react';

interface LoginPageProps {
  onSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [role, setRole] = useState<UserRole>('buyer');
  const [email, setEmail] = useState('procurement@apexcontracting.ae');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, role);
    onSuccess();
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <Card className="p-8 space-y-6 shadow-card">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center text-white mx-auto shadow-md">
            <Layers className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Sign in to SupplySouq</h2>
          <p className="text-xs text-slate-500">Access your UAE B2B procurement workspace</p>
        </div>

        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setRole('buyer');
              setEmail('procurement@apexcontracting.ae');
            }}
            className={`py-2 rounded-lg transition-all ${
              role === 'buyer' ? 'bg-white shadow-sm font-bold text-brand-700' : 'text-slate-600'
            }`}
          >
            Buyer
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('supplier');
              setEmail('sales@alnoorelectrical.ae');
            }}
            className={`py-2 rounded-lg transition-all ${
              role === 'supplier' ? 'bg-white shadow-sm font-bold text-amber-900' : 'text-slate-600'
            }`}
          >
            Supplier
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('admin');
              setEmail('admin@supplysouq.ae');
            }}
            className={`py-2 rounded-lg transition-all ${
              role === 'admin' ? 'bg-white shadow-sm font-bold text-emerald-800' : 'text-slate-600'
            }`}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Corporate Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full py-2.5 font-bold">
            Sign In to Portal
          </Button>
        </form>
      </Card>
    </div>
  );
};