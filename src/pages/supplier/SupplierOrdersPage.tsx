import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { formatAED, formatDate } from '../../lib/utils';
import { PurchaseOrder, OrderStatus } from '../../types';
import { Truck, CheckCircle2, FileText, Phone } from 'lucide-react';

export const SupplierOrdersPage: React.FC = () => {
  const { currentCompany } = useAuth();
  const { purchaseOrders, updateOrderStatus } = useAppData();
  const [activePO, setActivePO] = useState<PurchaseOrder | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('dispatched');
  const [dispatchNotes, setDispatchNotes] = useState('Dispatched via Logistics Van. Driver contact: +971 55 490 2211');

  const myOrders = purchaseOrders.filter(p => p.supplierCompanyId === currentCompany.id);

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePO) return;
    updateOrderStatus(activePO.id, newStatus, dispatchNotes);
    setActivePO(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Purchase Orders & Fulfillment</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage awarded orders, update dispatch statuses, and confirm deliveries.</p>
      </div>

      <div className="space-y-4">
        {myOrders.map((po) => (
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
                    Buyer: <strong className="text-slate-800">{po.buyerCompanyName}</strong> • {po.buyerContactName} ({po.buyerPhone})
                  </p>
                </div>

                <div className="sm:text-right">
                  <span className="text-xs text-slate-400 block font-medium">Order Value</span>
                  <span className="text-xl font-extrabold text-slate-900">{formatAED(po.totalAmountAED)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 my-3">
                <div>
                  <span className="text-slate-400 block">Deliver To:</span>
                  <strong className="text-slate-800">{po.deliveryAddress}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Payment Terms:</span>
                  <strong className="text-slate-800">{po.paymentTerms}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Expected Date:</span>
                  <strong className="text-slate-800">{formatDate(po.expectedDeliveryDate)}</strong>
                </div>
              </div>

              {po.trackingNotes && (
                <div className="p-2.5 bg-slate-50 rounded-lg text-xs text-slate-700 border border-slate-200">
                  <strong className="text-slate-900 block mb-0.5">Dispatch & Tracking Log:</strong>
                  {po.trackingNotes}
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-3 mt-2 border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  Current Status: <strong className="text-slate-800 capitalize">{po.status.replace('_', ' ')}</strong>
                </span>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setActivePO(po);
                    setNewStatus(po.status === 'po_created' ? 'accepted' : po.status === 'accepted' ? 'dispatched' : 'delivered');
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

      <Modal
        isOpen={!!activePO}
        onClose={() => setActivePO(null)}
        title="Update Order Fulfillment Status"
        subtitle={activePO ? 'PO #' + activePO.poNumber : ''}
      >
        <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Select New Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
              className="w-full p-2.5 rounded-lg border border-slate-200 font-bold"
            >
              <option value="accepted">Accepted (Preparing stock in warehouse)</option>
              <option value="processing">In Processing (Testing & packaging cables/panels)</option>
              <option value="dispatched">Dispatched (Out for site delivery)</option>
              <option value="delivered">Delivered (Received & signed on site)</option>
              <option value="completed">Completed (Final invoice issued)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Dispatch / Tracking Notes</label>
            <textarea
              rows={3}
              value={dispatchNotes}
              onChange={(e) => setDispatchNotes(e.target.value)}
              placeholder="e.g. Dispatched via Logistics Van. Driver contact: +971 55 123 4567"
              className="w-full p-2.5 rounded-lg border border-slate-200"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setActivePO(null)}>
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