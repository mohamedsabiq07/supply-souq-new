import React from 'react';
import { Layers, ShieldCheck, MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  setCurrentView: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView }) => {
  return (
    <footer className="bg-slate-50 text-slate-600 border-t border-slate-200 pt-14 pb-10 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Col 1: Brand & UAE Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#cf2e46] shadow-2xs">
                <Layers className="w-5 h-5 text-[#cf2e46]" />
              </div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                Supply<span className="text-[#cf2e46]">Souq</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              The digital RFQ and multi-supplier quotation comparison network for the UAE construction and engineering sector. Streamlining procurement across Dubai, Sharjah, Abu Dhabi and the Northern Emirates.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-700 font-medium bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs w-fit">
              <ShieldCheck className="w-4 h-4 text-[#cf2e46] shrink-0" />
              <span>100% UAE Trade License Verified Suppliers</span>
            </div>
          </div>

          {/* Col 2: Electrical Disciplines */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Electrical Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button onClick={() => setCurrentView('categories')} className="hover:text-[#cf2e46] transition-colors">
                  LV & MV Power Cables
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('categories')} className="hover:text-[#cf2e46] transition-colors">
                  Switchgear, MCBs & DBs
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('categories')} className="hover:text-[#cf2e46] transition-colors">
                  Cable Trays & Conduits
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('categories')} className="hover:text-[#cf2e46] transition-colors">
                  Commercial LED Lighting
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('categories')} className="hover:text-[#cf2e46] transition-colors">
                  Earthing & Lightning
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('categories')} className="hover:text-[#cf2e46] transition-colors">
                  Solar Equipment & UPS
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Emirates & Hubs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Coverage & Hubs
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
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
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Platform & Trust
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button onClick={() => setCurrentView('how-it-works')} className="hover:text-[#cf2e46] transition-colors">
                  How RFQ Comparison Works
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('onboarding-guide')} className="hover:text-[#cf2e46] transition-colors">
                  Onboarding SOP Guide
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('create-rfq')} className="hover:text-[#cf2e46] transition-colors">
                  Post an RFQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('pricing-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-[#cf2e46] transition-colors"
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

        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 SupplySouq FZCO. All rights reserved. UAE B2B Procurement Technology.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-900 cursor-pointer">Terms of Procurement</span>
            <span>•</span>
            <span className="hover:text-slate-900 cursor-pointer">Supplier Code of Conduct</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
