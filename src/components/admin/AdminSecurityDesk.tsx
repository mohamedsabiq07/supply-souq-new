import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  KeyRound,
  Clock,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Eye,
  EyeOff,
  UserCheck,
  Radio
} from 'lucide-react';

export const AdminSecurityDesk: React.FC = () => {
  const {
    masterPIN,
    updateMasterPIN,
    lockDesk,
    panicLock,
    securityLogs,
    clearSecurityLogs,
    isCloaked,
    triggerCloak,
    uncloak
  } = useAuth();

  // PIN Form State
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState('');
  const [showCurrentPin, setShowCurrentPin] = useState(false);

  // Filter for security logs
  const [logFilter, setLogFilter] = useState<'all' | 'info' | 'warning' | 'critical'>('all');

  const handleChangePIN = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    setPinSuccess('');

    if (newPin !== confirmPin) {
      setPinError('New PIN and confirmation PIN do not match.');
      return;
    }

    if (!/^\d{6}$/.test(newPin)) {
      setPinError('PIN must be exactly 6 numeric digits.');
      return;
    }

    const res = updateMasterPIN(oldPin, newPin);
    if (res.success) {
      setPinSuccess('Master 2FA PIN updated successfully.');
      setOldPin('');
      setNewPin('');
      setConfirmPin('');
    } else {
      setPinError(res.error || 'Failed to update PIN.');
    }
  };

  const filteredLogs = securityLogs.filter((log) => {
    if (logFilter === 'all') return true;
    return log.severity === logFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-black via-rose-950/40 to-black text-white p-6 rounded-2xl border border-rose-900/40 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-rose-400" />
                Fort Knox Security & Intrusion Sentinel
              </h2>
              <span className="bg-rose-500/20 text-rose-300 font-bold text-[10px] px-2.5 py-0.5 rounded border border-rose-500/30">
                2FA & Cloak Armed
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Air-gapped administrative protection. Manage your 6-digit Master Security PIN, inspect intrusion attempts, monitor real-time session timeouts, or trigger emergency lockouts.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={lockDesk}
              className="bg-slate-900/80 hover:bg-slate-800 text-amber-300 border-amber-500/40 text-xs font-bold"
            >
              <Lock className="w-3.5 h-3.5 mr-1.5" />
              Lock Screen Now
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={panicLock}
              className="bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-lg shadow-rose-950"
            >
              <AlertTriangle className="w-4 h-4 mr-1.5" />
              Panic & Wipe Session
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Security Defense KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: 2FA Master PIN */}
        <Card className="border-emerald-200 bg-emerald-50/40">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-emerald-600" />
                2FA Master PIN
              </span>
              <span className="bg-emerald-200 text-emerald-900 text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                ACTIVE
              </span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="text-2xl font-black text-slate-900 font-mono tracking-widest">
                {showCurrentPin ? masterPIN : '••••••'}
              </div>
              <button
                type="button"
                onClick={() => setShowCurrentPin(!showCurrentPin)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-emerald-100/60 transition-colors"
                title={showCurrentPin ? 'Hide PIN' : 'Reveal PIN'}
              >
                {showCurrentPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">
              Required alongside password for every admin login session.
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Cloak Honeypot */}
        <Card className="border-indigo-200 bg-indigo-50/40">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-indigo-600" />
                Honeypot Cloaking
              </span>
              <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${isCloaked ? 'bg-rose-200 text-rose-900' : 'bg-indigo-200 text-indigo-900'}`}>
                {isCloaked ? 'CLOAKED (404)' : 'ARMED'}
              </span>
            </div>
            <div className="text-xl font-extrabold text-slate-900">
              {isCloaked ? '30-Min Lock Active' : '3-Strike Cloak'}
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">
              Failed attempts automatically cloak the URL as a realistic dead 404 error page.
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Inactivity Guard */}
        <Card className="border-amber-200 bg-amber-50/40">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                Inactivity Guard
              </span>
              <span className="bg-amber-200 text-amber-900 text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                15 MINS
              </span>
            </div>
            <div className="text-xl font-extrabold text-slate-900">
              Auto-Lock Active
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">
              Desk blurs and locks automatically if idle for 15 minutes to prevent local walk-bys.
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Audit Sentinel */}
        <Card className="border-purple-200 bg-purple-50/40">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                Audit Sentinel
              </span>
              <span className="bg-purple-200 text-purple-900 text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                {securityLogs.length} LOGS
              </span>
            </div>
            <div className="text-xl font-extrabold text-slate-900">
              Continuous Logging
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">
              All logins, PIN updates, and failed strikes recorded with browser telemetry.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Change Master PIN Section */}
      <Card>
        <CardHeader className="py-3 px-5 border-b bg-slate-50/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Update 6-Digit Master 2FA Security PIN
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">Only authorized master operator can change this</span>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <form onSubmit={handleChangePIN} className="max-w-xl space-y-4">
            {pinError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{pinError}</span>
              </div>
            )}
            {pinSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{pinSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current PIN *
                </label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  value={oldPin}
                  onChange={(e) => setOldPin(e.target.value)}
                  placeholder="••••••"
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono text-center tracking-widest text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  New 6-Digit PIN *
                </label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="••••••"
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono text-center tracking-widest text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm New PIN *
                </label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="••••••"
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono text-center tracking-widest text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
              >
                Save New Master PIN
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security Intrusion & Audit Log Table */}
      <Card>
        <CardHeader className="p-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Security Intrusion & Access Audit Trail ({filteredLogs.length})
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={logFilter}
                onChange={(e) => setLogFilter(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 font-medium"
              >
                <option value="all">All Events</option>
                <option value="critical">Critical Intrusion</option>
                <option value="warning">Warnings</option>
                <option value="info">Informational</option>
              </select>

              <Button
                variant="outline"
                size="sm"
                onClick={clearSecurityLogs}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Clear Logs
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Security Action</th>
                <th className="py-3 px-4">Details & Client Telemetry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded ${
                        log.severity === 'critical'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : log.severity === 'warning'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {log.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-[11px] max-w-xl truncate">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
