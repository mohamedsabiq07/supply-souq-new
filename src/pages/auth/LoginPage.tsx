import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { UserRole } from '../../types';
import { Layers, Lock, Mail, AlertCircle, ShieldAlert, Building2, Store } from 'lucide-react';

interface LoginPageProps {
  onSuccess: () => void;
  onNavigateToRegister?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onNavigateToRegister }) => {
  const { signIn, adminLogin, switchDemoUser } = useAuth();
  const [role, setRole] = useState<UserRole>('buyer');
  const [email, setEmail] = useState('procurement@apexcontracting.ae');
  const [password, setPassword] = useState('password123');
  const [adminPassword, setAdminPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (role === 'admin') {
      const ok = adminLogin(adminPassword);
      setLoading(false);
      if (ok) {
        onSuccess();
      } else {
        setErrorMsg('Invalid Master Admin Key. Only authorized SupplySouq operators may access the Admin Desk.');
      }
      return;
    }

    const res = await signIn(email, password);
    setLoading(false);
    if (res.success) {
      onSuccess();
    } else {
      setErrorMsg(res.error || 'Invalid credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <Card className="p-8 space-y-6 shadow-xl border-slate-200">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600 to-navy-900 flex items-center justify-center text-white mx-auto shadow-md shadow-brand-500/20">
            <Layers className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Sign in to SupplySouq</h2>
          <p className="text-xs text-slate-500">Access your UAE B2B procurement workspace</p>
        </div>

        {/* Portal Type Switcher */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setRole('buyer');
              setEmail('procurement@apexcontracting.ae');
              setErrorMsg('');
            }}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
              role === 'buyer' ? 'bg-white shadow-sm font-extrabold text-brand-700' : 'text-slate-600'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Buyer</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('supplier');
              setEmail('sales@alnoorelectrical.ae');
              setErrorMsg('');
            }}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
              role === 'supplier' ? 'bg-white shadow-sm font-extrabold text-amber-900' : 'text-slate-600'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Supplier</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('admin');
              setErrorMsg('');
            }}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
              role === 'admin' ? 'bg-white shadow-sm font-extrabold text-emerald-800' : 'text-slate-600'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
            <span>Admin Desk</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {role !== 'admin' ? (
            <>
              <div>
                <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Corporate Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.ae"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-slate-400" /> Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 font-medium"
                />
              </div>

              <Button
                type="submit"
                variant={role === 'supplier' ? 'amber' : 'primary'}
                disabled={loading}
                className="w-full py-2.5 font-bold shadow-md"
              >
                {loading ? 'Authenticating...' : `Sign In as ${role === 'buyer' ? 'Contractor / Buyer' : 'Verified Supplier'}`}
              </Button>
            </>
          ) : (
            <>
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-emerald-900 text-xs">
                <p className="font-bold">🔒 Restricted Platform Operations Desk</p>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Only authorized marketplace administrators have clearance to view all registered customers, pricing matrices & verification documents.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-slate-400" /> Master Admin Passkey
                </label>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter administrator passkey"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full py-2.5 font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
              >
                {loading ? 'Verifying clearance...' : 'Unlock Admin Operations Desk'}
              </Button>
            </>
          )}
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          New to SupplySouq?{' '}
          <button
            type="button"
            onClick={onNavigateToRegister || onSuccess}
            className="text-brand-600 font-bold hover:underline"
          >
            Create an Account
          </button>
        </div>
      </Card>
    </div>
  );
};