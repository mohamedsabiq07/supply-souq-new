import React from 'react';
import { useAppData } from '../../context/AppDataContext';
import { StatWidget } from '../../components/ui/StatWidget';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { formatAED, formatDate } from '../../lib/utils';
import {
  ShieldCheck,
  Building2,
  Store,
  FileText,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (view: string, params?: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { companies, rfqs, quotations, purchaseOrders, verifications } = useAppData();

  const buyersCount = companies.filter(c => c.companyType === 'buyer').length;
  const suppliersCount = companies.filter(c => c.companyType === 'supplier').length;
  const pendingVerifs = verifications.filter(v => v.status === 'pending');

  const totalGMV = purchaseOrders.reduce((sum, po) => sum + po.totalAmountAED, 0);
  const platformFee = totalGMV * 0.03; // 3% standard platform fee

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            SupplySouq Marketplace Operations Desk
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          UAE B2B procurement network overview, contractor activity, supplier verification, and quotation monitoring.
        </p>
      </div>

      {/* Pending Verifications Action Alert */}
      {pendingVerifs.length > 0 && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                {pendingVerifs.length} Supplier Trade License Pending Verification
              </h4>
              <p className="text-amber-800">
                New trader "{pendingVerifs[0].companyName}" has uploaded trade license for approval.
              </p>
            </div>
          </div>
          <Button
            variant="amber"
            size="sm"
            onClick={() => onNavigate('admin-verifications')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Review Verification Queue
          </Button>
        </div>
      )}

      {/* Macro Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatWidget
          title="Total UAE GMV"
          value={formatAED(totalGMV || 43920)}
          subtitle="Orders closed on platform"
          icon={<DollarSign className="w-6 h-6 text-emerald-600" />}
          trend={{ value: '+22%', isPositive: true }}
        />
        <StatWidget
          title="Active Contractor RFQs"
          value={rfqs.length}
          subtitle="Materials requested"
          icon={<FileText className="w-6 h-6 text-brand-600" />}
          trend={{ value: '100% quoted', isPositive: true }}
        />
        <StatWidget
          title="Verified UAE Suppliers"
          value={suppliersCount}
          subtitle="Dubai & Northern Emirates"
          icon={<Store className="w-6 h-6 text-amber-600" />}
        />
        <StatWidget
          title="Platform Commission (3%)"
          value={formatAED(platformFee || 1317)}
          subtitle="Monetization velocity"
          icon={<TrendingUp className="w-6 h-6 text-sky-600" />}
        />
      </div>

      {/* Global RFQs Table */}
      <Card>
        <CardHeader>
          <div>
            <h3 className="text-base font-bold text-slate-900">Live Network RFQ Activity</h3>
            <p className="text-xs text-slate-500">Monitor multi-vendor bid distribution and contractor awards.</p>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">RFQ #</th>
                <th className="p-3">Contractor Buyer</th>
                <th className="p-3">Title / Requirement</th>
                <th className="p-3">Delivery Site</th>
                <th className="p-3">Bids</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rfqs.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60">
                  <td className="p-3 font-mono font-bold text-brand-700">{r.rfqNumber}</td>
                  <td className="p-3 font-semibold text-slate-900">{r.buyerCompanyName}</td>
                  <td className="p-3 text-slate-800">{r.title}</td>
                  <td className="p-3 text-slate-600">{r.deliveryEmirate}</td>
                  <td className="p-3 font-bold text-brand-700">{r.quotesCount} quotes</td>
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
    </div>
  );
};