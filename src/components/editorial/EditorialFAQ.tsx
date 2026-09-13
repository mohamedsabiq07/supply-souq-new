import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, ArrowRight } from 'lucide-react';

interface EditorialFAQProps {
  onStartRFQ?: () => void;
}

const FAQS = [
  {
    q: 'How fast do we receive verified quotes after uploading our BOM or RFQ?',
    a: 'For standard commodities (structural steel, carbon steel pipes, ASTM flanges, PVC fittings, electrical cables), you will receive normalized bids within 90 to 120 minutes. Custom engineered components, specialized alloys (Inconel, Monel, Duplex), or mill-run fabrication inquiries are guaranteed within 24 business hours.',
  },
  {
    q: 'Are authentic 3.1 Mill Test Certificates (MTCs) provided with each delivery?',
    a: 'Yes, without exception. Every line item dispatched through Supply Souq is paired with manufacturer test certificates adhering to EN 10204 Type 3.1 or 3.2. Prior to offloading at your site, our QA desk verifies heat numbers, chemical composition, and tensile reports against the physical mill stamps.',
  },
  {
    q: 'How does Supply Souq physically vet suppliers before they can bid?',
    a: 'We conduct physical yard inspections, commercial registry audits, trade credit checks, and ISO 9001 quality audits. Only distributors and stockists with demonstrated physical inventory in UAE or KSA and spotless fulfillment track records are approved on the platform.',
  },
  {
    q: 'What credit facilities and payment terms are available for general contractors?',
    a: 'We offer assisted commercial credit terms of 30, 60, and 90 days for verified contractors following a rapid financial evaluation. In addition, all initial transactions can be escrow-protected: funds are held securely until the site receiver signs off on the delivery inspection note.',
  },
  {
    q: 'Can Supply Souq fulfill cross-border projects in Saudi Arabia, Qatar, or Oman?',
    a: 'Absolutely. We operate cross-border customs clearance and freight lanes connecting JAFZA, Dubai Industrial City, and Musaffah directly to NEOM, Riyadh, Dammam, and Muscat. All GCC customs documentation, SASO/SABER compliance certificates, and transit insurance are handled seamlessly.',
  },
  {
    q: 'How does Supply Souq protect contractors from price markups and phantom stock?',
    a: 'Traditional middlemen markup quotes by 15-30% while having zero physical stock. Supply Souq interfaces directly with physical yard inventory databases. Because our fees are transparent and capped, contractors typically save between 8% and 27% compared to traditional telephone brokers.',
  },
];

export const EditorialFAQ: React.FC<EditorialFAQProps> = ({ onStartRFQ }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative bg-white text-[#09090b] py-28 border-b border-zinc-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Sticky Left Rail */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block w-2.5 h-2.5 bg-[#e61937]" />
              <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase">
                [SSQ-FAQ] • CLARITY & PROTOCOLS
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-black font-display tracking-tight leading-none text-zinc-950 mb-6">
              FREQUENTLY <br />
              ASKED <br />
              <span className="text-[#e61937]">QUESTIONS.</span>
            </h2>

            <p className="text-sm text-zinc-600 leading-relaxed mb-8">
              Everything you need to know about quoting, mill certifications, payment escrow, and logistics delivery SLAs across the GCC.
            </p>

            {/* Support Box */}
            <div className="p-6 bg-[#fafafa] border border-zinc-200 mb-6">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-950 uppercase mb-1">
                <HelpCircle className="w-4 h-4 text-[#e61937]" />
                <span>Need immediate guidance?</span>
              </div>
              <p className="text-xs text-zinc-500 mb-4">
                Our bilingual sourcing desk is available 24/7 on WhatsApp and phone.
              </p>
              {onStartRFQ && (
                <button
                  onClick={onStartRFQ}
                  className="w-full py-2.5 bg-[#09090b] hover:bg-[#e61937] text-white text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <span>Connect With Sourcing Desk</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Two miniature photos */}
            <div className="grid grid-cols-2 gap-3">
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80"
                alt="Logistics Yard"
                className="w-full aspect-[4/3] object-cover grayscale"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}
              />
              <img
                src="https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80"
                alt="Steel Stockpile"
                className="w-full aspect-[4/3] object-cover grayscale"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}
              />
            </div>
          </div>

          {/* Right Column: 6 Accordions */}
          <div className="lg:col-span-8 border-t border-zinc-200">
            {FAQS.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="border-b border-zinc-200 transition-colors"
                >
                  <button
                    onClick={() => toggle(index)}
                    className="w-full py-6 flex items-start justify-between text-left gap-4 group"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-xs font-mono text-zinc-400 mt-1">
                        0{index + 1}
                      </span>
                      <span className={`text-lg sm:text-xl font-bold font-display transition-colors ${
                        isOpen ? 'text-[#e61937]' : 'text-zinc-900 group-hover:text-[#e61937]'
                      }`}>
                        {faq.q}
                      </span>
                    </div>

                    <div className={`w-8 h-8 rounded-none border flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen
                        ? 'bg-[#e61937] text-white border-[#e61937] rotate-45'
                        : 'border-zinc-300 text-zinc-600 group-hover:border-[#e61937] group-hover:text-[#e61937]'
                    }`}>
                      <Plus className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 pl-9 pr-6 text-sm text-zinc-600 leading-relaxed">
                          <p>{faq.a}</p>
                          <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center gap-4 text-xs font-mono text-zinc-400">
                            <span className="text-[#e61937]">SSQ-VERIFIED POLICY</span>
                            <span>•</span>
                            <span>APPLIES ACROSS ALL GCC ACCOUNTS</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
