import React, { useState } from 'react';
import { Company, UserProfile, VerificationRequest } from '../../types';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { StatusBadge } from '../ui/Badge';
import { formatAED, formatDate } from '../../lib/utils';
import {
  ShieldCheck,
  Building2,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Lock,
  UserCheck,
  QrCode,
  Calendar,
  CreditCard,
  Ban,
  Search,
  Award,
  ExternalLink
} from 'lucide-react';

interface AdminKYBDeskProps {
  companies: Company[];
  registeredUsers: UserProfile[];
  verifications: VerificationRequest[];
  onUpdateVerification: (companyId: string, status: any, notes?: string) => void;
  onUpdateCompany?: (updatedCompany: Company) => void;
  onImpersonateUser: (user: UserProfile) => void;
}

export const AdminKYBDesk: React.FC<AdminKYBDeskProps> = ({
  companies,
  registeredUsers,
  verifications,
  onUpdateVerification,
  onUpdateCompany,
  onImpersonateUser,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'pending' | 'directory' | 'expiring'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [previewCompany, setPreviewCompany] = useState<Company | null>(null);
  const [riskModalCompany, setRiskModalCompany] = useState<Company | null>(null);
  const [creditLimitInput, setCreditLimitInput] = useState(50000);
  const [creditRiskTier, setCreditRiskTier] = useState<'low' | 'moderate' | 'high_risk'>('low');
  const [paymentRestriction, setPaymentRestriction] = useState<'standard' | 'upfront_cod_only'>('standard');

  // Days until expiry calculation
  const getExpiryDays = (expiryDateStr?: string) => {
    if (!expiryDateStr) return 180; // default benchmark
    const expiry = new Date(expiryDateStr).getTime();
    const now = Date.now();
    return Math.round((expiry - now) / (1000 * 60 * 60 * 24));
  };

  // Pending queue
  const pendingQueue = verifications.filter(v => v.status === 'pending');

  // Expiring in < 30 days
  const expiringCompanies = companies.filter(c => {
    const days = getExpiryDays(c.tradeLicenseExpiryDate);
    return days <= 30;
  });

  // Filtered directory
  const filteredCompanies = companies.filter(c => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      c.name.toLowerCase().includes(term) ||
      c.legalName.toLowerCase().includes(term) ||
      c.tradeLicenseNumber.toLowerCase().includes(term) ||
      c.emirate.toLowerCase().includes(term);

    if (!matchesSearch) return false;
    if (activeSubTab === 'expiring') return getExpiryDays(c.tradeLicenseExpiryDate) <= 30;
    return true;
  });

  // Toggle badge on supplier
  const handleToggleBadge = (company: Company, badge: 'Verified Trader' | 'Fast Responder' | 'Top Rated' | 'Premium Partner') => {
    if (!onUpdateCompany) return;
    const nextBadge = company.badge === badge ? undefined : badge;
    onUpdateCompany({
      ...company,
      badge: nextBadge as any,
    });
  };

  // Toggle account suspension
  const handleToggleSuspension = (company: Company) => {
    if (!onUpdateCompany) return;
    onUpdateCompany({
      ...company,
      isSuspended: !company.isSuspended,
      verificationStatus: !company.isSuspended ? 'suspended' : 'verified',
    });
  };

  // Save credit risk rating
  const handleSaveRiskRating = () => {
    if (!riskModalCompany || !onUpdateCompany) return;
    onUpdateCompany({
      ...riskModalCompany,
      creditRiskTier,
      creditLimitAED: creditLimitInput,
      paymentRestriction,
    });
    setRiskModalCompany(null);
  };

  const openRiskModal = (comp: Company) => {
    setRiskModalCompany(comp);
    setCreditRiskTier(comp.creditRiskTier || 'low');
    setCreditLimitInput(comp.creditLimitAED || 50000);
    setPaymentRestriction(comp.paymentRestriction || 'standard');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-navy-950 to-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base sm:text-lg font-extrabold tracking-tight">
              UAE KYB & Trade License Verification Desk
            </h3>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
              DET / DED Compliant
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Verify legitimate UAE entities across Dubai, Sharjah & Ajman. Inspect commercial trade licenses, enforce licensed trading activities, audit credit risk ratings, and impersonate accounts for customer support.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-center">
            <span className="text-xl font-extrabold text-amber-400 block">{pendingQueue.length}</span>
            <span className="text-[10px] text-slate-300 font-semibold uppercase">Pending Approvals</span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-center">
            <span className="text-xl font-extrabold text-rose-400 block">{expiringCompanies.length}</span>
            <span className="text-[10px] text-slate-300 font-semibold uppercase">Expiring &lt;30d</span>
          </div>
        </div>
      </div>

      {/* Sub-tab navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('pending')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeSubTab === 'pending'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pending Queue ({pendingQueue.length})
          </button>
          <button
            onClick={() => setActiveSubTab('directory')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeSubTab === 'directory'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Licensed Companies ({companies.length})
          </button>
          <button
            onClick={() => setActiveSubTab('expiring')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all ${
              activeSubTab === 'expiring'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            License Expiry Tracker ({expiringCompanies.length})
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search company, trade license #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs w-full sm:w-60 focus:ring-2 focus:ring-brand-500 font-medium"
          />
        </div>
      </div>

      {/* ---------------- SUB-TAB 1: PENDING VERIFICATIONS QUEUE ---------------- */}
      {activeSubTab === 'pending' && (
        <div className="space-y-4">
          {pendingQueue.length === 0 ? (
            <Card className="p-8 text-center bg-slate-50/50 border-dashed border-2 border-slate-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800">Verification Queue is Clear</h4>
              <p className="text-xs text-slate-500">All submitted UAE supplier trade licenses have been reviewed and approved.</p>
            </Card>
          ) : (
            pendingQueue.map((v) => {
              const comp: Company = companies.find(c => c.id === v.companyId) || {
                id: v.companyId,
                name: v.companyName,
                legalName: v.companyName,
                tradeLicenseNumber: v.tradeLicenseNumber,
                companyType: 'supplier',
                emirate: v.emirate,
                industrialZone: v.industrialZone,
                address: 'Dubai, UAE',
                phone: '+971 4 000 0000',
                email: 'info@company.ae',
                categories: ['Power Cables & Wires'],
                serviceEmirates: ['Dubai', 'Sharjah', 'Ajman'],
                verificationStatus: 'pending',
                rating: 5,
                reviewCount: 0,
                responseRatePercent: 100,
                averageResponseHours: 1,
                yearsInBusiness: 2,
                createdAt: v.submittedAt,
              };

              return (
                <Card key={v.id} className="hover:border-slate-300 transition-all shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-base font-bold text-slate-900">{v.companyName}</h4>
                          <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-300">
                            DET Verification Pending
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Trade License: <strong className="font-mono text-slate-900">{v.tradeLicenseNumber}</strong> • Zone: <strong>{v.industrialZone} ({v.emirate})</strong>
                        </p>
                      </div>

                      <div className="text-xs text-slate-400">
                        Submitted: {formatDate(v.submittedAt)}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 text-xs">
                      {/* View document button */}
                      <button
                        type="button"
                        onClick={() => setPreviewCompany(comp)}
                        className="inline-flex items-center gap-1.5 font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg border border-brand-200 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-brand-600" />
                        <span>Inspect DET License Certificate</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateVerification(v.companyId, 'rejected', 'Trade license expired or non-compliant commercial activity.')}
                          leftIcon={<XCircle className="w-4 h-4 text-rose-600" />}
                        >
                          Reject
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => onUpdateVerification(v.companyId, 'verified', 'Approved with UAE Department of Economy & Tourism.')}
                          leftIcon={<CheckCircle2 className="w-4 h-4" />}
                        >
                          Approve & Issue Verified Trader Badge
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* ---------------- SUB-TAB 2 & 3: COMPANY DIRECTORY & EXPIRY TRACKER ---------------- */}
      {(activeSubTab === 'directory' || activeSubTab === 'expiring') && (
        <Card className="shadow-lg border-slate-200">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Company & Trade License</th>
                  <th className="p-3.5">Emirate & Zone</th>
                  <th className="p-3.5">License Expiry</th>
                  <th className="p-3.5">Trust Badge</th>
                  <th className="p-3.5">Risk & Terms</th>
                  <th className="p-3.5 text-right">KYB Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCompanies.map((comp) => {
                  const daysLeft = getExpiryDays(comp.tradeLicenseExpiryDate);
                  const isExpiringSoon = daysLeft <= 30 && daysLeft > 0;
                  const isExpired = daysLeft <= 0;
                  const associatedUser = registeredUsers.find(u => u.companyId === comp.id);

                  return (
                    <tr key={comp.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          {comp.name}
                          {comp.isSuspended && (
                            <span className="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-1.5 py-0.2 rounded border border-rose-300">
                              SUSPENDED
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500">
                          {comp.tradeLicenseNumber} • {comp.companyType.toUpperCase()}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className="font-medium text-slate-800 block">{comp.emirate}</span>
                        <span className="text-[11px] text-slate-400">{comp.industrialZone}</span>
                      </td>

                      <td className="p-3.5">
                        <div className="space-y-0.5">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded border ${
                            isExpired
                              ? 'bg-rose-50 text-rose-800 border-rose-300'
                              : isExpiringSoon
                              ? 'bg-amber-50 text-amber-900 border-amber-300'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}>
                            <Calendar className="w-3 h-3" />
                            {isExpired ? 'EXPIRED' : isExpiringSoon ? `${daysLeft} Days to Expiry` : 'Valid (>6 Months)'}
                          </span>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="flex flex-wrap items-center gap-1">
                          {(['Verified Trader', 'Fast Responder', 'Top Rated'] as const).map(b => (
                            <button
                              key={b}
                              type="button"
                              onClick={() => handleToggleBadge(comp, b)}
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border transition-all ${
                                comp.badge === b
                                  ? 'bg-brand-600 text-white border-brand-700 shadow-2xs'
                                  : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                              }`}
                              title="Click to toggle badge"
                            >
                              {b}
                            </button>
                          ))}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <button
                          type="button"
                          onClick={() => openRiskModal(comp)}
                          className={`text-[11px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
                            comp.paymentRestriction === 'upfront_cod_only'
                              ? 'bg-rose-50 text-rose-800 border-rose-300'
                              : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          <CreditCard className="w-3 h-3" />
                          <span>{comp.paymentRestriction === 'upfront_cod_only' ? 'Upfront / COD Only' : 'Standard 30d PDC'}</span>
                        </button>
                      </td>

                      <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                        {/* Inspect Certificate */}
                        <button
                          type="button"
                          onClick={() => setPreviewCompany(comp)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-[11px] transition-all"
                          title="Preview official DET trade license certificate"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>View DET</span>
                        </button>

                        {/* Account Impersonation ("Login as User") */}
                        {associatedUser && (
                          <button
                            type="button"
                            onClick={() => onImpersonateUser(associatedUser)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-brand-50 border border-brand-300 hover:bg-brand-100 text-brand-800 font-bold text-[11px] shadow-2xs transition-all"
                            title={`Impersonate and view dashboard as ${associatedUser.fullName}`}
                          >
                            <UserCheck className="w-3.5 h-3.5 text-brand-600" />
                            <span>Login as User</span>
                          </button>
                        )}

                        {/* Suspend / Unsuspend */}
                        <button
                          type="button"
                          onClick={() => handleToggleSuspension(comp)}
                          className={`inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                            comp.isSuspended
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          }`}
                          title={comp.isSuspended ? 'Reactivate account' : 'Suspend account'}
                        >
                          <Ban className="w-3 h-3" />
                          <span>{comp.isSuspended ? 'Activate' : 'Suspend'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* ---------------- MODAL: DET / DED TRADE LICENSE DOCUMENT PREVIEWER ---------------- */}
      {previewCompany && (
        <Modal
          isOpen={Boolean(previewCompany)}
          onClose={() => setPreviewCompany(null)}
          title={`UAE Commercial Trade License: ${previewCompany.name}`}
          subtitle="Department of Economy and Tourism (DET) Official Registration Certificate"
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            {/* Government Certificate Mockup */}
            <div className="bg-gradient-to-b from-amber-50/40 via-white to-amber-50/30 p-6 rounded-2xl border-2 border-amber-400/60 shadow-inner space-y-4 text-slate-900">
              <div className="flex items-center justify-between pb-3 border-b-2 border-amber-400/80">
                <div>
                  <div className="font-extrabold text-sm tracking-tight text-amber-950 uppercase">
                    GOVERNMENT OF {previewCompany.emirate.toUpperCase()}
                  </div>
                  <div className="text-[11px] text-amber-800 font-medium">
                    Department of Economy & Tourism • Commercial Compliance & Consumer Protection
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center font-bold text-amber-800 text-lg">
                  🏛️
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-white/90 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Trade License Number</span>
                  <span className="text-base font-black font-mono text-slate-900">{previewCompany.tradeLicenseNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Operating Name</span>
                  <span className="font-extrabold text-slate-900 block truncate">{previewCompany.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Legal Form</span>
                  <span className="font-semibold text-slate-800">Limited Liability Company (L.L.C)</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Register Territory</span>
                  <span className="font-semibold text-slate-800">{previewCompany.industrialZone}, {previewCompany.emirate}</span>
                </div>
              </div>

              {/* Licensed Activities */}
              <div className="space-y-1 bg-white/90 p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                  Authorized Commercial Economic Activities:
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 text-[11px] font-bold">
                    ✓ Building Materials & Hardware Trading (Activity #466301)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 text-[11px] font-bold">
                    ✓ Electrical Equipment & Power Cables Trading (Activity #465902)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-300 text-[11px] font-bold">
                    ✓ Lighting & Commercial Switchgear Fixtures
                  </span>
                </div>
              </div>

              {/* Validity & QR stamp */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                <div className="flex items-center gap-2">
                  <QrCode className="w-10 h-10 text-slate-900 p-1 bg-white border border-slate-300 rounded" />
                  <div>
                    <span className="text-[10px] text-slate-500 block">DET Digital Verification Seal</span>
                    <span className="font-mono text-[11px] font-bold text-emerald-700">ACTIVE & IN GOOD STANDING</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">License Expiry Date</span>
                  <span className="font-mono font-bold text-slate-900">{formatDate(previewCompany.tradeLicenseExpiryDate || '2026-12-31')}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Button variant="outline" onClick={() => setPreviewCompany(null)}>
                Close Preview
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  onClick={() => {
                    onUpdateVerification(previewCompany.id, 'verified', 'Confirmed valid with DET database.');
                    setPreviewCompany(null);
                  }}
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Verify License
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ---------------- MODAL: CREDIT & PAYMENT RISK RATING ---------------- */}
      {riskModalCompany && (
        <Modal
          isOpen={Boolean(riskModalCompany)}
          onClose={() => setRiskModalCompany(null)}
          title={`Credit & Risk Profile: ${riskModalCompany.name}`}
          subtitle="Set corporate credit limit and restrict payment terms if bounced cheques occur"
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Company Risk Tier</label>
              <select
                value={creditRiskTier}
                onChange={(e) => setCreditRiskTier(e.target.value as any)}
                className="w-full p-2 rounded-lg border border-slate-300 font-bold focus:ring-brand-500 bg-white"
              >
                <option value="low">Low Risk (Eligible for 30–60 Days PDC)</option>
                <option value="moderate">Moderate Risk (Monitor payment history)</option>
                <option value="high_risk">High Risk (Bounced cheques / Late payments)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Assigned Corporate Credit Limit (AED)</label>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-400">AED</span>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={creditLimitInput}
                  onChange={(e) => setCreditLimitInput(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 rounded-lg border border-slate-300 font-bold focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Payment Terms Enforcement</label>
              <select
                value={paymentRestriction}
                onChange={(e) => setPaymentRestriction(e.target.value as any)}
                className="w-full p-2 rounded-lg border border-slate-300 font-bold focus:ring-brand-500 bg-white"
              >
                <option value="standard">Standard Market Terms (Allow Credit & PDC)</option>
                <option value="upfront_cod_only">Restrict to Upfront / Cash on Delivery Only</option>
              </select>
              <p className="text-[10px] text-slate-500 mt-1">
                If restricted, the buyer cannot request 30/60-day PDC credit terms on any new RFQ.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Button variant="outline" onClick={() => setRiskModalCompany(null)}>
                Cancel
              </Button>
              <Button variant="amber" onClick={handleSaveRiskRating}>
                Save Risk Profile
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
