import React from 'react';
import { useAppData, defaultTelemetryItems } from '../../context/AppDataContext';
import { 
  Zap, 
  TrendingUp, 
  TrendingDown,
  ShieldCheck, 
  Clock, 
  Activity, 
  Layers, 
  Sparkles, 
  Flame 
} from 'lucide-react';

export const MarketTicker: React.FC = () => {
  const { telemetryItems } = useAppData();

  const activeItems = React.useMemo(() => {
    const list = (telemetryItems || []).filter((i) => i.isActive);
    return list.length > 0 ? list : defaultTelemetryItems;
  }, [telemetryItems]);

  const getItemIcon = (category: string, isPositive: boolean) => {
    switch (category) {
      case 'metal':
        return isPositive ? TrendingUp : TrendingDown;
      case 'electrical':
        return Zap;
      case 'energy':
        return Flame;
      case 'platform':
        return Sparkles;
      case 'sla':
        return ShieldCheck;
      case 'building':
      default:
        return Layers;
    }
  };

  return (
    <div className="bg-[#020f0c] border-b border-[#00ffae]/15 text-white overflow-hidden select-none py-1.5 px-3 relative z-30 font-sans text-[11px] font-medium tracking-wide">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Live Badge Indicator */}
        <div className="flex items-center gap-2 shrink-0 bg-[#002116cc] text-[#00ffae] px-2.5 py-0.5 rounded-full border border-[#00ffae]/30 shadow-glow-mint">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ffae] animate-ping" />
          <span className="font-bold tracking-wider uppercase text-[10px]">LIVE TELEMETRY</span>
        </div>

        {/* Marquee Ticker Track */}
        <div className="overflow-hidden whitespace-nowrap flex-1 relative [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
          <div className="inline-flex gap-8 animate-marquee hover:[animation-play-state:paused]">
            {[...activeItems, ...activeItems].map((item, idx) => {
              const Icon = getItemIcon(item.category, item.isPositive);
              return (
                <div key={`${item.id}-${idx}`} className="inline-flex items-center gap-2 text-slate-300">
                  <Icon className="w-3 h-3 text-[#00ffae] shrink-0" />
                  <span className="text-slate-400 font-semibold">{item.label}:</span>
                  <span className="font-mono font-bold text-white tracking-wide">{item.value}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      item.isPositive
                        ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/30'
                        : 'text-rose-400 bg-rose-950/60 border border-rose-500/30'
                    }`}
                  >
                    {item.change}
                  </span>
                  {item.source === 'dynamic_platform' && (
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                      LIVE RFQ
                    </span>
                  )}
                  {item.source === 'financial_feed' && (
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800/40">
                      LME
                    </span>
                  )}
                  <span className="text-slate-700 ml-2">/</span>
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
