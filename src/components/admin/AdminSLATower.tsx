import React, { useState, useMemo } from 'react';
import { RFQ, Company, RFQItem } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { formatDate } from '../../lib/utils';
import {
  Clock,
  Share2,
  UserPlus,
  Edit3,
  Search,
  Building2,
  MapPin,
} from 'lucide-react';

interface AdminSLATowerProps {
  rfqs: RFQ[];
  companies: Company[];
  onUpdateRFQ?: (updatedRFQ: RFQ) => void;
  onNavigateToRFQ?: (rfqId: string) => void;
}

export const AdminSLATower: React.FC<AdminSLATowerProps> = ({
  rfqs,
  companies,
  onUpdateRFQ,
}) => {
  const [filterSLA, setFilterSLA] = useState<'all' | 'critical' | 'warning' | 'healthy' | 'zero_quotes'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [assignRFQ, setAssignRFQ] = useState<RFQ | null>(null);
  const [cleanseRFQ, setCleanseRFQ] = useState<RFQ | null>(null);

  // Cleanse line items local state
  const [cleanseItems, setCleanseItems] = useState<RFQItem[]>([]);
  const [cleanseTitle, setCleanseTitle] = useState('');
  const [cleanseNotes, setCleanseNotes] = useState('');

  // Manual assign local state
  const [selectedSupplierIds, setSelectedSupplierIds] = useState<string[]>([]);

  // Suppliers list for assignment
  const verifiedSuppliers = useMemo(() => {
    return companies.filter(c => c.companyType === 'supplier' || c.companyType === 'both');
  }, [companies]);

  // SLA calculation helper
  const getSLAInfo = (createdAt: string, quotesCount: number = 0) => {
    const createdTime = new Date(createdAt).getTime();
    const now = Date.now();
    const elapsedMs = Math.max(0, now - createdTime);
    const elapsedHours = elapsedMs / (1000 * 60 * 60);
    const remainingMs = Math.max(0, (24 * 60 * 60 * 1000) - elapsedMs);
    const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
    const remainingMins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

    let tier: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (elapsedHours >= 18 || (elapsedHours >= 10 && quotesCount === 0)) {
      tier = 'critical';
    } else if (elapsedHours >= 6 || (elapsedHours >= 4 && quotesCount === 0)) {
      tier = 'warning';
    }

    return {
      elapsedHours,
      remainingHours,
      remainingMins,
      tier,
      isExpired: remainingMs <= 0,
      displayTime: `${remainingHours}h ${remainingMins}m left`,
    };
  };

  // Filtered RFQs
  const filteredRFQs = useMemo(() => {
    return rfqs.filter((r) => {
      const sla = getSLAInfo(r.createdAt, r.quotesCount || 0);
      const matchesSearch =
        !searchTerm ||
        r.rfqNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.buyerCompanyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.deliveryEmirate.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (filterSLA === 'critical') return sla.tier === 'critical';
      if (filterSLA === 'warning') return sla.tier === 'warning';
      if (filterSLA === 'healthy') return sla.tier === 'healthy';
      if (filterSLA === 'zero_quotes') return (r.quotesCount || 0) === 0;
      return true;
    });
  }, [rfqs, filterSLA, searchTerm]);

  // SLA Counts
  const criticalCount = rfqs.filter(r => getSLAInfo(r.createdAt, r.quotesCount || 0).tier === 'critical').length;
  const warningCount = rfqs.filter(r => getSLAInfo(r.createdAt, r.quotesCount || 0).tier === 'warning').length;
  const zeroQuoteCount = rfqs.filter(r => (r.quotesCount || 0) === 0).length;

  // Open Cleanse Modal
  const handleOpenCleanse = (rfq: RFQ) => {
    setCleanseRFQ(rfq);
    setCleanseTitle(rfq.title);
    setCleanseNotes(rfq.notes || '');
    setCleanseItems([...rfq.items]);
  };

  // Save Cleanse Changes
  const handleSaveCleanse = () => {
    if (!cleanseRFQ || !onUpdateRFQ) return;
    const updated: RFQ = {
      ...cleanseRFQ,
      title: cleanseTitle,
      notes: cleanseNotes,
      items: cleanseItems,
      updatedAt: new Date().toISOString(),
    };
    onUpdateRFQ(updated);
    setCleanseRFQ(null);
  };

  // Open Assign Modal
  const handleOpenAssign = (rfq: RFQ) => {
    setAssignRFQ(rfq);
    setSelectedSupplierIds(rfq.matchedSupplierCompanyIds || []);
  };

  // Save Manual Assignment
  const handleSaveAssign = () => {
    if (!assignRFQ || !onUpdateRFQ) return;
    const assignedNames = verifiedSuppliers
      .filter(s => selectedSupplierIds.includes(s.id))
      .map(s => s.name);

    const updated: RFQ = {
      ...assignRFQ,
      matchedSupplierCompanyIds: selectedSupplierIds,
      matchedSupplierNames: assignedNames,
      invitedCount: Math.max(assignRFQ.invitedCount, selectedSupplierIds.length),
      updatedAt: new Date().toISOString(),
    };
    onUpdateRFQ(updated);
    setAssignRFQ(null);
  };

  // Generate WhatsApp text for stockist nudge
  const getWhatsAppURL = (rfq: RFQ) => {
    const itemsPreview = rfq.items.map(i => `${i.quantity} ${i.unit} ${i.description}`).slice(0, 2).join(', ');
    const message = `🚨 *URGENT RFQ ALERT — SupplySouq UAE*\n\n` +
      `Contractor: *${rfq.buyerCompanyName}*\n` +
      `RFQ: *#${rfq.rfqNumber}* — ${rfq.title}\n` +
      `Delivery Gate: *${rfq.deliveryAddress} (${rfq.deliveryEmirate})*\n` +
      `Items: ${itemsPreview}...\n\n` +
      `⚡ *Fastest 5 Bids Rule Active* (${rfq.quotesCount || 0}/5 quotes submitted).\n` +
      `Open your supplier portal to submit quote before slot closes:\n` +
      `https://supplysouq.ae/#supplier-inbox`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="space-y-6">
      {/* SLA Hero Telemetry Banner */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <h3 className="text-base sm:text-lg font-extrabold tracking-tight flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                24-Hour SLA Operations Control Tower
              </h3>
              <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                Liquidity Desk
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Ensure 100% liquidity by monitoring contractor schedules. If an RFQ has zero quotes within 12 hours, trigger an immediate 1-click WhatsApp broadcast to Sharjah Industrial & Al Quoz stockists.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2.5 text-xs shrink-0">
            <div className="bg-rose-500/20 border border-rose-500/40 px-3 py-2 rounded-xl text-rose-300 text-center">
              <div className="text-lg font-black">{criticalCount}</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider">Critical SLA</div>
            </div>
            <div className="bg-amber-500/20 border border-amber-500/40 px-3 py-2 rounded-xl text-amber-300 text-center">
              <div className="text-lg font-black">{warningCount}</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider">Warning</div>
            </div>
            <div className="bg-sky-500/20 border border-sky-500/40 px-3 py-2 rounded-xl text-sky-300 text-center">
              <div className="text-lg font-black">{zeroQuoteCount}</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider">Zero Bids</div>
            </div>
          </div>
        </div>
      </div>

      {/* SLA Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterSLA('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filterSLA === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All RFQs ({rfqs.length})
          </button>
          <button
            onClick={() => setFilterSLA('critical')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all ${
              filterSLA === 'critical'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            Critical SLA ({criticalCount})
          </button>
          <button
            onClick={() => setFilterSLA('warning')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all ${
              filterSLA === 'warning'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            Warning ({warningCount})
          </button>
          <button
            onClick={() => setFilterSLA('zero_quotes')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all ${
              filterSLA === 'zero_quotes'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
            }`}
          >
            Zero Quotes ({zeroQuoteCount})
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search RFQ, contractor, emirate..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs w-full sm:w-64 focus:ring-2 focus:ring-brand-500 font-medium"
          />
        </div>
      </div>

      {/* RFQ SLA Monitor Table */}
      <Card className="shadow-lg border-slate-200">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">RFQ & Buyer</th>
                <th className="p-3.5">Category & Items</th>
                <th className="p-3.5">24h SLA Countdown</th>
                <th className="p-3.5">Quotes Slot</th>
                <th className="p-3.5 text-right">Liquidity Operations Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRFQs.map((rfq) => {
                const sla = getSLAInfo(rfq.createdAt, rfq.quotesCount || 0);

                return (
                  <tr key={rfq.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* RFQ & Buyer Details */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {rfq.rfqNumber}
                        </span>
                        <span className="text-[10px] font-bold text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                          {rfq.deliveryEmirate}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 max-w-[260px] truncate" title={rfq.title}>
                        {rfq.title}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span>{rfq.buyerCompanyName}</span>
                      </div>
                    </td>

                    {/* Category & Line Items */}
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-800 block truncate max-w-[200px]">
                        {rfq.category}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {rfq.items.length} Line Items • Site Gate: {rfq.deliveryAddress}
                      </span>
                    </td>

                    {/* 24-Hour SLA Countdown Flag */}
                    <td className="p-3.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            sla.tier === 'critical'
                              ? 'bg-rose-500 animate-ping'
                              : sla.tier === 'warning'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`} />
                          <span className={`font-mono font-bold text-xs ${
                            sla.tier === 'critical'
                              ? 'text-rose-700 font-extrabold'
                              : sla.tier === 'warning'
                              ? 'text-amber-700'
                              : 'text-emerald-700'
                          }`}>
                            {sla.displayTime}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Posted: {formatDate(rfq.createdAt)} (~{Math.round(sla.elapsedHours)}h ago)
                        </div>
                      </div>
                    </td>

                    {/* Quotes Status / Fastest 5 Capacity */}
                    <td className="p-3.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                            (rfq.quotesCount || 0) === 0
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : (rfq.quotesCount || 0) >= 5
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            ⚡ {rfq.quotesCount || 0} of 5 Bids Claimed
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {rfq.invitedCount || 5} Stockists Matched
                        </div>
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                      {/* 1-Click WhatsApp Stockist Nudge */}
                      <a
                        href={getWhatsAppURL(rfq)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm transition-all"
                        title="Broadcast urgent RFQ notification to UAE WhatsApp stockist network"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>WhatsApp Nudge</span>
                      </a>

                      {/* Manual Stockist Assignment */}
                      <button
                        type="button"
                        onClick={() => handleOpenAssign(rfq)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-[11px] transition-all"
                        title="Manually assign & invite additional stockists"
                      >
                        <UserPlus className="w-3 h-3 text-brand-600" />
                        <span>Assign</span>
                      </button>

                      {/* BOQ Cleansing Tool */}
                      <button
                        type="button"
                        onClick={() => handleOpenCleanse(rfq)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-[11px] transition-all"
                        title="Review, sanitize line items and standardise units"
                      >
                        <Edit3 className="w-3 h-3 text-amber-600" />
                        <span>Cleanse BOQ</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* ---------------- MODAL 1: MANUAL STOCKIST ASSIGNMENT ---------------- */}
      {assignRFQ && (
        <Modal
          isOpen={Boolean(assignRFQ)}
          onClose={() => setAssignRFQ(null)}
          title={`Manual Stockist Assignment: ${assignRFQ.rfqNumber}`}
          subtitle="Invite verified stockists in Al Quoz & Sharjah to quote this schedule"
          maxWidth="xl"
        >
          <div className="space-y-4 text-xs">
            <div className="bg-brand-50 p-3 rounded-xl border border-brand-200 text-brand-950">
              <span className="font-bold block">{assignRFQ.title}</span>
              <span className="text-[11px] text-slate-600">
                Category: <strong>{assignRFQ.category}</strong> • Delivery: <strong>{assignRFQ.deliveryAddress} ({assignRFQ.deliveryEmirate})</strong>
              </span>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Select Verified Stockists to Invite:
              </label>
              <div className="max-h-56 overflow-y-auto space-y-1.5 border border-slate-200 rounded-xl p-2 bg-slate-50">
                {verifiedSuppliers.map((supp) => {
                  const isChecked = selectedSupplierIds.includes(supp.id);
                  return (
                    <label
                      key={supp.id}
                      className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-brand-50/80 border-brand-500 font-bold text-brand-900'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setSelectedSupplierIds(selectedSupplierIds.filter(id => id !== supp.id));
                            } else {
                              setSelectedSupplierIds([...selectedSupplierIds, supp.id]);
                            }
                          }}
                          className="rounded text-brand-600 focus:ring-brand-500"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900">{supp.name}</div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{supp.industrialZone}, {supp.emirate}</span>
                            <span>• ★ {supp.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-600">
                        {supp.tradeLicenseNumber}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Button variant="outline" onClick={() => setAssignRFQ(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveAssign}>
                Confirm & Invite {selectedSupplierIds.length} Stockists
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ---------------- MODAL 2: BOQ REVIEW & CLEANSING TOOL ---------------- */}
      {cleanseRFQ && (
        <Modal
          isOpen={Boolean(cleanseRFQ)}
          onClose={() => setCleanseRFQ(null)}
          title={`RFQ Cleansing & Line Item Standardization: ${cleanseRFQ.rfqNumber}`}
          subtitle="Sanitize descriptions, fix blurry photos, and enforce standard UAE procurement units"
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Standardized RFQ Title</label>
              <input
                type="text"
                value={cleanseTitle}
                onChange={(e) => setCleanseTitle(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 font-bold text-xs focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Contractor Notes & Standard Specifications</label>
              <textarea
                rows={2}
                value={cleanseNotes}
                onChange={(e) => setCleanseNotes(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 text-xs focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Itemized Specifications & Standard Units</label>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {cleanseItems.map((item, idx) => (
                  <div key={item.id || idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                    <div className="sm:col-span-6">
                      <span className="text-[10px] text-slate-400 font-medium">Description</span>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => {
                          const next = [...cleanseItems];
                          next[idx].description = e.target.value;
                          setCleanseItems(next);
                        }}
                        className="w-full p-1.5 rounded border border-slate-300 text-xs font-semibold"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <span className="text-[10px] text-slate-400 font-medium">Quantity</span>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const next = [...cleanseItems];
                          next[idx].quantity = parseFloat(e.target.value) || 1;
                          setCleanseItems(next);
                        }}
                        className="w-full p-1.5 rounded border border-slate-300 text-xs text-right font-bold"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <span className="text-[10px] text-slate-400 font-medium">Unit</span>
                      <select
                        value={item.unit}
                        onChange={(e) => {
                          const next = [...cleanseItems];
                          next[idx].unit = e.target.value as any;
                          setCleanseItems(next);
                        }}
                        className="w-full p-1.5 rounded border border-slate-300 text-xs font-semibold bg-white"
                      >
                        <option value="m">m (meters)</option>
                        <option value="pcs">pcs (pieces)</option>
                        <option value="coils">coils</option>
                        <option value="drums">drums</option>
                        <option value="tons">tons</option>
                        <option value="sets">sets</option>
                        <option value="cartons">cartons</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <span className="text-[10px] text-slate-400 font-medium">Approved Brand</span>
                      <input
                        type="text"
                        value={item.preferredBrand || ''}
                        onChange={(e) => {
                          const next = [...cleanseItems];
                          next[idx].preferredBrand = e.target.value;
                          setCleanseItems(next);
                        }}
                        placeholder="e.g. Ducab"
                        className="w-full p-1.5 rounded border border-slate-300 text-xs font-medium"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Button variant="outline" onClick={() => setCleanseRFQ(null)}>
                Cancel
              </Button>
              <Button variant="amber" onClick={handleSaveCleanse}>
                Save Cleansed Schedule & Update RFQ
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
