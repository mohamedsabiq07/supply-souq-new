import React, { useState, useMemo } from 'react';
import { RFQ, AdminAuditLog } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatDate } from '../../lib/utils';
import {
  ShieldAlert,
  Lock,
  Unlock,
  AlertTriangle,
  EyeOff,
  Eye,
  CheckCircle2,
  Clock,
  Search,
  Activity,
  UserCheck,
  Building2
} from 'lucide-react';

interface AdminDealProtectionProps {
  rfqs: RFQ[];
  isMaskingEnabled: boolean;
  onToggleMasking: () => void;
  auditLogs?: AdminAuditLog[];
}

export const AdminDealProtection: React.FC<AdminDealProtectionProps> = ({
  rfqs,
  isMaskingEnabled,
  onToggleMasking,
  auditLogs = [],
}) => {
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [auditSearch, setAuditSearch] = useState('');

  // Default seed audit logs if empty
  const logs: AdminAuditLog[] = useMemo(() => {
    if (auditLogs && auditLogs.length > 0) return auditLogs;
    return [
      {
        id: 'log-1',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        operatorName: 'System Monitor',
        action: 'ANTI_LEAKAGE_TRIGGER',
        targetType: 'rfq',
        targetId: 'RFQ-8921',
        details: 'RFQ received 3 competitive quotes, then buyer cancelled without reason. Potential off-platform negotiation flagged.',
        severity: 'critical',
      },
      {
        id: 'log-2',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        operatorName: 'admin@supplysouq.ae',
        action: 'TRADE_LICENSE_VERIFIED',
        targetType: 'verification',
        targetId: 'comp-supp-2',
        details: 'Approved DET commercial license for Al Noor Electrical Trading LLC (Sharjah Industrial).',
        severity: 'info',
      },
      {
        id: 'log-3',
        timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
        operatorName: 'admin@supplysouq.ae',
        action: 'WHATSAPP_BROADCAST_NUDGE',
        targetType: 'rfq',
        targetId: 'RFQ-8920',
        details: 'Triggered 1-click WhatsApp stockist nudge for 500m Ducab Cable schedule with 0 bids at 14h mark.',
        severity: 'warning',
      },
      {
        id: 'log-4',
        timestamp: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
        operatorName: 'admin@supplysouq.ae',
        action: 'ACCOUNT_IMPERSONATION',
        targetType: 'user',
        targetId: 'user-buyer-1',
        details: 'Impersonated Eng. Tariq Mansour (Apex MEP) to investigate quotation comparison rendering issue.',
        severity: 'info',
      },
    ];
  }, [auditLogs]);

  // Suspicious RFQs where off-platform deal leakage might have occurred
  const suspiciousRFQs = useMemo(() => {
    return rfqs.filter(r => {
      const hadQuotes = (r.quotesCount || 0) >= 2;
      const isCancelledOrStale = r.status === 'cancelled' || r.status === 'closed';
      return hadQuotes && isCancelledOrStale && !r.awardedQuotationId;
    });
  }, [rfqs]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSev = filterSeverity === 'all' || log.severity === filterSeverity;
      const term = auditSearch.toLowerCase();
      const matchesSearch =
        !auditSearch ||
        log.details.toLowerCase().includes(term) ||
        log.action.toLowerCase().includes(term) ||
        log.targetId.toLowerCase().includes(term);

      return matchesSev && matchesSearch;
    });
  }, [logs, filterSeverity, auditSearch]);

  return (
    <div className="space-y-6">
      {/* Deal Protection Banner */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h3 className="text-base sm:text-lg font-extrabold tracking-tight">
              Anti-Disintermediation & Deal Leakage Shield
            </h3>
            <span className="bg-rose-500/20 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-500/30">
              Revenue Defense
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Prevent contractors and stockists from closing procurement deals offline. Protect the marketplace ecosystem, warranty guarantees, and standard 1.3% commission framework (currently 100% waived for launch).
          </p>
        </div>

        {/* Masking Toggle Control */}
        <div className="bg-slate-800/90 p-3.5 rounded-xl border border-slate-700 flex items-center justify-between gap-4 shrink-0">
          <div>
            <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
              {isMaskingEnabled ? <EyeOff className="w-4 h-4 text-emerald-400" /> : <Eye className="w-4 h-4 text-rose-400" />}
              Contact Masking
            </div>
            <div className="text-[10px] text-slate-400">
              {isMaskingEnabled ? 'Phones & emails obscured until PO' : 'Direct contact visible (High Risk)'}
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleMasking}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              isMaskingEnabled ? 'bg-emerald-600' : 'bg-slate-600'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                isMaskingEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Suspicious Activity & Deal Leakage Alert Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Suspicious RFQs & Deal Leakage Risk Alerts ({suspiciousRFQs.length})</span>
          </h4>
          <span className="text-xs text-slate-500">Auto-flagged when RFQ receives multiple bids then cancels</span>
        </div>

        {suspiciousRFQs.length === 0 ? (
          <Card className="p-6 text-center bg-slate-50/60 border-slate-200">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
            <h5 className="text-xs font-bold text-slate-800">No Offline Deal Leakage Detected</h5>
            <p className="text-[11px] text-slate-500">All submitted quotes and RFQ lifecycle states are following standard awarded pathways.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suspiciousRFQs.map(rfq => (
              <Card key={rfq.id} className="border-rose-300 bg-rose-50/40 shadow-sm p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-mono font-bold text-xs bg-white text-rose-900 px-2 py-0.5 rounded border border-rose-200">
                        {rfq.rfqNumber}
                      </span>
                      <span className="text-[10px] font-bold bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded">
                        High Leakage Risk
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-xs">{rfq.title}</div>
                    <div className="text-[11px] text-slate-600 mt-1">
                      Contractor: <strong>{rfq.buyerCompanyName}</strong> • Received <strong>{rfq.quotesCount} bids</strong> then cancelled.
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-rose-700 border-rose-300 hover:bg-rose-100 shrink-0">
                    Audit Deal
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Activity Log & Audit Trail */}
      <Card className="shadow-lg border-slate-200">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-600" />
              Platform Event Audit Trail
            </h4>
            <p className="text-slate-500 text-[11px]">Chronological record of stockist quotes, BOQ downloads, and operator actions.</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {(['all', 'critical', 'warning', 'info'] as const).map(sev => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold capitalize transition-all ${
                    filterSeverity === sev
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                className="pl-7 pr-2 py-1 rounded-lg border border-slate-300 text-xs w-36 focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 text-xs">
            {filteredLogs.map(log => (
              <div key={log.id} className="p-3.5 hover:bg-slate-50/80 transition-colors flex items-start gap-3">
                <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                  log.severity === 'critical'
                    ? 'bg-rose-100 text-rose-700'
                    : log.severity === 'warning'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-sky-100 text-sky-800'
                }`}>
                  <Activity className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-slate-900 text-[11px]">{log.action}</span>
                    <span className="text-[10px] text-slate-400">{formatDate(log.timestamp)}</span>
                  </div>
                  <p className="text-slate-700 text-xs mt-0.5">{log.details}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                    <span>Operator: <strong className="text-slate-600">{log.operatorName}</strong></span>
                    <span>•</span>
                    <span>Target: <strong className="text-slate-600">{log.targetType.toUpperCase()}:{log.targetId}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
