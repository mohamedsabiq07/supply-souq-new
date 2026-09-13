import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Clock, User, BookOpen } from 'lucide-react';

interface EditorialArticlesProps {
  onStartRFQ?: () => void;
}

const ARTICLES = [
  {
    tag: '[MARKET REPORT]',
    title: 'The 2026 GCC Steel & Alloy Index: Navigating Port Tariffs and Freight Volatility',
    excerpt: 'An in-depth metallurgical analysis of billet imports, scrap steel price floors across UAE/Saudi, and regional rebar hedging strategies for EPC project directors.',
    readTime: '6 MIN READ',
    author: 'Tariq Al-Mansoor',
    role: 'VP of Metallurgy',
    date: 'SEPTEMBER 2026',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
  },
  {
    tag: '[COMPLIANCE AUDIT]',
    title: 'Why EN 10204 3.1 MTCs Are Your Contractor License’s Strongest Defense',
    excerpt: 'Substandard carbon steel flanges and counterfeit valve heat stamps are triggering severe municipality penalties. How automated digital MTC verification protects your site.',
    readTime: '4 MIN READ',
    author: 'Elena Rostova',
    role: 'Head of Quality Assurance',
    date: 'AUGUST 2026',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
  },
  {
    tag: '[PROCUREMENT PLAYBOOK]',
    title: 'Cutting Requisition Cycle Time by 70%: Retiring WhatsApp Sourcing for Good',
    excerpt: 'How leading GCC contractors eliminated 5-day quote lags by migrating from fragmented mobile chats to structured algorithmic BOM parsing and yard telemetry.',
    readTime: '5 MIN READ',
    author: 'Rashid Al-Qasimi',
    role: 'Director of Ground Telemetry',
    date: 'JULY 2026',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
  },
];

export const EditorialArticles: React.FC<EditorialArticlesProps> = ({ onStartRFQ }) => {
  return (
    <section className="relative bg-[#fafafa] text-[#09090b] py-28 border-b border-zinc-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-zinc-300">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block w-2.5 h-2.5 bg-[#e61937]" />
              <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase">
                [SSQ-INTELLIGENCE] • EDITORIAL INSIGHTS
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight leading-none text-zinc-950">
              SUPPLY CHAIN <br />
              <span className="text-[#e61937]">INTELLIGENCE</span> & ADVISORY.
            </h2>
          </div>
          <div className="mt-6 md:mt-0 flex items-center gap-2 text-xs font-mono text-zinc-500">
            <BookOpen className="w-4 h-4 text-[#e61937]" />
            <span>UPDATED WEEKLY BY OUR COMMODITIES DESK</span>
          </div>
        </div>

        {/* 3 Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES.map((art, idx) => (
            <motion.article
              key={art.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white border border-zinc-200 hover:border-zinc-400 flex flex-col justify-between group transition-all duration-300 shadow-sm hover:shadow-xl cursor-pointer"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
              }}
            >
              <div>
                {/* Image */}
                <div 
                  className="relative aspect-[16/10] overflow-hidden bg-zinc-100"
                  style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)',
                  }}
                >
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-[#09090b]/80 backdrop-blur-sm text-white px-2.5 py-0.5 text-[10px] font-mono border border-zinc-800">
                    {art.tag}
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-6">
                  <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400 mb-3">
                    <span className="flex items-center gap-1 text-[#e61937]">
                      <Clock className="w-3.5 h-3.5" />
                      {art.readTime}
                    </span>
                    <span>•</span>
                    <span>{art.date}</span>
                  </div>

                  <h3 className="text-xl font-bold font-display text-zinc-950 group-hover:text-[#e61937] transition-colors leading-snug mb-3">
                    {art.title}
                  </h3>

                  <p className="text-xs text-zinc-600 leading-relaxed line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>
              </div>

              {/* Author Footer */}
              <div className="p-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-zinc-100 text-zinc-800 flex items-center justify-center text-xs font-bold font-mono">
                    {art.author.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-900">{art.author}</div>
                    <div className="text-[10px] font-mono text-zinc-500">{art.role}</div>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-none border border-zinc-200 group-hover:border-[#e61937] group-hover:bg-[#e61937] group-hover:text-white flex items-center justify-center transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Bottom Newsletter / Report Subscription Strip */}
        <div className="mt-16 p-8 bg-[#09090b] text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-zinc-800">
          <div>
            <div className="text-xs font-mono text-[#e61937] uppercase tracking-wider mb-1">
              GCC COMMODITY DISPATCH
            </div>
            <h3 className="text-xl font-bold font-display text-white">
              Get the Weekly LME Steel, Rebar & Valve Pricing Radar
            </h3>
          </div>
          <div className="flex w-full md:w-auto items-center gap-2">
            <input
              type="email"
              placeholder="Enter corporate email..."
              className="bg-zinc-900 border border-zinc-700 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#e61937] w-full md:w-64 font-mono"
            />
            <button
              onClick={onStartRFQ}
              className="px-5 py-2.5 bg-[#e61937] hover:bg-[#ff1f3d] text-white text-xs font-mono uppercase tracking-wider font-bold shrink-0 transition-colors"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
