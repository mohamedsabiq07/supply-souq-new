import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ShieldCheck, Clock, Mail, Phone, MapPin, Building2, Store } from 'lucide-react';

interface NeidenFooterProps {
  onNavigate: (view: string) => void;
}

export const NeidenFooter: React.FC<NeidenFooterProps> = ({ onNavigate }) => {
  const [dubaiTime, setDubaiTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Dubai',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        });
        setDubaiTime(timeStr);
      } catch (e) {
        setDubaiTime('10:30 AM GST');
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="bg-[#020504] text-white border-t border-white/10 pt-20 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Col 1: Brand Philosophy */}
          <div className="md:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>[ SS® ‒ CONTACTS & DESK / 対話と連絡 ]</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white leading-tight">
              UAE Construction Procurement, Built Around Absolute Clarity.
            </h3>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              Whether you need 500 meters of certified 33kV XLPE cable dispatched to Dubai South or an entire distribution board assembly quoted in 24 hours, our verified network delivers.
            </p>

            {/* Live Clock Capsule */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">Dubai Local Time:</span>
              <span className="font-bold text-emerald-400">{dubaiTime || '10:30 AM GST'}</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 space-y-3 font-mono text-xs">
            <span className="text-slate-500 uppercase tracking-widest text-[10px] block font-bold">
              Marketplace Portals
            </span>
            <ul className="space-y-2.5 text-slate-300">
              <li>
                <button
                  onClick={() => onNavigate('categories')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Material Categories (12 Sectors)</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('suppliers')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Verified UAE Stockists Directory</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('create-rfq')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Post BOQ / Request Quotation</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>How It Works & Fast 5 SLA</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('invoice-audit')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Wholesale Invoice Price Auditor</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct UAE Desk */}
          <div className="md:col-span-4 space-y-4 font-mono text-xs">
            <span className="text-slate-500 uppercase tracking-widest text-[10px] block font-bold">
              Operations & Logistics Hub
            </span>

            <div className="space-y-2.5 text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Al Quoz Industrial Area 3 & Bay Square Building 7, Business Bay, Dubai, UAE</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:procurement@supplysouq.ae" className="hover:text-white transition-colors">
                  procurement@supplysouq.ae
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="https://wa.me/971504928812" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">
                  +971 50 492 8812 (WhatsApp Desk)
                </a>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-500">
              Operating Hours: Mon–Sat: 08:00 – 19:00 GST • Emergency site deliveries 24/7
            </div>
          </div>
        </div>

        {/* Giant Typographic Display Branding (Neiden Iconic Style) */}
        <div className="py-12 select-none overflow-hidden text-center">
          <h2 className="text-[14vw] font-display font-black tracking-tighter text-white/[0.04] leading-none uppercase hover:text-white/[0.07] transition-colors duration-500">
            SUPPLYSOUQ
          </h2>
        </div>

        {/* Bottom Legal & Meta Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-3">
            <span>© 2026 SupplySouq Technologies FZ-LLC</span>
            <span>•</span>
            <span className="text-emerald-400">DET Licensed Network</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('home')} className="hover:text-slate-300 transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('home')} className="hover:text-slate-300 transition-colors cursor-pointer">
              Terms of Procurement
            </button>
            <span>•</span>
            <span className="text-slate-600">EST. 2026 • DUBAI, UAE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
