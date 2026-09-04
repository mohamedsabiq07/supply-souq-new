import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ELECTRICAL_CATEGORIES = [
  { text: 'Ducab LV & MV Power Cables', tag: 'DEWA / SEWA Approved', color: 'from-cyan-400 via-sky-200 to-blue-400' },
  { text: 'Schneider 3-Phase Switchgear & DBs', tag: 'Form 2/4 Panels', color: 'from-amber-300 via-yellow-100 to-amber-500' },
  { text: 'Decoduct Conduits & GI Cable Trays', tag: 'Class 4 GI & PVC', color: 'from-emerald-400 via-teal-200 to-cyan-400' },
  { text: 'Furse Earthing & Lightning Systems', tag: 'Bare Copper & Rods', color: 'from-orange-400 via-amber-200 to-yellow-400' },
  { text: 'Philips & Osram Commercial LED Panels', tag: '60x60 Recessed / IP65', color: 'from-violet-400 via-purple-200 to-pink-400' }
];

export const KineticHeadline: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ELECTRICAL_CATEGORIES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const currentItem = ELECTRICAL_CATEGORIES[currentIndex];

  return (
    <div className="relative inline-flex flex-col items-center justify-center min-h-[4.5rem] sm:min-h-[5.5rem] w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.text}
          initial={{ opacity: 0, y: 35, filter: 'blur(10px)', scale: 0.96 }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
          exit={{ opacity: 0, y: -35, filter: 'blur(10px)', scale: 0.96 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <span
            className={`block text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r ${currentItem.color} drop-shadow-[0_0_25px_rgba(56,189,248,0.25)]`}
          >
            {currentItem.text}
          </span>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.35 }}
            className="inline-flex items-center gap-1.5 mt-2 bg-slate-800/80 border border-slate-700 text-slate-300 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-semibold"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>Standard: {currentItem.tag}</span>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
