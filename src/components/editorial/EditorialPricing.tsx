import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, ShieldCheck, Sparkles, Building2, HelpCircle } from 'lucide-react';

interface EditorialPricingProps {
  onStartRFQ?: () => void;
}

export const EditorialPricing: React.FC<EditorialPricingProps> = ({ onStartRFQ }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const plans = [
    {
      name: 'BUYER STARTER',
      tagline: 'For sub-contractors & facility teams sourcing project-by-project.',
      priceMonthly: 'AED 0',
      priceAnnual: 'AED 0',
      period: 'free forever',
      badge: 'SELF-SERVE',
      featured: false,
      buttonText: 'Submit First RFQ',
      features: [
        'Unlimited RFQ submissions',
        'Standard quote response within 4 hours',
        'Access to 200+ verified GCC stockists',
        'Digital MTC and mill certificates',
        'Escrow payment protection',
        'Standard ground logistics delivery',
      ],
      notIncluded: [
        'Dedicated procurement manager',
        'Extended 60-day credit facility',
        'ERP punchout / API integration',
      ],
    },
    {
      name: 'PROCUREMENT GROWTH',
      tagline: 'Our most popular tier for active general contractors & MEP firms.',
      priceMonthly: 'AED 2,400',
      priceAnnual: 'AED 1,920',
      period: '/ month, billed annually',
      badge: 'MOST POPULAR',
      featured: true, // HOT RED CARD
      buttonText: 'Activate Growth Tier',
      features: [
        'Priority quote dispatch (< 90 minutes)',
        'Guaranteed lowest wholesale margin benchmarks',
        'Dedicated bilingual procurement desk',
        'Assisted 30 & 45-day commercial credit lines',
        'Consolidated monthly VAT invoicing',
        'Pre-dispatch physical gate QC inspection',
        'Multi-site drop coordination across UAE & KSA',
      ],
      notIncluded: [
        'Custom on-premise ERP punchout',
      ],
    },
    {
      name: 'ENTERPRISE NETWORK',
      tagline: 'For infrastructure developers, tier-1 EPCs, and sovereign projects.',
      priceMonthly: 'Custom',
      priceAnnual: 'Custom',
      period: 'annual contract',
      badge: 'SCALE & EPC',
      featured: false,
      buttonText: 'Contact Enterprise Desk',
      features: [
        'Full bespoke supply chain allocation',
        'Dedicated on-site QA/QC inspectors',
        'Direct mill allotment reservations (steel/pipes)',
        'SAP / Oracle / Procore API punchout catalog',
        'Revolving credit facilities up to AED 10M+',
        'SLA-backed 45-minute urgent site fulfillment',
        'Quarterly rebate & bulk volume dividend',
      ],
      notIncluded: [],
    },
  ];

  return (
    <section className="relative bg-[#09090b] text-white py-28 border-b border-zinc-800 overflow-hidden">
      {/* Background Subtle Lines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#e61937]" />
            <span className="text-xs font-mono tracking-widest text-zinc-300 uppercase">
              [SSQ-COMMERCIAL] • PLANS & COMMISSIONS
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight leading-none text-white mb-6">
            TRANSPARENT VALUE. <br />
            <span className="text-[#e61937]">ZERO SURPRISE</span> FEES.
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Choose pay-as-you-go marketplace freedom or unlock dedicated enterprise purchasing power with priority yard allocation and commercial credit.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 inline-flex items-center p-1 bg-zinc-950 border border-zinc-800">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 text-xs font-mono font-bold tracking-wider uppercase transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-5 py-2 text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-2 ${
                billingCycle === 'annual'
                  ? 'bg-[#e61937] text-white shadow-[0_0_15px_rgba(230,25,55,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Annual Contract</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-black/40 text-white">SAVE 20%</span>
            </button>
          </div>
        </div>

        {/* 3-Column Bento Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => {
            const isHotRed = plan.featured;
            const price = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className={`p-8 border transition-all duration-300 flex flex-col justify-between relative ${
                  isHotRed
                    ? 'bg-[#e61937] text-white border-[#e61937] shadow-[0_0_50px_rgba(230,25,55,0.3)] lg:-translate-y-2'
                    : 'bg-[#121215] text-white border-zinc-800 hover:border-zinc-700'
                }`}
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)',
                }}
              >
                {/* Floating Badge */}
                <div className="flex items-center justify-between mb-6">
                  <span className={`text-[11px] font-mono tracking-widest uppercase px-2.5 py-1 ${
                    isHotRed ? 'bg-black text-white' : 'bg-zinc-900 border border-zinc-800 text-[#e61937]'
                  }`}>
                    {plan.badge}
                  </span>
                  {isHotRed && (
                    <div className="flex items-center gap-1 text-xs font-mono font-bold bg-white text-[#e61937] px-2 py-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>RECOMMENDED</span>
                    </div>
                  )}
                </div>

                {/* Header info */}
                <div>
                  <h3 className="text-2xl font-black font-display tracking-tight mb-2">
                    {plan.name}
                  </h3>
                  <p className={`text-xs leading-relaxed mb-6 min-h-[36px] ${
                    isHotRed ? 'text-white/90' : 'text-zinc-400'
                  }`}>
                    {plan.tagline}
                  </p>

                  {/* Pricing Display */}
                  <div className="pb-6 border-b mb-6 border-white/20">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-black font-display tracking-tight">
                        {price}
                      </span>
                    </div>
                    <div className={`text-xs font-mono mt-1 ${isHotRed ? 'text-white/80' : 'text-zinc-500'}`}>
                      {plan.period}
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    <div className={`text-xs font-mono uppercase tracking-wider ${
                      isHotRed ? 'text-white/90' : 'text-zinc-400'
                    }`}>
                      Included in this tier:
                    </div>
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs">
                        <div className={`w-4 h-4 rounded-none flex items-center justify-center shrink-0 mt-0.5 ${
                          isHotRed ? 'bg-white text-[#e61937]' : 'bg-zinc-800 text-[#e61937]'
                        }`}>
                          <Check className="w-3 h-3" />
                        </div>
                        <span className={isHotRed ? 'text-white' : 'text-zinc-300'}>{feat}</span>
                      </div>
                    ))}

                    {plan.notIncluded.length > 0 && (
                      <div className="pt-3 border-t border-zinc-800/40 space-y-2">
                        {plan.notIncluded.map((nInc, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs opacity-40">
                            <span className="w-4 h-4 flex items-center justify-center shrink-0 text-zinc-500">—</span>
                            <span className="text-zinc-400 line-through">{nInc}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Button Action */}
                <div>
                  <button
                    onClick={onStartRFQ}
                    className={`w-full py-3.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
                      isHotRed
                        ? 'bg-black hover:bg-zinc-900 text-white shadow-lg'
                        : 'bg-[#e61937] hover:bg-[#ff1f3d] text-white shadow-[0_0_20px_rgba(230,25,55,0.2)]'
                    }`}
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
                    }}
                  >
                    <span>{plan.buttonText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className={`text-[10px] text-center font-mono mt-3 ${
                    isHotRed ? 'text-white/70' : 'text-zinc-500'
                  }`}>
                    Instant activation • No long-term lock-in
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Enterprise Bespoke Assurance Banner */}
        <div className="mt-16 p-8 bg-zinc-950 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-[#e61937]" />
            </div>
            <div>
              <div className="text-base font-bold text-white uppercase tracking-wider">
                Need Custom Trade Finance or Credit Escrow?
              </div>
              <div className="text-xs text-zinc-400">
                Supply Souq works with tier-1 UAE banks to extend collateral-free trade facilities up to 90 days for qualified EPC contractors.
              </div>
            </div>
          </div>
          <button
            onClick={onStartRFQ}
            className="shrink-0 px-6 py-3 border border-zinc-700 hover:border-[#e61937] hover:text-[#e61937] text-white text-xs font-mono uppercase tracking-wider transition-colors"
          >
            Speak With Trade Desk
          </button>
        </div>
      </div>
    </section>
  );
};
