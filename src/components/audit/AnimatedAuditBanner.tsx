import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { 
  Sparkles, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Zap, 
  Droplets, 
  Wind, 
  FlaskConical, 
  HardHat, 
  FileSpreadsheet,
  TrendingDown,
  ShieldCheck
} from 'lucide-react';

export interface AuditPrompt {
  id: number;
  pill: string;
  savingsText: string;
  headline: string;
  description: string;
  categoryIcon: React.ElementType;
}

export const auditPrompts: AuditPrompt[] = [
  {
    id: 1,
    pill: 'Free 30-Second Electrical Audit',
    savingsText: 'Average Cable Savings: 19.5%',
    headline: 'Want to check if your cable & switchgear suppliers are overcharging you?',
    description: 'Upload your last bill for Ducab copper cables, Schneider MCBs, or commercial LED panels. We benchmark every line item against live stockist prices in Al Quoz and Sharjah for free.',
    categoryIcon: Zap
  },
  {
    id: 2,
    pill: 'Power Cable Price Scanner',
    savingsText: 'Average Wire Savings: 18.2%',
    headline: 'Are you paying a retail markup on DEWA-approved Ducab power cables?',
    description: 'Snap a photo of your latest 4Cx16mm² or single-core copper wire invoice. Our algorithm compares your drum prices against authorized wholesale distributor rates in Dubai & Sharjah.',
    categoryIcon: Zap
  },
  {
    id: 3,
    pill: 'Commercial Lighting Audit',
    savingsText: 'Average LED Savings: 22.4%',
    headline: 'Suspect your commercial LED lighting fixtures bill is 20%+ higher than wholesale market?',
    description: 'Upload your invoice for Philips CoreLine, Osram, or Opple 60x60 LED recessed panels and downlights. See real-time wholesale pricing from Al Quoz master importers.',
    categoryIcon: Sparkles
  },
  {
    id: 4,
    pill: 'Switchgear & DB Benchmark',
    savingsText: 'Average Switchgear Savings: 24.1%',
    headline: 'Overpaying for Schneider Acti9 MCBs, MCCBs & 3-Phase Distribution Boards?',
    description: 'Drop in your distribution board purchase receipts. We cross-verify circuit breaker prices against verified Deira & Sharjah switchgear assemblers in 30 seconds.',
    categoryIcon: Zap
  },
  {
    id: 5,
    pill: 'Containment Price Check',
    savingsText: 'Average Containment Savings: 21.0%',
    headline: 'Are your galvanized GI cable trays and Decoduct PVC conduits costing you extra margin?',
    description: 'Upload your bill for Profab 300mm perforated GI trays and Decoduct Class 4 conduits. Discover factory-direct rates across Sharjah Industrial Area 4 & 10.',
    categoryIcon: ShieldCheck
  },
  {
    id: 6,
    pill: 'Fire-Resistant Cable Audit',
    savingsText: 'Average FP200 Savings: 23.5%',
    headline: 'Overpaying on Civil Defense Approved FP200 Gold & CWZ fire-rated cables?',
    description: 'Upload your fire alarm & emergency wiring bill. We benchmark your 2C x 1.5mm² and 4C x 2.5mm² fire-resistant cables against direct factory importers in UAE.',
    categoryIcon: Zap
  },
  {
    id: 7,
    pill: 'Earthing & Lightning Audit',
    savingsText: 'Average Earthing Savings: 20.8%',
    headline: 'Are your copperbonded earth rods and bare copper tape marked up excessively?',
    description: 'Drop in your earthing and lightning protection invoice. We compare your Furse / Wallis copper rods and Cadweld molds against master electrical stockists.',
    categoryIcon: Zap
  },
  {
    id: 8,
    pill: 'Solar & Inverter Price Scan',
    savingsText: 'Average Solar Savings: 17.6%',
    headline: 'Wondering if your solar PV DC cables and 3-phase string inverters are fairly priced?',
    description: 'Scan your solar electrical equipment receipt. We check TÜV certified 4mm²/6mm² DC solar cables and surge arresters against regional distributor pricing.',
    categoryIcon: Zap
  }
];

interface AnimatedAuditBannerProps {
  onLaunchAudit: () => void;
}

export const AnimatedAuditBanner: React.FC<AnimatedAuditBannerProps> = ({ onLaunchAudit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFading, setIsFading] = useState(false);

  // Auto-rotate every 4.5 seconds
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      handleNext();
    }, 4500);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused]);

  const handleNext = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % auditPrompts.length);
      setIsFading(false);
    }, 250);
  };

  const handlePrev = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + auditPrompts.length) % auditPrompts.length);
      setIsFading(false);
    }, 250);
  };

  const currentPrompt = auditPrompts[currentIndex];
  const Icon = currentPrompt.categoryIcon;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="bg-gradient-to-r from-amber-500/15 via-brand-500/10 to-emerald-500/15 border border-amber-300/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-amber-400"
    >
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Area */}
      <div className="space-y-3 max-w-2xl flex-1 z-10">
        {/* Animated Badge Header */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1.5 shadow-xs">
            <Icon className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
            <span>{currentPrompt.pill}</span>
          </span>

          <span className="text-xs text-emerald-800 font-extrabold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
            <span>{currentPrompt.savingsText}</span>
          </span>

          <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
            • Case {currentIndex + 1} of {auditPrompts.length}
          </span>
        </div>

        {/* Dynamic Headline & Description with Transition Effect */}
        <div
          className={`space-y-2 transition-all duration-300 transform ${
            isFading ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'
          }`}
        >
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight min-h-[32px]">
            {currentPrompt.headline}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed min-h-[44px]">
            {currentPrompt.description}
          </p>
        </div>

        {/* Carousel Progress Bar & Navigation Dots */}
        <div className="flex items-center gap-3 pt-2">
          <div className="flex items-center gap-1.5">
            {auditPrompts.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => {
                  setIsFading(true);
                  setTimeout(() => {
                    setCurrentIndex(idx);
                    setIsFading(false);
                  }, 200);
                }}
                title={p.pill}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'w-6 bg-amber-500 shadow-xs'
                    : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <button
              onClick={handlePrev}
              className="p-1 hover:bg-white/80 rounded-full transition-colors text-slate-600"
              title="Previous case"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-1 hover:bg-white/80 rounded-full transition-colors text-slate-600"
              title="Next case"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Action CTA Button */}
      <div className="z-10 flex flex-col items-center gap-2 self-stretch md:self-auto shrink-0">
        <Button
          variant="amber"
          size="lg"
          onClick={onLaunchAudit}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="font-bold whitespace-nowrap shadow-md w-full sm:w-auto text-sm py-3 px-6 hover:scale-105 transition-transform"
        >
          Launch Free Invoice Audit
        </Button>
        <span className="text-[10px] text-slate-500 font-medium text-center">
          100% Free • No Sign-Up Required
        </span>
      </div>
    </div>
  );
};
