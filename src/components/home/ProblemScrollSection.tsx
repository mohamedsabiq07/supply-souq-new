import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  RotateCcw
} from 'lucide-react';
import { AnimatedH3 } from '../ui/AnimatedHeading';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasEnded, setHasEnded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  // Play video once on load
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Handled gracefully if browser requires user gesture
        setIsPlaying(false);
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
      if (hasEnded) {
        handleReplay();
        return;
      }
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleVideoEnded = () => {
    setHasEnded(true);
    setIsPlaying(false);
  };

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        setHasEnded(false);
      }).catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = pos * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    if (hasEnded) {
      setHasEnded(false);
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <section className="relative bg-[#f4f4f6] dark:bg-black border-b border-slate-200/80 dark:border-white/[0.08] pt-20 sm:pt-28 pb-32">
      {/* Background Architectural Column Guide Lines (Neiden Studio Aesthetic) */}
      <div className="absolute inset-0 pointer-events-none max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between z-0">
        <div className="w-px h-full bg-slate-300/35 dark:bg-white/[0.04]" />
        <div className="w-px h-full bg-slate-300/20 dark:bg-white/[0.02] hidden md:block" />
        <div className="w-px h-full bg-slate-300/20 dark:bg-white/[0.02] hidden lg:block" />
        <div className="w-px h-full bg-slate-300/35 dark:bg-white/[0.04]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ========================================================================= */}
        {/* 1. ENLARGED HEADLINE & SUBTITLE HERO (Clear, Prominent, Never Overlapped) */}
        {/* ========================================================================= */}
        <div className="min-h-[50vh] flex flex-col justify-center items-center text-center max-w-4xl mx-auto mb-16 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Challenge Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-white dark:bg-white/[0.04] text-[#cf2e46] border border-slate-200/80 dark:border-white/[0.08] shadow-2xs">
              <AlertTriangle className="w-4 h-4 text-[#cf2e46]" />
              <span>[SS®—CHALLENGE] THE TRADITIONAL PROCUREMENT BOTTLENECK</span>
            </div>

            {/* ENLARGED HEADLINE WITH PER-LETTER BLUR/SLIDE/FADE ANIMATION */}
            <div className="flex justify-center">
              <AnimatedH3
                text="Material procurement shouldn't take days of follow-ups."
                className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.08] text-center max-w-4xl"
                blurAmount={12}
                slideDistance={22}
                staggerDelay={0.02}
                duration={0.45}
              />
            </div>

            {/* ENLARGED SUBTITLE */}
            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-zinc-400 leading-relaxed font-normal max-w-3xl mx-auto">
              Manual phone calls, scattered WhatsApp messages, and waiting days for quotes — procurement teams spend hours chasing individual suppliers instead of focusing on project execution.
            </p>

            {/* Downward Cue */}
            <div className="pt-4 flex flex-col items-center gap-2 text-slate-400">
              <span className="text-[11px] font-mono tracking-widest uppercase font-semibold text-slate-500 dark:text-zinc-400">
                Explore the 4 Bottlenecks Below
              </span>
              <div className="w-7 h-7 rounded-full border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] flex items-center justify-center text-[#cf2e46] shadow-2xs">
                <ArrowDown className="w-3.5 h-3.5" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* ========================================================================= */}
        {/* 2. SPLIT STORYTELLING: LEFT SCROLLING CARDS + RIGHT STICKY VIDEO          */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative">
          
          {/* ----------------------------------------------------------------------- */}
          {/* LEFT COLUMN: 4 CARDS SCROLLING ONE BY ONE                               */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-5 space-y-16 sm:space-y-24 py-4">
            
            {/* Step Progress Tracker */}
            <div className="sticky top-20 z-20 bg-[#f4f4f6]/95 dark:bg-black/95 backdrop-blur-md py-3 border-b border-slate-200/80 dark:border-white/[0.08] mb-6">
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-slate-500 dark:text-zinc-400 uppercase font-bold">PROCUREMENT BOTTLENECK</span>
                <span className="font-bold text-[#cf2e46]">STEP 0{activeStep + 1} / 04</span>
              </div>
              <div className="flex gap-2">
                {PROBLEM_ITEMS.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      idx === activeStep ? 'bg-[#cf2e46]' : idx < activeStep ? 'bg-slate-800 dark:bg-zinc-400' : 'bg-slate-200 dark:bg-white/[0.08]'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* The 4 Cards */}
            {PROBLEM_ITEMS.map((item, idx) => {
              const IconComponent = item.icon;
              const isActive = activeStep === idx;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0.4, scale: 0.96, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  onViewportEnter={() => setActiveStep(idx)}
                  viewport={{ amount: 0.6, margin: "-10% 0px -10% 0px" }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className={`bg-white dark:bg-gradient-to-b dark:from-[#111114] dark:to-[#0c0c0e] rounded-3xl p-7 sm:p-9 shadow-lg relative overflow-hidden transition-all duration-300 ${
                    isActive
                      ? 'border-2 border-[#cf2e46] shadow-2xl scale-[1.02]'
                      : 'border border-slate-200/80 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.18]'
                  }`}
                >
                  {/* Top Red Accent Bar for Active Card */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1.5 transition-colors duration-300 ${
                      isActive ? 'bg-[#cf2e46]' : 'bg-slate-200/80 dark:bg-white/[0.06]'
                    }`}
                  />

                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black transition-colors ${
                        isActive ? 'bg-rose-50 dark:bg-rose-950/50 text-[#cf2e46]' : 'bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-zinc-300'
                      }`}
                    >
                      <IconComponent className="w-7 h-7" />
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="font-mono font-bold text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-white/[0.04] text-slate-800 dark:text-zinc-200 border border-slate-200/80 dark:border-white/[0.08]">
                        STEP {item.step} / 04
                      </span>
                      <span className="text-[11px] font-mono text-[#cf2e46] font-bold mt-1 tracking-wider uppercase">
                        {item.severity}
                      </span>
                    </div>
                  </div>

                  {/* Title with letter-by-letter blur reduction animation */}
                  <AnimatedH3
                    text={item.title}
                    className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight mb-3"
                    colorVariant={isActive ? 'crimson' : 'default'}
                    blurAmount={10}
                    slideDistance={16}
                    staggerDelay={0.025}
                    duration={0.4}
                  />

                  {/* Description */}
                  <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed font-normal mb-6">
                    {item.description}
                  </p>

                  {/* Impact Tag */}
                  <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#cf2e46] shrink-0 animate-pulse" />
                    <div className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                      {item.impactTag}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* RIGHT COLUMN: PERSISTENT STICKY VIDEO                                   */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-7 lg:sticky lg:top-24 self-start py-4">
            <div className="relative rounded-3xl border-2 border-slate-200/80 dark:border-white/[0.08] bg-slate-950 shadow-2xl overflow-hidden aspect-[16/10] sm:aspect-[16/9] group">
              
              {/* Video Element - Plays only once, with full customer replay options */}
              <video
                ref={videoRef}
                src="/brand-assets/Untitled%20video%20(2).mp4"
                poster="/brand-assets/supplysouq-concept-visual.jpg"
                autoPlay
                muted={isMuted}
                playsInline
                onEnded={handleVideoEnded}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                className="w-full h-full object-cover"
              />

              {/* Ambient High-Tech Scanline Overlay */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-25" />

              {/* End of Video Customer Options Overlay */}
              {hasEnded && (
                <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                  <div className="w-14 h-14 rounded-2xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-[#cf2e46] mb-3 shadow-xl">
                    <RotateCcw className="w-7 h-7 text-[#cf2e46] animate-spin-slow" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-white tracking-tight mb-1.5">
                    Demo Completed
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-sm mb-5 leading-relaxed font-normal">
                    You watched the full procurement workflow demo. Choose an option below to replay or unmute audio.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={handleReplay}
                      className="px-6 py-3 rounded-full bg-[#cf2e46] hover:bg-[#b91c33] text-white text-xs font-black tracking-wide uppercase transition-all shadow-lg flex items-center gap-2 hover:scale-105 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Replay Video</span>
                    </button>
                    <button
                      onClick={toggleAudio}
                      className="px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                      <span>{isMuted ? 'Unmute Audio' : 'Audio On'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Corner Crosshair Accents */}
              <div className="absolute top-3 left-3 text-white/50 font-mono text-xs select-none pointer-events-none">+</div>
              <div className="absolute top-3 right-3 text-white/50 font-mono text-xs select-none pointer-events-none">+</div>
              <div className="absolute bottom-3 left-3 text-white/50 font-mono text-xs select-none pointer-events-none">+</div>
              <div className="absolute bottom-3 right-3 text-white/50 font-mono text-xs select-none pointer-events-none">+</div>

              {/* Top Video Telemetry Bar */}
              <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between text-white z-20">
                <div className="flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${hasEnded ? 'bg-amber-400' : 'bg-red-500 animate-ping'}`} />
                  <span className="text-[11px] font-mono font-black tracking-wider uppercase text-white drop-shadow">
                    {hasEnded ? 'PLAYBACK FINISHED // REPLAY READY' : 'LIVE RFQ WORKFLOW • UAE PLATFORM'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleAudio}
                    className="p-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 transition-colors cursor-pointer"
                    title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                  <button
                    onClick={hasEnded ? handleReplay : togglePlayback}
                    className="p-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 transition-colors cursor-pointer"
                    title={hasEnded ? 'Replay Video' : isPlaying ? 'Pause Video' : 'Play Video'}
                  >
                    {hasEnded ? (
                      <RotateCcw className="w-4 h-4 text-[#cf2e46]" />
                    ) : isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 text-emerald-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Interactive Video Progress Scrubber Bar */}
              <div
                onClick={handleSeek}
                className="absolute bottom-[68px] left-0 right-0 h-2 bg-white/15 hover:bg-white/25 cursor-pointer z-20 transition-all group/seek"
                title="Click timeline to seek"
              >
                <div
                  className="bg-[#cf2e46] h-full relative transition-[width] duration-100"
                  style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md" />
                </div>
              </div>

              {/* Bottom Video Telemetry Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end justify-between text-white z-20">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-600/80 text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                    ● ACTIVE BOTTLENECK: {PROBLEM_ITEMS[activeStep].title}
                  </div>
                  <p className="text-[11px] font-mono text-slate-300 drop-shadow">
                    {PROBLEM_ITEMS[activeStep].telemetryNote}
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

      </div>
    </section>
  );
};
