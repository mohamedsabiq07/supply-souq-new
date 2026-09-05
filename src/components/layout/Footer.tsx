import React from 'react';
import { Layers, ShieldCheck, MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  setCurrentView: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView }) => {
  return (
    <footer className="bg-[#020f0c] text-slate-400 border-t border-[#00ffae]/15 pt-14 pb-10 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Col 1: Brand & UAE Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00ffae]/20 to-[#002116] border border-[#00ffae]/40 flex items-center justify-center text-[#00ffae] shadow-glow-mint">
                <Layers className="w-5 h-5 text-[#00ffae]" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Supply<span className="text-[#00ffae]">Souq</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The digital RFQ and multi-supplier quotation comparison network for the UAE construction and engineering sector. Streamlining procurement across Dubai, Sharjah, Abu Dhabi and the Northern Emirates.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#a4ffe2] font-medium bg-[#002116cc] p-2.5 rounded-xl border border-[#00ffae]/25 w-fit">
              <ShieldCheck className="w-4 h-4 text-[#00ffae] shrink-0" />
              <span>100% UAE Trade License Verified Suppliers</span>
            </div>
          </div>

          {/* Col 2: Electrical Disciplines */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Electrical Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setCurrentView('categories')} className="hover:text-[#00ffae] transition-colors">
                  LV & MV Power Cables
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('categories')} className="hover:text-[#00ffae] transition-colors">
                  Switchgear, MCBs & DBs
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('categories')} className="hover:text-[#00ffae] transition-colors">
                  Cable Trays & Conduits
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('categories')} className="hover:text-[#00ffae] transition-colors">
                  Commercial LED Lighting
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('categories')} className="hover:text-[#00ffae] transition-colors">
                  Earthing & Lightning
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('categories')} className="hover:text-[#00ffae] transition-colors">
                  Solar Equipment & UPS
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Emirates & Hubs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Coverage & Hubs
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#00ffae]" />
                <span>Dubai (Al Quoz, JAFZA, DIC)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#00ffae]" />
                <span>Sharjah (Industrial Areas 1–17, Rolla)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#00ffae]" />
                <span>Abu Dhabi (Mussafah, ICAD)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#00ffae]" />
                <span>Ajman & Northern Emirates</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Platform & Trust
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setCurrentView('how-it-works')} className="hover:text-[#00ffae] transition-colors">
                  How RFQ Comparison Works
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('onboarding-guide')} className="hover:text-[#00ffae] transition-colors">
                  Onboarding SOP Guide
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('create-rfq')} className="hover:text-[#00ffae] transition-colors">
                  Post an RFQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('pricing-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-[#00ffae] transition-colors"
                >
                  Transparent Pricing
                </button>
              </li>
              <li className="text-[11px] text-slate-500 pt-1">
                5% UAE VAT Compliant Invoicing
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 SupplySouq FZCO. All rights reserved. UAE B2B Procurement Technology.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Terms of Procurement</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Supplier Code of Conduct</span>
            <span>•</span>
            <button
              onClick={() => setCurrentView('admin-login')}
              className="text-slate-400 hover:text-[#00ffae] transition-colors flex items-center gap-1 font-semibold"
            >
              <span>🔒 Operator Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
