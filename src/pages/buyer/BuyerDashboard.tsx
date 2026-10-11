import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { StatWidget } from '../../components/ui/StatWidget';
import { RFQCard } from '../../components/rfq/RFQCard';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { formatAED, formatDate } from '../../lib/utils';
import {
  FileText,
  GitCompare,
  Package,
  PlusCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Truck,
  Bell,
  FolderOpen,
  Building2,
} from 'lucide-react';
import { CreateRFQButton } from '../../components/common/CreateRFQButton';
import { SupportDeskInlineBox } from '../../components/common/SupportChatWidget';

interface BuyerDashboardProps {
  onNavigate: (view: string, params?: any) => void;
}

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ onNavigate }) => {
  const { currentCompany } = useAuth();
  const {
    rfqs,
    customerOffers,
    customerPOs,
    orderFulfilments,
    deliveryDocuments,
    notifications,
    commercialSettings,
    markNotificationRead,
  } = useAppData();

  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);

  const myRFQs = rfqs
    .filter((r) => r.buyerCompanyId === currentCompany.id)
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt).getTime() -
        new Date(a.updatedAt || a.createdAt).getTime()
    );
  const myRFQIds = new Set(myRFQs.map((r) => r.id));

  const myCustomerOffers = customerOffers.filter(
    (o) => o.buyerCompanyId === currentCompany.id || myRFQIds.has(o.rfqId)
  );
  const myCPOs = customerPOs.filter((c) => c.buyerCompanyId === currentCompany.id);
  const myFulfilments = orderFulfilments.filter((f) => f.buyerCompanyId === currentCompany.id);
  const completedDeliveries = myFulfilments.filter((f) => f.currentStage === 'delivered');
  const pendingApprovalsCount =
    myRFQs.filter((r) => r.adminStatus === 'offers_published' && !myCPOs.some((c) => c.rfqId === r.id))
      .length +
    myCPOs.filter((c) => c.commercialApprovalStatus === 'pending_admin_approval').length;

  const myNotifications = notifications.filter(
    (n) =>
      n.recipientRole === 'buyer' &&
      (!n.recipientCompanyId || n.recipientCompanyId === currentCompany.id)
  );
  const unreadNotifs = myNotifications.filter((n) => !n.isRead);

  const rfqsWithPublishedOffers = myRFQs.filter((r) =>
    myCustomerOffers.some((o) => o.rfqId === r.id)
  );

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-[#9e1c2e] border border-rose-200 text-[10px] font-extrabold uppercase tracking-wider">
              Managed B2B Procurement Desk
            </span>
            <span className="text-xs text-slate-500">
              Single Point of Contact: <strong>{commercialSettings.contractingEntityName}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Customer Procurement Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
            Submit RFQs, compare up to 5 qualified ProcureSouq offers, issue Purchase Orders (`PS-CPO`), and track 6-stage UAE site deliveries.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowNotificationsDrawer(!showNotificationsDrawer)}
            className="relative px-3.5 py-2.5 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-xs font-bold text-slate-700 dark:text-zinc-200 flex items-center gap-2 hover:bg-slate-50 cursor-pointer"
          >
            <Bell className="w-4 h-4 text-[#9e1c2e]" />
            <span>Notifications</span>
            {unreadNotifs.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#cf2e46] text-white text-[10px] font-black">
                {unreadNotifs.length}
              </span>
            )}
          </button>

          <CreateRFQButton onClick={() => onNavigate('create-rfq')} size="md" />
        </div>
      </div>

      {/* Collapsible Notifications Panel */}
      {showNotificationsDrawer && (
        <Card className="p-5 border-slate-200 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900">
              Procurement & Delivery Notifications ({myNotifications.length})
            </h3>
            <button
              onClick={() => setShowNotificationsDrawer(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-900"
            >
              Close
            </button>
          </div>
          {myNotifications.length > 0 ? (
            <div className="space-y-2">
              {myNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    markNotificationRead(n.id);
                    if (n.targetView) onNavigate(n.targetView, { rfqId: n.relatedEntityId });
                  }}
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer ${
                    n.isRead
                      ? 'bg-slate-50 border-slate-200 text-slate-600'
                      : 'bg-rose-50/40 border-rose-200 text-slate-900 font-semibold'
                  }`}
                >
                  <div>
                    <div className="font-extrabold text-slate-900">{n.title}</div>
                    <div className="text-slate-600">{n.message}</div>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 ml-3">
                    {formatDate(n.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No notifications yet.</p>
          )}
        </Card>
      )}

      {/* Section 3: Required 5 Customer Dashboard KPIs (Real Database / Labelled Test Records) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatWidget
          title="Active RFQs"
          value={myRFQs.length}
          subtitle={myRFQs.length > 0 ? 'Managed by ProcureSouq' : '0 submitted'}
          icon={<FileText className="w-6 h-6 text-brand-600" />}
        />
        <StatWidget
          title="Quotations Ready"
          value={myCustomerOffers.length}
          subtitle={
            rfqsWithPublishedOffers.length > 0
              ? `Across ${rfqsWithPublishedOffers.length} RFQ(s)`
              : 'In sourcing'
          }
          icon={<GitCompare className="w-6 h-6 text-amber-600" />}
        />
        <StatWidget
          title="Pending Approvals"
          value={pendingApprovalsCount}
          subtitle="Offers / POs awaiting action"
          icon={<Clock className="w-6 h-6 text-rose-600" />}
        />
        <StatWidget
          title="Active Orders"
          value={myCPOs.length}
          subtitle={
            myCPOs.length > 0
              ? formatAED(myCPOs.reduce((s, c) => s + c.totalPayableAED, 0))
              : '0 active orders'
          }
          icon={<Package className="w-6 h-6 text-indigo-600" />}
        />
        <StatWidget
          title="Completed Deliveries"
          value={completedDeliveries.length}
          subtitle={
            completedDeliveries.length > 0 ? 'POD verified on site' : '0 delivered yet'
          }
          icon={<Truck className="w-6 h-6 text-emerald-600" />}
        />
      </div>

      {/* Action Banner when Qualified Offers are Ready */}
      {rfqsWithPublishedOffers.length > 0 && (
        <div className="p-5 bg-gradient-to-r from-slate-900 via-[#1f0910] to-slate-900 text-white rounded-2xl border border-[#cf2e46]/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#cf2e46]/20 border border-[#cf2e46]/40 flex items-center justify-center text-amber-400 shrink-0">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase">
                  Technical Review Complete
                </span>
                <span className="font-mono text-xs text-rose-300 font-bold">
                  {rfqsWithPublishedOffers[0].rfqNumber}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-extrabold text-white mt-0.5">
                {myCustomerOffers.filter((o) => o.rfqId === rfqsWithPublishedOffers[0].id).length}{' '}
                Qualified ProcureSouq Offers Ready for Comparison
              </h4>
              <p className="text-xs text-slate-300">
                Compare Offer 1–5 side-by-side (brands, technical compliance, partial quote flags, and landed cost) and issue your Purchase Order.
              </p>
            </div>
          </div>
          <Button
            variant="amber"
            size="sm"
            onClick={() =>
              onNavigate('buyer-compare', { rfqId: rfqsWithPublishedOffers[0].id })
            }
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="font-extrabold shrink-0"
          >
            Compare Qualified Offers
          </Button>
        </div>
      )}

      {/* Qualified Customer Offers Grouped by RFQ */}
      {rfqsWithPublishedOffers.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Qualified ProcureSouq Customer Offers ({myCustomerOffers.length} Published)
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Vetted by ProcureSouq Engineering. Confidential supplier identities and internal procurement costs are protected.
              </p>
            </div>
          </div>

          {rfqsWithPublishedOffers.map((rfq) => {
            const offers = myCustomerOffers
              .filter((o) => o.rfqId === rfq.id)
              .sort((a, b) => a.offerSlot - b.offerSlot);
            return (
              <Card
                key={rfq.id}
                className="p-5 sm:p-6 border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#111114] space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/[0.06] pb-3.5">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2.5 py-0.5 rounded">
                        {rfq.rfqNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                        {offers.length} / 5 Qualified Offers Published
                      </span>
                      <span className="text-xs text-slate-500">
                        • {rfq.items.length} BOQ Materials
                      </span>
                    </div>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                      {rfq.title}
                    </h4>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onNavigate('buyer-compare', { rfqId: rfq.id })}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Compare All {offers.length} Offers Side-by-Side
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
                  {offers.map((offer) => (
                    <div
                      key={offer.id}
                      onClick={() => onNavigate('buyer-compare', { rfqId: rfq.id })}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                        offer.status === 'selected'
                          ? 'border-emerald-500 bg-emerald-50/30 shadow-sm'
                          : 'border-slate-200 hover:border-[#9e1c2e] bg-slate-50/60'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-black text-xs">
                            {offer.offerLabel}
                          </span>
                          <span className="font-mono text-[10px] text-slate-500">
                            {offer.offerNumber}
                          </span>
                        </div>

                        {offer.ruleRecommendations.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {offer.ruleRecommendations.slice(0, 2).map((rec) => (
                              <span
                                key={rec}
                                className="px-1.5 py-0.5 rounded bg-rose-50 text-[#9e1c2e] border border-rose-200 text-[9px] font-extrabold"
                              >
                                ★ {rec}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="text-xs font-bold text-slate-900 line-clamp-1">
                          {offer.brandOffered}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {offer.isPartialOffer ? (
                            <span className="text-amber-700 font-bold">
                              ⚠️ Partial ({offer.quotedItemsCount}/{offer.totalRfqItemsCount} items)
                            </span>
                          ) : (
                            <span className="text-emerald-700 font-semibold">
                              ✓ {offer.technicalCompliance}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200/80">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Landed Total (Incl. VAT)
                        </span>
                        <div className="text-base font-black text-[#9e1c2e] font-mono">
                          {formatAED(offer.estimatedLandedTotalAED)}
                        </div>
                        <span className="text-[10px] text-slate-500 block">
                          {offer.leadTimeDisplay}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Active RFQs Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">My Material RFQs</h3>
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
          <div className="flex flex-col gap-3.5">
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
          <Card className="p-8 text-center space-y-4 border-dashed border-2 border-slate-200/80 bg-white">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 mx-auto">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h4 className="text-base font-bold text-slate-900">No Material RFQs Submitted Yet</h4>
              <p className="text-xs text-slate-500">
                Submit your material requirements or upload your Excel BOQ / PDF specifications. ProcureSouq will source and verify up to 5 competitive supplier quotations for you.
              </p>
            </div>
            <div className="flex justify-center">
              <CreateRFQButton onClick={() => onNavigate('create-rfq')} size="md">
                Submit Your First RFQ
              </CreateRFQButton>
            </div>
          </Card>
        )}
      </div>

      {/* Recent Customer Purchase Orders & Deliveries */}
      <Card>
        <CardHeader>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              My Purchase Orders (`PS-CPO`) & 6-Stage Site Deliveries
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Track order processing, coordinated site dispatch, Delivery Notes (`DN`), and Proof of Delivery (`POD`).
            </p>
          </div>
          {myCPOs.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => onNavigate('buyer-orders')}>
              Open Orders & Deliveries
            </Button>
          )}
        </CardHeader>
        {myCPOs.length > 0 ? (
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200/80">
                <tr>
                  <th className="p-3">Customer PO Ref</th>
                  <th className="p-3">Project / RFQ</th>
                  <th className="p-3">Selected Offer</th>
                  <th className="p-3">Total Payable (Incl. VAT)</th>
                  <th className="p-3">Fulfilment Stage</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myCPOs.map((cpo) => {
                  const ful = myFulfilments.find((f) => f.cpoId === cpo.id);
                  return (
                    <tr key={cpo.id} className="hover:bg-slate-50/60">
                      <td className="p-3 font-mono font-bold text-[#9e1c2e]">{cpo.cpoNumber}</td>
                      <td className="p-3">
                        <p className="font-semibold text-slate-900">{cpo.rfqTitle}</p>
                        <span className="text-[10px] text-slate-400 font-mono">{cpo.rfqNumber}</span>
                      </td>
                      <td className="p-3 font-semibold text-slate-800">{cpo.offerNumber}</td>
                      <td className="p-3 font-extrabold text-slate-900 font-mono">
                        {formatAED(cpo.totalPayableAED)}
                      </td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold uppercase text-[10px]">
                          {(ful?.currentStage || cpo.orderStatus).replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onNavigate('buyer-orders')}
                          className="text-[#9e1c2e] hover:underline font-bold cursor-pointer"
                        >
                          Track Delivery & POD →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        ) : (
          <CardContent className="p-8 text-center text-xs text-slate-500">
            <p className="font-semibold text-slate-700">No purchase orders issued yet</p>
            <p className="text-slate-400 mt-1">
              Once you select an offer and place an order, your Customer PO (`PS-CPO`) and 6-stage site delivery tracker will appear here.
            </p>
          </CardContent>
        )}
      </Card>
    </div>
  );
};