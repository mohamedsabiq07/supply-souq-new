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
  HelpCircle
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 border border-brand-200 px-3 py-1 rounded-full text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>UAE Standard Operating Procedures (SOP)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How to Get Started on SupplySouq
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Clear, frictionless onboarding procedures for UAE Procurement Managers and Verified Material Traders.
        </p>

        {/* Tab Switcher */}
        <div className="flex justify-center pt-4">
          <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-2 border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('buyer')}
              className={`px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'buyer'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>For Buyers & Procurement Teams</span>
            </button>
            <button
              onClick={() => setActiveTab('supplier')}
              className={`px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'supplier'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>For Verified Suppliers & Stockists</span>
            </button>
          </div>
        </div>
      </div>

      {/* BUYER ONBOARDING PROCEDURE */}
      {activeTab === 'buyer' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-brand-50/70 border border-brand-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">
                Zero Friction Setup • 100% Free
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Buyer Onboarding in 4 Easy Steps
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                No credit card required. Post your first RFQ in under 60 seconds.
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={onStartBuyer}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="bg-brand-600 hover:bg-brand-700 shadow-md whitespace-nowrap"
            >
              Post Your First RFQ
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: '01',
                title: '30-Second Account Creation',
                desc: 'Enter your company name, email, and UAE mobile number (+971). No complicated corporate documentation needed to start viewing prices.',
                icon: Phone,
                highlight: 'Instant Access'
              },
              {
                step: '02',
                title: 'Post Material RFQ',
                desc: 'Choose from 1-Click Monthly Packs (Cleaning chemicals, washroom paper, PPE) or snap a mobile photo of your handwritten paper list.',
                icon: Sparkles,
                highlight: '1-Click or Photo'
              },
              {
                step: '03',
                title: 'Receive Multi-Vendor Quotes',
                desc: 'Verified stockists across Dubai, Sharjah, and Ajman submit prices within 24 hours. Compare side-by-side by Lowest Price, Fast Delivery, or Rating.',
                icon: Clock,
                highlight: 'Standardized 5% VAT'
              },
              {
                step: '04',
                title: 'Issue PO & Site Delivery',
                desc: 'Award with 1-click to generate an official digital PO. Receive delivery on site and rate the supplier upon receiving goods.',
                icon: Truck,
                highlight: 'Digital PO Invoicing'
              }
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <Card key={idx} className="border-slate-200 flex flex-col justify-between hover:border-brand-400 transition-all">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                        Step {card.step}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {card.highlight}
                      </span>
                    </div>
                    <Icon className="w-6 h-6 text-brand-600" />
                    <h3 className="text-sm font-bold text-slate-900">{card.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Buyer FAQ Accordion / Quick Tips */}
          <Card className="bg-slate-900 text-white border-slate-800">
            <CardContent className="p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                Frequently Asked Questions for Buyers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                  <strong className="text-white block mb-1">Is SupplySouq free for contractors and FM companies?</strong>
                  <span>Yes! Buyers use SupplySouq completely free of charge. You get direct wholesale prices without hidden markups.</span>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                  <strong className="text-white block mb-1">How do I know the suppliers are legitimate?</strong>
                  <span>Every supplier must submit a valid UAE Department of Economy & Tourism (DET) Trade License and is verified before quoting.</span>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                  <strong className="text-white block mb-1">What payment terms are supported?</strong>
                  <span>Suppliers offer standard UAE commercial terms: 30 Days Net, Post-Dated Cheques (PDC), or Advance Cash on Delivery (COD).</span>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                  <strong className="text-white block mb-1">Can I upload my existing Excel BOQ or paper bill?</strong>
                  <span>Yes! You can drag and drop Excel files, PDFs, or simply snap a smartphone picture of your handwritten supply note.</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SUPPLIER ONBOARDING PROCEDURE */}
      {activeTab === 'supplier' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Grow Your B2B Sales • First 90 Days Free
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Supplier Onboarding & Verification Procedure
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Connect your warehouse inventory directly to UAE contractors and FM procurement desks.
              </p>
            </div>
            <Button
              variant="amber"
              size="lg"
              onClick={onStartSupplier}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="shadow-md whitespace-nowrap"
            >
              Apply as a Verified Supplier
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: '01',
                title: 'Submit Company Profile',
                desc: 'Provide your registered trading name, warehouse location (e.g., Al Quoz, Sharjah Industrial 1-17, Mussafah), and sales desk contact.',
                icon: Store,
                highlight: 'Profile Setup'
              },
              {
                step: '02',
                title: 'Upload UAE Trade License',
                desc: 'Upload a copy of your active commercial Trade License and TRN / VAT certificate. Our compliance desk approves within 4 hours.',
                icon: FileText,
                highlight: 'DET Verification'
              },
              {
                step: '03',
                title: 'Set Material Categories',
                desc: 'Select your trading verticals: FM Chemicals, Hygiene Paper, Safety PPE, Electrical MRO. You only receive relevant buyer RFQs.',
                icon: Layers,
                highlight: 'Targeted Leads'
              },
              {
                step: '04',
                title: 'Quote & Win Purchase Orders',
                desc: 'Receive immediate RFQ alerts via WhatsApp & Web Desk. Submit itemized prices with 5% VAT and convert deals into signed POs.',
                icon: DollarSign,
                highlight: 'Instant RFQ Alerts'
              }
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <Card key={idx} className="border-slate-200 flex flex-col justify-between hover:border-amber-400 transition-all">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                        Step {card.step}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {card.highlight}
                      </span>
                    </div>
                    <Icon className="w-6 h-6 text-amber-600" />
                    <h3 className="text-sm font-bold text-slate-900">{card.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Supplier Requirements Checklist */}
          <Card className="border-emerald-200 bg-emerald-50/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-emerald-950">
                  UAE Supplier Verification Checklist (Requirements for Approval)
                </h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-emerald-900">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-2 bg-white p-3 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-bold">Valid UAE Trade License</strong>
                    <span className="text-slate-600">Issued by Dubai DET, Sharjah SEDD, Abu Dhabi DED, or relevant Free Zone.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-white p-3 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-bold">Federal Tax Authority (FTA) TRN</strong>
                    <span className="text-slate-600">Standard 5% VAT registered tax number for compliant digital tax invoicing.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-white p-3 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-bold">Physical Warehouse / Yard in UAE</strong>
                    <span className="text-slate-600">Physical stock storage in Al Quoz, Sharjah Industrial, JAFZA, or Mussafah.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-white p-3 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-bold">Dedicated Sales Desk Responder</strong>
                    <span className="text-slate-600">Commitment to maintain 24-hour turnaround on matched commercial RFQs.</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};