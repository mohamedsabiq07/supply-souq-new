import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShieldCheck, Clock, Star, Zap, Store } from 'lucide-react';
import { QuickBundle } from '../../types';

interface NeidenHeroProps {
  onStartBuyer: (bundle?: QuickBundle) => void;
  onExploreStockists: () => void;
}

export const NeidenHero: React.FC<NeidenHeroProps> = ({ onStartBuyer, onExploreStockists }) => {
  const [selectedPrompt, setSelectedPrompt] = useState<string>('cables');

  const prompts = [
    {
      id: 'cables',
      code: '01',
      label: 'LV & MV Power Cables',
      query: '500m 4C x 16mm² XLPE/SWA/PVC Ducab Cable with mill test certificate for Al Quoz commercial project',
      stockist: 'Apex Cables Trading LLC (Al Quoz)',
      lowestBid: 'AED 38.50 / m',
      benchmark: 'AED 47.20 retail',
      savings: '18.4%',
      badge: 'DET Verified Stockist'
    },
    {
      id: 'ducab',
      code: '02',
      label: 'Riyadh Single Core Wires',
      query: '40 boxes Riyadh Cables 2.5mm² Single Core CU/PVC (100m coils) with immediate warehouse collection',
      stockist: 'Gulf Wire & Cable Stockist (Sharjah Ind. 3)',
      lowestBid: 'AED 142.00 / box',
      benchmark: 'AED 168.00 retail',
      savings: '15.5%',
      badge: 'Authorized Distributor'
    },
    {
      id: 'trays',
      code: '03',
      label: 'Cable Trays & Conduits',
      query: '120m 300mm GI Perforated Cable Tray 2.0mm thickness + couplers & 90° bends for Dubai South hub',
      stockist: 'National Metallic Conduits LLC (Deira)',
      lowestBid: 'AED 48.00 / m',
      benchmark: 'AED 59.00 retail',
      savings: '18.6%',
      badge: 'Factory Stamped Certs'
    },
    {
      id: 'switchgear',
      code: '04',
      label: 'Switchgear & DBs',
      query: '12-Way TPN Distribution Board with 100A Incomer & 30mA RCCB Schneider Acti9 for Business Bay fitout',
      stockist: 'Emirates Panelboard & Switchgear (Al Quoz)',
      lowestBid: 'AED 2,150.00 / set',
      benchmark: 'AED 2,650.00 retail',
      savings: '18.9%',
      badge: 'DEWA Compliant'
    },
    {
      id: 'lighting',
      code: '05',
      label: 'Commercial LED Panels',
      query: '250 pcs 600x600 Commercial LED Panel 40W 4000K IP44 with 5-year replacement warranty for JLT tower',
      stockist: 'Brightline Electrical Lighting LLC (Dubai)',
      lowestBid: 'AED 42.00 / pc',
      benchmark: 'AED 52.00 retail',
      savings: '19.2%',
      badge: '5-Year Warranty'
    }
  ];

  const currentPrompt = prompts.find(p => p.id === selectedPrompt) || prompts[0];

  const brands = [
    { name: 'DUCAB', tag: 'Copper & XLPE Cables' },
    { name: 'RIYADH CABLES', tag: 'GCC Authorized Stockist' },
    { name: 'SCHNEIDER ELECTRIC', tag: 'Acti9 & Compact NSX' },
    { name: 'DECODUCT', tag: 'BS EN Certified Conduits' },
    { name: 'ELSEWEDY ELECTRIC', tag: 'Industrial Power Cables' },
    { name: 'OMAN CABLES', tag: 'GCC Utilities Approved' },
    { name: 'LEGRAND', tag: 'Cable Management Systems' },
    { name: 'ABB', tag: 'Industrial Switchgear' }
  ];

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-[#0b0b0b] text-white border-b border-white/10">
      {/* Subtle Radial Aura Backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-rose-500/10 via-brand-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Neiden Minimalist Bracket Tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between flex-wrap gap-3 mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-wider text-slate-300">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            <span>[ SS® ‒ B2B PROCUREMENT / توريد المواد ]</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-slate-400">
            <span>DUBAI, UAE: <strong className="text-rose-400 font-normal">GST ACTIVE</strong></span>
            <span>•</span>
            <span>387 VERIFIED STOCKISTS</span>
          </div>
        </motion.div>

        {/* Massive Editorial Headline */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6 max-w-4xl"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight leading-[1.05] text-white">
            UAE Construction Procurement,{' '}
            <span className="italic font-light text-slate-300">Reimagined.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl font-normal leading-relaxed">
            Upload your material schedule or BOQ in 60 seconds. Top verified UAE stockists compete to give you the best wholesale prices within 24 hours.
          </p>
        </motion.div>

        {/* Action Buttons & Trust Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
        >
          <button
            onClick={() => onStartBuyer()}
            className="group px-8 py-4 bg-[#cf2e46] hover:bg-[#b91c33] text-white rounded-full font-black text-sm transition-all duration-300 shadow-glow-red flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>Upload BOQ or Material List (60s)</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={onExploreStockists}
            className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-full font-bold text-sm border border-white/15 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Store className="w-4 h-4 text-rose-400" />
            <span>Explore 380+ Verified Stockists</span>
          </button>
        </motion.div>

        {/* Neiden Key Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-400 font-medium"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <Star className="w-4 h-4 fill-rose-400" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">4.9 / 5 Rating</div>
              <div className="text-[11px] text-slate-500">Based on 360+ reviews</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">24-Hour SLA</div>
              <div className="text-[11px] text-slate-500">Fastest 5 bids rule</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">100% DET Verified</div>
              <div className="text-[11px] text-slate-500">Zero fake brokers</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">0% Commission</div>
              <div className="text-[11px] text-slate-500">Launch fee waived</div>
            </div>
          </div>
        </motion.div>

        {/* Interactive Live Prompt Simulator (Neiden Bento Style) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl relative"
        >
          <div className="flex items-center justify-between flex-wrap gap-3 pb-6 border-b border-white/10">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 block font-bold">
                Interactive Procurement Radar
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Simulate Live Wholesale Bids in Dubai & Northern Emirates
              </h3>
            </div>
            <div className="text-xs font-mono text-slate-500">
              Select category to preview real platform rates
            </div>
          </div>

          {/* Neiden Numeric Chips */}
          <div className="flex items-center gap-2 overflow-x-auto py-5 scrollbar-thin">
            {prompts.map((p) => {
              const isActive = p.id === selectedPrompt;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPrompt(p.id)}
                  className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 border ${
                    isActive
                      ? 'bg-white text-slate-950 font-bold border-white shadow-lg'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border-white/10'
                  }`}
                >
                  <span className={`font-mono text-[10px] ${isActive ? 'text-rose-700' : 'text-slate-500'}`}>
                    {p.code}.
                  </span>
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Simulator Output Box */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPrompt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-4 p-5 sm:p-6 rounded-2xl bg-[#14070b] border border-rose-500/20 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
            >
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center gap-2 text-xs text-rose-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                  <span>SAMPLE RFQ SPECIFICATION</span>
                </div>
                <p className="text-white text-sm sm:text-base font-medium leading-snug">
                  "{currentPrompt.query}"
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap pt-1">
                  <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 font-mono text-[11px] text-slate-300">
                    Stockist: {currentPrompt.stockist}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 font-semibold text-[11px]">
                    ✓ {currentPrompt.badge}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 bg-black/40 p-4 sm:p-5 rounded-xl border border-white/10 flex flex-col justify-between gap-4">
                <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Lowest Matched Bid</span>
                    <span className="text-2xl sm:text-3xl font-mono font-black text-rose-400">
                      {currentPrompt.lowestBid}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Typical Retail</span>
                    <span className="text-xs font-mono text-slate-400 line-through">
                      {currentPrompt.benchmark}
                    </span>
                    <span className="text-xs font-bold text-rose-400 block">
                      Save {currentPrompt.savings}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onStartBuyer()}
                    className="flex-1 py-2.5 px-4 bg-[#cf2e46] hover:bg-[#b91c33] text-white font-extrabold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>Post RFQ for this Item</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={onExploreStockists}
                    className="py-2.5 px-3 bg-white/10 hover:bg-white/15 text-slate-200 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    View Stockists
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Infinite Certified Manufacturer Ribbon */}
      <div className="mt-16 pt-6 border-t border-white/5 relative overflow-hidden">
        <div className="flex gap-8 whitespace-nowrap animate-marquee">
          {[...brands, ...brands, ...brands].map((b, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300 font-mono shrink-0"
            >
              <span className="font-bold text-white tracking-wider">{b.name}</span>
              <span className="text-slate-500">|</span>
              <span className="text-rose-400/90 text-[11px]">{b.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
