import React, { useState } from 'react';
import { RFQ } from '../../types';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatAED, calculateUAEVAT } from '../../lib/utils';
import { Send, CheckCircle2 } from 'lucide-react';

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
  const [deliveryChargeAED, setDeliveryChargeAED] = useState(500);
  const [discountAED, setDiscountAED] = useState(0);
  const [notes, setNotes] = useState('All materials comply with UAE standards and DEWA / Civil Defense requirements. Test certificates will accompany delivery.');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-brand-50/70 p-4 rounded-xl border border-brand-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-mono font-bold text-brand-700 bg-white px-2 py-0.5 rounded border border-brand-200">
            {rfq.rfqNumber}
          </span>
          <h4 className="text-sm font-bold text-slate-900 mt-1">{rfq.title}</h4>
          <p className="text-slate-500">
            Buyer: <strong className="text-slate-700">{rfq.buyerCompanyName}</strong> • Delivery: <strong>{rfq.deliveryAddress}</strong>
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-slate-500">Quoting As:</span>
          <p className="font-bold text-slate-900">{supplierCompany.name}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div>
            <h4 className="text-sm font-bold text-slate-900">1. Itemized Pricing & Brand Specifications</h4>
            <p className="text-xs text-slate-500">Enter unit price (AED) and offered brands matching or equivalent to buyer requirements.</p>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3 min-w-[220px]">Item & Required Spec</th>
                <th className="p-3">Qty & Unit</th>
                <th className="p-3 min-w-[140px]">Offered Brand</th>
                <th className="p-3 min-w-[120px]">Unit Price (AED)</th>
                <th className="p-3 text-right">Line Total (AED)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, idx) => {
                const lineTotal = item.quantity * (item.unitPriceAED || 0);
                return (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono font-semibold text-slate-400">{idx + 1}</td>
                    <td className="p-3">
                      <p className="font-semibold text-slate-900">{item.itemDescription}</p>
                      <input
                        type="text"
                        value={item.remarks}
                        onChange={(e) => handleRemarksChange(idx, e.target.value)}
                        placeholder="Add notes / model number..."
                        className="mt-1 w-full text-[11px] p-1.5 rounded border border-slate-200 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                      />
                    </td>
                    <td className="p-3 font-bold text-slate-700">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={item.offeredBrand}
                        onChange={(e) => handleBrandChange(idx, e.target.value)}
                        className="w-full text-xs p-1.5 rounded border border-slate-200 font-medium focus:ring-1 focus:ring-brand-500 focus:outline-none"
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
              <span>Delivery & Handling (AED):</span>
              <input
                type="number"
                min="0"
                value={deliveryChargeAED}
                onChange={(e) => setDeliveryChargeAED(parseFloat(e.target.value) || 0)}
                className="w-28 text-right p-1 rounded border border-slate-200 text-xs font-bold focus:ring-brand-500"
              />
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
          Submit Formal Quotation to Buyer
        </Button>
      </div>
    </form>
  );
};
