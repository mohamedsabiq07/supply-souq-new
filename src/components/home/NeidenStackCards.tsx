import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ShieldCheck, FileSpreadsheet, Award, ArrowUpRight, CheckCircle2, Zap } from 'lucide-react';

interface NeidenStackCardsProps {
  onStartRFQ: () => void;
}

export const NeidenStackCards: React.FC<NeidenStackCardsProps> = ({ onStartRFQ }) => {
  const cards = [
    {
      index: '001',
      tag: 'FASTEST 5 BIDS RULE',
      kanji: '競争見積もり',
      title: '24-Hour RFQ SLA & Fastest 5 Bids Rule',
      subtitle: 'Eliminate 50-supplier quote fatigue with keen, disciplined price competition.',
      description: 'When you upload an RFQ, SupplySouq broadcasts the requirement across verified UAE stockists. Only the first 5 itemized, compliant bids are accepted. This forces suppliers to submit their lowest wholesale rate immediately, giving contractors quick clarity without drowning in 50 random calls.',
      pills: ['Broadcast to 380+ Stockists', 'Only 5 Spots Accepted', '24h Strict Countdown', 'Itemized Line Breakdown'],
      accentColor: 'from-rose-500/20 to-transparent',
      borderColor: 'border-rose-500/30',
      badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
      icon: <Clock className="w-8 h-8 text-rose-400" />,
      metric: '5 Bids Max',
      metricLabel: 'Guaranteed 24h SLA'
    },
    {
      index: '002',
      tag: '100% DET LEGAL VALIDATION',
      kanji: '商業ライセンス認証',
      title: 'Zero Unverified Middlemen or Phantom Brokers',
      subtitle: 'Every stockist is authenticated via Dubai Economy & Tourism and Federal Tax Authority.',
      description: 'Never risk project delays with phantom brokers who don\'t hold inventory. Our verification desk checks registered commercial activities ("Building Materials Trading", "Electrical Equipment Trading"), warehouse addresses in Al Quoz & Deira, and active TRN tax certificates before a vendor can bid.',
      pills: ['DET License Verification', 'TRN Tax ID Validated', 'Warehouse Physical Audit', 'DEWA / SEWA Compliance'],
      accentColor: 'from-rose-500/20 to-transparent',
      borderColor: 'border-rose-500/30',
      badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
      icon: <ShieldCheck className="w-8 h-8 text-rose-400" />,
      metric: '100% Vetted',
      metricLabel: 'Zero Fake Stockists'
    },
    {
      index: '003',
      tag: 'AUTOMATED BOQ PARSER',
      kanji: '仕様書データ抽出',
      title: '1-Click BOQ, Excel & Handwritten Spec Parser',
      subtitle: 'Upload site photos, consultant schedules, or Excel spreadsheets in under 60 seconds.',
      description: 'No more typing out 150 line items manually. Drag and drop your consultant BOQ, engineer site note, or WhatsApp material list. Our procurement parser automatically normalizes cable sizes, conduits, circuit breakers, and quantities into standardized items ready for instant wholesale pricing.',
      pills: ['Multi-Format (XLSX, PDF, JPG)', 'Auto-Normalized Sizes', 'Fast Line Item Matching', '1-Click RFQ Distribution'],
      accentColor: 'from-rose-500/20 to-transparent',
      borderColor: 'border-rose-500/30',
      badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
      icon: <FileSpreadsheet className="w-8 h-8 text-rose-400" />,
      metric: '60 Seconds',
      metricLabel: 'From BOQ to Live RFQ'
    },
    {
      index: '004',
      tag: 'DIRECT MILL CERTIFICATES & QUALITY',
      kanji: '品質保証と保護',
      title: 'Factory Test Certificates & Dispute Mitigation',
      subtitle: 'Original manufacturer inspection certificates with transparent dispute resolution.',
      description: 'Substandard materials cause immediate site rejections from DEWA and project consultants. All orders dispatched through SupplySouq verified partners carry stamped factory mill test certificates and original batch inspection reports. Escrow milestone safeguards protect your capital until goods arrive on site.',
      pills: ['Manufacturer Mill Certs', 'DEWA Approved Batches', 'Milestone Escrow Safeguards', 'On-Site Quality Checks'],
      accentColor: 'from-rose-500/20 to-transparent',
      borderColor: 'border-rose-500/30',
      badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
      icon: <Award className="w-8 h-8 text-rose-400" />,
      metric: '100% Certified',
      metricLabel: 'DEWA / SEWA Approved'
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-[#070707] text-white border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-8 border-b border-white/10 mb-16">
          <div>
            <span className="text-xs font-mono text-rose-400 block mb-1">
              [ SS® ‒ SERVICES & DISCIPLINES / 思想と実行 ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white">
              Built to Eliminate Procurement Friction.
            </h2>
          </div>

          <p className="text-xs font-mono text-slate-400 max-w-xs">
            Four foundational systems engineered for UAE MEP contractors, project directors, and verified stockists.
          </p>
        </div>

        {/* Sticky Stacking Cards Container */}
        <div className="space-y-12">
          {cards.map((card, idx) => (
            <motion.div
              key={card.index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              style={{
                top: `${80 + idx * 24}px`
              }}
              className={`sticky p-8 sm:p-12 rounded-3xl bg-[#16080d]/95 backdrop-blur-2xl border ${card.borderColor} shadow-2xl overflow-hidden transition-transform duration-300`}
            >
              {/* Background gradient splash */}
              <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl ${card.accentColor} blur-3xl -z-10 pointer-events-none`} />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Content */}
                <div className="lg:col-span-8 space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono font-bold text-rose-400">
                      {card.index}. /
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${card.badgeBg}`}>
                      {card.tag}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      [{card.kanji}]
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white tracking-tight leading-tight">
                    {card.title}
                  </h3>

                  <p className="text-sm sm:text-base font-medium text-slate-300">
                    {card.subtitle}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
                    {card.description}
                  </p>

                  {/* Pills */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {card.pills.map((pill, pIdx) => (
                      <span
                        key={pIdx}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 font-mono flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3 h-3 text-rose-400 shrink-0" />
                        <span>{pill}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Stat / Visual Box */}
                <div className="lg:col-span-4 flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-black/50 border border-white/10 text-center space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto shadow-inner">
                    {card.icon}
                  </div>

                  <div>
                    <span className="text-3xl sm:text-4xl font-mono font-black text-white block">
                      {card.metric}
                    </span>
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mt-1">
                      {card.metricLabel}
                    </span>
                  </div>

                  <button
                    onClick={onStartRFQ}
                    className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-[#cf2e46] hover:text-white text-white font-bold text-xs font-mono transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border border-white/10"
                  >
                    <span>Launch RFQ Now</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
