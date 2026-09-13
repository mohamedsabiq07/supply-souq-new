import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { StatCounter } from '../../components/ui/StatCounter';
import { QuickBundle } from '../../types';
import { CinematicScrollSection } from '../../components/home/CinematicScrollSection';
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
    <div className="bg-[#f4f4f6] text-slate-900 selection:bg-[#cf2e46] selection:text-white overflow-hidden font-sans">
      
      {/* 1. HERO SECTION - ARCHITECTURAL STUDIO GRAY & NEIDEN GRID */}
      <section className="relative pt-16 sm:pt-24 pb-20 sm:pb-32 overflow-hidden border-b border-slate-200/90 bg-[#f4f4f6]">
        {/* Architectural Column Guide Lines (Neiden style) */}
        <div className="absolute inset-0 pointer-events-none max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between z-0">
          <div className="w-px h-full bg-slate-300/40" />
          <div className="w-px h-full bg-slate-300/30 hidden md:block" />
          <div className="w-px h-full bg-slate-300/30 hidden lg:block" />
          <div className="w-px h-full bg-slate-300/40" />
        </div>

        {/* Subtle Architectural Grid with graceful radial mask */}
        <div className="absolute inset-0 architectural-grid opacity-70 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_20%,black_30%,transparent_90%)] pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            
            {/* Neiden Technical Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-slate-300 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider text-slate-800 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#cf2e46] animate-pulse" />
              <span className="text-[#cf2e46] font-extrabold">[SS®—PROCUREMENT]</span>
              <span className="text-slate-700">UAE'S VERIFIED B2B SOURCING NETWORK</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-950 leading-[1.1]">
              UAE Construction Procurement,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-rose-700 to-[#cf2e46]">
                Simplified.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
              Upload your material list or BOQ in 60 seconds. Top verified UAE stockists compete to give you the best wholesale prices within 24 hours.
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => handleStartBuyer()}
                className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-black bg-[#cf2e46] text-white hover:bg-[#b91c33] transition-all duration-300 shadow-md hover:scale-105 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Post Live RFQ (100% Free)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setCurrentView('invoice-audit')}
                className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-bold bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 shadow-xs transition-all duration-300 hover:border-slate-400 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#cf2e46]" />
                <span>Free Cable Cost Audit (Save 15%+)</span>
              </button>
            </div>

            {/* Interactive Prompt Chips (Gent AI Prompt Bar Style) */}
            <div className="pt-6">
              <span className="text-[11px] uppercase tracking-widest text-slate-500 font-bold block mb-3 font-mono">
                Quick Category Sourcing Simulation:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {prompts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPrompt(p.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      selectedPrompt === p.id
                        ? 'bg-slate-950 text-white font-bold shadow-sm scale-105 border border-slate-950'
                        : 'bg-white text-slate-700 border border-slate-300 hover:border-slate-400 hover:text-slate-950 shadow-2xs'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Central Interactive Terminal Mockup sitting on gray canvas */}
            <div className="pt-6 max-w-3xl mx-auto text-left">
              <div className="rounded-3xl bg-white border border-slate-300/80 p-5 sm:p-7 shadow-lg relative overflow-hidden group hover:border-slate-400 transition-all duration-300">
                {/* Subtle top light bar */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#cf2e46] to-transparent" />
                
                {/* Terminal Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4 text-xs font-mono text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#cf2e46] inline-block" />
                    <span className="w-3 h-3 rounded-full bg-slate-300 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-slate-300 inline-block" />
                    <span className="ml-2 text-slate-800 font-bold">SupplySouq B2B Procurement Engine v2.4</span>
                  </div>
                  <span className="text-[#cf2e46] font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#cf2e46] animate-ping" />
                    24h SLA Active
                  </span>
                </div>

                {/* Simulated Contractor Input */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <div className="w-8 h-8 rounded-xl bg-rose-100 text-[#cf2e46] flex items-center justify-center font-bold shrink-0 text-xs">
                      RFQ
                    </div>
                    <div>
                      <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Active Contractor Query</div>
                      <div className="text-sm font-semibold text-slate-900 mt-0.5">{currentPromptData.query}</div>
                    </div>
                  </div>

                  {/* Engine Live Response */}
                  <div className="flex items-start gap-3 bg-rose-50/50 p-4 rounded-2xl border border-rose-200/80">
                    <div className="w-8 h-8 rounded-xl bg-rose-100 text-[#cf2e46] flex items-center justify-center font-bold shrink-0 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-[#cf2e46]" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs font-bold text-[#cf2e46] font-mono uppercase tracking-wider">Fastest 5 Bids Rule: 5 Verified Quotes In</span>
                        <span className="text-[11px] text-slate-600 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 font-mono shadow-2xs">Average Turnaround: 2h 45m</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                        {currentPromptData.match}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                        <span className="inline-flex items-center gap-1 text-[#cf2e46] bg-white px-2.5 py-0.5 rounded-full border border-rose-200 shadow-2xs">
                          <BadgeCheck className="w-3.5 h-3.5" /> DET Trade License Verified
                        </span>
                        <span className="inline-flex items-center gap-1 text-slate-700 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                          <Clock className="w-3.5 h-3.5 text-[#cf2e46]" /> 24h Site Delivery
                        </span>
                        <span className="inline-flex items-center gap-1 text-slate-700 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                          <FileCheck2 className="w-3.5 h-3.5 text-[#cf2e46]" /> 5% UAE VAT FTA Ready
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instant Action Footer */}
                <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <span className="text-slate-500">Want to test this on your project BOQ?</span>
                  <button
                    onClick={() => handleStartBuyer()}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#cf2e46] hover:bg-[#b91c33] text-white font-black transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Post Real RFQ Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Live Metrics Grid (Gent 4-Column Stat Cards with crisp definition) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-8 max-w-4xl mx-auto text-left font-sans">
              <div className="p-4 rounded-2xl bg-white border border-slate-300/80 shadow-xs hover:border-slate-400 hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 font-mono">Avg Savings</span>
                  <span className="w-2 h-2 rounded-full bg-[#cf2e46] group-hover:animate-ping" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#cf2e46] tracking-tight flex items-baseline">
                  <StatCounter target={18.4} decimals={1} suffix="%" />
                </div>
                <span className="text-[11px] text-slate-500 block mt-1">vs standard offline quotes</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-300/80 shadow-xs hover:border-slate-400 hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 font-mono">Response SLA</span>
                  <span className="w-2 h-2 rounded-full bg-[#cf2e46] group-hover:animate-ping" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-baseline gap-1 whitespace-nowrap">
                  <StatCounter target={24} />
                  <span className="text-sm font-bold text-slate-600">Hours</span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-1">Guaranteed turnaround</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-300/80 shadow-xs hover:border-slate-400 hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 font-mono">Fastest Bids Cap</span>
                  <span className="w-2 h-2 rounded-full bg-[#cf2e46] group-hover:animate-ping" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-baseline gap-1 whitespace-nowrap">
                  <StatCounter target={5} />
                  <span className="text-sm font-bold text-slate-600">Stockists</span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-1">First-to-quote priority</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-300/80 shadow-xs hover:border-slate-400 hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 font-mono">Trade License</span>
                  <span className="w-2 h-2 rounded-full bg-[#cf2e46] group-hover:animate-ping" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#cf2e46] tracking-tight flex items-baseline">
                  <StatCounter target={100} suffix="%" />
                </div>
                <span className="text-[11px] text-slate-500 block mt-1">UAE DET / DED verified</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 1.5 CINEMATIC SCROLL-DRIVEN STORYTELLING SECTION */}
      <CinematicScrollSection setCurrentView={setCurrentView} />

      {/* 2. PARTNER / STOCKIST BRAND MARQUEE - RICH CONCRETE GRAY BAND */}
      <section className="py-12 border-b border-slate-300/80 bg-[#eceef1] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-6">
          <p className="text-xs uppercase tracking-widest text-slate-600 font-bold font-mono">
            Trusted by 250+ UAE Contractors &amp; Certified Stockists across Dubai, Sharjah &amp; Abu Dhabi
          </p>
        </div>

        <div className="overflow-hidden whitespace-nowrap relative [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="inline-flex gap-8 animate-marquee hover:[animation-play-state:paused]">
            {[...brands, ...brands].map((brand, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white border border-slate-300/80 text-slate-800 hover:border-slate-400 shadow-2xs transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-[#cf2e46]" />
                <span className="font-extrabold text-sm tracking-wider text-slate-900">{brand.name}</span>
                <span className="text-[11px] text-[#cf2e46] font-mono">• {brand.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. THE PROBLEM SECTION */}
      <section className="py-20 sm:py-28 relative bg-[#f4f4f6] border-b border-slate-200/90">
        {/* Subtle column guide lines */}
        <div className="absolute inset-0 pointer-events-none max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between z-0">
          <div className="w-px h-full bg-slate-300/30" />
          <div className="w-px h-full bg-slate-300/20 hidden md:block" />
          <div className="w-px h-full bg-slate-300/20 hidden lg:block" />
          <div className="w-px h-full bg-slate-300/30" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-3 mb-14 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-white text-[#cf2e46] border border-slate-300 shadow-2xs">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>[SS®—CHALLENGE] The Traditional Procurement Bottleneck</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Material procurement shouldn't take days of follow-ups.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Manual phone calls, scattered WhatsApp messages, and waiting days for quotes — procurement teams spend hours chasing individual suppliers instead of focusing on project execution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-300/80 space-y-4 hover:border-slate-400 hover:shadow-md transition-all group shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#cf2e46] flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                <PhoneOff className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#cf2e46] transition-colors">
                Manual Follow-Ups
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Contacting multiple suppliers individually just to check stock availability, specifications, and delivery schedules.
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-300/80 space-y-4 hover:border-slate-400 hover:shadow-md transition-all group shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#cf2e46] flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#cf2e46] transition-colors">
                Delayed Quotations
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Waiting days for responses and price updates while site work pauses and project deadlines approach.
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-300/80 space-y-4 hover:border-slate-400 hover:shadow-md transition-all group shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#cf2e46] flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#cf2e46] transition-colors">
                Inconsistent Specifications
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dealing with mismatched product standards, unverified compliance, or missing technical data sheets.
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-300/80 space-y-4 hover:border-slate-400 hover:shadow-md transition-all group shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#cf2e46] flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#cf2e46] transition-colors">
                Scattered Comparisons
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Juggling dozens of different PDF quotes across emails and chats with no easy way to compare rates side-by-side.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3.5 EDITORIAL SOURCING DISCIPLINES & VISUAL GRID (Neiden Screenshot Layout) */}
      <section className="py-20 sm:py-28 relative bg-[#f4f4f6] border-b border-slate-300/80 overflow-hidden">
        {/* Architectural Column Guide Lines */}
        <div className="absolute inset-0 pointer-events-none max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between z-0">
          <div className="w-px h-full bg-slate-300/40" />
          <div className="w-px h-full bg-slate-300/30 hidden md:block" />
          <div className="w-px h-full bg-slate-300/30 hidden lg:block" />
          <div className="w-px h-full bg-slate-300/40" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Editorial Headline & High-Contrast Button */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-slate-800 uppercase">
                  <span className="text-[#cf2e46] font-black">●●●●</span>
                  <span>[SS®—SERVICES / 思想と調達]</span>
                </div>
                <h2 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight leading-[1.05]">
                  What We<br />Source
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md font-normal">
                  Four core MEP electrical disciplines. One network: connecting UAE project teams directly to certified wholesale distributors at manufacturer-direct rates.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="text-[11px] font-mono uppercase tracking-widest text-slate-500 font-bold">
                  Beyond Standard Project Scope
                </div>
                <p className="text-xs text-slate-600">
                  Made for commercial contractors. Built with certified UAE stockists.
                </p>
              </div>

              <div>
                <button
                  onClick={() => handleStartBuyer()}
                  className="px-8 py-4 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center justify-between gap-4 shadow-sm cursor-pointer group"
                >
                  <span>Request Bulk Quote</span>
                  <span className="text-base font-light group-hover:translate-x-0.5 transition-transform">+</span>
                </button>
              </div>
            </div>

            {/* Right Column: Sourcing Tags & High-Resolution Editorial Photo Grid */}
            <div className="lg:col-span-7 space-y-6">
              {/* Category Pills Bar */}
              <div className="p-6 rounded-3xl bg-white border border-slate-300/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                  <span className="font-mono text-slate-500 uppercase tracking-wider font-bold">Core Sourcing Disciplines</span>
                  <span className="font-mono font-bold text-[#cf2e46] uppercase bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                    Starting from 0% Buyer Fee
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    'LV & MV Power Cables',
                    'Switchgear & DBs',
                    'Cable Trays & Ladders',
                    'GI & PVC Conduits',
                    'Commercial LED Lighting',
                    'Distribution Transformers'
                  ].map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-slate-50 border border-slate-200 text-slate-800 hover:border-slate-300 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Side-by-Side High-Contrast Editorial Images (Neiden Aesthetic) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Visual Card 1: Infrastructure & Cables */}
                <div className="rounded-3xl bg-white border border-slate-300/80 overflow-hidden shadow-xs hover:shadow-md transition-all group">
                  <div className="p-5 pb-3">
                    <div className="text-[11px] font-mono text-slate-500 uppercase">
                      001. / <span className="text-slate-400 font-sans">現場と配送</span>
                    </div>
                    <h3 className="text-base font-black text-slate-900 mt-1">
                      Heavy Industrial Power
                    </h3>
                  </div>
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=800&auto=format&fit=crop&q=80"
                      alt="UAE High-rise Infrastructure and Material Sourcing"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter contrast-[1.05]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white font-mono">
                      <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20">
                        [4C x 240mm² XLPE]
                      </span>
                      <span className="flex items-center gap-1.5 bg-[#cf2e46] px-2.5 py-1 rounded-md font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        24H DISPATCH
                      </span>
                    </div>
                  </div>
                </div>

                {/* Visual Card 2: Switchgear & Engineering */}
                <div className="rounded-3xl bg-white border border-slate-300/80 overflow-hidden shadow-xs hover:shadow-md transition-all group">
                  <div className="p-5 pb-3">
                    <div className="text-[11px] font-mono text-slate-500 uppercase">
                      002. / <span className="text-slate-400 font-sans">検査と認証</span>
                    </div>
                    <h3 className="text-base font-black text-slate-900 mt-1">
                      Type-Tested Switchgear
                    </h3>
                  </div>
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80"
                      alt="Precision electrical switchgear testing and quality compliance"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter contrast-[1.05]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white font-mono">
                      <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20">
                        [ASTA &amp; DEWA APPROVED]
                      </span>
                      <span className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20 font-bold text-slate-200">
                        5 BIDS RULE
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. THE SOLUTION BENTO GRID - RICH CONCRETE GRAY BAND */}
      <section className="py-20 sm:py-28 border-b border-slate-300/80 bg-[#eceef1] relative overflow-hidden">
        {/* Subtle Architectural grid texture */}
        <div className="absolute inset-0 architectural-grid-subtle opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-3 mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-white text-[#cf2e46] border border-slate-300 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>[SS®—ARCHITECTURE] The Next-Gen B2B Solution</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Every feature shows its work.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Not just claims — purpose-built procurement technology engineered to guarantee quotes in 24 hours with complete price transparency.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Bento Card 1: Multi-Vendor Bidding & 24H SLA */}
            <div className="p-7 sm:p-9 rounded-3xl bg-white border border-slate-300/80 hover:border-slate-400 shadow-sm hover:shadow-md transition-all duration-300 space-y-6 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#cf2e46] flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Multi-Vendor Bidding with Guaranteed 24H SLA
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Post your material requirement once. Verified UAE stockists receive immediate WhatsApp &amp; dashboard alerts to submit wholesale pricing before the 24-hour countdown expires.
                </p>
              </div>

              {/* Interactive Visual Element */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 uppercase">SLA Clock: RFQ #SS-2026-089</span>
                  <span className="text-[#cf2e46] font-bold">14h 22m Remaining</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#cf2e46] h-full rounded-full w-[65%]" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-mono">
                  <span>Posted: 09:30 AM (Sharjah)</span>
                  <span className="text-[#cf2e46] font-bold">3 Quotes Submitted</span>
                </div>
              </div>
            </div>

            {/* Bento Card 2: Fastest 5 Bids Rule */}
            <div className="p-7 sm:p-9 rounded-3xl bg-white border border-slate-300/80 hover:border-slate-400 shadow-sm hover:shadow-md transition-all duration-300 space-y-6 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#cf2e46] flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Guaranteed Fastest 5 Bids Rule
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
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
                        ? 'bg-rose-50 border-rose-300 text-[#cf2e46] animate-pulse'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="text-[10px] font-mono uppercase text-slate-500">Slot {s.slot}</div>
                    <div className="text-xs font-black mt-0.5 truncate">{s.name}</div>
                    <div className="text-[10px] font-mono mt-1 text-[#cf2e46] font-bold">{s.price}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bento Card 3: Automated BOQ & Schedule Standardizer */}
            <div className="p-7 sm:p-9 rounded-3xl bg-white border border-slate-300/80 hover:border-slate-400 shadow-sm hover:shadow-md transition-all duration-300 space-y-6 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#cf2e46] flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Automated BOQ &amp; Cable Schedule Cleansing
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Upload any format — Excel schedules, PDF requisition sheets, or smartphone photos of site notes. Our engine parses specs, standardizes cable codes, and matches stockists instantly.
                </p>
              </div>

              {/* Visual Element */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 text-[#cf2e46] flex items-center justify-center font-bold">
                    XLS
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Cable_Schedule_Tower_B.xlsx</div>
                    <div className="text-[11px] text-slate-500 font-mono">18 Line Items • Standardized to BS 5467</div>
                  </div>
                </div>
                <span className="text-[#cf2e46] font-bold text-xs font-mono">✓ Ready to Quote</span>
              </div>
            </div>

            {/* Bento Card 4: UAE DET KYB & FTA VAT Compliance */}
            <div className="p-7 sm:p-9 rounded-3xl bg-white border border-slate-300/80 hover:border-slate-400 shadow-sm hover:shadow-md transition-all duration-300 space-y-6 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#cf2e46] flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                  <BadgeCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  100% UAE DET KYB &amp; FTA Tax Compliance
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Every supplier is verified with genuine UAE Commercial Registration, 15-digit TRN, and physical stock in Dubai or Sharjah. Complete with 5% UAE VAT invoices and digital POs.
                </p>
              </div>

              {/* Visual Element */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-slate-800">
                  <ShieldCheck className="w-5 h-5 text-[#cf2e46]" />
                  <span>TRN: 100482938400003</span>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-white text-[#cf2e46] border border-rose-200 shadow-2xs">
                  FTA Verified
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS 3-STEP MODERN WORKFLOW */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative bg-[#f4f4f6]">
        {/* Subtle column guide lines */}
        <div className="absolute inset-0 pointer-events-none max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between z-0">
          <div className="w-px h-full bg-slate-300/30" />
          <div className="w-px h-full bg-slate-300/20 hidden md:block" />
          <div className="w-px h-full bg-slate-300/20 hidden lg:block" />
          <div className="w-px h-full bg-slate-300/30" />
        </div>

        <div className="text-center space-y-3 mb-16 max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-white text-[#cf2e46] border border-slate-300 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>[SS®—WORKFLOW] Fast &amp; Transparent Execution</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            How SupplySouq Works in 3 Steps
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            No endless sales calls. No manual spreadsheets. From BOQ to job site delivery in 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
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
                className="p-8 rounded-3xl bg-white border border-slate-300/80 hover:border-slate-400 shadow-xs hover:shadow-md transition-all duration-300 space-y-5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black font-mono text-[#cf2e46] opacity-90 group-hover:opacity-100 transition-opacity">
                    {item.step}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-[#cf2e46] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. BIG TELEMETRY & IMPACT STATS */}
      <section className="py-16 border-t border-b border-slate-800 bg-[#0a0a0a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                <StatCounter target={18.4} decimals={1} suffix="%" />
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#cf2e46] font-bold">
                Average Savings
              </div>
              <p className="text-[11px] text-slate-400">vs standard offline quotes</p>
            </div>

            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight flex items-center justify-center gap-1">
                <span>&lt;</span>
                <StatCounter target={4} />
                <span className="text-2xl font-bold">h</span>
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#cf2e46] font-bold">
                Turnaround to First Quote
              </div>
              <p className="text-[11px] text-slate-400">Guaranteed 24h SLA</p>
            </div>

            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                <StatCounter target={500} suffix="+" />
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#cf2e46] font-bold">
                Verified UAE Stockists
              </div>
              <p className="text-[11px] text-slate-400">DET / DED licensed</p>
            </div>

            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                <span>AED </span>
                <StatCounter target={42} suffix="M+" />
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#cf2e46] font-bold">
                Materials Sourced
              </div>
              <p className="text-[11px] text-slate-400">Across Dubai &amp; Sharjah</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CONTRACTOR & STOCKIST REVIEWS */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative bg-[#f4f4f6]">
        {/* Subtle column guide lines */}
        <div className="absolute inset-0 pointer-events-none max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between z-0">
          <div className="w-px h-full bg-slate-300/30" />
          <div className="w-px h-full bg-slate-300/20 hidden md:block" />
          <div className="w-px h-full bg-slate-300/20 hidden lg:block" />
          <div className="w-px h-full bg-slate-300/30" />
        </div>

        <div className="text-center space-y-3 mb-16 max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-white text-[#cf2e46] border border-slate-300 shadow-2xs">
            <Star className="w-3.5 h-3.5 fill-[#cf2e46]" />
            <span>[SS®—REVIEWS] Verified UAE Industry Feedback</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Procurement teams love SupplySouq.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Hear from commercial managers, MEP project directors, and authorized distributors across the Emirates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <div className="p-8 rounded-3xl bg-white border border-slate-300/80 hover:border-slate-400 shadow-xs hover:shadow-md transition-all space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-[#cf2e46]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#cf2e46]" />
                ))}
              </div>
              <h4 className="text-lg font-bold text-slate-900">"Cut cable sourcing from 4 days to 4 hours."</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                "We replaced endless supplier phone calls with SupplySouq. Posting an RFQ takes minutes, and receiving itemized bids directly from verified stockists saved us AED 34,000 on our substation order alone."
              </p>
            </div>
            <div className="pt-4 border-t border-slate-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-[#cf2e46] font-bold flex items-center justify-center text-xs">
                MK
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Maya K.</div>
                <div className="text-[11px] text-slate-500">Head of Procurement, Apex MEP Contracting</div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white border-2 border-[#cf2e46] shadow-xl transition-all space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-[#cf2e46]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#cf2e46]" />
                ))}
              </div>
              <h4 className="text-lg font-bold text-slate-900">"Setup took 5 minutes. 5 bids in 3 hours."</h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                "I uploaded a photo of my site foreman's handwritten requisition sheet. Within 3 hours I had 5 itemized quotes with mill test certificates ready to download. Genuinely revolutionary for UAE construction."
              </p>
            </div>
            <div className="pt-4 border-t border-slate-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#cf2e46] text-white font-bold flex items-center justify-center text-xs">
                AR
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Alex Rivera</div>
                <div className="text-[11px] text-slate-500">Project Director, Gulf Infrastructure LLC</div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-300/80 hover:border-slate-400 shadow-xs hover:shadow-md transition-all space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-[#cf2e46]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#cf2e46]" />
                ))}
              </div>
              <h4 className="text-lg font-bold text-slate-900">"Sharjah warehouse stock moves 3x faster."</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                "As an authorized cable stockist in Sharjah Industrial Area 13, SupplySouq sends pre-qualified RFQs straight to our sales desk. We quote directly to contractors with guaranteed 24h turnaround."
              </p>
            </div>
            <div className="pt-4 border-t border-slate-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-[#cf2e46] font-bold flex items-center justify-center text-xs">
                TW
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Tom Wilson</div>
                <div className="text-[11px] text-slate-500">Managing Director, Emirates Cable Supplies</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TRANSPARENT LAUNCH PRICING SECTION - RICH CONCRETE GRAY BAND */}
      <section id="pricing-section" className="py-20 sm:py-28 border-t border-b border-slate-300/80 bg-[#eceef1] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-white text-[#cf2e46] border border-slate-300 shadow-2xs">
              <DollarSign className="w-3.5 h-3.5" />
              <span>[SS®—RATES] Transparent Launch Pricing</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Simple pricing. Zero hidden fees.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              100% free forever for contractors. First 3 months free trial for suppliers, then AED 1 per day. 0% platform commission during launch.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* Tier 1: Contractors & Engineers */}
            <div className="p-8 rounded-3xl bg-white border border-slate-300/80 hover:border-slate-400 shadow-sm transition-all flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">For Buyers</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">Contractor Free</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    For UAE electrical contractors, engineers, estimators, and facility managers.
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">AED 0</span>
                  <span className="text-xs text-slate-500 font-semibold">/ Free Forever</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-700 pt-4 border-t border-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#cf2e46] shrink-0" />
                    <span>Unlimited RFQ &amp; BOQ Postings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#cf2e46] shrink-0" />
                    <span>Guaranteed 5 Quotes per RFQ</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#cf2e46] shrink-0" />
                    <span>Side-by-Side Comparison Matrix</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#cf2e46] shrink-0" />
                    <span>1-Click Digital Purchase Orders</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#cf2e46] shrink-0" />
                    <span>Free Cable Invoice Audit (Save 15%+)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#cf2e46] shrink-0" />
                    <span>0% Buyer Platform Fee</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleStartBuyer()}
                className="w-full py-3.5 rounded-full text-xs font-bold text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-300 hover:border-slate-400 transition-all cursor-pointer"
              >
                Post Live RFQ (Free)
              </button>
            </div>

            {/* Tier 2: Verified Stockists */}
            <div className="p-8 rounded-3xl bg-white border-2 border-[#cf2e46] shadow-xl flex flex-col justify-between space-y-8 relative group">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#cf2e46] text-white text-[10px] font-black uppercase tracking-wider py-1 px-4 rounded-full shadow-md font-mono">
                Launch Phase • 3 Months Free Trial
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#cf2e46] font-bold">For Stockists &amp; Traders</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">Verified Supplier</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Direct access to live contractor RFQs in Dubai, Sharjah, and Abu Dhabi.
                  </p>
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-[#cf2e46]">AED 0</span>
                    <span className="text-xs text-slate-600 font-semibold">/ First 3 Months</span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-mono mt-1">
                    Then AED 1 / day (AED 30/mo) after trial • 0% Commission
                  </div>
                </div>

                <ul className="space-y-3 text-xs text-slate-700 pt-4 border-t border-rose-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#cf2e46] shrink-0" />
                    <span>Unlimited Quotation Submissions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#cf2e46] shrink-0" />
                    <span>Instant WhatsApp &amp; Email RFQ Alerts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#cf2e46] shrink-0" />
                    <span>Fastest 5 Bids Priority Allocation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#cf2e46] shrink-0" />
                    <span>Official DET Verified Supplier Badge</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#cf2e46] shrink-0" />
                    <span>0% Commission During Launch Phase</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#cf2e46] shrink-0" />
                    <span>Direct Site Delivery Coordination</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleStartSupplier()}
                className="w-full py-4 rounded-full text-xs font-black bg-[#cf2e46] text-white hover:bg-[#b91c33] shadow-md transition-all hover:scale-105 cursor-pointer"
              >
                Claim 3-Month Free Trial
              </button>
            </div>

            {/* Tier 3: Enterprise Procurement */}
            <div className="p-8 rounded-3xl bg-white border border-slate-300/80 hover:border-slate-400 shadow-sm transition-all flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">For EPCs &amp; Developers</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">Enterprise Desk</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Custom procurement infrastructure for Tier-1 contractors and large project portfolios.
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">Custom</span>
                  <span className="text-xs text-slate-500 font-semibold">/ Tailored SLA</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-700 pt-4 border-t border-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#cf2e46] shrink-0" />
                    <span>Dedicated Procurement Operations Desk</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#cf2e46] shrink-0" />
                    <span>Custom ERP &amp; Procore Integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#cf2e46] shrink-0" />
                    <span>30/60/90-Day Credit &amp; PDC Support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#cf2e46] shrink-0" />
                    <span>Multi-Site Dedicated Logistics Fleet</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#cf2e46] shrink-0" />
                    <span>Priority Guaranteed 6-Hour SLA</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setCurrentView('onboarding-guide')}
                className="w-full py-3.5 rounded-full text-xs font-bold text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-300 hover:border-slate-400 transition-all cursor-pointer"
              >
                Contact Enterprise Desk
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 9. FAQ ACCORDION */}
      <section className="py-20 sm:py-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative bg-[#f4f4f6]">
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-white text-[#cf2e46] border border-slate-300 shadow-2xs">
            <span>[SS®—FAQ] Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Questions? Answered.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Everything you need to know about buying or selling materials on SupplySouq.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white border border-slate-300/80 overflow-hidden shadow-2xs transition-all duration-200"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none hover:text-[#cf2e46] transition-colors cursor-pointer"
              >
                <span className="font-bold text-sm sm:text-base text-slate-900">{faq.q}</span>
                <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 text-slate-600 shadow-2xs">
                  {openFaq === idx ? (
                    <ChevronDown className="w-4 h-4 text-[#cf2e46] rotate-180 transition-transform" />
                  ) : (
                    <ChevronDown className="w-4 h-4 transition-transform" />
                  )}
                </div>
              </button>
              {openFaq === idx && (
                <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 10. HIGH-IMPACT BOTTOM CLOSING CTA BANNER */}
      <section className="py-20 sm:py-28 border-t border-slate-800 relative overflow-hidden bg-[#0a0a0a] text-white">
        {/* Radial ambient glow */}
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-[#cf2e46]/20 blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-[#ffb3bf] px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#cf2e46] animate-ping" />
            <span>Ready for 24-Hour Procurement?</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Spend less time sourcing.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ffb3bf] to-[#cf2e46]">
              More time building.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Connect directly with verified UAE suppliers ready to quote on your project needs. Post your material list in 60 seconds — 100% free for buyers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => handleStartBuyer()}
              className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-black bg-[#cf2e46] text-white hover:bg-[#b91c33] transition-all shadow-md hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Post Live RFQ (100% Free)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentView('onboarding-guide')}
              className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer"
            >
              View Onboarding SOP
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#cf2e46]" /> 100% DET Verified Trade Licenses
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#cf2e46]" /> 5% UAE VAT FTA Invoicing
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#cf2e46]" /> Guaranteed 24h SLA
            </span>
          </div>
        </div>
      </section>

    </div>
  );
};
