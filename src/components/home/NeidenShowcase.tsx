import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Building2, CheckCircle2, ChevronLeft, ChevronRight, TrendingUp, ShieldCheck } from 'lucide-react';

interface NeidenShowcaseProps {
  onStartRFQ: () => void;
}

export const NeidenShowcase: React.FC<NeidenShowcaseProps> = ({ onStartRFQ }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const cases = [
    {
      code: '01',
      project: 'Dubai South Logistics Hub',
      contractor: 'Apex MEP Contracting LLC',
      category: 'LV & MV Power Cables',
      spec: '500m 4C x 16mm² Ducab XLPE/SWA/PVC Cable',
      orderValue: 'AED 184,000',
      savings: '18.4% vs Retail',
      turnaround: '14 Hours SLA',
      stockist: 'Apex Cables Trading LLC (Al Quoz)',
      certs: ['Ducab Mill Cert', 'DEWA Approved', 'DET Validated'],
      bgImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: '02',
      project: 'Emaar Creek Horizon Commercial Fitout',
      contractor: 'Facade Lighting & MEP Works',
      category: 'Switchgear & DBs',
      spec: '12-Way TPN Schneider Acti9 DBs + 100A Incomers',
      orderValue: 'AED 74,500',
      savings: '16.2% vs Retail',
      turnaround: '18 Hours SLA',
      stockist: 'Emirates Switchgear Co. (Al Quoz)',
      certs: ['Schneider Authorized', 'Type-Test Passed', 'TRN Tax Audited'],
      bgImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: '03',
      project: 'Sharjah Industrial Zone G+1 Warehouse',
      contractor: 'Gulf Electro-Mechanical Co.',
      category: 'Cable Trays & Conduits',
      spec: '3,200m Decoduct GI 300mm Trays + Couplers & Bends',
      orderValue: 'AED 112,000',
      savings: '19.8% vs Retail',
      turnaround: '22 Hours SLA',
      stockist: 'National Metallic Conduits LLC (Deira)',
      certs: ['BS EN Certified', 'Factory Stamped', 'Free Delivery'],
      bgImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80'
    },
    {
      code: '04',
      project: 'Business Bay 28-Story Commercial Tower',
      contractor: 'Al Sahel Engineering & Contracting',
      category: 'Commercial LED Panels',
      spec: '450 pcs 600x600 LED Panels 40W 4000K IP44',
      orderValue: 'AED 38,700',
      savings: '21.0% vs Retail',
      turnaround: '16 Hours SLA',
      stockist: 'Brightline Electrical Lighting LLC (Dubai)',
      certs: ['5-Year Warranty', 'Energy Star Rated', 'DEWA Stamped'],
      bgImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80'
    }
  ];

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 md:py-32 bg-[#050505] text-white border-b border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-8 border-b border-white/10 mb-12">
          <div>
            <span className="text-xs font-mono text-rose-400 block mb-1">
              [ SS® ‒ SELECTED PROCUREMENTS / 制作事例 ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white">
              Real UAE Construction Case Studies.
            </h2>
          </div>

          {/* Slider Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={scrollLeft}
              className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors cursor-pointer"
              title="Previous Case"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollRight}
              className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors cursor-pointer"
              title="Next Case"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Drag/Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 pt-2 scrollbar-none snap-x snap-mandatory"
        >
          {cases.map((c) => (
            <div
              key={c.code}
              className="snap-start shrink-0 w-[340px] sm:w-[440px] lg:w-[480px] rounded-3xl bg-[#120508] border border-white/10 overflow-hidden flex flex-col justify-between group hover:border-rose-500/40 transition-all duration-300 shadow-xl"
            >
              {/* Visual Header with Image Overlay */}
              <div className="h-56 relative overflow-hidden">
                <img
                  src={c.bgImage}
                  alt={c.project}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120508] via-transparent to-black/60" />

                <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-mono">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-rose-400 font-bold">
                    {c.code}. / {c.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold text-[11px] border border-rose-500/30">
                    ✓ {c.turnaround}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-display font-extrabold text-white leading-tight">
                    {c.project}
                  </h3>
                  <div className="text-xs text-slate-300 font-mono flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.contractor}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="text-xs text-slate-400 font-mono uppercase">
                    Procured Specification:
                  </div>
                  <p className="text-sm font-semibold text-white leading-snug">
                    "{c.spec}"
                  </p>
                  <div className="text-xs text-slate-400 font-mono">
                    Stockist: <strong className="text-slate-200">{c.stockist}</strong>
                  </div>
                </div>

                {/* Financial Metric Row */}
                <div className="pt-3 border-t border-white/10 flex items-baseline justify-between font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Order Value</span>
                    <span className="text-lg font-black text-white">{c.orderValue}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block uppercase">Contractor Savings</span>
                    <span className="text-sm font-bold text-rose-400">{c.savings}</span>
                  </div>
                </div>

                {/* Certifications Pills */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {c.certs.map((cert, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300"
                    >
                      {cert}
                    </span>
                  ))}
                </div>

                <button
                  onClick={onStartRFQ}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-[#cf2e46] hover:text-white text-white font-bold text-xs font-mono transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border border-white/10"
                >
                  <span>Post Similar BOQ</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
