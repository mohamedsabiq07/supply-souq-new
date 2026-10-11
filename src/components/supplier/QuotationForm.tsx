import React, { useState, useMemo } from 'react';
import { RFQ } from '../../types';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { formatAED, calculateUAEVAT } from '../../lib/utils';
import { calculateSpotLogistics, SpotLogisticsCalculation } from '../../lib/logisticsCalculator';
import {
  Send,
  CheckCircle2,
  Zap,
  Truck,
  MapPin,
  ShieldCheck,
  Sparkles,
  FileText,
  Lock,
  AlertTriangle
} from 'lucide-react';

interface QuotationFormProps {
  rfq: RFQ;
  supplierCompany: {
    id: string;
    name: string;
    emirate: any;
    industrialZone: string;
    rating: number;
  };
  onSubmitQuote: (quoteData: any) => void;
  onCancel: () => void;
}

export const QuotationForm: React.FC<QuotationFormProps> = ({
  rfq,
  supplierCompany,
  onSubmitQuote,
  onCancel,
}) => {
  const [items, setItems] = useState<Array<{
    rfqItemId: string;
    itemDescription: string;
    quantity: number;
    unit: string;
    unitPriceAED: number;
    offeredBrand: string;
    isAlternative: boolean;
    isQuoted: boolean;
    stockStatus: string;
    remarks: string;
  }>>(() => {
    return rfq.items.map(item => ({
      rfqItemId: item.id,
      itemDescription: item.description,
      quantity: item.quantity,
      unit: item.unit,
      unitPriceAED: item.unit === 'm' ? 24.50 : item.unit === 'pcs' ? 35.00 : 50.00,
      offeredBrand: item.preferredBrand?.split('/')[0]?.trim() || 'Standard Spec',
      isAlternative: false,
      isQuoted: true,
      stockStatus: 'Ex-Stock UAE',
      remarks: 'Original stock ready for dispatch',
    }));
  });

  const [quoteReference, setQuoteReference] = useState(
    `QT-${supplierCompany.name.slice(0, 3).toUpperCase()}-2026-${Math.floor(100 + Math.random() * 900)}`
  );
  const [stockAvailability, setStockAvailability] = useState('In Stock — Immediate Dispatch from UAE Warehouse');
  const [vatTreatment, setVatTreatment] = useState('5% Standard UAE VAT');
  const [supportingPdfName, setSupportingPdfName] = useState('');

  const [leadTimeDays, setLeadTimeDays] = useState(2);
  const [leadTimeDisplay, setLeadTimeDisplay] = useState('2 Days (Warehouse stock ready)');
  const [warrantyPeriod, setWarrantyPeriod] = useState('1 Year Standard Manufacturer Warranty');
  const [paymentTerms, setPaymentTerms] = useState('30 Days Net from Invoice Delivery');
  const [validityDays, setValidityDays] = useState(15);
  const [deliveryMethod, setDeliveryMethod] = useState<'supplier_fleet' | 'supplysouq_managed'>('supplysouq_managed');
  const [discountAED, setDiscountAED] = useState(0);
  const [notes, setNotes] = useState('All materials comply with UAE standards and DEWA / Civil Defense requirements. Test certificates will accompany delivery.');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const spotLogistics: SpotLogisticsCalculation = useMemo(() => {
    return calculateSpotLogistics({
      supplierShopName: supplierCompany.name,
      supplierZone: supplierCompany.industrialZone,
      supplierEmirate: supplierCompany.emirate,
      deliveryAddress: rfq.deliveryEmirate,
      deliveryEmirate: rfq.deliveryEmirate,
      offloadingRequired: rfq.offloadingRequired,
      totalItemsCount: items.filter(i => i.isQuoted).length || 1,
      category: rfq.category,
    });
  }, [supplierCompany, rfq, items]);

  const [deliveryChargeAED, setDeliveryChargeAED] = useState<number>(spotLogistics.spotDeliveryFeeAED);

  const handleDeliveryMethodChange = (method: 'supplier_fleet' | 'supplysouq_managed') => {
    setDeliveryMethod(method);
    if (method === 'supplysouq_managed') {
      setDeliveryChargeAED(spotLogistics.spotDeliveryFeeAED);
    } else {
      setDeliveryChargeAED(0);
    }
  };

  const handleToggleItemQuoted = (index: number, checked: boolean) => {
    const next = [...items];
    next[index].isQuoted = checked;
    setItems(next);
  };

  const handlePriceChange = (index: number, val: number) => {
    const next = [...items];
    next[index].unitPriceAED = val;
    setItems(next);
  };

  const handleBrandChange = (index: number, val: string) => {
    const next = [...items];
    next[index].offeredBrand = val;
    setItems(next);
  };

  const handleRemarksChange = (index: number, val: string) => {
    const next = [...items];
    next[index].remarks = val;
    setItems(next);
  };

  const quotedItems = items.filter(i => i.isQuoted);
  const isPartialQuote = quotedItems.length < items.length;
  const lineTotals = items.map(item => (item.isQuoted ? item.quantity * (item.unitPriceAED || 0) : 0));
  const subtotal = lineTotals.reduce((acc, curr) => acc + curr, 0);
  const subtotalAfterDiscount = Math.max(0, subtotal - (Number(discountAED) || 0));
  const vat = calculateUAEVAT(subtotalAfterDiscount);
  const grandTotal = subtotalAfterDiscount + vat + (Number(deliveryChargeAED) || 0);

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (quotedItems.length === 0) {
      alert('Please select at least 1 line item to quote.');
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const handleFinalSubmit = () => {
    setIsConfirmModalOpen(false);
    const validityDate = new Date();
    validityDate.setDate(validityDate.getDate() + validityDays);

    const quotationPayload = {
      rfqId: rfq.id,
      rfqNumber: rfq.rfqNumber,
      rfqTitle: rfq.title,
      buyerCompanyId: rfq.buyerCompanyId,
      buyerCompanyName: rfq.buyerCompanyName,
      supplierCompanyId: supplierCompany.id,
      supplierCompanyName: supplierCompany.name,
      supplierEmirate: supplierCompany.emirate,
      supplierZone: supplierCompany.industrialZone,
      supplierRating: supplierCompany.rating,
      supplierVerified: true,
      quoteReference: quoteReference,
      vatTreatment: vatTreatment,
      stockAvailability: stockAvailability,
      quotationPdfUrl: supportingPdfName ? `https://procuresouq.ae/docs/quotes/${supportingPdfName}` : undefined,
      isPartialQuote,
      quotedItemsCount: quotedItems.length,
      totalRfqItemsCount: items.length,
      subtotalAED: subtotal,
      discountAED: Number(discountAED) || 0,
      vatAED: vat,
      deliveryChargeAED: Number(deliveryChargeAED) || 0,
      grandTotalAED: grandTotal,
      leadTimeDays: Number(leadTimeDays),
      leadTimeDisplay: leadTimeDisplay,
      warrantyPeriod: warrantyPeriod,
      paymentTerms: paymentTerms,
      validityDate: validityDate.toISOString().split('T')[0],
      notes: notes,
      deliveryMethod: deliveryMethod,
      deliveryDetails: deliveryMethod === 'supplysouq_managed' ? {
        pickupZone: spotLogistics.pickupZone,
        deliveryAddress: `${rfq.deliveryEmirate} Project Site`,
        estimatedDistanceKm: spotLogistics.estimatedDistanceKm,
        vehicleType: spotLogistics.vehicleType,
        spotDeliveryFeeAED: spotLogistics.spotDeliveryFeeAED,
      } : undefined,
      items: items.map((item, idx) => ({
        id: `qitem-${Date.now()}-${idx}`,
        rfqItemId: item.rfqItemId,
        itemDescription: item.itemDescription,
        quantity: item.quantity,
        unit: item.unit,
        unitPriceAED: item.isQuoted ? Number(item.unitPriceAED) : 0,
        offeredBrand: item.isQuoted ? item.offeredBrand : 'Not Quoted',
        isAlternative: item.isAlternative,
        isQuoted: item.isQuoted,
        stockStatus: item.stockStatus,
        totalPriceAED: item.isQuoted ? item.quantity * Number(item.unitPriceAED) : 0,
        remarks: item.isQuoted ? item.remarks : 'Excluded from partial quotation',
      })),
    };

    onSubmitQuote(quotationPayload);
  };

  return (
    <form onSubmit={handleOpenConfirm} className="space-y-6">
      {/* Sanitized Header — Buyer Contact Information Masked */}
      <div className="bg-brand-50/70 p-4 rounded-xl border border-brand-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-mono font-bold text-brand-700 bg-white px-2 py-0.5 rounded border border-brand-200">
              {rfq.rfqNumber}
            </span>
            {rfq.authorityApproval && (
              <span className="text-[10px] font-bold text-rose-800 bg-rose-100/70 px-2 py-0.5 rounded border border-rose-300">
                {rfq.authorityApproval}
              </span>
            )}
            {rfq.offloadingRequired && (
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded border border-amber-300">
                🚚 Crane Offload Required
              </span>
            )}
            <span className="text-[10px] font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 inline-flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-600" /> Counterparty: ProcureSouq Managed Desk
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 mt-1">{rfq.title}</h4>
          <p className="text-slate-500 mt-0.5">
            Contracting Entity: <strong className="text-slate-800">ProcureSouq Managed Procurement Desk</strong> • Delivery Emirate: <strong>{rfq.deliveryEmirate}</strong>
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-slate-500">Submitting Supplier Quote As:</span>
          <p className="font-bold text-slate-900">{supplierCompany.name}</p>
        </div>
      </div>

      {/* Supplier Reference, Stock Availability, VAT Treatment & PDF Upload */}
      <Card>
        <CardHeader>
          <div>
            <h4 className="text-sm font-bold text-slate-900">1. Supplier Quotation Metadata & Supporting Document</h4>
            <p className="text-xs text-slate-500">Provide your official quotation reference, stock availability, VAT treatment, and optional signed PDF quotation.</p>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Supplier Quotation Reference #</label>
            <input
              type="text"
              required
              value={quoteReference}
              onChange={(e) => setQuoteReference(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 font-mono font-bold text-slate-900"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Overall Stock Availability</label>
            <select
              value={stockAvailability}
              onChange={(e) => setStockAvailability(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 font-medium"
            >
              <option value="In Stock — Immediate Dispatch from UAE Warehouse">In Stock — Immediate Dispatch</option>
              <option value="Partial Stock — Balance in 3–5 Days">Partial Stock — Balance in 3–5 Days</option>
              <option value="Factory Order / Indent (7–14 Days)">Factory Order / Indent (7–14 Days)</option>
            </select>
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">UAE VAT Treatment</label>
            <select
              value={vatTreatment}
              onChange={(e) => setVatTreatment(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 font-medium"
            >
              <option value="5% Standard UAE VAT">5% Standard UAE VAT</option>
              <option value="0% Designated Free Zone Export">0% Designated Free Zone Export</option>
            </select>
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Supporting Quotation PDF (Optional)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setSupportingPdfName(e.target.files?.[0]?.name || '')}
              className="w-full p-1.5 rounded-lg border border-slate-200 text-[11px] bg-slate-50"
            />
            {supportingPdfName && (
              <span className="text-[10px] text-emerald-700 font-bold block mt-1">✓ Attached: {supportingPdfName}</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Partial Quote Warning Banner if any item is unchecked */}
      {isPartialQuote && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Partial Quotation Mode ({quotedItems.length} of {items.length} items quoted):</strong> Unchecked items will be flagged as excluded for ProcureSouq Technical Review.
            </span>
          </div>
          <span className="font-mono font-bold bg-amber-100 px-2.5 py-1 rounded border border-amber-300">
            {quotedItems.length}/{items.length} Items Quoted
          </span>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
            <div>
              <h4 className="text-sm font-bold text-slate-900">2. Itemized Pricing & Brand Specifications</h4>
              <p className="text-xs text-slate-500">Uncheck an item if you cannot supply it (partial quotation). Click any approved brand to auto-fill.</p>
            </div>
            <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200">
              Quoting {quotedItems.length} of {items.length} BOQ Items
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Quote?</th>
                <th className="p-3">#</th>
                <th className="p-3 min-w-[260px]">Item, Required Spec & Approved Brands</th>
                <th className="p-3">Qty & Unit</th>
                <th className="p-3 min-w-[150px]">Offered Brand</th>
                <th className="p-3 min-w-[120px]">Unit Cost (AED)</th>
                <th className="p-3 text-right">Line Total (AED)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, idx) => {
                const lineTotal = item.isQuoted ? item.quantity * (item.unitPriceAED || 0) : 0;
                const rfqItem = rfq.items.find(i => i.id === item.rfqItemId) || rfq.items[idx];
                const approvedBrands = rfqItem?.preferredBrands || (rfqItem?.preferredBrand ? rfqItem.preferredBrand.split('/').map(b => b.trim()) : []);

                return (
                  <tr key={idx} className={`hover:bg-slate-50/50 ${!item.isQuoted ? 'opacity-50 bg-slate-50' : ''}`}>
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={item.isQuoted}
                        onChange={(e) => handleToggleItemQuoted(idx, e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                        title="Check to include this item in your quotation"
                      />
                    </td>
                    <td className="p-3 font-mono font-semibold text-slate-400">{idx + 1}</td>
                    <td className="p-3">
                      <p className="font-bold text-slate-900">{item.itemDescription}</p>
                      {rfqItem?.specification && (
                        <p className="text-[11px] text-slate-500 mt-0.5">{rfqItem.specification}</p>
                      )}

                      <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Approved:</span>
                        {approvedBrands.length > 0 ? (
                          approvedBrands.map((b) => (
                            <button
                              key={b}
                              type="button"
                              disabled={!item.isQuoted}
                              onClick={() => handleBrandChange(idx, b)}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-all ${
                                item.offeredBrand === b
                                  ? 'bg-brand-600 text-white border-brand-700 shadow-sm'
                                  : 'bg-brand-50 text-brand-700 border-brand-200 hover:bg-brand-100'
                              }`}
                            >
                              ✓ {b}
                            </button>
                          ))
                        ) : (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                            {rfqItem?.preferredBrand || 'Open Spec'}
                          </span>
                        )}
                      </div>

                      <input
                        type="text"
                        disabled={!item.isQuoted}
                        value={item.remarks}
                        onChange={(e) => handleRemarksChange(idx, e.target.value)}
                        placeholder="Add technical compliance notes / model number..."
                        className="mt-2 w-full text-[11px] p-1.5 rounded border border-slate-200 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                      />
                    </td>
                    <td className="p-3 font-bold text-slate-700">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        required={item.isQuoted}
                        disabled={!item.isQuoted}
                        value={item.isQuoted ? item.offeredBrand : 'Not Quoted'}
                        onChange={(e) => handleBrandChange(idx, e.target.value)}
                        placeholder="e.g. Ducab"
                        className="w-full text-xs p-1.5 rounded border border-slate-200 font-bold text-brand-700 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                      />
                    </td>
                    <td className="p-3">
                      <div className="relative">
                        <span className="absolute left-2 top-2 text-[10px] text-slate-400">AED</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          required={item.isQuoted}
                          disabled={!item.isQuoted}
                          value={item.isQuoted ? item.unitPriceAED : 0}
                          onChange={(e) => handlePriceChange(idx, parseFloat(e.target.value) || 0)}
                          className="w-full text-xs font-bold pl-10 pr-2 py-1.5 rounded border border-slate-200 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                        />
                      </div>
                    </td>
                    <td className="p-3 text-right font-extrabold text-slate-900">
                      {item.isQuoted ? formatAED(lineTotal) : <span className="text-slate-400 italic">Excluded</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h4 className="text-sm font-bold text-slate-900">3. Delivery & Commercial Terms</h4>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="space-y-2 pb-3 border-b border-slate-100">
              <label className="font-bold text-slate-800 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-brand-600" />
                  Fulfilment & Logistics Mode
                </span>
                <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                  Emirate: {rfq.deliveryEmirate}
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div
                  onClick={() => handleDeliveryMethodChange('supplysouq_managed')}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    deliveryMethod === 'supplysouq_managed'
                      ? 'border-brand-600 bg-brand-50/50 shadow-sm ring-1 ring-brand-500'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${deliveryMethod === 'supplysouq_managed' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          ProcureSouq Pickup
                        </div>
                        <div className="text-[11px] text-slate-500">ProcureSouq coordinates collection</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-brand-700 text-xs">{formatAED(spotLogistics.spotDeliveryFeeAED)}</div>
                      <div className="text-[10px] text-slate-400">Est. freight</div>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => handleDeliveryMethodChange('supplier_fleet')}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    deliveryMethod === 'supplier_fleet'
                      ? 'border-brand-600 bg-brand-50/50 shadow-sm ring-1 ring-brand-500'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${deliveryMethod === 'supplier_fleet' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">Supplier Direct Delivery</div>
                        <div className="text-[11px] text-slate-500">Coordinated by ProcureSouq</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-slate-700 text-xs">Supplier Fleet</div>
                      <div className="text-[10px] text-slate-400">Custom charge</div>
                    </div>
                  </div>
                </div>
              </div>

              {deliveryMethod === 'supplier_fleet' && (
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 mt-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-800">Supplier Delivery Charge (AED)</span>
                      <p className="text-[11px] text-slate-500">Enter 0 for free delivery or your freight charge.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-400 text-xs">AED</span>
                      <input
                        type="number"
                        min="0"
                        value={deliveryChargeAED}
                        onChange={(e) => setDeliveryChargeAED(parseFloat(e.target.value) || 0)}
                        className="w-24 text-right p-1.5 rounded-lg border border-slate-300 text-xs font-bold focus:ring-brand-500 bg-white"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Lead Time (Days)</label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 4].map(days => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => {
                      setLeadTimeDays(days);
                      setLeadTimeDisplay(`${days} Day${days > 1 ? 's' : ''} (${days === 1 ? 'Express Next-Day' : 'In-Stock Delivery'})`);
                    }}
                    className={`p-2 rounded-lg border text-center font-medium transition-all ${
                      leadTimeDays === days
                        ? 'bg-brand-50 border-brand-500 text-brand-700 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {days} {days === 1 ? 'Day (Express)' : 'Days'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Warranty Period</label>
              <select
                value={warrantyPeriod}
                onChange={(e) => setWarrantyPeriod(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 text-xs font-medium focus:ring-brand-500"
              >
                <option value="1 Year Standard Manufacturer Warranty">1 Year Standard Manufacturer Warranty</option>
                <option value="2 Years Extended Project Warranty">2 Years Extended Project Warranty</option>
                <option value="3 Years Comprehensive LED & Driver Guarantee">3 Years Comprehensive LED & Driver Guarantee</option>
                <option value="As per Manufacturer Policy">As per Manufacturer Policy</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Payment Terms (with ProcureSouq)</label>
              <select
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 text-xs font-medium focus:ring-brand-500"
              >
                <option value="30 Days Net from Invoice Delivery">30 Days Net from Invoice Delivery</option>
                <option value="30 Days Post-Dated Cheque (PDC)">30 Days Post-Dated Cheque (PDC)</option>
                <option value="50% Advance / 50% on Site Delivery">50% Advance / 50% on Site Delivery</option>
                <option value="100% Advance Payment">100% Advance Payment</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Quotation Validity</label>
              <select
                value={validityDays}
                onChange={(e) => setValidityDays(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-slate-200 text-xs font-medium focus:ring-brand-500"
              >
                <option value={15}>15 Days</option>
                <option value={30}>30 Days</option>
                <option value={45}>45 Days</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h4 className="text-sm font-bold text-slate-900">4. Supplier Cost Summary (AED)</h4>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Quoted Material Subtotal ({quotedItems.length}/{items.length} items):</span>
              <span className="font-bold text-slate-900">{formatAED(subtotal)}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Special Trade Discount (AED):</span>
              <input
                type="number"
                min="0"
                value={discountAED}
                onChange={(e) => setDiscountAED(parseFloat(e.target.value) || 0)}
                className="w-28 text-right p-1 rounded border border-slate-200 text-xs font-bold text-[#cf2e46] focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Delivery & Handling:</span>
              <span className="font-bold text-brand-700">{formatAED(deliveryChargeAED)}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600 pt-2 border-t border-slate-100">
              <span>5% UAE VAT:</span>
              <span className="font-bold text-slate-900">{formatAED(vat)}</span>
            </div>

            <div className="p-4 bg-slate-900 text-white rounded-xl mt-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Total Supplier Quotation to ProcureSouq
                </span>
                <span className="text-2xl font-extrabold text-white">
                  {formatAED(grandTotal)}
                </span>
              </div>
              <span className="text-xs bg-[#cf2e46]/20 text-[#fb7187] px-2 py-1 rounded border border-[#cf2e46]/30 font-semibold">
                {vatTreatment}
              </span>
            </div>

            <div className="pt-2">
              <label className="font-semibold text-slate-700 block mb-1">Technical & Commercial Remarks</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-slate-200 focus:ring-brand-500"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="amber"
          size="lg"
          leftIcon={<Send className="w-4 h-4" />}
        >
          Review & Submit Quotation to ProcureSouq ({quotedItems.length}/{items.length} Items)
        </Button>
      </div>

      {isConfirmModalOpen && (
        <Modal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          title="Confirm Supplier Quotation to ProcureSouq"
          subtitle="Verify your commercial pricing, stock availability, and technical compliance before transmitting to ProcureSouq Procurement Desk"
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-start gap-3">
              <Zap className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-amber-900 text-xs">
                  Confidential Submission to ProcureSouq Managed Procurement Desk
                </div>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Ref: <strong>{quoteReference}</strong> • Coverage: <strong>{quotedItems.length} of {items.length} items</strong> {isPartialQuote ? '(Partial Quotation)' : '(100% Complete BOQ)'}.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 font-semibold text-slate-700">
                <span>Quoted Line Items ({rfq.rfqNumber})</span>
                <span className="text-slate-500">{quotedItems.length} of {items.length} Items</span>
              </div>

              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                {quotedItems.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px] bg-white p-2 rounded border border-slate-100">
                    <div className="truncate max-w-[280px]">
                      <span className="font-bold text-slate-900">{it.itemDescription}</span>
                      <div className="text-[10px] text-slate-500">
                        Brand: <span className="font-semibold text-brand-700">{it.offeredBrand}</span> • Qty: {it.quantity} {it.unit}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">{formatAED(it.quantity * (it.unitPriceAED || 0))}</div>
                      <div className="text-[10px] text-slate-400 font-mono">@{formatAED(it.unitPriceAED)}/{it.unit}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-xl p-3.5 space-y-1.5">
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Material Subtotal:</span>
                <span className="font-mono">{formatAED(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Delivery & Logistics:</span>
                <span className="font-mono">{formatAED(deliveryChargeAED)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>5% UAE VAT:</span>
                <span className="font-mono">{formatAED(vat)}</span>
              </div>
              <div className="pt-2 border-t border-slate-700 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Total Supplier Quote</span>
                  <span className="text-xl font-extrabold text-brand-400 font-mono">{formatAED(grandTotal)}</span>
                </div>
                <span className="text-xs bg-[#cf2e46]/20 text-rose-200 px-2.5 py-1 rounded font-semibold border border-[#cf2e46]/30">
                  {vatTreatment}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                Back to Edit
              </Button>
              <Button
                type="button"
                variant="amber"
                size="lg"
                onClick={handleFinalSubmit}
                leftIcon={<CheckCircle2 className="w-4 h-4 text-slate-900" />}
              >
                Confirm & Submit Formal Quotation
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </form>
  );
};
