import React from 'react';
import { motion } from 'framer-motion';
import { Quote, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

interface EditorialManifestoProps {
  onStartRFQ?: () => void;
}

export const EditorialManifesto: React.FC<EditorialManifestoProps> = ({ onStartRFQ }) => {
  return (
    <section className="relative bg-black text-white py-32 border-b border-zinc-900 overflow-hidden">
      {/* Hot Red Radial Atmosphere */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(230, 25, 55, 0.25) 0%, transparent 60%)',
        }}
      />

      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        {/* Monospace Header Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 mb-8">
          <Flame className="w-3.5 h-3.5 text-[#e61937]" />
          <span className="text-xs font-mono tracking-widest text-zinc-300 uppercase">
            [SSQ-MANIFESTO] • CORE CONVICTION
          </span>
        </div>

        {/* Oversized Quote Mark */}
        <div className="w-16 h-16 mx-auto mb-6 bg-[#e61937] flex items-center justify-center text-white shadow-[0_0_30px_rgba(230,25,55,0.5)]">
          <Quote className="w-8 h-8" />
        </div>

        {/* Giant Manifesto Typography */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight leading-tight mb-10 text-white max-w-4xl mx-auto">
          “PROCUREMENT SHOULD BE <span className="text-[#e61937]">CLEAR</span>, INSTANT, AND BUILT AROUND <span className="text-[#e61937]">UNCOMPROMISING</span> TRUST.”
        </h2>

        <div className="w-24 h-1 bg-[#e61937] mx-auto mb-12" />

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-16">
          <div className="p-6 bg-zinc-950/80 border border-zinc-800">
            <span className="text-xs font-mono text-[#e61937] font-bold block mb-2">01 / NO PHANTOMS</span>
            <h4 className="text-lg font-bold text-white mb-2 font-display">Zero Middleman Markup</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Industrial brokers add 20% by forwarding emails without holding inventory. Supply Souq connects buyers directly to physical stockyards with verified capacity.
            </p>
          </div>

          <div className="p-6 bg-zinc-950/80 border border-zinc-800">
            <span className="text-xs font-mono text-[#e61937] font-bold block mb-2">02 / TIME IS CAPITAL</span>
            <h4 className="text-lg font-bold text-white mb-2 font-display">Speed Saves Site Fines</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every day a job site waits for flanges or rebar costs contractors thousands in standing labor and delay penalties. We guarantee sub-2-hour quotation turnarounds.
            </p>
          </div>

          <div className="p-6 bg-zinc-950/80 border border-zinc-800">
            <span className="text-xs font-mono text-[#e61937] font-bold block mb-2">03 / TRACEABILITY</span>
            <h4 className="text-lg font-bold text-white mb-2 font-display">100% Certified Metallurgy</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Counterfeit and substandard steel is a structural liability. Every shipment dispatched via Supply Souq includes pre-verified 3.1 Mill Test Certificates.
            </p>
          </div>
        </div>

        {/* Closing Attribution & Action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <div className="text-left border-l-2 border-[#e61937] pl-4">
            <div className="text-sm font-bold text-white font-display">The Supply Souq Founders & Engineering Guild</div>
            <div className="text-xs font-mono text-zinc-500">Dubai, United Arab Emirates • Operating Across GCC</div>
          </div>
          {onStartRFQ && (
            <button
              onClick={onStartRFQ}
              className="px-8 py-4 bg-[#e61937] hover:bg-[#ff1f3d] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 shadow-[0_0_30px_rgba(230,25,55,0.4)]"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)',
              }}
            >
              <span>Join The Network</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
