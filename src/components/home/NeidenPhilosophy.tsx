import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowUpRight, Award, CheckCircle2 } from 'lucide-react';

export const NeidenPhilosophy: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-[#020706] text-white border-b border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Neiden Bracket Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-8 border-b border-white/10">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>[ SS® ‒ WHO WE ARE / 原点と理念 / الرؤية ]</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span className="text-emerald-400">EST. 2026</span>
            <span>•</span>
            <span>DUBAI, UNITED ARAB EMIRATES</span>
          </div>
        </div>

        {/* Large Editorial Statement */}
        <div className="my-16 max-w-5xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl sm:text-4xl md:text-5xl font-display font-medium leading-[1.25] text-slate-100"
          >
            "Great procurement is rarely about making 50 frantic phone calls to Deira & Al Quoz. It's about removing non-transparent markups, eliminating fake brokers, and creating wholesale transparency that empowers project engineers to build on schedule."
          </motion.p>
        </div>

        {/* Leadership & Meta Strip */}
        <div className="pt-10 border-t border-white/10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg font-display">
              SS
            </div>
            <div>
              <div className="font-bold text-white text-base flex items-center gap-2">
                <span>SupplySouq Procurement Network</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xs font-mono text-slate-400">
                Built with purpose for UAE Construction & MEP Projects
              </div>
            </div>
          </div>

          <div className="md:col-span-7 grid grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-slate-500 block text-[10px] uppercase">Active Stockists</span>
              <span className="text-xl font-bold text-white font-mono mt-1 block">387+</span>
              <span className="text-[11px] text-emerald-400">DET Licensed</span>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-slate-500 block text-[10px] uppercase">RFQ Turnaround</span>
              <span className="text-xl font-bold text-white font-mono mt-1 block">&lt; 24h</span>
              <span className="text-[11px] text-amber-400">Fastest 5 Bids</span>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-slate-500 block text-[10px] uppercase">Contractor Savings</span>
              <span className="text-xl font-bold text-white font-mono mt-1 block">18.4%</span>
              <span className="text-[11px] text-emerald-400">Average wholesale</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
