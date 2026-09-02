import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { SupplierCard } from '../../components/supplier/SupplierCard';
import { Button } from '../../components/ui/Button';
import {
  ShieldCheck,
  Search,
  Zap,
  Droplets,
  Wind,
  FlaskConical,
  HardHat,
  Filter,
} from 'lucide-react';

export const SuppliersPage: React.FC<{ onRequestQuote: (supplier?: any, category?: string) => void }> = ({ onRequestQuote }) => {
  const { companies } = useAppData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [emirateFilter, setEmirateFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const allSuppliers = companies.filter(c => c.companyType === 'supplier');

  const categories = [
    { id: 'All', label: 'All Categories', count: allSuppliers.length },
    { id: 'Electrical', label: '⚡ Electrical', count: allSuppliers.filter(s => s.categories.includes('Electrical')).length, desc: 'Ducab LV/MV cables, Schneider MCBs, 60x60 LED panels, GI cable containment' },
    { id: 'Plumbing', label: '🚿 Plumbing & Sanitary', count: allSuppliers.filter(s => s.categories.includes('Plumbing')).length, desc: 'PPR PN20 water pipes, UPVC drainage, valves, pumps & sanitary fittings' },
    { id: 'HVAC', label: '❄️ HVAC & Mechanical', count: allSuppliers.filter(s => s.categories.includes('HVAC')).length, desc: 'Galvanized ductwork, VRF copper piping, R410a refrigerants, thermal insulation' },
    { id: 'Chemicals', label: '🧪 Chemicals & Adhesives', count: allSuppliers.filter(s => s.categories.includes('Chemicals')).length, desc: 'PU sealants, waterproofing slurries, epoxy screeds & industrial cleaning chemicals' },
    { id: 'Safety & PPE', label: '🦺 Safety, PPE & Other', count: allSuppliers.filter(s => s.categories.includes('Safety & PPE') || s.categories.includes('Other')).length, desc: 'Site PPE, safety helmets, power tools, fasteners & consumables' },
  ];

  const emirates = ['All', 'Dubai', 'Sharjah', 'Ajman'];

  const filteredSuppliers = allSuppliers.filter(s => {
    const matchesCategory = selectedCategory === 'All' || s.categories.includes(selectedCategory) || (selectedCategory === 'Safety & PPE' && s.categories.includes('Other'));
    const matchesEmirate = emirateFilter === 'All' || s.emirate === emirateFilter;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.categories.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())) ||
      s.industrialZone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.address && s.address.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesEmirate && matchesSearch;
  });

  const activeCategoryObj = categories.find(c => c.id === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 w-fit mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% UAE DET Commercial Trade License Verified
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Verified UAE Suppliers Directory</h1>
          <p className="text-sm text-slate-500 mt-1">
            Search verified stockists, factory importers, and distributors across Electrical, Plumbing, HVAC, Chemicals, and Site Supplies.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => onRequestQuote(undefined, selectedCategory !== 'All' ? selectedCategory : undefined)}
          leftIcon={<Zap className="w-4 h-4 text-amber-300" />}
          className="font-bold whitespace-nowrap self-start md:self-auto"
        >
          Post an RFQ to All Verified Suppliers
        </Button>
      </div>

      {/* Category Tabs Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Filter by Material Category:
          </span>
          <span className="text-xs text-slate-400 font-medium">
            Showing {filteredSuppliers.length} Verified Stockists
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-3 rounded-2xl border text-left transition-all duration-150 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-brand-500/20'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className={`text-xs font-extrabold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {cat.label}
                </span>
                <span className={`text-[11px] font-bold mt-1 ${isSelected ? 'text-amber-400' : 'text-brand-600'}`}>
                  {cat.count} Verified
                </span>
              </button>
            );
          })}
        </div>

        {activeCategoryObj?.desc && (
          <div className="p-3 bg-brand-50/70 border border-brand-200 rounded-xl text-xs text-brand-900 flex items-center gap-2">
            <span className="font-bold shrink-0">Included Materials:</span>
            <span>{activeCategoryObj.desc}</span>
          </div>
        )}
      </div>

      {/* Search & Location Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by company name, material (cables, pipes, duct, chemicals), or industrial zone (Al Quoz, Sharjah, Mussafah)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
          <span className="text-slate-500 font-semibold whitespace-nowrap">Emirate:</span>
          {emirates.map(em => (
            <button
              key={em}
              onClick={() => setEmirateFilter(em)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                emirateFilter === em
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {em}
            </button>
          ))}
        </div>
      </div>

      {/* Suppliers Grid */}
      {filteredSuppliers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map((supplier) => (
            <SupplierCard
              key={supplier.id}
              supplier={supplier}
              onRequestQuote={(s) => onRequestQuote(s, s.categories[0])}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center font-bold">
            <Zap className="w-7 h-7" />
          </div>
          <div className="space-y-1.5 max-w-lg mx-auto">
            <h3 className="text-lg font-bold text-slate-900">Verified UAE Vendor Network</h3>
            <p className="text-xs text-slate-500">
              Are you a UAE material importer, stockist, or distributor? Register your company to be listed in our verified directory and receive contractor RFQs directly on your sales desk.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onRequestQuote(undefined, selectedCategory !== 'All' ? selectedCategory : undefined)}
              leftIcon={<Zap className="w-4 h-4 text-amber-300" />}
            >
              Post an RFQ to All UAE Vendors
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCategory('All');
                setEmirateFilter('All');
                setSearchTerm('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};