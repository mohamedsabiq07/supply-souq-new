import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, TrendingUp, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface EditorialWinsProps {
  onStartRFQ: () => void;
}

export const EditorialWins: React.FC<EditorialWinsProps> = ({ onStartRFQ }) => {
  const casePanels = [
    {
      code: 'WIN 01',
      title: 'Luxury Hotel Launch Supplied in 9 Days',
      client: 'Five Palm Hospitality Group &bull; Dubai',
      category: 'Hospitality & Commercial MRO',
      saving: '24.6% vs Retail Quote',
      leadTime: '9 Days (3 Ahead of Schedule)',
      year: '2026',
      description: 'Consolidated 140 hospitality line items across kitchen gear, guest amenities, and specialized janitorial sanitizers from 3 certified stockists under a single PO.',
      bgImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80',
    },
    {
      code: 'WIN 02',
      title: 'Contractor PPE & Safety Order Consolidated',
      client: 'Apex MEP & Civil Contracting LLC',
      category: 'Safety Gear & High-Vis PPE',
      saving: '19.2% Bulk Savings',
      leadTime: '24-Hour Jobsite Delivery',
      year: '2026',
      description: 'Immediate delivery of 350 ANSI-certified safety helmets, high-vis harnesses, and composite toe boots directly to the Dubai South logistics hub with stamped test certs.',
      bgImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=80',
    },
    {
      code: 'WIN 03',
      title: 'Retail Packaging & Logistics Costs Reduced',
      client: 'Al Quoz Regional E-Commerce Hub',
      category: 'Packaging & Corrugated Cartons',
      saving: '28.4% Direct-from-Mill',
      leadTime: 'Scheduled Weekly Drops',
      year: '2025',
      description: 'Replaced single-distributor markups by sourcing 40,000 custom printed cartons, heavy-duty stretch wrap, and eco-tapes directly from vetted UAE corrugated mills.',
      bgImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop&q=80',
    },
    {
      code: 'WIN 04',
      title: 'Commercial Office Restock Fully Automated',
      client: 'Bay Square Corporate HQ (4 Floors)',
      category: 'Office & Facility Essentials',
      saving: '16.5% Monthly OPEX Reduction',
      leadTime: 'Recurring Bi-Weekly Restock',
      year: '2026',
      description: 'Streamlined recurring facility procurement across paper, pantry goods, hygiene dispensers, and IT accessories with consolidated monthly billing and zero stockouts.',
      bgImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section className="py-24 md:py-36 bg-[#09090b] text-white border-b border-zinc-800 relative overflow-hidden">
      {/* Huge Horizontally Scrolling Marquee Header */}
      <div className="pb-16 border-b border-zinc-800/80 select-none overflow-hidden">
        <div className="flex gap-8 whitespace-nowrap animate-marquee">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-8 text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tighter text-zinc-700/60 uppercase">
              <span>Supply Wins</span>
              <span className="text-[#e61937]">&bull;</span>
              <span className="text-white">Case Studies</span>
              <span className="text-[#e61937]">&bull;</span>
              <span>Procurement Results</span>
              <span className="text-[#e61937]">&bull;</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {/* Section Header Tag */}
        <div className="flex items-center justify-between pb-8 border-b border-zinc-800 mb-12 font-mono text-xs">
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-[#e61937]" />
            <span className="font-bold tracking-wider">[SSQ-RESULTS] / RECENT PURCHASES</span>
          </div>
          <span className="text-[#e61937] font-bold">AED 43.9M+ PROCURED ON-PLATFORM</span>
        </div>

        {/* Stacked Full-Width Case Panels */}
        <div className="space-y-12">
          {casePanels.map((panel, idx) => (
            <motion.div
              key={panel.code}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              data-cursor-label="View"
              className="group relative rounded-3xl bg-zinc-900/90 border border-zinc-800 hover:border-[#e61937]/50 transition-all duration-300 overflow-hidden shadow-2xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[380px]">
                {/* Media Half (Notched Accent Corner) */}
                <div className="lg:col-span-6 relative overflow-hidden h-72 lg:h-auto">
                  <img
                    src={panel.bgImage}
                    alt={panel.title}
                    className="w-full h-full object-cover filter contrast-110 opacity-70 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

                  {/* Translucent Oversized Layered Category Text */}
                  <div className="absolute bottom-4 left-4 right-4 font-display font-black text-2xl sm:text-3xl text-white/90 leading-tight">
                    {panel.title}
                  </div>

                  {/* Top Pin Tag */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 font-mono text-[11px]">
                    <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-zinc-700 text-[#e61937] font-bold">
                      {panel.code}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-zinc-700 text-zinc-300">
                      {panel.category}
                    </span>
                  </div>
                </div>

                {/* Content & Metrics Half */}
                <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between font-mono text-xs text-zinc-400 pb-2 border-b border-zinc-800">
                      <span className="text-white font-bold">{panel.client}</span>
                      <span className="text-zinc-500">{panel.year}</span>
                    </div>

                    <p className="text-sm text-zinc-300 leading-relaxed font-normal">
                      {panel.description}
                    </p>
                  </div>

                  {/* Financial & Delivery Metrics Box */}
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 font-mono">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase block">Verified Savings</span>
                      <span className="text-xl font-bold text-[#e61937] font-display mt-0.5 block">
                        {panel.saving}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase block">Fulfillment SLA</span>
                      <span className="text-xl font-bold text-white font-display mt-0.5 block">
                        {panel.leadTime}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={onStartRFQ}
                      data-cursor-label="Quote"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 font-mono font-bold text-xs transition-colors cursor-pointer"
                    >
                      <span>Post Matching Requirement</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-mono text-zinc-500">
                      Batch Test Cert Stamped
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
