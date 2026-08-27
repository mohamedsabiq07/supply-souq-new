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
              <span>UAE B2B Procurement • Serving Dubai, Sharjah & Ajman</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Source Electrical Supplies in the UAE.<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-200 to-sky-300">
                Post Requirements. Compare 5 Quotes. Save 18%.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Connect directly with verified stockists across Dubai, Sharjah, and Ajman. Upload your material list in 30 seconds to receive competitive quotations for cables, switchgear, LED lighting, and containment in 24 hours.
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

              <Button
                variant="outline"
                size="lg"
                onClick={handleQuickPhotoUpload}
                leftIcon={<Camera className="w-5 h-5 text-emerald-400" />}
                className="w-full sm:w-auto text-sm py-3 px-6 font-bold bg-slate-800/80 border-slate-700 text-white hover:bg-slate-700"
              >
                📸 Snap Photo of Cable Schedule
              </Button>
            </div>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                <Sparkles className="w-4 h-4 text-emerald-400" /> Free Subscription: 5 Quotes Included
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> DEWA / SEWA Certified Stockists
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" /> Al Quoz & Sharjah Electrical Yards
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-400" /> 24-Hour Quote Delivery
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* COST AUDIT ANIMATED BANNER (10 DYNAMIC ROTATING HOOKS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedAuditBanner onLaunchAudit={() => setCurrentView('invoice-audit')} />
      </section>

      {/* SIGNATURE COMPARISON SHOWCASE: 5 VERIFIED ELECTRICAL QUOTES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-brand-950 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-brand-800/40 shadow-2xl relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-400/30 mb-2">
                <Zap className="w-3.5 h-3.5" /> High-Value Electrical Procurement Showcase
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Live Quotation Comparison: 5 Verified Supplier Offers
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Comparing 5 verified UAE stockist quotations for RFQ #{featuredRFQ.rfqNumber} ({featuredRFQ.title}).
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setRole('buyer');
                setCurrentView('buyer-compare', { rfqId: featuredRFQ.id });
              }}
              leftIcon={<GitCompare className="w-4 h-4" />}
              className="bg-brand-500 hover:bg-brand-600 self-start md:self-auto font-bold"
            >
              Open Full Comparison Matrix
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {demoQuotes.map((quote, idx) => (
              <div
                key={quote.id}
                className="bg-slate-900/90 rounded-2xl p-4 border border-slate-700/80 hover:border-amber-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-slate-400">{quote.quotationNumber}</span>
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-400/30">
                      Quote {idx + 1} of 5
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{quote.supplierCompanyName}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{quote.supplierZone}</p>

                  <div className="my-2.5 p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-baseline justify-between">
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase font-semibold">Total (Incl. VAT)</span>
                      <span className="text-base font-extrabold text-white">{formatAED(quote.grandTotalAED)}</span>
                    </div>
                    <span className="text-[10px] text-amber-400 font-bold">★ {quote.supplierRating}</span>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-300">
                    <div className="flex justify-between py-0.5 border-b border-slate-800">
                      <span className="text-slate-400">Lead Time:</span>
                      <strong className="text-white">{quote.leadTimeDisplay || quote.leadTimeDays + ' Day'}</strong>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-800">
                      <span className="text-slate-400">Payment:</span>
                      <strong className="text-white">{quote.paymentTerms}</strong>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-400">Spec:</span>
                      <span className="text-emerald-400 font-medium text-[10px]">DEWA Certified</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-slate-900 bg-white hover:bg-slate-100 font-bold text-xs py-1.5"
                    onClick={() => {
                      setRole('buyer');
                      setCurrentView('buyer-compare', { rfqId: featuredRFQ.id });
                    }}
                  >
                    Select Offer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VERIFIED SUPPLIERS BY CATEGORY DIRECTORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>UAE Verified Material Verticals</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Browse Verified Stockists by Category
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Electrical cables & switchgear, plumbing & sanitary, HVAC ducting, chemicals, and site safety.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('suppliers')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700"
          >
            <span>Explore All Verified Suppliers</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { name: 'Electrical Supplies', icon: Zap, count: '6 Stockists', desc: 'Ducab cables, Schneider MCBs, 60x60 LED, GI trays' },
            { name: 'Plumbing & Sanitary', icon: Layers, count: '3 Stockists', desc: 'PPR PN20 pipes, UPVC drainage, valves & pumps' },
            { name: 'HVAC & Mechanical', icon: Sparkles, count: '3 Stockists', desc: 'GI ductwork, copper tubing, R410a, insulation' },
            { name: 'Chemicals & Adhesives', icon: ShieldCheck, count: '2 Stockists', desc: 'PU sealants, waterproofing, epoxies & solvents' },
            { name: 'Safety & PPE Tools', icon: PackageCheck, count: '2 Stockists', desc: 'Helmets, safety boots, power tools & fasteners' }
          ].map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Card
                key={idx}
                className="hover:border-amber-400 hover:shadow-card transition-all cursor-pointer group p-4 bg-white"
                onClick={() => setCurrentView('suppliers')}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all font-bold">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] font-bold text-brand-600 block mt-0.5">{cat.count}</span>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {cat.desc}
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-brand-600">
                  <span>View Verified</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* VERIFIED ELECTRICAL STOCKISTS DIRECTORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Verified UAE Electrical Stockists
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Authorized cable distributors and switchgear stockists with active UAE DET Trade Licenses.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('suppliers')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700"
          >
            <span>Explore All Stockists</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {verifiedSuppliers.slice(0, 3).map((supp) => (
            <SupplierCard
              key={supp.id}
              supplier={supp}
              onRequestQuote={() => handleStartBuyer()}
            />
          ))}
        </div>
      </section>

      {/* ONBOARDING SOP CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white border border-slate-800 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Seamless UAE Electrical Onboarding Procedure
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Are you an MEP Contractor or Electrical Stockist?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Read our step-by-step onboarding guide, compliance requirements, and DET trade license verification procedure.
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={() => setCurrentView('onboarding-guide')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="bg-brand-500 hover:bg-brand-600 font-bold whitespace-nowrap"
          >
            View Onboarding Guide
          </Button>
        </div>
      </section>
    </div>
  );
};