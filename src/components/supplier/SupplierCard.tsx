import React from 'react';
import { Company } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { ShieldCheck, MapPin, Star, Phone, Mail, Building2 } from 'lucide-react';

interface SupplierCardProps {
  supplier: Company;
  onRequestQuote?: (supplier: Company) => void;
}

export const SupplierCard: React.FC<SupplierCardProps> = ({ supplier, onRequestQuote }) => {
  return (
    <Card className="hover:border-brand-300 dark:hover:border-brand-500 transition-all flex flex-col justify-between">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-900 dark:bg-zinc-800 text-white font-bold flex items-center justify-center text-base shadow-sm shrink-0 border border-slate-700 dark:border-zinc-700">
              {supplier.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{supplier.name}</h4>
                {supplier.verificationStatus === 'verified' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#cf2e46]" /> DET Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400 dark:text-zinc-500" />
                <span>{supplier.industrialZone}, {supplier.emirate}</span>
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 text-sm font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-lg border border-amber-100 dark:border-amber-900/60">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{supplier.rating}</span>
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-normal">({supplier.reviewCount})</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {supplier.categories.map((cat, idx) => (
            <span key={idx} className="text-[11px] font-medium bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 px-2 py-0.5 rounded border border-slate-200/60 dark:border-zinc-800">
              {cat}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 dark:bg-[#121215] rounded-lg text-center text-xs mb-4 border border-slate-100 dark:border-zinc-800">
          <div>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 block font-medium">Response Rate</span>
            <strong className="text-slate-800 dark:text-zinc-200 font-bold">{supplier.responseRatePercent}%</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 block font-medium">Avg. Response</span>
            <strong className="text-slate-800 dark:text-zinc-200 font-bold">{supplier.averageResponseHours} hrs</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 block font-medium">Experience</span>
            <strong className="text-slate-800 dark:text-zinc-200 font-bold">{supplier.yearsInBusiness} yrs</strong>
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-zinc-400 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-zinc-800">
          <span>License: <strong className="text-slate-700 dark:text-zinc-300 font-mono">{supplier.tradeLicenseNumber}</strong></span>
          <span className="text-[#cf2e46] font-semibold">Active UAE Trader</span>
        </div>
      </CardContent>

      <div className="px-5 pb-5">
        <Button
          variant="outline"
          size="sm"
          className="w-full hover:bg-brand-50 dark:hover:bg-zinc-900 hover:text-brand-700 dark:hover:text-white hover:border-brand-200 dark:hover:border-zinc-700"
          onClick={() => onRequestQuote && onRequestQuote(supplier)}
        >
          Request Direct RFQ
        </Button>
      </div>
    </Card>
  );
};
