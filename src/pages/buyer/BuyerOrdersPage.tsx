import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Card, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { formatAED, formatDate } from '../../lib/utils';
import { CustomerPurchaseOrder, FulfilmentStage } from '../../types';
import {
  Package,
  Truck,
  CheckCircle2,
  FileText,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  AlertTriangle,
  Download,
  FolderOpen,
  XCircle,
} from 'lucide-react';

export const BuyerOrdersPage: React.FC = () => {
  const { currentCompany } = useAuth();
  const {
    customerPOs,
    orderFulfilments,
    deliveryRecords,
    deliveryDocuments,
    commercialSettings,
    acknowledgeDeliveryReceipt,
    reportDeliveryIssue,
    requestCustomerPOCancellation,
  } = useAppData();

  const [activeSubTab, setActiveSubTab] = useState<'pos_orders' | 'deliveries' | 'documents'>(
    'pos_orders'
  );
  const [selectedCPO, setSelectedCPO] = useState<CustomerPurchaseOrder | null>(null);
  const [issueModalFulfilmentId, setIssueModalFulfilmentId] = useState<string | null>(null);
  const [issueText, setIssueText] = useState('');
  const [ackNotes, setAckNotes] = useState('');

  const myCPOs = customerPOs.filter((c) => c.buyerCompanyId === currentCompany.id);
  const myFulfilments = orderFulfilments.filter((f) => f.buyerCompanyId === currentCompany.id);
  const myCpoIds = new Set(myCPOs.map((c) => c.id));
  const myDocs = deliveryDocuments.filter((d) => myCpoIds.has(d.cpoId) && d.visibleToBuyer);

  const stages: { id: FulfilmentStage; label: string }[] = [
    { id: 'order_confirmed', label: 'Order Confirmed' },
    { id: 'procurement_processing', label: 'Procurement Processing' },
    { id: 'supplier_confirmed', label: 'Supplier Confirmed' },
    { id: 'ready_for_dispatch', label: 'Ready for Dispatch' },
    { id: 'in_transit', label: 'In Transit' },
    { id: 'delivered', label: 'Delivered' },
  ];

  const handlePrintCPO = (cpo: CustomerPurchaseOrder) => {
    const win = window.open('', '_blank');
    if (!win) return;
    const rows = cpo.items
      .filter((i) => i.isIncluded)
      .map(
        (item, idx) => `
        <tr>
          <td style="padding:8px;border:1px solid #cbd5e1;">${idx + 1}</td>
          <td style="padding:8px;border:1px solid #cbd5e1;font-weight:bold;">${item.description}</td>
          <td style="padding:8px;border:1px solid #cbd5e1;">${item.offeredBrand}</td>
          <td style="padding:8px;border:1px solid #cbd5e1;text-align:right;">${item.quantity} ${item.unit}</td>
          <td style="padding:8px;border:1px solid #cbd5e1;text-align:right;">AED ${item.customerUnitPriceAED.toLocaleString()}</td>
          <td style="padding:8px;border:1px solid #cbd5e1;text-align:right;font-weight:bold;">AED ${item.customerLineTotalAED.toLocaleString()}</td>
        </tr>`
      )
      .join('');
    win.document.write(`
      <html>
        <head>
          <title>Customer Purchase Order — ${cpo.cpoNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; color: #0f172a; }
            h1 { color: #9e1c2e; margin-bottom: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
            th { background: #0f172a; color: white; padding: 10px; text-align: left; }
          </style>
        </head>
        <body>
          <h1>CUSTOMER PURCHASE ORDER — ${cpo.cpoNumber}</h1>
          <p><strong>Contracting Entity:</strong> ${cpo.contractingEntityName}</p>
          <p><strong>Customer:</strong> ${cpo.buyerCompanyName} (${cpo.buyerContactName} • ${cpo.buyerPhone})</p>
          <p><strong>RFQ Reference:</strong> ${cpo.rfqNumber} — ${cpo.rfqTitle}</p>
          <p><strong>Selected Offer:</strong> ${cpo.offerNumber} | <strong>Payment Terms:</strong> ${cpo.paymentTerms}</p>
          <p><strong>Delivery Site:</strong> ${cpo.deliveryAddress}, ${cpo.deliveryEmirate}</p>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Agreed Brand</th>
                <th>Qty</th>
                <th>Selling Unit Price</th>
                <th>Line Total</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <h3 style="text-align:right;margin-top:20px;">
            Subtotal: AED ${cpo.sellingSubtotalAED.toLocaleString()} | Delivery: AED ${cpo.deliveryFeeAED.toLocaleString()} | 5% VAT: AED ${cpo.vatAED.toLocaleString()}<br/>
            Total Payable: AED ${cpo.totalPayableAED.toLocaleString()}
          </h3>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Purchase Orders, Fulfilment & Delivery Documents
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Single point of contact: Track your ProcureSouq Customer POs (`PS-CPO`), 6-stage site delivery progress, Delivery Notes (`DN`), and Proof of Delivery (`POD`).
          </p>
        </div>

        <div className="inline-flex bg-slate-100 dark:bg-white/[0.05] p-1 rounded-xl border border-slate-200 dark:border-white/[0.08] text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('pos_orders')}
            className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'pos_orders'
                ? 'bg-[#9e1c2e] text-white shadow-sm'
                : 'text-slate-600 dark:text-zinc-300'
            }`}
          >
            My Purchase Orders ({myCPOs.length})
          </button>
          <button
            onClick={() => setActiveSubTab('deliveries')}
            className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'deliveries'
                ? 'bg-[#9e1c2e] text-white shadow-sm'
                : 'text-slate-600 dark:text-zinc-300'
            }`}
          >
            Deliveries ({myFulfilments.length})
          </button>
          <button
            onClick={() => setActiveSubTab('documents')}
            className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'documents'
                ? 'bg-[#9e1c2e] text-white shadow-sm'
                : 'text-slate-600 dark:text-zinc-300'
            }`}
          >
            Documents ({myDocs.length})
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* SUB-TAB 1 & 2: MY PURCHASE ORDERS & 6-STAGE SITE DELIVERIES         */}
      {/* =================================================================== */}
      {(activeSubTab === 'pos_orders' || activeSubTab === 'deliveries') && (
        <>
          {myCPOs.length > 0 ? (
            <div className="space-y-5">
              {myCPOs.map((cpo) => {
                const ful = orderFulfilments.find((f) => f.cpoId === cpo.id);
                const cpoDocs = deliveryDocuments.filter(
                  (d) => d.cpoId === cpo.id && d.visibleToBuyer
                );
                const currentStageIdx = ful
                  ? stages.findIndex((s) => s.id === ful.currentStage)
                  : 0;

                return (
                  <Card
                    key={cpo.id}
                    className="border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#111114] overflow-hidden"
                  >
                    <CardContent className="p-6 space-y-5">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/[0.06]">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-black text-xs bg-slate-900 text-white px-2.5 py-1 rounded-lg">
                              {cpo.cpoNumber}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-extrabold uppercase">
                              {cpo.orderStatus.replace(/_/g, ' ')}
                            </span>
                            <span className="text-xs text-slate-500">
                              Selected: <strong>{cpo.offerNumber}</strong>
                            </span>
                          </div>
                          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                            {cpo.rfqTitle}
                          </h3>
                          <p className="text-xs text-slate-500">
                            Single Point of Contact:{' '}
                            <strong className="text-slate-800 dark:text-zinc-200">
                              {cpo.contractingEntityName}
                            </strong>{' '}
                            • Customer PO Ref: <strong>{cpo.customerPoReference || cpo.cpoNumber}</strong>
                          </p>
                        </div>

                        <div className="sm:text-right">
                          <span className="text-[11px] text-slate-400 uppercase font-bold block">
                            Total Payable (Incl. 5% VAT)
                          </span>
                          <span className="text-xl font-black text-[#9e1c2e] dark:text-rose-400 font-mono">
                            {formatAED(cpo.totalPayableAED)}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            Payment Terms: {cpo.paymentTerms}
                          </span>
                        </div>
                      </div>

                      {/* Step 10: 6-Stage Fulfilment & Delivery Timeline */}
                      {ful && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                              Live 6-Stage Fulfilment & Delivery Progress
                            </span>
                            <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                              Fulfilment Mode:{' '}
                              <strong>
                                {ful.fulfilmentMode === 'procuresouq_arranged'
                                  ? 'ProcureSouq-Arranged Pickup & Delivery'
                                  : 'Supplier Direct Delivery Coordinated by ProcureSouq'}
                              </strong>
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                            {stages.map((st, idx) => {
                              const isCompleted = idx <= currentStageIdx;
                              const isCurrent = idx === currentStageIdx;
                              return (
                                <div
                                  key={st.id}
                                  className={`p-3 rounded-xl border text-xs transition-all ${
                                    isCompleted
                                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-900 dark:text-emerald-200'
                                      : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] text-slate-400'
                                  } ${isCurrent ? 'ring-2 ring-emerald-500/30 font-extrabold' : ''}`}
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-[10px] font-black uppercase">
                                      Stage {idx + 1}
                                    </span>
                                    {isCompleted && (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    )}
                                  </div>
                                  <div className="font-bold text-[11px] leading-snug">{st.label}</div>
                                  {ful.stageTimestamps[st.id] && (
                                    <div className="text-[10px] opacity-75 mt-1">
                                      {new Date(ful.stageTimestamps[st.id]!).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Logistics & Tracking Metadata */}
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] text-xs">
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                                Delivery Site Address
                              </span>
                              <strong className="text-slate-900 dark:text-white">
                                {ful.deliveryAddress}
                              </strong>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                                Coordinated Logistics Provider
                              </span>
                              <strong className="text-slate-900 dark:text-white">
                                {ful.logisticsProvider || 'Scheduled by ProcureSouq Desk'}
                              </strong>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                                Dispatch Contact
                              </span>
                              <strong className="text-slate-900 dark:text-white">
                                {ful.deliveryContactName || 'ProcureSouq Ops'} ({ful.deliveryContactPhone || '+971 4 320 4455'})
                              </strong>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                                Tracking Reference
                              </span>
                              <strong className="font-mono text-[#9e1c2e]">
                                {ful.trackingReference || 'Pending Dispatch'}
                              </strong>
                            </div>
                          </div>

                          {ful.deliveredItemsSummary && (
                            <div className="text-xs text-slate-600 dark:text-zinc-300">
                              <strong>Delivery Scope:</strong> {ful.deliveredItemsSummary}
                              {ful.isPartialDelivery && (
                                <span className="ml-2 px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                                  Partial Delivery
                                </span>
                              )}
                            </div>
                          )}

                          {ful.hasDeliveryIssue && (
                            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                              <strong>Reported Delivery Issue:</strong> {ful.deliveryIssueNotes}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Attached Delivery Documents (PO, DN, POD, Test Certs) */}
                      {cpoDocs.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                            Official Order & Delivery Documents (PO / Delivery Note / POD / Certificates)
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {cpoDocs.map((doc) => (
                              <div
                                key={doc.id}
                                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] flex items-center gap-2 text-xs"
                              >
                                <FileText className="w-4 h-4 text-[#9e1c2e]" />
                                <div>
                                  <div className="font-bold text-slate-900 dark:text-white">
                                    {doc.fileName}
                                  </div>
                                  <div className="text-[10px] text-slate-500 uppercase">
                                    {doc.documentType.replace(/_/g, ' ')} • {doc.documentNumber}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedCPO(cpo)}
                            leftIcon={<FileText className="w-4 h-4" />}
                          >
                            View Order Breakdown
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePrintCPO(cpo)}
                            leftIcon={<Download className="w-4 h-4" />}
                          >
                            Download / Print PO ({cpo.cpoNumber})
                          </Button>
                        </div>

                        {ful && (
                          <div className="flex items-center gap-2 flex-wrap">
                            {ful.customerAcknowledged ? (
                              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>
                                  Delivery Acknowledged ({ful.customerAcknowledgedAt?.slice(0, 10)})
                                </span>
                              </span>
                            ) : (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() =>
                                  acknowledgeDeliveryReceipt(
                                    ful.id,
                                    'All materials received and verified at site gate.'
                                  )
                                }
                              >
                                Acknowledge Site Receipt
                              </Button>
                            )}

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIssueModalFulfilmentId(ful.id)}
                            >
                              Report Delivery Issue
                            </Button>

                            {cpo.orderStatus !== 'completed' &&
                              cpo.orderStatus !== 'cancelled' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    requestCustomerPOCancellation(
                                      cpo.id,
                                      'Project schedule revision requested by buyer',
                                      'buyer'
                                    )
                                  }
                                >
                                  Request Cancellation
                                </Button>
                              )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-12 text-center space-y-4 border-dashed border-2 border-slate-200 bg-slate-50/50">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto font-bold border border-brand-200">
                <Package className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-base font-bold text-slate-900">
                  No Customer Purchase Orders Yet
                </h3>
                <p className="text-xs text-slate-500">
                  When you select a ProcureSouq Offer from the Five-Quote Comparison Dashboard and place an order, your Customer PO (`PS-CPO`) and 6-stage delivery tracker will appear here.
                </p>
              </div>
            </Card>
          )}
        </>
      )}

      {/* =================================================================== */}
      {/* SUB-TAB 3: DOCUMENTS VAULT                                          */}
      {/* =================================================================== */}
      {activeSubTab === 'documents' && (
        <Card className="p-6 border-slate-200 bg-white space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Customer Procurement & Delivery Documents Vault
            </h3>
            <p className="text-xs text-slate-500">
              Central repository for your official Customer POs (`PS-CPO`), Delivery Notes (`DN`), signed Proof of Delivery (`POD`), and Factory Test Certificates.
            </p>
          </div>

          {myDocs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {myDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-[#9e1c2e] flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-extrabold text-slate-900 truncate">
                        {doc.fileName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {doc.documentType.replace(/_/g, ' ').toUpperCase()} • Ref:{' '}
                        <strong>{doc.documentNumber}</strong> • {formatDate(doc.createdAt)}
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold shrink-0">
                    Verified
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No documents uploaded yet.</p>
          )}
        </Card>
      )}

      {/* Customer PO Detail Modal */}
      <Modal
        isOpen={!!selectedCPO}
        onClose={() => setSelectedCPO(null)}
        title="Official Customer Purchase Order Breakdown"
        subtitle={selectedCPO ? selectedCPO.cpoNumber : ''}
        maxWidth="2xl"
      >
        {selectedCPO && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-900 text-white rounded-2xl flex justify-between items-center">
              <div>
                <h4 className="text-base font-black">{selectedCPO.cpoNumber}</h4>
                <p className="text-slate-300">
                  Contracting Entity: {selectedCPO.contractingEntityName}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                {selectedCPO.offerNumber}
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 font-bold">
                  <tr>
                    <th className="p-2.5">#</th>
                    <th className="p-2.5">Material</th>
                    <th className="p-2.5">Brand</th>
                    <th className="p-2.5 text-right">Qty</th>
                    <th className="p-2.5 text-right">Selling Unit AED</th>
                    <th className="p-2.5 text-right">Total AED</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedCPO.items
                    .filter((i) => i.isIncluded)
                    .map((item, idx) => (
                      <tr key={item.id}>
                        <td className="p-2.5 font-mono">{idx + 1}</td>
                        <td className="p-2.5 font-bold text-slate-900">{item.description}</td>
                        <td className="p-2.5">{item.offeredBrand}</td>
                        <td className="p-2.5 text-right font-mono">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="p-2.5 text-right font-mono">
                          {formatAED(item.customerUnitPriceAED)}
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold">
                          {formatAED(item.customerLineTotalAED)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-right space-y-1">
              <div>
                Materials Selling Subtotal: <strong>{formatAED(selectedCPO.sellingSubtotalAED)}</strong>
              </div>
              <div>
                Delivery Fee: <strong>{formatAED(selectedCPO.deliveryFeeAED)}</strong>
              </div>
              <div>
                5% UAE VAT: <strong>{formatAED(selectedCPO.vatAED)}</strong>
              </div>
              <div className="text-sm font-black text-[#9e1c2e] pt-1 border-t border-slate-200">
                Total Payable: {formatAED(selectedCPO.totalPayableAED)}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Report Delivery Issue Modal */}
      <Modal
        isOpen={!!issueModalFulfilmentId}
        onClose={() => setIssueModalFulfilmentId(null)}
        title="Report Site Delivery Issue or Discrepancy"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Describe any shortage, damaged drum/packaging, or specification discrepancy. ProcureSouq Operations will coordinate resolution immediately.
          </p>
          <textarea
            rows={3}
            placeholder="e.g., Item 4 (Cable Tray) missing 2 coupler brackets..."
            value={issueText}
            onChange={(e) => setIssueText(e.target.value)}
            className="w-full p-2.5 border border-slate-300 rounded-xl"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIssueModalFulfilmentId(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (issueModalFulfilmentId && issueText.trim()) {
                  reportDeliveryIssue(issueModalFulfilmentId, issueText.trim());
                  setIssueModalFulfilmentId(null);
                  setIssueText('');
                }
              }}
            >
              Submit Issue to ProcureSouq Desk
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};