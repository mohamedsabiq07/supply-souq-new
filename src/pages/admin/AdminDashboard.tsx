import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { StatWidget } from '../../components/ui/StatWidget';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { formatAED, formatDate } from '../../lib/utils';
import { UserProfile, Company, RFQ, Quotation, PurchaseOrder } from '../../types';
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
  Sparkles
} from 'lucide-react';

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
  const { role, registeredUsers, adminLogin } = useAuth();

  const [activeTab, setActiveTab] = useState<'users' | 'rfqs' | 'quotes' | 'orders' | 'verifications'>('users');
  const [userFilter, setUserFilter] = useState<'all' | 'buyer' | 'supplier'>('all');
  const [emirateFilter, setEmirateFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<UserProfile | null>(null);
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);

  // Security gate if not logged in as admin
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
  const platformFee = totalGMV * 0.03;
  const pendingVerifs = verifications.filter((v) => v.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              SupplySouq Master Operations & Admin Desk
            </h1>
            <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px] border border-emerald-500/30">
              Live Cloud Database
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time directory of all signed-up contractors, verified stockists, live RFQs, quotes & trade licenses across Dubai, Sharjah & Ajman.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right text-xs">
            <p className="text-slate-400">Master Operator</p>
            <p className="font-bold text-white">admin@supplysouq.ae</p>
          </div>
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
          title="Total Posted RFQs"
          value={rfqs.length}
          subtitle="Contractor BOQs & Photos"
          icon={<FileText className="w-6 h-6 text-indigo-600" />}
        />
        <StatWidget
          title="Stockist Quotations"
          value={quotations.length}
          subtitle="Bids submitted"
          icon={<Store className="w-6 h-6 text-amber-600" />}
        />
        <StatWidget
          title="Marketplace GMV (AED)"
          value={formatAED(totalGMV || 43920)}
          subtitle={`Commission: ${formatAED(platformFee || 1317)}`}
          icon={<DollarSign className="w-6 h-6 text-emerald-600" />}
          trend={{ value: '+24%', isPositive: true }}
        />
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('users')}
          className={`py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'users'
              ? 'bg-brand-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>👥 All Registered Customers ({allUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rfqs')}
          className={`py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'rfqs'
              ? 'bg-brand-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>📋 All Posted RFQs & BOQs ({rfqs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('quotes')}
          className={`py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'quotes'
              ? 'bg-brand-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>💼 All Supplier Quotes ({quotations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'orders'
              ? 'bg-brand-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>📦 Purchase Orders ({purchaseOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('verifications')}
          className={`py-2.5 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'verifications'
              ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>🛡️ Trade License Queue ({pendingVerifs.length} Pending)</span>
        </button>
      </div>

      {/* ---------------- TAB 1: ALL REGISTERED CUSTOMERS ---------------- */}
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
                  Full list of all corporate accounts created on SupplySouq.
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
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setSelectedCustomer(u)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-brand-50 text-brand-700 font-bold text-xs inline-flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Profile
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

      {/* ---------------- TAB 2: ALL POSTED RFQS & BOQS ---------------- */}
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
                  <th className="p-3">Emirate / Site</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Bids</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rfqs.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-mono font-bold text-brand-700">{r.rfqNumber}</td>
                    <td className="p-3 font-bold text-slate-900">{r.buyerCompanyName}</td>
                    <td className="p-3 text-slate-800">{r.title}</td>
                    <td className="p-3 text-slate-600">{r.category}</td>
                    <td className="p-3 font-semibold text-slate-700">{r.deliveryEmirate}</td>
                    <td className="p-3 font-bold text-slate-800">{r.items?.length || 0} line items</td>
                    <td className="p-3 font-bold text-brand-700">{r.quotesCount || 0} quotes</td>
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

      {/* ---------------- TAB 3: ALL SUPPLIER QUOTATIONS ---------------- */}
      {activeTab === 'quotes' && (
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Store className="w-4 h-4 text-amber-600" />
              All Submitted Supplier Quotations ({quotations.length})
            </h3>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Quote #</th>
                  <th className="p-3">RFQ #</th>
                  <th className="p-3">Supplier Name</th>
                  <th className="p-3">Emirate / Zone</th>
                  <th className="p-3">Subtotal (AED)</th>
                  <th className="p-3">Grand Total (AED)</th>
                  <th className="p-3">Lead Time</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quotations.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-mono font-bold text-amber-800">{q.quotationNumber}</td>
                    <td className="p-3 font-mono font-semibold text-brand-700">{q.rfqNumber}</td>
                    <td className="p-3 font-bold text-slate-900">{q.supplierCompanyName}</td>
                    <td className="p-3 text-slate-600">{q.supplierEmirate} ({q.supplierZone})</td>
                    <td className="p-3 font-mono text-slate-700">{formatAED(q.subtotalAED)}</td>
                    <td className="p-3 font-mono font-bold text-emerald-700 text-sm">{formatAED(q.grandTotalAED)}</td>
                    <td className="p-3 text-slate-700">{q.leadTimeDisplay || '3 Days'}</td>
                    <td className="p-3">
                      <StatusBadge status={q.status as any} />
                    </td>
                    <td className="p-3 text-right text-slate-400">{formatDate(q.submittedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* ---------------- TAB 4: ALL PURCHASE ORDERS ---------------- */}
      {activeTab === 'orders' && (
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              All Awarded Purchase Orders ({purchaseOrders.length})
            </h3>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">PO Number</th>
                  <th className="p-3">Buyer Company</th>
                  <th className="p-3">Supplier Stockist</th>
                  <th className="p-3">Total Amount (AED)</th>
                  <th className="p-3">Delivery Site</th>
                  <th className="p-3">Payment Terms</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {purchaseOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-mono font-bold text-emerald-800">{po.poNumber}</td>
                    <td className="p-3 font-bold text-slate-900">{po.buyerCompanyName}</td>
                    <td className="p-3 font-bold text-slate-900">{po.supplierCompanyName}</td>
                    <td className="p-3 font-mono font-extrabold text-emerald-700 text-sm">{formatAED(po.totalAmountAED)}</td>
                    <td className="p-3 text-slate-600">{po.deliveryEmirate}</td>
                    <td className="p-3 text-slate-700">{po.paymentTerms || '30 Days Credit'}</td>
                    <td className="p-3">
                      <StatusBadge status={po.status} />
                    </td>
                    <td className="p-3 text-right text-slate-400">{formatDate(po.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* ---------------- TAB 5: TRADE LICENSE VERIFICATION QUEUE ---------------- */}
      {activeTab === 'verifications' && (
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Supplier Safety & Trade License Verification Queue
            </h3>
            <p className="text-xs text-slate-500">
              Verify legal trade license documents before allowing suppliers to submit bids to contractors.
            </p>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Company Name</th>
                  <th className="p-3.5">Trade License #</th>
                  <th className="p-3.5">Emirate & Zone</th>
                  <th className="p-3.5">Submission Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {verifications.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/80">
                    <td className="p-3.5 font-bold text-slate-900">{v.companyName}</td>
                    <td className="p-3.5 font-mono font-bold text-amber-900">{v.tradeLicenseNumber}</td>
                    <td className="p-3.5 text-slate-700">{v.emirate} ({v.industrialZone})</td>
                    <td className="p-3.5 text-slate-500">{formatDate(v.submittedAt)}</td>
                    <td className="p-3.5">
                      {v.status === 'verified' ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">
                          <CheckCircle2 className="w-3 h-3" /> Approved
                        </span>
                      ) : v.status === 'rejected' ? (
                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded text-[11px]">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[11px]">
                          <Clock className="w-3 h-3" /> Pending Review
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => updateVerificationStatus(v.companyId, 'verified', 'Approved by Operations Admin')}
                        className="px-3 py-1 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700 text-xs transition-colors"
                      >
                        Approve License
                      </button>
                      <button
                        onClick={() => updateVerificationStatus(v.companyId, 'rejected', 'Trade license expired or details mismatch')}
                        className="px-3 py-1 bg-red-50 text-red-700 rounded font-bold hover:bg-red-100 border border-red-200 text-xs transition-colors"
                      >
                        Reject
                      </button>
                    </td>
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

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
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
      )}
    </div>
  );
};