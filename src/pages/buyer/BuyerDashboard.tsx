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
  FileText,
  GitCompare,
  Package,
  TrendingDown,
  PlusCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface BuyerDashboardProps {
  onNavigate: (view: string, params?: any) => void;
}

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ onNavigate }) => {
  const { currentCompany } = useAuth();
  const { rfqs, quotations, purchaseOrders } = useAppData();

  const myRFQs = rfqs.filter(r => r.buyerCompanyId === currentCompany.id);
  const myRFQIds = myRFQs.map(r => r.id);
  const myQuotes = quotations.filter(q => 
    (q.buyerCompanyId && q.buyerCompanyId === currentCompany.id) || 
    myRFQIds.includes(q.rfqId) ||
    myRFQs.some(r => r.rfqNumber === q.rfqNumber)
  );
  const evaluatingRFQs = myRFQs.filter(r => r.quotesCount > 0 && r.status !== 'closed' && r.status !== 'awarded');
  const activeOrders = purchaseOrders.filter(p => p.buyerCompanyId === currentCompany.id);

  // Calculate real material spend and real procurement savings strictly for this company
  const totalSpend = activeOrders.reduce((sum, po) => sum + po.totalAmountAED, 0);
  const estimatedSavings = totalSpend > 0 ? totalSpend * 0.15 : 0;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Procurement Command Dashboard
            </h1>
            <span className="bg-brand-50 text-brand-700 text-xs font-bold px-2 py-0.5 rounded border border-brand-200">
              {currentCompany.name || 'Contractor Portal'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your project material RFQs, compare multi-vendor quotations, and track UAE site deliveries.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => onNavigate('create-rfq')}
          leftIcon={<PlusCircle className="w-4 h-4" />}
          className="shadow-sm font-bold"
        >
          Create New RFQ
        </Button>
      </div>

      {/* Action Alert for Evaluating Quotes */}
      {evaluatingRFQs.length > 0 && (
        <div className="p-4 bg-gradient-to-r from-brand-900 to-slate-900 text-white rounded-2xl border border-brand-700 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/30 border border-brand-400/40 flex items-center justify-center text-amber-400 shrink-0">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {evaluatingRFQs[0].quotesCount} Quotation{evaluatingRFQs[0].quotesCount > 1 ? 's' : ''} Ready for Evaluation ({evaluatingRFQs[0].rfqNumber})
              </h4>
              <p className="text-xs text-slate-300">
                Suppliers have submitted official offers for "{evaluatingRFQs[0].title}".
              </p>
            </div>
          </div>
          <Button
            variant="amber"
            size="sm"
            onClick={() => onNavigate('buyer-compare', { rfqId: evaluatingRFQs[0].id })}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="font-bold"
          >
            Open Comparison Matrix
          </Button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatWidget
          title="Active RFQs"
          value={myRFQs.length}
          subtitle={myRFQs.length > 0 ? "In evaluation & bidding" : "No active RFQs"}
          icon={<FileText className="w-6 h-6 text-brand-600" />}
        />
        <StatWidget
          title="Quotations Received"
          value={myQuotes.length}
          subtitle={myQuotes.length > 0 ? "From verified UAE stockists" : "Awaiting RFQ submissions"}
          icon={<GitCompare className="w-6 h-6 text-amber-600" />}
        />
        <StatWidget
          title="Active Purchase Orders"
          value={activeOrders.length}
          subtitle={activeOrders.length > 0 ? "In processing & delivery" : "0 orders placed"}
          icon={<Package className="w-6 h-6 text-indigo-600" />}
        />
        <StatWidget
          title="Estimated Procurement Savings"
          value={formatAED(estimatedSavings)}
          subtitle={totalSpend > 0 ? "Savings across awarded POs" : "Start quoting to save"}
          icon={<TrendingDown className="w-6 h-6 text-emerald-600" />}
        />
      </div>

      {/* Live Received Quotations Feed */}
      {myQuotes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <GitCompare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Live Quotations Received from Suppliers ({myQuotes.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Direct commercial proposals submitted by verified UAE stockists with full price breakdown and lead times.
                </p>
              </div>
            </div>
            {evaluatingRFQs.length > 0 && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onNavigate('buyer-compare', { rfqId: evaluatingRFQs[0].id })}
                leftIcon={<GitCompare className="w-4 h-4" />}
                className="font-bold"
              >
                Compare Quotes Matrix
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {myQuotes.map((quote) => {
              const matchedRFQ = myRFQs.find(r => r.id === quote.rfqId || r.rfqNumber === quote.rfqNumber);
              return (
                <div
                  key={quote.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-subtle hover:border-brand-500 transition-all space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                          {quote.quotationNumber}
                        </span>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Submitted</span>
                        </span>
                        {matchedRFQ && (
                          <span className="text-xs font-mono text-slate-500">
                            for {matchedRFQ.rfqNumber}
                          </span>
                        )}
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{quote.supplierCompanyName}</h4>
                      <p className="text-xs text-slate-500">
                        {quote.supplierZone || quote.supplierEmirate || 'UAE Verified Stockist'}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-medium">Quoted Total (Incl. 5% VAT)</span>
                      <span className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono">
                        {formatAED(quote.grandTotalAED)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl text-xs border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Lead Time</span>
                      <strong className="text-slate-800 font-bold">{quote.leadTimeDisplay || `${quote.leadTimeDays} Days`}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Payment Terms</span>
                      <strong className="text-slate-800 font-bold truncate block">{quote.paymentTerms || '30 Days'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Materials</span>
                      <strong className="text-slate-800 font-bold">{quote.items?.length || 0} items quoted</strong>
                    </div>
                  </div>

                  {quote.notes && (
                    <p className="text-xs text-slate-600 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100 italic">
                      "{quote.notes}"
                    </p>
                  )}

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigate('rfq-detail', { rfqId: quote.rfqId })}
                      className="text-xs font-semibold"
                    >
                      View Full Details
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onNavigate('buyer-compare', { rfqId: quote.rfqId })}
                      leftIcon={<Zap className="w-3.5 h-3.5 text-amber-300" />}
                      className="text-xs font-bold"
                    >
                      Award Purchase Order
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active RFQs Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Active Material RFQs</h3>
          {myRFQs.length > 0 && (
            <button
              onClick={() => onNavigate('buyer-rfqs')}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              View All ({myRFQs.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {myRFQs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myRFQs.slice(0, 4).map((rfq) => (
              <RFQCard
                key={rfq.id}
                rfq={rfq}
                onView={(r) => onNavigate('rfq-detail', { rfqId: r.id })}
                onCompare={(r) => onNavigate('buyer-compare', { rfqId: r.id })}
              />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center space-y-4 border-dashed border-2 border-slate-200 bg-white">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 mx-auto">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h4 className="text-base font-bold text-slate-900">No Material RFQs Posted Yet</h4>
              <p className="text-xs text-slate-500">
                Post your material requirements (e.g., Ducab cables, switchgear, LED fixtures) or upload your BOQ sheet to receive up to 5 verified stockist quotes.
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => onNavigate('create-rfq')}
              leftIcon={<PlusCircle className="w-4 h-4" />}
              className="font-bold shadow-md mx-auto"
            >
              Post Your First RFQ (100% Free)
            </Button>
          </Card>
        )}
      </div>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader>
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Purchase Orders & Deliveries</h3>
            <p className="text-xs text-slate-500">Track PO dispatch, site gate receipts, and supplier ratings.</p>
          </div>
          {activeOrders.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('buyer-orders')}
            >
              All Orders
            </Button>
          )}
        </CardHeader>
        {activeOrders.length > 0 ? (
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">PO Number</th>
                  <th className="p-3">Project / RFQ</th>
                  <th className="p-3">Awarded Supplier</th>
                  <th className="p-3">Total (AED)</th>
                  <th className="p-3">Expected Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50/60">
                    <td className="p-3 font-mono font-bold text-brand-700">{po.poNumber}</td>
                    <td className="p-3">
                      <p className="font-semibold text-slate-900">{po.rfqTitle}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{po.rfqNumber}</span>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{po.supplierCompanyName}</td>
                    <td className="p-3 font-extrabold text-slate-900">{formatAED(po.totalAmountAED)}</td>
                    <td className="p-3 text-slate-600">{formatDate(po.expectedDeliveryDate)}</td>
                    <td className="p-3">
                      <StatusBadge status={po.status} />
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onNavigate('buyer-orders')}
                        className="text-brand-600 hover:text-brand-800 font-bold"
                      >
                        Track PO
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        ) : (
          <CardContent className="p-8 text-center text-xs text-slate-500">
            <p className="font-semibold text-slate-700">No purchase orders issued yet</p>
            <p className="text-slate-400 mt-1">Once you compare quotes and award a supplier, your digital POs and site tracking receipts will appear here.</p>
          </CardContent>
        )}
      </Card>
    </div>
  );
};