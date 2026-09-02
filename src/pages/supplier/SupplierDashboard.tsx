import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { StatWidget } from '../../components/ui/StatWidget';
import { RFQCard } from '../../components/rfq/RFQCard';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { formatAED, formatDate } from '../../lib/utils';
import {
  Store,
  FileText,
  CheckCircle2,
  TrendingUp,
  Clock,
  ShieldCheck,
  Zap,
  ArrowRight,
  PackageCheck
} from 'lucide-react';

interface SupplierDashboardProps {
  onNavigate: (view: string, params?: any) => void;
}

export const SupplierDashboard: React.FC<SupplierDashboardProps> = ({ onNavigate }) => {
  const { currentCompany } = useAuth();
  const { rfqs, quotations, purchaseOrders } = useAppData();

  const matchingRFQs = rfqs.filter(r => r.status === 'published' || r.status === 'receiving_quotes');
  const myQuotations = quotations.filter(q => q.supplierCompanyId === currentCompany.id);
  const myOrders = purchaseOrders.filter(p => p.supplierCompanyId === currentCompany.id);
  const isPending = currentCompany.verificationStatus === 'pending';

  return (
    <div className="space-y-8">
      {/* Top Header & Verification Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Supplier Sales Desk
            </h1>
            <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2 py-0.5 rounded border border-amber-300">
              {currentCompany.name || 'Supplier Portal'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Receive matched contractor RFQs in Dubai & Sharjah, quote competitive prices with 5% VAT, and fulfill Purchase Orders.
          </p>
        </div>

        <Button
          variant="amber"
          onClick={() => onNavigate('supplier-inbox')}
          leftIcon={<Zap className="w-4 h-4" />}
          className="font-bold shadow-md"
        >
          View Live RFQ Inbox ({matchingRFQs.length})
        </Button>
      </div>

      {/* Verification Badge Bar */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
        isPending ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl text-white flex items-center justify-center font-bold shrink-0 ${
            isPending ? 'bg-amber-600' : 'bg-emerald-600'
          }`}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm">
              {isPending ? 'Trade License Verification In Progress' : 'Verified UAE Commercial Trader'}
            </h4>
            <p className={isPending ? 'text-amber-700' : 'text-emerald-700'}>
              Trade License: <strong className="font-mono">{currentCompany.tradeLicenseNumber || 'TL-PENDING'}</strong> • Hub: <strong>{currentCompany.industrialZone || currentCompany.emirate}</strong>
            </p>
          </div>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full border w-fit ${
          isPending 
            ? 'bg-amber-100 text-amber-900 border-amber-300' 
            : 'bg-emerald-100 text-emerald-800 border-emerald-300'
        }`}>
          {isPending ? 'Verification Pending' : '100% Verified Profile'}
        </span>
      </div>

      {/* Supplier KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatWidget
          title="Matching Live RFQs"
          value={matchingRFQs.length}
          subtitle="Ready for bidding"
          icon={<FileText className="w-6 h-6 text-amber-600" />}
          trend={{ value: 'Active', isPositive: true }}
        />
        <StatWidget
          title="Submitted Quotations"
          value={myQuotations.length}
          subtitle={myQuotations.length > 0 ? "Total bids placed" : "0 bids placed"}
          icon={<Zap className="w-6 h-6 text-brand-600" />}
        />
        <StatWidget
          title="Won Purchase Orders"
          value={myOrders.length}
          subtitle={myOrders.length > 0 ? "Orders awarded" : "0 orders won"}
          icon={<PackageCheck className="w-6 h-6 text-emerald-600" />}
        />
        <StatWidget
          title="Response Rate"
          value={myQuotations.length > 0 ? `${currentCompany.responseRatePercent || 100}%` : "100%"}
          subtitle="Marketplace benchmark"
          icon={<Clock className="w-6 h-6 text-sky-600" />}
        />
      </div>

      {/* Live RFQ Opportunities */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h3 className="text-lg font-bold text-slate-900">Live RFQ Opportunities Ready for Quoting</h3>
          </div>
          <button
            onClick={() => onNavigate('supplier-inbox')}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            Open RFQ Inbox <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matchingRFQs.slice(0, 4).map((rfq) => (
            <RFQCard
              key={rfq.id}
              rfq={rfq}
              isSupplierView={true}
              onView={(r) => onNavigate('rfq-detail', { rfqId: r.id })}
              onQuote={(r) => onNavigate('submit-quote', { rfqId: r.id })}
            />
          ))}
        </div>
      </div>

      {/* Orders to Fulfill */}
      <Card>
        <CardHeader>
          <div>
            <h3 className="text-base font-bold text-slate-900">Active Purchase Orders to Fulfill</h3>
            <p className="text-xs text-slate-500">Track delivery deadlines and site gate receipt confirmations.</p>
          </div>
          {myOrders.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('supplier-orders')}
            >
              All Orders
            </Button>
          )}
        </CardHeader>
        {myOrders.length > 0 ? (
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">PO Number</th>
                  <th className="p-3">Contractor Buyer</th>
                  <th className="p-3">Project / Site</th>
                  <th className="p-3">Total Value (AED)</th>
                  <th className="p-3">Required Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50/60">
                    <td className="p-3 font-mono font-bold text-brand-700">{po.poNumber}</td>
                    <td className="p-3 font-semibold text-slate-900">{po.buyerCompanyName}</td>
                    <td className="p-3 text-slate-600">{po.deliveryAddress}</td>
                    <td className="p-3 font-extrabold text-slate-900">{formatAED(po.totalAmountAED)}</td>
                    <td className="p-3 text-slate-600">{formatDate(po.expectedDeliveryDate)}</td>
                    <td className="p-3">
                      <StatusBadge status={po.status} />
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onNavigate('supplier-orders')}
                        className="text-brand-600 hover:text-brand-800 font-bold"
                      >
                        Update Dispatch
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        ) : (
          <CardContent className="p-8 text-center text-xs text-slate-500">
            <p className="font-semibold text-slate-700">No active purchase orders awarded yet</p>
            <p className="text-slate-400 mt-1">Submit competitive quotations on contractor RFQs to win contracts and receive purchase orders.</p>
          </CardContent>
        )}
      </Card>
    </div>
  );
};