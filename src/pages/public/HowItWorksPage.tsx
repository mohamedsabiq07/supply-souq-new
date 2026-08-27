import React from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { FileSpreadsheet, Search, Store, GitCompare, PackageCheck, Zap } from 'lucide-react';

export const HowItWorksPage: React.FC<{ onStartRFQ: () => void }> = ({ onStartRFQ }) => {
  const steps = [
    {
      step: '01',
      title: 'Create RFQ or Upload BOQ',
      desc: 'Add items directly or upload your Excel/PDF material schedule. Define delivery location (e.g. Al Quoz or Business Bay) and required delivery date.',
      icon: FileSpreadsheet,
    },
    {
      step: '02',
      title: 'Automated Supplier Matching',
      desc: 'SupplySouq automatically routes the RFQ to verified traders & stockists matching your category and industrial radius in Dubai and Sharjah.',
      icon: Search,
    },
    {
      step: '03',
      title: 'Receive Digital Quotations',
      desc: 'Suppliers input itemized unit prices, brand certifications, delivery lead times, warranty periods, and 5% UAE VAT in a standardized digital format.',
      icon: Store,
    },
    {
      step: '04',
      title: 'Side-by-Side Comparison Matrix',
      desc: 'Compare offers instantly. Sort by Lowest Total AED, Fastest Delivery, or Best Rated. Expand item-by-item line pricing.',
      icon: GitCompare,
    },
    {
      step: '05',
      title: 'Issue PO & Site Delivery',
      desc: '1-Click Purchase Order generation. The winning supplier accepts and delivers straight to your project gate with full test certificates.',
      icon: PackageCheck,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">Simple 5-Step Process</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">How SupplySouq Works</h1>
        <p className="text-sm text-slate-500">
          Transforming manual WhatsApp RFQs and endless spreadsheet comparisons into a fast, transparent digital procurement loop.
        </p>
      </div>

      <div className="space-y-6">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Card key={idx} className="p-6 hover:border-brand-400 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-extrabold text-xl shrink-0">
                  <Icon className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                      Step {item.step}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="text-center bg-slate-900 text-white rounded-3xl p-8 space-y-4">
        <h3 className="text-xl font-bold">Ready to Experience Faster Procurement?</h3>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          Post your first material RFQ and receive 3-5 verified quotations within 24 hours.
        </p>
        <Button variant="primary" size="lg" onClick={onStartRFQ} leftIcon={<Zap className="w-4 h-4 text-amber-300" />}>
          Post an RFQ Now
        </Button>
      </div>
    </div>
  );
};