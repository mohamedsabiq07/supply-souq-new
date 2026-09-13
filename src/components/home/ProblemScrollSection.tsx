import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  PhoneOff,
  Clock,
  AlertTriangle,
  FileSpreadsheet,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ArrowDown,
  CheckCircle2,
  Flame,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ProblemCardData {
  id: number;
  step: string;
  title: string;
  description: string;
  impactTag: string;
  icon: React.ComponentType<{ className?: string }>;
  telemetryNote: string;
  severity: string;
}

const PROBLEM_ITEMS: ProblemCardData[] = [
  {
    id: 1,
    step: '01',
    title: 'Manual Follow-Ups',
    description:
      'Contacting multiple suppliers individually just to check stock availability, specifications, and delivery schedules.',
    impactTag: '~14 phone calls & WhatsApp chats per quote',
    icon: PhoneOff,
    telemetryNote: 'HIGH LATENCY DETECTED • INDIVIDUAL CHANNELS UNORGANIZED',
    severity: 'CRITICAL BOTTLENECK'
  },
  {
    id: 2,
    step: '02',
    title: 'Delayed Quotations',
    description:
      'Waiting days for responses and price updates while site work pauses and project deadlines approach.',
    impactTag: '3–5 days average response delay',
    icon: Clock,
    telemetryNote: 'PROJECT STALL RISK • IDLE SITE CREWS • PRICE EXPIRY',
    severity: 'TIME SENSITIVE'
  },
  {
    id: 3,
    step: '03',
    title: 'Inconsistent Specifications',
    description:
      'Dealing with mismatched product standards, unverified compliance, or missing technical data sheets.',
    impactTag: 'Risk of consultant / DEWA inspection rejection',
    icon: AlertTriangle,
    telemetryNote: 'SPEC DRIFT • UNVERIFIED CERTIFICATIONS • REWORK RISK',
    severity: 'COMPLIANCE RISK'
  },
  {
    id: 4,
    step: '04',
    title: 'Scattered Comparisons',
    description:
      'Juggling dozens of different PDF quotes across emails and chats with no easy way to compare rates side-by-side.',
    impactTag: 'Fragmented line items & untracked price variances',
    icon: FileSpreadsheet,
    telemetryNote: 'MANUAL DATA ENTRY • 18% HIDDEN SURCHARGES UNNOTICED',
    severity: 'COST LEAKAGE'
  }
];

export const ProblemScrollSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Measure scroll progress through the extended track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Calculate the active card index based on scroll position
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      // Phase 1 (0.00 - 0.20): Enlarged headline intro
      // Phase 2 (0.20 - 1.00): 4 Cards sequential progression
      if (latest < 0.20) {
        setActiveCardIndex(0);
      } else if (latest < 0.40) {
        setActiveCardIndex(0);
      } else if (latest < 0.60) {
        setActiveCardIndex(1);
      } else if (latest < 0.80) {
        setActiveCardIndex(2);
      } else {
        setActiveCardIndex(3);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  // Ensure video plays continuously
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may be restricted if unmuted; handled gracefully
      });
    }
  }, []);

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const togglePlayback = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // --- Transform Calculations ---

  // Phase 1: Enlarged Headline Screen transforms into docked section title
  // At 0.0 - 0.14: Fully enlarged in center
  // At 0.14 - 0.22: Fades gracefully and hands off to split screen
  const heroOpacity = useTransform(scrollYProgress, [0.0, 0.14, 0.22], [1, 1, 0]);
  const heroScale = useTransform(scrollYProgress, [0.0, 0.16], [1.0, 0.92]);
  const heroY = useTransform(scrollYProgress, [0.0, 0.18], ['0%', '-20%']);
  const heroPointerEvents = useTransform(scrollYProgress, (v) => (v < 0.18 ? 'auto' : 'none'));

  // Phase 2: Split screen (persistent video + sequential cards)
  const splitOpacity = useTransform(scrollYProgress, [0.15, 0.22, 1.0], [0, 1, 1]);
  const splitY = useTransform(scrollYProgress, [0.15, 0.22], ['40px', '0px']);

  return (
    <section
      ref={containerRef}
      className="relative bg-[#f4f4f6] border-b border-slate-300/80"
      style={{ height: '420vh' }}
    >
      {/* Background Architectural Column Guide Lines (Neiden Studio Aesthetic) */}
      <div className="absolute inset-0 pointer-events-none max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between z-0">
        <div className="w-px h-full bg-slate-300/35" />
        <div className="w-px h-full bg-slate-300/20 hidden md:block" />
        <div className="w-px h-full bg-slate-300/20 hidden lg:block" />
        <div className="w-px h-full bg-slate-300/35" />
      </div>

      {/* Sticky Full-Viewport Storytelling Canvas */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center px-4 sm:px-6 lg:px-8 z-10">
        
        {/* ========================================================================= */}
        {/* PHASE 1: ENLARGED HEADLINE & SUBTITLE HERO STAGE (Visible at initial scroll) */}
        {/* ========================================================================= */}
        <motion.div
          style={{
            opacity: heroOpacity,
            scale: heroScale,
            y: heroY,
            pointerEvents: heroPointerEvents as any
          }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 z-30"
        >
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Category Tag */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-white text-[#cf2e46] border border-slate-300 shadow-sm">
              <AlertTriangle className="w-4 h-4 text-[#cf2e46]" />
              <span>[SS®—CHALLENGE] THE TRADITIONAL PROCUREMENT BOTTLENECK</span>
            </div>

            {/* ENLARGED HEADLINE */}
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-950 tracking-tight leading-[1.05]">
              Material procurement shouldn't take days of follow-ups.
            </h2>

            {/* ENLARGED SUBTITLE */}
            <p className="text-base sm:text-xl text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              Manual phone calls, scattered WhatsApp messages, and waiting days for quotes — procurement teams spend hours chasing individual suppliers instead of focusing on project execution.
            </p>

            {/* Scroll Cue */}
            <div className="pt-6 flex flex-col items-center gap-2 text-slate-400">
              <span className="text-[11px] font-mono tracking-widest uppercase font-semibold text-slate-500">
                Scroll down to see bottlenecks
              </span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                className="w-7 h-7 rounded-full border border-slate-300 bg-white flex items-center justify-center text-slate-600 shadow-2xs"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* PHASE 2: SPLIT SCREEN (STICKY VIDEO RIGHT + ONE-BY-ONE CARDS LEFT)        */}
        {/* ========================================================================= */}
        <motion.div
          style={{
            opacity: splitOpacity,
            y: splitY
          }}
          className="w-full max-w-7xl mx-auto relative flex flex-col justify-center h-full max-h-[92vh] py-4"
        >
          {/* Top Bar Header */}
          <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-slate-300/70 mb-4 sm:mb-6">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#cf2e46] animate-pulse" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-950 tracking-tight">
                Material procurement shouldn't take days of follow-ups.
              </h3>
            </div>
            <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-slate-500">
              <span className="font-bold text-slate-900">STAGE {PROBLEM_ITEMS[activeCardIndex].step}</span>
              <span>/ 04</span>
            </div>
          </div>

          {/* Two-Column Grid: Left (Sequential Cards) | Right (Persistent Video) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            
            {/* ------------------------------------------------------------------- */}
            {/* LEFT COLUMN: CARDS SCROLLING ONE BY ONE                             */}
            {/* ------------------------------------------------------------------- */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
              
              {/* Stepper Progress Indicator */}
              <div className="flex items-center gap-2 mb-2">
                {PROBLEM_ITEMS.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex-1 h-1.5 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: idx === activeCardIndex ? '#cf2e46' : idx < activeCardIndex ? '#1e293b' : '#cbd5e1'
                    }}
                  />
                ))}
              </div>

              {/* Sequential Card Presentation with Pop-Up Transition */}
              <div className="relative min-h-[290px] sm:min-h-[320px] flex items-center">
                <AnimatePresence mode="wait">
                  {PROBLEM_ITEMS.map((item, idx) => {
                    if (idx !== activeCardIndex) return null;

                    const IconComponent = item.icon;

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 32, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -28, scale: 0.96 }}
                        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full bg-white rounded-3xl border-2 border-slate-300/90 p-6 sm:p-8 shadow-xl relative overflow-hidden"
                      >
                        {/* Red Top Accent Bar */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#cf2e46]" />

                        {/* Card Header Row */}
                        <div className="flex items-start justify-between gap-4 mb-5">
                          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-[#cf2e46] flex items-center justify-center font-black shadow-xs">
                            <IconComponent className="w-7 h-7" />
                          </div>

                          <div className="flex flex-col items-end">
                            <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                              STEP {item.step} / 04
                            </span>
                            <span className="text-[10px] font-mono text-[#cf2e46] font-bold mt-1 tracking-wider uppercase">
                              {item.severity}
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h4 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
                          {item.title}
                        </h4>

                        {/* Description */}
                        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal mb-6">
                          {item.description}
                        </p>

                        {/* Metric / Bottleneck Impact Box */}
                        <div className="p-3.5 rounded-2xl bg-[#f4f4f6] border border-slate-200 flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#cf2e46] shrink-0" />
                          <div className="text-xs font-mono font-bold text-slate-800">
                            {item.impactTag}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Navigation Thumbnails / List of All 4 Steps */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                {PROBLEM_ITEMS.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveCardIndex(idx)}
                    className={`text-left p-2.5 rounded-xl border transition-all text-xs ${
                      idx === activeCardIndex
                        ? 'bg-white border-[#cf2e46] shadow-sm ring-1 ring-[#cf2e46]/20'
                        : 'bg-white/60 border-slate-200 hover:bg-white text-slate-500'
                    }`}
                  >
                    <div className="font-mono text-[10px] font-bold text-slate-400">
                      {item.step}
                    </div>
                    <div
                      className={`font-bold truncate text-[11px] ${
                        idx === activeCardIndex ? 'text-slate-900 font-extrabold' : 'text-slate-600'
                      }`}
                    >
                      {item.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ------------------------------------------------------------------- */}
            {/* RIGHT COLUMN: PERSISTENT VIDEO CONTAINER                            */}
            {/* ------------------------------------------------------------------- */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="relative rounded-3xl border-2 border-slate-300/90 bg-slate-950 shadow-2xl overflow-hidden aspect-[16/10] sm:aspect-[16/9] group">
                
                {/* HTML5 Video Element */}
                <video
                  ref={videoRef}
                  src="/brand-assets/Untitled%20video%20(2).mp4"
                  poster="/brand-assets/supplysouq-concept-visual.jpg"
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Ambient Scanline Overlay */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-25" />

                {/* Corner Crosshair Accents */}
                <div className="absolute top-3 left-3 text-white/50 font-mono text-xs select-none pointer-events-none">
                  +
                </div>
                <div className="absolute top-3 right-3 text-white/50 font-mono text-xs select-none pointer-events-none">
                  +
                </div>
                <div className="absolute bottom-3 left-3 text-white/50 font-mono text-xs select-none pointer-events-none">
                  +
                </div>
                <div className="absolute bottom-3 right-3 text-white/50 font-mono text-xs select-none pointer-events-none">
                  +
                </div>

                {/* Top Video Telemetry Bar */}
                <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between text-white z-20">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    <span className="text-[11px] font-mono font-black tracking-wider uppercase text-white drop-shadow">
                      LIVE RFQ STREAM • UAE PROCUREMENT NETWORK
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleAudio}
                      className="p-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 transition-colors"
                      title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                    <button
                      onClick={togglePlayback}
                      className="p-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 transition-colors"
                      title={isPlaying ? 'Pause Video' : 'Play Video'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
                    </button>
                  </div>
                </div>

                {/* Bottom Video Telemetry Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end justify-between text-white z-20">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-600/80 text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                      ● ACTIVE BOTTLENECK: {PROBLEM_ITEMS[activeCardIndex].title}
                    </div>
                    <p className="text-[11px] font-mono text-slate-300 drop-shadow">
                      {PROBLEM_ITEMS[activeCardIndex].telemetryNote}
                    </p>
                  </div>

                  <div className="text-right font-mono text-[11px] text-slate-400">
                    <span className="text-white font-bold">25.2048° N</span>, 55.2708° E
                  </div>
                </div>
              </div>

              {/* Sub-label under video */}
              <div className="mt-3 flex items-center justify-between text-xs font-mono text-slate-500 px-1">
                <span>[SUPPLYSOUQ® DIGITAL ECOSYSTEM]</span>
                <span className="text-[#cf2e46] font-bold">SOLVED VIA AUTOMATED 3-BID COMPARISON</span>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};
