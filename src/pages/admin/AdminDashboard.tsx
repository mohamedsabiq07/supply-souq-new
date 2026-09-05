import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { StatWidget } from '../../components/ui/StatWidget';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { formatAED, formatDate } from '../../lib/utils';
import { UserProfile, Company, RFQ, Quotation, PurchaseOrder, AdminRole } from '../../types';
import {
  ShieldCheck,
  Building2,
  Store,
  FileText,
  DollarSign,
  TrendingUp,
  Search,
  Users,
  ShieldAlert,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  XCircle,
  Eye,
  Lock,
  Download,
  FileSpreadsheet,
  AlertTriangle,
  Clock,
  Layers,
  Sparkles,
  Truck,
  Shield,
  BarChart3,
  UserCheck,
  ExternalLink,
  RotateCcw
} from 'lucide-react';

import { AdminSLATower } from '../../components/admin/AdminSLATower';
import { AdminKYBDesk } from '../../components/admin/AdminKYBDesk';
import { AdminFinanceEngine } from '../../components/admin/AdminFinanceEngine';
import { AdminDealProtection } from '../../components/admin/AdminDealProtection';
import { AdminLogisticsDispute } from '../../components/admin/AdminLogisticsDispute';
import { AdminAnalyticsExport } from '../../components/admin/AdminAnalyticsExport';
import { AdminRBACSelector } from '../../components/admin/AdminRBACSelector';

interface AdminDashboardProps {
  onNavigate: (view: string, params?: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { 
    companies, 
    rfqs, 
    quotations, 
    purchaseOrders, 
    verifications, 
    updateVerificationStatus,
    isSupabaseConnected 
  } = useAppData();
  
  const { 
    role, 
    registeredUsers, 
    adminLogin,
    isImpersonating,
    impersonatedUser,
    impersonateUser,
    stopImpersonating
  } = useAuth();

  // Tab State
  type AdminTab = 'sla' | 'kyb' | 'finance' | 'protection' | 'logistics' | 'analytics' | 'users' | 'rfqs';
  const [activeTab, setActiveTab] = useState<AdminTab>('sla');
  const [adminRole, setAdminRole] = useState<AdminRole>('super_admin');
  const [isMaskingEnabled, setIsMaskingEnabled] = useState<boolean>(true);

  // Filters for Users directory
  const [userFilter, setUserFilter] = useState<'all' | 'buyer' | 'supplier'>('all');
  const [emirateFilter, setEmirateFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<UserProfile | null>(null);

  // Security gate if not authenticated as admin
  const [adminPass, setAdminPass] = useState('');
  const [adminUnlocked, setAdminUnlocked] = useState(role === 'admin');
  const [passError, setPassError] = useState('');

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(adminPass)) {
      setAdminUnlocked(true);
      setPassError('');
    } else {
      setPassError('Invalid Master Admin Key. Clearance required.');
    }
  };

  // If locked, show security passkey screen
  if (!adminUnlocked && role !== 'admin') {
    return (
      <div className="max-w-md mx-auto py-16 px-4">
        <Card className="p-8 space-y-6 shadow-2xl border-slate-200 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner border border-emerald-300">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900">Restricted Operations Desk</h2>
            <p className="text-xs text-slate-500">
              Only authorized SupplySouq operators have clearance to access all registered contractors, stockists, and live quote data.
            </p>
          </div>

          {passError && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
              {passError}
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-4 text-xs">
            <div>
              <input
                type="password"
                required
                placeholder="Enter Master Admin Passkey (admin123)"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-center font-bold text-slate-900"
              />
            </div>
            <Button type="submit" variant="primary" className="w-full py-3 font-bold bg-emerald-600 hover:bg-emerald-700">
              Authenticate & Unlock Admin Desk
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  // Combine registeredUsers with companies list
  const allUsers: UserProfile[] = registeredUsers.map((u) => {
    const comp = companies.find((c) => c.id === u.companyId);
    return {
      ...u,
      companyName: comp?.name || u.companyName,
      tradeLicenseNumber: comp?.tradeLicenseNumber || u.tradeLicenseNumber,
      emirate: comp?.emirate || u.emirate || 'Dubai',
      address: comp?.address || u.address,
      industrialZone: comp?.industrialZone || u.industrialZone,
      verificationStatus: comp?.verificationStatus || u.verificationStatus || 'verified',
    };
  });

  const filteredUsers = allUsers.filter((u) => {
    const matchesType = userFilter === 'all' || u.role === userFilter;
    const matchesEmirate = emirateFilter === 'all' || u.emirate === emirateFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      u.companyName.toLowerCase().includes(term) ||
      u.fullName.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.phone.includes(term) ||
      (u.tradeLicenseNumber && u.tradeLicenseNumber.toLowerCase().includes(term));
    return matchesType && matchesEmirate && matchesSearch;
  });

  const buyersCount = allUsers.filter((u) => u.role === 'buyer').length;
  const suppliersCount = allUsers.filter((u) => u.role === 'supplier').length;
  const totalGMV = purchaseOrders.reduce((sum, po) => sum + po.totalAmountAED, 0);
  const platformFee = totalGMV * 0.013;
  const pendingVerifs = verifications.filter((v) => v.status === 'pending');

  // Handle Account Impersonation
  const handleImpersonateUser = (targetUser: UserProfile) => {
    impersonateUser(targetUser);
    if (targetUser.role === 'buyer') {
      onNavigate('buyer-dashboard');
    } else if (targetUser.role === 'supplier') {
      onNavigate('supplier-dashboard');
    }
  };

  return (
    <div className="space-y-6">
      {/* Impersonation Active Banner */}
      {isImpersonating && impersonatedUser && (
        <div className="bg-amber-500 text-slate-950 p-3 rounded-xl font-bold text-xs flex items-center justify-between shadow-md border border-amber-600">
          <div className="flex items-center gap-2">
            <span className="bg-slate-950 text-amber-400 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-extrabold">
              Ghost Impersonation Active
            </span>
            <span>
              Currently operating as: <strong>{impersonatedUser.fullName}</strong> ({impersonatedUser.companyName})
            </span>
          </div>
          <Button
            size="sm"
            onClick={stopImpersonating}
            className="bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs"
          >
            Exit Impersonation
          </Button>
        </div>
      )}

      {/* Control Tower Master Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 space-y-4 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                SupplySouq Operations Control Tower
              </h1>
              <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded text-[10px] border border-emerald-500/30">
                Live UAE Radar Active
              </span>
              {isSupabaseConnected && (
                <span className="bg-blue-500/20 text-blue-300 font-bold px-2.5 py-0.5 rounded text-[10px] border border-blue-500/30">
                  Cloud Synced
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 max-w-3xl">
              Central command for UAE construction marketplace liquidity, 24-hour RFQ SLAs, DET legal verifications, 1.3% commission model (waived during launch) & dispute mitigation.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-right text-xs shrink-0 self-start">
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Session Authority</span>
              <span className="font-mono font-bold text-emerald-400">admin@supplysouq.ae</span>
            </div>
          </div>
        </div>

        {/* Integrated Admin RBAC Role Switcher */}
        <div className="w-full pt-1">
          <AdminRBACSelector
            currentRole={adminRole}
            onChangeRole={(newRole) => {
              setAdminRole(newRole);
              if (newRole === 'procurement_ops') setActiveTab('sla');
              else if (newRole === 'verification_officer') setActiveTab('kyb');
              else if (newRole === 'finance_officer') setActiveTab('finance');
            }}
          />
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatWidget
          title="Total Registered Accounts"
          value={allUsers.length}
          subtitle={`${buyersCount} Buyers • ${suppliersCount} Suppliers`}
          icon={<Users className="w-6 h-6 text-brand-600" />}
        />
        <StatWidget
          title="Active RFQs Under SLA"
          value={rfqs.length}
          subtitle="24h Countdown Monitored"
          icon={<Clock className="w-6 h-6 text-amber-600" />}
        />
        <StatWidget
          title="Total Platform GMV"
          value={formatAED(totalGMV || 43920)}
          subtitle="1.3% Waived (Launch 0%)"
          icon={<DollarSign className="w-6 h-6 text-emerald-600" />}
          trend={{ value: '+24%', isPositive: true }}
        />
        <StatWidget
          title="Trade License Queue"
          value={pendingVerifs.length}
          subtitle="Awaiting DET Validation"
          icon={<ShieldCheck className="w-6 h-6 text-indigo-600" />}
        />
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold scrollbar-thin">
        <button
          onClick={() => setActiveTab('sla')}
          className={`py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'sla'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>⏱️ SLA Control Tower ({rfqs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('kyb')}
          className={`py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'kyb'
              ? 'bg-brand-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>🛡️ KYB & DET Verification ({pendingVerifs.length} Pending)</span>
        </button>

        <button
          onClick={() => setActiveTab('finance')}
          className={`py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'finance'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>💰 1.3% Commission & Invoices</span>
        </button>

        <button
          onClick={() => setActiveTab('protection')}
          className={`py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'protection'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>🔒 Deal Leakage Shield</span>
        </button>

        <button
          onClick={() => setActiveTab('logistics')}
          className={`py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'logistics'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>🚚 Fleet & Disputes</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'analytics'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>📊 Analytics & Exports</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'users'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>👥 Customer Directory ({allUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rfqs')}
          className={`py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'rfqs'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>📋 RFQ & Bids Matrix</span>
        </button>
      </div>

      {/* ---------------- TAB 1: SLA CONTROL TOWER ---------------- */}
      {activeTab === 'sla' && (
        <AdminSLATower
          rfqs={rfqs}
          companies={companies}
          onNavigateToRFQ={(rfqId) => onNavigate('rfq-detail', { rfqId })}
        />
      )}

      {/* ---------------- TAB 2: KYB & DET VERIFICATION ---------------- */}
      {activeTab === 'kyb' && (
        <AdminKYBDesk
          companies={companies}
          registeredUsers={allUsers}
          verifications={verifications}
          onUpdateVerification={(companyId, status, notes) => updateVerificationStatus(companyId, status, notes)}
          onImpersonateUser={handleImpersonateUser}
        />
      )}

      {/* ---------------- TAB 3: FINANCIAL ENGINE & TAX INVOICES ---------------- */}
      {activeTab === 'finance' && (
        <AdminFinanceEngine
          purchaseOrders={purchaseOrders}
          companies={companies}
        />
      )}

      {/* ---------------- TAB 4: DEAL LEAKAGE SHIELD ---------------- */}
      {activeTab === 'protection' && (
        <AdminDealProtection
          rfqs={rfqs}
          isMaskingEnabled={isMaskingEnabled}
          onToggleMasking={() => setIsMaskingEnabled(!isMaskingEnabled)}
        />
      )}

      {/* ---------------- TAB 5: FLEET LOGISTICS & DISPUTES ---------------- */}
      {activeTab === 'logistics' && (
        <AdminLogisticsDispute
          purchaseOrders={purchaseOrders}
        />
      )}

      {/* ---------------- TAB 6: ANALYTICS & 1-CLICK EXPORTS ---------------- */}
      {activeTab === 'analytics' && (
        <AdminAnalyticsExport
          rfqs={rfqs}
          companies={companies}
          purchaseOrders={purchaseOrders}
          registeredUsers={allUsers}
        />
      )}

      {/* ---------------- TAB 7: ALL REGISTERED CUSTOMERS DIRECTORY ---------------- */}
      {activeTab === 'users' && (
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="bg-slate-50/70 border-b border-slate-200 p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-600" />
                  All Registered Customers (Buyers & Suppliers Directory)
                </h3>
                <p className="text-xs text-slate-500">
                  Full corporate accounts roster with 1-Click "Login as User" impersonation for rapid customer support.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search name, phone, license..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs w-56 focus:ring-2 focus:ring-brand-500 font-medium"
                  />
                </div>

                {/* Account Type Filter */}
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value as any)}
                  className="p-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
                >
                  <option value="all">All Roles</option>
                  <option value="buyer">🏢 Contractors (Buyers)</option>
                  <option value="supplier">🏪 Stockists (Suppliers)</option>
                </select>

                {/* Emirate Filter */}
                <select
                  value={emirateFilter}
                  onChange={(e) => setEmirateFilter(e.target.value)}
                  className="p-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
                >
                  <option value="all">All Emirates</option>
                  <option value="Dubai">Dubai</option>
                  <option value="Sharjah">Sharjah</option>
                  <option value="Ajman">Ajman</option>
                </select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3.5">Company Name</th>
                  <th className="p-3.5">Contact Person / Engineer</th>
                  <th className="p-3.5">Phone & Email</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Trade License #</th>
                  <th className="p-3.5">Emirate / Zone</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 text-sm">{u.companyName}</div>
                        <div className="text-[11px] text-slate-400">{u.address || 'Address on file'}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <span>{u.fullName}</span>
                          {u.username && (
                            <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                              @{u.username}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500">{u.jobTitle || (u.role === 'buyer' ? 'Procurement Engineer' : 'Sales Rep')}</div>
                      </td>
                      <td className="p-3.5 space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <a href={`tel:${u.phone}`} className="font-semibold text-brand-700 hover:underline">
                            {u.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <a href={`mailto:${u.email}`} className="hover:underline">
                            {u.email}
                          </a>
                        </div>
                      </td>
                      <td className="p-3.5">
                        {u.role === 'buyer' ? (
                          <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 font-bold px-2 py-0.5 rounded border border-brand-200">
                            <Building2 className="w-3 h-3" /> Contractor
                          </span>
                        ) : u.role === 'supplier' ? (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 font-bold px-2 py-0.5 rounded border border-amber-300">
                            <Store className="w-3 h-3 text-amber-600" /> Supplier
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300">
                            <ShieldAlert className="w-3 h-3" /> Admin
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 font-mono text-[11px] font-bold">
                        {u.tradeLicenseNumber ? (
                          <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {u.tradeLicenseNumber}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">N/A (Buyer)</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span className="font-bold text-slate-800">{u.emirate || 'Dubai'}</span>
                        <div className="text-[11px] text-slate-500">{u.industrialZone || 'Commercial'}</div>
                      </td>
                      <td className="p-3.5">
                        {u.verificationStatus === 'verified' ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full text-[10px]">
                            <Clock className="w-3 h-3" /> Pending Review
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right space-x-1.5">
                        <button
                          onClick={() => handleImpersonateUser(u)}
                          className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs inline-flex items-center gap-1 transition-colors border border-amber-200"
                          title={`Log in directly as ${u.fullName}`}
                        >
                          <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                          <span>Login as User</span>
                        </button>
                        <button
                          onClick={() => setSelectedCustomer(u)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-brand-50 text-brand-700 font-bold text-xs inline-flex items-center gap-1 transition-colors border border-slate-200"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      No customer accounts matching filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* ---------------- TAB 8: ALL POSTED RFQS & BOQS MATRIX ---------------- */}
      {activeTab === 'rfqs' && (
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              All Posted RFQs & Line-Item BOQs ({rfqs.length})
            </h3>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">RFQ Number</th>
                  <th className="p-3">Buyer Company</th>
                  <th className="p-3">Requirement Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Matched Stockists (24h SLA)</th>
                  <th className="p-3">Quote Response</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rfqs.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-mono font-bold text-brand-700">
                      <button
                        onClick={() => onNavigate('rfq-detail', { rfqId: r.id })}
                        className="hover:underline flex items-center gap-1 text-left"
                      >
                        {r.rfqNumber}
                        <ExternalLink className="w-3 h-3 text-slate-400 inline" />
                      </button>
                    </td>
                    <td className="p-3 font-bold text-slate-900">
                      {r.buyerCompanyName}
                      <span className="text-[10px] text-slate-400 block">{r.buyerContactName} ({r.buyerPhone})</span>
                    </td>
                    <td className="p-3">
                      <p className="font-semibold text-slate-900">{r.title}</p>
                      <span className="text-[10px] text-slate-500">{r.items?.length || 0} line items • {r.deliveryEmirate}</span>
                    </td>
                    <td className="p-3 text-slate-600 font-medium">{r.category}</td>
                    <td className="p-3">
                      {r.matchedSupplierNames && r.matchedSupplierNames.length > 0 ? (
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            ⏱ 24h SLA Active (5 Stockists)
                          </span>
                          <p className="text-[11px] text-slate-600 truncate max-w-xs font-medium">
                            {r.matchedSupplierNames.join(', ')}
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">5 UAE Verified Stockists</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="font-mono font-extrabold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200 text-xs">
                        {r.quotesCount || 0} / {r.invitedCount || 5} Bids
                      </span>
                    </td>
                    <td className="p-3">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="p-3 text-right text-slate-400">{formatDate(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* ---------------- CUSTOMER DETAILS MODAL ---------------- */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                  selectedCustomer.role === 'buyer' ? 'bg-brand-100 text-brand-700' : 'bg-amber-100 text-amber-900'
                }`}>
                  {selectedCustomer.role === 'buyer' ? <Building2 className="w-4 h-4" /> : <Store className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{selectedCustomer.companyName}</h3>
                  <p className="text-xs text-slate-500 capitalize">{selectedCustomer.role} Account Profile</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block font-semibold">Contact Person / Engineer:</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedCustomer.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Designation / Role:</span>
                  <span className="font-bold text-slate-900">{selectedCustomer.jobTitle || 'Procurement Engineer'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 py-1.5">
                  <span className="text-slate-500 font-medium">UAE Mobile / Phone:</span>
                  <a href={`tel:${selectedCustomer.phone}`} className="font-bold text-brand-700 hover:underline">
                    {selectedCustomer.phone}
                  </a>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 py-1.5">
                  <span className="text-slate-500 font-medium">Corporate Email:</span>
                  <a href={`mailto:${selectedCustomer.email}`} className="font-bold text-slate-900 hover:underline">
                    {selectedCustomer.email}
                  </a>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 py-1.5">
                  <span className="text-slate-500 font-medium">UAE Trade License #:</span>
                  <span className="font-mono font-bold text-amber-900">
                    {selectedCustomer.tradeLicenseNumber || 'N/A (Contractor)'}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 py-1.5">
                  <span className="text-slate-500 font-medium">Emirate & Zone:</span>
                  <span className="font-bold text-slate-900">
                    {selectedCustomer.emirate || 'Dubai'} ({selectedCustomer.industrialZone || 'Commercial'})
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 py-1.5">
                  <span className="text-slate-500 font-medium">Office / Warehouse Address:</span>
                  <span className="font-medium text-slate-800 text-right">
                    {selectedCustomer.address || 'Dubai, UAE'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-500 font-medium">Account Status:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {selectedCustomer.verificationStatus || 'Active'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleImpersonateUser(selectedCustomer)}
                className="bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 font-bold text-xs flex items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Login as User
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCustomer(null)}
                >
                  Close
                </Button>
                <a
                  href={`https://wa.me/${selectedCustomer.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs inline-flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  Contact via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};