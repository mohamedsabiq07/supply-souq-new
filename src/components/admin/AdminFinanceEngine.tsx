import React, { useState, useMemo } from 'react';
import { PurchaseOrder } from '../../types';
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
  Percent
} from 'lucide-react';

interface AdminFinanceEngineProps {
  purchaseOrders: PurchaseOrder[];
  onUpdatePO?: (updatedPO: PurchaseOrder) => void;
}

export const AdminFinanceEngine: React.FC<AdminFinanceEngineProps> = ({
  purchaseOrders,
  onUpdatePO,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCommission, setFilterCommission] = useState<'all' | 'pending' | 'invoiced' | 'collected' | 'overdue'>('all');
  const [invoiceModalPO, setInvoiceModalPO] = useState<PurchaseOrder | null>(null);

  // Default commission rate: 3%
  const DEFAULT_COMMISSION_RATE = 0.03;

  // Financial aggregates
  const totalGMV = useMemo(() => {
    return purchaseOrders.reduce((sum, po) => sum + po.totalAmountAED, 0);
  }, [purchaseOrders]);

  const totalCommissionDue = useMemo(() => {
    return purchaseOrders.reduce((sum, po) => {
      const comm = po.commissionAmountAED ?? (po.totalAmountAED * DEFAULT_COMMISSION_RATE);
      return sum + comm;
    }, 0);
  }, [purchaseOrders]);

  const collectedCommission = useMemo(() => {
    return purchaseOrders.reduce((sum, po) => {
      if (po.commissionStatus === 'collected') {
        const comm = po.commissionAmountAED ?? (po.totalAmountAED * DEFAULT_COMMISSION_RATE);
        return sum + comm;
      }
      return sum;
    }, 0);
  }, [purchaseOrders]);

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

  // Update commission status
  const handleStatusChange = (po: PurchaseOrder, newStatus: 'pending' | 'invoiced' | 'collected' | 'overdue') => {
    if (!onUpdatePO) return;
    const commAmount = po.commissionAmountAED ?? (po.totalAmountAED * DEFAULT_COMMISSION_RATE);
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
      <div className="p-5 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base sm:text-lg font-extrabold tracking-tight">
              Marketplace Monetization & UAE Tax (FTA) Invoicing Engine
            </h3>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
              3% Platform Fee Model
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Track gross merchandise value (GMV), auto-calculate 3% transaction commissions per Purchase Order, generate UAE FTA Tax Invoices with TRN, and manage PDC cheque maturities.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700 text-center">
            <span className="text-xl font-extrabold text-white font-mono block">{formatAED(totalGMV)}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Order GMV</span>
          </div>
          <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700 text-center">
            <span className="text-xl font-extrabold text-emerald-400 font-mono block">{formatAED(totalCommissionDue)}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">3% Commission</span>
          </div>
        </div>
      </div>

      {/* Financial KPIs Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle space-y-1">
          <div className="text-slate-500 font-medium">Total B2B GMV Transacted</div>
          <div className="text-xl font-extrabold text-slate-900 font-mono">{formatAED(totalGMV)}</div>
          <div className="text-[10px] text-emerald-600 font-semibold">Across {purchaseOrders.length} Issued POs</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle space-y-1">
          <div className="text-slate-500 font-medium">Commission Collected</div>
          <div className="text-xl font-extrabold text-emerald-700 font-mono">{formatAED(collectedCommission)}</div>
          <div className="text-[10px] text-slate-500 font-semibold">Direct bank transfer / wire</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle space-y-1">
          <div className="text-slate-500 font-medium">Commission Pending</div>
          <div className="text-xl font-extrabold text-amber-600 font-mono">{formatAED(pendingCommission)}</div>
          <div className="text-[10px] text-amber-700 font-semibold">Awaiting invoice clearance</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle space-y-1">
          <div className="text-slate-500 font-medium">Platform Net Supplier Payout</div>
          <div className="text-xl font-extrabold text-slate-900 font-mono">{formatAED(totalGMV - totalCommissionDue)}</div>
          <div className="text-[10px] text-slate-500 font-semibold">Disbursed to UAE Stockists</div>
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
                  ? 'bg-emerald-600 text-white shadow-sm'
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
            className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs w-full sm:w-60 focus:ring-2 focus:ring-emerald-500 font-medium"
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
                <th className="p-3.5">3% Platform Commission</th>
                <th className="p-3.5">Invoicing Status</th>
                <th className="p-3.5">Payment Method / PDC</th>
                <th className="p-3.5 text-right">Tax Invoicing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((po) => {
                const commission = po.commissionAmountAED ?? (po.totalAmountAED * DEFAULT_COMMISSION_RATE);
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
                      <span className="font-mono font-extrabold text-emerald-700 block text-sm">
                        {formatAED(commission)}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">3.0% of Order</span>
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
                          {po.paymentMethodType === 'pdc_cheque' ? 'Cheque Maturity: ~30 Days' : 'Direct Bank Settlement'}
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
                <div className="w-64 space-y-1 text-xs">
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
