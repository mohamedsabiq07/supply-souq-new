import React, { useState, useMemo } from 'react';
import { PurchaseOrder, DisputeRecord } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { formatAED, formatDate } from '../../lib/utils';
import {
  Truck,
  ShieldAlert,
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  DollarSign,
  MapPin,
  Eye,
  FileText
} from 'lucide-react';

interface AdminLogisticsDisputeProps {
  purchaseOrders: PurchaseOrder[];
  disputes?: DisputeRecord[];
  onUpdatePO?: (updatedPO: PurchaseOrder) => void;
  onUpdateDispute?: (updatedDispute: DisputeRecord) => void;
}

export const AdminLogisticsDispute: React.FC<AdminLogisticsDisputeProps> = ({
  purchaseOrders,
  disputes = [],
  onUpdatePO,
  onUpdateDispute,
}) => {
  const [activeTab, setActiveTab] = useState<'logistics' | 'disputes'>('logistics');
  const [previewPOD_PO, setPreviewPOD_PO] = useState<PurchaseOrder | null>(null);
  const [activeDispute, setActiveDispute] = useState<DisputeRecord | null>(null);

  // Seed sample disputes if empty
  const defaultDisputes: DisputeRecord[] = useMemo(() => {
    if (disputes && disputes.length > 0) return disputes;
    return [
      {
        id: 'disp-1',
        purchaseOrderId: 'po-1',
        poNumber: 'PO-2026-081',
        rfqNumber: 'RFQ-8919',
        buyerCompanyName: 'Apex MEP & General Contracting LLC',
        supplierCompanyName: 'Al Noor Electrical Trading LLC',
        issueType: 'spec_mismatch',
        description: 'Site engineer rejected 4-core 35mm² XLPE Cable; specification requires LSF (Low Smoke & Fume) jacket per DEWA standard.',
        disputedAmountAED: 18400,
        status: 'open',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'disp-2',
        purchaseOrderId: 'po-2',
        poNumber: 'PO-2026-074',
        rfqNumber: 'RFQ-8912',
        buyerCompanyName: 'Bin Ham Power Contracting LLC',
        supplierCompanyName: 'Sharjah Prime Electrical Stockists LLC',
        issueType: 'damaged_goods',
        description: '2 out of 10 Decoduct PVC conduit bundles suffered transit damage with cracked couplings upon unloading at Business Bay gate.',
        disputedAmountAED: 2650,
        status: 'under_investigation',
        createdAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
      },
    ];
  }, [disputes]);

  const [disputeList, setDisputeList] = useState<DisputeRecord[]>(defaultDisputes);

  // Approve POD
  const handleApprovePOD = (po: PurchaseOrder) => {
    if (!onUpdatePO) return;
    onUpdatePO({
      ...po,
      podStatus: 'approved',
      status: 'delivered',
      payoutStatus: 'released_to_supplier',
      updatedAt: new Date().toISOString(),
    });
    setPreviewPOD_PO(null);
  };

  // Resolve Dispute
  const handleResolveDispute = (disp: DisputeRecord, resolutionType: 'resolved_credit_note' | 'resolved_replacement' | 'refunded') => {
    const updated: DisputeRecord = {
      ...disp,
      status: resolutionType,
      resolvedAt: new Date().toISOString(),
      resolutionNotes: resolutionType === 'resolved_credit_note'
        ? 'Credit note issued against supplier next settlement.'
        : resolutionType === 'resolved_replacement'
        ? 'Supplier dispatched compliant replacement within 24h.'
        : 'Escrow payment refunded to contractor account.',
    };
    setDisputeList(prev => prev.map(d => d.id === disp.id ? updated : d));
    if (onUpdateDispute) onUpdateDispute(updated);
    setActiveDispute(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-sky-400" />
            <h3 className="text-base sm:text-lg font-extrabold tracking-tight">
              Order Fulfillment, Logistics Dispatch & Dispute Desk
            </h3>
            <span className="bg-sky-500/20 text-sky-300 text-[10px] font-bold px-2 py-0.5 rounded border border-sky-500/30">
              Site Delivery Operations
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Monitor physical delivery dispatches across Dubai, Sharjah, Ajman & Abu Dhabi. Verify signed Site Engineer Proof of Delivery (POD) notes and resolve contractor specification disputes.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700 text-center">
            <span className="text-xl font-extrabold text-sky-400 block">{purchaseOrders.length}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Orders</span>
          </div>
          <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700 text-center">
            <span className="text-xl font-extrabold text-amber-400 block">{disputeList.filter(d => d.status === 'open' || d.status === 'under_investigation').length}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Open Disputes</span>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('logistics')}
          className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all ${
            activeTab === 'logistics'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>🚚 Logistics Dispatch & POD Desk ({purchaseOrders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('disputes')}
          className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all ${
            activeTab === 'disputes'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>🛡️ Dispute Resolution Center ({disputeList.length})</span>
        </button>
      </div>

      {/* ---------------- SECTION 1: LOGISTICS DISPATCH & POD DESK ---------------- */}
      {activeTab === 'logistics' && (
        <Card className="shadow-lg border-slate-200">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">PO & Schedule</th>
                  <th className="p-3.5">Delivery Site & Emirate</th>
                  <th className="p-3.5">Fleet Method & Vehicle Class</th>
                  <th className="p-3.5">Order Status</th>
                  <th className="p-3.5">POD Verification</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {purchaseOrders.map((po) => {
                  const isManaged = po.deliveryMethod === 'supplysouq_managed';
                  const podStatus = po.podStatus || 'pending';

                  return (
                    <tr key={po.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-slate-900 text-xs mb-0.5">{po.poNumber}</div>
                        <div className="font-bold text-slate-900 truncate max-w-[200px]">{po.rfqTitle}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Buyer: <strong>{po.buyerCompanyName}</strong>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className="font-semibold text-slate-800 block">{po.deliveryAddress}</span>
                        <span className="text-[10px] font-bold text-slate-500">{po.deliveryEmirate} Gate</span>
                      </td>

                      <td className="p-3.5">
                        <div className="space-y-0.5">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                            isManaged
                              ? 'bg-brand-50 text-brand-900 border-brand-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {isManaged ? '⚡ SupplySouq Managed' : '🚛 Supplier In-House Fleet'}
                          </span>
                          <span className="text-[10px] text-slate-500 block font-mono">
                            {po.assignedVehicleType || '3-Ton Flatbed Deck'}
                          </span>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className="font-bold text-slate-800 uppercase text-[10px] bg-slate-100 px-2 py-0.5 rounded">
                          {po.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${
                          podStatus === 'approved'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}>
                          <FileCheck className="w-3 h-3" />
                          {podStatus === 'approved' ? '✓ POD Approved' : '⏳ Awaiting Site POD'}
                        </span>
                      </td>

                      <td className="p-3.5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setPreviewPOD_PO(po)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-[11px] shadow-2xs transition-all"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>Inspect Site POD</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* ---------------- SECTION 2: DISPUTE RESOLUTION DESK ---------------- */}
      {activeTab === 'disputes' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {disputeList.map((disp) => {
              const isResolved = disp.status.startsWith('resolved') || disp.status === 'refunded';

              return (
                <Card key={disp.id} className={`p-4 border-l-4 ${
                  isResolved
                    ? 'border-l-emerald-500 bg-emerald-50/20'
                    : 'border-l-rose-500 bg-rose-50/30'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-white text-slate-900 px-2 py-0.5 rounded border border-slate-200">
                          {disp.poNumber}
                        </span>
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          isResolved
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {disp.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-slate-400">• Logged: {formatDate(disp.createdAt)}</span>
                      </div>
                      <div className="font-bold text-slate-900 text-sm">
                        Issue: {disp.issueType === 'spec_mismatch' ? 'Specification Mismatch with Approved Submittal' : 'Transit Damage on Site Offloading'}
                      </div>
                      <p className="text-xs text-slate-600 max-w-2xl">{disp.description}</p>
                      <div className="text-[11px] text-slate-500 pt-1">
                        Contractor: <strong className="text-slate-700">{disp.buyerCompanyName}</strong> ➔ Supplier: <strong className="text-slate-700">{disp.supplierCompanyName}</strong>
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0 space-y-2">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Disputed Sum</span>
                        <span className="text-base font-extrabold text-rose-700 font-mono">{formatAED(disp.disputedAmountAED)}</span>
                      </div>

                      {!isResolved && (
                        <div className="flex flex-wrap items-center gap-1.5 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[11px] font-bold"
                            onClick={() => handleResolveDispute(disp, 'resolved_credit_note')}
                          >
                            Issue Credit Note
                          </Button>
                          <Button
                            variant="amber"
                            size="sm"
                            className="text-[11px] font-bold"
                            onClick={() => handleResolveDispute(disp, 'resolved_replacement')}
                          >
                            Order Replacement
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            className="text-[11px] font-bold bg-rose-600 hover:bg-rose-700"
                            onClick={() => handleResolveDispute(disp, 'refunded')}
                          >
                            Refund Escrow
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------------- MODAL: PROOF OF DELIVERY (POD) PREVIEW ---------------- */}
      {previewPOD_PO && (
        <Modal
          isOpen={Boolean(previewPOD_PO)}
          onClose={() => setPreviewPOD_PO(null)}
          title={`Proof of Delivery (POD): ${previewPOD_PO.poNumber}`}
          subtitle="Signed and Stamped Physical Delivery Note from Contractor Site"
          maxWidth="xl"
        >
          <div className="space-y-4 text-xs">
            {/* Delivery Note Mockup */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-300 space-y-4 text-slate-900">
              <div className="flex items-start justify-between pb-3 border-b border-slate-200">
                <div>
                  <div className="font-extrabold text-sm uppercase">SUPPLYSOUQ DISPATCH & LOGISTICS SLIP</div>
                  <div className="text-[10px] text-slate-500">Site Gate Delivery Receipt</div>
                </div>
                <div className="text-right font-mono font-bold text-xs text-slate-700">
                  {previewPOD_PO.poNumber}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Consignee Site Gate:</span>
                  <span className="font-bold text-slate-900 block">{previewPOD_PO.buyerCompanyName}</span>
                  <span className="text-[10px] text-slate-500">{previewPOD_PO.deliveryAddress} ({previewPOD_PO.deliveryEmirate})</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Delivering Fleet:</span>
                  <span className="font-bold text-slate-900 block">{previewPOD_PO.deliveryMethod === 'supplysouq_managed' ? 'SupplySouq Spot Dispatch' : 'In-House Supplier Fleet'}</span>
                  <span className="text-[10px] text-slate-500">Vehicle: {previewPOD_PO.assignedVehicleType || '3-Ton Flatbed Truck'}</span>
                </div>
              </div>

              {/* Items delivered */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Delivered Materials Checklist:</span>
                {previewPOD_PO.items?.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-[11px] py-0.5 border-b border-slate-100 last:border-0">
                    <span className="font-medium text-slate-800">✓ {it.quantity} {it.unit} • {it.itemDescription} ({it.offeredBrand})</span>
                    <span className="font-mono text-slate-500">Inspected OK</span>
                  </div>
                ))}
              </div>

              {/* Stamped Box */}
              <div className="p-3 bg-emerald-50/80 rounded-lg border-2 border-dashed border-emerald-400 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-800 font-bold block uppercase">Site Engineer Endorsement Stamp:</span>
                  <span className="font-bold text-emerald-950 text-xs">Eng. Tariq Mansour • Resident MEP Inspector</span>
                  <span className="text-[10px] text-emerald-700 block">Stamped & Signed upon gate offload</span>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-emerald-600 flex items-center justify-center font-bold text-emerald-700 text-[10px] rotate-12">
                  APPROVED
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <Button variant="outline" onClick={() => setPreviewPOD_PO(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => handleApprovePOD(previewPOD_PO)}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Approve POD & Release Supplier Settlement
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
