import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2 } from 'lucide-react';

export const NeidenTimeline: React.FC = () => {
  const milestones = [
    {
      period: '2024–25',
      badge: 'FOUNDATION',
      title: 'MEP Alpha Pilot in Al Quoz',
      description: 'Tested initial procurement loops with 40 top MEP contractors in Dubai. Proved that automated multi-vendor bidding reduces material costs by 18.4% compared to phone-call retail orders.'
    },
    {
      period: 'Q1 2026',
      badge: 'SPEED & TRUST',
      title: 'Fast 5 Bids Rule & DET KYB Engine',
      description: 'Introduced the strict 5-bid cap and automatic 24-hour SLA. Fully integrated Dubai Economy & Tourism (DET) commercial trade license checks to permanently ban unverified brokers.'
    },
    {
      period: 'Q2 2026',
      badge: 'INTELLIGENCE',
      title: 'Live Market Telemetry & Commodity Feeds',
      description: 'Connected global London Metal Exchange (LME) copper and aluminum index tracking to help UAE contractors forecast raw material spikes before submitting major tender bids.'
    },
    {
      period: '2026–Present',
      badge: 'EXPANSION',
      title: 'UAE Nationwide Rollout & 0% Launch Model',
      description: 'Expanding coverage across Dubai, Abu Dhabi, Sharjah, and Northern Emirates. Waived the 1.3% transaction fee for verified stockists to accelerate open wholesale liquidity.'
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-[#020706] text-white border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-8 border-b border-white/10 mb-16">
          <div>
            <span className="text-xs font-mono text-emerald-400 block mb-1">
              [ SS® ‒ TIMELINE / 歩みの記録 / مسار النمو ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white">
              Built on Measured Milestones.
            </h2>
          </div>

          <p className="text-xs font-mono text-slate-400 max-w-xs">
            We don't chase buzzwords. We build the physical and digital infrastructure that lets UAE contractors buy materials with absolute confidence.
          </p>
        </div>

        {/* Milestone Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {milestones.map((m, idx) => (
            <motion.div
              key={m.period}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-emerald-400 font-bold">{m.period}</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-400">
                    {m.badge}
                  </span>
                </div>

                <h3 className="text-lg font-display font-extrabold text-white leading-snug">
                  {m.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {m.description}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 pt-2 border-t border-white/5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Milestone</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Platform Scale Ticker */}
        <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center font-mono">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-2xl sm:text-3xl font-black text-white block">387+</span>
            <span className="text-[11px] text-slate-400 uppercase mt-0.5 block">Vetted UAE Stockists</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 block">&lt; 24h</span>
            <span className="text-[11px] text-slate-400 uppercase mt-0.5 block">Average Quotation SLA</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-2xl sm:text-3xl font-black text-white block">AED 43.9M</span>
            <span className="text-[11px] text-slate-400 uppercase mt-0.5 block">Monitored GMV</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-2xl sm:text-3xl font-black text-amber-400 block">18.4%</span>
            <span className="text-[11px] text-slate-400 uppercase mt-0.5 block">Contractor Wholesale Margin</span>
          </div>
        </div>
      </div>
    </section>
  );
};
