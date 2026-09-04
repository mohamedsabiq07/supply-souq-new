import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Button } from '../../components/ui/Button';
import { HighlightBadge } from '../../components/ui/Badge';
import { Card, CardContent } from '../../components/ui/Card';
import { SupplierCard } from '../../components/supplier/SupplierCard';
import { AnimatedAuditBanner } from '../../components/audit/AnimatedAuditBanner';
import { KineticHeadline } from '../../components/ui/KineticText';
import { StatCounter } from '../../components/ui/StatCounter';
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
  onOpenCompareDemo?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setCurrentView }) => {
  const { isAuthenticated } = useAuth();
  const { categories, companies, rfqs } = useAppData();

  const verifiedSuppliers = companies.filter(c => c.companyType === 'supplier');

  const handleStartBuyer = (bundle?: QuickBundle) => {
    if (!isAuthenticated) {
      setCurrentView('login', { redirect: 'create-rfq', bundle });
      return;
    }
    setCurrentView('create-rfq', { bundle });
  };

  const handleStartSupplier = () => {
    if (!isAuthenticated) {
      setCurrentView('login', { redirect: 'supplier-inbox' });
      return;
    }
    setCurrentView('supplier-inbox');
  };

  const handleQuickPhotoUpload = () => {
    if (!isAuthenticated) {
      setCurrentView('login', { redirect: 'create-rfq', mode: 'photo_upload' });
      return;
    }
    setCurrentView('create-rfq', { mode: 'photo_upload' });
  };

  return (
    <div className="space-y-16 pb-20">
      {/* HERO SECTION - FUTURISTIC ELECTRICAL PROCUREMENT EXCHANGE */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-cyan-900/30 bg-obsidian-950 text-white">
        {/* Futuristic Cyber-Grid Background Layer */}
        <div className="absolute inset-0 cyber-grid-cyan opacity-25 pointer-events-none" />
        
        {/* Ambient Radial Gradient Spotlights */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[750px] h-[380px] bg-gradient-to-b from-cyan-500/20 via-sky-600/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-20 w-[350px] h-[350px] bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            
            {/* High-Tech Live Status Badge */}
            <div className="inline-flex items-center gap-2 bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold shadow-glow-cyan backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="tracking-wide">UAE B2B ELECTRICAL MATERIAL EXCHANGE • 24H SLA</span>
            </div>

            {/* Static Pre-Title */}
            <div className="space-y-2">
              <h2 className="text-sm sm:text-base uppercase tracking-[0.25em] font-mono text-slate-400 font-bold">
                Direct Wholesale Sourcing for Contractors & Stockists
              </h2>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                Source Verified UAE Materials:<br />
                {/* Dynamic Kinetic Text Rotator */}
                <KineticHeadline />
              </h1>
            </div>

            <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              Connect directly with authorized UAE stockists in Al Quoz, Sharjah & Deira. Submit your material list to receive competitive wholesale bids under the <strong className="text-cyan-300 font-semibold">Fastest 5 Bids Rule</strong> in 24 hours.
            </p>

            {/* Main Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleStartBuyer()}
                leftIcon={<Zap className="w-5 h-5 text-amber-300 fill-amber-300" />}
                className="w-full sm:w-auto bg-gradient-to-r from-brand-500 to-cyan-500 hover:from-brand-600 hover:to-cyan-600 shadow-glow-brand text-sm py-3.5 px-7 font-extrabold border border-cyan-400/30 transition-all hover:scale-[1.02]"
              >
                Post Live RFQ (100% Free)
              </Button>

              <Button
                variant="amber"
                size="lg"
                onClick={() => setCurrentView('invoice-audit')}
                leftIcon={<Sparkles className="w-5 h-5" />}
                className="w-full sm:w-auto text-sm py-3.5 px-7 font-extrabold shadow-glow-amber transition-all hover:scale-[1.02]"
              >
                Free Cable Invoice Audit (Save 15%+)
              </Button>
            </div>

            {/* Futuristic Live Telemetry Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-6 max-w-4xl mx-auto font-sans">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl hover:border-cyan-500/50 hover:shadow-glow-cyan transition-all duration-300 text-left group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Avg Savings</span>
                  <span className="w-2 h-2 rounded-full bg-cyan-400 group-hover:animate-ping" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-cyan-400 tracking-tight flex items-baseline">
                  <StatCounter target={18.4} decimals={1} suffix="%" />
                </div>
                <span className="text-[11px] text-slate-400 block mt-1 font-medium">vs Deira retail pricing</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl hover:border-amber-500/50 hover:shadow-glow-amber transition-all duration-300 text-left group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Response SLA</span>
                  <span className="w-2 h-2 rounded-full bg-amber-400 group-hover:animate-ping" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight flex items-baseline gap-1 whitespace-nowrap">
                  <StatCounter target={24} />
                  <span className="text-sm sm:text-base font-bold text-amber-200/80">Hours</span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-1 font-medium">Guaranteed turnaround</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl hover:border-emerald-500/50 transition-all duration-300 text-left group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Fastest Bids Cap</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:animate-ping" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight flex items-baseline gap-1 whitespace-nowrap">
                  <StatCounter target={5} />
                  <span className="text-sm sm:text-base font-bold text-emerald-200/80">Stockists</span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-1 font-medium">First-to-quote priority</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl hover:border-sky-500/50 transition-all duration-300 text-left group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Trade License</span>
                  <span className="w-2 h-2 rounded-full bg-sky-400 group-hover:animate-ping" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-baseline">
                  <StatCounter target={100} suffix="%" />
                </div>
                <span className="text-[11px] text-slate-400 block mt-1 font-medium">DET UAE verified</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* DYNAMIC PRICE AUDIT CALLOUT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedAuditBanner onLaunchAudit={() => setCurrentView('invoice-audit')} />
      </section>

      {/* 4-PILLAR PROCUREMENT ARCHITECTURE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-800 text-white space-y-8 shadow-2xl">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Next-Generation B2B Material Exchange</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Built for UAE Contractors, Engineers & Material Stockists
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                A transparent, zero-commission marketplace connecting real UAE contractors with authorized distributors.
              </p>
            </div>

            <Button
              variant="amber"
              onClick={() => handleStartBuyer()}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="font-bold text-xs"
            >
              Post Live RFQ
            </Button>
          </div>

          {/* 4 Pillar Value Props */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3 hover:border-amber-500/40 hover:-translate-y-1.5 hover:bg-slate-800/90 hover:shadow-xl transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors">Direct Multi-Vendor Bidding</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Post your material BOQ once. All verified UAE stockists under your category receive it and submit itemized prices within 24 hours.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3 hover:border-emerald-500/40 hover:-translate-y-1.5 hover:bg-slate-800/90 hover:shadow-xl transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">DET Verified Suppliers</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every vendor is vetted with valid UAE Commercial Trade Licenses, ensuring genuine factory drums, test certificates, and warranties.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3 hover:border-sky-500/40 hover:-translate-y-1.5 hover:bg-slate-800/90 hover:shadow-xl transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <GitCompare className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm group-hover:text-sky-300 transition-colors">Side-by-Side Matrix</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Evaluate quotations side-by-side on price, delivery lead times, payment terms, and vendor track record before issuing Purchase Orders.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3 hover:border-purple-500/40 hover:-translate-y-1.5 hover:bg-slate-800/90 hover:shadow-xl transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <PackageCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm group-hover:text-purple-300 transition-colors">100% Tax Compliant</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full 5% UAE VAT invoices, structured milestone payments, and direct delivery to your job sites in Dubai, Sharjah, and across the UAE.
              </p>
            </div>
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