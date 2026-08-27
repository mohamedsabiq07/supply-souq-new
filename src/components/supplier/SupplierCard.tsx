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
    <Card className="hover:border-brand-300 transition-all flex flex-col justify-between">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-base shadow-sm shrink-0">
              {supplier.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="text-base font-bold text-slate-900">{supplier.name}</h4>
                {supplier.verificationStatus === 'verified' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> DET Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{supplier.industrialZone}, {supplier.emirate}</span>
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 text-sm font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{supplier.rating}</span>
              <span className="text-[10px] text-slate-400 font-normal">({supplier.reviewCount})</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {supplier.categories.map((cat, idx) => (
            <span key={idx} className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              {cat}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 rounded-lg text-center text-xs mb-4">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Response Rate</span>
            <strong className="text-slate-800 font-bold">{supplier.responseRatePercent}%</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Avg. Response</span>
            <strong className="text-slate-800 font-bold">{supplier.averageResponseHours} hrs</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Experience</span>
            <strong className="text-slate-800 font-bold">{supplier.yearsInBusiness} yrs</strong>
          </div>
        </div>

        <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
          <span>License: <strong className="text-slate-700 font-mono">{supplier.tradeLicenseNumber}</strong></span>
          <span className="text-emerald-700 font-medium">Active UAE Trader</span>
        </div>
      </CardContent>

      <div className="px-5 pb-5">
        <Button
          variant="outline"
          size="sm"
          className="w-full hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200"
          onClick={() => onRequestQuote && onRequestQuote(supplier)}
        >
          Request Direct RFQ
        </Button>
      </div>
    </Card>
  );
};
