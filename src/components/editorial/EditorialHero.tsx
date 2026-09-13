import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Star, ShieldCheck, ArrowRight, CheckCircle2, Globe, Linkedin, Twitter, MessageCircle } from 'lucide-react';

interface EditorialHeroProps {
  onStartRFQ: () => void;
  onExploreCategories: () => void;
}

export const EditorialHero: React.FC<EditorialHeroProps> = ({ onStartRFQ, onExploreCategories }) => {
  const categories = [
    { code: '01', title: 'Industrial & MRO' },
    { code: '02', title: 'Office & Facility' },
    { code: '03', title: 'Packaging & Logistics' },
  ];

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#0a0a0a] text-white border-b border-zinc-800">
      {/* Background Architectural Grid Lines & Particle Rays */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f2315_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2315_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Subtle Red Gradient Flare at Top Center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[350px] bg-gradient-to-b from-[#e61937]/15 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Top Meta Bar */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex items-center justify-between border-b border-zinc-800/80 pb-4 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#e61937] animate-pulse" />
          <span className="uppercase tracking-widest text-zinc-300 font-bold">
            2026 — Built for business buying
          </span>
        </div>

        {/* Right Status Widget */}
        <div className="flex items-center gap-3 bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-full text-[11px]">
          <span className="text-zinc-400">RFQ capacity this month:</span>
          <div className="flex gap-1 items-center">
            <span className="w-1.5 h-3 bg-[#e61937] rounded-xs" />
            <span className="w-1.5 h-3 bg-[#e61937] rounded-xs" />
            <span className="w-1.5 h-3 bg-[#e61937] rounded-xs" />
            <span className="w-1.5 h-3 bg-zinc-700 rounded-xs" />
          </div>
          <span className="text-[#e61937] font-bold">3 priority slots left</span>
        </div>
      </div>

      {/* Center Hero Body */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
        {/* Left Column: Headlines & CTA */}
        <div className="lg:col-span-8 space-y-6">
          {/* Category Strip Across Hero */}
          <div className="flex flex-wrap gap-2 pt-2">
            {categories.map((c) => (
              <button
                key={c.code}
                onClick={onExploreCategories}
                data-cursor-label="View"
                className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300 hover:border-[#e61937] hover:text-white transition-colors cursor-pointer"
              >
                <span className="text-[#e61937] font-bold mr-1.5">{c.code}</span>
                <span>{c.title}</span>
              </button>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-black tracking-tight leading-[0.98] text-white">
              Less searching. <br />
              <span className="text-[#e61937] italic font-light">More sourcing.</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-zinc-400 max-w-2xl font-normal leading-relaxed">
              Supply Souq helps teams find verified suppliers, compare quotes, and move every purchase from request to delivery with confidence.
            </p>
          </motion.div>

          {/* Primary CTA with Plus Icon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
          >
            <button
              onClick={onStartRFQ}
              data-cursor-label="Start"
              className="group inline-flex items-center justify-between gap-6 px-8 py-4 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 font-display font-black text-sm tracking-wide transition-all duration-300 shadow-xl hover:shadow-[0_0_35px_-5px_rgba(255,255,255,0.3)] cursor-pointer"
            >
              <span>Start an RFQ</span>
              <div className="w-8 h-8 rounded-full bg-[#e61937] text-white flex items-center justify-center transition-transform duration-300 group-hover:rotate-90">
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </div>
            </button>

            <button
              onClick={onExploreCategories}
              data-cursor-label="Browse"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-mono font-bold text-xs border border-zinc-700 transition-colors cursor-pointer"
            >
              <span>Explore Supply Categories</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          </motion.div>
        </div>

        {/* Right Column: Proof, Metric Box, Avatars */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 font-mono text-xs">
              <span className="text-zinc-400 uppercase">Procurement Proof</span>
              <span className="text-[#e61937] font-bold">100% Verified</span>
            </div>

            <div className="grid grid-cols-2 gap-4 font-mono">
              <div>
                <span className="text-2xl font-black text-white font-display">500+</span>
                <span className="text-[11px] text-zinc-400 block mt-0.5">Vetted Suppliers</span>
              </div>
              <div>
                <span className="text-2xl font-black text-[#e61937] font-display">&lt; 2h</span>
                <span className="text-[11px] text-zinc-400 block mt-0.5">Response Time</span>
              </div>
            </div>

            {/* Buyer Avatar Stack & Rating */}
            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
              <div className="flex -space-x-2 overflow-hidden">
                <img className="inline-block h-7 w-7 rounded-full ring-2 ring-zinc-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Buyer" />
                <img className="inline-block h-7 w-7 rounded-full ring-2 ring-zinc-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Buyer" />
                <img className="inline-block h-7 w-7 rounded-full ring-2 ring-zinc-900 object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="Buyer" />
              </div>
              <div className="flex items-center gap-1 text-zinc-300 font-mono text-[11px]">
                <Star className="w-3.5 h-3.5 fill-[#e61937] text-[#e61937]" />
                <span className="font-bold text-white">4.9 / 5</span>
                <span className="text-zinc-500">(360+ buyers)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Socials & Giant Cropped Wordmark */}
      <div className="relative z-10 border-t border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-3">
            <span className="text-zinc-400 font-bold uppercase tracking-wider">Stay Connected:</span>
            <div className="flex items-center gap-2 text-zinc-400">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" title="LinkedIn">
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" title="Twitter">
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a href="https://wa.me/971504928812" target="_blank" rel="noreferrer" className="hover:text-[#e61937] transition-colors" title="WhatsApp">
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
          <div className="hidden sm:block text-[11px] text-zinc-500">
            UAE &bull; GCC WIDE PROCUREMENT DISPATCH
          </div>
        </div>

        {/* Enormous Cropped Supply Souq Wordmark Spanning Beyond Viewport */}
        <div className="select-none overflow-hidden text-center -mb-4 sm:-mb-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-[17vw] font-display font-black tracking-tighter text-white/[0.05] leading-none uppercase"
          >
            SUPPLY SOUQ
          </motion.div>
        </div>
      </div>
    </section>
  );
};
