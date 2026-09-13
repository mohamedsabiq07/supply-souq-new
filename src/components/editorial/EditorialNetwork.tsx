import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, Award, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface EditorialNetworkProps {
  onStartRFQ?: () => void;
}

const SPECIALISTS = [
  {
    name: 'Tariq Al-Mansoor',
    role: 'VP of Metallurgy & Piping Logistics',
    credentials: 'Ex-ADNOC Operations • 18 yrs GCC Experience',
    location: 'JAFZA Hub, Dubai',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    stat: 'AED 1.2B+',
    statLabel: 'Piping & Valving Delivered',
  },
  {
    name: 'Elena Rostova',
    role: 'Head of Quality Assurance & Mill Audit',
    credentials: 'ISO 9001 / EN 10204 3.1 Lead Auditor',
    location: 'DIC Logistics Zone, Dubai',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    stat: '100%',
    statLabel: 'Zero Counterfeit Pass Rate',
  },
  {
    name: 'Rashid Al-Qasimi',
    role: 'Director of Ground Freight & Gate Telemetry',
    credentials: 'Fleet Commander • RTA & GCC Transit Liaison',
    location: 'Musaffah Industrial Depot, Abu Dhabi',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    stat: '99.4%',
    statLabel: 'On-Time Fleet Dispatch',
  },
  {
    name: 'Marcus Vance',
    role: 'Chief Commercial Officer & Trade Finance',
    credentials: 'Former Standard Chartered B2B Commodities',
    location: 'DIFC Financial District',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    stat: 'AED 45M',
    statLabel: 'Active Credit Lines Managed',
  },
];

const HUBS = [
  { name: 'Jebel Ali Free Zone (JAFZA) Depot', area: '140,000 sq.m', capacity: 'Pipes, Flanges & Heavy Metallurgy' },
  { name: 'Dubai Industrial City (DIC) Hub', area: '95,000 sq.m', capacity: 'Electrical, MEP, Cables & Transformers' },
  { name: 'Musaffah ICAD II Steel Center', area: '160,000 sq.m', capacity: 'Structural Beams, Rebar & Sheet Piling' },
  { name: 'Dammam 2nd Industrial Hub (KSA)', area: '110,000 sq.m', capacity: 'Cross-Border Valves, Actuators & Pumps' },
];

export const EditorialNetwork: React.FC<EditorialNetworkProps> = ({ onStartRFQ }) => {
  return (
    <section className="relative bg-[#fafafa] text-[#09090b] py-28 border-b border-zinc-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 pb-8 border-b border-zinc-300">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block w-2.5 h-2.5 bg-[#e61937]" />
              <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase">
                [SSQ-HUMAN-CAPITAL] • VERIFIED EXPERTISE
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight leading-none text-zinc-950">
              BEHIND THE ALGORITHM: <br />
              <span className="text-[#e61937]">REAL GCC</span> SPECIALISTS.
            </h2>
          </div>
          <p className="mt-6 lg:mt-0 text-zinc-600 max-w-md text-sm leading-relaxed">
            Software moves data, but industrial veterans verify metal. Our on-ground procurement officers, metallurgists, and QA inspectors personally protect your project deadlines.
          </p>
        </div>

        {/* 4 Specialists Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {SPECIALISTS.map((spec, i) => (
            <motion.div
              key={spec.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white border border-zinc-200 hover:border-zinc-400 p-6 flex flex-col justify-between group transition-all duration-300 shadow-sm hover:shadow-xl relative"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)',
              }}
            >
              <div>
                {/* Photo with clipped corner */}
                <div 
                  className="relative aspect-square overflow-hidden bg-zinc-100 mb-6"
                  style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
                  }}
                >
                  <img
                    src={spec.image}
                    alt={spec.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-white px-2 py-0.5 text-[10px] font-mono border border-zinc-800">
                    SSQ-VERIFIED
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#e61937] mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{spec.location}</span>
                </div>

                <h3 className="text-xl font-bold font-display text-zinc-950 mb-1 group-hover:text-[#e61937] transition-colors">
                  {spec.name}
                </h3>

                <div className="text-xs font-semibold text-zinc-800 mb-2">
                  {spec.role}
                </div>

                <p className="text-xs text-zinc-500 leading-relaxed">
                  {spec.credentials}
                </p>
              </div>

              {/* Bottom Specialist Metric */}
              <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
                <div>
                  <div className="text-lg font-black font-display text-zinc-950">
                    {spec.stat}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400 uppercase">
                    {spec.statLabel}
                  </div>
                </div>
                <div className="w-7 h-7 bg-zinc-100 group-hover:bg-[#e61937] group-hover:text-white flex items-center justify-center transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Regional Physical Yard Capacity List */}
        <div className="bg-[#09090b] text-white p-8 border border-zinc-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-zinc-800 mb-6">
            <div>
              <span className="text-xs font-mono text-[#e61937] uppercase tracking-wider">
                PHYSICAL FOOTPRINT
              </span>
              <h3 className="text-xl font-bold font-display text-white mt-1">
                Connected GCC Partner Yards & Stock Centers
              </h3>
            </div>
            <div className="mt-4 md:mt-0 font-mono text-xs text-zinc-400">
              505,000 SQ.M TOTAL STORAGE CAPACITY
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HUBS.map((hub, i) => (
              <div key={i} className="p-4 bg-zinc-900/60 border border-zinc-800/80">
                <div className="text-xs font-mono text-zinc-400 mb-1">{hub.area}</div>
                <div className="text-sm font-bold text-white mb-2">{hub.name}</div>
                <div className="text-xs text-zinc-400">{hub.capacity}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
