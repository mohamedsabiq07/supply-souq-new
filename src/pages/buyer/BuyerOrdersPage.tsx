import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { formatAED, formatDate } from '../../lib/utils';
import { PurchaseOrder } from '../../types';
import {
  Package,
  Truck,
  CheckCircle2,
  Star,
  FileText,
  Clock,
  MapPin,
  Building2,
  Phone
} from 'lucide-react';

export const BuyerOrdersPage: React.FC = () => {
  const { currentCompany } = useAuth();
  const { purchaseOrders, submitReview } = useAppData();
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [reviewModalPO, setReviewModalPO] = useState<PurchaseOrder | null>(null);

  const [rating, setRating] = useState(5);
  const [deliverySpeedRating, setDeliverySpeedRating] = useState(5);
  const [materialQualityRating, setMaterialQualityRating] = useState(5);
  const [comment, setComment] = useState('Materials received on schedule with full DEWA certificates. Excellent coordination.');

  const myOrders = purchaseOrders.filter(p => p.buyerCompanyId === currentCompany.id);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalPO) return;

    submitReview({
      purchaseOrderId: reviewModalPO.id,
      poNumber: reviewModalPO.poNumber,
      buyerCompanyId: currentCompany.id,
      buyerCompanyName: currentCompany.name,
      supplierCompanyId: reviewModalPO.supplierCompanyId,
      supplierCompanyName: reviewModalPO.supplierCompanyName,
      rating,
      deliverySpeedRating,
      materialQualityRating,
      comment,
    });

    setReviewModalPO(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Purchase Orders & Site Deliveries</h1>
        <p className="text-xs text-slate-500 mt-0.5">Track procurement fulfillment, digital POs, and rate verified suppliers upon delivery.</p>
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
                    <span className="text-xs text-slate-400">Ref: {po.quotationNumber}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{po.rfqTitle}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                    <span>Supplier: <strong className="text-slate-800 font-semibold">{po.supplierCompanyName}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {po.supplierPhone}</span>
                  </p>
                </div>

                <div className="sm:text-right">
                  <span className="text-xs text-slate-400 block font-medium">Total Value (Incl. 5% VAT)</span>
                  <span className="text-xl font-extrabold text-slate-900">{formatAED(po.totalAmountAED)}</span>
                </div>
              </div>

              <div className="py-4 my-2 border-b border-slate-100">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span className={po.status !== 'cancelled' ? 'text-brand-600 font-bold' : ''}>1. PO Issued</span>
                  <span className={['accepted', 'processing', 'dispatched', 'delivered', 'completed'].includes(po.status) ? 'text-brand-600 font-bold' : ''}>2. Accepted</span>
                  <span className={['processing', 'dispatched', 'delivered', 'completed'].includes(po.status) ? 'text-brand-600 font-bold' : ''}>3. Processing</span>
                  <span className={['dispatched', 'delivered', 'completed'].includes(po.status) ? 'text-brand-600 font-bold' : ''}>4. Out for Delivery</span>
                  <span className={['delivered', 'completed'].includes(po.status) ? 'text-emerald-600 font-bold' : ''}>5. Delivered on Site</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 my-2">
                <div>
                  <span className="text-slate-400 block">Delivery Site:</span>
                  <strong className="text-slate-800">{po.deliveryAddress}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Payment Terms:</span>
                  <strong className="text-slate-800">{po.paymentTerms}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Expected On Site:</span>
                  <strong className="text-slate-800">{formatDate(po.expectedDeliveryDate)}</strong>
                </div>
              </div>

              {po.trackingNotes && (
                <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 mt-3 border border-slate-200">
                  <strong className="text-slate-900 block mb-0.5">Delivery Notes / Dispatch Log:</strong>
                  {po.trackingNotes}
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-4 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedPO(po)}
                  leftIcon={<FileText className="w-4 h-4" />}
                >
                  View Digital PO Document
                </Button>

                {po.status === 'delivered' && !po.reviewedByBuyer && (
                  <Button
                    variant="amber"
                    size="sm"
                    onClick={() => setReviewModalPO(po)}
                    leftIcon={<Star className="w-4 h-4" />}
                  >
                    Rate Supplier Performance
                  </Button>
                )}

                {po.reviewedByBuyer && (
                  <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Rating Submitted
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={!!selectedPO}
        onClose={() => setSelectedPO(null)}
        title="Official Digital Purchase Order"
        subtitle={selectedPO ? selectedPO.poNumber : ''}
        maxWidth="2xl"
      >
        {selectedPO && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-900 text-white rounded-xl flex justify-between items-center">
              <div>
                <h4 className="text-lg font-bold">SupplySouq B2B Purchase Order</h4>
                <p className="text-slate-400">{selectedPO.poNumber}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-emerald-400 font-bold bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
                  5% UAE VAT Validated
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg">
              <div>
                <strong className="block text-slate-500">Buyer Entity:</strong>
                <p className="font-bold text-slate-900">{selectedPO.buyerCompanyName}</p>
                <p className="text-slate-600">{selectedPO.buyerContactName} • {selectedPO.buyerPhone}</p>
              </div>
              <div>
                <strong className="block text-slate-500">Awarded Supplier:</strong>
                <p className="font-bold text-slate-900">{selectedPO.supplierCompanyName}</p>
                <p className="text-slate-600">Tel: {selectedPO.supplierPhone}</p>
              </div>
            </div>

            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 font-bold">
                <tr>
                  <th className="p-2">Item</th>
                  <th className="p-2">Brand</th>
                  <th className="p-2">Qty</th>
                  <th className="p-2 text-right">Unit AED</th>
                  <th className="p-2 text-right">Total AED</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedPO.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2 font-medium">{item.itemDescription}</td>
                    <td className="p-2 text-slate-600">{item.offeredBrand}</td>
                    <td className="p-2 font-bold">{item.quantity} {item.unit}</td>
                    <td className="p-2 text-right">{formatAED(item.unitPriceAED, true)}</td>
                    <td className="p-2 text-right font-bold">{formatAED(item.totalPriceAED)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-3 bg-slate-50 rounded-lg space-y-1 text-right">
              <p>Subtotal: <strong>{formatAED(selectedPO.subtotalAED)}</strong></p>
              <p>5% UAE VAT: <strong>{formatAED(selectedPO.vatAED)}</strong></p>
              <p className="text-sm font-extrabold text-slate-900 pt-1 border-t border-slate-200">
                Total Purchase Order Value: {formatAED(selectedPO.totalAmountAED)}
              </p>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!reviewModalPO}
        onClose={() => setReviewModalPO(null)}
        title="Submit Verified Supplier Review"
        subtitle={reviewModalPO ? 'PO #' + reviewModalPO.poNumber : ''}
      >
        <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Overall Supplier Rating (1 to 5 Stars)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-2 text-base rounded-lg border ${
                    rating >= star ? 'bg-amber-50 text-amber-600 border-amber-300 font-bold' : 'bg-slate-50 text-slate-400'
                  }`}
                >
                  ★ {star}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Delivery Speed (1-5)</label>
              <select
                value={deliverySpeedRating}
                onChange={(e) => setDeliverySpeedRating(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-slate-200 font-medium"
              >
                <option value={5}>5 - On Time / Early</option>
                <option value={4}>4 - Minor Delay</option>
                <option value={3}>3 - Acceptable</option>
                <option value={2}>2 - Late</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Material Quality / Specs (1-5)</label>
              <select
                value={materialQualityRating}
                onChange={(e) => setMaterialQualityRating(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-slate-200 font-medium"
              >
                <option value={5}>5 - Exact Spec & Certified</option>
                <option value={4}>4 - Approved Equivalent</option>
                <option value={3}>3 - Acceptable</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Review Comments</label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setReviewModalPO(null)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit Review
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};