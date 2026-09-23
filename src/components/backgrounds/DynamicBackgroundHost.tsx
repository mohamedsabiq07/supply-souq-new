import React, { useState, useEffect } from 'react';
import { SupplyMeshBackground } from './SupplyMeshBackground';
import { TopographicWaveBackground } from './TopographicWaveBackground';
import { useTheme } from '../../context/ThemeContext';
import { Sparkles, Sun, Moon, Sliders, ChevronDown, ChevronUp, Check, ExternalLink } from 'lucide-react';

export type BackgroundType = 'mesh' | 'waves' | 'none';

interface DynamicBackgroundHostProps {
  className?: string;
  defaultType?: BackgroundType;
  showControlDock?: boolean;
  opacity?: number;
}

export const DynamicBackgroundHost: React.FC<DynamicBackgroundHostProps> = ({
  className = '',
  defaultType = 'mesh', // SupplyMesh default at 100% capacity
  showControlDock = false,
  opacity: propsOpacity,
}) => {
  const [selectedBg, setSelectedBg] = useState<BackgroundType>(() => {
    if (!showControlDock && defaultType) return defaultType;
    const saved = localStorage.getItem('preview_bg_type') as BackgroundType;
    return saved === 'mesh' || saved === 'waves' || saved === 'none' ? saved : defaultType;
  });
  const [opacity, setOpacity] = useState<number>(() => {
    if (propsOpacity !== undefined) return propsOpacity;
    const saved = localStorage.getItem('preview_bg_opacity');
    return saved ? parseFloat(saved) : 1.0;
  });
  const [isDockOpen, setIsDockOpen] = useState<boolean>(true);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    localStorage.setItem('preview_bg_type', selectedBg);
  }, [selectedBg]);

  useEffect(() => {
    localStorage.setItem('preview_bg_opacity', opacity.toString());
  }, [opacity]);

  const effectiveOpacity = propsOpacity !== undefined ? propsOpacity : opacity;
  const effectiveBg = !showControlDock && defaultType ? defaultType : selectedBg;

  const bgOptions: { id: BackgroundType; name: string; tag: string; desc: string }[] = [
    {
      id: 'mesh',
      name: 'Supply Mesh (Active)',
      tag: 'B2B Network',
      desc: 'UAE procurement network with traveling RFQ light packets & interactive stockist hubs',
    },
    {
      id: 'waves',
      name: 'Topographic Waves',
      tag: 'Architectural',
      desc: 'Silky CAD contour isolines with elevation markers and elastic membrane deflections',
    },
    {
      id: 'none',
      name: 'Clean Grid',
      tag: 'Default',
      desc: 'Standard static architectural grid lines with zero canvas animation',
    },
  ];

  return (
    <>
      {/* 1. Background Renderer Container */}
      <div className={`absolute inset-0 pointer-events-none select-none overflow-hidden z-0 ${className}`}>
        {effectiveBg === 'mesh' && <SupplyMeshBackground opacity={effectiveOpacity} />}
        {effectiveBg === 'waves' && <TopographicWaveBackground opacity={effectiveOpacity} />}
      </div>

      {/* 2. Interactive Switcher Dock (Compact, Luxury Floating Pill) */}
      {showControlDock && (
        <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
          <div className="bg-white/95 dark:bg-[#0c0c0e]/95 backdrop-blur-xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xl rounded-2xl p-3.5 transition-all duration-300 w-84 text-slate-900 dark:text-zinc-100 font-sans">
            
            {/* Header bar */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#cf2e46]/10 text-[#cf2e46]">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    Theme Tuner
                  </h4>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400 block -mt-0.5">
                    SupplyMesh vs TopoWaves
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Theme Toggle Button */}
                <button
                  onClick={toggleTheme}
                  title="Toggle Light / Dark Mode"
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] text-slate-600 dark:text-zinc-300 transition-colors cursor-pointer"
                >
                  {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                </button>

                {/* Open Full Studio Link */}
                <a
                  href="/?view=backgrounds"
                  title="Open Full Comparison Studio"
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] text-slate-600 dark:text-zinc-400 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>

                {/* Collapse / Expand Toggle */}
                <button
                  onClick={() => setIsDockOpen(!isDockOpen)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] text-slate-600 dark:text-zinc-400 transition-colors cursor-pointer"
                >
                  {isDockOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Expandable Body */}
            {isDockOpen && (
              <div className="mt-3 space-y-2.5">
                {/* 2-Option Radio Switcher */}
                <div className="space-y-1.5">
                  {bgOptions.map((opt) => {
                    const isCurrent = selectedBg === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedBg(opt.id)}
                        className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-all duration-200 cursor-pointer ${
                          isCurrent
                            ? 'bg-[#cf2e46] text-white font-bold shadow-md shadow-[#cf2e46]/20'
                            : 'hover:bg-slate-100 dark:hover:bg-white/[0.04] text-slate-700 dark:text-zinc-300'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-semibold flex items-center gap-1.5">
                            <span className="truncate">{opt.name}</span>
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-wider font-mono shrink-0 ${
                                isCurrent
                                  ? 'bg-white/20 text-white'
                                  : 'bg-slate-200/80 dark:bg-white/[0.06] text-slate-600 dark:text-zinc-400'
                              }`}
                            >
                              {opt.tag}
                            </span>
                          </div>
                          <p
                            className={`text-[10px] mt-0.5 line-clamp-1 leading-snug ${
                              isCurrent ? 'text-white/80' : 'text-slate-500 dark:text-zinc-400'
                            }`}
                          >
                            {opt.desc}
                          </p>
                        </div>
                        {isCurrent && <Check className="w-4 h-4 shrink-0 text-white" />}
                      </button>
                    );
                  })}
                </div>

                {/* Opacity / Intensity Slider */}
                <div className="pt-2 border-t border-slate-200/80 dark:border-white/[0.06]">
                  <div className="flex items-center justify-between text-[11px] mb-1 text-slate-600 dark:text-zinc-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Sliders className="w-3 h-3" />
                      <span>Intensity / Opacity</span>
                    </span>
                    <span className="font-mono">{Math.round(opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="w-full accent-[#cf2e46] h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
