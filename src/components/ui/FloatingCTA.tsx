import React from 'react';
import { motion } from 'framer-motion';
import { Plus, ArrowUpRight } from 'lucide-react';

interface FloatingCTAProps {
  onStartRFQ: () => void;
}

export const FloatingCTA: React.FC<FloatingCTAProps> = ({ onStartRFQ }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <button
        onClick={onStartRFQ}
        data-cursor-label="Start"
        className="group flex items-center gap-3 rounded-full bg-zinc-950 p-2 pl-4 text-white shadow-2xl border border-zinc-800 hover:border-[#e61937] hover:shadow-[0_0_30px_-5px_rgba(230,25,55,0.4)] transition-all duration-300 cursor-pointer"
      >
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#e61937] font-bold leading-none">
            Fast 5 SLA
          </span>
          <span className="text-xs font-display font-black tracking-tight text-white group-hover:text-zinc-100 mt-0.5">
            Start an RFQ
          </span>
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e61937] text-white transition-transform duration-300 group-hover:rotate-90">
          <Plus className="h-4 w-4 stroke-[2.5]" />
        </div>
      </button>
    </motion.div>
  );
};
