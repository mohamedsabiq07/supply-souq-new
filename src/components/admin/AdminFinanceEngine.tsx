import React, { useState, useMemo } from 'react';
import { PurchaseOrder, Company } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { formatAED, formatDate } from '../../lib/utils';
import {
  DollarSign,
  FileText,
  CreditCard,
  Building2,
  Calendar,
  CheckCircle2,
  Printer,
  Download,
  AlertCircle,
  Clock,
  ShieldCheck,
  Search,
  Percent,
  ToggleLeft,
  ToggleRight,
  Gift,
  Users,
  Store,
  Sparkles,
  ArrowRight,
  MessageSquare
} from 'lucide-react';

interface AdminFinanceEngineProps {
  purchaseOrders: PurchaseOrder[];
  companies?: Company[];
  onUpdatePO?: (updatedPO: PurchaseOrder) => void;
}

export const AdminFinanceEngine: React.FC<AdminFinanceEngineProps> = ({
  purchaseOrders,
  companies = [],
  onUpdatePO,
}) => {
  const [activeFinanceTab, setActiveFinanceTab] = useState<'commission' | 'subscriptions'>('commission');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCommission, setFilterCommission] = useState<'all' | 'pending' | 'invoiced' | 'collected' | 'overdue'>('all');
  const [invoiceModalPO, setInvoiceModalPO] = useState<PurchaseOrder | null>(null);

  // Standard commission rate: 1.3% (Waived for now to build traction)
  const STANDARD_COMMISSION_RATE = 0.013;
  const [isCommissionWaived, setIsCommissionWaived] = useState<boolean>(true);

  // Financial aggregates
  const totalGMV = useMemo(() => {
    return purchaseOrders.reduce((sum, po) => sum + po.totalAmountAED, 0);
  }, [purchaseOrders]);

  // Projected 1.3% standard commission
  const projectedCommission1_3 = useMemo(() => {
    return totalGMV * STANDARD_COMMISSION_RATE;
  }, [totalGMV]);

  // Actual commission due (0 AED when waived during traction phase)
  const totalCommissionDue = useMemo(() => {
    if (isCommissionWaived) return 0;
    return purchaseOrders.reduce((sum, po) => {
      const comm = po.commissionAmountAED ?? (po.totalAmountAED * STANDARD_COMMISSION_RATE);
      return sum + comm;
    }, 0);
  }, [purchaseOrders, isCommissionWaived]);

  const collectedCommission = useMemo(() => {
    if (isCommissionWaived) return 0;
    return purchaseOrders.reduce((sum, po) => {
      if (po.commissionStatus === 'collected') {
        const comm = po.commissionAmountAED ?? (po.totalAmountAED * STANDARD_COMMISSION_RATE);
        return sum + comm;
      }
      return sum;
    }, 0);
  }, [purchaseOrders, isCommissionWaived]);

  const pendingCommission = totalCommissionDue - collectedCommission;

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return purchaseOrders.filter((po) => {
      const status = po.commissionStatus || 'pending';
      const matchesFilter = filterCommission === 'all' || status === filterCommission;
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        po.poNumber.toLowerCase().includes(term) ||
        po.rfqNumber.toLowerCase().includes(term) ||
        po.buyerCompanyName.toLowerCase().includes(term) ||
        po.supplierCompanyName.toLowerCase().includes(term);

      return matchesFilter && matchesSearch;
    });
  }, [purchaseOrders, filterCommission, searchTerm]);

  // Suppliers for Subscription tracking (AED 1/day with 3-month free trial)
  const suppliersList = useMemo(() => {
    const supps = companies.filter(c => c.companyType === 'supplier' || c.companyType === 'both');
    if (supps.length > 0) return supps;
    // Fallback if companies empty
    return [
      {
        id: 'comp-supp-1',
        name: 'Al Noor Electrical Trading LLC',
        emirate: 'Dubai',
        industrialZone: 'Al Quoz Industrial Area 3',
        phone: '+971 50 882 1190',
        createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'comp-supp-2',
        name: 'Sharjah Cables & Switchgear FZE',
        emirate: 'Sharjah',
        industrialZone: 'Sharjah Industrial Area 4',
        phone: '+971 55 412 9901',
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'comp-supp-3',
        name: 'Decoduct Conduits Distribution LLC',
        emirate: 'Dubai',
        industrialZone: 'Deira Wholesale Market',
        phone: '+971 52 901 3341',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'comp-supp-4',
        name: 'Gulf Power Distribution Co.',
        emirate: 'Ajman',
        industrialZone: 'Ajman New Industrial Area',
        phone: '+971 56 312 8870',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }, [companies]);

  // Update commission status
  const handleStatusChange = (po: PurchaseOrder, newStatus: 'pending' | 'invoiced' | 'collected' | 'overdue') => {
    if (!onUpdatePO) return;
    const commAmount = isCommissionWaived ? 0 : (po.commissionAmountAED ?? (po.totalAmountAED * STANDARD_COMMISSION_RATE));
    onUpdatePO({
      ...po,
      commissionStatus: newStatus,
      commissionAmountAED: commAmount,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      {/* Finance Header Banner */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                SupplySouq Monetization & Invoicing Engine
              </h3>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                1.3% Standard Rate (Launch Waived: 0%)
              </span>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/30">
                AED 1 / Day Membership (3M Free Trial)
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Standard marketplace commission is calibrated at <strong>1.3%</strong>, but currently <strong>100% waived</strong> to drive rapid liquidity and contractor adoption. Suppliers enjoy a <strong>3-month free trial</strong>, transitioning to <strong>AED 1 / day</strong> thereafter.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700 text-center">
              <span className="text-xl font-extrabold text-white font-mono block">{formatAED(totalGMV)}</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Order GMV</span>
            </div>
            <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700 text-center">
              <span className="text-xl font-extrabold text-emerald-400 font-mono block">
                {isCommissionWaived ? 'AED 0.00' : formatAED(totalCommissionDue)}
              </span>
              <span className="text-[10px] text-emerald-300 uppercase font-semibold">
                {isCommissionWaived ? '0% (Waived for Launch)' : '1.3% Active Billed'}
              </span>
            </div>
          </div>
        </div>

        {/* Live Commission Waiver Switch & Launch Controls */}
        <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-700/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <span className="font-extrabold text-white block">
                {isCommissionWaived ? '🚀 Traction Launch Phase: 1.3% Commission is 100% Waived' : '⚡ 1.3% Standard Commission Active'}
              </span>
              <span className="text-[11px] text-slate-400">
                {isCommissionWaived
                  ? `Current promotion: Contractors & suppliers trade with zero commission. Projected fee at 1.3%: ${formatAED(projectedCommission1_3)}.`
                  : 'Platform commission billing active at standard 1.3% per awarded Purchase Order.'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCommissionWaived(!isCommissionWaived)}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer ${
              isCommissionWaived
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-slate-800 text-slate-300 border border-slate-600 hover:bg-slate-700'
            }`}
          >
            {isCommissionWaived ? <ToggleLeft className="w-4 h-4 text-emerald-400" /> : <ToggleRight className="w-4 h-4 text-brand-400" />}
            <span>{isCommissionWaived ? 'Promotional Waiver: ON (0% Fee)' : 'Promotional Waiver: OFF (1.3% Active)'}</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation: Commission Ledger vs Supplier Subscriptions */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveFinanceTab('commission')}
          className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
            activeFinanceTab === 'commission'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          <span>PO Commission & FTA Invoices ({purchaseOrders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFinanceTab('subscriptions')}
          className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
            activeFinanceTab === 'subscriptions'
              ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Gift className="w-3.5 h-3.5 text-slate-950" />
          <span>Supplier Memberships: AED 1 / Day (3M Free Trial)</span>
        </button>
      </div>

      {/* ---------------- SUB-TAB 1: COMMISSION & INVOICING ---------------- */}
      {activeFinanceTab === 'commission' && (
        <div className="space-y-6">
          {/* Financial KPIs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle space-y-1">
              <div className="text-slate-500 font-medium">Total B2B GMV Transacted</div>
              <div className="text-xl font-extrabold text-slate-900 font-mono">{formatAED(totalGMV)}</div>
              <div className="text-[10px] text-emerald-600 font-semibold">Across {purchaseOrders.length} Issued POs</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle space-y-1">
              <div className="text-slate-500 font-medium">Standard 1.3% Rate Projection</div>
              <div className="text-xl font-extrabold text-slate-700 font-mono">{formatAED(projectedCommission1_3)}</div>
              <div className="text-[10px] text-emerald-600 font-semibold">
                {isCommissionWaived ? 'Waived during launch' : 'Active billing'}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle space-y-1">
              <div className="text-slate-500 font-medium">Net Commission Billed</div>
              <div className="text-xl font-extrabold text-emerald-700 font-mono">
                {isCommissionWaived ? 'AED 0.00' : formatAED(totalCommissionDue)}
              </div>
              <div className="text-[10px] text-slate-500 font-semibold">
                {isCommissionWaived ? '100% Launch Discount Applied' : 'Standard 1.3% applied'}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle space-y-1">
              <div className="text-slate-500 font-medium">Net Supplier Payout</div>
              <div className="text-xl font-extrabold text-slate-900 font-mono">
                {formatAED(isCommissionWaived ? totalGMV : totalGMV - totalCommissionDue)}
              </div>
              <div className="text-[10px] text-slate-500 font-semibold">100% retained by stockists</div>
            </div>
          </div>

          {/* Filter Ribbon & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {(['all', 'pending', 'invoiced', 'collected', 'overdue'] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilterCommission(tab)}
                  className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all ${
                    filterCommission === tab
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab === 'all' ? `All Orders (${purchaseOrders.length})` : tab}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search PO #, buyer, stockist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs w-full sm:w-60 focus:ring-2 focus:ring-brand-500 font-medium"
              />
            </div>
          </div>

          {/* Orders Commission Ledger Table */}
          <Card className="shadow-lg border-slate-200">
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">PO & Parties</th>
                    <th className="p-3.5">Order Total (AED)</th>
                    <th className="p-3.5">1.3% Platform Commission</th>
                    <th className="p-3.5">Invoicing Status</th>
                    <th className="p-3.5">Payment Terms</th>
                    <th className="p-3.5 text-right">Tax Invoicing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((po) => {
                    const projected = po.commissionAmountAED ?? (po.totalAmountAED * STANDARD_COMMISSION_RATE);
                    const status = po.commissionStatus || 'pending';

                    return (
                      <tr key={po.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {po.poNumber}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">RFQ #{po.rfqNumber}</span>
                          </div>
                          <div className="font-bold text-slate-900 truncate max-w-[220px]">{po.rfqTitle}</div>
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">
                            Buyer: <strong className="text-slate-700">{po.buyerCompanyName}</strong> ➔ Supplier: <strong className="text-slate-700">{po.supplierCompanyName}</strong>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span className="font-mono font-extrabold text-slate-900 block text-sm">
                            {formatAED(po.totalAmountAED)}
                          </span>
                          <span className="text-[10px] text-slate-400">5% UAE VAT Incl.</span>
                        </td>

                        <td className="p-3.5">
                          {isCommissionWaived ? (
                            <div className="space-y-0.5">
                              <span className="font-mono font-bold text-slate-400 line-through text-xs block">
                                {formatAED(projected)}
                              </span>
                              <span className="font-mono font-extrabold text-emerald-700 text-xs inline-flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                AED 0.00 (Waived)
                              </span>
                              <span className="text-[9px] text-slate-400 block font-medium">1.3% Launch Promo</span>
                            </div>
                          ) : (
                            <div>
                              <span className="font-mono font-extrabold text-emerald-700 block text-sm">
                                {formatAED(projected)}
                              </span>
                              <span className="text-[10px] text-slate-500 font-semibold">1.3% of Order</span>
                            </div>
                          )}
                        </td>

                        <td className="p-3.5">
                          <select
                            value={status}
                            onChange={(e) => handleStatusChange(po, e.target.value as any)}
                            className={`p-1.5 rounded-lg border font-bold text-[11px] ${
                              status === 'collected'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : status === 'invoiced'
                                ? 'bg-sky-50 text-sky-800 border-sky-300'
                                : status === 'overdue'
                                ? 'bg-rose-50 text-rose-800 border-rose-300'
                                : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}
                          >
                            <option value="pending">⏳ Commission Pending</option>
                            <option value="invoiced">📄 Invoice Issued</option>
                            <option value="collected">✓ Collected & Settled</option>
                            <option value="overdue">⚠️ Overdue</option>
                          </select>
                        </td>

                        <td className="p-3.5">
                          <div className="space-y-0.5">
                            <span className="font-semibold text-slate-800 block text-[11px]">
                              {po.paymentTerms || '30 Days PDC'}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {po.paymentMethodType === 'pdc_cheque' ? 'PDC Cheque Maturity' : 'Direct Bank Settlement'}
                            </span>
                          </div>
                        </td>

                        <td className="p-3.5 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setInvoiceModalPO(po)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-[11px] shadow-2xs transition-all"
                          >
                            <FileText className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Generate Tax Invoice</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ---------------- SUB-TAB 2: SUPPLIER MEMBERSHIPS (AED 1/DAY & 3M FREE TRIAL) ---------------- */}
      {activeFinanceTab === 'subscriptions' && (
        <div className="space-y-6">
          {/* Supplier Membership Model Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle space-y-1">
              <div className="text-slate-500 font-medium">Trial Policy</div>
              <div className="text-xl font-extrabold text-slate-900">First 3 Months Free</div>
              <div className="text-[10px] text-emerald-600 font-semibold">90 days full access with 0 AED fees</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle space-y-1">
              <div className="text-slate-500 font-medium">Standard Daily Membership</div>
              <div className="text-xl font-extrabold text-amber-600 font-mono">AED 1.00 <span className="text-xs text-slate-500 font-normal">/ day</span></div>
              <div className="text-[10px] text-slate-500 font-semibold">AED 30 / month or AED 365 / year</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle space-y-1">
              <div className="text-slate-500 font-medium">Stockists on Free Trial</div>
              <div className="text-xl font-extrabold text-emerald-700 font-mono">{suppliersList.length} Active</div>
              <div className="text-[10px] text-emerald-600 font-semibold">100% active trial status</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle space-y-1">
              <div className="text-slate-500 font-medium">Projected Annual Recurring (ARR)</div>
              <div className="text-xl font-extrabold text-slate-900 font-mono">{formatAED(suppliersList.length * 365)}</div>
              <div className="text-[10px] text-slate-500 font-semibold">At AED 365 / supplier / year</div>
            </div>
          </div>

          {/* Supplier Free Trial Status Table */}
          <Card className="shadow-lg border-slate-200">
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Supplier Stockist</th>
                    <th className="p-3.5">Hub & Zone</th>
                    <th className="p-3.5">Registration Date</th>
                    <th className="p-3.5">3-Month Free Trial Progress</th>
                    <th className="p-3.5">Post-Trial Plan</th>
                    <th className="p-3.5 text-right">Direct Outreach</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {suppliersList.map((supp, idx) => {
                    const daysActive = 20 + (idx * 15);
                    const daysRemaining = Math.max(0, 90 - daysActive);
                    const progressPercent = Math.min(100, Math.round((daysActive / 90) * 100));

                    return (
                      <tr key={supp.id || idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <Store className="w-3.5 h-3.5 text-amber-600" />
                            <span>{supp.name}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">ID: {supp.id}</div>
                        </td>

                        <td className="p-3.5">
                          <span className="font-semibold text-slate-800 block">{supp.emirate}</span>
                          <span className="text-[10px] text-slate-500">{supp.industrialZone || 'Industrial Area'}</span>
                        </td>

                        <td className="p-3.5 text-slate-600 font-medium">
                          {formatDate(supp.createdAt || new Date().toISOString())}
                        </td>

                        <td className="p-3.5 min-w-[200px]">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-emerald-700 flex items-center gap-1">
                                <Gift className="w-3 h-3 text-emerald-600" />
                                3-Month Free Trial
                              </span>
                              <span className="font-bold text-slate-700 font-mono">{daysRemaining} Days Left</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-emerald-500 h-full rounded-full transition-all"
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                            <div className="text-[10px] text-slate-400">Day {daysActive} of 90</div>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-900 font-mono text-xs">AED 1.00 / day</span>
                            <span className="text-[10px] text-slate-500 block">Billed monthly: AED 30/mo</span>
                          </div>
                        </td>

                        <td className="p-3.5 text-right whitespace-nowrap">
                          <a
                            href={`https://wa.me/${(supp.phone || '+971508821190').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `Hello ${supp.name}, this is SupplySouq Operations. You have ${daysRemaining} days remaining in your 3-month free trial. You can continue quoting contractor RFQs with zero platform commission! Regular plan after trial is only AED 1/day.`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 font-bold text-[11px] transition-all"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                            <span>WhatsApp Status</span>
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ---------------- MODAL: UAE TAX (FTA) COMPLIANT TAX INVOICE ---------------- */}
      {invoiceModalPO && (
        <Modal
          isOpen={Boolean(invoiceModalPO)}
          onClose={() => setInvoiceModalPO(null)}
          title={`UAE FTA Tax Invoice: INV-${invoiceModalPO.poNumber.replace('PO-', '')}`}
          subtitle="Federal Tax Authority (FTA) Compliant Commercial Procurement Invoice"
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            {/* Printable Invoice Container */}
            <div className="bg-white p-6 rounded-xl border border-slate-300 shadow-sm space-y-4 text-slate-900 font-sans print:p-0">
              {/* Invoice Header */}
              <div className="flex items-start justify-between pb-4 border-b-2 border-slate-900">
                <div>
                  <div className="text-xl font-black text-brand-700 tracking-tight">SUPPLYSOUQ FZCO</div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    UAE B2B Procurement Technology Platform
                  </div>
                  <div className="text-[10px] text-slate-600 mt-1">
                    Dubai Silicon Oasis Headquarters, Building A2, Office 1002<br />
                    Dubai, United Arab Emirates
                  </div>
                  <div className="text-[11px] font-mono font-bold text-slate-800 mt-1">
                    SupplySouq Tax Registration Number (TRN): <span className="text-brand-700">100482938400003</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-black text-slate-900 uppercase">TAX INVOICE</div>
                  <div className="font-mono text-xs font-bold text-slate-700">INV-{invoiceModalPO.poNumber}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Date: {formatDate(invoiceModalPO.createdAt)}</div>
                  <div className="text-[10px] text-slate-500">Terms: {invoiceModalPO.paymentTerms || '30 Days Net'}</div>
                </div>
              </div>

              {/* Billed To / Parties */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Billed To (Contractor):</span>
                  <strong className="text-slate-900 block">{invoiceModalPO.buyerCompanyName}</strong>
                  <span className="text-[11px] text-slate-600 block">Site Gate: {invoiceModalPO.deliveryAddress} ({invoiceModalPO.deliveryEmirate})</span>
                  <span className="text-[10px] font-mono text-slate-500 block">Buyer TRN: 100293849200003</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Wholesale Stockist:</span>
                  <strong className="text-slate-900 block">{invoiceModalPO.supplierCompanyName}</strong>
                  <span className="text-[11px] text-slate-600 block">Industrial Zone: Al Quoz / Sharjah</span>
                  <span className="text-[10px] font-mono text-slate-500 block">Supplier TRN: 100582910300003</span>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[10px] uppercase">
                    <tr>
                      <th className="p-2.5">Item Description</th>
                      <th className="p-2.5 text-right">Qty</th>
                      <th className="p-2.5 text-right">Rate (AED)</th>
                      <th className="p-2.5 text-right">Net (AED)</th>
                      <th className="p-2.5 text-right">5% VAT</th>
                      <th className="p-2.5 text-right">Total (AED)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoiceModalPO.items?.map((it, idx) => {
                      const net = it.quantity * it.unitPriceAED;
                      const vat = net * 0.05;
                      return (
                        <tr key={idx}>
                          <td className="p-2.5 font-semibold text-slate-800">
                            {it.itemDescription}
                            <span className="text-[10px] text-slate-400 block font-normal">Brand: {it.offeredBrand}</span>
                          </td>
                          <td className="p-2.5 text-right font-mono">{it.quantity} {it.unit}</td>
                          <td className="p-2.5 text-right font-mono">{formatAED(it.unitPriceAED)}</td>
                          <td className="p-2.5 text-right font-mono">{formatAED(net)}</td>
                          <td className="p-2.5 text-right font-mono">{formatAED(vat)}</td>
                          <td className="p-2.5 text-right font-mono font-bold">{formatAED(net + vat)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Financial Totals */}
              <div className="flex justify-end pt-2">
                <div className="w-72 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal (Excl. VAT):</span>
                    <span className="font-mono font-bold">{formatAED(invoiceModalPO.subtotalAED)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery & Handling:</span>
                    <span className="font-mono">{formatAED(invoiceModalPO.deliveryChargeAED)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>5% UAE VAT:</span>
                    <span className="font-mono font-bold">{formatAED(invoiceModalPO.vatAED)}</span>
                  </div>

                  {/* Commission / Platform Fee row */}
                  <div className="pt-1 border-t border-slate-200 text-[11px] text-slate-600 space-y-0.5">
                    <div className="flex justify-between">
                      <span>Standard Platform Fee (1.3%):</span>
                      <span className="font-mono text-slate-500 line-through">
                        {formatAED(invoiceModalPO.totalAmountAED * STANDARD_COMMISSION_RATE)}
                      </span>
                    </div>
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Founder Traction Discount (-100%):</span>
                      <span className="font-mono">
                        -{formatAED(invoiceModalPO.totalAmountAED * STANDARD_COMMISSION_RATE)}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>Net Commission Charged:</span>
                      <span className="font-mono text-emerald-700">AED 0.00 (Waived)</span>
                    </div>
                  </div>

                  <div className="flex justify-between pt-2 border-t-2 border-slate-900 text-sm font-black text-slate-900">
                    <span>Total Tax Invoice (AED):</span>
                    <span className="font-mono text-brand-700">{formatAED(invoiceModalPO.totalAmountAED)}</span>
                  </div>
                </div>
              </div>

              {/* Bank Transfer Details */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[10px] text-slate-600 space-y-0.5">
                <strong className="text-slate-800 block">Bank Wire Settlement Instructions:</strong>
                <span>Beneficiary: SupplySouq Procurement FZCO • Bank: Emirates NBD (Dubai)</span>
                <span className="font-mono block">IBAN: AE070260000319827364501 • Swift: EBILAEAD</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <Button variant="outline" onClick={() => setInvoiceModalPO(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => window.print()}
                leftIcon={<Printer className="w-4 h-4" />}
              >
                Print / Download FTA Tax Invoice PDF
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
