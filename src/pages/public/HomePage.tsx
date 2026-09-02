import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Button } from '../../components/ui/Button';
import { HighlightBadge } from '../../components/ui/Badge';
import { Card, CardContent } from '../../components/ui/Card';
import { SupplierCard } from '../../components/supplier/SupplierCard';
import { AnimatedAuditBanner } from '../../components/audit/AnimatedAuditBanner';
import { formatAED } from '../../lib/utils';
import { QuickBundle } from '../../types';
import {
  Zap,
  Building2,
  Store,
  ShieldCheck,
  CheckCircle2,
  GitCompare,
  Layers,
  ArrowRight,
  Clock,
  Sparkles,
  Search,
  PackageCheck,
  ChevronRight,
  Camera,
  FileSpreadsheet
} from 'lucide-react';

interface HomePageProps {
  setCurrentView: (view: string, params?: any) => void;
  onOpenCompareDemo: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setCurrentView, onOpenCompareDemo }) => {
  const { setRole } = useAuth();
  const { categories, companies, rfqs, quotations } = useAppData();

  const featuredRFQ = rfqs.find(r => r.rfqNumber === 'SS-10284') || rfqs[0];
  const demoQuotes = quotations.filter(q => q.rfqId === featuredRFQ?.id || q.rfqNumber === featuredRFQ?.rfqNumber).slice(0, 5);
  const verifiedSuppliers = companies.filter(c => c.companyType === 'supplier');

  const handleStartBuyer = (bundle?: QuickBundle) => {
    setRole('buyer');
    setCurrentView('create-rfq', { bundle });
  };

  const handleStartSupplier = () => {
    setRole('supplier');
    setCurrentView('supplier-inbox');
  };

  const handleQuickPhotoUpload = () => {
    setRole('buyer');
    setCurrentView('create-rfq', { mode: 'photo_upload' });
  };

  return (
    <div className="space-y-16 pb-20">
      {/* HERO SECTION - ELECTRICAL PROCUREMENT */}
      <section className="relative overflow-hidden pt-10 pb-16 border-b border-slate-200 bg-gradient-to-b from-slate-900 via-slate-900 to-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-400/30 text-amber-300 px-3 py-1.5 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>UAE B2B Material Procurement Network</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Source Electrical & MEP Supplies.<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-200 to-sky-300">
                Post Requirements. Compare 5 Quotes. Save 18%.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Connect directly with verified material stockists. Upload your material list or bill in 30 seconds to receive competitive wholesale quotations for cables, switchgear, LED lighting, plumbing, and HVAC in 24 hours.
            </p>

            {/* Main Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleStartBuyer()}
                leftIcon={<Zap className="w-5 h-5 text-amber-300 fill-amber-300" />}
                className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 shadow-lg shadow-brand-500/25 text-sm py-3 px-6 font-bold"
              >
                Post an RFQ (100% Free)
              </Button>

              <Button
                variant="amber"
                size="lg"
                onClick={() => setCurrentView('invoice-audit')}
                leftIcon={<Sparkles className="w-5 h-5" />}
                className="w-full sm:w-auto text-sm py-3 px-6 font-bold"
              >
                Free Cable Invoice Audit (Save 15%+)
              </Button>
            </div>

            {/* Micro Highlights */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% UAE Trade License Verified Stockists
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Standard 5% UAE VAT Compliant
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Average 18.4% Material Cost Savings
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC PRICE AUDIT CALLOUT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedAuditBanner onLaunchAudit={() => setCurrentView('invoice-audit')} />
      </section>

      {/* INTERACTIVE 5-VENDOR QUOTE COMPARISON DEMO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-800 text-white space-y-8 shadow-2xl">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30 mb-2">
                <GitCompare className="w-3.5 h-3.5" />
                <span>Live Multi-Vendor Quotation Benchmark</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                How Contractors Compare 5 Live Stockist Quotes
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Real example: Eng. Tariq from Apex Contracting requested Ducab CU/XLPE/PVC Cables & Schneider MCBs.
              </p>
            </div>

            <Button
              variant="amber"
              onClick={onOpenCompareDemo}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="font-bold text-xs"
            >
              Open Interactive Quote Matrix
            </Button>
          </div>

          {/* 5 Real Stockist Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {demoQuotes.map((quote, idx) => (
              <div
                key={quote.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  idx === 0
                    ? 'bg-gradient-to-b from-emerald-950/60 to-slate-900 border-emerald-500 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      Quote #{quote.quotationNumber.slice(-4)}
                    </span>
                    {idx === 0 && (
                      <span className="bg-emerald-500 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                        Lowest Price
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-xs truncate">{quote.supplierCompanyName}</h4>
                    <p className="text-[11px] text-slate-400">{quote.supplierZone}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block">Total (Incl. 5% VAT)</span>
                    <div className="text-lg font-extrabold text-white font-mono">
                      {formatAED(quote.grandTotalAED)}
                    </div>
                  </div>

                  <div className="text-[11px] space-y-1 pt-2 border-t border-slate-700/50">
                    <div className="flex justify-between py-0.5 border-b border-slate-800">
                      <span className="text-slate-400">Lead Time:</span>
                      <strong className="text-white">{quote.leadTimeDisplay || '2 Days'}</strong>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-800">
                      <span className="text-slate-400">Brand:</span>
                      <strong className="text-white">Ducab / Schneider</strong>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-800">
                      <span className="text-slate-400">Payment:</span>
                      <strong className="text-white">{quote.paymentTerms}</strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS 4-STEP OVERVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            <Sparkles className="w-3.5 h-3.5" /> Transparent B2B Procurement Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            How SupplySouq Works in 4 Easy Steps
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            From posting your material requirements to direct site delivery with 5% VAT compliant invoicing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: '01',
              title: 'Create Corporate Account',
              desc: 'Sign up as a Contractor or Material Stockist in 30 seconds. Suppliers undergo quick Trade License verification.',
              icon: Building2
            },
            {
              step: '02',
              title: 'Post Material RFQ / BOQ',
              desc: 'Enter line items, brand preferences (Ducab, Schneider), or upload an Excel BOQ / photo of your material note.',
              icon: FileSpreadsheet
            },
            {
              step: '03',
              title: 'Compare 5 Live Quotations',
              desc: 'Verified stockists submit prices within 24 hours. Compare side-by-side by price, brand, lead time & ratings.',
              icon: GitCompare
            },
            {
              step: '04',
              title: 'Issue PO & Site Delivery',
              desc: '1-Click award to generate an official digital PO. Track dispatch and receive direct delivery at your project site.',
              icon: PackageCheck
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card key={idx} className="p-6 border-slate-200 hover:border-brand-400 transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-extrabold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg">
                    Step {item.step}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ONBOARDING SOP CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white border border-slate-800 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Standard Operating Procedures (SOP)
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Learn the Complete Procurement & Stockist Workflow
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Read our comprehensive onboarding guide, compliance requirements, and trade license verification procedure.
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={() => setCurrentView('onboarding-guide')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="bg-brand-500 hover:bg-brand-600 font-bold whitespace-nowrap"
          >
            View Onboarding SOP
          </Button>
        </div>
      </section>
    </div>
  );
};