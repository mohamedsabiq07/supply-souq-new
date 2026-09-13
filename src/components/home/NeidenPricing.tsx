import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';

interface NeidenPricingProps {
  onStartBuyer: () => void;
  onStartSupplier: () => void;
}

export const NeidenPricing: React.FC<NeidenPricingProps> = ({ onStartBuyer, onStartSupplier }) => {
  const [billingCycle, setBillingCycle] = useState<'launch' | 'standard'>('launch');

  return (
    <section className="py-24 md:py-32 bg-[#040908] text-white border-b border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-8 border-b border-white/10 mb-16">
          <div>
            <span className="text-xs font-mono text-emerald-400 block mb-1">
              [ SS® ‒ PACKAGES & PRICING / 料金プラン / باقات الأسعار ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white">
              Zero Hidden Fees. 100% Transparency.
            </h2>
          </div>

          <div className="flex items-center gap-2 p-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono">
            <button
              onClick={() => setBillingCycle('launch')}
              className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                billingCycle === 'launch' ? 'bg-emerald-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              🚀 Launch Promo (0% Commission)
            </button>
            <button
              onClick={() => setBillingCycle('standard')}
              className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                billingCycle === 'standard' ? 'bg-emerald-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Standard Model
            </button>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Card 1: Contractor Core Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between space-y-8"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                  For Contractors & MEP Engineers
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
                  Free Forever
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-display font-extrabold text-white">
                  Contractor Core
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Everything you need to source UAE wholesale materials without sales calls.
                </p>
              </div>

              <div className="pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-mono font-black text-white">AED 0</span>
                  <span className="text-xs font-mono text-slate-400">/ forever</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 mt-1 block">
                  ✓ Unlimited RFQs with zero fees
                </span>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10 text-xs text-slate-300 font-mono">
                {[
                  'Upload unlimited Excel BOQs & site photos',
                  'Fastest 5 Bids Rule (24-hour turnaround)',
                  'Side-by-side quotation comparison matrix',
                  '100% DET verified stockists with TRN',
                  'Manufacturer mill test certs included',
                  'Buyer supplier ratings & reviews'
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onStartBuyer}
              className="w-full py-3.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/10"
            >
              <span>Sign Up as Contractor (Free)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>

          {/* Card 2: Stockist Growth Plan (Featured) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-8 rounded-3xl bg-[#081813] border-2 border-emerald-400 shadow-glow-mint flex flex-col justify-between space-y-8 relative"
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-mono font-black uppercase tracking-wider shadow-md">
              Most Popular • UAE Stockists
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  For Verified UAE Suppliers
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-mono text-emerald-300 font-bold">
                  {billingCycle === 'launch' ? '3-Month Free Trial' : 'AED 1 / Day'}
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-display font-extrabold text-white">
                  Stockist Growth
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Compete for high-value contractor purchase orders across Dubai & UAE.
                </p>
              </div>

              <div className="pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-mono font-black text-emerald-400">
                    {billingCycle === 'launch' ? 'AED 0' : 'AED 30'}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {billingCycle === 'launch' ? '/ 3 months free trial' : '/ month (AED 1/day)'}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-300 mt-1 block font-semibold">
                  0% Commission during launch promotion
                </span>
              </div>

              <div className="space-y-3 pt-4 border-t border-emerald-500/20 text-xs text-slate-200 font-mono">
                {[
                  'Instant WhatsApp & Email RFQ alerts',
                  'Only 5 stockists compete per RFQ',
                  'Direct contractor contacts upon winning',
                  'DET verified stockist badge on profile',
                  'Platform telemetry & commodity price feeds',
                  'Unlimited quotation submissions'
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onStartSupplier}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Claim Stockist Free Trial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>

          {/* Card 3: Enterprise & Fleet Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between space-y-8"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                  For Tier-1 Contractors & Fleets
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
                  Custom SLA
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-display font-extrabold text-white">
                  Enterprise Suite
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Dedicated procurement command desk and custom ERP integration.
                </p>
              </div>

              <div className="pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-mono font-black text-white">Custom</span>
                  <span className="text-xs font-mono text-slate-400">/ tailored volume</span>
                </div>
                <span className="text-[11px] font-mono text-purple-400 mt-1 block">
                  Dedicated Account Manager
                </span>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10 text-xs text-slate-300 font-mono">
                {[
                  'Dedicated procurement officer in Dubai',
                  'Multi-project credit line management',
                  'Custom ERP & accounting integration',
                  'Bulk material mill inspection oversight',
                  'Priority dispute mitigation desk',
                  'VIP 4-hour SLA expedited turnaround'
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="https://wa.me/971500000000?text=Hello%20SupplySouq%20Enterprise%20Desk"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/10"
            >
              <span>Contact Enterprise Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
