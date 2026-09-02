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
        <div className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 border border-brand-200 px-3 py-1 rounded-full text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>SupplySouq Standard Operating Procedure (SOP) & Platform Workflow</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How the Onboarding Process Works in 4 Easy Steps
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          A clear, step-by-step operational guide explaining how contractors post material requirements, how verified suppliers quote, and how orders are fulfilled across the platform.
        </p>

        {/* Tab Switcher */}
        <div className="flex justify-center pt-4">
          <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-2 border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('buyer')}
              className={`px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'buyer'
                  ? 'bg-brand-600 text-white shadow-md font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
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
                  : 'text-slate-600 hover:text-slate-900'
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
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Contractor Procurement in 4 Easy Steps
                </h2>
                <p className="text-xs text-slate-500">
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
                  color: 'text-brand-600 bg-brand-50 border-brand-200'
                },
                {
                  step: '02',
                  title: 'Post RFQ or Upload BOQ',
                  desc: 'Specify material line items, quantities, brand preferences (Ducab, Schneider, etc.) or drag-and-drop your Excel BOQ or smartphone bill photo.',
                  icon: FileSpreadsheet,
                  badge: 'Excel / Photo / BOQ',
                  color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
                },
                {
                  step: '03',
                  title: 'Receive 5 Live Direct Quotes',
                  desc: 'Verified stockists submit itemized unit prices, lead times, and 5% VAT calculations within 24 hours. Compare side-by-side on one screen.',
                  icon: GitCompare,
                  badge: '18% Cost Savings',
                  color: 'text-amber-600 bg-amber-50 border-amber-200'
                },
                {
                  step: '04',
                  title: 'Award PO & Site Delivery',
                  desc: 'Select the best offer and issue an official digital Purchase Order with 1-click. Track live fulfillment directly to your project site.',
                  icon: PackageCheck,
                  badge: 'Direct Site Delivery',
                  color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
                }
              ].map((card, idx) => {
                const Icon = card.icon;
                return (
                  <Card key={idx} className="border-slate-200 flex flex-col justify-between hover:border-brand-400 hover:shadow-md transition-all">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-extrabold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200">
                          Step {card.step}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${card.color}`}>
                          {card.badge}
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 font-bold">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{card.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{card.desc}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Deep-Dive Operational Workflow Details */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Detailed Buyer Platform Workflow Explained
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-sm text-slate-900 block">1. Transparent Multi-Stockist Distribution</span>
                <p className="leading-relaxed text-slate-600">
                  When you submit an RFQ, SupplySouq automatically parses your line items and alerts verified authorized stockists in your material category. No middlemen or broker margins are added.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-sm text-slate-900 block">2. Standardized 5% UAE VAT Quotations</span>
                <p className="leading-relaxed text-slate-600">
                  All quotations are structured identically: Unit Price, Subtotal, 5% UAE VAT, Grand Total, Brand Offered, Lead Time, and Payment Terms (e.g., 30 Days Credit, PDC, or COD).
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-sm text-slate-900 block">3. Automated Free Cable & Invoice Cost Audit</span>
                <p className="leading-relaxed text-slate-600">
                  You can upload your past supplier invoices or bills to benchmark every line item against live stockist prices and identify overcharging in seconds.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-sm text-slate-900 block">4. Direct Order Fulfillment & Site Tracking</span>
                <p className="leading-relaxed text-slate-600">
                  Once awarded, the stockist receives your official PO with your site delivery address, coordinates dispatch with driver contact, and delivers materials directly to your site.
                </p>
              </div>
            </div>
          </div>

          {/* Buyer FAQ Section */}
          <Card className="bg-slate-900 text-white border-slate-800">
            <CardContent className="p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                Frequently Asked Questions for Contractors
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
                <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
                  <strong className="text-white block">Is SupplySouq free for contractors and MEP buyers?</strong>
                  <p className="text-slate-400">Yes! Buyers use SupplySouq 100% free of charge to post RFQs and receive up to 5 live quotations per requirement.</p>
                </div>
                <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
                  <strong className="text-white block">How are suppliers vetted on the platform?</strong>
                  <p className="text-slate-400">Every supplier must possess an active UAE Trade License, verified warehouse location, and valid TRN tax registration before quoting.</p>
                </div>
                <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
                  <strong className="text-white block">Can I upload my existing Excel BOQ or paper bill?</strong>
                  <p className="text-slate-400">Yes! You can upload Excel files, PDF schedules, or snap a mobile camera photo of your handwritten paper list.</p>
                </div>
                <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
                  <strong className="text-white block">What payment terms are offered?</strong>
                  <p className="text-slate-400">Suppliers specify payment terms on every quotation: 30–60 Days Credit, Post-Dated Cheques (PDC), or Cash on Delivery (COD).</p>
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
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Supplier Onboarding & Sales Desk in 4 Easy Steps
                </h2>
                <p className="text-xs text-slate-500">
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
                  color: 'text-amber-600 bg-amber-50 border-amber-200'
                },
                {
                  step: '02',
                  title: 'Upload UAE Trade License',
                  desc: 'Enter your UAE Trade License Number and upload your certificate copy. Our compliance team verifies authenticity for contractor safety.',
                  icon: FileText,
                  badge: 'Mandatory Safety',
                  color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
                },
                {
                  step: '03',
                  title: 'Select Supply Categories',
                  desc: 'Select categories you stock (Electrical cables, Switchgear, LED lighting, Piping, HVAC, Chemicals, PPE) to receive relevant RFQ leads.',
                  icon: Layers,
                  badge: 'Targeted Leads',
                  color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
                },
                {
                  step: '04',
                  title: 'Submit Quotes & Fulfill POs',
                  desc: 'View live buyer RFQs in your inbox, enter your competitive unit rates and lead times, win awarded POs, and fulfill orders directly.',
                  icon: DollarSign,
                  badge: 'Direct PO Awards',
                  color: 'text-brand-600 bg-brand-50 border-brand-200'
                }
              ].map((card, idx) => {
                const Icon = card.icon;
                return (
                  <Card key={idx} className="border-slate-200 flex flex-col justify-between hover:border-amber-400 hover:shadow-md transition-all">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-extrabold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300">
                          Step {card.step}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${card.color}`}>
                          {card.badge}
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-800 font-bold">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{card.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{card.desc}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Supplier Safety & Verification Checklist */}
          <Card className="border-emerald-200 bg-emerald-50/50">
            <CardHeader className="p-5 border-b border-emerald-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-extrabold text-emerald-950">
                  UAE Supplier Verification Checklist (Requirements for Platform Approval)
                </h3>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-3 text-xs text-emerald-900">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-2.5 bg-white p-3.5 rounded-xl border border-emerald-200 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-bold">Active UAE Commercial Trade License</strong>
                    <span className="text-slate-600">Valid trade license issued in UAE (Dubai, Sharjah, Ajman, Abu Dhabi, or Free Zone).</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-white p-3.5 rounded-xl border border-emerald-200 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-bold">Federal Tax Authority TRN / VAT</strong>
                    <span className="text-slate-600">Standard 5% VAT registered tax number for compliant corporate digital invoicing.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-white p-3.5 rounded-xl border border-emerald-200 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-bold">Physical Warehouse / Stockyard</strong>
                    <span className="text-slate-600">Physical stock storage in UAE industrial zones with direct dispatch logistics.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-white p-3.5 rounded-xl border border-emerald-200 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-bold">Dedicated Sales Desk Responder</strong>
                    <span className="text-slate-600">Committed sales team to submit quotations on live contractor RFQs within 24 hours.</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Supplier FAQ Section */}
          <Card className="bg-slate-900 text-white border-slate-800">
            <CardContent className="p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                Frequently Asked Questions for Material Stockists
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
                <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
                  <strong className="text-white block">How do I receive RFQs from contractors?</strong>
                  <p className="text-slate-400">All matching buyer RFQs appear in real-time in your "Live RFQ Inbox" filtered by the supply categories you select.</p>
                </div>
                <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
                  <strong className="text-white block">Will my submitted quotations be saved permanently?</strong>
                  <p className="text-slate-400">Yes! Every quote you submit is stored permanently in the Supabase database. You can track all active, evaluating, and won quotes anytime.</p>
                </div>
                <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
                  <strong className="text-white block">How are purchase orders awarded?</strong>
                  <p className="text-slate-400">When a buyer selects your quote, an official PO is generated with the buyer's billing details and delivery address in your "Orders & POs" desk.</p>
                </div>
                <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
                  <strong className="text-white block">Can I update delivery dispatch status?</strong>
                  <p className="text-slate-400">Yes! You can update order status (Accepted, Processing, Dispatched, Delivered) and add logistics tracking notes.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};