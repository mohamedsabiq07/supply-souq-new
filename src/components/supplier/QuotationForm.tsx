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
  Clock, 
  CreditCard, 
  Calendar, 
  Layers, 
  AlertCircle, 
  Info, 
  ArrowRight,
  Sparkles
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
      remarks: 'Original stock ready for dispatch',
    }));
  });

  const [leadTimeDays, setLeadTimeDays] = useState(2);
  const [leadTimeDisplay, setLeadTimeDisplay] = useState('2 Days (Warehouse stock ready)');
  const [warrantyPeriod, setWarrantyPeriod] = useState('1 Year Standard Manufacturer Warranty');
  const [paymentTerms, setPaymentTerms] = useState('30 Days Net from Delivery');
  const [validityDays, setValidityDays] = useState(15);
  const [deliveryMethod, setDeliveryMethod] = useState<'supplier_fleet' | 'supplysouq_managed'>('supplysouq_managed');
  const [discountAED, setDiscountAED] = useState(0);
  const [notes, setNotes] = useState('All materials comply with UAE standards and DEWA / Civil Defense requirements. Test certificates will accompany delivery.');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Spot logistics calculation based on supplier shop location and RFQ destination
  const spotLogistics: SpotLogisticsCalculation = useMemo(() => {
    return calculateSpotLogistics({
      supplierShopName: supplierCompany.name,
      supplierZone: supplierCompany.industrialZone,
      supplierEmirate: supplierCompany.emirate,
      deliveryAddress: rfq.deliveryAddress,
      deliveryEmirate: rfq.deliveryEmirate,
      offloadingRequired: rfq.offloadingRequired,
      totalItemsCount: items.length,
      category: rfq.category,
    });
  }, [supplierCompany, rfq, items.length]);

  const [deliveryChargeAED, setDeliveryChargeAED] = useState<number>(spotLogistics.spotDeliveryFeeAED);

  // Switch delivery method and auto-update charge
  const handleDeliveryMethodChange = (method: 'supplier_fleet' | 'supplysouq_managed') => {
    setDeliveryMethod(method);
    if (method === 'supplysouq_managed') {
      setDeliveryChargeAED(spotLogistics.spotDeliveryFeeAED);
    } else {
      setDeliveryChargeAED(0);
    }
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

  const lineTotals = items.map(item => item.quantity * (item.unitPriceAED || 0));
  const subtotal = lineTotals.reduce((acc, curr) => acc + curr, 0);
  const subtotalAfterDiscount = Math.max(0, subtotal - (Number(discountAED) || 0));
  const vat = calculateUAEVAT(subtotalAfterDiscount);
  const grandTotal = subtotalAfterDiscount + vat + (Number(deliveryChargeAED) || 0);

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
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
        deliveryAddress: spotLogistics.destinationLocation,
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
        unitPriceAED: Number(item.unitPriceAED),
        offeredBrand: item.offeredBrand,
        isAlternative: item.isAlternative,
        totalPriceAED: item.quantity * Number(item.unitPriceAED),
        remarks: item.remarks,
      })),
    };

    onSubmitQuote(quotationPayload);
  };

  return (
    <form onSubmit={handleOpenConfirm} className="space-y-6">
      <div className="bg-brand-50/70 p-4 rounded-xl border border-brand-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-mono font-bold text-brand-700 bg-white px-2 py-0.5 rounded border border-brand-200">
              {rfq.rfqNumber}
            </span>
            {rfq.authorityApproval && (
              <span className="text-[10px] font-bold text-cyan-800 bg-cyan-100/70 px-2 py-0.5 rounded border border-cyan-300">
                {rfq.authorityApproval}
              </span>
            )}
            {rfq.offloadingRequired && (
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded border border-amber-300">
                🚚 Crane Offload Required
              </span>
            )}
            {rfq.paymentTermsPreference && (
              <span className="text-[10px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                💳 {rfq.paymentTermsPreference}
              </span>
            )}
          </div>
          <h4 className="text-sm font-bold text-slate-900 mt-1">{rfq.title}</h4>
          <p className="text-slate-500 mt-0.5">
            Buyer: <strong className="text-slate-700">{rfq.buyerCompanyName}</strong> • Delivery: <strong>{rfq.deliveryAddress} ({rfq.deliveryEmirate})</strong>
            {rfq.projectName && <> • Project: <strong className="text-slate-700">{rfq.projectName}</strong></>}
            {rfq.consultantName && <> (Consultant: <strong className="text-slate-700">{rfq.consultantName}</strong>)</>}
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-slate-500">Quoting As:</span>
          <p className="font-bold text-slate-900">{supplierCompany.name}</p>
        </div>
      </div>

      {/* Fastest 5 Stockists Slot Indicator */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping shrink-0" />
          <span className="font-bold text-amber-900">
            ⚡ First-Come, First-Served 5-Quote Rule:
          </span>
          <span className="text-amber-800">
            Only the first 5 stockists to submit will reach the contractor. Submit quickly to secure your proposal!
          </span>
        </div>
        <span className="font-mono font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-md border border-amber-300 shrink-0 text-center">
          Claiming Slot #{Math.min((rfq.quotesCount || 0) + 1, 5)} of 5
        </span>
      </div>

      <Card>
        <CardHeader>
          <div>
            <h4 className="text-sm font-bold text-slate-900">1. Itemized Pricing & Brand Specifications</h4>
            <p className="text-xs text-slate-500">Click any of the buyer's approved brands below to auto-fill your quotation, or type your alternative brand.</p>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3 min-w-[260px]">Item, Required Spec & Approved Brands</th>
                <th className="p-3">Qty & Unit</th>
                <th className="p-3 min-w-[150px]">Offered Brand</th>
                <th className="p-3 min-w-[120px]">Unit Price (AED)</th>
                <th className="p-3 text-right">Line Total (AED)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, idx) => {
                const lineTotal = item.quantity * (item.unitPriceAED || 0);
                const rfqItem = rfq.items.find(i => i.id === item.rfqItemId) || rfq.items[idx];
                const approvedBrands = rfqItem?.preferredBrands || (rfqItem?.preferredBrand ? rfqItem.preferredBrand.split('/').map(b => b.trim()) : []);

                return (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono font-semibold text-slate-400">{idx + 1}</td>
                    <td className="p-3">
                      <p className="font-bold text-slate-900">{item.itemDescription}</p>
                      {rfqItem?.specification && (
                        <p className="text-[11px] text-slate-500 mt-0.5">{rfqItem.specification}</p>
                      )}
                      
                      {/* Buyer Approved Brands Badges (Click to fill!) */}
                      <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Approved:</span>
                        {approvedBrands.length > 0 ? (
                          approvedBrands.map((b) => (
                            <button
                              key={b}
                              type="button"
                              onClick={() => handleBrandChange(idx, b)}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-all ${
                                item.offeredBrand === b
                                  ? 'bg-brand-600 text-white border-brand-700 shadow-sm'
                                  : 'bg-brand-50 text-brand-700 border-brand-200 hover:bg-brand-100'
                              }`}
                              title="Click to offer this approved brand"
                            >
                              ✓ {b}
                            </button>
                          ))
                        ) : (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                            {rfqItem?.preferredBrand || 'Open Spec'}
                          </span>
                        )}
                        {rfqItem?.allowAlternatives && (
                          <span className="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            Equivalents Welcome
                          </span>
                        )}
                      </div>

                      <input
                        type="text"
                        value={item.remarks}
                        onChange={(e) => handleRemarksChange(idx, e.target.value)}
                        placeholder="Add notes / model number..."
                        className="mt-2 w-full text-[11px] p-1.5 rounded border border-slate-200 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                      />
                    </td>
                    <td className="p-3 font-bold text-slate-700">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        required
                        value={item.offeredBrand}
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
                          required
                          value={item.unitPriceAED}
                          onChange={(e) => handlePriceChange(idx, parseFloat(e.target.value) || 0)}
                          className="w-full text-xs font-bold pl-10 pr-2 py-1.5 rounded border border-slate-200 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                        />
                      </div>
                    </td>
                    <td className="p-3 text-right font-extrabold text-slate-900">
                      {formatAED(lineTotal)}
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
            <h4 className="text-sm font-bold text-slate-900">2. Delivery & Commercial Terms</h4>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            {/* Delivery Fleet Method Selector */}
            <div className="space-y-2 pb-3 border-b border-slate-100">
              <label className="font-bold text-slate-800 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-brand-600" />
                  Delivery & Logistics Fleet
                </span>
                <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                  Site: {rfq.deliveryAddress}
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* SupplySouq Managed Delivery Option */}
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
                          SupplySouq Delivery
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">Recommended</span>
                        </div>
                        <div className="text-[11px] text-slate-500">No vehicle? We pick up & deliver</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-brand-700 text-xs">{formatAED(spotLogistics.spotDeliveryFeeAED)}</div>
                      <div className="text-[10px] text-slate-400">Spot price</div>
                    </div>
                  </div>
                </div>

                {/* Supplier In-House Fleet Option */}
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
                        <div className="font-bold text-xs text-slate-900">In-House Fleet</div>
                        <div className="text-[11px] text-slate-500">Supplier delivers with own vehicle</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-slate-700 text-xs">Self Managed</div>
                      <div className="text-[10px] text-slate-400">Custom charge</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SupplySouq Spot Logistics live breakdown card */}
              {deliveryMethod === 'supplysouq_managed' ? (
                <div className="bg-gradient-to-br from-brand-50/90 via-sky-50/50 to-amber-50/40 rounded-xl p-3 border border-brand-200/80 mt-2 space-y-2">
                  <div className="flex items-center justify-between text-xs pb-1.5 border-b border-brand-100">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-600" />
                      Instant Spot Delivery Calculation
                    </span>
                    <span className="text-[10px] bg-white font-mono font-bold text-brand-800 px-2 py-0.5 rounded border border-brand-200">
                      ⚡ Dynamic Quote
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div className="bg-white/90 p-2 rounded-lg border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-medium">Shop Pickup</div>
                      <div className="font-bold text-slate-800 truncate" title={spotLogistics.pickupZone}>{spotLogistics.pickupZone}</div>
                      <div className="text-[9px] text-slate-500 truncate">{spotLogistics.supplierShopName}</div>
                    </div>
                    <div className="bg-white/90 p-2 rounded-lg border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-medium">Site Destination</div>
                      <div className="font-bold text-slate-800 truncate" title={spotLogistics.destinationLocation}>{spotLogistics.destinationLocation}</div>
                      <div className="text-[9px] text-slate-500 truncate">{rfq.deliveryEmirate}</div>
                    </div>
                    <div className="bg-white/90 p-2 rounded-lg border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-medium">Distance & Transit</div>
                      <div className="font-bold text-slate-800">{spotLogistics.estimatedDistanceKm} km</div>
                      <div className="text-[9px] text-slate-500 font-mono">~{spotLogistics.transitTimeEstimate}</div>
                    </div>
                    <div className="bg-white/90 p-2 rounded-lg border border-slate-100">
                      <div className="text-[10px] text-slate-400 font-medium">Assigned Vehicle</div>
                      <div className="font-bold text-brand-700 truncate" title={spotLogistics.vehicleType}>{spotLogistics.vehicleType}</div>
                      <div className="text-[9px] text-emerald-600 font-bold">{formatAED(spotLogistics.spotDeliveryFeeAED)} Spot Fee</div>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-600 flex items-center justify-between pt-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      SupplySouq driver handles warehouse collection, site access pass & offloading.
                    </span>
                    <span className="font-bold text-brand-900 bg-brand-100/70 px-1.5 py-0.5 rounded text-[10px]">
                      Auto-added to quotation
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 mt-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-800">In-House Fleet Delivery Charge (AED)</span>
                      <p className="text-[11px] text-slate-500">Enter 0 for free delivery or your custom freight charge.</p>
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
              <label className="font-semibold text-slate-700 block mb-1">Payment Terms</label>
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
            <h4 className="text-sm font-bold text-slate-900">3. Financial Summary (AED)</h4>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Gross Material Subtotal:</span>
              <span className="font-bold text-slate-900">{formatAED(subtotal)}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Special Discount (AED):</span>
              <input
                type="number"
                min="0"
                value={discountAED}
                onChange={(e) => setDiscountAED(parseFloat(e.target.value) || 0)}
                className="w-28 text-right p-1 rounded border border-slate-200 text-xs font-bold text-emerald-700 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                Delivery & Handling:
                {deliveryMethod === 'supplysouq_managed' ? (
                  <span className="text-[10px] bg-brand-100 text-brand-800 px-1.5 py-0.5 rounded font-bold">
                    SupplySouq Spot ({spotLogistics.estimatedDistanceKm} km)
                  </span>
                ) : (
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                    In-House Fleet
                  </span>
                )}
              </span>
              {deliveryMethod === 'supplysouq_managed' ? (
                <span className="font-bold text-brand-700">{formatAED(deliveryChargeAED)}</span>
              ) : (
                <input
                  type="number"
                  min="0"
                  value={deliveryChargeAED}
                  onChange={(e) => setDeliveryChargeAED(parseFloat(e.target.value) || 0)}
                  className="w-28 text-right p-1 rounded border border-slate-200 text-xs font-bold focus:ring-brand-500"
                />
              )}
            </div>

            <div className="flex items-center justify-between text-slate-600 pt-2 border-t border-slate-100">
              <span>5% UAE VAT:</span>
              <span className="font-bold text-slate-900">{formatAED(vat)}</span>
            </div>

            <div className="p-4 bg-slate-900 text-white rounded-xl mt-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Grand Total
                </span>
                <span className="text-2xl font-extrabold text-white">
                  {formatAED(grandTotal)}
                </span>
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded border border-emerald-500/30 font-semibold">
                5% VAT Included
              </span>
            </div>

            <div className="pt-2">
              <label className="font-semibold text-slate-700 block mb-1">Additional Quotation Remarks</label>
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
          Review & Submit Quotation (Slot #{Math.min((rfq.quotesCount || 0) + 1, 5)} of 5)
        </Button>
      </div>

      {/* Quotation Submission Double-Confirmation Modal */}
      {isConfirmModalOpen && (
        <Modal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          title="Confirm Quotation Submission"
          subtitle="Double check all commercial terms, delivery method, and item pricing before final transmission"
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            {/* Slot claim notice */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-start gap-3">
              <Zap className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-amber-900 text-xs flex items-center gap-2">
                  Fastest 5 Bids Rule: Securing Slot #{Math.min((rfq.quotesCount || 0) + 1, 5)} of 5
                </div>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Submitting will permanently lock your quotation into the comparison table for <strong>{rfq.buyerCompanyName}</strong>. Once submitted, pricing cannot be retracted.
                </p>
              </div>
            </div>

            {/* Quoted Items Summary */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 font-semibold text-slate-700">
                <span>Quotation Summary ({rfq.rfqNumber})</span>
                <span className="text-slate-500">{items.length} Item{items.length > 1 ? 's' : ''} Quoted</span>
              </div>
              
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                {items.map((it, idx) => (
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

            {/* Delivery Details Card */}
            <div className={`p-3.5 rounded-xl border ${
              deliveryMethod === 'supplysouq_managed'
                ? 'bg-brand-50/50 border-brand-200'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-brand-600" />
                  Delivery Execution: {deliveryMethod === 'supplysouq_managed' ? 'SupplySouq Managed Delivery' : 'In-House Fleet Self-Delivery'}
                </span>
                <span className="font-extrabold text-brand-700">
                  {deliveryChargeAED > 0 ? formatAED(deliveryChargeAED) : 'FREE Delivery'}
                </span>
              </div>

              {deliveryMethod === 'supplysouq_managed' ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-white/80 p-2.5 rounded-lg border border-brand-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Pickup Warehouse</span>
                    <span className="font-bold text-slate-800 truncate block">{spotLogistics.pickupZone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Delivery Site</span>
                    <span className="font-bold text-slate-800 truncate block">{spotLogistics.destinationLocation}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Distance</span>
                    <span className="font-bold text-slate-800 block">{spotLogistics.estimatedDistanceKm} km (~{spotLogistics.transitTimeEstimate})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Vehicle Assigned</span>
                    <span className="font-bold text-brand-700 truncate block">{spotLogistics.vehicleType}</span>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-slate-600">
                  Your team will coordinate dispatch directly to <strong>{rfq.deliveryAddress} ({rfq.deliveryEmirate})</strong> using your registered company vehicle fleet.
                </p>
              )}
            </div>

            {/* Terms breakdown grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Lead Time</span>
                <span className="font-bold text-slate-800">{leadTimeDisplay}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Payment Terms</span>
                <span className="font-bold text-slate-800 truncate block">{paymentTerms}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Quotation Validity</span>
                <span className="font-bold text-slate-800">{validityDays} Days</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span className="text-slate-400 text-[10px] block">Warranty</span>
                <span className="font-bold text-slate-800 truncate block">{warrantyPeriod}</span>
              </div>
            </div>

            {/* Final Financial Breakdown */}
            <div className="bg-slate-900 text-white rounded-xl p-3.5 space-y-1.5">
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Material Subtotal:</span>
                <span className="font-mono">{formatAED(subtotal)}</span>
              </div>
              {discountAED > 0 && (
                <div className="flex justify-between text-[11px] text-emerald-400">
                  <span>Special Discount:</span>
                  <span className="font-mono">-{formatAED(discountAED)}</span>
                </div>
              )}
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Delivery & Logistics ({deliveryMethod === 'supplysouq_managed' ? 'SupplySouq Spot' : 'In-House'}):</span>
                <span className="font-mono">{formatAED(deliveryChargeAED)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>5% UAE VAT:</span>
                <span className="font-mono">{formatAED(vat)}</span>
              </div>
              <div className="pt-2 border-t border-slate-700 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Total Quoted Amount</span>
                  <span className="text-xl font-extrabold text-brand-400 font-mono">{formatAED(grandTotal)}</span>
                </div>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded font-semibold border border-emerald-500/30">
                  5% VAT Included
                </span>
              </div>
            </div>

            {/* Modal Actions */}
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
                leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-800" />}
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
