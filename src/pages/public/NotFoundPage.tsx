import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, KeyRound, AlertTriangle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface NotFoundPageProps {
  attemptedPath?: string;
  onNavigateHome?: () => void;
  onUncloaked?: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  attemptedPath = '/admin07',
  onNavigateHome = () => { window.location.href = '/'; },
  onUncloaked
}) => {
  const { uncloak } = useAuth();
  const [showSecretPrompt, setShowSecretPrompt] = useState(false);
  const [pass, setPass] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSecretUncloak = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = uncloak(pass, pin);
    if (ok) {
      if (onUncloaked) onUncloaked();
      else window.location.reload();
    } else {
      setError('Authorization failed. Access prohibited.');
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-mono flex flex-col justify-between p-6 sm:p-12 select-text">
      <div className="max-w-3xl mx-auto w-full space-y-4 pt-12">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 border-b border-slate-300 pb-3">
          404 Not Found
        </h1>
        <p className="text-sm sm:text-base text-slate-700">
          The requested URL <code className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-slate-900 font-bold">{attemptedPath}</code> was not found on this server.
        </p>
        <p className="text-xs text-slate-500">
          Additionally, a 404 Not Found error was encountered while trying to use an ErrorDocument to handle the request.
        </p>

        <div className="pt-8">
          <button
            onClick={onNavigateHome}
            className="text-xs font-sans font-bold text-slate-600 hover:text-slate-900 underline"
          >
            ← Return to ProcureSouq Homepage
          </button>
        </div>

        {/* Emergency Owner Uncloak Modal / Drawer */}
        {showSecretPrompt && (
          <div className="mt-8 p-5 bg-slate-900 text-white rounded-xl border border-slate-800 shadow-2xl font-sans text-xs space-y-4 max-w-md animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-rose-400 font-bold">
                <Shield className="w-4 h-4" />
                <span>Security Cloak Bypass Terminal</span>
              </div>
              <button
                type="button"
                onClick={() => setShowSecretPrompt(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="p-2.5 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-lg text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSecretUncloak} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Master Admin Password
                </label>
                <input
                  type="password"
                  required
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="Master Passkey"
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  6-Digit Master Security PIN
                </label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••••"
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-center tracking-widest text-base font-bold"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="w-full font-bold bg-rose-600 hover:bg-rose-700 text-white"
              >
                Authenticate & Disarm Cloak
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* Realistic Apache Server Footer with Secret Trigger on double click */}
      <div className="max-w-3xl mx-auto w-full pt-8 border-t border-slate-200 text-xs text-slate-400 flex items-center justify-between">
        <address
          onDoubleClick={() => setShowSecretPrompt(true)}
          className="not-italic cursor-default hover:text-slate-500 transition-colors"
          title="Server Signature"
        >
          Apache/2.4.52 (Ubuntu) Server at supplysouq.ae Port 443
        </address>

        <button
          onClick={() => setShowSecretPrompt(!showSecretPrompt)}
          className="opacity-0 hover:opacity-100 p-1 text-slate-400 transition-opacity"
          title="Owner Terminal"
        >
          <KeyRound className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
