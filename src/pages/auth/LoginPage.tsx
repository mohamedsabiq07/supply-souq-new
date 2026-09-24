import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { NotFoundPage } from '../public/NotFoundPage';
import { BrandLogo } from '../../components/common/BrandLogo';
import { UserRole } from '../../types';
import { 
  Layers, 
  Lock, 
  User, 
  AlertCircle, 
  Building2, 
  Store, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Clock, 
  KeyRound, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';

interface LoginPageProps {
  onSuccess: (targetView?: string) => void;
  onNavigateToRegister?: () => void;
  isAdminMode?: boolean;
}

const REMEMBER_ME_KEY = 'supplysouq_remembered_auth_v1';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_SECONDS = 60;

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onNavigateToRegister, isAdminMode = false }) => {
  const { signIn, adminLogin, adminLoginWith2FA, triggerCloak, isCloaked } = useAuth();
  const [role, setRole] = useState<UserRole>(isAdminMode ? 'admin' : 'buyer');
  const [identifier, setIdentifier] = useState(isAdminMode ? 'admin' : '');
  const [password, setPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [adminStep, setAdminStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showAdminPin, setShowAdminPin] = useState(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Security brute-force protection
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);

  // Load remembered credentials on mount
  useEffect(() => {
    if (isAdminMode) {
      setRole('admin');
      setIdentifier('admin');
      return;
    }

    try {
      const saved = localStorage.getItem(REMEMBER_ME_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.identifier) {
          setIdentifier(parsed.identifier);
          if (parsed.password) {
            setPassword(parsed.password);
          }
          if (parsed.role && (parsed.role === 'buyer' || parsed.role === 'supplier')) {
            setRole(parsed.role);
          }
          setRememberMe(true);
        }
      }
    } catch (e) {
      console.warn('Failed to parse remembered credentials:', e);
    }
  }, [isAdminMode]);

  // Sync role if isAdminMode prop changes
  useEffect(() => {
    if (isAdminMode) {
      setRole('admin');
      setIdentifier('admin');
    }
  }, [isAdminMode]);

  // Handle countdown timer for rate limiting
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  const isActuallyAdmin = role === 'admin' || isAdminMode;

  // If cloaked honeypot active, display genuine 404 page
  if (isAdminMode && isCloaked) {
    return (
      <NotFoundPage
        attemptedPath="/admin07"
        onNavigateHome={() => {
          window.location.href = '/';
        }}
        onUncloaked={() => {
          setFailedAttempts(0);
          setAdminStep(1);
        }}
      />
    );
  }

  const handleFailedAttempt = (reason: string) => {
    const nextAttempts = failedAttempts + 1;
    setFailedAttempts(nextAttempts);

    const maxAllowed = isActuallyAdmin ? 3 : MAX_FAILED_ATTEMPTS;

    if (nextAttempts >= maxAllowed) {
      if (isActuallyAdmin) {
        triggerCloak();
        setErrorMsg('Security Lockout: 3 Failed attempts reached. Fortress Cloak activated.');
      } else {
        setLockoutSeconds(LOCKOUT_DURATION_SECONDS);
        setErrorMsg(`Security Lockout: Too many failed attempts. Login is temporarily locked for ${LOCKOUT_DURATION_SECONDS} seconds.`);
      }
    } else {
      const remaining = maxAllowed - nextAttempts;
      setErrorMsg(`${reason} (${remaining} attempt${remaining === 1 ? '' : 's'} remaining before system lockdown)`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;

    setErrorMsg('');
    setLoading(true);

    if (isActuallyAdmin) {
      if (adminStep === 1) {
        const enteredPass = (adminPassword || password).trim();
        if (enteredPass === 'Sabiq123') {
          setErrorMsg('');
          setLoading(false);
          setAdminStep(2);
          return;
        } else {
          setLoading(false);
          handleFailedAttempt('Invalid Master Admin Passkey.');
          return;
        }
      } else {
        const res = await adminLoginWith2FA((adminPassword || password).trim(), adminPin.trim());
        setLoading(false);
        if (res.success) {
          setFailedAttempts(0);
          onSuccess('admin-dashboard');
        } else {
          handleFailedAttempt(res.error || 'Invalid 2FA Master Security PIN.');
        }
        return;
      }
    }

    const cleanId = (identifier || '').trim();
    const cleanPass = (password || '').trim();

    const res = await signIn(cleanId, cleanPass);
    setLoading(false);

    if (res.success) {
      setFailedAttempts(0);

      // Save or clear Remember Me
      if (rememberMe) {
        try {
          localStorage.setItem(
            REMEMBER_ME_KEY,
            JSON.stringify({
              identifier: cleanId,
              password: cleanPass,
              role: res.user?.role || res.role || role,
              rememberMe: true,
              savedAt: new Date().toISOString()
            })
          );
        } catch (e) {}
      } else {
        try {
          localStorage.removeItem(REMEMBER_ME_KEY);
        } catch (e) {}
      }

      // Automatically determine user role and route to correct dashboard
      const actualRole = res.user?.role || res.role;
      const target = (cleanId.toLowerCase() === 'admin' || cleanId.toLowerCase() === 'admin@supplysouq.ae' || actualRole === 'admin')
        ? 'admin-dashboard'
        : actualRole === 'supplier'
        ? 'supplier-dashboard'
        : 'buyer-dashboard';

      onSuccess(target);
    } else {
      handleFailedAttempt(res.error || 'Invalid username, email, or password.');
    }
  };

  // Quick fill helper for testing
  const quickFill = (user: string, pass: string, targetRole: UserRole) => {
    setRole(targetRole);
    setIdentifier(user);
    setPassword(pass);
    setErrorMsg('');
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <Card className="p-8 space-y-6 shadow-xl border-slate-200/80 dark:border-white/[0.08]">
        <div className="text-center space-y-3 flex flex-col items-center">
          <div className="pb-1">
            <BrandLogo variant="glow" size="lg" className="hidden dark:flex mx-auto" />
            <BrandLogo variant="full" size="lg" className="flex dark:hidden mx-auto" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isActuallyAdmin ? 'Operations Desk Login' : 'Login to ProcureSouq'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            {isActuallyAdmin
              ? 'Authorized UAE marketplace operator clearance'
              : 'Enter your username or corporate email to access your workspace'}
          </p>
        </div>

        {/* Portal Type Switcher */}
        {!isActuallyAdmin ? (
          <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-white/[0.03] p-1.5 rounded-2xl text-xs font-bold border border-slate-200/60 dark:border-white/[0.08]">
            <button
              type="button"
              onClick={() => {
                setRole('buyer');
                setErrorMsg('');
              }}
              className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                role === 'buyer'
                  ? 'bg-white dark:bg-white/[0.08] shadow-sm font-extrabold text-brand-700 dark:text-brand-300 border border-slate-200/80 dark:border-white/[0.1]'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Contractor / Buyer</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('supplier');
                setErrorMsg('');
              }}
              className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                role === 'supplier'
                  ? 'bg-white dark:bg-white/[0.08] shadow-sm font-extrabold text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-white/[0.1]'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Store className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Verified Supplier</span>
            </button>
          </div>
        ) : (
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl p-2.5 text-center">
            <span className="text-xs font-bold text-rose-900 dark:text-rose-300 flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#cf2e46]" />
              Master Operations Clearance Desk
            </span>
          </div>
        )}

        {/* Lockout Banner */}
        {lockoutSeconds > 0 && (
          <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
            <Clock className="w-4 h-4 shrink-0 text-amber-600 mt-0.5 animate-pulse" />
            <div>
              <p className="font-bold">Security Lockout Active</p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                Too many incorrect login attempts. Please wait <strong className="font-extrabold">{lockoutSeconds} seconds</strong> before retrying.
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && lockoutSeconds === 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {!isActuallyAdmin ? (
            <>
              <div>
                <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" /> Username or Corporate Email *
                </label>
                <input
                  type="text"
                  required
                  disabled={lockoutSeconds > 0 || loading}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. facade, ridout, or name@company.ae"
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-white/[0.1] bg-white dark:bg-[#121215] text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 font-medium disabled:bg-slate-100 dark:disabled:bg-zinc-800 disabled:cursor-not-allowed placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-zinc-300 block mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" /> Password *
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors flex items-center gap-1 text-[11px] font-normal"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Show</span>
                      </>
                    )}
                  </button>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={lockoutSeconds > 0 || loading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full p-2.5 pr-10 rounded-lg border border-slate-300 dark:border-white/[0.1] bg-white dark:bg-[#121215] text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 font-medium disabled:bg-slate-100 dark:disabled:bg-zinc-800 disabled:cursor-not-allowed placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Option */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 dark:border-white/[0.1] text-brand-600 focus:ring-brand-500 cursor-pointer"
                  />
                  <span className="text-xs font-medium">Remember credentials on this device</span>
                </label>
              </div>

              <Button
                type="submit"
                variant={role === 'supplier' ? 'amber' : 'primary'}
                disabled={loading || lockoutSeconds > 0}
                className="w-full py-3 font-extrabold shadow-md text-sm transition-all"
              >
                {loading
                  ? 'Authenticating securely...'
                  : lockoutSeconds > 0
                  ? `Locked (${lockoutSeconds}s)`
                  : `Login to ${role === 'buyer' ? 'Contractor Portal' : 'Supplier Portal'}`}
              </Button>
            </>
          ) : adminStep === 1 ? (
            <>
                  <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#cf2e46] shrink-0" />
                    <span className="text-[11px] font-bold text-rose-900">
                      Step 1 of 2: Master Administrator Passkey
                    </span>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-slate-400" /> Master Admin Passkey
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowAdminPassword(!showAdminPassword)}
                        className="text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1 text-[11px] font-normal"
                        tabIndex={-1}
                      >
                        {showAdminPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{showAdminPassword ? 'Hide' : 'Show'}</span>
                      </button>
                    </label>
                    <div className="relative">
                      <input
                        type={showAdminPassword ? 'text' : 'password'}
                        required
                        autoFocus
                        disabled={lockoutSeconds > 0 || loading}
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Enter administrator passkey"
                        className="w-full p-2.5 pr-10 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500 font-bold text-slate-900 disabled:bg-slate-100"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPassword(!showAdminPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        tabIndex={-1}
                      >
                        {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading || lockoutSeconds > 0}
                    className="w-full py-3 font-bold bg-[#cf2e46] hover:bg-[#b91c33] text-white shadow-md flex items-center justify-center gap-2"
                  >
                    {loading ? 'Verifying clearance...' : lockoutSeconds > 0 ? `Locked (${lockoutSeconds}s)` : 'Verify Passkey & Proceed to PIN →'}
                  </Button>
                </>
              ) : (
                <>
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1">
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="text-xs font-black text-amber-900">
                        Step 2 of 2: 2FA Master Security PIN
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-800">
                      Passkey verified. Enter your confidential 6-digit Master PIN to unlock the control tower.
                    </p>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-slate-400" /> 6-Digit Master Security PIN
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowAdminPin(!showAdminPin)}
                        className="text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1 text-[11px] font-normal"
                        tabIndex={-1}
                      >
                        {showAdminPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{showAdminPin ? 'Hide' : 'Show'}</span>
                      </button>
                    </label>
                    <div className="relative">
                      <input
                        type={showAdminPin ? 'text' : 'password'}
                        required
                        autoFocus
                        maxLength={6}
                        pattern="[0-9]*"
                        inputMode="numeric"
                        disabled={lockoutSeconds > 0 || loading}
                        value={adminPin}
                        onChange={(e) => setAdminPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="••••••"
                        className="w-full p-3 pr-10 rounded-lg border border-slate-300 focus:ring-2 focus:ring-rose-500 text-center font-mono font-black text-2xl tracking-[0.5em] text-slate-900 disabled:bg-slate-100"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPin(!showAdminPin)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        tabIndex={-1}
                      >
                        {showAdminPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 text-center">
                      Default Master PIN: <span className="font-mono font-bold text-slate-700">070707</span>
                    </p>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading || lockoutSeconds > 0 || adminPin.length !== 6}
                    className="w-full py-3 font-bold bg-[#cf2e46] hover:bg-[#b91c33] text-white shadow-md flex items-center justify-center gap-2"
                  >
                    {loading ? 'Authenticating Fort Knox clearance...' : lockoutSeconds > 0 ? `Locked (${lockoutSeconds}s)` : 'Unlock Admin Operations Desk'}
                  </Button>

                  <button
                    type="button"
                    onClick={() => {
                      setAdminStep(1);
                      setAdminPin('');
                      setErrorMsg('');
                    }}
                    className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors py-1"
                  >
                    ← Back to Step 1 (Change Passkey)
                  </button>
                </>
              )}
        </form>

        {/* Quick Test Accounts Pill Bar */}
        {!isActuallyAdmin && (
          <div className="p-3 bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.08] rounded-2xl space-y-1.5">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-zinc-400">
              <Sparkles className="w-3 h-3 text-brand-600 dark:text-brand-400" />
              <span>Quick Test Accounts:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => quickFill('facade', '123456789', 'buyer')}
                className="px-2.5 py-1 bg-white dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/[0.08] hover:border-brand-500 hover:text-brand-700 dark:hover:text-brand-300 rounded-lg font-medium transition-all shadow-2xs text-slate-700 dark:text-zinc-300"
              >
                🏢 Facade Lighting (Buyer)
              </button>
              <button
                type="button"
                onClick={() => quickFill('ridout', '123456789', 'supplier')}
                className="px-2.5 py-1 bg-white dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/[0.08] hover:border-amber-500 hover:text-amber-800 dark:hover:text-amber-300 rounded-lg font-medium transition-all shadow-2xs text-slate-700 dark:text-zinc-300"
              >
                🏭 Ridout Pest (Supplier)
              </button>
              <button
                type="button"
                onClick={() => quickFill('tariq', 'password123', 'buyer')}
                className="px-2.5 py-1 bg-white dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/[0.08] hover:border-brand-500 hover:text-brand-700 dark:hover:text-brand-300 rounded-lg font-medium transition-all shadow-2xs text-slate-500 dark:text-zinc-400"
              >
                ⚡ Apex MEP
              </button>
            </div>
          </div>
        )}

        {/* Security Trust Badge */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-zinc-500">
          <ShieldCheck className="w-3.5 h-3.5 text-[#cf2e46]" />
          <span>256-bit TLS Encrypted Session • UAE Compliance Standards</span>
        </div>

        {!isActuallyAdmin ? (
          <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] text-xs text-slate-500 dark:text-zinc-400 flex flex-col items-center gap-2">
            <div>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  if (onNavigateToRegister) onNavigateToRegister();
                  else onSuccess();
                }}
                className="text-brand-600 dark:text-brand-400 font-bold hover:underline"
              >
                Sign Up as Contractor or Supplier
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center pt-3 border-t border-slate-100 dark:border-white/[0.06] text-xs text-slate-500 dark:text-zinc-400">
            <button
              type="button"
              onClick={() => {
                setRole('buyer');
                setErrorMsg('');
              }}
              className="text-brand-600 dark:text-brand-400 font-bold hover:underline"
            >
              ← Return to Contractor & Supplier Login
            </button>
          </div>
        )}
      </Card>
    </div>
  );
};