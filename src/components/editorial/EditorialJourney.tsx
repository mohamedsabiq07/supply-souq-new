import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ShieldAlert, Cpu, Sparkles, Truck, CheckCircle } from 'lucide-react';

interface EditorialJourneyProps {
  onStartRFQ?: () => void;
}

const MILESTONES = [
  {
    phase: '01 / LEGACY',
    title: 'The Manual Chaos Paradigm',
    period: 'BEFORE SUPPLY SOUQ',
    status: 'OBSOLETE',
    icon: ShieldAlert,
    desc: 'Contractors relied on 40 separate phone calls, unformatted WhatsApp messages, and 5-day response lags. Half the quoted items ended up being phantom stock or lacked valid 3.1 Mill Test Certificates.',
    metrics: ['Average Quote Time: 4-6 Days', 'Counterfeit/No-MTC Risk: High', 'Price Discrepancy: Up to 35%'],
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
  },
  {
    phase: '02 / NETWORK',
    title: 'GCC Yard Mapping & Digitization',
    period: 'THE INFRASTRUCTURE',
    status: 'ACTIVE',
    icon: Cpu,
    desc: 'Supply Souq systematically connected and digitized stockyards across JAFZA, Dubai Industrial City, Musaffah, and Sharjah into one unified, real-time availability fabric.',
    metrics: ['200+ Certified GCC Yards', '15,000+ Industrial SKUs', 'Live Stock Validation'],
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
  },
  {
    phase: '03 / ALGORITHM',
    title: 'Automated BOM Parsing & Bid Normalization',
    period: 'THE ENGINE',
    status: 'OPERATIONAL',
    icon: Sparkles,
    desc: 'Engineers simply upload their complex spreadsheets or requisition orders. Our algorithmic parser matches tolerances, wall thicknesses, and alloys to verified stockists within 90 minutes.',
    metrics: ['Sub-2hr Turnaround', 'Line-by-line MTC Verification', 'Direct Wholesale Benchmarks'],
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
  },
  {
    phase: '04 / FULFILLMENT',
    title: 'Gate-Tracked Escrow & Rapid Site Drops',
    period: 'THE STANDARD',
    status: 'PRODUCTION',
    icon: Truck,
    desc: 'One unified purchase order. Real-time GPS gate telemetry, pre-offload QA inspection, single VAT invoice consolidation, and verified credit terms up to 90 days.',
    metrics: ['99.2% On-Time Gate Arrival', 'Zero-Dispute Invoicing', 'AED 450M+ Delivered'],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  },
];

export const EditorialJourney: React.FC<EditorialJourneyProps> = ({ onStartRFQ }) => {
  return (
    <section className="relative bg-[#09090b] text-white py-28 border-b border-zinc-800 overflow-hidden">
      {/* Subtle Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 pb-8 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block w-2.5 h-2.5 bg-[#e61937]" />
              <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
                [SSQ-EVOLUTION] • THE PROCUREMENT ODYSSEY
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight leading-none text-white">
              FROM MANUAL INEFFICIENCY <br />
              <span className="text-[#e61937]">TO ALGORITHMIC</span> SPEED.
            </h2>
          </div>
          <p className="mt-6 md:mt-0 text-zinc-400 max-w-md text-sm sm:text-base leading-relaxed font-normal">
            Industrial supply chains in the Middle East were stuck in 1998. We engineered the digital operating system to bring speed, transparency, and certainty to every site delivery.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Red Glow Line (Desktop) */}
          <div className="hidden lg:block absolute left-1/2 top-4 bottom-4 w-px bg-zinc-800 -translate-x-1/2">
            <div className="w-full h-full bg-gradient-to-b from-[#e61937] via-[#e61937] to-transparent shadow-[0_0_12px_rgba(230,25,55,0.6)]" />
          </div>

          <div className="space-y-16 lg:space-y-24">
            {MILESTONES.map((item, idx) => {
              const isEven = idx % 2 === 0;
              const Icon = item.icon;

              return (
                <div 
                  key={item.phase}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative"
                >
                  {/* Center Node Indicator (Desktop) */}
                  <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-black border-2 border-[#e61937] items-center justify-center z-20 shadow-[0_0_20px_rgba(230,25,55,0.8)]">
                    <span className="w-2.5 h-2.5 bg-[#e61937]" />
                  </div>

                  {/* Left Column (Text on even, Image on odd) */}
                  <div className={`lg:col-span-5 ${isEven ? 'lg:order-1' : 'lg:order-3'}`}>
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="p-8 bg-[#121215] border border-zinc-800 relative hover:border-zinc-700 transition-colors"
                      style={{
                        clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono text-[#e61937] font-bold tracking-wider">
                          {item.phase}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-zinc-800 text-zinc-300">
                          {item.period}
                        </span>
                      </div>

                      <h3 className="text-2xl font-black font-display tracking-tight text-white mb-3">
                        {item.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                        {item.desc}
                      </p>

                      <div className="pt-4 border-t border-zinc-800/80 space-y-2">
                        {item.metrics.map((m, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                            <span className="w-1.5 h-1.5 bg-[#e61937]" />
                            <span>{m}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Spacer for Center Timeline Column */}
                  <div className="hidden lg:block lg:col-span-2 lg:order-2" />

                  {/* Right Column (Image on even, Text on odd) */}
                  <div className={`lg:col-span-5 ${isEven ? 'lg:order-3' : 'lg:order-1'}`}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="relative overflow-hidden group border border-zinc-800 bg-zinc-950 aspect-[16/10]"
                      style={{
                        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)',
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 opacity-70 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono">
                        <span className="text-zinc-300 bg-black/80 px-2.5 py-1 border border-zinc-800">
                          {item.status}
                        </span>
                        <span className="text-zinc-400">
                          SYSTEM ARCHIVE
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div className="mt-20 text-center">
          {onStartRFQ && (
            <button
              onClick={onStartRFQ}
              className="px-8 py-4 bg-[#e61937] hover:bg-[#ff1f3d] text-white font-mono font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-[0_0_30px_rgba(230,25,55,0.4)]"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)',
              }}
            >
              Experience The Modern Way → Request Quote
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
