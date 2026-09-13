import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const EditorialIntro: React.FC = () => {
  return (
    <section className="relative py-28 md:py-36 bg-[#ffffff] text-zinc-950 border-b border-zinc-200 overflow-hidden">
      {/* 12-Column Grid Lines Background */}
      <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none grid grid-cols-12 gap-6 opacity-40">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="border-r border-zinc-100 h-full first:border-l" />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Tag */}
        <div className="flex items-center justify-between pb-8 border-b border-zinc-200 mb-12 font-mono text-xs">
          <div className="flex items-center gap-2 text-zinc-900">
            <span className="w-2 h-2 rounded-full bg-[#e61937]" />
            <span className="font-bold tracking-wider">[SSQ-INTRO] / WHO WE ARE</span>
          </div>
          <div className="text-zinc-400 hidden sm:block">
            BUILT FOR RELIABLE PROCUREMENT VELOCITY
          </div>
        </div>

        {/* Huge Multiline Headline with Layered Ghost Text */}
        <div className="relative my-12">
          {/* Faint Oversized Duplicate Ghost Text Behind */}
          <div className="absolute -top-10 -left-4 select-none pointer-events-none text-4xl sm:text-7xl lg:text-8xl font-display font-black tracking-tight text-zinc-100 leading-none -z-0 opacity-80">
            One marketplace for every supply request.
          </div>

          {/* Foreground Crisp Main Text */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-zinc-950 leading-[1.1] max-w-4xl"
          >
            One marketplace for every <span className="text-[#e61937]">supply request</span> your business makes.
          </motion.h2>
        </div>

        {/* Two Floating Media Blocks (Notched Corners) + Quote & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-16">
          {/* Left Media: Monochrome Warehouse / Procurement Hub (Clipped Corner) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-4 relative group"
          >
            <div
              className="w-full h-72 sm:h-80 overflow-hidden bg-zinc-900 shadow-xl border border-zinc-300"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)' }}
            >
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80"
                alt="Automated procurement warehouse"
                className="w-full h-full object-cover filter grayscale contrast-125 transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="mt-2 font-mono text-[10px] text-zinc-400 uppercase tracking-widest flex items-center justify-between">
              <span>FIG. 01 — CENTRAL LOGISTICS HUB</span>
              <span className="text-[#e61937] font-bold">AL QUOZ IND. 3</span>
            </div>
          </motion.div>

          {/* Center Column: Procurement Lead Quote & Fast Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-4 space-y-6 px-0 lg:px-4"
          >
            <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4">
              <span className="text-[#e61937] font-serif text-3xl leading-none block">“</span>
              <p className="text-sm font-medium text-zinc-800 leading-relaxed -mt-2">
                Instead of our engineers wasting days calling multiple suppliers in Deira with scattered Excel quotes, Supply Souq gives us 5 verified wholesale bids on one clean screen within 24 hours.
              </p>
              <div className="pt-2 border-t border-zinc-200 flex items-center justify-between font-mono text-xs">
                <div>
                  <span className="font-bold text-zinc-900 block">Eng. Tariq Mansour</span>
                  <span className="text-[11px] text-zinc-500">Head of Procurement &bull; Apex MEP</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-zinc-200/80 text-[10px] font-bold text-zinc-700">
                  Verified Buyer
                </span>
              </div>
            </div>

            {/* Quick Stat Pill Bar */}
            <div className="grid grid-cols-2 gap-3 font-mono">
              <div className="p-3.5 rounded-xl bg-zinc-950 text-white text-center">
                <span className="text-2xl font-black font-display text-[#e61937] block">18+</span>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mt-0.5">Supply Categories</span>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-100 border border-zinc-300 text-center">
                <span className="text-2xl font-black font-display text-zinc-950 block">500+</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mt-0.5">Verified Suppliers</span>
              </div>
            </div>
          </motion.div>

          {/* Right Media: Hot Red Accent Supplier / Quality Dispatch (Clipped Corner) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:col-span-4 relative group"
          >
            <div
              className="w-full h-72 sm:h-80 overflow-hidden bg-zinc-900 shadow-xl border-2 border-[#e61937]"
              style={{ clipPath: 'polygon(24px 0, 100% 0, 100% 100%, 0 100%, 0 24px)' }}
            >
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80"
                alt="Verified UAE supplier inventory inspection"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white font-mono text-xs flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider">MILL INSPECTION REPORT</span>
                <span className="px-2 py-0.5 rounded bg-[#e61937] text-white text-[10px] font-black">
                  100% COMPLIANT
                </span>
              </div>
            </div>
            <div className="mt-2 font-mono text-[10px] text-zinc-400 uppercase tracking-widest flex items-center justify-between">
              <span>FIG. 02 — CERTIFIED INVENTORY</span>
              <span className="text-zinc-600">DEWA / SEWA STAMPED</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
