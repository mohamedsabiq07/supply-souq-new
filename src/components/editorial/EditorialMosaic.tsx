import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  TrendingDown, 
  Layers, 
  ShieldCheck, 
  Repeat, 
  Navigation,
  ArrowUpRight,
  Database,
  BarChart3
} from 'lucide-react';

interface EditorialMosaicProps {
  onStartRFQ?: () => void;
}

const CAPABILITIES = [
  {
    code: '[CAP-01]',
    title: 'Zero Re-Typing Simplicity',
    subtitle: 'From messy WhatsApp RFQs & PDF tables to clean line items',
    desc: 'Stop copying 200 line items between PDFs, emails, and Excel. Drop your requisition into our AI engine; it normalizes quantities, units, and finishes instantly.',
    icon: Zap,
    stat: '90%',
    statLabel: 'Admin time eliminated',
    highlight: false,
    colSpan: 'lg:col-span-4',
  },
  {
    code: '[CAP-02]',
    title: 'Direct Margin Optimization',
    subtitle: 'Benchmarked against real industrial indices & bulk yard volumes',
    desc: 'Supply Souq aggregates wholesale GCC purchasing power. Contractors access tier-1 distributor pricing normally reserved for multi-million dirham accounts.',
    icon: TrendingDown,
    stat: '8-27%',
    statLabel: 'Average material cost reduction',
    highlight: true, // Hot Red card or accent
    colSpan: 'lg:col-span-4',
  },
  {
    code: '[CAP-03]',
    title: 'Rapid Sourcing Cycles',
    subtitle: 'Verified stock checks under 2 hours vs 4-day wait times',
    desc: 'Our real-time stockist gateway pings verified yards in JAFZA, DIC, Musaffah, and Sharjah directly. You receive firm, actionable bids before lunchtime.',
    icon: Layers,
    stat: '< 2 hrs',
    statLabel: 'Average quote turnaround',
    highlight: false,
    colSpan: 'lg:col-span-4',
  },
  {
    code: '[CAP-04]',
    title: 'Strict ISO & MTC Compliance',
    subtitle: 'Zero counterfeit or uncertified goods on site',
    desc: 'Every valve, flange, cable, and structural beam is paired with authentic 3.1 Mill Test Certificates and inspection reports before dispatch release.',
    icon: ShieldCheck,
    stat: '100%',
    statLabel: 'MTC traceability guaranteed',
    highlight: false,
    colSpan: 'lg:col-span-4',
  },
  {
    code: '[CAP-05]',
    title: '1-Click Site Reordering',
    subtitle: 'Repeat previous procurement batches with live price checks',
    desc: 'Save project supply schedules. As your civil, MEP, or maintenance phases advance, reorder matching lots with automated replenishment alerts.',
    icon: Repeat,
    stat: '1 Click',
    statLabel: 'Repeated requisition cycle',
    highlight: false,
    colSpan: 'lg:col-span-4',
  },
  {
    code: '[CAP-06]',
    title: 'Gate-to-Gate Live Telemetry',
    subtitle: 'GPS driver dispatch & offloading window confirmations',
    desc: 'Monitor delivery trucks in real time. Site supervisors receive advance SMS notifications to ready cranes, forklifts, and unloading bays.',
    icon: Navigation,
    stat: '99.2%',
    statLabel: 'Punctual site delivery',
    highlight: false,
    colSpan: 'lg:col-span-4',
  },
];

export const EditorialMosaic: React.FC<EditorialMosaicProps> = ({ onStartRFQ }) => {
  return (
    <section className="relative bg-[#fafafa] text-[#09090b] py-28 border-b border-zinc-200 overflow-hidden">
      {/* 1px Gridlines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(to right, #000000 1px, transparent 1px), linear-gradient(to bottom, #000000 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 pb-8 border-b border-zinc-300">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block w-2.5 h-2.5 bg-[#e61937]" />
              <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase">
                [SSQ-CAPABILITIES] • MOSAIC ARCHITECTURE
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight leading-none text-zinc-950">
              ENGINEERED FOR <br />
              <span className="text-[#e61937]">ENTERPRISE</span> EFFICIENCY.
            </h2>
          </div>
          <div className="mt-6 lg:mt-0 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-mono text-zinc-500">GCC NETWORK CAPACITY</div>
              <div className="text-sm font-bold text-zinc-900 font-mono">AED 450M+ MANAGED</div>
            </div>
            {onStartRFQ && (
              <button
                onClick={onStartRFQ}
                className="px-6 py-3.5 bg-[#09090b] hover:bg-[#e61937] text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 group"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
                }}
              >
                <span>Request Custom Sourcing</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {/* 3-Column Mosaic Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {CAPABILITIES.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={cap.code}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className={`${cap.colSpan} p-8 border transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
                  cap.highlight
                    ? 'bg-[#e61937] text-white border-[#e61937] shadow-xl'
                    : 'bg-white text-[#09090b] border-zinc-200 hover:border-zinc-400 hover:shadow-lg'
                }`}
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
                }}
              >
                {/* Background watermarked code */}
                <div 
                  className={`absolute -right-4 -bottom-6 text-7xl font-black font-display select-none pointer-events-none transition-opacity ${
                    cap.highlight ? 'text-white/10' : 'text-zinc-100 group-hover:text-zinc-200/60'
                  }`}
                >
                  0{i + 1}
                </div>

                <div>
                  {/* Top bar */}
                  <div className="flex items-center justify-between mb-6">
                    <span className={`text-xs font-mono tracking-widest ${cap.highlight ? 'text-white/80' : 'text-zinc-400'}`}>
                      {cap.code}
                    </span>
                    <div className={`w-10 h-10 flex items-center justify-center ${
                      cap.highlight ? 'bg-white text-[#e61937]' : 'bg-zinc-100 group-hover:bg-[#09090b] group-hover:text-white text-zinc-800'
                    } transition-colors duration-300`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Subhead */}
                  <h3 className={`text-2xl font-black font-display tracking-tight mb-2 ${cap.highlight ? 'text-white' : 'text-zinc-900'}`}>
                    {cap.title}
                  </h3>
                  <div className={`text-xs font-semibold mb-4 leading-snug ${cap.highlight ? 'text-white/90' : 'text-[#e61937]'}`}>
                    {cap.subtitle}
                  </div>
                  <p className={`text-sm leading-relaxed ${cap.highlight ? 'text-white/80' : 'text-zinc-600'}`}>
                    {cap.desc}
                  </p>
                </div>

                {/* Bottom Metric Pill */}
                <div className={`mt-8 pt-6 border-t flex items-end justify-between ${
                  cap.highlight ? 'border-white/20' : 'border-zinc-100'
                }`}>
                  <div>
                    <div className={`text-3xl font-black font-display tracking-tight ${
                      cap.highlight ? 'text-white' : 'text-zinc-950'
                    }`}>
                      {cap.stat}
                    </div>
                    <div className={`text-[11px] font-mono uppercase tracking-wider ${
                      cap.highlight ? 'text-white/70' : 'text-zinc-400'
                    }`}>
                      {cap.statLabel}
                    </div>
                  </div>
                  <div className={`w-8 h-8 flex items-center justify-center rounded-none border ${
                    cap.highlight ? 'border-white/30 text-white' : 'border-zinc-300 text-zinc-500 group-hover:border-[#e61937] group-hover:text-[#e61937]'
                  }`}>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Live System Performance Ribbon */}
        <div className="mt-12 p-6 bg-[#09090b] text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#e61937] flex items-center justify-center shrink-0">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-white uppercase tracking-wider">
                Integrated with Oracle ERP, SAP & Procore
              </div>
              <div className="text-xs text-zinc-400 font-mono">
                Direct punchout catalog and two-way sync via secure REST API & Webhooks.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 shrink-0 font-mono text-xs text-zinc-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#e61937] animate-pulse" />
              <span>99.98% API Uptime</span>
            </div>
            <div className="hidden sm:block text-zinc-600">|</div>
            <div className="hidden sm:flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#e61937]" />
              <span>ISO 27001 Certified Data</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
