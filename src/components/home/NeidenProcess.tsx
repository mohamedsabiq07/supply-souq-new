import React from 'react';
import { motion } from 'framer-motion';
import { FileUp, Users2, CheckSquare, ArrowRight } from 'lucide-react';

interface NeidenProcessProps {
  onStartRFQ: () => void;
}

export const NeidenProcess: React.FC<NeidenProcessProps> = ({ onStartRFQ }) => {
  const steps = [
    {
      step: '01',
      tag: '60-SECOND ONBOARDING',
      title: 'Drop Your BOQ or Material List',
      description: 'Drag and drop your Excel BOQ, consultant schedule, or site photo. Our procurement parser normalizes wire gauges, conduits, and accessories into standardized lines within seconds.',
      icon: <FileUp className="w-6 h-6 text-rose-400" />,
      detail: 'Supports XLSX, CSV, PDF, and smartphone site photos.'
    },
    {
      step: '02',
      tag: 'FASTEST 5 BIDS RULE',
      title: 'Top 5 Verified UAE Stockists Compete',
      description: 'Your RFQ is broadcast to vetted stockists in Al Quoz, Deira, and Sharjah. Only the first 5 itemized bids qualify, driving urgent, transparent wholesale margins with a 24h countdown.',
      icon: <Users2 className="w-6 h-6 text-rose-400" />,
      detail: 'Every vendor is 100% DET trade-license vetted and TRN verified.'
    },
    {
      step: '03',
      tag: 'SIDE-BY-SIDE MATRIX',
      title: 'Compare & Issue Purchase Order',
      description: 'Review quotes in our unified comparison matrix. Filter by price, delivery speed, or brand approval. Issue a digital PO with stamped mill test certs and milestone escrow protection.',
      icon: <CheckSquare className="w-6 h-6 text-rose-400" />,
      detail: 'Dispatched to job site with DEWA-stamped compliance certs.'
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-[#0b0b0b] text-white border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-8 border-b border-white/10 mb-16">
          <div>
            <span className="text-xs font-mono text-rose-400 block mb-1">
              [ SS® ‒ HOW WE WORK / 実行のプロセス ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white">
              Three Steps. Zero Phone Calls.
            </h2>
          </div>

          <p className="text-xs font-mono text-slate-400 max-w-xs">
            A frictionless procurement pipeline designed to save contractors 18%+ and 48 hours of administrative hassle.
          </p>
        </div>

        {/* Process Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, idx) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-rose-500/30 transition-all duration-300 flex flex-col justify-between space-y-8 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-4xl sm:text-5xl font-mono font-black text-slate-600 group-hover:text-rose-400 transition-colors">
                    {s.step}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {s.icon}
                  </div>
                </div>

                <div className="inline-block px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-rose-400 font-bold">
                  {s.tag}
                </div>

                <h3 className="text-xl font-display font-extrabold text-white leading-tight">
                  {s.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {s.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 text-[11px] font-mono text-slate-500">
                {s.detail}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA bar */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-base sm:text-lg font-bold text-white">
              Ready to test live wholesale pricing on your next BOQ?
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload takes 60 seconds. First 5 verified UAE stockist bids delivered in under 24 hours.
            </p>
          </div>
          <button
            onClick={onStartRFQ}
            className="px-6 py-3 bg-[#cf2e46] hover:bg-[#b91c33] text-white rounded-full font-black text-xs font-mono transition-all shadow-glow-red flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Start Free RFQ Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
