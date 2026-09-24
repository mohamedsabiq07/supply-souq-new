import React from 'react';
import { Layers, ShieldCheck, MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

interface FooterProps {
  setCurrentView: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView }) => {
  return (
    <footer className="bg-[#eceef1] dark:bg-[#050505] text-slate-600 dark:text-zinc-400 border-t border-slate-200/80 dark:border-white/[0.08] pt-14 pb-10 text-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Col 1: Brand & UAE Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="cursor-pointer space-y-2.5" onClick={() => setCurrentView('home')}>
              <BrandLogo variant="full" size="md" />
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-200/70 dark:bg-white/[0.06] text-[10px] font-bold text-slate-700 dark:text-zinc-300 border border-slate-300/60 dark:border-white/[0.08] w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>UAE B2B Procurement Marketplace</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed max-w-sm">
              The digital RFQ and multi-supplier quotation comparison network for the UAE construction and engineering sector. Streamlining procurement across Dubai, Sharjah, Abu Dhabi and the Northern Emirates.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-800 dark:text-zinc-200 font-medium bg-white dark:bg-white/[0.04] p-2.5 rounded-xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xs w-fit">
              <ShieldCheck className="w-4 h-4 text-[#cf2e46] shrink-0" />
              <span>100% UAE Trade License Verified Suppliers</span>
            </div>
          </div>

          {/* Col 2: Electrical Disciplines */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Electrical Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button onClick={() => setCurrentView('categories')} className="hover:text-[#cf2e46] dark:hover:text-rose-400 transition-colors cursor-pointer">
                  LV & MV Power Cables
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('categories')} className="hover:text-[#cf2e46] dark:hover:text-rose-400 transition-colors cursor-pointer">
                  Switchgear, MCBs & DBs
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('categories')} className="hover:text-[#cf2e46] dark:hover:text-rose-400 transition-colors cursor-pointer">
                  Cable Trays & Conduits
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('categories')} className="hover:text-[#cf2e46] dark:hover:text-rose-400 transition-colors cursor-pointer">
                  Commercial LED Lighting
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('categories')} className="hover:text-[#cf2e46] dark:hover:text-rose-400 transition-colors cursor-pointer">
                  Earthing & Lightning
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('categories')} className="hover:text-[#cf2e46] dark:hover:text-rose-400 transition-colors cursor-pointer">
                  Solar Equipment & UPS
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Emirates & Hubs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Coverage & Hubs
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#cf2e46]" />
                <span>Dubai (Al Quoz, JAFZA, DIC)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#cf2e46]" />
                <span>Sharjah (Industrial Areas 1–17, Rolla)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#cf2e46]" />
                <span>Abu Dhabi (Mussafah, ICAD)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#cf2e46]" />
                <span>Ajman & Northern Emirates</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Platform & Trust
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button onClick={() => setCurrentView('how-it-works')} className="hover:text-[#cf2e46] dark:hover:text-rose-400 transition-colors cursor-pointer">
                  How RFQ Comparison Works
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('onboarding-guide')} className="hover:text-[#cf2e46] dark:hover:text-rose-400 transition-colors cursor-pointer">
                  Onboarding SOP Guide
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('create-rfq')} className="hover:text-[#cf2e46] dark:hover:text-rose-400 transition-colors cursor-pointer">
                  Post an RFQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('pricing-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-[#cf2e46] dark:hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Transparent Pricing
                </button>
              </li>
              <li className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                5% UAE VAT Compliant Invoicing
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-200/80 dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-zinc-400">
          <p>© 2026 ProcureSouq FZCO. All rights reserved. UAE B2B Procurement Technology.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer">Terms of Procurement</span>
            <span>•</span>
            <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer">Supplier Code of Conduct</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
