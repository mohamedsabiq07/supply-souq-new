import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ArrowUpRight } from 'lucide-react';

export const NeidenFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      code: '01',
      q: 'How does the Fastest 5 Bids Rule work?',
      a: 'When an RFQ is uploaded, our engine broadcasts it across verified UAE stockists in your requested category. Only the first 5 stockists who submit itemized, compliant quotes are admitted to the contractor\'s comparison table. This creates keen price competition for the contractor while guaranteeing stockists that their quotation won\'t be buried under 50 competing calls.'
    },
    {
      code: '02',
      q: 'How much does SupplySouq cost for contractors and suppliers?',
      a: 'For Contractors & MEP Engineers: 100% Free Forever. Post unlimited RFQs, receive 5 verified bids, and compare side-by-side with zero fees. For Verified Stockists: Enjoy a 3-Month Free Trial with 0% platform commission during launch. After 3 months, it is only AED 1 per day (AED 30/month) for unlimited RFQ quoting.'
    },
    {
      code: '03',
      q: 'How do you verify supplier trade licenses and authenticity?',
      a: 'Every stockist is required to upload a valid UAE Commercial Trade License issued by DET (Dubai Economy & Tourism) or DED Sharjah/Abu Dhabi. Our verification team confirms their licensed commercial activities ("Building Materials Trading", "Electrical Equipment Trading"), physical warehouse location, and valid TRN before they can bid.'
    },
    {
      code: '04',
      q: 'Can I upload handwritten site notes or consultant Excel BOQs?',
      a: 'Yes. SupplySouq accepts Excel spreadsheets (.xlsx, .csv), consultant PDF specifications, and even clear smartphone photos of handwritten site notes. Our parsing engine automatically extracts cables, switchgear, conduits, and quantities into standardized items ready for instant quoting.'
    },
    {
      code: '05',
      q: 'What happens if delivered materials fail consultant or DEWA inspection?',
      a: 'All orders placed through SupplySouq verified partners carry manufacturer mill test certificates and original batch inspection reports. In the rare event of non-compliance, our dispute team freezes payment release and coordinates an immediate stock replacement from our secondary stockist reserve within 24 hours.'
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-[#020706] text-white border-b border-white/10 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-8 border-b border-white/10 mb-12">
          <div>
            <span className="text-xs font-mono text-emerald-400 block mb-1">
              [ SS® ‒ FAQ / 質問と理解 / الأسئلة الشائعة ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white">
              Short, Clear Answers.
            </h2>
          </div>

          <div className="text-xs font-mono text-slate-400">
            Still have questions?{' '}
            <a
              href="https://wa.me/971500000000?text=Hello%20SupplySouq%20Support"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>Talk to procurement</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Accordion List */}
        <div className="divide-y divide-white/10">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={faq.code} className="py-6">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left flex items-start justify-between gap-4 group cursor-pointer"
                >
                  <div className="flex items-baseline gap-4 sm:gap-6">
                    <span className="font-mono text-xs text-emerald-400 font-bold">
                      {faq.code}.
                    </span>
                    <span className="text-base sm:text-xl font-display font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {faq.q}
                    </span>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-white/10 border border-white/10 flex items-center justify-center shrink-0 text-slate-400 group-hover:text-white transition-colors">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden pl-8 sm:pl-10 pr-4"
                    >
                      <p className="pt-4 text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
