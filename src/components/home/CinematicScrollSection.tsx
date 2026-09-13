import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import {
  ShieldCheck,
  Building2,
  Zap,
  ArrowUpRight,
  Layers,
  Sparkles,
  Compass,
  CheckCircle2,
  FileCheck2,
  Activity,
  Maximize2
} from 'lucide-react';

interface CinematicScrollSectionProps {
  setCurrentView?: (view: string) => void;
}

export const CinematicScrollSection: React.FC<CinematicScrollSectionProps> = ({ setCurrentView }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Map vertical scroll progress across the 380vh scroll track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // --- Center Image Continuous Transformations ---
  // Hold small portrait steady while user reads all surrounding fragments (0.0 to 0.20)
  // Expand smoothly (0.20 to 0.85)
  // Full edge-to-edge bleed at the end (0.85 to 1.0)
  const imageScale = useTransform(
    scrollYProgress,
    [0.18, 0.40, 0.65, 0.88],
    [1.0, 1.35, 2.2, shouldReduceMotion ? 1.0 : 3.8]
  );

  const imageBorderRadius = useTransform(
    scrollYProgress,
    [0.25, 0.58, 0.85],
    ['24px', '14px', '0px']
  );

  const imageBorderOpacity = useTransform(
    scrollYProgress,
    [0.20, 0.50, 0.75],
    [1, 0.5, 0]
  );

  const imageOverlayDim = useTransform(
    scrollYProgress,
    [0.78, 0.94],
    [0.15, 0.5]
  );

  // --- Staggered Floating Text Animations (Calibrated for Natural, Comfortable Reading) ---
  // All text fragments stay fully visible and stationary through 0.0 to 0.20
  
  // 1. Top Left - Main Platform Title
  const tl1_x = useTransform(scrollYProgress, [0.20, 0.52], [0, -110]);
  const tl1_y = useTransform(scrollYProgress, [0.20, 0.52], [0, -80]);
  const tl1_opacity = useTransform(scrollYProgress, [0.20, 0.48], [1, 0]);
  const tl1_blur = useTransform(scrollYProgress, [0.24, 0.48], ['blur(0px)', 'blur(10px)']);

  // 2. Top Center-Right - Compare Suppliers Pill
  const tc_y = useTransform(scrollYProgress, [0.22, 0.54], [0, -110]);
  const tc_opacity = useTransform(scrollYProgress, [0.22, 0.50], [1, 0]);

  // 3. Top Right - Upload BOQ
  const tr_x = useTransform(scrollYProgress, [0.24, 0.56], [0, 120]);
  const tr_y = useTransform(scrollYProgress, [0.24, 0.56], [0, -90]);
  const tr_opacity = useTransform(scrollYProgress, [0.24, 0.52], [1, 0]);

  // 4. Middle Far-Left - Disciplines Track
  const ml_x = useTransform(scrollYProgress, [0.26, 0.58], [0, -140]);
  const ml_opacity = useTransform(scrollYProgress, [0.26, 0.54], [1, 0]);

  // 5. Middle Left Inner - Reduce Procurement Time
  const mli_x = useTransform(scrollYProgress, [0.28, 0.60], [0, -90]);
  const mli_opacity = useTransform(scrollYProgress, [0.28, 0.56], [1, 0]);

  // 6. Middle Far-Right - Discover Verified Vendors
  const mr_x = useTransform(scrollYProgress, [0.30, 0.62], [0, 140]);
  const mr_opacity = useTransform(scrollYProgress, [0.30, 0.58], [1, 0]);

  // 7. Middle Right Inner - Real-Time Product Discovery
  const mri_x = useTransform(scrollYProgress, [0.32, 0.64], [0, 90]);
  const mri_opacity = useTransform(scrollYProgress, [0.32, 0.60], [1, 0]);

  // 8. Bottom Left - Built for Contractors
  const bl_x = useTransform(scrollYProgress, [0.34, 0.66], [0, -110]);
  const bl_y = useTransform(scrollYProgress, [0.34, 0.66], [0, 90]);
  const bl_opacity = useTransform(scrollYProgress, [0.34, 0.62], [1, 0]);

  // 9. Bottom Center-Left - Save Cost, Time, Smarter
  const bc_y = useTransform(scrollYProgress, [0.36, 0.68], [0, 110]);
  const bc_opacity = useTransform(scrollYProgress, [0.36, 0.64], [1, 0]);

  // 10. Bottom Right - From RFQ to Delivery
  const br_x = useTransform(scrollYProgress, [0.38, 0.70], [0, 130]);
  const br_y = useTransform(scrollYProgress, [0.38, 0.70], [0, 100]);
  const br_opacity = useTransform(scrollYProgress, [0.38, 0.66], [1, 0]);

  // 11. Bottom Far-Right - Built for UAE Market
  const bfr_x = useTransform(scrollYProgress, [0.40, 0.72], [0, 150]);
  const bfr_opacity = useTransform(scrollYProgress, [0.40, 0.68], [1, 0]);

  // --- Background Grid & Linework Dissolve ---
  const gridOpacity = useTransform(scrollYProgress, [0.20, 0.70], [0.8, 0.05]);

  // --- Stage 4 Immersion Reveal (Full-Bleed Final State) ---
  const finalCopyOpacity = useTransform(scrollYProgress, [0.82, 0.94], [0, 1]);
  const finalCopyY = useTransform(scrollYProgress, [0.82, 0.94], [35, 0]);

  // Stage Indicator Counter
  const stageNumber = useTransform(
    scrollYProgress,
    [0, 0.30, 0.60, 0.85],
    ['01 // DISCOVERY', '02 // ENGAGEMENT', '03 // CONVERGENCE', '04 // UNIFIED PLATFORM']
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[360vh] bg-[#030304] text-slate-100 font-sans select-none"
    >
      {/* Sticky Viewport Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

        {/* Ambient Dark Blueprint Grid & Structural Column Guide Lines */}
        <motion.div
          style={{ opacity: gridOpacity }}
          className="absolute inset-0 pointer-events-none z-0"
        >
          {/* Subtle 80px Architectural Grid */}
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px'
            }}
          />

          {/* Vertical Guide Columns */}
          <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex justify-between">
            <div className="w-px h-full bg-white/[0.04]" />
            <div className="w-px h-full bg-white/[0.03] hidden md:block" />
            <div className="w-px h-full bg-white/[0.03] hidden lg:block" />
            <div className="w-px h-full bg-white/[0.04]" />
          </div>

          {/* Minimal Viewport Measurement Crosshairs */}
          <div className="absolute top-8 left-8 text-white/20 font-mono text-xs">+</div>
          <div className="absolute top-8 right-8 text-white/20 font-mono text-xs">+</div>
          <div className="absolute bottom-8 left-8 text-white/20 font-mono text-xs">+</div>
          <div className="absolute bottom-8 right-8 text-white/20 font-mono text-xs">+</div>

          {/* Technical Telemetry Badges (Corner Indicators) */}
          <div className="absolute top-8 left-14 hidden md:flex items-center gap-3 font-mono text-[10px] text-slate-400 tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
            <span>UAE-SS // 25.2048° N, 55.2708° E</span>
            <span className="text-slate-600">|</span>
            <span>B2B DIGITAL INFRASTRUCTURE</span>
          </div>

          <div className="absolute top-8 right-14 hidden md:flex items-center gap-3 font-mono text-[10px] text-slate-400 tracking-wider uppercase">
            <motion.span>{stageNumber}</motion.span>
            <span className="text-slate-600">|</span>
            <span className="text-rose-400">24H SLA ACTIVE</span>
          </div>
        </motion.div>

        {/* ========================================================= */}
        {/* ASYMMETRIC FLOATING EDITORIAL TEXT FRAGMENTS (STAGE 1 & 2) */}
        {/* ========================================================= */}
        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none z-20 flex flex-col justify-between py-12 md:py-16">

          {/* ROW 1: TOP AREA */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            
            {/* Fragment 1: Top-Left - Main Marketplace Signal */}
            <motion.div
              style={{ x: tl1_x, y: tl1_y, opacity: tl1_opacity, filter: tl1_blur }}
              className="md:col-span-4 space-y-1.5 text-left"
            >
              <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-[#38bdf8] bg-sky-950/40 border border-sky-500/20 px-2.5 py-0.5 rounded-md backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
                <span>PROCUREMENT INTELLIGENCE</span>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-black tracking-tight text-white leading-tight">
                UAE B2B Construction Marketplace
              </h3>
              <p className="text-xs text-slate-400 font-normal leading-relaxed max-w-xs">
                Next-generation digital clearinghouse connecting UAE EPC contractors directly to verified stockists.
              </p>
            </motion.div>

            {/* Fragment 2: Top Center-Right - Compare Multiple Suppliers */}
            <motion.div
              style={{ y: tc_y, opacity: tc_opacity }}
              className="hidden md:block md:col-span-4 text-center mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl text-xs font-mono text-slate-300 shadow-2xl">
                <span className="text-[#cf2e46] font-bold">●●●●</span>
                <span className="tracking-wide">Compare Multiple Suppliers</span>
                <span className="text-sky-400 text-[10px] bg-sky-950/60 px-2 py-0.5 rounded border border-sky-500/30">
                  5 CAPPED
                </span>
              </div>
            </motion.div>

            {/* Fragment 3: Top-Right - Upload BOQ & Standards */}
            <motion.div
              style={{ x: tr_x, y: tr_y, opacity: tr_opacity }}
              className="hidden sm:block md:col-span-4 text-right ml-auto space-y-1"
            >
              <div className="text-[11px] font-mono text-slate-400 tracking-wider uppercase">
                [SPECIFICATION: BS 5467 // IEC 60502-1]
              </div>
              <div className="text-base sm:text-lg font-bold text-white tracking-tight">
                Upload BOQ. Receive Competitive Quotes.
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Standardized line items • Mill test sheets included
              </p>
            </motion.div>

          </div>

          {/* ROW 2: MID-LEFT & MID-RIGHT WINGS */}
          <div className="flex items-center justify-between w-full py-4">
            
            {/* Left Wing Fragments */}
            <div className="space-y-6 text-left max-w-[240px]">
              
              {/* Fragment 4: Electrical • MEP • Civil • Hardware */}
              <motion.div
                style={{ x: ml_x, opacity: ml_opacity }}
                className="hidden lg:flex items-center gap-3 font-mono text-xs tracking-widest text-slate-400 -rotate-90 origin-left transform translate-y-12"
              >
                <span className="text-[#cf2e46] font-bold">•</span>
                <span className="uppercase text-slate-300">Electrical • MEP • Civil • Hardware</span>
                <span className="text-slate-600">// CAT-01</span>
              </motion.div>

              {/* Fragment 5: Reduce Procurement Time */}
              <motion.div
                style={{ x: mli_x, opacity: mli_opacity }}
                className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-1 shadow-xl"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>TURNAROUND METRIC</span>
                  <span className="text-emerald-400 font-bold">75% FASTER</span>
                </div>
                <div className="text-sm font-black text-white">
                  Reduce Procurement Time
                </div>
                <div className="text-[11px] font-mono text-[#38bdf8] flex items-center gap-1.5">
                  <Activity className="w-3 h-3" />
                  <span>96 Hours ➔ 24 Hours SLA</span>
                </div>
              </motion.div>

            </div>

            {/* Right Wing Fragments */}
            <div className="space-y-6 text-right max-w-[260px] ml-auto">
              
              {/* Fragment 6: Discover Verified Vendors */}
              <motion.div
                style={{ x: mr_x, opacity: mr_opacity }}
                className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-1 shadow-xl text-right"
              >
                <div className="flex items-center justify-end gap-1.5 text-[10px] font-mono text-rose-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#cf2e46]" />
                  <span>DET &amp; DED COMMERCIAL KYB</span>
                </div>
                <div className="text-sm font-black text-white">
                  Discover Verified Vendors
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Direct physical stock in Al Quoz, Sharjah Industrial &amp; Mussafah.
                </p>
              </motion.div>

              {/* Fragment 7: Real-Time Product Discovery */}
              <motion.div
                style={{ x: mri_x, opacity: mri_opacity }}
                className="hidden sm:block space-y-1 text-right"
              >
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-white/[0.05] border border-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>Real-Time Product Discovery</span>
                </div>
                <p className="text-[11px] font-mono text-slate-400">
                  Wholesale Copper • Cables • Conduits • DBs
                </p>
              </motion.div>

            </div>

          </div>

          {/* ROW 3: BOTTOM AREA */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            
            {/* Fragment 8: Bottom-Left - Built for Contractors */}
            <motion.div
              style={{ x: bl_x, y: bl_y, opacity: bl_opacity }}
              className="md:col-span-4 text-left space-y-1"
            >
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                [ENGINEERED FOR EPCs]
              </div>
              <div className="text-base sm:text-lg font-bold text-white tracking-tight">
                Built for Contractors &amp; Procurement Teams
              </div>
              <p className="text-xs text-slate-400">
                Transparent side-by-side matrices, digital POs, and 5% VAT invoicing.
              </p>
            </motion.div>

            {/* Fragment 9: Bottom Center - Save Cost. Save Time. Source Smarter. */}
            <motion.div
              style={{ y: bc_y, opacity: bc_opacity }}
              className="hidden md:block md:col-span-4 text-center mx-auto space-y-1.5"
            >
              <div className="text-sm sm:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#38bdf8] tracking-tight">
                “Save Cost. Save Time. Source Smarter.”
              </div>
              <div className="inline-flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-white/[0.03] border border-white/10 px-3 py-1 rounded-full">
                <span className="text-[#cf2e46] font-bold">-18.4%</span>
                <span>AVERAGE WHOLESALE SAVINGS</span>
              </div>
            </motion.div>

            {/* Fragment 10 & 11: Bottom-Right - From RFQ to Delivery & UAE Market */}
            <motion.div
              style={{ x: br_x, y: br_y, opacity: br_opacity }}
              className="hidden sm:block md:col-span-4 text-right ml-auto space-y-1.5"
            >
              <div className="text-base sm:text-lg font-black text-white tracking-tight">
                From RFQ to Delivery
              </div>
              <div className="text-xs font-mono text-slate-400">
                BOQ ➔ 5 Verified Bids ➔ Digital PO ➔ Site Delivery
              </div>
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                BUILT FOR THE UAE MARKET • 7 EMIRATES COVERAGE
              </div>
            </motion.div>

          </div>

        </div>

        {/* ========================================================= */}
        {/* CENTER 9:16 PORTRAIT HERO VISUAL (CONTINUOUS VIEWPORT EXPANSION) */}
        {/* ========================================================= */}
        <motion.div
          style={{
            scale: imageScale,
            borderRadius: imageBorderRadius
          }}
          className="relative z-10 w-[240px] sm:w-[280px] md:w-[320px] lg:w-[340px] aspect-[9/16] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] will-change-transform flex items-center justify-center bg-black"
        >
          {/* Subtle Outer Frame Border (Fades as scale approaches full bleed) */}
          <motion.div
            style={{ opacity: imageBorderOpacity }}
            className="absolute inset-0 pointer-events-none rounded-[inherit] border border-white/25 z-20 shadow-inner"
          />

          {/* Corner Precision Alignment Markers on Initial Card */}
          <motion.div
            style={{ opacity: imageBorderOpacity }}
            className="absolute top-2.5 left-2.5 text-[9px] font-mono text-white/70 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10 z-20"
          >
            [SS—9:16]
          </motion.div>
          <motion.div
            style={{ opacity: imageBorderOpacity }}
            className="absolute bottom-2.5 right-2.5 text-[9px] font-mono text-white/70 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10 z-20 flex items-center gap-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#cf2e46] animate-pulse" />
            <span>UAE-CORE</span>
          </motion.div>

          {/* High-Resolution Portrait Construction Landmark Visual */}
          <img
            src="/brand-assets/portrait-construction-visual.webp"
            alt="SupplySouq UAE Modern Construction and Infrastructure Platform"
            className="w-full h-full object-cover object-center filter contrast-[1.08] brightness-[0.95] select-none pointer-events-none"
            loading="eager"
          />

          {/* Subtle Atmospheric Gradient Overlay to preserve cinematic contrast */}
          <motion.div
            style={{ opacity: imageOverlayDim }}
            className="absolute inset-0 bg-black pointer-events-none z-10"
          />

          {/* Inner Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none z-10" />
        </motion.div>

        {/* ========================================================= */}
        {/* STAGE 4: IMMERSION REVEAL (FULL-BLEED MINIMAL TITLE) */}
        {/* ========================================================= */}
        <motion.div
          style={{
            opacity: finalCopyOpacity,
            y: finalCopyY
          }}
          className="absolute inset-0 pointer-events-none z-30 flex flex-col items-center justify-center text-center px-6 max-w-3xl mx-auto"
        >
          {/* Subtle Technical Header Tag */}
          <div className="inline-flex items-center gap-2 bg-black/70 border border-white/20 text-slate-200 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase backdrop-blur-xl shadow-2xl mb-6">
            <span className="w-2 h-2 rounded-full bg-[#cf2e46] animate-ping" />
            <span>SUPPLYSOUQ® DIGITAL PROCUREMENT INFRASTRUCTURE</span>
          </div>

          {/* Minimal Epic Headline */}
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)] leading-[1.05]">
            Construction Procurement,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#38bdf8]">
              Reimagined.
            </span>
          </h2>

          <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-300 max-w-xl font-normal leading-relaxed drop-shadow-md">
            One unified marketplace replacing fragmented phone calls, delayed quotes, and scattered PDFs with 24-hour guaranteed stockist pricing.
          </p>

          <div className="mt-8 flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="text-[#38bdf8]">SOURCE SMARTER</span>
            <span>•</span>
            <span>UAE WHOLESALE NETWORK</span>
            <span>•</span>
            <span className="text-rose-400">24H DISPATCH</span>
          </div>

          {/* Gentle scroll continue indicator */}
          <div className="mt-12 flex flex-col items-center gap-2 text-slate-400 font-mono text-[11px] tracking-widest uppercase">
            <span>Scroll to explore verified stockists</span>
            <div className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center p-1">
              <div className="w-1 h-2 rounded-full bg-[#38bdf8] animate-bounce" />
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
