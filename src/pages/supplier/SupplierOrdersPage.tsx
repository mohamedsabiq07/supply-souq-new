import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Card, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { formatAED, formatDate } from '../../lib/utils';
import { PurchaseOrder, OrderStatus, SupplierPurchaseOrder, FulfilmentStage } from '../../types';
import {
  Truck,
  CheckCircle2,
  Lock,
  Printer,
  Upload,
  PackageCheck
} from 'lucide-react';

const STAGE_ORDER: Array<{ id: FulfilmentStage; label: string }> = [
  { id: 'order_confirmed', label: '1. Order Confirmed' },
  { id: 'procurement_processing', label: '2. Procurement Processing' },
  { id: 'supplier_confirmed', label: '3. Supplier Confirmed' },
  { id: 'ready_for_dispatch', label: '4. Ready for Dispatch' },
  { id: 'in_transit', label: '5. In Transit' },
  { id: 'delivered', label: '6. Delivered' },
];

export const SupplierOrdersPage: React.FC = () => {
  const { currentCompany } = useAuth();
  const {
    supplierPOs,
    orderFulfilments,
    deliveryDocuments,
    commercialSettings,
    confirmSupplierPO,
    updateFulfilmentStage,
    uploadDeliveryDocument,
    purchaseOrders,
    updateOrderStatus
  } = useAppData();

  const [activeSPO, setActiveSPO] = useState<SupplierPurchaseOrder | null>(null);
  const [selectedStage, setSelectedStage] = useState<FulfilmentStage>('ready_for_dispatch');
  const [trackingRef, setTrackingRef] = useState('DN-UAE-2026-8841');
  const [logisticsNote, setLogisticsNote] = useState('Warehouse stock packed and palletized with test certificates.');

  const [docModalSPO, setDocModalSPO] = useState<SupplierPurchaseOrder | null>(null);
  const [docType, setDocType] = useState<'delivery_note' | 'proof_of_delivery' | 'test_certificate' | 'packing_list'>('delivery_note');
  const [docTitle, setDocTitle] = useState('');

  // Legacy PO fallback state
  const [activeLegacyPO, setActiveLegacyPO] = useState<PurchaseOrder | null>(null);
  const [newLegacyStatus, setNewLegacyStatus] = useState<OrderStatus>('dispatched');
  const [dispatchNotes, setDispatchNotes] = useState('Dispatched via Logistics Van.');

  const mySPOs = supplierPOs.filter(s => s.supplierCompanyId === currentCompany.id);
  const myLegacyOrders = purchaseOrders.filter(p => p.supplierCompanyId === currentCompany.id);

  const handleUpdateSPOStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSPO) return;
    const ful = orderFulfilments.find(f => f.spoId === activeSPO.id || f.cpoId === activeSPO.cpoId);
    if (ful) {
      updateFulfilmentStage(ful.id, selectedStage, {
        trackingReference: trackingRef,
        deliveredItemsSummary: logisticsNote,
      });
    }
    setActiveSPO(null);
  };

  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docModalSPO || !docTitle.trim()) return;
    uploadDeliveryDocument({
      cpoId: docModalSPO.cpoId,
      spoId: docModalSPO.id,
      documentType: docType,
      documentNumber: `DOC-${Date.now().toString().slice(-4)}`,
      fileName: docTitle.trim(),
      fileUrl: `https://procuresouq.ae/docs/${docModalSPO.spoNumber}-${docType}.pdf`,
      uploadedByRole: 'supplier',
      uploadedByName: currentCompany.name,
      visibleToBuyer: true,
    });
    setDocTitle('');
    setDocModalSPO(null);
  };

  const handlePrintSPO = (spo: SupplierPurchaseOrder) => {
    const win = window.open('', '_blank', 'width=850,height=700');
    if (!win) return;
    const rows = spo.items.map((it, idx) => `
      <tr>
        <td style="padding:8px;border:1px solid #cbd5e1;">${idx + 1}</td>
        <td style="padding:8px;border:1px solid #cbd5e1;"><strong>${it.itemDescription}</strong><br/><span style="font-size:11px;color:#64748b;">Brand: ${it.offeredBrand}</span></td>
        <td style="padding:8px;border:1px solid #cbd5e1;text-align:right;">${it.quantity} ${it.unit}</td>
        <td style="padding:8px;border:1px solid #cbd5e1;text-align:right;">AED ${it.unitPriceAED.toFixed(2)}</td>
        <td style="padding:8px;border:1px solid #cbd5e1;text-align:right;font-weight:bold;">AED ${it.totalPriceAED.toFixed(2)}</td>
      </tr>
    `).join('');
    win.document.write(`
      <html>
        <head><title>Supplier Purchase Order - ${spo.spoNumber}</title></head>
        <body style="font-family:Inter,Arial,sans-serif;padding:32px;color:#0f172a;">
          <div style="display:flex;justify-content:space-between;border-bottom:2px solid #0f172a;padding-bottom:16px;margin-bottom:20px;">
            <div>
              <h1 style="margin:0;font-size:20px;">SUPPLIER PURCHASE ORDER (INTERNAL PROCUREMENT)</h1>
              <p style="margin:4px 0 0;font-size:12px;color:#475569;">Issued by: ${commercialSettings.contractingEntityName}</p>
            </div>
            <div style="text-align:right;">
              <div style="font-family:monospace;font-size:16px;font-weight:bold;color:#0284c7;">${spo.spoNumber}</div>
              <div style="font-size:11px;color:#64748b;">RFQ Ref: ${spo.rfqNumber}</div>
            </div>
          </div>
          <p style="font-size:12px;"><strong>Awarded Supplier:</strong> ${spo.supplierCompanyName}</p>
          <p style="font-size:12px;"><strong>Fulfilment Mode:</strong> ${spo.fulfilmentMode === 'procuresouq_arranged' ? 'ProcureSouq-Arranged Pickup & Delivery' : 'Supplier Direct Delivery Coordinated by ProcureSouq'}</p>
          <p style="font-size:12px;"><strong>Delivery Destination:</strong> ${spo.deliveryDestination} • <strong>Expected Dispatch:</strong> ${spo.expectedDispatchDate}</p>
          <table style="width:100%;border-collapse:collapse;font-size:12px;margin-top:16px;">
            <thead style="background:#f1f5f9;">
              <tr>
                <th style="padding:8px;border:1px solid #cbd5e1;text-align:left;">#</th>
                <th style="padding:8px;border:1px solid #cbd5e1;text-align:left;">Item & Brand</th>
                <th style="padding:8px;border:1px solid #cbd5e1;text-align:right;">Qty</th>
                <th style="padding:8px;border:1px solid #cbd5e1;text-align:right;">Unit Cost</th>
                <th style="padding:8px;border:1px solid #cbd5e1;text-align:right;">Line Total</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <div style="margin-top:16px;text-align:right;font-size:13px;">
            <div>Material Subtotal: <strong>AED ${spo.supplierSubtotalAED.toFixed(2)}</strong></div>
            <div>Freight / Delivery Fee: <strong>AED ${spo.freightCostAED.toFixed(2)}</strong></div>
            <div>5% UAE VAT: <strong>AED ${spo.vatAED.toFixed(2)}</strong></div>
            <div style="font-size:16px;margin-top:6px;">Total Supplier PO Value: <strong>AED ${spo.supplierTotalAED.toFixed(2)}</strong></div>
          </div>
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
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Supplier Purchase Orders (`PS-SPO`) & Fulfilment</h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Official Supplier Purchase Orders issued by ProcureSouq Managed Procurement Desk. Confirm orders, update dispatch readiness, and upload Delivery Notes / PODs.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 text-xs font-bold bg-slate-900 text-white px-3.5 py-2 rounded-xl">
          <Lock className="w-4 h-4 text-amber-400" />
          <span>Counterparty: ProcureSouq Managed Desk</span>
        </div>
      </div>

      {/* V2 Supplier Purchase Orders (`PS-SPO-2026-XXXX`) */}
      {mySPOs.length > 0 ? (
        <div className="space-y-4">
          {mySPOs.map((spo) => {
            const ful = orderFulfilments.find(f => f.spoId === spo.id || f.cpoId === spo.cpoId);
            const spoDocs = deliveryDocuments.filter(d => d.spoId === spo.id || d.cpoId === spo.cpoId);
            const currentStageIdx = ful ? STAGE_ORDER.findIndex(s => s.id === ful.currentStage) : 0;

            return (
              <Card key={spo.id} className="hover:border-slate-300 transition-all">
                <CardContent className="p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="font-mono font-bold text-xs bg-brand-700 text-white px-2.5 py-0.5 rounded">
                          {spo.spoNumber}
                        </span>
                        <span className="text-xs font-mono text-slate-500">RFQ: {spo.rfqNumber}</span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          spo.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : spo.status === 'supplier_confirmed'
                            ? 'bg-sky-50 text-sky-800 border-sky-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {spo.status.replace(/_/g, ' ').toUpperCase()}
                        </span>
                        <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                          {spo.fulfilmentMode === 'procuresouq_arranged'
                            ? '🚚 ProcureSouq-Arranged Pickup & Delivery'
                            : '🏭 Supplier Direct Delivery (Coordinated by ProcureSouq)'}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">
                        ProcureSouq Managed Order ({spo.items.length} Line Items)
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Contracting Buyer: <strong className="text-slate-800">{commercialSettings.contractingEntityName}</strong> • Payment Terms: <strong>{spo.paymentTerms}</strong>
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <span className="text-[11px] text-slate-400 block font-semibold uppercase">Agreed Supplier PO Total (Incl. VAT)</span>
                      <span className="text-xl font-extrabold font-mono text-slate-900">{formatAED(spo.supplierTotalAED)}</span>
                    </div>
                  </div>

                  {/* 6-Stage Fulfilment Stepper */}
                  {ful && (
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">6-Stage Fulfilment & Delivery Timeline</span>
                        {ful.trackingReference && (
                          <span className="font-mono text-[11px] text-brand-700 font-bold">
                            Tracking Ref: {ful.trackingReference}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-1">
                        {STAGE_ORDER.map((st, idx) => {
                          const done = idx <= currentStageIdx;
                          return (
                            <div
                              key={st.id}
                              className={`p-2 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 ${
                                done
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                                  : 'bg-white border-slate-200 text-slate-400'
                              }`}
                            >
                              <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${done ? 'text-emerald-600' : 'text-slate-300'}`} />
                              <span className="truncate">{st.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                    <div>
                      <span className="text-slate-400 block">Dispatch / Coordination Site:</span>
                      <strong className="text-slate-800">{spo.deliveryDestination}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Expected Dispatch Date:</span>
                      <strong className="text-slate-800">{formatDate(spo.expectedDispatchDate)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Attached Fulfilment Docs:</span>
                      <strong className="text-brand-700">{spoDocs.length} Document(s) (DN / POD / Certs)</strong>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePrintSPO(spo)}
                        leftIcon={<Printer className="w-3.5 h-3.5" />}
                      >
                        Print Supplier PO ({spo.spoNumber})
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDocModalSPO(spo)}
                        leftIcon={<Upload className="w-3.5 h-3.5" />}
                      >
                        Upload DN / POD / Cert
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      {spo.status === 'issued_to_supplier' && (
                        <Button
                          variant="amber"
                          size="sm"
                          onClick={() => confirmSupplierPO(spo.id, 'confirmed', 'Confirmed by supplier via portal')}
                          leftIcon={<PackageCheck className="w-4 h-4" />}
                        >
                          Confirm Supplier PO
                        </Button>
                      )}
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setActiveSPO(spo);
                          setSelectedStage('ready_for_dispatch');
                        }}
                        leftIcon={<Truck className="w-4 h-4" />}
                      >
                        Update Fulfilment Stage
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : myLegacyOrders.length > 0 ? (
        <div className="space-y-4">
          {myLegacyOrders.map((po) => (
            <Card key={po.id} className="hover:border-slate-300 transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded">
                        {po.poNumber}
                      </span>
                      <StatusBadge status={po.status} />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{po.rfqTitle}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Counterparty: <strong className="text-slate-800">ProcureSouq Managed Procurement Desk</strong>
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <span className="text-xs text-slate-400 block font-medium">Order Value</span>
                    <span className="text-xl font-extrabold text-slate-900">{formatAED(po.totalAmountAED)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-3 mt-2">
                  <span className="text-xs text-slate-500">
                    Current Status: <strong className="text-slate-800 capitalize">{po.status.replace('_', ' ')}</strong>
                  </span>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setActiveLegacyPO(po);
                      setNewLegacyStatus('dispatched');
                    }}
                    leftIcon={<Truck className="w-4 h-4" />}
                  >
                    Update Fulfillment Status
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center space-y-4 border-dashed border-2 border-slate-200 bg-slate-50/50">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto font-bold">
            <Truck className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-base font-bold text-slate-900">No Supplier Purchase Orders (`PS-SPO`) Awarded Yet</h3>
            <p className="text-xs text-slate-500">
              When ProcureSouq awards your quotation and issues a Supplier Purchase Order (`PS-SPO-2026-XXXX`), it will appear here for confirmation and dispatch coordination.
            </p>
          </div>
        </Card>
      )}

      {/* Update V2 SPO Fulfilment Stage Modal */}
      <Modal
        isOpen={!!activeSPO}
        onClose={() => setActiveSPO(null)}
        title="Update Supplier Fulfilment & Dispatch Stage"
        subtitle={activeSPO ? `Supplier PO: ${activeSPO.spoNumber}` : ''}
      >
        <form onSubmit={handleUpdateSPOStage} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Fulfilment Stage</label>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value as FulfilmentStage)}
              className="w-full p-2.5 rounded-lg border border-slate-200 font-bold"
            >
              <option value="supplier_confirmed">3. Supplier Confirmed (Stock Reserved)</option>
              <option value="ready_for_dispatch">4. Ready for Dispatch (Packed & Inspected)</option>
              <option value="in_transit">5. In Transit (Dispatched to Site)</option>
              <option value="delivered">6. Delivered (Handed Over on Site)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Delivery Note / Tracking Reference</label>
            <input
              type="text"
              value={trackingRef}
              onChange={(e) => setTrackingRef(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 font-mono"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Dispatch & Coordination Notes</label>
            <textarea
              rows={3}
              value={logisticsNote}
              onChange={(e) => setLogisticsNote(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setActiveSPO(null)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Fulfilment Stage
            </Button>
          </div>
        </form>
      </Modal>

      {/* Upload Delivery Note / POD Modal */}
      <Modal
        isOpen={!!docModalSPO}
        onClose={() => setDocModalSPO(null)}
        title="Upload Fulfilment Document (DN / POD / Test Certificate)"
        subtitle={docModalSPO ? `Linked to ${docModalSPO.spoNumber}` : ''}
      >
        <form onSubmit={handleUploadDoc} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Document Type</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value as any)}
              className="w-full p-2.5 rounded-lg border border-slate-200 font-bold"
            >
              <option value="delivery_note">Delivery Note (DN)</option>
              <option value="proof_of_delivery">Signed Proof of Delivery (POD)</option>
              <option value="test_certificate">Factory Test Certificate / Compliance Submittal</option>
              <option value="packing_list">Packing List / Mill Sheet</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Document Reference / Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Signed Delivery Note DN-2026-4410"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Select PDF / Scan File</label>
            <input
              type="file"
              accept=".pdf,.png,.jpg"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f && !docTitle) setDocTitle(f.name);
              }}
              className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setDocModalSPO(null)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Upload Document
            </Button>
          </div>
        </form>
      </Modal>

      {/* Legacy PO Modal */}
      <Modal
        isOpen={!!activeLegacyPO}
        onClose={() => setActiveLegacyPO(null)}
        title="Update Order Fulfillment Status"
        subtitle={activeLegacyPO ? 'PO #' + activeLegacyPO.poNumber : ''}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!activeLegacyPO) return;
            updateOrderStatus(activeLegacyPO.id, newLegacyStatus, dispatchNotes);
            setActiveLegacyPO(null);
          }}
          className="space-y-4 text-xs"
        >
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Select New Status</label>
            <select
              value={newLegacyStatus}
              onChange={(e) => setNewLegacyStatus(e.target.value as OrderStatus)}
              className="w-full p-2.5 rounded-lg border border-slate-200 font-bold"
            >
              <option value="accepted">Accepted</option>
              <option value="processing">In Processing</option>
              <option value="dispatched">Dispatched</option>
              <option value="delivered">Delivered</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setActiveLegacyPO(null)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Status Update
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};