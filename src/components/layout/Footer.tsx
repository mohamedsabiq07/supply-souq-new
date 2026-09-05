import React from 'react';
import { Layers, ShieldCheck, MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  setCurrentView: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-12 pb-8 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Col 1: Brand & UAE Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Supply<span className="text-brand-400">Souq</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The digital RFQ and multi-supplier quotation comparison network for the UAE construction and engineering sector. Streamlining procurement across Dubai, Sharjah, Abu Dhabi and the Northern Emirates.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium bg-emerald-950/50 p-2.5 rounded-lg border border-emerald-800/40 w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
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
                <button onClick={() => setCurrentView('categories')} className="hover:text-white transition-colors">
                  LV & MV Power Cables
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('categories')} className="hover:text-white transition-colors">
                  Switchgear, MCBs & DBs
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('categories')} className="hover:text-white transition-colors">
                  Cable Trays & Conduits
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('categories')} className="hover:text-white transition-colors">
                  Commercial LED Lighting
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('categories')} className="hover:text-white transition-colors">
                  Earthing & Lightning
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('categories')} className="hover:text-white transition-colors">
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
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>Dubai (Al Quoz, JAFZA, DIC)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>Sharjah (Industrial Areas 1–17, Rolla)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>Abu Dhabi (Mussafah, ICAD)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-amber-400" />
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
                <button onClick={() => setCurrentView('how-it-works')} className="hover:text-white transition-colors">
                  How RFQ Comparison Works
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('onboarding-guide')} className="hover:text-white transition-colors">
                  Onboarding SOP Guide
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('create-rfq')} className="hover:text-white transition-colors">
                  Post an RFQ
                </button>
              </li>
              <li className="text-[11px] text-slate-500 pt-2">
                5% UAE VAT Compliant Invoicing
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 SupplySouq FZCO. All rights reserved. UAE B2B Procurement Technology.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Terms of Procurement</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Supplier Code of Conduct</span>
            <span>•</span>
            <button
              onClick={() => setCurrentView('admin-login')}
              className="text-slate-500 hover:text-emerald-400 transition-colors flex items-center gap-1 font-semibold"
            >
              <span>🔒 Operator Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
