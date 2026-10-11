import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Building2, 
  Store, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Clock, 
  Phone, 
  MessageSquare, 
  Sparkles, 
  ArrowRight, 
  DollarSign,
  Truck,
  Layers,
  HelpCircle,
  Zap,
  FileSpreadsheet,
  GitCompare,
  PackageCheck,
  Award,
  AlertCircle
} from 'lucide-react';
import VariableFontCursorProximity from '../../components/fancy/text/variable-font-cursor-proximity';

interface OnboardingGuidePageProps {
  onStartBuyer: () => void;
  onStartSupplier: () => void;
}

export const OnboardingGuidePage: React.FC<OnboardingGuidePageProps> = ({
  onStartBuyer,
  onStartSupplier
}) => {
  const [activeTab, setActiveTab] = useState<'buyer' | 'supplier'>('buyer');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/60 px-3 py-1 rounded-full text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>ProcureSouq Standard Operating Procedure (SOP) & Platform Workflow</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight cursor-default select-none">
          <VariableFontCursorProximity
            fromFontVariationSettings="'wght' 700, 'slnt' 0"
            toFontVariationSettings="'wght' 950, 'slnt' -8"
            radius={140}
            falloff="gaussian"
          >
            How the Onboarding Process Works in 4 Easy Steps
          </VariableFontCursorProximity>
        </h1>
        <VariableFontCursorProximity
          as="p"
          className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed cursor-default"
          fromFontVariationSettings="'wght' 400, 'slnt' 0"
          toFontVariationSettings="'wght' 700, 'slnt' -4"
          radius={100}
          falloff="gaussian"
        >
          A clear, step-by-step operational guide explaining how contractors post material requirements, how verified suppliers quote, and how orders are fulfilled across the platform.
        </VariableFontCursorProximity>

        {/* Tab Switcher */}
        <div className="flex justify-center pt-4">
          <div className="bg-slate-100 dark:bg-white/[0.04] p-1.5 rounded-2xl flex gap-2 border border-slate-200/80 dark:border-white/[0.08] text-xs font-bold">
            <button
              onClick={() => setActiveTab('buyer')}
              className={`px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'buyer'
                  ? 'bg-brand-600 text-white shadow-md font-extrabold'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Contractor & Buyer Workflow</span>
            </button>
            <button
              onClick={() => setActiveTab('supplier')}
              className={`px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'supplier'
                  ? 'bg-amber-600 text-white shadow-md font-extrabold'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Material Stockist & Supplier Workflow</span>
            </button>
          </div>
        </div>
      </div>

      {/* ---------------- BUYER ONBOARDING PROCEDURE ---------------- */}
      {activeTab === 'buyer' && (
        <div className="space-y-10 animate-in fade-in duration-200">
          
          {/* Top 4 Easy Steps Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  Contractor Procurement in 4 Easy Steps
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  From signup to project site material delivery — completely free for buyers.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={onStartBuyer}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="bg-brand-600 hover:bg-brand-700 shadow-md font-bold hidden sm:flex"
              >
                Create Free Buyer Account
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  step: '01',
                  title: 'Corporate Account Setup',
                  desc: 'Register in 30 seconds with your Company Name, Procurement Engineer Name, UAE Mobile Number (+971), and Work Email.',
                  icon: Building2,
                  badge: 'Instant Activation',
                  color: 'text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/40 border-brand-200 dark:border-brand-800/60'
                },
                {
                  step: '02',
                  title: 'Post RFQ or Upload BOQ',
                  desc: 'Specify material line items, quantities, brand preferences (Ducab, Schneider, etc.) or drag-and-drop your Excel BOQ or smartphone bill photo.',
                  icon: FileSpreadsheet,
                  badge: 'Excel / Photo / BOQ',
                  color: 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60'
                },
                {
                  step: '03',
                  title: 'Compare 5 Vetted Offers',
                  desc: 'ProcureSouq internally collects, evaluates technical compliance, and publishes up to 5 anonymized commercial offers (Offer 1–5) for your comparison.',
                  icon: GitCompare,
                  badge: '5 Vetted Offers',
                  color: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60'
                },
                {
                  step: '04',
                  title: 'Order & Managed Delivery',
                  desc: 'Select your preferred offer, upload or issue your PO to ProcureSouq (PS-CPO), and track 6-stage UAE site delivery with POD.',
                  icon: PackageCheck,
                  badge: 'Single Point of Contact',
                  color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60'
                }
              ].map((card, idx) => {
                const Icon = card.icon;
                return (
                  <Card key={idx} className="flex flex-col justify-between hover:border-brand-400 dark:hover:border-white/[0.18] hover:shadow-md transition-all">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-extrabold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/40 px-2.5 py-1 rounded-lg border border-brand-200 dark:border-brand-800/60">
                          Step {card.step}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${card.color}`}>
                          {card.badge}
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/[0.04] flex items-center justify-center text-slate-800 dark:text-zinc-200 font-bold">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{card.title}</h3>
                      <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">{card.desc}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Deep-Dive Operational Workflow Details */}
          <div className="bg-white dark:bg-gradient-to-b dark:from-[#111114] dark:to-[#0c0c0e] border border-slate-200/80 dark:border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Managed B2B Procurement Workflow Explained
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700 dark:text-zinc-300">
              <div className="bg-slate-50/70 dark:bg-white/[0.03] p-5 rounded-2xl border border-slate-200/80 dark:border-white/[0.06] space-y-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white block">1. Single Point of Contact (ProcureSouq Desk)</span>
                <p className="leading-relaxed text-slate-600 dark:text-zinc-400">
                  When you submit an RFQ, ProcureSouq’s procurement team reviews your specs and invites verified UAE stockists while keeping your company identity confidential — protecting you from unsolicited vendor calls.
                </p>
              </div>

              <div className="bg-slate-50/70 dark:bg-white/[0.03] p-5 rounded-2xl border border-slate-200/80 dark:border-white/[0.06] space-y-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white block">2. Five Vetted Customer Offers (Offer 1–5)</span>
                <p className="leading-relaxed text-slate-600 dark:text-zinc-400">
                  Our team verifies technical compliance, brand compatibility, and partial/full BOQ coverage before publishing up to 5 sanitized offers with transparent rule-based recommendations.
                </p>
              </div>

              <div className="bg-slate-50/70 dark:bg-white/[0.03] p-5 rounded-2xl border border-slate-200/80 dark:border-white/[0.06] space-y-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white block">3. Official Customer PO (PS-CPO) & Support Desk</span>
                <p className="leading-relaxed text-slate-600 dark:text-zinc-400">
                  Upload your corporate Purchase Order or generate one through ProcureSouq. Communicate directly with ProcureSouq’s team anytime via the built-in Support & Messaging Desk.
                </p>
              </div>

              <div className="bg-slate-50/70 dark:bg-white/[0.03] p-5 rounded-2xl border border-slate-200/80 dark:border-white/[0.06] space-y-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white block">4. 6-Stage Coordinated Fulfilment & POD</span>
                <p className="leading-relaxed text-slate-600 dark:text-zinc-400">
                  ProcureSouq issues an internal Supplier PO (`PS-SPO`) and coordinates delivery from `Order Confirmed` through `Delivered` with Delivery Notes, Tax Invoices, and Proof of Delivery (POD).
                </p>
              </div>
            </div>
          </div>

          {/* Buyer FAQ Section */}
          <Card>
            <CardContent className="p-6 sm:p-8 space-y-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-500" />
                Frequently Asked Questions for Buyers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-zinc-300">
                <div className="p-4 bg-slate-50/70 dark:bg-white/[0.02] rounded-2xl border border-slate-200/80 dark:border-white/[0.06] space-y-1.5 shadow-2xs">
                  <strong className="text-slate-900 dark:text-white block font-bold">Who is my counterparty when I submit an RFQ?</strong>
                  <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">ProcureSouq is your single point of contact. We coordinate supplier quotations, technical evaluation, ordering, and site delivery on your behalf.</p>
                </div>
                <div className="p-4 bg-slate-50/70 dark:bg-white/[0.02] rounded-2xl border border-slate-200/80 dark:border-white/[0.06] space-y-1.5 shadow-2xs">
                  <strong className="text-slate-900 dark:text-white block font-bold">How are suppliers vetted on the platform?</strong>
                  <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">Every supplier in our pool holds an active UAE Trade License, verified warehouse location, and valid TRN tax registration before receiving ProcureSouq RFQ invitations.</p>
                </div>
                <div className="p-4 bg-slate-50/70 dark:bg-white/[0.02] rounded-2xl border border-slate-200/80 dark:border-white/[0.06] space-y-1.5 shadow-2xs">
                  <strong className="text-slate-900 dark:text-white block font-bold">Can I upload my existing Excel BOQ or PDF schedule?</strong>
                  <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">Yes! You can upload Excel BOQs, PDF quotation requests, and technical specifications, or enter line items manually.</p>
                </div>
                <div className="p-4 bg-slate-50/70 dark:bg-white/[0.02] rounded-2xl border border-slate-200/80 dark:border-white/[0.06] space-y-1.5 shadow-2xs">
                  <strong className="text-slate-900 dark:text-white block font-bold">How do I ask a question or report an issue?</strong>
                  <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">Use the Messages tab in your workspace to message ProcureSouq’s Procurement & Support Desk directly via text or voice note.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ---------------- SUPPLIER ONBOARDING PROCEDURE ---------------- */}
      {activeTab === 'supplier' && (
        <div className="space-y-10 animate-in fade-in duration-200">
          
          {/* Top 4 Easy Steps Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  Supplier Onboarding & Sales Desk in 4 Easy Steps
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Connect your warehouse stock directly to active UAE contractors and MEP estimators.
                </p>
              </div>
              <Button
                variant="amber"
                size="sm"
                onClick={onStartSupplier}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="font-bold shadow-md hidden sm:flex"
              >
                Register as Verified Supplier
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  step: '01',
                  title: 'Submit Corporate Profile',
                  desc: 'Provide your Company Trading Name, Legal Name, Contact Person Name, Sales Email, and UAE Phone Number.',
                  icon: Store,
                  badge: 'Stockist Profile',
                  color: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60'
                },
                {
                  step: '02',
                  title: 'Upload UAE Trade License',
                  desc: 'Enter your UAE Trade License Number and upload your certificate copy. Our compliance team verifies authenticity for contractor safety.',
                  icon: FileText,
                  badge: 'Mandatory Safety',
                  color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60'
                },
                {
                  step: '03',
                  title: 'Select Supply Categories',
                  desc: 'Select categories you stock (Electrical cables, Switchgear, LED lighting, Piping, HVAC, Chemicals, PPE) to receive relevant RFQ leads.',
                  icon: Layers,
                  badge: 'Targeted Leads',
                  color: 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60'
                },
                {
                  step: '04',
                  title: 'Quote to ProcureSouq & Fulfill POs',
                  desc: 'View assigned RFQs in your inbox, submit confidential quotes to ProcureSouq, receive official Supplier POs (PS-SPO), and fulfill orders.',
                  icon: DollarSign,
                  badge: 'Official PS-SPO',
                  color: 'text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/40 border-brand-200 dark:border-brand-800/60'
                }
              ].map((card, idx) => {
                const Icon = card.icon;
                return (
                  <Card key={idx} className="flex flex-col justify-between hover:border-amber-400 dark:hover:border-white/[0.18] hover:shadow-md transition-all">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-extrabold text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/50 px-2.5 py-1 rounded-lg border border-amber-300 dark:border-amber-800/60">
                          Step {card.step}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${card.color}`}>
                          {card.badge}
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-800 dark:text-amber-400 font-bold">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{card.title}</h3>
                      <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">{card.desc}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Supplier Safety & Verification Checklist */}
          <Card className="border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20">
            <CardHeader className="p-5 border-b border-emerald-100 dark:border-emerald-900/40">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                <h3 className="text-base font-extrabold text-emerald-950 dark:text-emerald-200">
                  UAE Supplier Verification Checklist (Requirements for Platform Approval)
                </h3>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-3 text-xs text-emerald-900 dark:text-emerald-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-2.5 bg-white dark:bg-[#121215] p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/50 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 dark:text-white font-bold">Active UAE Commercial Trade License</strong>
                    <span className="text-slate-600 dark:text-zinc-400">Valid trade license issued in UAE (Dubai, Sharjah, Ajman, Abu Dhabi, or Free Zone).</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-white dark:bg-[#121215] p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/50 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 dark:text-white font-bold">Federal Tax Authority TRN / VAT</strong>
                    <span className="text-slate-600 dark:text-zinc-400">Standard 5% VAT registered tax number for compliant corporate digital invoicing.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-white dark:bg-[#121215] p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/50 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 dark:text-white font-bold">Physical Warehouse / Stockyard</strong>
                    <span className="text-slate-600 dark:text-zinc-400">Physical stock storage in UAE industrial zones with direct dispatch logistics.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-white dark:bg-[#121215] p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/50 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 dark:text-white font-bold">Dedicated Sales Desk Responder</strong>
                    <span className="text-slate-600 dark:text-zinc-400">Committed sales team to submit quotations on assigned RFQs within 24 hours.</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Supplier FAQ Section */}
          <Card>
            <CardContent className="p-6 sm:p-8 space-y-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-500" />
                Frequently Asked Questions for Material Stockists
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-zinc-300">
                <div className="p-4 bg-slate-50/70 dark:bg-white/[0.02] rounded-2xl border border-slate-200/80 dark:border-white/[0.06] space-y-1.5 shadow-2xs">
                  <strong className="text-slate-900 dark:text-white block font-bold">Who do I quote and sell to on ProcureSouq?</strong>
                  <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">You deal directly with ProcureSouq’s Managed Procurement Desk. Assigned RFQs appear in your inbox and your quotes remain strictly confidential from other suppliers.</p>
                </div>
                <div className="p-4 bg-slate-50/70 dark:bg-white/[0.02] rounded-2xl border border-slate-200/80 dark:border-white/[0.06] space-y-1.5 shadow-2xs">
                  <strong className="text-slate-900 dark:text-white block font-bold">Will my submitted quotations be saved permanently?</strong>
                  <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">Yes! Every quote you submit is stored permanently in the Supabase database and linked to the original RFQ.</p>
                </div>
                <div className="p-4 bg-slate-50/70 dark:bg-white/[0.02] rounded-2xl border border-slate-200/80 dark:border-white/[0.06] space-y-1.5 shadow-2xs">
                  <strong className="text-slate-900 dark:text-white block font-bold">How are purchase orders issued to suppliers?</strong>
                  <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">Once an order is confirmed, ProcureSouq issues an official Supplier Purchase Order (`PS-SPO`) in your Supplier POs & Fulfilment desk.</p>
                </div>
                <div className="p-4 bg-slate-50/70 dark:bg-white/[0.02] rounded-2xl border border-slate-200/80 dark:border-white/[0.06] space-y-1.5 shadow-2xs">
                  <strong className="text-slate-900 dark:text-white block font-bold">How do I ask a question about an RFQ or order?</strong>
                  <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">Use the Messages tab in your workspace to message ProcureSouq’s Supplier Operations Desk directly.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};