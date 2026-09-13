import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSpreadsheet, Cpu, GitCompare, Truck, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Clock } from 'lucide-react';

interface EditorialHowItWorksProps {
  onStartRFQ?: () => void;
}

const STEPS = [
  {
    id: '01',
    phase: 'STEP 01',
    title: 'Drop Specs or Upload BOM',
    desc: 'Submit your requirements via structured form, bulk CSV, or quick voice memo. Our parser cleans SKU lines, tolerances, and destination constraints in seconds.',
    icon: FileSpreadsheet,
    badge: 'PARSER ACTIVE',
    mockup: {
      tag: 'BOM INGESTION',
      headline: 'RFQ #SSQ-9042: Industrial Valves & Flanges',
      subhead: '48 items mapped • Auto-checked against ISO standard 10497',
      items: [
        { name: 'Forged Steel Gate Valve 2" 800# A105N', qty: '120 Units', status: 'Verified' },
        { name: 'Spiral Wound Gasket 316L Inner Ring', qty: '450 Units', status: 'Verified' },
        { name: 'SS 316 Ball Valve Class 150 Flanged', qty: '60 Units', status: 'Matched' },
      ],
      kpi: '99.4% Parsing Accuracy',
    },
  },
  {
    id: '02',
    phase: 'STEP 02',
    title: 'Instant Match to Pre-Vetted Suppliers',
    desc: 'Supply Souq queries our network of ISO-certified stockists, manufacturers, and authorized distributors with live yard capacity across UAE & GCC.',
    icon: Cpu,
    badge: 'NETWORK DISPATCH',
    mockup: {
      tag: 'CAPACITY ALLOCATION',
      headline: '4 Tier-1 Distributors Responding',
      subhead: 'Stock available in JAFZA, Dubai Industrial City & Musaffah',
      items: [
        { name: 'Al-Bayan Steel Yard JAFZA', qty: 'Immediate Dispatch', status: 'Ready' },
        { name: 'Gulf Pipes & Fittings Musaffah', qty: '3-Day Assembly', status: 'Confirmed' },
        { name: 'Emirates Industrial Stockists', qty: 'Direct Mill Allotment', status: 'Ready' },
      ],
      kpi: 'Avg. response time: 84 mins',
    },
  },
  {
    id: '03',
    phase: 'STEP 03',
    title: 'Compare Price, Mill MTCs & Delivery Terms',
    desc: 'View normalized side-by-side offers. No hidden markups, inspect valid Mill Test Certificates (MTCs), payment credit terms, and guaranteed delivery dates.',
    icon: GitCompare,
    badge: 'SIDE-BY-SIDE MATRIX',
    mockup: {
      tag: 'BID AUDIT MATRIX',
      headline: 'Normalized Bid Comparison',
      subhead: 'Lowest net landed cost highlighted with verified MTC 3.1',
      items: [
        { name: 'Option A: Tier 1 Dubai Stockist', qty: 'AED 84,200', status: 'Best Value (-14%)' },
        { name: 'Option B: Direct Mill Jebel Ali', qty: 'AED 88,500', status: 'Faster ETA' },
        { name: 'Option C: Abu Dhabi Distributor', qty: 'AED 92,100', status: 'Standard' },
      ],
      kpi: 'Average Savings: 14.8%',
    },
  },
  {
    id: '04',
    phase: 'STEP 04',
    title: 'Consolidated PO & Tracked Gate Delivery',
    desc: 'Issue one single Purchase Order to Supply Souq. We handle credit escrow, QA gate inspection, GPS freight dispatch, and consolidated invoicing.',
    icon: Truck,
    badge: 'ESCROW & TRACKING',
    mockup: {
      tag: 'DISPATCH STATUS',
      headline: 'Truck #DXB-8839 En Route to Site A4',
      subhead: 'Driver assigned • GPS Active • MTC documentation attached',
      items: [
        { name: 'Departure: JAFZA Logistics Hub', qty: '08:45 AM', status: 'Cleared Gate' },
        { name: 'Midway Checkpoint: E11 Highway', qty: '10:15 AM', status: 'In Transit' },
        { name: 'Delivery Site: Khalifa Port Terminal', qty: 'ETA 11:30 AM', status: 'Pending Unload' },
      ],
      kpi: 'On-Time Delivery Rate: 99.1%',
    },
  },
];

export const EditorialHowItWorks: React.FC<EditorialHowItWorksProps> = ({ onStartRFQ }) => {
  const [activeStep, setActiveStep] = useState(0);
  const current = STEPS[activeStep];

  return (
    <section className="relative bg-[#09090b] text-white py-28 border-b border-zinc-800 overflow-hidden">
      {/* Background Subtle Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block w-2.5 h-2.5 bg-[#e61937]" />
              <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
                [SSQ-WORKFLOW] • PROTOCOL 0.4
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight leading-none text-white">
              HOW SUPPLY SOUQ <br />
              <span className="text-[#e61937]">REVOLUTIONIZES</span> BUYING.
            </h2>
          </div>
          <p className="mt-6 md:mt-0 text-zinc-400 max-w-md text-sm sm:text-base leading-relaxed">
            Eliminate endless back-and-forth emails, phantom stock quotations, and fragmented invoicing. One seamless digital pipeline from requisition to site drop.
          </p>
        </div>

        {/* Dynamic Curved Flow Connector */}
        <div className="hidden lg:block relative mb-12">
          <svg className="w-full h-16" viewBox="0 0 1000 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 125 30 C 250 30, 250 30, 375 30 C 500 30, 500 30, 625 30 C 750 30, 750 30, 875 30"
              stroke="#27272a"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <motion.path
              d="M 125 30 C 250 30, 250 30, 375 30 C 500 30, 500 30, 625 30 C 750 30, 750 30, 875 30"
              stroke="#e61937"
              strokeWidth="3"
              initial={{ pathLength: 0.25 }}
              animate={{ pathLength: (activeStep + 1) / 4 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </svg>

          {/* Connected Floating Metric Pills */}
          <div className="grid grid-cols-4 gap-4 -mt-10">
            {STEPS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveStep(idx)}
                className={`text-left p-3 rounded-none border transition-all duration-300 ${
                  activeStep === idx
                    ? 'border-[#e61937] bg-zinc-900 shadow-[0_0_20px_rgba(230,25,55,0.2)]'
                    : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className={activeStep === idx ? 'text-[#e61937] font-bold' : 'text-zinc-500'}>
                    {s.phase}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-zinc-300">
                    {s.badge}
                  </span>
                </div>
                <div className="text-xs font-bold text-white truncate">{s.title}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Interactive Interactive Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-8">
          {/* Left Column: Interactive 2x2 Step Selector */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStep === idx;
              return (
                <motion.div
                  key={step.id}
                  onClick={() => setActiveStep(idx)}
                  whileHover={{ y: -2 }}
                  className={`cursor-pointer p-6 border transition-all duration-300 flex flex-col justify-between relative ${
                    isActive
                      ? 'bg-zinc-900 border-[#e61937] shadow-[0_0_30px_rgba(230,25,55,0.15)]'
                      : 'bg-[#121215] border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/60'
                  }`}
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)',
                  }}
                >
                  {/* Top indicator */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-2xl font-black font-display ${isActive ? 'text-[#e61937]' : 'text-zinc-600'}`}>
                        {step.id}
                      </span>
                      <div className={`w-9 h-9 flex items-center justify-center ${isActive ? 'bg-[#e61937] text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs font-mono">
                    <span className={isActive ? 'text-[#e61937] font-semibold' : 'text-zinc-500'}>
                      {isActive ? '● ACTIVE PHASE' : 'CLICK TO AUDIT'}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'translate-x-1 text-[#e61937]' : 'text-zinc-600'}`} />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Live Mockup Dashboard Screen */}
          <div className="lg:col-span-6 flex flex-col">
            <div 
              className="flex-1 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border border-zinc-700/80 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)',
              }}
            >
              {/* Window Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-600" />
                  <span className="w-3 h-3 rounded-full bg-zinc-700" />
                  <span className="w-3 h-3 rounded-full bg-zinc-700" />
                  <span className="ml-3 text-xs font-mono text-zinc-400">supply-souq-core // v2.4.8</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 bg-zinc-800/80 px-2.5 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e61937] animate-ping" />
                  LIVE TELEMETRY
                </div>
              </div>

              {/* Dynamic Animated Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider px-2.5 py-1 bg-[#e61937]/15 text-[#ff3b56] border border-[#e61937]/30">
                      {current.mockup.tag}
                    </span>
                    <span className="text-xs font-mono text-zinc-500">
                      SYS-REF: {current.id}-09B
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xl sm:text-2xl font-bold font-display text-white mb-1">
                      {current.mockup.headline}
                    </h4>
                    <p className="text-xs sm:text-sm text-zinc-400">
                      {current.mockup.subhead}
                    </p>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2.5 bg-black/50 p-4 border border-zinc-800/80 rounded-sm">
                    {current.mockup.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5 bg-zinc-900/60 border border-zinc-800/50 text-xs"
                      >
                        <div className="flex items-center gap-2.5 text-zinc-200 font-medium truncate pr-2">
                          <CheckCircle2 className="w-4 h-4 text-[#e61937] shrink-0" />
                          <span className="truncate">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-zinc-400 font-mono text-[11px]">{item.qty}</span>
                          <span className="px-2 py-0.5 text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Highlighted KPI Ribbon */}
                  <div className="p-3 bg-[#e61937]/10 border border-[#e61937]/30 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2 text-[#ff4d67]">
                      <Sparkles className="w-4 h-4" />
                      <span>{current.mockup.kpi}</span>
                    </div>
                    <span className="text-zinc-400">GCC WIDE SLA</span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Action Bottom */}
              <div className="pt-6 mt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <ShieldCheck className="w-4 h-4 text-[#e61937]" />
                  <span>Escrow protected & 100% verified documentation</span>
                </div>
                {onStartRFQ && (
                  <button
                    onClick={onStartRFQ}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#e61937] hover:bg-[#ff1f3d] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(230,25,55,0.4)]"
                  >
                    <span>Try With Your RFQ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
