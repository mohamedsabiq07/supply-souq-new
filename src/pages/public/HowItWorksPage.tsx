import React from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import {
  FileSpreadsheet,
  Search,
  Store,
  GitCompare,
  PackageCheck,
  Zap,
  ShieldCheck,
  FileCheck2,
  Truck,
  Lock,
} from 'lucide-react';
import VariableFontCursorProximity from '../../components/fancy/text/variable-font-cursor-proximity';

export const HowItWorksPage: React.FC<{ onStartRFQ: () => void }> = ({ onStartRFQ }) => {
  const steps = [
    {
      step: '01',
      title: 'Customer Submits One RFQ to ProcureSouq',
      desc: 'Enter required materials manually or upload Excel BOQs, PDF quotation requests, and technical specifications. Specify preferred brands, delivery Emirate, required delivery date, and special project requirements.',
      icon: FileSpreadsheet,
    },
    {
      step: '02',
      title: 'Internal Procurement Review & Supplier Sourcing',
      desc: 'ProcureSouq’s procurement team reviews your requirements, checks for missing specifications, assigns a specialist, and invites multiple verified UAE stockists while keeping your company identity strictly confidential.',
      icon: Search,
    },
    {
      step: '03',
      title: 'Collection & Technical Evaluation of Quotations',
      desc: 'ProcureSouq collects competitive supplier quotations and evaluates technical compliance, brand compatibility, stock availability, lead time feasibility, and pricing accuracy — flagging any deviations or partial offers.',
      icon: FileCheck2,
    },
    {
      step: '04',
      title: 'Five-Quote Customer Comparison Dashboard',
      desc: 'Compare up to 5 qualified ProcureSouq offers (Offer 1 to Offer 5) side-by-side on unit price, landed cost, lead time, warranty, and payment terms. Sort by Lowest Price, Fastest Delivery, Best Technical Match, or Best Overall Value.',
      icon: GitCompare,
    },
    {
      step: '05',
      title: 'Single-Point-of-Contact Order & 6-Stage Delivery',
      desc: 'Select your preferred offer and upload or generate your Purchase Order with ProcureSouq. Our team coordinates supplier purchasing (PS-SPO), dispatch, and tracked delivery through Proof of Delivery (POD).',
      icon: Truck,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs font-bold text-[#cf2e46]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>ProcureSouq V2 — Managed B2B Procurement Model</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white cursor-default select-none">
          <VariableFontCursorProximity
            fromFontVariationSettings="'wght' 700, 'slnt' 0"
            toFontVariationSettings="'wght' 950, 'slnt' -8"
            radius={140}
            falloff="gaussian"
          >
            How Managed Procurement Works
          </VariableFontCursorProximity>
        </h1>
        <VariableFontCursorProximity
          as="p"
          className="text-sm text-slate-500 dark:text-zinc-400 cursor-default"
          fromFontVariationSettings="'wght' 400, 'slnt' 0"
          toFontVariationSettings="'wght' 700, 'slnt' -4"
          radius={100}
          falloff="gaussian"
        >
          One single point of contact from RFQ to UAE site delivery — with complete counterparty confidentiality and technical verification.
        </VariableFontCursorProximity>
      </div>

      <div className="space-y-6">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Card key={idx} className="p-6 hover:border-brand-400 dark:hover:border-brand-500 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-rose-950/40 text-brand-600 dark:text-rose-400 border border-brand-200/50 dark:border-rose-900/50 flex items-center justify-center font-extrabold text-xl shrink-0">
                  <Icon className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-brand-600 dark:text-rose-400 bg-brand-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-brand-200/50 dark:border-rose-900/50">
                      Step {item.step}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Counterparty Confidentiality & Anti-Circumvention Guarantee */}
      <div className="bg-white dark:bg-gradient-to-b dark:from-[#111114] dark:to-[#0c0c0e] text-slate-900 dark:text-white rounded-3xl p-8 border border-slate-200/80 dark:border-white/[0.08] shadow-sm space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#cf2e46] uppercase tracking-widest">
            <Lock className="w-3.5 h-3.5" /> Managed Intermediary Architecture
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Why Businesses Choose ProcureSouq V2
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            ProcureSouq acts as your dedicated procurement intermediary — eliminating supplier spam for buyers and providing pre-vetted, serious orders for UAE stockists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Buyers */}
          <div className="bg-slate-50 dark:bg-[#141417] p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/[0.08] space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#cf2e46]">
              For Buyers & Contractors
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              Single Point of Contact
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">✓ Submit one RFQ — receive up to 5 vetted ProcureSouq offers</li>
              <li className="flex items-center gap-2">✓ Zero cold calls or spam from unverified traders</li>
              <li className="flex items-center gap-2">✓ Transparent rule-based comparison (Lowest Price, Fastest, Best Value)</li>
              <li className="flex items-center gap-2">✓ Direct support channel with ProcureSouq’s Procurement Desk</li>
            </ul>
          </div>

          {/* Suppliers */}
          <div className="bg-slate-50 dark:bg-[#141417] p-6 rounded-2xl sm:rounded-3xl border border-[#cf2e46]/40 space-y-3 relative overflow-hidden">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#cf2e46]">
              For Verified UAE Suppliers
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              Deal Directly With ProcureSouq
            </div>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">✓ Receive structured, pre-verified RFQ packages from ProcureSouq</li>
              <li className="flex items-center gap-2">✓ Your quotations remain strictly confidential from competing suppliers</li>
              <li className="flex items-center gap-2">✓ Official Supplier Purchase Orders (PS-SPO) issued by ProcureSouq</li>
              <li className="flex items-center gap-2">✓ Direct operations & support messaging desk with ProcureSouq’s team</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center bg-slate-900 dark:bg-gradient-to-r dark:from-zinc-950 dark:via-[#0c0c0e] dark:to-black text-white rounded-3xl p-8 border border-slate-800 dark:border-white/[0.08] shadow-sm space-y-4">
        <h3 className="text-xl font-bold text-white">Ready to Start Your Managed RFQ?</h3>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          Submit your material requirement and let ProcureSouq’s procurement team prepare up to 5 qualified offers for your comparison.
        </p>
        <Button variant="primary" size="lg" onClick={onStartRFQ} leftIcon={<Zap className="w-4 h-4 text-amber-300" />}>
          Submit Managed RFQ Now
        </Button>
      </div>
    </div>
  );
};