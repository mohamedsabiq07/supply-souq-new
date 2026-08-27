import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatAED } from '../../lib/utils';
import { 
  FileSpreadsheet, 
  UploadCloud, 
  CheckCircle2, 
  TrendingDown, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  Building2, 
  ShieldCheck,
  Zap,
  Download,
  RotateCcw,
  Store,
  DollarSign
} from 'lucide-react';

export interface AuditedItem {
  id: string;
  itemDescription: string;
  quantity: number;
  unit: string;
  currentUnitPriceAED: number;
  currentTotalPriceAED: number;
  supplySouqUnitPriceAED: number;
  supplySouqTotalPriceAED: number;
  savingsAED: number;
  savingsPercent: number;
  matchedSupplierName: string;
  matchedSupplierZone: string;
  matchedBrand: string;
  specMatch: string;
}

export interface SampleInvoice {
  id: string;
  title: string;
  facilityType: string;
  location: string;
  currentTotalAED: number;
  supplySouqTotalAED: number;
  totalSavingsAED: number;
  savingsPercent: number;
  items: AuditedItem[];
}

export const sampleInvoices: SampleInvoice[] = [
  {
    id: 'inv-elec-1',
    title: 'Commercial Office Tower - Power Cables, LED Panels & Schneider MCBs',
    facilityType: 'Commercial Fit-Out (42 Floors)',
    location: 'Business Bay / Downtown Dubai',
    currentTotalAED: 26400,
    supplySouqTotalAED: 21240,
    totalSavingsAED: 5160,
    savingsPercent: 19.5,
    items: [
      {
        id: 'aud-e1',
        itemDescription: '4C x 16mm² XLPE/SWA/PVC 0.6/1kV Copper Armoured Cable (500m)',
        quantity: 500,
        unit: 'm',
        currentUnitPriceAED: 31.00,
        currentTotalPriceAED: 15500,
        supplySouqUnitPriceAED: 24.50,
        supplySouqTotalPriceAED: 12250,
        savingsAED: 3250,
        savingsPercent: 21.0,
        matchedSupplierName: 'Al Noor Electrical Trading LLC',
        matchedSupplierZone: 'Al Quoz Industrial 3, Dubai',
        matchedBrand: 'Ducab (UAE)',
        specMatch: '100% Genuine Ducab Factory Drum (DEWA Approved)'
      },
      {
        id: 'aud-e2',
        itemDescription: '60x60 Recessed LED Panel Light 40W 4000K Neutral White',
        quantity: 200,
        unit: 'pcs',
        currentUnitPriceAED: 46.00,
        currentTotalPriceAED: 9200,
        supplySouqUnitPriceAED: 36.00,
        supplySouqTotalPriceAED: 7200,
        savingsAED: 2000,
        savingsPercent: 21.7,
        matchedSupplierName: 'Al Noor Electrical Trading LLC',
        matchedSupplierZone: 'Al Quoz Industrial 3, Dubai',
        matchedBrand: 'Philips CoreLine LED',
        specMatch: 'Low Glare UGR<19, Flicker-Free Driver'
      },
      {
        id: 'aud-e3',
        itemDescription: '20A Single Pole Miniature Circuit Breaker (MCB) 10kA Type C',
        quantity: 50,
        unit: 'pcs',
        currentUnitPriceAED: 20.50,
        currentTotalPriceAED: 1025,
        supplySouqUnitPriceAED: 15.00,
        supplySouqTotalPriceAED: 750,
        savingsAED: 275,
        savingsPercent: 26.8,
        matchedSupplierName: 'Al Noor Electrical Trading LLC',
        matchedSupplierZone: 'Al Quoz Industrial 3, Dubai',
        matchedBrand: 'Schneider Electric Acti9',
        specMatch: 'Original Schneider 10kA DEWA Approved'
      }
    ]
  },
  {
    id: 'inv-elec-2',
    title: 'Residential Villa Development - First-Fix Building Wires & GI Back Boxes',
    facilityType: '14-Villa Residential Compound',
    location: 'Nad Al Sheba 3 / Meydan, Dubai',
    currentTotalAED: 11800,
    supplySouqTotalAED: 9300,
    totalSavingsAED: 2500,
    savingsPercent: 21.2,
    items: [
      {
        id: 'aud-v1',
        itemDescription: 'Single Core 2.5mm² PVC Insulated Copper Wire (100m Coils)',
        quantity: 40,
        unit: 'coils',
        currentUnitPriceAED: 235.00,
        currentTotalPriceAED: 9400,
        supplySouqUnitPriceAED: 185.00,
        supplySouqTotalPriceAED: 7400,
        savingsAED: 2000,
        savingsPercent: 21.3,
        matchedSupplierName: 'Al Noor Electrical Trading LLC',
        matchedSupplierZone: 'Al Quoz 3, Dubai',
        matchedBrand: 'Ducab (UAE)',
        specMatch: 'BS 6004, 100% Annealed Copper (DEWA Approved)'
      },
      {
        id: 'aud-v2',
        itemDescription: '1-Gang & 2-Gang 35mm Deep Galvanized GI Flush Back Boxes',
        quantity: 150,
        unit: 'pcs',
        currentUnitPriceAED: 11.50,
        currentTotalPriceAED: 1725,
        supplySouqUnitPriceAED: 8.00,
        supplySouqTotalPriceAED: 1200,
        savingsAED: 525,
        savingsPercent: 30.4,
        matchedSupplierName: 'Sharjah Power & Lighting Supplies LLC',
        matchedSupplierZone: 'Sharjah Industrial 4',
        matchedBrand: 'Decoduct GI Heavy',
        specMatch: 'BS 4662 with Brass Earth Terminal'
      }
    ]
  },
  {
    id: 'inv-elec-3',
    title: 'Industrial Warehouse - GI Cable Trays, Containment & High Bay Lights',
    facilityType: 'Logistics Facility (35,000 sqft)',
    location: 'Dubai South / JAFZA',
    currentTotalAED: 18200,
    supplySouqTotalAED: 14400,
    totalSavingsAED: 3800,
    savingsPercent: 20.9,
    items: [
      {
        id: 'aud-w1',
        itemDescription: 'Pre-Galvanized Perforated Cable Tray 300mm x 50mm x 3m (1.5mm Thk)',
        quantity: 80,
        unit: 'm',
        currentUnitPriceAED: 95.00,
        currentTotalPriceAED: 7600,
        supplySouqUnitPriceAED: 75.00,
        supplySouqTotalPriceAED: 6000,
        savingsAED: 1600,
        savingsPercent: 21.1,
        matchedSupplierName: 'Sharjah Power & Lighting Supplies LLC',
        matchedSupplierZone: 'Sharjah Industrial 4',
        matchedBrand: 'Profab Return Flange',
        specMatch: 'BS EN 61537 Heavy Duty Return Flange'
      },
      {
        id: 'aud-w2',
        itemDescription: '150W UFO LED High Bay Warehouse Fixtures 6500K IP65',
        quantity: 30,
        unit: 'pcs',
        currentUnitPriceAED: 280.00,
        currentTotalPriceAED: 8400,
        supplySouqUnitPriceAED: 220.00,
        supplySouqTotalPriceAED: 6600,
        savingsAED: 1800,
        savingsPercent: 21.4,
        matchedSupplierName: 'Al Noor Electrical Trading LLC',
        matchedSupplierZone: 'Al Quoz 3, Dubai',
        matchedBrand: 'Opple High Bay Pro',
        specMatch: '140 lm/W Efficiency, MeanWell Driver'
      }
    ]
  }
];

interface InvoiceAuditScannerProps {
  onSwitchToRFQ: (auditedInvoice: SampleInvoice) => void;
}

export const InvoiceAuditScanner: React.FC<InvoiceAuditScannerProps> = ({ onSwitchToRFQ }) => {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('inv-elec-1');
  const [isScanning, setIsScanning] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const activeInvoice = sampleInvoices.find(inv => inv.id === selectedInvoiceId) || sampleInvoices[0];

  const handleSimulateCustomUpload = () => {
    setIsScanning(true);
    setUploadedFileName('Electrical_Tax_Invoice_INV-9042.pdf');
    setTimeout(() => {
      setIsScanning(false);
    }, 900);
  };

  const annualSavingsAED = activeInvoice.totalSavingsAED * 12;

  return (
    <div className="space-y-6">
      {/* Top Banner / Upload Widget */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Free 30-Second Electrical Cost Audit</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Benchmark Your Electrical & Cable Invoices
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Upload your last bill for Ducab cables, Schneider switchgear, or LED lighting to see exact wholesale price differences against 50+ verified stockists in Al Quoz, Sharjah, and Mussafah.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Button
              variant="primary"
              onClick={handleSimulateCustomUpload}
              leftIcon={<UploadCloud className="w-4 h-4" />}
              className="bg-brand-500 hover:bg-brand-600 font-bold"
            >
              Upload Electrical Invoice (PDF / Photo)
            </Button>
          </div>
        </div>

        {/* Sample Invoices Tab Selector */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <span className="text-xs text-slate-400 font-semibold block">
            Or select a typical UAE electrical bill to test the price audit:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {sampleInvoices.map((inv) => (
              <button
                key={inv.id}
                type="button"
                onClick={() => {
                  setSelectedInvoiceId(inv.id);
                  setUploadedFileName(null);
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedInvoiceId === inv.id
                    ? 'bg-brand-600/90 text-white border-brand-400 shadow-md font-bold'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-amber-300 font-mono">
                    {inv.facilityType}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-extrabold">
                    Save {inv.savingsPercent}%
                  </span>
                </div>
                <strong className="block text-xs mt-1 truncate">{inv.title}</strong>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Scanning State */}
      {isScanning && (
        <Card className="p-8 text-center bg-brand-50/50 border-brand-200 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center mx-auto mb-3">
            <Zap className="w-6 h-6 animate-spin" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Scanning Electrical Specifications...</h3>
          <p className="text-xs text-slate-500 mt-1">
            Benchmarking copper cable gauge, switchgear kA rating, and DEWA certification against live Al Quoz warehouse stocks...
          </p>
        </Card>
      )}

      {/* Audit Summary KPI Bar */}
      {!isScanning && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-slate-200">
              <CardContent className="p-5 space-y-1">
                <span className="text-xs font-semibold text-slate-400">Current Supplier Total</span>
                <div className="text-2xl font-extrabold text-slate-900">
                  {formatAED(activeInvoice.currentTotalAED)}
                </div>
                <span className="text-[11px] text-slate-500 block">Based on your past invoice</span>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 bg-emerald-50/40">
              <CardContent className="p-5 space-y-1">
                <span className="text-xs font-semibold text-emerald-800">SupplySouq Verified Price</span>
                <div className="text-2xl font-extrabold text-emerald-950">
                  {formatAED(activeInvoice.supplySouqTotalAED)}
                </div>
                <span className="text-[11px] text-emerald-700 block">Direct stockist wholesale rate</span>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50/40">
              <CardContent className="p-5 space-y-1">
                <span className="text-xs font-semibold text-amber-900">Your Project Savings</span>
                <div className="text-2xl font-extrabold text-amber-950 flex items-center gap-1.5">
                  <TrendingDown className="w-6 h-6 text-emerald-600" />
                  <span>{formatAED(activeInvoice.totalSavingsAED)}</span>
                </div>
                <span className="text-[11px] text-amber-800 font-bold block">
                  {activeInvoice.savingsPercent}% Direct Cost Reduction
                </span>
              </CardContent>
            </Card>

            <Card className="border-brand-200 bg-brand-50/40">
              <CardContent className="p-5 space-y-1">
                <span className="text-xs font-semibold text-brand-800">Annual Procurement Savings</span>
                <div className="text-2xl font-extrabold text-brand-950">
                  {formatAED(annualSavingsAED)}
                </div>
                <span className="text-[11px] text-brand-700 block">Calculated on recurring projects</span>
              </CardContent>
            </Card>
          </div>

          {/* Line-by-Line Itemized Audit Table */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Line-by-Line Electrical Cost Audit Breakdown
                </h3>
                <p className="text-xs text-slate-500">
                  Comparison between your invoice rate and verified UAE electrical stockist rates.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onSwitchToRFQ(activeInvoice)}
                  leftIcon={<Zap className="w-4 h-4 text-amber-300" />}
                  className="bg-brand-600 hover:bg-brand-700 font-bold"
                >
                  Switch & Post as Live RFQ
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Electrical Spec & Standards</th>
                    <th className="p-3">Qty</th>
                    <th className="p-3 text-right">You Paid</th>
                    <th className="p-3 text-right">SupplySouq Price</th>
                    <th className="p-3 text-right">Overpaid / Savings</th>
                    <th className="p-3">Verified Stockist Match</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeInvoice.items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60">
                      <td className="p-3">
                        <strong className="block text-slate-900 font-bold">{item.itemDescription}</strong>
                        <span className="text-[11px] text-slate-500 font-medium">{item.specMatch}</span>
                      </td>

                      <td className="p-3 font-semibold text-slate-800 whitespace-nowrap">
                        {item.quantity} {item.unit}
                      </td>

                      <td className="p-3 text-right">
                        <span className="font-semibold text-slate-900 block">{formatAED(item.currentTotalPriceAED)}</span>
                        <span className="text-[10px] text-slate-400">{formatAED(item.currentUnitPriceAED, true)} / {item.unit}</span>
                      </td>

                      <td className="p-3 text-right text-emerald-700 bg-emerald-50/30">
                        <span className="font-extrabold text-emerald-950 block">{formatAED(item.supplySouqTotalPriceAED)}</span>
                        <span className="text-[10px] text-emerald-700 font-medium">{formatAED(item.supplySouqUnitPriceAED, true)} / {item.unit}</span>
                      </td>

                      <td className="p-3 text-right">
                        <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                          - {formatAED(item.savingsAED)} ({item.savingsPercent}%)
                        </span>
                      </td>

                      <td className="p-3 text-[11px]">
                        <div className="flex items-center gap-1 text-slate-900 font-bold">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{item.matchedSupplierName}</span>
                        </div>
                        <span className="text-slate-500 text-[10px] block">{item.matchedSupplierZone}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Bottom Action Card */}
          <div className="bg-gradient-to-r from-brand-900 to-navy-950 text-white rounded-2xl p-6 border border-brand-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-white">
                Ready to save {formatAED(activeInvoice.totalSavingsAED)} on your electrical procurement?
              </h4>
              <p className="text-xs text-slate-300">
                SupplySouq broadcasts this bill of quantities to authorized UAE electrical stockists with guaranteed DEWA test certificates and 24h quotation turnaround.
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => onSwitchToRFQ(activeInvoice)}
              leftIcon={<Zap className="w-5 h-5 text-amber-300 fill-amber-300" />}
              className="bg-brand-500 hover:bg-brand-600 font-bold whitespace-nowrap shadow-lg shadow-brand-500/30"
            >
              Post Electrical RFQ & Lock In Savings
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};