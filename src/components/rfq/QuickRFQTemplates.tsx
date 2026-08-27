import React from 'react';
import { initialQuickBundles } from '../../data/seedData';
import { QuickBundle } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatAED } from '../../lib/utils';
import { Sparkles, Layers, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

interface QuickRFQTemplatesProps {
  onSelectBundle: (bundle: QuickBundle) => void;
}

export const QuickRFQTemplates: React.FC<QuickRFQTemplatesProps> = ({ onSelectBundle }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-xs font-bold px-2 py-0.5 rounded border border-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> 1-Click Fast Templates
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mt-1">
            Popular Electrical & MEP Procurement Packages
          </h3>
          <p className="text-xs text-slate-500">
            Select a pre-filled electrical bill of quantities to receive verified UAE stockist quotations in 24 hours.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {initialQuickBundles.map((bundle) => (
          <Card
            key={bundle.id}
            className="hover:border-brand-500 hover:shadow-card transition-all flex flex-col justify-between group cursor-pointer border-slate-200"
            onClick={() => onSelectBundle(bundle)}
          >
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                  {bundle.icon === 'Sparkles' && <Sparkles className="w-5 h-5" />}
                  {bundle.icon === 'Layers' && <Layers className="w-5 h-5" />}
                  {bundle.icon === 'ShieldCheck' && <ShieldCheck className="w-5 h-5" />}
                  {bundle.icon === 'Zap' && <Zap className="w-5 h-5" />}
                </div>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  {bundle.badge}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                  {bundle.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {bundle.description}
                </p>
              </div>

              {/* Items preview snippet */}
              <div className="bg-slate-50 p-2.5 rounded-lg text-[11px] text-slate-600 space-y-1">
                {bundle.items.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center truncate">
                    <span className="truncate">• {item.description}</span>
                    <strong className="text-slate-800 shrink-0 ml-1">{item.quantity} {item.unit}</strong>
                  </div>
                ))}
                {bundle.items.length > 2 && (
                  <p className="text-[10px] text-brand-600 font-semibold pt-0.5">
                    + {bundle.items.length - 2} more items included
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Est. Value</span>
                  <strong className="text-slate-900 font-extrabold">{formatAED(bundle.estimatedTotalAED)}</strong>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectBundle(bundle);
                  }}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  className="bg-brand-600 group-hover:bg-brand-700"
                >
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};