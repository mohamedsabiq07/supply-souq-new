import React from 'react';
import { Zap, TrendingUp, ShieldCheck, Clock, Activity } from 'lucide-react';

export const MarketTicker: React.FC = () => {
  const tickerItems = [
    {
      id: 1,
      label: 'LME COPPER SPOT',
      value: ',245.50 / MT',
      change: '+1.18%',
      isPositive: true,
      icon: TrendingUp,
    },
    {
      id: 2,
      label: 'DUCAB CABLE INDEX',
      value: 'AED 28.40/M',
      change: 'STABLE',
      isPositive: true,
      icon: Zap,
    },
    {
      id: 3,
      label: 'FASTEST 5 BIDS RULE',
      value: 'CAPACITY CAP: 5 QUOTES',
      change: 'ACTIVE',
      isPositive: true,
      icon: Activity,
    },
    {
      id: 4,
      label: 'DEWA / SEWA STANDARDS',
      value: '2026.1 SPEC',
      change: 'COMPLIANT',
      isPositive: true,
      icon: ShieldCheck,
    },
    {
      id: 5,
      label: 'CONTRACTOR SLA',
      value: '24-HOUR DISPATCH',
      change: '100% ON-TIME',
      isPositive: true,
      icon: Clock,
    },
    {
      id: 6,
      label: 'UAE ELECTRICAL HUBS',
      value: 'AL QUOZ & SHARJAH',
      change: '32 ACTIVE STOCKISTS',
      isPositive: true,
      icon: Zap,
    },
  ];

  return (
    <div className="bg-obsidian-950 border-b border-cyan-900/40 text-white overflow-hidden select-none py-1.5 px-3 relative z-30 font-mono text-[11px]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Live Badge Indicator */}
        <div className="flex items-center gap-2 shrink-0 bg-cyan-950/80 text-cyan-300 px-2.5 py-0.5 rounded border border-cyan-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-bold tracking-wider uppercase text-[10px]">MARKET TELEMETRY</span>
        </div>

        {/* Marquee Ticker Track */}
        <div className="overflow-hidden whitespace-nowrap flex-1 relative [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
          <div className="inline-flex gap-8 animate-marquee hover:[animation-play-state:paused]">
            {[...tickerItems, ...tickerItems].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="inline-flex items-center gap-2 text-slate-300">
                  <Icon className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span className="text-slate-400 font-semibold">{item.label}:</span>
                  <span className="font-bold text-white tracking-wide">{item.value}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      item.isPositive
                        ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/30'
                        : 'text-amber-400 bg-amber-950/60 border border-amber-500/30'
                    }`}
                  >
                    {item.change}
                  </span>
                  <span className="text-slate-600 ml-2">/</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dubai Local Clock */}
        <div className="hidden lg:flex items-center gap-1.5 text-[10px] text-slate-400 shrink-0 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>GST (DUBAI): UTC+4</span>
        </div>
      </div>
    </div>
  );
};
