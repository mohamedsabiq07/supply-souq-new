import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Layers, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

export const CategoriesPage: React.FC<{ onPostRFQ: () => void }> = ({ onPostRFQ }) => {
  const { categories } = useAppData();
  const [selectedVertical, setSelectedVertical] = useState('All');

  const verticals = [
    'All',
    'Power & Cables',
    'Switchgear & DBs',
    'Containment & Conduits',
    'Lighting & Controls',
    'Earthing & Lightning',
    'Power Equipment'
  ];

  const filteredCategories = selectedVertical === 'All'
    ? categories
    : categories.filter(c => c.vertical === selectedVertical);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">UAE Electrical Materials Directory</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Electrical Materials & Cable Categories</h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse structured electrical material categories and subcategories for multi-stockist RFQ distribution.
          </p>
        </div>
        <Button variant="primary" onClick={onPostRFQ} leftIcon={<Zap className="w-4 h-4 text-amber-300" />}>
          Post Electrical RFQ
        </Button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {verticals.map(v => (
          <button
            key={v}
            onClick={() => setSelectedVertical(v)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedVertical === v
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="hover:border-brand-400 transition-all">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{category.vertical}</span>
                    <h3 className="text-lg font-bold text-slate-900">{category.name}</h3>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                  {category.itemCount} SKUs
                </span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">{category.description}</p>

              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 mb-2">Available Subcategories & Items:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {category.subcategories.map((sub, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between"
                  onClick={onPostRFQ}
                >
                  <span>Post RFQ for {category.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};