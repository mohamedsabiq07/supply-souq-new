import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, Clock, MapPin, Mail, Phone, ShieldCheck, ArrowUpRight } from 'lucide-react';

interface EditorialContactProps {
  onStartRFQ?: () => void;
  onNavigate?: (view: string) => void;
}

export const EditorialContact: React.FC<EditorialContactProps> = ({ onStartRFQ, onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    category: 'Structural Steel & Beams',
    lotValue: 'AED 100K - AED 500K',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [timeDubai, setTimeDubai] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Dubai',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setTimeDubai(new Intl.DateTimeFormat('en-US', options).format(now));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      if (onStartRFQ) onStartRFQ();
    }, 1500);
  };

  return (
    <footer className="relative bg-[#09090b] text-white pt-28 pb-12 border-t border-zinc-800 overflow-hidden">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Contact Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 pb-8 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block w-2.5 h-2.5 bg-[#e61937]" />
              <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
                [SSQ-COMMUNICATION] • CONTRACTOR GATEWAY
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight leading-none text-white">
              START SOURCING. <br />
              <span className="text-[#e61937]">TALK TO OUR</span> TRADE DESK.
            </h2>
          </div>

          {/* Real-time Telemetry Status & Dubai Clock */}
          <div className="mt-6 lg:mt-0 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="p-3 bg-zinc-950 border border-zinc-800">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">DUBAI HEADQUARTERS [GST]</div>
              <div className="text-sm font-bold font-mono text-white flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#e61937]" />
                <span>{timeDubai || '12:00:00 PM'}</span>
              </div>
            </div>
            <div className="p-3 bg-zinc-950 border border-zinc-800">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">LOGISTICS DISPATCH STATUS</div>
              <div className="text-xs font-bold font-mono text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#e61937] animate-ping" />
                <span>ALL GCC GATES OPERATIONAL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
          {/* Left Column: Direct Coordinates & Guarantees */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 bg-[#121215] border border-zinc-800 relative">
              <h3 className="text-xl font-bold font-display text-white mb-4">
                Rapid Requisition Response Guarantee
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                All submitted RFQs are checked, standardized, and allocated to verified stockists in JAFZA, Musaffah, and DIC within 90 minutes.
              </p>

              <div className="space-y-4 pt-4 border-t border-zinc-800 text-xs font-mono">
                <div className="flex items-center gap-3 text-zinc-300">
                  <div className="w-8 h-8 bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#e61937]" />
                  </div>
                  <div>
                    <div className="text-zinc-500 text-[10px]">PHYSICAL DISPATCH FACILITY</div>
                    <div className="font-bold">JAFZA Logistics Hub, Gate 4, Dubai, UAE</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-zinc-300">
                  <div className="w-8 h-8 bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[#e61937]" />
                  </div>
                  <div>
                    <div className="text-zinc-500 text-[10px]">COMMODITIES & RFQ DESK</div>
                    <div className="font-bold">procure@supplysouq.com</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-zinc-300">
                  <div className="w-8 h-8 bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-[#e61937]" />
                  </div>
                  <div>
                    <div className="text-zinc-500 text-[10px]">WHATSAPP & HOTLINE 24/7</div>
                    <div className="font-bold">+971 4 881 9000 / +971 50 123 4567</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Escrow Badge */}
            <div className="p-6 bg-zinc-950 border border-zinc-800 flex items-center gap-4">
              <ShieldCheck className="w-8 h-8 text-[#e61937] shrink-0" />
              <div className="text-xs text-zinc-400">
                <span className="text-white font-bold block mb-0.5">Non-Disclosure & Trade Protection</span>
                Your project BOMs, client names, and site coordinates remain strictly confidential under our bilateral Master Supply Agreement.
              </div>
            </div>
          </div>

          {/* Right Column: High-Density Procurement Ingestion Form */}
          <div className="lg:col-span-7">
            <div 
              className="p-8 bg-[#121215] border border-zinc-800 relative"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)',
              }}
            >
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-16 text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-[#e61937] text-white mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(230,25,55,0.6)]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold font-display text-white">
                    Requisition Transmitted Successfully
                  </h3>
                  <p className="text-sm text-zinc-400 max-w-md mx-auto">
                    RFQ #SSQ-{Math.floor(1000 + Math.random() * 9000)} is now queued for algorithmic yard matching. Redirecting to your active procurement session...
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                    <span className="text-xs font-mono text-[#e61937] uppercase tracking-wider">
                      DIRECT INGESTION TERMINAL
                    </span>
                    <span className="text-xs font-mono text-zinc-500">
                      ENCRYPTED SSL 256-BIT
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase">
                        Contact Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Tariq Mansoor"
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#e61937] px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase">
                        Corporate Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="tariq@contracting.ae"
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#e61937] px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+971 50 000 0000"
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#e61937] px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase">
                        Company / EPC Firm *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g. Gulf Contracting Group"
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#e61937] px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase">
                        Primary Material Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#e61937] px-4 py-2.5 text-xs text-white focus:outline-none font-mono"
                      >
                        <option>Structural Steel & Beams</option>
                        <option>Piping, Valves & Flanges</option>
                        <option>Electrical & MEP Infrastructure</option>
                        <option>Civil & Pre-Cast Materials</option>
                        <option>Safety & Site Equipment</option>
                        <option>HVAC & Ductwork Assemblies</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase">
                        Estimated Lot Value
                      </label>
                      <select
                        value={formData.lotValue}
                        onChange={(e) => setFormData({ ...formData, lotValue: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#e61937] px-4 py-2.5 text-xs text-white focus:outline-none font-mono"
                      >
                        <option>AED 50K - AED 100K</option>
                        <option>AED 100K - AED 500K</option>
                        <option>AED 500K - AED 2M</option>
                        <option>AED 2M - AED 10M+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase">
                      Paste Specs, Line Items or Project Scope
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="e.g. Need 400 pcs Seamless Pipe ASTM A106 Gr. B 4-inch Sch 40, delivery to Khalifa Port Site within 7 days. MTC 3.1 mandatory."
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#e61937] p-4 text-xs text-white placeholder-zinc-600 focus:outline-none font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#e61937] hover:bg-[#ff1f3d] text-white font-mono font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(230,25,55,0.4)]"
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)',
                    }}
                  >
                    <Send className="w-4 h-4" />
                    <span>Transmit Sourcing Requisition</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Grand Editorial Navigation Footer */}
        <div className="pt-16 pb-12 border-t border-zinc-800 grid grid-cols-2 md:grid-cols-5 gap-8">
          <div>
            <div className="text-xs font-mono text-white font-bold uppercase tracking-wider mb-4">
              Categories
            </div>
            <ul className="space-y-2 text-xs text-zinc-400 font-mono">
              <li><button onClick={() => onNavigate?.('catalog')} className="hover:text-[#e61937] transition-colors">Structural Steel</button></li>
              <li><button onClick={() => onNavigate?.('catalog')} className="hover:text-[#e61937] transition-colors">Pipes & Valves</button></li>
              <li><button onClick={() => onNavigate?.('catalog')} className="hover:text-[#e61937] transition-colors">Cables & MEP</button></li>
              <li><button onClick={() => onNavigate?.('catalog')} className="hover:text-[#e61937] transition-colors">Civil & Concrete</button></li>
              <li><button onClick={() => onNavigate?.('catalog')} className="hover:text-[#e61937] transition-colors">Safety Systems</button></li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-mono text-white font-bold uppercase tracking-wider mb-4">
              Stockist Network
            </div>
            <ul className="space-y-2 text-xs text-zinc-400 font-mono">
              <li><span className="hover:text-white transition-colors cursor-pointer">JAFZA Logistics Hub</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">DIC Industrial Depot</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Musaffah ICAD Center</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Dammam 2nd City Hub</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Sohar Freezone Gate</span></li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-mono text-white font-bold uppercase tracking-wider mb-4">
              Platform & Tools
            </div>
            <ul className="space-y-2 text-xs text-zinc-400 font-mono">
              <li><button onClick={onStartRFQ} className="hover:text-[#e61937] transition-colors">Digital BOM Parser</button></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Live LME Ticker</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">MTC Verification Vault</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Trade Escrow Desk</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Fleet GPS Tracker</span></li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-mono text-white font-bold uppercase tracking-wider mb-4">
              Compliance & Legal
            </div>
            <ul className="space-y-2 text-xs text-zinc-400 font-mono">
              <li><span className="hover:text-white transition-colors cursor-pointer">ISO 9001:2015 Cert</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Master Supply Agreement</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Privacy & NDAs</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Anti-Counterfeit Policy</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">VAT Registration #1004</span></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <div className="text-xs font-mono text-[#e61937] font-bold uppercase tracking-wider mb-4">
              Direct Sourcing Hotline
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              Need urgent stock allotment for site handover? Our trade desk responds 24/7.
            </p>
            <div className="text-sm font-bold font-mono text-white">
              +971 4 881 9000
            </div>
          </div>
        </div>

        {/* GIANT EDITORIAL BRAND WORDMARK */}
        <div className="mt-16 pt-8 border-t border-zinc-900 select-none overflow-hidden text-center">
          <div className="text-[14vw] sm:text-[16vw] font-black font-display tracking-tighter leading-none text-zinc-900 hover:text-zinc-800 transition-colors duration-700 whitespace-nowrap">
            SUPPLY SOUQ
          </div>
        </div>

        {/* Final Copyright Bar */}
        <div className="mt-4 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-500 gap-4">
          <div>
            © {new Date().getFullYear()} SUPPLY SOUQ LLC. ALL RIGHTS RESERVED. DUBAI, UNITED ARAB EMIRATES.
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[#e61937]">HOT RED EDITION</span>
            <span>•</span>
            <span>HIGH-CONTRAST B2B SYSTEM</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
