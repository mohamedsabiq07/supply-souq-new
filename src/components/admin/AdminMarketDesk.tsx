import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { TelemetryItem, TelemetryCategory, TelemetrySource } from '../../types';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import {
  Activity,
  Zap,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  Edit3,
  RotateCcw,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Clock,
  Sparkles,
  DollarSign,
  Radio,
  Flame,
  Layers,
  Fuel,
  Cpu
} from 'lucide-react';

export const AdminMarketDesk: React.FC = () => {
  const {
    telemetryItems,
    updateTelemetryItem,
    addTelemetryItem,
    deleteTelemetryItem,
    toggleTelemetryActive,
    resetTelemetryToDefaults,
    isMicroTickActive,
    setIsMicroTickActive,
    computedPlatformMetrics,
  } = useAppData();

  // Filter state
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TelemetryItem | null>(null);

  // Form State
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');
  const [change, setChange] = useState('');
  const [isPositive, setIsPositive] = useState(true);
  const [category, setCategory] = useState<TelemetryCategory>('building');
  const [source, setSource] = useState<TelemetrySource>('admin_manual');
  const [basePrice, setBasePrice] = useState<string>('');
  const [currency, setCurrency] = useState('AED');
  const [unit, setUnit] = useState('MT');
  const [isActive, setIsActive] = useState(true);

  // Open modal for new item
  const handleOpenAdd = () => {
    setEditingItem(null);
    setLabel('');
    setValue('AED 2,450 / MT');
    setChange('STABLE');
    setIsPositive(true);
    setCategory('building');
    setSource('admin_manual');
    setBasePrice('2450');
    setCurrency('AED');
    setUnit('MT');
    setIsActive(true);
    setIsModalOpen(true);
  };

  // Open modal for editing existing item
  const handleOpenEdit = (item: TelemetryItem) => {
    setEditingItem(item);
    setLabel(item.label);
    setValue(item.value);
    setChange(item.change);
    setIsPositive(item.isPositive);
    setCategory(item.category);
    setSource(item.source);
    setBasePrice(item.basePrice ? String(item.basePrice) : '');
    setCurrency(item.currency || 'AED');
    setUnit(item.unit || 'MT');
    setIsActive(item.isActive);
    setIsModalOpen(true);
  };

  // Save Add/Edit
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !value.trim()) return;

    const numBase = basePrice ? parseFloat(basePrice) : undefined;

    if (editingItem) {
      updateTelemetryItem(editingItem.id, {
        label: label.trim().toUpperCase(),
        value: value.trim(),
        change: change.trim() || 'STABLE',
        isPositive,
        category,
        source,
        basePrice: numBase,
        currency,
        unit,
        isActive,
      });
    } else {
      addTelemetryItem({
        label: label.trim().toUpperCase(),
        value: value.trim(),
        change: change.trim() || 'STABLE',
        isPositive,
        category,
        source,
        basePrice: numBase,
        currency,
        unit,
        isActive,
      });
    }

    setIsModalOpen(false);
  };

  // 1-Click Preset Injections
  const handleInjectPreset = (preset: {
    label: string;
    value: string;
    change: string;
    isPositive: boolean;
    category: TelemetryCategory;
    basePrice: number;
    currency: string;
    unit: string;
  }) => {
    addTelemetryItem({
      ...preset,
      source: 'admin_manual',
      isActive: true,
    });
  };

  const filteredItems = telemetryItems.filter((item) => {
    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesSrc = sourceFilter === 'all' || item.source === sourceFilter;
    return matchesCat && matchesSrc;
  });

  const activeCount = telemetryItems.filter((i) => i.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[#00ffae] animate-ping" />
              <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                <Radio className="w-6 h-6 text-[#00ffae]" />
                Live Market Telemetry & Intelligence Desk
              </h2>
              <span className="bg-[#00ffae]/20 text-[#00ffae] font-bold text-[10px] px-2.5 py-0.5 rounded border border-[#00ffae]/30">
                Active Ribbon Controller
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Broadcast live UAE construction material indices, automated LME metal feeds, and dynamically calculated platform savings across the top ribbon of the website for all visiting contractors and suppliers.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={resetTelemetryToDefaults}
              className="bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700 text-xs font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Reset Defaults
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenAdd}
              className="bg-[#00ffae] text-slate-950 hover:bg-[#00e099] font-black text-xs shadow-glow-mint"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Benchmark Item
            </Button>
          </div>
        </div>

        {/* Live Top Ribbon Preview */}
        <div className="pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
            <span className="font-mono font-bold flex items-center gap-1.5 text-[#00ffae]">
              <span className="w-2 h-2 rounded-full bg-[#00ffae] inline-block animate-pulse" />
              LIVE SITE PREVIEW ({activeCount} items active in top ribbon)
            </span>
            <span className="text-slate-500 font-mono text-[10px]">Changes appear instantly on the live website</span>
          </div>

          <div className="bg-[#020f0c] border border-[#00ffae]/20 rounded-xl p-2.5 overflow-hidden shadow-inner">
            <div className="flex items-center gap-6 overflow-x-auto py-1 scrollbar-none">
              {telemetryItems
                .filter((i) => i.isActive)
                .map((item) => (
                  <div key={item.id} className="flex items-center gap-2 shrink-0 text-xs text-slate-300">
                    <span className="text-slate-400 font-semibold">{item.label}:</span>
                    <span className="font-mono font-bold text-white tracking-wide">{item.value}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                        item.isPositive
                          ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/30'
                          : 'text-rose-400 bg-rose-950/60 border border-rose-500/30'
                      }`}
                    >
                      {item.change}
                    </span>
                    <span className="text-slate-700">/</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Dynamic Platform Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Dynamic Savings */}
        <Card className="border-emerald-200 bg-emerald-50/40">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Contractor Savings
              </span>
              <span className="bg-emerald-200 text-emerald-900 text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                Live Auto-Calc
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {computedPlatformMetrics.avgSavingsPercent}%
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">
              Calculated dynamically from wholesale bid spread across all active contractor RFQs.
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Verified Stockists */}
        <Card className="border-cyan-200 bg-cyan-50/40">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-600" />
                Verified Stockists
              </span>
              <span className="bg-cyan-200 text-cyan-900 text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                DET / DED
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {computedPlatformMetrics.verifiedStockistsCount}
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">
              Live stockist accounts registered in Sharjah Industrial Area, Al Quoz, and JAFZA.
            </p>
          </CardContent>
        </Card>

        {/* Card 3: SLA Turnaround */}
        <Card className="border-amber-200 bg-amber-50/40">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                24H SLA Compliance
              </span>
              <span className="bg-amber-200 text-amber-900 text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                Liquidity Desk
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {computedPlatformMetrics.slaCompliancePercent}%
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">
              Proportion of RFQs receiving competitive supplier quotes within the 24-hour guarantee.
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Micro-Tick Engine Controller */}
        <Card className="border-purple-200 bg-purple-50/40">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-800 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-purple-600" />
                Micro-Tick Engine
              </span>
              <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${isMicroTickActive ? 'bg-purple-200 text-purple-900' : 'bg-slate-200 text-slate-600'}`}>
                {isMicroTickActive ? 'RUNNING' : 'PAUSED'}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div>
                <div className="text-sm font-bold text-slate-900">Exchange Simulation</div>
                <div className="text-[10px] text-slate-500">Fluctuates LME & energy feeds ±0.15%</div>
              </div>
              <button
                type="button"
                onClick={() => setIsMicroTickActive(!isMicroTickActive)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  isMicroTickActive ? 'bg-purple-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    isMicroTickActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 1-Click UAE Commodity Benchmark Presets */}
      <Card>
        <CardHeader className="py-3 px-5 border-b bg-slate-50/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                1-Click UAE Market Presets (Sharjah & Al Quoz Stockists)
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">Quick-inject verified local wholesale benchmarks</span>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            <button
              onClick={() =>
                handleInjectPreset({
                  label: 'EMIRATES STEEL REBAR (12-32mm)',
                  value: 'AED 2,450 / MT',
                  change: 'STABLE',
                  isPositive: true,
                  category: 'building',
                  basePrice: 2450,
                  currency: 'AED',
                  unit: 'MT',
                })
              }
              className="p-3 text-left rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-900 group-hover:text-brand-600">🏗️ Emirates Steel Rebar</span>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">AED 2,450 / MT</span>
              </div>
              <p className="text-[10px] text-slate-500">BS4449 Grade 500B / CARES Certified</p>
            </button>

            <button
              onClick={() =>
                handleInjectPreset({
                  label: 'DUCAB 4-CORE 16MM² XLPE',
                  value: 'AED 38.50 / M',
                  change: '+0.50%',
                  isPositive: true,
                  category: 'electrical',
                  basePrice: 38.5,
                  currency: 'AED',
                  unit: 'M',
                })
              }
              className="p-3 text-left rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-900 group-hover:text-brand-600">⚡ Ducab 4-Core Cable</span>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">AED 38.50 / M</span>
              </div>
              <p className="text-[10px] text-slate-500">DEWA / SEWA Spec 600/1000V Armoured</p>
            </button>

            <button
              onClick={() =>
                handleInjectPreset({
                  label: 'OPC CEMENT 50KG (NATIONAL)',
                  value: 'AED 14.20 / BAG',
                  change: '+0.70%',
                  isPositive: true,
                  category: 'building',
                  basePrice: 14.2,
                  currency: 'AED',
                  unit: 'BAG',
                })
              }
              className="p-3 text-left rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-900 group-hover:text-brand-600">🧱 National OPC Cement</span>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">AED 14.20 / Bag</span>
              </div>
              <p className="text-[10px] text-slate-500">Ordinary Portland Cement 50kg Bags</p>
            </button>

            <button
              onClick={() =>
                handleInjectPreset({
                  label: 'COMMERCIAL DIESEL (ENOC/ADNOC)',
                  value: 'AED 3.12 / L',
                  change: '-0.95%',
                  isPositive: false,
                  category: 'energy',
                  basePrice: 3.12,
                  currency: 'AED',
                  unit: 'L',
                })
              }
              className="p-3 text-left rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-900 group-hover:text-brand-600">⛽ Bulk Site Diesel</span>
                <span className="text-[10px] font-mono text-rose-600 font-bold">AED 3.12 / L</span>
              </div>
              <p className="text-[10px] text-slate-500">10ppm Ultra-Low Sulfur Generator Fuel</p>
            </button>

            <button
              onClick={() =>
                handleInjectPreset({
                  label: 'KNAUF GYPSUM BOARD 12.5MM',
                  value: 'AED 18.50 / SHEET',
                  change: 'STABLE',
                  isPositive: true,
                  category: 'building',
                  basePrice: 18.5,
                  currency: 'AED',
                  unit: 'SHEET',
                })
              }
              className="p-3 text-left rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-900 group-hover:text-brand-600">📐 Knauf Gypsum Board</span>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">AED 18.50 / Sheet</span>
              </div>
              <p className="text-[10px] text-slate-500">1.2m x 2.4m Standard Drywall Partition</p>
            </button>

            <button
              onClick={() =>
                handleInjectPreset({
                  label: 'WHITE WOOD TIMBER 2X4 (SHARJAH)',
                  value: 'AED 880 / M3',
                  change: '+1.15%',
                  isPositive: true,
                  category: 'building',
                  basePrice: 880,
                  currency: 'AED',
                  unit: 'M3',
                })
              }
              className="p-3 text-left rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-900 group-hover:text-brand-600">🌲 White Wood Timber</span>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">AED 880 / M3</span>
              </div>
              <p className="text-[10px] text-slate-500">Romanian / European Softwood Formwork</p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Main Telemetry Table */}
      <Card>
        <CardHeader className="p-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Active Benchmark Records ({filteredItems.length})
              </h3>
              <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full font-bold">
                {activeCount} Active in Marquee
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium"
              >
                <option value="all">All Categories</option>
                <option value="metal">Metal & Steel</option>
                <option value="building">Building Materials</option>
                <option value="electrical">Electrical & Cables</option>
                <option value="energy">Energy & Fuel</option>
                <option value="platform">Platform Metrics</option>
                <option value="sla">SLA & Standards</option>
              </select>

              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium"
              >
                <option value="all">All Sources</option>
                <option value="admin_manual">Admin Manual</option>
                <option value="dynamic_platform">Dynamic Platform</option>
                <option value="financial_feed">Financial Feed</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Commodity / Benchmark Name</th>
                <th className="py-3 px-4">Current Published Rate</th>
                <th className="py-3 px-4">Movement</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className={`hover:bg-slate-50/60 transition-colors ${!item.isActive ? 'opacity-50' : ''}`}>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleTelemetryActive(item.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 transition-all ${
                        item.isActive
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${item.isActive ? 'bg-emerald-600 animate-pulse' : 'bg-slate-500'}`} />
                      {item.isActive ? 'ON AIR' : 'HIDDEN'}
                    </button>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span>{item.label}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-extrabold text-slate-900">
                    {item.value}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded ${
                        item.isPositive
                          ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                          : 'text-rose-700 bg-rose-50 border border-rose-200'
                      }`}
                    >
                      {item.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {item.change}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {item.source === 'admin_manual' && '✍️ Admin Manual'}
                      {item.source === 'dynamic_platform' && '⚡ Dynamic DB'}
                      {item.source === 'financial_feed' && '🌐 Exchange Feed'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="capitalize text-[11px] text-slate-600 font-medium">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(item)}
                      className="text-[11px] py-1 px-2.5 text-slate-700 hover:text-brand-600"
                    >
                      <Edit3 className="w-3.5 h-3.5 mr-1" />
                      Edit Rate
                    </Button>
                    <button
                      onClick={() => deleteTelemetryItem(item.id)}
                      className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Add / Edit Benchmark Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingItem ? `Edit Benchmark Rate: ${editingItem.label}` : 'Add New Market Telemetry Benchmark'}
        >
          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Commodity / Material Label *
              </label>
              <input
                type="text"
                required
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. EMIRATES STEEL REBAR (12-32MM)"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-brand-500 uppercase"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Published Display Value *
                </label>
                <input
                  type="text"
                  required
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="e.g. AED 2,450 / MT"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Movement / Change Tag *
                </label>
                <input
                  type="text"
                  required
                  value={change}
                  onChange={(e) => setChange(e.target.value)}
                  placeholder="e.g. +1.18% or STABLE"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Numeric Base Price
                </label>
                <input
                  type="number"
                  step="any"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  placeholder="2450"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-brand-500"
                >
                  <option value="AED">AED</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Unit
                </label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="MT, M, Bag, Sheet, L"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Trend Indicator
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPositive(true)}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                      isPositive
                        ? 'bg-emerald-500 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    Positive (Green)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPositive(false)}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                      !isPositive
                        ? 'bg-rose-500 text-white border-rose-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    Negative (Red)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TelemetryCategory)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-brand-500"
                >
                  <option value="building">Building Materials</option>
                  <option value="metal">Metal & Steel</option>
                  <option value="electrical">Electrical & Cables</option>
                  <option value="energy">Energy & Fuel</option>
                  <option value="platform">Platform Metrics</option>
                  <option value="sla">SLA & Standards</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Data Feed Source
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as TelemetrySource)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-brand-500"
                >
                  <option value="admin_manual">Admin Manual</option>
                  <option value="financial_feed">Financial Exchange Feed</option>
                  <option value="dynamic_platform">Dynamic Platform DB</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isActiveCheckbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
              />
              <label htmlFor="isActiveCheckbox" className="text-xs font-bold text-slate-800">
                Immediately broadcast in top website marquee ribbon
              </label>
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="font-bold text-xs"
              >
                {editingItem ? 'Save & Broadcast Rate' : 'Add to Live Ribbon'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
