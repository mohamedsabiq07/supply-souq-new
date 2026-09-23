import React, { useState } from 'react';
import { SupplyMeshBackground } from '../../components/backgrounds/SupplyMeshBackground';
import { TopographicWaveBackground } from '../../components/backgrounds/TopographicWaveBackground';
import { BackgroundType } from '../../components/backgrounds/DynamicBackgroundHost';
import { useTheme } from '../../context/ThemeContext';
import {
  Sparkles,
  Sun,
  Moon,
  ArrowLeft,
  Sliders,
  Zap,
  ArrowRight,
  ShieldCheck,
  Check,
  Crown,
} from 'lucide-react';

interface BackgroundsShowcasePageProps {
  onBackToHome: () => void;
}

export const BackgroundsShowcasePage: React.FC<BackgroundsShowcasePageProps> = ({ onBackToHome }) => {
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'mesh' | 'waves'>('mesh');
  const [viewMode, setViewMode] = useState<'hero-mockup' | 'full-canvas' | 'side-by-side'>('hero-mockup');
  const [opacity, setOpacity] = useState<number>(0.9);

  return (
    <div className="min-h-screen bg-[#f4f4f6] dark:bg-black text-slate-900 dark:text-zinc-100 font-sans transition-colors duration-200">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0c0c0e]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-white/[0.08] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-zinc-400 hover:text-[#cf2e46] transition-colors cursor-pointer px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          <div className="h-4 w-px bg-slate-300 dark:bg-zinc-700" />
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-[#cf2e46]/10 text-[#cf2e46]">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="text-sm font-black tracking-tight text-slate-950 dark:text-white uppercase">
              Flagship Design Comparison Studio
            </span>
          </div>
        </div>

        {/* View Mode Controls & Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex bg-slate-200/80 dark:bg-zinc-800/80 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('hero-mockup')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'hero-mockup'
                  ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
              }`}
            >
              Hero Mockup
            </button>
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'side-by-side'
                  ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
              }`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setViewMode('full-canvas')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'full-canvas'
                  ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
              }`}
            >
              Full Canvas
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-200/80 dark:bg-zinc-800/80 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer"
            title="Toggle Light / Dark Mode"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Flagship Selector Cards (when in Hero or Full Canvas) */}
        {viewMode !== 'side-by-side' && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1. Supply Mesh Card */}
            <button
              onClick={() => setActiveTab('mesh')}
              className={`text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                activeTab === 'mesh'
                  ? 'bg-white dark:bg-[#0c0c0e] border-[#cf2e46] shadow-xl shadow-[#cf2e46]/10 ring-2 ring-[#cf2e46]/20'
                  : 'bg-white/60 dark:bg-white/[0.03] border-slate-200/80 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.18]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-[#cf2e46]/10 text-[#cf2e46]">
                    <Crown className="w-4 h-4" />
                  </span>
                  <span className="text-sm font-black uppercase tracking-wider text-slate-950 dark:text-white">
                    1. Supply Mesh (Selected Premier Default)
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-[#cf2e46] text-white uppercase">
                  Top Choice
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                Multi-layered depth with traveling RFQ data packets passing between stockist hubs. Dynamic magnetic cursor spotlight repels nodes and illuminates connecting filaments in crimson.
              </p>
              <div className="mt-3 flex items-center gap-2 text-[10px] font-mono text-[#cf2e46] font-bold">
                <span>Multi-Plane Parallax</span> • <span>Traveling Data Packets</span> • <span>UAE Stockist Hubs</span>
              </div>
            </button>

            {/* 2. Topographic Waves Card */}
            <button
              onClick={() => setActiveTab('waves')}
              className={`text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                activeTab === 'waves'
                  ? 'bg-white dark:bg-[#0c0c0e] border-[#cf2e46] shadow-xl shadow-[#cf2e46]/10 ring-2 ring-[#cf2e46]/20'
                  : 'bg-white/60 dark:bg-white/[0.03] border-slate-200/80 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.18]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-black uppercase tracking-wider text-slate-950 dark:text-white">
                  2. Topographic Waves
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 uppercase">
                  Architectural
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                Silky quadratic spline curves mimicking UAE sand dunes and CAD terrain blueprints. Features authentic architectural elevation contour labels and elastic membrane cursor depression.
              </p>
              <div className="mt-3 flex items-center gap-2 text-[10px] font-mono text-slate-500 dark:text-zinc-400 font-bold">
                <span>Cubic Splines</span> • <span>Elevation Labels (+14m, +22m)</span> • <span>Elastic Ripple</span>
              </div>
            </button>
          </div>
        )}

        {/* View Mode 1 & 2: Hero Mockup or Full Canvas */}
        {viewMode !== 'side-by-side' && (
          <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 dark:border-white/[0.08] bg-[#f4f4f6] dark:bg-black min-h-[600px] flex items-center justify-center shadow-xl">
            
            {/* Background Canvas Layer */}
            {activeTab === 'mesh' ? (
              <SupplyMeshBackground opacity={opacity} />
            ) : (
              <TopographicWaveBackground opacity={opacity} />
            )}

            {/* Subtle Grid overlay */}
            <div className="absolute inset-0 architectural-grid opacity-50 dark:opacity-20 pointer-events-none z-0" />

            {/* Live Hero Mockup Content (Text Legibility Check) */}
            {viewMode === 'hero-mockup' && (
              <div className="relative z-10 max-w-3xl mx-auto px-6 py-16 text-center space-y-6">
                
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-black/80 backdrop-blur-md text-xs font-bold text-[#cf2e46]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    Active Flagship: {activeTab === 'mesh' ? 'Supply Mesh' : 'Topographic Waves'}
                  </span>
                </div>

                {/* Primary Headline */}
                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.1]">
                  UAE Procurement, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-rose-700 to-[#cf2e46] dark:from-white dark:via-rose-400 dark:to-[#cf2e46]">
                    Simplified.
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
                  Notice how every word remains crisp, high-contrast, and effortlessly readable in both Light and Dark mode without any washed-out zones.
                </p>

                {/* CTA Button */}
                <div className="pt-2 flex justify-center items-center gap-3">
                  <button className="px-8 py-3.5 rounded-full text-sm font-black text-white bg-[#cf2e46] hover:bg-[#b02237] shadow-lg shadow-[#cf2e46]/25 transition-all flex items-center gap-2 cursor-pointer">
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Post Live RFQ (100% Free)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Stat cards verification */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 text-left">
                  <div className="p-3.5 rounded-xl bg-white/90 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-sm">
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400 font-mono block">Avg Savings</span>
                    <span className="text-xl font-black text-[#cf2e46]">18.4%</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/90 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-sm">
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400 font-mono block">Response SLA</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white">24 Hours</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/90 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-sm">
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400 font-mono block">Bids Cap</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white">5 Stockists</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/90 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-sm">
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400 font-mono block">Verification</span>
                    <span className="text-xl font-black text-[#cf2e46]">100% UAE</span>
                  </div>
                </div>
              </div>
            )}

            {/* In Full Canvas Mode */}
            {viewMode === 'full-canvas' && (
              <div className="absolute bottom-6 left-6 z-10 pointer-events-none bg-black/60 dark:bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-mono text-white">
                Move your cursor to experience {activeTab === 'mesh' ? 'Supply Mesh' : 'Topographic Waves'}
              </div>
            )}
          </div>
        )}

        {/* View Mode 3: Side-by-Side Dual View */}
        {viewMode === 'side-by-side' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left: Supply Mesh */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/[0.08] bg-[#f4f4f6] dark:bg-black h-[500px] flex flex-col justify-between p-6 shadow-lg">
              <SupplyMeshBackground opacity={opacity} />
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="bg-white/90 dark:bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/80 dark:border-white/[0.08]">
                  <span className="text-xs font-black uppercase text-slate-900 dark:text-white">1. Supply Mesh</span>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#cf2e46] text-white font-bold">
                  Premier Default
                </span>
              </div>

              <div className="relative z-10 bg-white/90 dark:bg-[#0c0c0e]/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 dark:border-white/[0.08]">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">Interactive Procurement Network</h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Real-time visualization of interconnected UAE stockists with glowing RFQ data packets traversing links and magnetic cursor repulsion.
                </p>
              </div>
            </div>

            {/* Right: Topographic Waves */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/[0.08] bg-[#f4f4f6] dark:bg-black h-[500px] flex flex-col justify-between p-6 shadow-lg">
              <TopographicWaveBackground opacity={opacity} />
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="bg-white/90 dark:bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/80 dark:border-white/[0.08]">
                  <span className="text-xs font-black uppercase text-slate-900 dark:text-white">2. Topographic Waves</span>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-bold">
                  Architectural
                </span>
              </div>

              <div className="relative z-10 bg-white/90 dark:bg-[#0c0c0e]/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 dark:border-white/[0.08]">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">Architectural Contour Blueprint</h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Mathematical elevation splines with realistic CAD elevation contour labels (+14m, +22m) and responsive elastic membrane ripples.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* Global Controls Bar */}
        <div className="mt-6 p-4 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-[#111114] dark:to-[#0c0c0e] border border-slate-200/80 dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sliders className="w-4 h-4 text-[#cf2e46]" />
            <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
              Animation Opacity / Intensity:
            </span>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-48 accent-[#cf2e46] h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400">
              {Math.round(opacity * 100)}%
            </span>
          </div>

          <div className="text-xs text-slate-500 dark:text-zinc-400">
            <strong>Supply Mesh</strong> is set as the active premier hero background on the homepage.
          </div>
        </div>

      </main>
    </div>
  );
};
