import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Building2,
  Zap,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  FileCheck2,
  Activity,
  TrendingDown,
  Layers
} from 'lucide-react';

interface CinematicScrollSectionProps {
  setCurrentView?: (view: string) => void;
}

export const CinematicScrollSection: React.FC<CinematicScrollSectionProps> = ({ setCurrentView }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-[#cf2e46] text-xs font-bold uppercase tracking-widest mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Procurement Intelligence
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
          UAE B2B Construction Marketplace
        </h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          The next-generation digital clearinghouse connecting UAE EPC contractors directly to verified stockists.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
        
        {/* Large Feature 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:col-span-2 row-span-1 rounded-3xl bg-white border border-slate-200 shadow-sm p-8 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-rose-50 to-transparent rounded-bl-full -z-0 opacity-50" />
          <div className="relative z-10">
            <div className="w-12 h-12 bg-rose-100 text-[#cf2e46] rounded-2xl flex items-center justify-center mb-6">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Upload BOQ. Receive Competitive Quotes.</h3>
            <p className="text-slate-500 max-w-md">
              Standardized line items mapped intelligently. Compare multiple suppliers side-by-side with mill test sheets included.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#cf2e46] animate-pulse" /> 5 CAPPED BIDS
            </span>
            <span className="text-xs text-slate-400 font-mono">BS 5467 // IEC 60502-1</span>
          </div>
        </motion.div>

        {/* Feature 2: Time Savings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-sm p-8 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow"
        >
          <div className="relative z-10">
            <div className="w-10 h-10 bg-white/10 text-sky-400 rounded-xl flex items-center justify-center mb-6">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold mb-2">Reduce Procurement Time</h3>
            <p className="text-slate-400 text-sm">
              Drastically cut down your sourcing cycle.
            </p>
          </div>
          <div className="relative z-10 pt-4 border-t border-white/10">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Turnaround</div>
                <div className="font-mono text-sky-400 text-sm">96h ➔ 24h SLA</div>
              </div>
              <div className="text-emerald-400 font-black text-lg">75% Faster</div>
            </div>
          </div>
        </motion.div>

        {/* Feature 3: Verified Vendors */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl bg-white border border-slate-200 shadow-sm p-8 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow"
        >
          <div className="relative z-10">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Discover Verified Vendors</h3>
            <p className="text-slate-500 text-sm">
              Direct physical stock in Al Quoz, Sharjah Industrial & Mussafah.
            </p>
          </div>
          <div className="relative z-10">
            <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mb-2">DET & DED Commercial KYB</div>
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] px-2 py-1 bg-slate-100 text-slate-600 rounded-md">Copper</span>
              <span className="text-[10px] px-2 py-1 bg-slate-100 text-slate-600 rounded-md">Cables</span>
              <span className="text-[10px] px-2 py-1 bg-slate-100 text-slate-600 rounded-md">Conduits</span>
            </div>
          </div>
        </motion.div>

        {/* Large Feature 4 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="md:col-span-2 row-span-1 rounded-3xl bg-white border border-slate-200 shadow-sm p-8 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow"
        >
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-50 via-white to-white -z-0" />
          <div className="relative z-10 flex flex-col md:flex-row gap-8 justify-between h-full">
            <div className="flex-1">
              <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Built for Contractors & Procurement Teams</h3>
              <p className="text-slate-500 max-w-sm mb-6">
                Engineered for EPCs. Transparent side-by-side matrices, digital POs, and 5% VAT invoicing.
              </p>
              <button 
                onClick={() => setCurrentView?.('create-rfq')}
                className="inline-flex items-center gap-2 text-[#cf2e46] font-bold hover:gap-3 transition-all cursor-pointer"
              >
                Start Sourcing Now <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 flex flex-col justify-end bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#cf2e46] text-white flex items-center justify-center">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase">Average Wholesale Savings</div>
                  <div className="text-2xl font-black text-slate-900">-18.4%</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> BOQ Processed
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 5 Verified Bids
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Site Delivery
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
