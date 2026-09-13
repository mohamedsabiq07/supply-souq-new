import React from 'react';
import { motion } from 'framer-motion';
import { Plus, ArrowUpRight, CheckCircle2, Package, Tag, Clock } from 'lucide-react';

interface EditorialCategoriesProps {
  onStartRFQ: (categoryName?: string) => void;
}

export const EditorialCategories: React.FC<EditorialCategoriesProps> = ({ onStartRFQ }) => {
  const categories = [
    {
      code: '01',
      title: 'Industrial & MRO Supplies',
      description: 'Power cables, conduits, switchgear, distribution boards, valves, electrical fittings, fasteners, and heavy industrial maintenance supplies.',
      tags: ['Bulk wholesale pricing', 'Factory mill certs', 'DEWA / SEWA approved', '24h dispatch'],
      benchmark: 'Typical delivery: Same-day / 24h',
      image1: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=600&auto=format&fit=crop&q=80',
      image2: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    },
    {
      code: '02',
      title: 'Office & Facility Essentials',
      description: 'Bulk paper, janitorial chemicals, washroom dispensers, breakroom supplies, ergonomic office furniture, and scheduled recurring restocks.',
      tags: ['Recurring auto-orders', 'Verified distributors', 'Volume discounts', 'Consolidated monthly invoicing'],
      benchmark: 'Typical delivery: Next-day scheduled',
      image1: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
      image2: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80',
    },
    {
      code: '03',
      title: 'Hospitality & Retail Supplies',
      description: 'Commercial kitchen wares, food service disposables, guest amenities, housekeeping cleaning gear, and custom retail packaging.',
      tags: ['Food-grade certified', 'Bulk carton rates', 'Custom branding available', 'Priority stock reserve'],
      benchmark: 'Typical delivery: 24–48 hours',
      image1: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
      image2: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
    },
    {
      code: '04',
      title: 'Packaging & Logistics',
      description: 'Corrugated cartons, stretch film, bubble wrap, wooden pallets, strapping, tamper-evident security tapes, and warehouse shipping essentials.',
      tags: ['Direct mill fabricators', 'Standard & custom sizes', 'Heavy duty grade', 'Immediate truckload dispatch'],
      benchmark: 'Typical delivery: 12–24 hours',
      image1: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
      image2: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop&q=80',
    },
    {
      code: '05',
      title: 'Safety & PPE',
      description: 'EN/ANSI certified safety helmets, high-vis vests, steel toe boots, respiratory masks, safety harnesses, and site first-aid trauma kits.',
      tags: ['Civil Defense compliant', 'ANSI & EN397 rated', 'Contractor volume pricing', 'Site delivery ready'],
      benchmark: 'Typical delivery: Same-day available',
      image1: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
      image2: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80',
    },
    {
      code: '06',
      title: 'Technology & Equipment',
      description: 'Enterprise networking racks, Cat6A cabling, biometric access systems, thermal POS printers, commercial displays, and IT hardware.',
      tags: ['Authorized OEM warranty', 'Direct channel stock', 'Fast batch quotes', 'Full spec compliance'],
      benchmark: 'Typical delivery: 24–48 hours',
      image1: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
      image2: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    }
  ];

  return (
    <section className="relative py-28 md:py-36 bg-[#fafafa] text-zinc-950 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Sticky Left Rail */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <div className="flex items-center gap-2 font-mono text-xs text-zinc-900">
              <span className="w-2 h-2 rounded-full bg-[#e61937]" />
              <span className="font-bold tracking-wider">[SSQ-SUPPLY] / CATEGORIES</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-zinc-950 leading-tight">
              What We <br />
              <span className="text-[#e61937]">Source.</span>
            </h2>

            <p className="text-sm sm:text-base text-zinc-600 font-normal leading-relaxed">
              Core supply categories, one procurement flow. Compare verified stockists across UAE without endless phone calls.
            </p>

            <div className="p-4 rounded-xl bg-white border border-zinc-200 font-mono text-xs text-zinc-500 space-y-1">
              <span className="text-[#e61937] font-bold block uppercase tracking-wider text-[10px]">
                Procurement Guarantee
              </span>
              <p className="text-zinc-800">
                Built for recurring business buying, bulk tenders, and emergency site runs.
              </p>
            </div>

            <button
              onClick={() => onStartRFQ()}
              data-cursor-label="Quote"
              className="group inline-flex items-center justify-between gap-4 w-full sm:w-auto px-6 py-3.5 rounded-full bg-zinc-950 hover:bg-zinc-900 text-white font-mono font-bold text-xs transition-all shadow-md cursor-pointer"
            >
              <span>Discuss your supply needs</span>
              <div className="w-6 h-6 rounded-full bg-[#e61937] text-white flex items-center justify-center transition-transform group-hover:rotate-90">
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            </button>
          </div>

          {/* Right Scrollable Column Category Rows */}
          <div className="lg:col-span-8 divide-y divide-zinc-200">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.code}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                className="py-12 first:pt-0 last:pb-0 space-y-6 group"
              >
                {/* Number & Title */}
                <div className="flex items-baseline justify-between flex-wrap gap-2">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-sm font-black text-[#e61937]">
                      {cat.code}.
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-zinc-950 group-hover:text-[#e61937] transition-colors">
                      {cat.title}
                    </h3>
                  </div>

                  <span className="text-xs font-mono text-zinc-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#e61937]" />
                    <span>{cat.benchmark}</span>
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-2xl">
                  {cat.description}
                </p>

                {/* Two-Up Media Strip (Clipped Corners) */}
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="h-44 sm:h-52 overflow-hidden bg-zinc-900 shadow-md border border-zinc-200"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)' }}
                  >
                    <img
                      src={cat.image1}
                      alt={cat.title}
                      className="w-full h-full object-cover filter contrast-110 transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div
                    className="h-44 sm:h-52 overflow-hidden bg-zinc-900 shadow-md border border-zinc-200"
                    style={{ clipPath: 'polygon(16px 0, 100% 0, 100% 100%, 0 100%, 0 16px)' }}
                  >
                    <img
                      src={cat.image2}
                      alt={cat.title}
                      className="w-full h-full object-cover filter contrast-110 transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Tag Pills & Row Action */}
                <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {cat.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded bg-zinc-100 border border-zinc-200 text-[11px] font-mono text-zinc-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => onStartRFQ(cat.title)}
                    data-cursor-label="Quote"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-900 hover:text-[#e61937] transition-colors cursor-pointer"
                  >
                    <span>Request Bulk Quote</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
