import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { StatCounter } from '../../components/ui/StatCounter';
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
  ChevronDown,
  Camera,
  FileSpreadsheet,
  Star,
  Activity,
  PhoneOff,
  AlertTriangle,
  BadgeCheck,
  FileCheck2,
  DollarSign,
  Truck,
  TrendingUp,
  MapPin
} from 'lucide-react';

interface HomePageProps {
  setCurrentView: (view: string, params?: any) => void;
  onOpenCompareDemo?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setCurrentView }) => {
  const { isAuthenticated } = useAuth();
  const { categories, companies, rfqs } = useAppData();

  // State for interactive prompt chips
  const [selectedPrompt, setSelectedPrompt] = useState<string>('cables');
  // State for FAQ accordion
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

  const prompts = [
    { id: 'cables', label: '⚡ LV & MV Power Cables', query: 'Find verified UAE stockists for 4C x 16mm² XLPE/SWA/PVC Ducab cable (500m) with 24h delivery to Al Quoz', match: 'Found 5 verified stockists. Lowest bid: AED 38.50/m (Apex Cables, Al Quoz, DET Verified). Guaranteed 24h delivery. Savings: 18.4% vs retail.' },
    { id: 'ducab', label: '🏢 Ducab & Riyadh Stockists', query: 'Compare wholesale prices for Riyadh Cables single core 2.5mm² (100m coils, 40 boxes) with mill test certificates', match: 'Found 4 authorized Riyadh Cables distributors in Sharjah Industrial Area. Bulk quote: AED 142.00/box. Immediate dispatch.' },
    { id: 'trays', label: '📦 Cable Trays & GI Conduits', query: 'Source 300mm GI Perforated Cable Tray 2.0mm thickness (120 meters) + bend accessories for Dubai South project', match: 'Decoduct & Metsec fabricators responded. Lowest quote: AED 48.00/m. Stamped mill inspection sheets included.' },
    { id: 'switchgear', label: '🔌 Switchgear & DBs', query: 'Need 12-way TPN Distribution Board with 100A 30mA RCCB Schneider Electric Acti9 for retail fitout in Business Bay', match: 'Schneider certified panel builder bid: AED 2,150.00 complete with type test certificate & DEWA compliance note.' },
    { id: 'lighting', label: '💡 Commercial LED Lighting', query: '600x600 LED Panel 40W 4000K IP44 (250 pcs) for commercial tower retrofit in JLT', match: 'Philips & Osram stockists submitted quotes. Lowest bid: AED 42.00/pc. 5-year replacement warranty confirmed.' },
  ];

  const currentPromptData = prompts.find(p => p.id === selectedPrompt) || prompts[0];

  const brands = [
    { name: 'DUCAB', tag: 'Certified Copper & XLPE' },
    { name: 'RIYADH CABLES', tag: 'KSA & UAE Authorized' },
    { name: 'SCHNEIDER ELECTRIC', tag: 'Acti9 & Compact NSX' },
    { name: 'DECODUCT', tag: 'BS EN Certified Conduits' },
    { name: 'ELSEWEDY ELECTRIC', tag: 'Heavy Industrial Power' },
    { name: 'OMAN CABLES', tag: 'Oman & GCC Approved' },
    { name: 'LEGRAND', tag: 'Wiring Devices & Cable Mgmt' },
    { name: 'ABB', tag: 'Industrial Switchgear' }
  ];

  const faqs = [
    {
      q: 'How does the Fastest 5 Bids Rule work?',
      a: 'When an RFQ is posted, our matching engine broadcasts it to verified UAE stockists. Only the first 5 stockists who submit compliant, itemized prices are admitted. This creates keen price competition for the contractor while guaranteeing stockists that their quotation won\'t be buried in a sea of 50 competitors.'
    },
    {
      q: 'How much does SupplySouq cost for contractors and suppliers?',
      a: 'For Contractors & Engineers: 100% Free Forever. Post unlimited RFQs, receive 5 verified quotes, and compare side-by-side with zero fees. For Verified Stockists: Enjoy a 3-Month Free Trial with 0% platform commission during launch. After 3 months, it is only AED 1 per day (AED 30/month) for unlimited RFQ quoting.'
    },
    {
      q: 'How do you verify supplier trade licenses and authenticity?',
      a: 'Every stockist is required to upload a valid UAE Commercial Trade License issued by DET (Dubai Economy & Tourism) or DED Sharjah/Abu Dhabi. Our verification team confirms their licensed commercial activities ("Building Materials Trading", "Electrical Equipment Trading") and valid TRN before they can bid on RFQs.'
    },
    {
      q: 'Can I upload handwritten site notes or Excel BOQs?',
      a: 'Yes! You can upload an Excel spreadsheet, a PDF material schedule, or simply take a photo of a handwritten requisition sheet from your site foreman. Our system standardizes line items, quantities, and technical specifications into clean bidding packages.'
    },
    {
      q: 'How is site delivery and 5% UAE VAT handled?',
      a: 'All quotations clearly display unit prices, total VAT (5%), and logistics terms (either Supplier Fleet or SupplySouq Managed Logistics with 1.5T Pickups or 7T Hiab cranes). Official FTA-compliant tax invoices and digital Purchase Orders are generated directly in the platform.'
    },
    {
      q: 'Which UAE areas are covered for direct job site dispatch?',
      a: 'We cover all 7 Emirates: Dubai (Al Quoz, JAFZA, Dubai South, Downtown), Sharjah (Industrial Areas 1–17, SAIF Zone), Abu Dhabi (Mussafah, ICAD, Khalifa City), Ajman, RAK, and Fujairah.'
    }
  ];

  return (
    <div className="bg-[#020f0c] text-white selection:bg-[#00ffae] selection:text-[#020f0c] overflow-hidden font-sans">
      
      {/* 1. HERO SECTION - GENT CYBER-MINT THEME */}
      <section className="relative pt-16 sm:pt-24 pb-20 sm:pb-32 overflow-hidden border-b border-[#00ffae]/10">
        {/* Subtle Cyber Mint Grid Background */}
        <div className="absolute inset-0 cyber-grid-mint opacity-40 pointer-events-none" />
        
        {/* Ambient Radial Spotlights */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-b from-[#00ffae]/20 via-[#00452e]/10 to-transparent blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] bg-[#00ffae]/10 blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 -right-40 w-[450px] h-[450px] bg-[#00ffae]/10 blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            
            {/* Glowing Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-[#002116cc] border border-[#00ffae]/35 text-[#00ffae] px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase shadow-glow-mint backdrop-blur-xl">
              <span className="w-2 h-2 rounded-full bg-[#00ffae] animate-ping" />
              <span>UAE B2B ELECTRICAL MATERIAL EXCHANGE • 24H SLA</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
              Source Verified UAE Materials.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#a4ffe2] to-[#00ffae]">
                Skip Deira Calling. Close Wholesale Quotes.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              Upload your material BOQ or cable schedule in 60 seconds — top verified UAE stockists compete with wholesale pricing under our guaranteed <strong className="text-[#00ffae] font-semibold">Fastest 5 Bids Rule</strong> in 24 hours.
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => handleStartBuyer()}
                className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-black bg-[#00ffae] text-[#020f0c] hover:bg-[#a4ffe2] transition-all duration-300 shadow-glow-mint hover:scale-105 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-[#020f0c]" />
                <span>Post Live RFQ (100% Free)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setCurrentView('invoice-audit')}
                className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-bold bg-white/5 hover:bg-white/10 text-white border border-white/15 backdrop-blur-md transition-all duration-300 hover:border-[#00ffae]/40 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Free Cable Cost Audit (Save 15%+)</span>
              </button>
            </div>

            {/* Interactive Prompt Chips (Gent AI Prompt Bar Style) */}
            <div className="pt-6">
              <span className="text-[11px] uppercase tracking-widest text-slate-400 font-bold block mb-3 font-mono">
                Quick Category Sourcing Simulation:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {prompts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPrompt(p.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      selectedPrompt === p.id
                        ? 'bg-[#00ffae] text-[#020f0c] font-bold shadow-glow-mint scale-105'
                        : 'bg-[#002116cc] text-slate-300 border border-[#00ffae]/20 hover:border-[#00ffae]/50 hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Central Interactive Terminal Mockup (Gent Flagship Card) */}
            <div className="pt-6 max-w-3xl mx-auto text-left">
              <div className="rounded-3xl bg-[#00120bd9] border border-[#00ffae]/25 p-5 sm:p-7 shadow-2xl backdrop-blur-2xl relative overflow-hidden group hover:border-[#00ffae]/40 transition-all duration-300">
                {/* Subtle top light bar */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00ffae]/60 to-transparent" />
                
                {/* Terminal Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="ml-2 text-slate-300 font-bold">SupplySouq B2B Procurement Engine v2.4</span>
                  </div>
                  <span className="text-[#00ffae] font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00ffae] animate-ping" />
                    24h SLA Active
                  </span>
                </div>

                {/* Simulated Contractor Input */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3 bg-[#002116cc] p-3.5 rounded-2xl border border-[#00ffae]/20">
                    <div className="w-8 h-8 rounded-xl bg-[#00ffae]/20 text-[#00ffae] flex items-center justify-center font-bold shrink-0 text-xs">
                      RFQ
                    </div>
                    <div>
                      <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Active Contractor Query</div>
                      <div className="text-sm font-semibold text-white mt-0.5">{currentPromptData.query}</div>
                    </div>
                  </div>

                  {/* Engine Live Response */}
                  <div className="flex items-start gap-3 bg-white/[0.03] p-4 rounded-2xl border border-white/10">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-[#00ffae]" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs font-bold text-[#00ffae] font-mono uppercase tracking-wider">Fastest 5 Bids Rule: 5 Verified Quotes In</span>
                        <span className="text-[11px] text-slate-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10 font-mono">Average Turnaround: 2h 45m</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                        {currentPromptData.match}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                        <span className="inline-flex items-center gap-1 text-[#00ffae] bg-[#002116cc] px-2.5 py-0.5 rounded-full border border-[#00ffae]/30">
                          <BadgeCheck className="w-3.5 h-3.5" /> DET Trade License Verified
                        </span>
                        <span className="inline-flex items-center gap-1 text-slate-300 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                          <Clock className="w-3.5 h-3.5 text-amber-400" /> 24h Site Delivery
                        </span>
                        <span className="inline-flex items-center gap-1 text-slate-300 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                          <FileCheck2 className="w-3.5 h-3.5 text-sky-400" /> 5% UAE VAT FTA Ready
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instant Action Footer */}
                <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <span className="text-slate-400">Want to test this on your project BOQ?</span>
                  <button
                    onClick={() => handleStartBuyer()}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#00ffae] hover:bg-[#a4ffe2] text-[#020f0c] font-black transition-all shadow-glow-mint flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Post Real RFQ Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Live Metrics Grid (Gent 4-Column Stat Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-8 max-w-4xl mx-auto text-left font-sans">
              <div className="p-4 rounded-2xl bg-[#00120bd9] border border-[#00ffae]/20 backdrop-blur-xl hover:border-[#00ffae]/50 hover:shadow-glow-mint transition-all duration-300 group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 font-mono">Avg Savings</span>
                  <span className="w-2 h-2 rounded-full bg-[#00ffae] group-hover:animate-ping" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#00ffae] tracking-tight flex items-baseline">
                  <StatCounter target={18.4} decimals={1} suffix="%" />
                </div>
                <span className="text-[11px] text-slate-400 block mt-1">vs Deira retail quote</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#00120bd9] border border-amber-500/20 backdrop-blur-xl hover:border-amber-400/50 hover:shadow-glow-amber transition-all duration-300 group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 font-mono">Response SLA</span>
                  <span className="w-2 h-2 rounded-full bg-amber-400 group-hover:animate-ping" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight flex items-baseline gap-1 whitespace-nowrap">
                  <StatCounter target={24} />
                  <span className="text-sm font-bold text-amber-200/80">Hours</span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-1">Guaranteed turnaround</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#00120bd9] border border-[#00ffae]/20 backdrop-blur-xl hover:border-[#00ffae]/50 hover:shadow-glow-mint transition-all duration-300 group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 font-mono">Fastest Bids Cap</span>
                  <span className="w-2 h-2 rounded-full bg-[#00ffae] group-hover:animate-ping" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-baseline gap-1 whitespace-nowrap">
                  <StatCounter target={5} />
                  <span className="text-sm font-bold text-slate-300">Stockists</span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-1">First-to-quote priority</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#00120bd9] border border-sky-500/20 backdrop-blur-xl hover:border-sky-400/50 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 font-mono">Trade License</span>
                  <span className="w-2 h-2 rounded-full bg-sky-400 group-hover:animate-ping" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-sky-400 tracking-tight flex items-baseline">
                  <StatCounter target={100} suffix="%" />
                </div>
                <span className="text-[11px] text-slate-400 block mt-1">UAE DET / DED verified</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. PARTNER / STOCKIST BRAND MARQUEE */}
      <section className="py-12 border-b border-white/5 bg-[#00120bd9] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-6">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-bold font-mono">
            Trusted by 250+ UAE Contractors &amp; Certified Stockists across Dubai, Sharjah &amp; Abu Dhabi
          </p>
        </div>

        <div className="overflow-hidden whitespace-nowrap relative [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="inline-flex gap-10 animate-marquee hover:[animation-play-state:paused]">
            {[...brands, ...brands].map((brand, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-[#002116cc] border border-[#00ffae]/20 text-slate-200 hover:border-[#00ffae]/50 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-[#00ffae]" />
                <span className="font-extrabold text-sm tracking-wider text-white">{brand.name}</span>
                <span className="text-[11px] text-[#a4ffe2] font-mono">• {brand.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. THE PROBLEM SECTION (Gent Contrast Architecture) */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center space-y-3 mb-14 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>The Traditional Sourcing Problem</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Contractors are drowning in manual sourcing.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-normal">
            Manual phone calls to Deira &amp; Al Quoz, non-transparent markups, delayed quotes, and unverified suppliers — your project engineers waste days just trying to buy materials.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-3xl bg-[#00120bd9] border border-red-500/20 space-y-4 hover:border-red-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
              <PhoneOff className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-red-300 transition-colors">
              Endless WhatsApp Calling
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calling 15 different retail shops across Deira and Sharjah just to check if cable drums or GI trays are physically in stock.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#00120bd9] border border-red-500/20 space-y-4 hover:border-red-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-red-300 transition-colors">
              Delayed 48h+ Quoting
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Waiting days for sales reps to convert your BOQ into a PDF quotation while your site works stall and deadlines approach.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#00120bd9] border border-red-500/20 space-y-4 hover:border-red-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-red-300 transition-colors">
              Unverified Grey Stock
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Risking site rejection by DEWA or SEWA inspectors due to missing mill test certificates or unlicensed middleman distributors.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#00120bd9] border border-red-500/20 space-y-4 hover:border-red-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-red-300 transition-colors">
              Disorganized Manual BOQs
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Juggling 20 different PDF quotes in different formats and notes with zero side-by-side transparency on price and lead times.
            </p>
          </div>
        </div>
      </section>

      {/* 4. THE SOLUTION BENTO GRID (Gent Flagship: "Every feature shows its work") */}
      <section className="py-20 sm:py-28 border-t border-b border-[#00ffae]/10 bg-[#00120bd9] relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#00ffae]/10 blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-3 mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#002116cc] text-[#00ffae] border border-[#00ffae]/35 shadow-glow-mint">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>The Next-Gen B2B Solution</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Every feature shows its work.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-normal">
              Not just claims — purpose-built procurement technology engineered to guarantee quotes in 24 hours with complete price transparency.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Bento Card 1: Multi-Vendor Bidding & 24H SLA */}
            <div className="p-7 sm:p-9 rounded-3xl bg-[#020f0c] border border-[#00ffae]/20 hover:border-[#00ffae]/50 transition-all duration-300 space-y-6 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#00ffae]/10 text-[#00ffae] flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Multi-Vendor Bidding with Guaranteed 24H SLA
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Post your material requirement once. Verified UAE stockists receive immediate WhatsApp &amp; dashboard alerts to submit wholesale pricing before the 24-hour countdown expires.
                </p>
              </div>

              {/* Interactive Visual Element */}
              <div className="p-4 rounded-2xl bg-[#00120bd9] border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 uppercase">SLA Clock: RFQ #SS-2026-089</span>
                  <span className="text-[#00ffae] font-bold">14h 22m Remaining</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#00ffae] h-full rounded-full w-[65%]" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
                  <span>Posted: 09:30 AM (Sharjah)</span>
                  <span className="text-emerald-400 font-bold">3 Quotes Submitted</span>
                </div>
              </div>
            </div>

            {/* Bento Card 2: Fastest 5 Bids Rule */}
            <div className="p-7 sm:p-9 rounded-3xl bg-[#020f0c] border border-[#00ffae]/20 hover:border-[#00ffae]/50 transition-all duration-300 space-y-6 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Guaranteed Fastest 5 Bids Rule
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Only the first 5 verified stockists can submit quotes. This motivates suppliers to bid their lowest price immediately, while saving contractors from drowning in 50 spam emails.
                </p>
              </div>

              {/* Interactive Visual: 5 Slot Display */}
              <div className="grid grid-cols-5 gap-2 pt-2 text-center">
                {[
                  { slot: '1', name: 'Apex', price: 'AED 38.50', status: 'Filled' },
                  { slot: '2', name: 'Emirates', price: 'AED 39.20', status: 'Filled' },
                  { slot: '3', name: 'Gulf Cb', price: 'AED 38.90', status: 'Filled' },
                  { slot: '4', name: 'Al Quoz', price: 'AED 40.00', status: 'Filled' },
                  { slot: '5', name: 'Open', price: 'Available', status: 'Open' }
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border ${
                      s.status === 'Open'
                        ? 'bg-[#002116cc] border-[#00ffae]/40 animate-pulse text-[#00ffae]'
                        : 'bg-white/5 border-white/10 text-slate-300'
                    }`}
                  >
                    <div className="text-[10px] font-mono uppercase text-slate-400">Slot {s.slot}</div>
                    <div className="text-xs font-black mt-0.5 truncate">{s.name}</div>
                    <div className="text-[10px] font-mono mt-1 text-[#00ffae] font-bold">{s.price}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bento Card 3: Automated BOQ & Schedule Standardizer */}
            <div className="p-7 sm:p-9 rounded-3xl bg-[#020f0c] border border-[#00ffae]/20 hover:border-[#00ffae]/50 transition-all duration-300 space-y-6 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Automated BOQ &amp; Cable Schedule Cleansing
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Upload any format — Excel schedules, PDF requisition sheets, or smartphone photos of site notes. Our engine parses specs, standardizes cable codes, and matches stockists instantly.
                </p>
              </div>

              {/* Visual Element */}
              <div className="p-4 rounded-2xl bg-[#00120bd9] border border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                    XLS
                  </div>
                  <div>
                    <div className="font-bold text-white">Cable_Schedule_Tower_B.xlsx</div>
                    <div className="text-[11px] text-slate-400 font-mono">18 Line Items • Standardized to BS 5467</div>
                  </div>
                </div>
                <span className="text-[#00ffae] font-bold text-xs font-mono">✓ Ready to Quote</span>
              </div>
            </div>

            {/* Bento Card 4: UAE DET KYB & FTA VAT Compliance */}
            <div className="p-7 sm:p-9 rounded-3xl bg-[#020f0c] border border-[#00ffae]/20 hover:border-[#00ffae]/50 transition-all duration-300 space-y-6 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                  <BadgeCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  100% UAE DET KYB &amp; FTA Tax Compliance
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Every supplier is verified with genuine UAE Commercial Registration, 15-digit TRN, and physical stock in Dubai or Sharjah. Complete with 5% UAE VAT invoices and digital POs.
                </p>
              </div>

              {/* Visual Element */}
              <div className="p-4 rounded-2xl bg-[#00120bd9] border border-white/10 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-slate-300">
                  <ShieldCheck className="w-5 h-5 text-[#00ffae]" />
                  <span>TRN: 100482938400003</span>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  FTA Verified
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS 3-STEP MODERN WORKFLOW */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#002116cc] text-[#00ffae] border border-[#00ffae]/35">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast &amp; Transparent Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            How SupplySouq Works in 3 Steps
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-normal">
            No endless sales calls. No manual spreadsheets. From BOQ to job site delivery in 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {[
            {
              step: '01',
              title: 'Post Material BOQ or Photo',
              desc: 'Upload your Excel cable schedule, enter line items, or snap a photo of a site note. Our engine parses specs and notifies stockists instantly.',
              icon: FileSpreadsheet
            },
            {
              step: '02',
              title: 'Receive 5 Live Wholesale Quotes',
              desc: 'Verified UAE stockists submit prices within 24 hours under the Fastest 5 Bids Rule. Compare side-by-side on price, brand, and lead times.',
              icon: GitCompare
            },
            {
              step: '03',
              title: '1-Click PO & Job Site Delivery',
              desc: 'Award the best quote to generate an official digital PO. Track dispatch directly to your project site in Dubai, Sharjah, or Abu Dhabi.',
              icon: PackageCheck
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-[#00120bd9] border border-white/10 hover:border-[#00ffae]/40 transition-all duration-300 space-y-5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black font-mono text-[#00ffae] opacity-80 group-hover:opacity-100 transition-opacity">
                    {item.step}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-[#002116cc] border border-[#00ffae]/30 text-[#00ffae] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. BIG TELEMETRY & IMPACT STATS */}
      <section className="py-16 border-t border-b border-[#00ffae]/10 bg-[#002116cc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                <StatCounter target={18.4} decimals={1} suffix="%" />
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#00ffae] font-bold">
                Average Savings
              </div>
              <p className="text-[11px] text-slate-400">vs Deira retail quote</p>
            </div>

            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight flex items-center justify-center gap-1">
                <span>&lt;</span>
                <StatCounter target={4} />
                <span className="text-2xl font-bold">h</span>
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#00ffae] font-bold">
                Turnaround to First Quote
              </div>
              <p className="text-[11px] text-slate-400">Guaranteed 24h SLA</p>
            </div>

            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                <StatCounter target={500} suffix="+" />
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#00ffae] font-bold">
                Verified UAE Stockists
              </div>
              <p className="text-[11px] text-slate-400">DET / DED licensed</p>
            </div>

            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                <span>AED </span>
                <StatCounter target={42} suffix="M+" />
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#00ffae] font-bold">
                Materials Sourced
              </div>
              <p className="text-[11px] text-slate-400">Across Dubai &amp; Sharjah</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CONTRACTOR & STOCKIST REVIEWS (Gent Testimonial Layout) */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#002116cc] text-[#00ffae] border border-[#00ffae]/35">
            <Star className="w-3.5 h-3.5 fill-[#00ffae]" />
            <span>Verified UAE Feedback</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Procurement teams love SupplySouq.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-normal">
            Hear from commercial managers, MEP project directors, and authorized distributors across the Emirates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-[#00120bd9] border border-white/10 hover:border-[#00ffae]/40 transition-all space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-[#00ffae]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#00ffae]" />
                ))}
              </div>
              <h4 className="text-lg font-bold text-white">"Cut cable sourcing from 4 days to 4 hours."</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                "We replaced endless phone calls to Deira with SupplySouq. The Fastest 5 Bids rule ensures we get rock-bottom wholesale prices from Ducab stockists. Saved AED 34,000 on our last substation order alone."
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#00ffae]/20 text-[#00ffae] font-bold flex items-center justify-center text-xs">
                MK
              </div>
              <div>
                <div className="text-xs font-bold text-white">Maya K.</div>
                <div className="text-[11px] text-slate-400">Head of Procurement, Apex MEP Contracting</div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[#00120bd9] border border-[#00ffae]/30 hover:border-[#00ffae]/60 shadow-glow-mint transition-all space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-[#00ffae]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#00ffae]" />
                ))}
              </div>
              <h4 className="text-lg font-bold text-white">"Setup took 5 minutes. 5 bids in 3 hours."</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                "I uploaded a photo of my site foreman's handwritten requisition sheet. Within 3 hours I had 5 itemized quotes with mill test certificates ready to download. Genuinely revolutionary for UAE construction."
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#00ffae]/20 text-[#00ffae] font-bold flex items-center justify-center text-xs">
                AR
              </div>
              <div>
                <div className="text-xs font-bold text-white">Alex Rivera</div>
                <div className="text-[11px] text-slate-400">Project Director, Gulf Infrastructure LLC</div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[#00120bd9] border border-white/10 hover:border-[#00ffae]/40 transition-all space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-[#00ffae]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#00ffae]" />
                ))}
              </div>
              <h4 className="text-lg font-bold text-white">"Sharjah warehouse stock moves 3x faster."</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                "As an authorized cable stockist in Sharjah Industrial Area 13, SupplySouq sends pre-qualified RFQs straight to our sales desk. We quote directly to contractors with guaranteed 24h turnaround."
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#00ffae]/20 text-[#00ffae] font-bold flex items-center justify-center text-xs">
                TW
              </div>
              <div>
                <div className="text-xs font-bold text-white">Tom Wilson</div>
                <div className="text-[11px] text-slate-400">Managing Director, Emirates Cable Supplies</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TRANSPARENT LAUNCH PRICING SECTION (Tailored to User Rules) */}
      <section id="pricing-section" className="py-20 sm:py-28 border-t border-b border-[#00ffae]/10 bg-[#00120bd9] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#002116cc] text-[#00ffae] border border-[#00ffae]/35">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Transparent Launch Pricing</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Simple pricing. Zero hidden fees.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-normal">
              100% free forever for contractors. First 3 months free trial for suppliers, then AED 1 per day. 0% platform commission during launch.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* Tier 1: Contractors & Engineers */}
            <div className="p-8 rounded-3xl bg-[#020f0c] border border-white/10 hover:border-[#00ffae]/30 transition-all flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">For Buyers</span>
                  <h3 className="text-2xl font-black text-white mt-1">Contractor Free</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    For UAE electrical contractors, engineers, estimators, and facility managers.
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">AED 0</span>
                  <span className="text-xs text-slate-400 font-semibold">/ Free Forever</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-300 pt-4 border-t border-white/10">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00ffae] shrink-0" />
                    <span>Unlimited RFQ &amp; BOQ Postings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00ffae] shrink-0" />
                    <span>Guaranteed 5 Quotes per RFQ</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00ffae] shrink-0" />
                    <span>Side-by-Side Comparison Matrix</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00ffae] shrink-0" />
                    <span>1-Click Digital Purchase Orders</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00ffae] shrink-0" />
                    <span>Free Cable Invoice Audit (Save 15%+)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00ffae] shrink-0" />
                    <span>0% Buyer Platform Fee</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleStartBuyer()}
                className="w-full py-3.5 rounded-full text-xs font-bold text-white bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#00ffae]/40 transition-all cursor-pointer"
              >
                Post Live RFQ (Free)
              </button>
            </div>

            {/* Tier 2: Verified Stockists (Gent Highlighted Card) */}
            <div className="p-8 rounded-3xl bg-[#002116cc] border-2 border-[#00ffae] shadow-glow-mint flex flex-col justify-between space-y-8 relative group">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#00ffae] text-[#020f0c] text-[10px] font-black uppercase tracking-wider py-1 px-4 rounded-full shadow-md font-mono">
                Launch Phase • 3 Months Free Trial
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#00ffae] font-bold">For Stockists &amp; Traders</span>
                  <h3 className="text-2xl font-black text-white mt-1">Verified Supplier</h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Direct access to live contractor RFQs in Dubai, Sharjah, and Abu Dhabi.
                  </p>
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-[#00ffae]">AED 0</span>
                    <span className="text-xs text-slate-300 font-semibold">/ First 3 Months</span>
                  </div>
                  <div className="text-[11px] text-[#a4ffe2] font-mono mt-1">
                    Then AED 1 / day (AED 30/mo) after trial • 0% Commission
                  </div>
                </div>

                <ul className="space-y-3 text-xs text-slate-200 pt-4 border-t border-[#00ffae]/20">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00ffae] shrink-0" />
                    <span>Unlimited Quotation Submissions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00ffae] shrink-0" />
                    <span>Instant WhatsApp &amp; Email RFQ Alerts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00ffae] shrink-0" />
                    <span>Fastest 5 Bids Priority Allocation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00ffae] shrink-0" />
                    <span>Official DET Verified Supplier Badge</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00ffae] shrink-0" />
                    <span>0% Commission During Launch Phase</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00ffae] shrink-0" />
                    <span>Direct Site Delivery Coordination</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleStartSupplier()}
                className="w-full py-4 rounded-full text-xs font-black bg-[#00ffae] text-[#020f0c] hover:bg-[#a4ffe2] shadow-glow-mint transition-all hover:scale-105 cursor-pointer"
              >
                Claim 3-Month Free Trial
              </button>
            </div>

            {/* Tier 3: Enterprise Procurement */}
            <div className="p-8 rounded-3xl bg-[#020f0c] border border-white/10 hover:border-[#00ffae]/30 transition-all flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">For EPCs &amp; Developers</span>
                  <h3 className="text-2xl font-black text-white mt-1">Enterprise Desk</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Custom procurement infrastructure for Tier-1 contractors and large project portfolios.
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">Custom</span>
                  <span className="text-xs text-slate-400 font-semibold">/ Tailored SLA</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-300 pt-4 border-t border-white/10">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00ffae] shrink-0" />
                    <span>Dedicated Procurement Operations Desk</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00ffae] shrink-0" />
                    <span>Custom ERP &amp; Procore Integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00ffae] shrink-0" />
                    <span>30/60/90-Day Credit &amp; PDC Support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00ffae] shrink-0" />
                    <span>Multi-Site Dedicated Logistics Fleet</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00ffae] shrink-0" />
                    <span>Priority Guaranteed 6-Hour SLA</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setCurrentView('onboarding-guide')}
                className="w-full py-3.5 rounded-full text-xs font-bold text-white bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#00ffae]/40 transition-all cursor-pointer"
              >
                Contact Enterprise Desk
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 9. FAQ ACCORDION (Gent Q&A Layout) */}
      <section className="py-20 sm:py-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#002116cc] text-[#00ffae] border border-[#00ffae]/35">
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Questions? Answered.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-normal">
            Everything you need to know about buying or selling materials on SupplySouq.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#00120bd9] border border-white/10 overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none hover:text-[#00ffae] transition-colors cursor-pointer"
              >
                <span className="font-bold text-sm sm:text-base text-white">{faq.q}</span>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 text-slate-400">
                  {openFaq === idx ? (
                    <ChevronDown className="w-4 h-4 text-[#00ffae] rotate-180 transition-transform" />
                  ) : (
                    <ChevronDown className="w-4 h-4 transition-transform" />
                  )}
                </div>
              </button>
              {openFaq === idx && (
                <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 10. HIGH-IMPACT BOTTOM CLOSING CTA BANNER (Gent "Stop prospecting. Start closing.") */}
      <section className="py-20 sm:py-28 border-t border-[#00ffae]/15 relative overflow-hidden bg-gradient-to-b from-[#00120bd9] to-[#020f0c]">
        {/* Radial ambient glow */}
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-[#00ffae]/20 blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#002116cc] border border-[#00ffae]/35 text-[#00ffae] px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase shadow-glow-mint">
            <span className="w-2 h-2 rounded-full bg-[#00ffae] animate-ping" />
            <span>Ready for 24-Hour Procurement?</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Stop calling Deira.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#a4ffe2] to-[#00ffae]">
              Start building.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Your project materials won't source themselves. But SupplySouq will. Post your first RFQ in 60 seconds — 100% free.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => handleStartBuyer()}
              className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-black bg-[#00ffae] text-[#020f0c] hover:bg-[#a4ffe2] transition-all shadow-glow-mint hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-[#020f0c]" />
              <span>Post Live RFQ (100% Free)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentView('onboarding-guide')}
              className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-bold bg-white/5 hover:bg-white/10 text-white border border-white/15 backdrop-blur-md transition-all cursor-pointer"
            >
              View Onboarding SOP
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#00ffae]" /> 100% DET Verified Trade Licenses
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#00ffae]" /> 5% UAE VAT FTA Invoicing
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#00ffae]" /> Guaranteed 24h SLA
            </span>
          </div>
        </div>
      </section>

    </div>
  );
};