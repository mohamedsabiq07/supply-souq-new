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
    <div className="bg-white border-b border-slate-200 text-slate-700 overflow-hidden select-none py-1.5 px-3 relative z-30 font-sans text-[11px] font-medium tracking-wide">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Live Badge Indicator */}
        <div className="flex items-center gap-2 shrink-0 bg-rose-50 text-[#cf2e46] px-2.5 py-0.5 rounded-full border border-rose-200 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#cf2e46] animate-ping" />
          <span className="font-bold tracking-wider uppercase text-[10px]">LIVE TELEMETRY</span>
        </div>

        {/* Marquee Ticker Track */}
        <div className="overflow-hidden whitespace-nowrap flex-1 relative [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
          <div className="inline-flex gap-8 animate-marquee hover:[animation-play-state:paused]">
            {[...activeItems, ...activeItems].map((item, idx) => {
              const Icon = getItemIcon(item.category, item.isPositive);
              return (
                <div key={`${item.id}-${idx}`} className="inline-flex items-center gap-2 text-slate-700">
                  <Icon className="w-3 h-3 text-[#cf2e46] shrink-0" />
                  <span className="text-slate-500 font-semibold">{item.label}:</span>
                  <span className="font-mono font-bold text-slate-900 tracking-wide">{item.value}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      item.isPositive
                        ? 'text-rose-700 bg-rose-50 border border-rose-200'
                        : 'text-slate-700 bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {item.change}
                  </span>
                  {item.source === 'dynamic_platform' && (
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-rose-50 text-[#cf2e46] border border-rose-200 font-bold">
                      LIVE RFQ
                    </span>
                  )}
                  {item.source === 'financial_feed' && (
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      LME
                    </span>
                  )}
                  <span className="text-slate-300 ml-2">/</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dubai Local Clock */}
        <div className="hidden lg:flex items-center gap-1.5 text-[10px] text-slate-600 shrink-0 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-[#cf2e46]" />
          <span>GST (DUBAI): UTC+4</span>
        </div>
      </div>
    </div>
  );
};
