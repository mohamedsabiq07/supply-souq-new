import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, CheckCircle2, TrendingUp, Building2, Quote } from 'lucide-react';

export const EditorialReviews: React.FC = () => {
  const brandLogos = [
    'DUCAB CABLES',
    'RIYADH CABLES',
    'SCHNEIDER ELECTRIC',
    'DECODUCT CONDUITS',
    'ELSEWEDY ELECTRIC',
    'OMAN CABLES',
    'LEGRAND',
    'ABB SWITCHGEAR',
    'PHILIPS LIGHTING',
    'DANUBE BUILDING MATERIALS',
  ];

  return (
    <section className="py-28 md:py-36 bg-[#ffffff] text-zinc-950 border-b border-zinc-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-8 border-b border-zinc-200 mb-16 font-mono text-xs">
          <div className="flex items-center gap-2 text-zinc-900">
            <span className="w-2 h-2 rounded-full bg-[#e61937]" />
            <span className="font-bold tracking-wider">[SSQ-PROOF] / TESTIMONIALS & TRUST</span>
          </div>
          <span className="text-zinc-500">360+ VERIFIED PROCUREMENT REVIEWS</span>
        </div>

        {/* Top Featured Split Testimonial */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-16 border-b border-zinc-200">
          {/* Left: Portrait / Verified Lead */}
          <div className="lg:col-span-4 relative">
            <div
              className="w-full h-80 sm:h-96 bg-zinc-900 overflow-hidden shadow-xl border border-zinc-300"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)' }}
            >
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80"
                alt="Procurement Director"
                className="w-full h-full object-cover filter grayscale contrast-125"
              />
            </div>
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-zinc-700 text-white font-mono text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#e61937]" />
              <span>Verified Project Director</span>
            </div>
          </div>

          {/* Right: Large Quote & Bio */}
          <div className="lg:col-span-8 space-y-6">
            <Quote className="w-12 h-12 text-[#e61937]/30 -mb-2" />
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold tracking-tight text-zinc-950 leading-snug">
              "We dropped an urgent tender BOQ of 92 line items on Supply Souq at 4 PM on Tuesday. By 10 AM Wednesday, we had 5 verified wholesale stockist bids with itemized prices and DEWA compliance sheets. We saved AED 38,000 on that single order."
            </h3>

            <div className="pt-4 flex items-center justify-between flex-wrap gap-4 font-mono text-xs">
              <div>
                <span className="text-base font-bold text-zinc-950 block">Rajesh Narayanan</span>
                <span className="text-zinc-500">Senior Commercial Director &bull; Al Sahel MEP Contracting LLC</span>
              </div>

              {/* Review Summary Capsule */}
              <div className="flex items-center gap-3 bg-zinc-100 px-4 py-2 rounded-full border border-zinc-200">
                <div className="flex text-[#e61937]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#e61937]" />
                  ))}
                </div>
                <span className="font-bold text-zinc-900">5.0 / 5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Row: Dark Animated Metric Card + 2 Smaller Testimonials */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-16 border-b border-zinc-200 items-stretch">
          {/* Dark Metric Card */}
          <div className="lg:col-span-4 p-8 rounded-3xl bg-[#09090b] text-white flex flex-col justify-between space-y-8 shadow-xl border border-zinc-800">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#e61937] font-bold">
                Platform Performance
              </span>
              <h4 className="text-2xl font-display font-extrabold text-white">
                Proven Buyer Efficiency
              </h4>
            </div>

            <div className="space-y-6 font-mono">
              <div className="border-b border-zinc-800 pb-4">
                <span className="text-4xl sm:text-5xl font-black text-white font-display block">3x Faster</span>
                <span className="text-xs text-zinc-400 mt-1 block">Quote turnaround cycle (&lt; 24h)</span>
              </div>

              <div>
                <span className="text-4xl sm:text-5xl font-black text-[#e61937] font-display block">+28%</span>
                <span className="text-xs text-zinc-400 mt-1 block">Average wholesale savings vs one-off retail</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] font-mono text-zinc-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#e61937]" />
              <span>Audited across 1,200+ completed RFQs</span>
            </div>
          </div>

          {/* Testimonial Column 1 */}
          <div className="lg:col-span-4 p-8 rounded-3xl bg-zinc-50 border border-zinc-200 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex text-[#e61937]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#e61937]" />
                ))}
              </div>
              <p className="text-sm text-zinc-700 leading-relaxed font-medium">
                "Finding verified suppliers who actually hold inventory in Al Quoz used to require sending drivers around. With Supply Souq, we get exact warehouse stock confirmed before we issue the Purchase Order."
              </p>
            </div>
            <div className="pt-4 border-t border-zinc-200 font-mono text-xs">
              <span className="font-bold text-zinc-950 block">Sarah Jenkins</span>
              <span className="text-zinc-500">Facilities & Operations Lead &bull; Media City Hub</span>
            </div>
          </div>

          {/* Testimonial Column 2 */}
          <div className="lg:col-span-4 p-8 rounded-3xl bg-zinc-50 border border-zinc-200 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex text-[#e61937]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#e61937]" />
                ))}
              </div>
              <p className="text-sm text-zinc-700 leading-relaxed font-medium">
                "The side-by-side comparison table is a masterclass. Our finance team approves POs 4 days faster because every line item, VAT invoice, and delivery fee is transparent upfront."
              </p>
            </div>
            <div className="pt-4 border-t border-zinc-200 font-mono text-xs">
              <span className="font-bold text-zinc-950 block">Karim Al-Husseini</span>
              <span className="text-zinc-500">Finance & Procurement Officer &bull; Emaar Fitouts</span>
            </div>
          </div>
        </div>

        {/* Bottom Horizontal Logo Marquee for Buyer/Supplier Brands */}
        <div className="pt-12 select-none overflow-hidden">
          <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest text-center mb-6">
            Trusted by Procurement Leaders & Certified UAE Manufacturers
          </div>
          <div className="flex gap-8 whitespace-nowrap animate-marquee">
            {[...brandLogos, ...brandLogos].map((brand, idx) => (
              <span
                key={idx}
                className="px-5 py-2.5 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-mono font-bold text-zinc-800 tracking-wider shrink-0"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
