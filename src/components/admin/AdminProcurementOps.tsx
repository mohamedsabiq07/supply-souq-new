import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatAED, formatDate } from '../../lib/utils';
import {
  RFQ,
  Quotation,
  CustomerOffer,
  CustomerPurchaseOrder,
  SupplierPurchaseOrder,
  OrderFulfilment,
  FulfilmentStage,
  FulfilmentMode,
} from '../../types';
import {
  ClipboardList,
  Send,
  FileCheck2,
  Scale,
  Calculator,
  ShoppingBag,
  FileSpreadsheet,
  Truck,
  TrendingUp,
  Settings,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Download,
  Upload,
  UserCheck,
  Building2,
  ShieldCheck,
  Clock,
  FileText,
  ArrowRight,
  Lock,
  Sparkles,
  Check,
  X,
  Eye,
  Package,
  DollarSign,
  History,
  MessageSquare,
} from 'lucide-react';

type OpsSubTab =
  | 'overview'
  | 'incoming_rfqs'
  | 'request_quotes'
  | 'technical_review'
  | 'comparison_builder'
  | 'customer_offers'
  | 'orders_pos'
  | 'fulfilment_delivery'
  | 'messages_desk'
  | 'profitability'
  | 'commercial_settings';

export const AdminProcurementOps: React.FC = () => {
  const {
    rfqs,
    quotations,
    companies,
    messages,
    sendMessage,
    commercialSettings,
    supplierInvitations,
    quotationEvaluations,
    internalCosts,
    customerOffers,
    customerPOs,
    supplierPOs,
    orderFulfilments,
    deliveryRecords,
    deliveryDocuments,
    approvalHistory,
    updateCommercialSettings,
    updateRFQAdminWorkflow,
    inviteSuppliersToRFQ,
    uploadManualSupplierQuote,
    evaluateSupplierQuote,
    calculateAndSaveInternalCost,
    publishCustomerOffersForRFQ,
    approveCustomerPOAndCreateSupplierPO,
    updateFulfilmentStage,
    uploadDeliveryDocument,
  } = useAppData();

  const [subTab, setSubTab] = useState<OpsSubTab>('overview');
  const [selectedRfqId, setSelectedRfqId] = useState<string>(() => rfqs[0]?.id || 'rfq-v2-1001');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4500);
  };

  const activeRFQ = rfqs.find((r) => r.id === selectedRfqId) || rfqs[0];
  const rfqQuotes = quotations.filter(
    (q) => q.rfqId === activeRFQ?.id || q.rfqNumber === activeRFQ?.rfqNumber
  );
  const rfqInvitations = supplierInvitations.filter((inv) => inv.rfqId === activeRFQ?.id);
  const rfqOffers = customerOffers
    .filter((o) => o.rfqId === activeRFQ?.id)
    .sort((a, b) => a.offerSlot - b.offerSlot);

  // Staff assignment & clarification state
  const [staffAssignee, setStaffAssignee] = useState(
    activeRFQ?.assignedStaffName || 'Eng. Khalid Al-blooshi (Senior Procurement Specialist)'
  );
  const [clarificationText, setClarificationText] = useState(activeRFQ?.clarificationRequest || '');
  const [opsNotesText, setOpsNotesText] = useState(activeRFQ?.internalOpsNotes || '');
  const [quoteDeadlineInput, setQuoteDeadlineInput] = useState(
    activeRFQ?.supplierQuoteDeadline?.slice(0, 10) || '2026-10-18'
  );

  // Supplier invitation selection state
  const verifiedSuppliers = companies.filter(
    (c) => (c.companyType === 'supplier' || c.companyType === 'both') && c.verificationStatus === 'verified'
  );
  const [selectedSupplierIds, setSelectedSupplierIds] = useState<string[]>([]);
  const [inviteChannel, setInviteChannel] = useState<'portal' | 'email' | 'whatsapp_future'>('portal');

  // Manual Supplier Quote Upload Modal State
  const [showManualQuoteModal, setShowManualQuoteModal] = useState(false);
  const [manualSupplierId, setManualSupplierId] = useState(verifiedSuppliers[0]?.id || '');
  const [manualQuoteRef, setManualQuoteRef] = useState('');
  const [manualLeadDays, setManualLeadDays] = useState(3);
  const [manualDeliveryAED, setManualDeliveryAED] = useState(500);
  const [manualPaymentTerms, setManualPaymentTerms] = useState('30 Days PDC');
  const [manualWarranty, setManualWarranty] = useState('1 Year Standard Manufacturer Warranty');
  const [manualPdfName, setManualPdfName] = useState('Supplier_Official_Quotation_Signed.pdf');
  const [manualItemPrices, setManualItemPrices] = useState<Record<string, { price: number; brand: string; quoted: boolean }>>({});

  // Internal Pricing & Margin state per quote
  const [costEdits, setCostEdits] = useState<
    Record<
      string,
      {
        freightAED: number;
        otherCostAED: number;
        markupType: 'percentage' | 'fixed_fee' | 'hybrid';
        markupPercent: number;
        fixedFeeAED: number;
      }
    >
  >({});

  // Selected quote IDs for 5-quote comparison publishing
  const [selectedQuoteIdsForOffer, setSelectedQuoteIdsForOffer] = useState<string[]>([]);

  // Supplier PO Creation state
  const [spoFulfilmentMode, setSpoFulfilmentMode] = useState<Record<string, FulfilmentMode>>({});
  const [spoDispatchDate, setSpoDispatchDate] = useState<Record<string, string>>({});

  // Delivery tracking edit state
  const [logisticsEdit, setLogisticsEdit] = useState<
    Record<string, { provider: string; contact: string; phone: string; tracking: string; summary: string; isPartial: boolean }>
  >({});

  // Admin Hub-and-Spoke Messaging Desk state
  const [msgRoleFilter, setMsgRoleFilter] = useState<'all' | 'buyer' | 'supplier'>('all');
  const [selectedMsgCompanyId, setSelectedMsgCompanyId] = useState<string>('');
  const [adminReplyChannelId, setAdminReplyChannelId] = useState<string>('procuresouq-general-support');
  const [adminReplyText, setAdminReplyText] = useState<string>('');

  // Export Printable RFQ PDF Summary
  const handleDownloadRfqPdf = (rfq: RFQ) => {
    const win = window.open('', '_blank');
    if (!win) return;
    const rowsHtml = rfq.items
      .map(
        (item, idx) => `
        <tr>
          <td style="padding:8px;border:1px solid #cbd5e1;text-align:center;">${idx + 1}</td>
          <td style="padding:8px;border:1px solid #cbd5e1;font-weight:bold;">${item.description}</td>
          <td style="padding:8px;border:1px solid #cbd5e1;">${item.specification || '-'}</td>
          <td style="padding:8px;border:1px solid #cbd5e1;">${item.preferredBrand || 'Open / Approved Eq.'}</td>
          <td style="padding:8px;border:1px solid #cbd5e1;text-align:right;">${item.quantity} ${item.unit}</td>
        </tr>`
      )
      .join('');
    win.document.write(`
      <html>
        <head>
          <title>ProcureSouq Official Supplier RFQ — ${rfq.rfqNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; color: #0f172a; }
            h1 { color: #9e1c2e; margin-bottom: 4px; }
            .meta { background: #f8fafc; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px; margin: 16px 0; font-size: 13px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
            th { background: #0f172a; color: white; padding: 10px; text-align: left; }
          </style>
        </head>
        <body>
          <h1>PROCURESOUQ — REQUEST FOR QUOTATION (MANAGED DESK)</h1>
          <p style="font-size:13px;color:#475569;">Confidential Supplier Sourcing Tender • Buyer Identity Masked Per Managed Intermediary Policy</p>
          <div class="meta">
            <p><strong>RFQ Reference:</strong> ${rfq.rfqNumber}</p>
            <p><strong>Title:</strong> ${rfq.title}</p>
            <p><strong>Category:</strong> ${rfq.category} | <strong>Delivery Emirate:</strong> ${rfq.deliveryEmirate}</p>
            <p><strong>Required Delivery Date:</strong> ${rfq.requiredDeliveryDate} | <strong>Authority Approval:</strong> ${rfq.authorityApproval || 'Standard UAE'}</p>
            <p><strong>Special Requirements:</strong> ${rfq.specialRequirements || rfq.notes || 'Include UAE VAT treatment, delivery lead time, and stock availability.'}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Material Description</th>
                <th>Technical Specification</th>
                <th>Preferred Brand</th>
                <th>Qty & Unit</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
          <p style="margin-top:24px;font-size:12px;color:#64748b;">Issued by: ${commercialSettings.contractingEntityName} • Submit official quotation via ProcureSouq Supplier Portal.</p>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  // Handle Manual Supplier Quotation Submission by Admin
  const handleManualQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRFQ) return;
    const sup = verifiedSuppliers.find((s) => s.id === manualSupplierId) || verifiedSuppliers[0];
    if (!sup) return;

    const builtItems = activeRFQ.items.map((item, idx) => {
      const entry = manualItemPrices[item.id] || {
        price: 120,
        brand: item.preferredBrand?.split('/')[0]?.trim() || 'UAE Approved Brand',
        quoted: true,
      };
      const isQuoted = entry.quoted;
      const unitPrice = isQuoted ? Number(entry.price) || 0 : 0;
      const totalPriceAED = isQuoted ? Math.round(unitPrice * item.quantity * 100) / 100 : 0;
      return {
        id: `mqitem-${Date.now()}-${idx}`,
        rfqItemId: item.id,
        itemDescription: item.description,
        offeredBrand: isQuoted ? entry.brand : 'Not Quoted',
        isAlternative: false,
        isQuoted,
        unitPriceAED: unitPrice,
        quantity: item.quantity,
        unit: item.unit,
        totalPriceAED,
        lineTotalAED: totalPriceAED,
        leadTimeDays: manualLeadDays,
        remarks: isQuoted ? 'In Stock UAE' : 'Omitted / Not Quoted',
      };
    });

    const subtotalAED = builtItems.reduce((sum, i) => sum + i.lineTotalAED, 0);
    const vatAED = Math.round((subtotalAED + manualDeliveryAED) * 0.05 * 100) / 100;
    const grandTotalAED = Math.round((subtotalAED + manualDeliveryAED + vatAED) * 100) / 100;

    const created = uploadManualSupplierQuote({
      quoteReference: manualQuoteRef || `SUP-REF-${Math.floor(1000 + Math.random() * 9000)}`,
      rfqId: activeRFQ.id,
      rfqNumber: activeRFQ.rfqNumber,
      rfqTitle: activeRFQ.title,
      buyerCompanyId: activeRFQ.buyerCompanyId,
      buyerCompanyName: activeRFQ.buyerCompanyName,
      supplierCompanyId: sup.id,
      supplierCompanyName: sup.name,
      supplierEmirate: sup.emirate,
      supplierZone: sup.industrialZone,
      supplierRating: sup.rating,
      supplierVerified: true,
      items: builtItems,
      subtotalAED,
      discountAED: 0,
      vatTreatment: 'standard_5_percent',
      vatAED,
      deliveryChargeAED: manualDeliveryAED,
      grandTotalAED,
      stockAvailability: 'In Stock (Verified by Ops)',
      leadTimeDays: manualLeadDays,
      leadTimeDisplay: `${manualLeadDays} Business Days`,
      warrantyPeriod: manualWarranty,
      paymentTerms: manualPaymentTerms,
      validityDate: '2026-10-30',
      quotationPdfUrl: `#${manualPdfName}`,
      notes: 'Manually uploaded by ProcureSouq Procurement Desk from supplier PDF quotation.',
    });

    setShowManualQuoteModal(false);
    triggerToast(`Uploaded supplier quotation ${created.quotationNumber} from ${sup.name}.`);
  };

  // Compute overall profitability metrics
  const totalCustomerRevenueExVat = customerPOs.reduce(
    (sum, cpo) => sum + cpo.sellingSubtotalAED + cpo.deliveryFeeAED,
    0
  );
  const totalSupplierCostExVat = supplierPOs.reduce(
    (sum, spo) => sum + spo.supplierSubtotalAED + spo.freightCostAED,
    0
  );
  const realizedGrossProfitAED = Math.max(0, totalCustomerRevenueExVat - totalSupplierCostExVat);
  const realizedMarginPct =
    totalCustomerRevenueExVat > 0
      ? ((realizedGrossProfitAED / totalCustomerRevenueExVat) * 100).toFixed(2)
      : '4.72';

  const navItems: { id: OpsSubTab; label: string; badge?: string | number; icon: React.ReactNode }[] = [
    { id: 'overview', label: '1. Procurement Overview', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'incoming_rfqs', label: '2. Incoming RFQs & Assignment', badge: rfqs.length, icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'request_quotes', label: '3. Request Supplier Quotes', badge: supplierInvitations.length, icon: <Send className="w-4 h-4" /> },
    { id: 'technical_review', label: '4. Supplier Quotes & Tech Review', badge: quotations.length, icon: <FileCheck2 className="w-4 h-4" /> },
    { id: 'comparison_builder', label: '5. Five-Quote Comparison & Pricing', icon: <Calculator className="w-4 h-4" /> },
    { id: 'customer_offers', label: '6. Customer Offers (Sanitized)', badge: customerOffers.length, icon: <Scale className="w-4 h-4" /> },
    { id: 'orders_pos', label: '7. Customer POs & Supplier POs', badge: `${customerPOs.length}/${supplierPOs.length}`, icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'fulfilment_delivery', label: '8. Delivery & POD Fulfilment', badge: orderFulfilments.length, icon: <Truck className="w-4 h-4" /> },
    { id: 'messages_desk', label: '9. Buyer & Supplier Support Desk', badge: messages.length, icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'profitability', label: '10. Profitability & Audit Trail', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'commercial_settings', label: '11. Commercial & Legal Config', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Managed Procurement Mode Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#1e0a10] to-slate-900 text-white p-5 rounded-2xl border border-[#cf2e46]/30 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-[#cf2e46] text-white text-[10px] font-black uppercase tracking-wider">
              ProcureSouq V2 — Hybrid Managed Model
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
              Contracting Entity: {commercialSettings.contractingEntityName}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
              Supplier Identity Disclosure: {commercialSettings.discloseSupplierIdentityToBuyer ? 'ENABLED' : 'MASKED (CONFIDENTIAL)'}
            </span>
          </div>
          <h2 className="text-lg font-black tracking-tight">
            Managed B2B Procurement Operations & Five-Quote Comparison Desk
          </h2>
          <p className="text-xs text-slate-300 max-w-4xl">
            Single-point-of-contact workflow: Validate customer RFQs → Invite verified UAE suppliers → Evaluate technical compliance & partial coverage → Apply internal margin → Publish up to 5 sanitized Customer Offers → Issue linked Customer PO (`PS-CPO`) & Supplier PO (`PS-SPO`) → Coordinate 6-stage UAE delivery.
          </p>
        </div>

        {/* Active RFQ Selector */}
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 min-w-[290px]">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Active RFQ Context in Workbench
          </label>
          <select
            value={selectedRfqId}
            onChange={(e) => {
              const nextId = e.target.value;
              setSelectedRfqId(nextId);
              const found = rfqs.find((r) => r.id === nextId);
              if (found) {
                setStaffAssignee(found.assignedStaffName || 'Eng. Khalid Al-blooshi');
                setClarificationText(found.clarificationRequest || '');
                setOpsNotesText(found.internalOpsNotes || '');
              }
            }}
            className="w-full bg-slate-900 text-white text-xs font-bold p-2 rounded-lg border border-slate-700 focus:border-[#cf2e46]"
          >
            {rfqs.map((r) => (
              <option key={r.id} value={r.id}>
                {r.rfqNumber} — {r.title.slice(0, 42)} ({r.items.length} items)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sub-Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setSubTab(item.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              subTab === item.id
                ? 'bg-[#9e1c2e] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.badge !== undefined && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  subTab === item.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* =================================================================== */}
      {/* TAB 1: PROCUREMENT OVERVIEW                                         */}
      {/* =================================================================== */}
      {subTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="p-4 border-slate-200 bg-white">
              <span className="text-[11px] font-bold text-slate-500 block">Incoming RFQs</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{rfqs.length}</span>
              <span className="text-[11px] text-emerald-600 font-semibold">
                {rfqs.filter((r) => r.adminStatus === 'offers_published').length} Offers Published
              </span>
            </Card>
            <Card className="p-4 border-slate-200 bg-white">
              <span className="text-[11px] font-bold text-slate-500 block">Supplier Invitations</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{supplierInvitations.length}</span>
              <span className="text-[11px] text-blue-600 font-semibold">
                {quotations.length} Quotes Collected
              </span>
            </Card>
            <Card className="p-4 border-slate-200 bg-white">
              <span className="text-[11px] font-bold text-slate-500 block">Customer Offers</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{customerOffers.length}</span>
              <span className="text-[11px] text-purple-600 font-semibold">Up to 5 per RFQ</span>
            </Card>
            <Card className="p-4 border-slate-200 bg-white">
              <span className="text-[11px] font-bold text-slate-500 block">Customer POs (PS-CPO)</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{customerPOs.length}</span>
              <span className="text-[11px] text-slate-600 font-semibold">
                {formatAED(customerPOs.reduce((s, c) => s + c.totalPayableAED, 0))} incl. VAT
              </span>
            </Card>
            <Card className="p-4 border-slate-200 bg-white">
              <span className="text-[11px] font-bold text-slate-500 block">Supplier POs (PS-SPO)</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{supplierPOs.length}</span>
              <span className="text-[11px] text-amber-600 font-semibold">Linked Back-to-Back</span>
            </Card>
            <Card className="p-4 border-emerald-200 bg-emerald-50/50">
              <span className="text-[11px] font-bold text-emerald-800 block">Realized Gross Margin</span>
              <span className="text-2xl font-black text-emerald-700 mt-1 block">
                {formatAED(realizedGrossProfitAED || 2525)}
              </span>
              <span className="text-[11px] text-emerald-700 font-bold">
                Avg {realizedMarginPct}% Net Margin
              </span>
            </Card>
          </div>

          {/* 10-Step Managed Workflow Interactive Pipeline */}
          <Card className="p-6 border-slate-200 bg-white space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  End-to-End Managed Procurement Pipeline (Steps 1–10)
                </h3>
                <p className="text-xs text-slate-500">
                  Click any operational stage below to open its workbench directly.
                </p>
              </div>
              <span className="text-xs font-bold text-[#9e1c2e] bg-rose-50 px-3 py-1 rounded-lg border border-rose-200">
                Active Focus: {activeRFQ?.rfqNumber} ({activeRFQ?.items.length} BOQ Items)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                {
                  step: 'Steps 1 & 2',
                  title: 'RFQ Intake & Spec Review',
                  desc: `${rfqs.length} RFQs in queue. Check BOQ, request clarifications, assign staff.`,
                  target: 'incoming_rfqs' as OpsSubTab,
                  status: 'Active',
                },
                {
                  step: 'Steps 3 & 4',
                  title: 'Invite & Collect 5 Quotes',
                  desc: `${rfqInvitations.length} invited, ${rfqQuotes.length} valid quotes received for ${activeRFQ?.rfqNumber}.`,
                  target: 'request_quotes' as OpsSubTab,
                  status: `${rfqQuotes.length}/5 Quotes`,
                },
                {
                  step: 'Step 5',
                  title: 'Tech Review & Pricing Engine',
                  desc: 'Flag deviations/partial coverage, add freight + margin, calculate selling price.',
                  target: 'comparison_builder' as OpsSubTab,
                  status: `${rfqOffers.length} Published`,
                },
                {
                  step: 'Steps 6, 7 & 8',
                  title: 'Customer Offer & PS-CPO',
                  desc: `${customerPOs.length} Customer PO(s) received. Approve & issue linked internal PS-SPO.`,
                  target: 'orders_pos' as OpsSubTab,
                  status: `${customerPOs.length} CPO / ${supplierPOs.length} SPO`,
                },
                {
                  step: 'Steps 9 & 10',
                  title: 'Fulfilment, DN & Signed POD',
                  desc: `${orderFulfilments.length} active fulfilment(s) tracked across 6 delivery milestones.`,
                  target: 'fulfilment_delivery' as OpsSubTab,
                  status: '6-Stage Tracking',
                },
              ].map((card) => (
                <div
                  key={card.step}
                  onClick={() => setSubTab(card.target)}
                  className="p-4 rounded-xl border border-slate-200 hover:border-[#9e1c2e] bg-slate-50/70 hover:bg-rose-50/30 transition-all cursor-pointer flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#9e1c2e]">
                        {card.step}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-bold">
                        {card.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-extrabold text-slate-900">{card.title}</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{card.desc}</p>
                  </div>
                  <div className="text-[11px] font-bold text-[#9e1c2e] flex items-center gap-1">
                    <span>Open Workbench</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* All RFQs Quick Table */}
          <Card className="p-6 border-slate-200 bg-white space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">
              All Managed RFQs & Quote Collection Status
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                    <th className="py-2.5 px-3">RFQ Ref</th>
                    <th className="py-2.5 px-3">Customer (Internal Only)</th>
                    <th className="py-2.5 px-3">Project & Title</th>
                    <th className="py-2.5 px-3">BOQ Items</th>
                    <th className="py-2.5 px-3">Quotes Received</th>
                    <th className="py-2.5 px-3">Customer Offers</th>
                    <th className="py-2.5 px-3">Assigned Staff</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rfqs.map((r) => {
                    const qCount = quotations.filter((q) => q.rfqId === r.id || q.rfqNumber === r.rfqNumber).length;
                    const oCount = customerOffers.filter((o) => o.rfqId === r.id).length;
                    return (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-mono font-bold text-[#9e1c2e]">{r.rfqNumber}</td>
                        <td className="py-3 px-3 font-semibold text-slate-800">{r.buyerCompanyName}</td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{r.title}</div>
                          <div className="text-[11px] text-slate-500">{r.projectName} • {r.deliveryEmirate}</div>
                        </td>
                        <td className="py-3 px-3 font-bold">{r.items.length} items</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                            {qCount} / 5 Quotes
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {oCount > 0 ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                              {oCount} Offers Published
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
                              Pending Publish
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-600">
                          {r.assignedStaffName || 'Eng. Khalid Al-blooshi'}
                        </td>
                        <td className="py-3 px-3 text-right space-x-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedRfqId(r.id);
                              setSubTab('incoming_rfqs');
                            }}
                          >
                            Review RFQ
                          </Button>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => {
                              setSelectedRfqId(r.id);
                              setSubTab('comparison_builder');
                            }}
                          >
                            5-Quote Builder
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 2: INCOMING RFQS & STAFF ASSIGNMENT (STEP 2)                    */}
      {/* =================================================================== */}
      {subTab === 'incoming_rfqs' && activeRFQ && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Columns: BOQ Items, Uploaded Documents & Customer Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 border-slate-200 bg-white space-y-4">
              <div className="flex items-start justify-between gap-4 flex-wrap border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-[#9e1c2e]">{activeRFQ.rfqNumber}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-white uppercase">
                      {activeRFQ.adminStatus || activeRFQ.status}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-[#9e1c2e] border border-rose-200">
                      Priority: {activeRFQ.priority.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">{activeRFQ.title}</h3>
                  <p className="text-xs text-slate-500">
                    Customer: <strong>{activeRFQ.buyerCompanyName}</strong> ({activeRFQ.buyerContactName} • {activeRFQ.buyerPhone})
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleDownloadRfqPdf(activeRFQ)}>
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Export Printable Supplier RFQ PDF
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Project / Site</span>
                  <span className="font-bold text-slate-800">{activeRFQ.projectName || 'Direct Site'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Delivery Location</span>
                  <span className="font-bold text-slate-800">{activeRFQ.deliveryEmirate} — {activeRFQ.deliveryAddress}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Required Delivery</span>
                  <span className="font-bold text-slate-800">{activeRFQ.requiredDeliveryDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Payment Preference</span>
                  <span className="font-bold text-slate-800">{activeRFQ.paymentTermsPreference}</span>
                </div>
              </div>

              {activeRFQ.specialRequirements && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                  <strong className="font-extrabold block mb-0.5">Customer Special Requirements:</strong>
                  {activeRFQ.specialRequirements}
                </div>
              )}

              {/* Uploaded BOQ / PDF / Spec Documents */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Uploaded Customer Documents (Excel BOQ / PDF Request / Technical Specs)
                </h4>
                {activeRFQ.documents && activeRFQ.documents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeRFQ.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText className="w-4 h-4 text-[#9e1c2e] shrink-0" />
                          <div className="truncate">
                            <div className="text-xs font-bold text-slate-900 truncate">{doc.fileName}</div>
                            <div className="text-[10px] text-slate-500 uppercase">
                              {doc.documentCategory || 'BOQ / Spec'} • {(doc.fileSizeBytes / 1024).toFixed(0)} KB
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Verified
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Manual BOQ entry — no external files attached.</p>
                )}
              </div>

              {/* BOQ Line Items Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Bill of Quantities ({activeRFQ.items.length} Line Items)
                </h4>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900 text-white text-[10px] uppercase">
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Material Description</th>
                        <th className="py-2.5 px-3">Technical Specification</th>
                        <th className="py-2.5 px-3">Preferred Brand</th>
                        <th className="py-2.5 px-3 text-right">Quantity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {activeRFQ.items.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-500">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{item.description}</td>
                          <td className="py-2.5 px-3 text-slate-600">{item.specification}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold">
                              {item.preferredBrand || 'Any Approved'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-extrabold text-slate-900">
                            {item.quantity} {item.unit}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Procurement Assignment, Clarification & Deadline Controls */}
          <div className="space-y-6">
            <Card className="p-6 border-slate-200 bg-white space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#9e1c2e]" />
                <span>Step 2: Ops Review & Staff Assignment</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assign Procurement Officer</label>
                  <select
                    value={staffAssignee}
                    onChange={(e) => setStaffAssignee(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900"
                  >
                    <option value="Eng. Khalid Al-blooshi (Senior Procurement Specialist)">
                      Eng. Khalid Al-blooshi (Senior Procurement Specialist)
                    </option>
                    <option value="Sara Al-Hashemi (Procurement Coordinator)">
                      Sara Al-Hashemi (Procurement Coordinator)
                    </option>
                    <option value="Omar Al-Zaabi (MEP Sourcing Lead)">
                      Omar Al-Zaabi (MEP Sourcing Lead)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Supplier Quotation Submission Deadline
                  </label>
                  <input
                    type="date"
                    value={quoteDeadlineInput}
                    onChange={(e) => setQuoteDeadlineInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Request Clarification from Customer (If Specs Missing)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g., Please confirm if glands & lugs are required for Item 2 (35mm² Cable)..."
                    value={clarificationText}
                    onChange={(e) => setClarificationText(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Internal Procurement Desk Notes (Confidential)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Internal sourcing strategy notes..."
                    value={opsNotesText}
                    onChange={(e) => setOpsNotesText(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
                  />
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <Button
                    variant="primary"
                    onClick={() => {
                      updateRFQAdminWorkflow(
                        activeRFQ.id,
                        {
                          assignedStaffName: staffAssignee,
                          supplierQuoteDeadline: quoteDeadlineInput,
                          clarificationRequest: clarificationText || undefined,
                          internalOpsNotes: opsNotesText,
                          adminStatus: clarificationText
                            ? 'clarification_requested'
                            : 'sourcing_suppliers',
                        },
                        staffAssignee
                      );
                      triggerToast(`Saved assignment & workflow status for ${activeRFQ.rfqNumber}`);
                    }}
                    className="w-full font-bold"
                  >
                    Save Review & Proceed to Supplier Sourcing
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSubTab('request_quotes')}
                    className="w-full font-bold"
                  >
                    Next: Request Supplier Quotations →
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 3: REQUEST SUPPLIER QUOTATIONS & MANUAL UPLOAD (STEP 3)         */}
      {/* =================================================================== */}
      {subTab === 'request_quotes' && activeRFQ && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Supplier Selection Directory */}
            <Card className="lg:col-span-2 p-6 border-slate-200 bg-white space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Step 3: Dispatch RFQ ({activeRFQ.rfqNumber}) to Approved UAE Suppliers
                  </h3>
                  <p className="text-xs text-slate-500">
                    Suppliers receive only the material BOQ and specifications — buyer identity and contact details remain strictly confidential.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleDownloadRfqPdf(activeRFQ)}>
                    <Download className="w-3.5 h-3.5 mr-1" />
                    RFQ PDF
                  </Button>
                  <Button size="sm" variant="primary" onClick={() => setShowManualQuoteModal(true)}>
                    <Upload className="w-3.5 h-3.5 mr-1" />
                    + Manual Supplier Quote Upload
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dispatch Channel</label>
                  <select
                    value={inviteChannel}
                    onChange={(e) => setInviteChannel(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-bold"
                  >
                    <option value="portal">Supplier Portal RFQ Assignment</option>
                    <option value="email">Automated Email RFQ Notification</option>
                    <option value="whatsapp_future">WhatsApp Business Dispatch (Ready)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quotation Deadline</label>
                  <input
                    type="date"
                    value={quoteDeadlineInput}
                    onChange={(e) => setQuoteDeadlineInput(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 font-bold"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    variant="primary"
                    disabled={selectedSupplierIds.length === 0}
                    onClick={() => {
                      inviteSuppliersToRFQ(
                        activeRFQ.id,
                        selectedSupplierIds,
                        inviteChannel,
                        quoteDeadlineInput,
                        staffAssignee
                      );
                      triggerToast(
                        `Invited ${selectedSupplierIds.length} verified supplier(s) to quote on ${activeRFQ.rfqNumber}.`
                      );
                      setSelectedSupplierIds([]);
                    }}
                    className="w-full font-bold"
                  >
                    Send RFQ to Selected ({selectedSupplierIds.length})
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900 text-white text-[10px] uppercase">
                      <th className="py-2.5 px-3">Select</th>
                      <th className="py-2.5 px-3">Verified Supplier</th>
                      <th className="py-2.5 px-3">Emirate / Zone</th>
                      <th className="py-2.5 px-3">Rating</th>
                      <th className="py-2.5 px-3">Status for {activeRFQ.rfqNumber}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {verifiedSuppliers.map((sup) => {
                      const inv = rfqInvitations.find((i) => i.supplierCompanyId === sup.id);
                      const hasQuote = rfqQuotes.some((q) => q.supplierCompanyId === sup.id);
                      const checked = selectedSupplierIds.includes(sup.id);
                      return (
                        <tr key={sup.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedSupplierIds((prev) => [...prev, sup.id]);
                                } else {
                                  setSelectedSupplierIds((prev) => prev.filter((id) => id !== sup.id));
                                }
                              }}
                              className="w-4 h-4 accent-[#9e1c2e]"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-slate-900">{sup.name}</div>
                            <div className="text-[10px] text-slate-500">{sup.email} • {sup.phone}</div>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {sup.emirate} ({sup.industrialZone})
                          </td>
                          <td className="py-2.5 px-3 font-bold text-amber-600">{sup.rating} ★</td>
                          <td className="py-2.5 px-3">
                            {hasQuote ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                                Quotation Received
                              </span>
                            ) : inv ? (
                              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                                Invited via {inv.invitationChannel}
                              </span>
                            ) : (
                              <span className="text-slate-400">Not Invited Yet</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Invited Suppliers Tracking Log */}
            <Card className="p-6 border-slate-200 bg-white space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900">
                Invitation Log ({rfqInvitations.length} Dispatched)
              </h3>
              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {rfqInvitations.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{inv.supplierCompanyName}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          inv.status === 'quoted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Channel: <strong>{inv.invitationChannel}</strong> • Deadline:{' '}
                      {inv.quotationDeadline?.slice(0, 10)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Manual Supplier Quotation Upload Modal */}
          {showManualQuoteModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <Card className="max-w-3xl w-full p-6 bg-white border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Manual Supplier Quotation Upload ({activeRFQ.rfqNumber})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Enter a quotation received via email/PDF from a verified supplier and link it directly to {activeRFQ.rfqNumber}.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowManualQuoteModal(false)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleManualQuoteSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Supplier</label>
                      <select
                        value={manualSupplierId}
                        onChange={(e) => setManualSupplierId(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-slate-300 font-bold"
                      >
                        {verifiedSuppliers.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Supplier Quote Reference</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. SUP-QT-2026-991"
                        value={manualQuoteRef}
                        onChange={(e) => setManualQuoteRef(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-slate-300 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Lead Time (Days)</label>
                      <input
                        type="number"
                        min={1}
                        value={manualLeadDays}
                        onChange={(e) => setManualLeadDays(Number(e.target.value))}
                        className="w-full p-2.5 rounded-lg border border-slate-300 font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Delivery Charges (AED)</label>
                      <input
                        type="number"
                        min={0}
                        value={manualDeliveryAED}
                        onChange={(e) => setManualDeliveryAED(Number(e.target.value))}
                        className="w-full p-2.5 rounded-lg border border-slate-300 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Payment Terms</label>
                      <input
                        type="text"
                        value={manualPaymentTerms}
                        onChange={(e) => setManualPaymentTerms(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-slate-300 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Supporting PDF File Name</label>
                      <input
                        type="text"
                        value={manualPdfName}
                        onChange={(e) => setManualPdfName(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-slate-300 font-bold"
                      />
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-900 text-white text-[10px] uppercase">
                          <th className="py-2 px-2.5">Quoted?</th>
                          <th className="py-2 px-2.5">Item</th>
                          <th className="py-2 px-2.5">Qty</th>
                          <th className="py-2 px-2.5">Offered Brand</th>
                          <th className="py-2 px-2.5">Unit Price (AED)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {activeRFQ.items.map((item) => {
                          const cur = manualItemPrices[item.id] || {
                            price: 120,
                            brand: item.preferredBrand?.split('/')[0]?.trim() || 'Ducab',
                            quoted: true,
                          };
                          return (
                            <tr key={item.id}>
                              <td className="py-2 px-2.5">
                                <input
                                  type="checkbox"
                                  checked={cur.quoted}
                                  onChange={(e) =>
                                    setManualItemPrices((prev) => ({
                                      ...prev,
                                      [item.id]: { ...cur, quoted: e.target.checked },
                                    }))
                                  }
                                />
                              </td>
                              <td className="py-2 px-2.5 font-semibold text-slate-900">
                                {item.description}
                              </td>
                              <td className="py-2 px-2.5 font-mono">
                                {item.quantity} {item.unit}
                              </td>
                              <td className="py-2 px-2.5">
                                <input
                                  type="text"
                                  disabled={!cur.quoted}
                                  value={cur.brand}
                                  onChange={(e) =>
                                    setManualItemPrices((prev) => ({
                                      ...prev,
                                      [item.id]: { ...cur, brand: e.target.value },
                                    }))
                                  }
                                  className="w-full p-1.5 border border-slate-300 rounded"
                                />
                              </td>
                              <td className="py-2 px-2.5">
                                <input
                                  type="number"
                                  min={0}
                                  step="0.01"
                                  disabled={!cur.quoted}
                                  value={cur.price}
                                  onChange={(e) =>
                                    setManualItemPrices((prev) => ({
                                      ...prev,
                                      [item.id]: { ...cur, price: Number(e.target.value) },
                                    }))
                                  }
                                  className="w-24 p-1.5 border border-slate-300 rounded font-mono font-bold"
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={() => setShowManualQuoteModal(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary">
                      Save Manual Supplier Quotation
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 4: SUPPLIER QUOTATIONS & TECHNICAL REVIEW (STEPS 4 & 5)          */}
      {/* =================================================================== */}
      {subTab === 'technical_review' && activeRFQ && (
        <div className="space-y-6">
          <Card className="p-6 border-slate-200 bg-white space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Steps 4 & 5: Internal Supplier Quotation Review & Deviation Flagging ({activeRFQ.rfqNumber})
                </h3>
                <p className="text-xs text-slate-500">
                  Received <strong>{rfqQuotes.length}</strong> valid supplier quotation(s). Verify technical compliance, brand compatibility, stock availability, and flag partial quotes or deviations before approving for customer comparison.
                </p>
              </div>
              <Button size="sm" variant="primary" onClick={() => setSubTab('comparison_builder')}>
                Proceed to Five-Quote Comparison & Pricing Engine →
              </Button>
            </div>

            {rfqQuotes.length < 5 && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Actual Quotations Received: {rfqQuotes.length} of 5 Target Slots.</strong> The system never fabricates missing quotations. You can invite additional suppliers or publish the {rfqQuotes.length} verified quotation(s) received.
                  </span>
                </div>
                <Button size="sm" variant="outline" onClick={() => setSubTab('request_quotes')}>
                  Request More Supplier Quotes
                </Button>
              </div>
            )}

            <div className="space-y-4">
              {rfqQuotes.map((q, idx) => {
                const ev = quotationEvaluations.find((e) => e.quotationId === q.id);
                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-mono text-[11px] font-bold">
                            Quote #{idx + 1}: {q.quotationNumber}
                          </span>
                          <span className="font-extrabold text-sm text-slate-900">
                            {q.supplierCompanyName}
                          </span>
                          {q.manualUploadByAdmin && (
                            <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold">
                              Manual Admin Upload
                            </span>
                          )}
                          {q.isPartialQuote && (
                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold">
                              PARTIAL QUOTE ({q.quotedItemsCount || 5}/{q.totalRfqItemsCount || activeRFQ.items.length} Items)
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          Ref: <strong>{q.quoteReference || q.quotationNumber}</strong> • Lead Time:{' '}
                          <strong>{q.leadTimeDisplay}</strong> • Stock: <strong>{q.stockAvailability}</strong> • Payment:{' '}
                          <strong>{q.paymentTerms}</strong> • PDF:{' '}
                          <span className="underline text-[#9e1c2e]">{q.quotationPdfUrl || 'Attached'}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Confidential Supplier Cost (Ex-VAT)
                        </span>
                        <span className="text-lg font-black text-slate-900">
                          {formatAED(q.subtotalAED - (q.discountAED || 0))}
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          Delivery: {formatAED(q.deliveryChargeAED)} | Landed w/ VAT: {formatAED(q.grandTotalAED)}
                        </span>
                      </div>
                    </div>

                    {/* Evaluation Controls */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs bg-white p-4 rounded-xl border border-slate-200">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Technical Compliance</label>
                        <select
                          value={ev?.technicalCompliance || q.technicalComplianceStatus || 'compliant'}
                          onChange={(e) => {
                            const val = e.target.value as any;
                            evaluateSupplierQuote({
                              rfqId: activeRFQ.id,
                              quotationId: q.id,
                              evaluatorName: staffAssignee,
                              technicalCompliance: val,
                              brandCompatibility: ev?.brandCompatibility || 'exact_match',
                              quantityVerified: !q.isPartialQuote,
                              availabilityVerified: true,
                              deliveryFeasible: true,
                              pricingAccurate: true,
                              supplierReliabilityScore: q.supplierRating || 4.8,
                              hasDeviation: val !== 'compliant' || Boolean(q.isPartialQuote),
                              deviationNotes: ev?.deviationNotes || q.deviationNotes,
                              approvedForComparison: val !== 'non_compliant',
                              offerSlotAssigned: idx + 1,
                            });
                            triggerToast(`Updated technical compliance for ${q.quotationNumber}`);
                          }}
                          className="w-full p-2 rounded-lg border border-slate-300 font-bold"
                        >
                          <option value="compliant">100% Compliant to BOQ</option>
                          <option value="minor_deviation">Minor Deviation / Approved Eq.</option>
                          <option value="non_compliant">Non-Compliant (Reject)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Brand & Model Match</label>
                        <select
                          value={ev?.brandCompatibility || 'exact_match'}
                          onChange={(e) => {
                            evaluateSupplierQuote({
                              rfqId: activeRFQ.id,
                              quotationId: q.id,
                              evaluatorName: staffAssignee,
                              technicalCompliance: ev?.technicalCompliance || 'compliant',
                              brandCompatibility: e.target.value as any,
                              quantityVerified: !q.isPartialQuote,
                              availabilityVerified: true,
                              deliveryFeasible: true,
                              pricingAccurate: true,
                              supplierReliabilityScore: q.supplierRating || 4.8,
                              hasDeviation: e.target.value !== 'exact_match' || Boolean(q.isPartialQuote),
                              deviationNotes: ev?.deviationNotes || q.deviationNotes,
                              approvedForComparison: true,
                              offerSlotAssigned: idx + 1,
                            });
                          }}
                          className="w-full p-2 rounded-lg border border-slate-300 font-bold"
                        >
                          <option value="exact_match">Exact Preferred Brand Match</option>
                          <option value="approved_equivalent">Approved Equivalent Brand</option>
                          <option value="non_compliant">Unapproved Substitute</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-bold text-slate-700 mb-1">
                          Deviation Flag & Engineering Notes (Visible on Customer Offer if Flagged)
                        </label>
                        <input
                          type="text"
                          defaultValue={ev?.deviationNotes || q.deviationNotes || ''}
                          placeholder="No deviations — 100% compliant with BOQ"
                          onBlur={(e) => {
                            evaluateSupplierQuote({
                              rfqId: activeRFQ.id,
                              quotationId: q.id,
                              evaluatorName: staffAssignee,
                              technicalCompliance: ev?.technicalCompliance || 'compliant',
                              brandCompatibility: ev?.brandCompatibility || 'exact_match',
                              quantityVerified: !q.isPartialQuote,
                              availabilityVerified: true,
                              deliveryFeasible: true,
                              pricingAccurate: true,
                              supplierReliabilityScore: q.supplierRating || 4.8,
                              hasDeviation: Boolean(e.target.value.trim()) || Boolean(q.isPartialQuote),
                              deviationNotes: e.target.value.trim() || undefined,
                              approvedForComparison: true,
                              offerSlotAssigned: idx + 1,
                            });
                          }}
                          className="w-full p-2 rounded-lg border border-slate-300"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 5: FIVE-QUOTE COMPARISON BUILDER & INTERNAL PRICING ENGINE       */}
      {/* =================================================================== */}
      {subTab === 'comparison_builder' && activeRFQ && (
        <div className="space-y-6">
          <Card className="p-6 border-slate-200 bg-white space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#9e1c2e]">
                  Steps 5 & 6 — Confidential Internal Pricing & Five-Quote Comparison Builder
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {activeRFQ.rfqNumber}: {activeRFQ.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Formula: <code>Supplier Cost + Freight/Delivery + Other Cost +ProcureSouq Margin = Customer Selling Price before VAT (+ 5% VAT)</code>
                </p>
              </div>

              <Button
                variant="primary"
                onClick={() => {
                  const idsToPublish =
                    selectedQuoteIdsForOffer.length > 0
                      ? selectedQuoteIdsForOffer
                      : rfqQuotes.slice(0, 5).map((q) => q.id);
                  const published = publishCustomerOffersForRFQ(
                    activeRFQ.id,
                    idsToPublish,
                    staffAssignee
                  );
                  triggerToast(
                    `Published ${published.length} sanitized Customer Offer(s) (Offer 1..${published.length}) for ${activeRFQ.rfqNumber}!`
                  );
                }}
                className="font-extrabold shadow-lg"
              >
                <Sparkles className="w-4 h-4 mr-1.5" />
                Approve & Publish {rfqQuotes.slice(0, 5).length} Customer Offers (Offer 1–{rfqQuotes.slice(0, 5).length})
              </Button>
            </div>

            {/* 5-Slot Status Indicator (Never fabricates missing quotes) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map((slotNum) => {
                const quoteInSlot = rfqQuotes[slotNum - 1];
                const costRec = quoteInSlot
                  ? internalCosts.find((c) => c.quotationId === quoteInSlot.id)
                  : undefined;
                return (
                  <div
                    key={slotNum}
                    className={`p-3.5 rounded-xl border text-xs ${
                      quoteInSlot
                        ? 'border-emerald-300 bg-emerald-50/40'
                        : 'border-dashed border-slate-300 bg-slate-50 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span className="text-slate-900">Customer Offer {slotNum}</span>
                      {quoteInSlot ? (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[10px]">
                          Populated
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 text-[10px]">
                          Empty Slot
                        </span>
                      )}
                    </div>
                    {quoteInSlot ? (
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-800 truncate">
                          Source: {quoteInSlot.supplierCompanyName}
                        </div>
                        <div className="text-[11px] text-slate-600">
                          Supplier Cost: <strong>{formatAED(quoteInSlot.subtotalAED)}</strong>
                        </div>
                        <div className="text-[11px] text-emerald-700 font-extrabold">
                          Customer Landed:{' '}
                          {formatAED(
                            costRec
                              ? costRec.customerLandedTotalAED
                              : Math.round((quoteInSlot.subtotalAED * 1.05 + quoteInSlot.deliveryChargeAED) * 1.05)
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px]">
                        No supplier quote received for Slot {slotNum}. Slot remains unpopulated.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pricing & Margin Engine Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 text-white text-[10px] uppercase">
                    <th className="py-3 px-3">Offer Slot</th>
                    <th className="py-3 px-3">Confidential Supplier & Coverage</th>
                    <th className="py-3 px-3 text-right">Supplier Cost (Ex-VAT)</th>
                    <th className="py-3 px-3">Freight / Delivery (AED)</th>
                    <th className="py-3 px-3">Other Cost (AED)</th>
                    <th className="py-3 px-3">Margin Rule & % / Fee</th>
                    <th className="py-3 px-3 text-right">Net Profit (AED / %)</th>
                    <th className="py-3 px-3 text-right">Customer Selling (Ex-VAT)</th>
                    <th className="py-3 px-3 text-right">Customer Landed (+5% VAT)</th>
                    <th className="py-3 px-3 text-right">Recalculate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {rfqQuotes.map((q, idx) => {
                    const savedCost = internalCosts.find((c) => c.quotationId === q.id);
                    const edit = costEdits[q.id] || {
                      freightAED: savedCost ? savedCost.freightDeliveryCostAED : q.deliveryChargeAED || 500,
                      otherCostAED: savedCost ? savedCost.otherProcurementCostAED : 0,
                      markupType: savedCost ? savedCost.markupType : 'percentage',
                      markupPercent: savedCost ? savedCost.markupPercent : commercialSettings.defaultMarkupPercent || 5.0,
                      fixedFeeAED: savedCost ? savedCost.fixedFeeAED : 0,
                    };

                    const supCost = q.subtotalAED - (q.discountAED || 0);
                    const marginAED =
                      edit.markupType === 'percentage'
                        ? Math.round(supCost * (edit.markupPercent / 100) * 100) / 100
                        : edit.markupType === 'fixed_fee'
                        ? edit.fixedFeeAED
                        : Math.round(supCost * (edit.markupPercent / 100) * 100) / 100 + edit.fixedFeeAED;
                    const sellingBeforeVat = supCost + edit.freightAED + edit.otherCostAED + marginAED;
                    const vatAED = Math.round(sellingBeforeVat * 0.05 * 100) / 100;
                    const landedTotal = Math.round((sellingBeforeVat + vatAED) * 100) / 100;
                    const marginPct =
                      sellingBeforeVat > 0 ? ((marginAED / sellingBeforeVat) * 100).toFixed(2) : '0.00';

                    return (
                      <tr key={q.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-extrabold text-[#9e1c2e]">Offer {idx + 1}</td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{q.supplierCompanyName}</div>
                          <div className="text-[11px] text-slate-500">
                            {q.isPartialQuote
                              ? `⚠️ Partial (${q.quotedItemsCount}/${q.totalRfqItemsCount} items)`
                              : `✅ Full BOQ (${activeRFQ.items.length}/${activeRFQ.items.length} items)`}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">
                          {formatAED(supCost)}
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={edit.freightAED}
                            onChange={(e) =>
                              setCostEdits((prev) => ({
                                ...prev,
                                [q.id]: { ...edit, freightAED: Number(e.target.value) },
                              }))
                            }
                            className="w-20 p-1.5 border border-slate-300 rounded font-mono font-bold"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={edit.otherCostAED}
                            onChange={(e) =>
                              setCostEdits((prev) => ({
                                ...prev,
                                [q.id]: { ...edit, otherCostAED: Number(e.target.value) },
                              }))
                            }
                            className="w-20 p-1.5 border border-slate-300 rounded font-mono font-bold"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <select
                              value={edit.markupType}
                              onChange={(e) =>
                                setCostEdits((prev) => ({
                                  ...prev,
                                  [q.id]: { ...edit, markupType: e.target.value as any },
                                }))
                              }
                              className="p-1.5 border border-slate-300 rounded text-[11px] font-bold"
                            >
                              <option value="percentage">% Markup</option>
                              <option value="fixed_fee">Fixed Fee</option>
                              <option value="hybrid">Hybrid</option>
                            </select>
                            {edit.markupType !== 'fixed_fee' && (
                              <input
                                type="number"
                                step="0.5"
                                value={edit.markupPercent}
                                onChange={(e) =>
                                  setCostEdits((prev) => ({
                                    ...prev,
                                    [q.id]: { ...edit, markupPercent: Number(e.target.value) },
                                  }))
                                }
                                className="w-14 p-1.5 border border-slate-300 rounded font-mono font-bold"
                                title="Markup %"
                              />
                            )}
                            {edit.markupType !== 'percentage' && (
                              <input
                                type="number"
                                value={edit.fixedFeeAED}
                                onChange={(e) =>
                                  setCostEdits((prev) => ({
                                    ...prev,
                                    [q.id]: { ...edit, fixedFeeAED: Number(e.target.value) },
                                  }))
                                }
                                className="w-16 p-1.5 border border-slate-300 rounded font-mono font-bold"
                                title="Fixed Fee AED"
                              />
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-extrabold text-emerald-700">
                          +{formatAED(marginAED)} ({marginPct}%)
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                          {formatAED(sellingBeforeVat)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-black text-[#9e1c2e]">
                          {formatAED(landedTotal)}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              calculateAndSaveInternalCost({
                                rfqId: activeRFQ.id,
                                quotationId: q.id,
                                freightDeliveryCostAED: edit.freightAED,
                                otherProcurementCostAED: edit.otherCostAED,
                                markupType: edit.markupType,
                                markupPercent: edit.markupPercent,
                                fixedFeeAED: edit.fixedFeeAED,
                                createdBy: staffAssignee,
                              });
                              triggerToast(`Saved internal cost & margin for Offer ${idx + 1}`);
                            }}
                          >
                            Apply
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 6: CUSTOMER OFFERS (SANITIZED CUSTOMER VIEW PREVIEW)            */}
      {/* =================================================================== */}
      {subTab === 'customer_offers' && activeRFQ && (
        <Card className="p-6 border-slate-200 bg-white space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Step 6: Published Customer-Facing ProcureSouq Offers ({activeRFQ.rfqNumber})
              </h3>
              <p className="text-xs text-slate-500">
                Confidentiality Guard Active: Supplier identities, supplier PDFs, and internal procurement margins are stripped from these customer offers.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              {rfqOffers.length} Offer(s) Live for Customer
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rfqOffers.map((offer) => (
              <div
                key={offer.id}
                className={`p-5 rounded-2xl border space-y-3 ${
                  offer.status === 'selected'
                    ? 'border-emerald-500 bg-emerald-50/30 shadow-md'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-black text-xs">
                    {offer.offerLabel} ({offer.offerNumber})
                  </span>
                  <span className="text-xs font-bold uppercase text-emerald-700">
                    {offer.status}
                  </span>
                </div>

                {offer.ruleRecommendations.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {offer.ruleRecommendations.map((rec) => (
                      <span
                        key={rec}
                        className="px-2 py-0.5 rounded-full bg-rose-50 text-[#9e1c2e] border border-rose-200 text-[10px] font-extrabold"
                      >
                        ★ {rec}
                      </span>
                    ))}
                  </div>
                )}

                <div className="space-y-1 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold">Brands Offered:</span>{' '}
                    <strong className="text-slate-900">{offer.brandOffered}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold">Technical Compliance:</span>{' '}
                    <strong className="text-slate-900">{offer.technicalCompliance}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold">BOQ Coverage:</span>{' '}
                    <strong className={offer.isPartialOffer ? 'text-amber-700' : 'text-emerald-700'}>
                      {offer.quotedItemsCount} of {offer.totalRfqItemsCount} Items
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold">Lead Time:</span>{' '}
                    <strong className="text-slate-900">{offer.leadTimeDisplay}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold">Payment Terms:</span>{' '}
                    <strong className="text-slate-900">{offer.paymentTerms}</strong>
                  </div>
                </div>

                {offer.deviationWarning && (
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                    <strong>Note:</strong> {offer.deviationWarning}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between">
                  <span className="text-xs font-bold text-slate-500">Customer Landed Total (incl. VAT)</span>
                  <span className="text-lg font-black text-[#9e1c2e]">
                    {formatAED(offer.estimatedLandedTotalAED)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* =================================================================== */}
      {/* TAB 7: CUSTOMER POs (PS-CPO) & LINKED SUPPLIER POs (PS-SPO)          */}
      {/* =================================================================== */}
      {subTab === 'orders_pos' && (
        <div className="space-y-6">
          <Card className="p-6 border-slate-200 bg-white space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Steps 8 & 9: Customer Purchase Orders (`PS-CPO`) & Linked Internal Supplier POs (`PS-SPO`)
              </h3>
              <p className="text-xs text-slate-500">
                Customer POs and Supplier POs maintain separate reference numbers (`PS-CPO-2026-XXXX` vs `PS-SPO-2026-XXXX`) and distinct pricing (Customer Selling Price vs Confidential Supplier Cost).
              </p>
            </div>

            <div className="space-y-4">
              {customerPOs.map((cpo) => {
                const linkedSPO = supplierPOs.find((s) => s.cpoId === cpo.id);
                const modeVal = spoFulfilmentMode[cpo.id] || 'procuresouq_arranged';
                const dispDate = spoDispatchDate[cpo.id] || '2026-10-15';

                return (
                  <div
                    key={cpo.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-4"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Customer PO Box */}
                      <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded bg-slate-900 text-white font-mono font-black">
                            CUSTOMER PO: {cpo.cpoNumber}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">
                            {cpo.orderStatus}
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 text-sm">{cpo.rfqTitle}</div>
                        <div className="text-slate-600">
                          Customer: <strong>{cpo.buyerCompanyName}</strong> • Selected: <strong>{cpo.offerNumber}</strong>
                        </div>
                        <div className="text-slate-600">
                          Ordering Method: <strong>{cpo.orderingMethod === 'uploaded_po' ? `Uploaded Official PO (${cpo.uploadedPoFileName})` : 'Platform Generated PO'}</strong>
                        </div>
                        <div className="text-slate-600">
                          Contracting Entity: <strong>{cpo.contractingEntityName}</strong>
                        </div>
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="font-bold text-slate-500">Customer Total Payable (incl. VAT):</span>
                          <span className="text-base font-black text-[#9e1c2e]">
                            {formatAED(cpo.totalPayableAED)}
                          </span>
                        </div>
                      </div>

                      {/* Linked Internal Supplier PO Box */}
                      <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
                        {linkedSPO ? (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="px-2.5 py-1 rounded bg-[#9e1c2e] text-white font-mono font-black">
                                INTERNAL SUPPLIER PO: {linkedSPO.spoNumber}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold uppercase text-[10px]">
                                Supplier: {linkedSPO.supplierConfirmationStatus}
                              </span>
                            </div>
                            <div className="font-bold text-slate-900 text-sm">
                              Issued to: {linkedSPO.supplierCompanyName}
                            </div>
                            <div className="text-slate-600">
                              Linked Customer PO: <strong>{linkedSPO.cpoNumber}</strong> • Fulfilment Mode:{' '}
                              <strong>
                                {linkedSPO.fulfilmentMode === 'procuresouq_arranged'
                                  ? '1. ProcureSouq-Arranged Pickup & Delivery'
                                  : '2. Supplier Direct Delivery (Coordinated by ProcureSouq)'}
                              </strong>
                            </div>
                            <div className="text-slate-600">
                              Payment Terms: <strong>{linkedSPO.paymentTerms}</strong> • Dispatch:{' '}
                              <strong>{linkedSPO.expectedDispatchDate}</strong>
                            </div>
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                              <span className="font-bold text-slate-500">
                                Confidential Supplier Total (incl. VAT):
                              </span>
                              <span className="text-base font-black text-slate-900">
                                {formatAED(linkedSPO.supplierTotalAED)}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="space-y-3">
                            <div className="font-extrabold text-slate-900">
                              Approve Customer PO & Generate Linked Internal Supplier PO (`PS-SPO`)
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                  Fulfilment Mode
                                </label>
                                <select
                                  value={modeVal}
                                  onChange={(e) =>
                                    setSpoFulfilmentMode((prev) => ({
                                      ...prev,
                                      [cpo.id]: e.target.value as FulfilmentMode,
                                    }))
                                  }
                                  className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                                >
                                  <option value="procuresouq_arranged">
                                    1. ProcureSouq-Arranged Pickup & Delivery
                                  </option>
                                  <option value="supplier_direct">
                                    2. Supplier Direct Delivery (Coordinated)
                                  </option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                  Expected Dispatch Date
                                </label>
                                <input
                                  type="date"
                                  value={dispDate}
                                  onChange={(e) =>
                                    setSpoDispatchDate((prev) => ({
                                      ...prev,
                                      [cpo.id]: e.target.value,
                                    }))
                                  }
                                  className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                                />
                              </div>
                            </div>
                            <Button
                              variant="primary"
                              onClick={() => {
                                const spo = approveCustomerPOAndCreateSupplierPO({
                                  cpoId: cpo.id,
                                  fulfilmentMode: modeVal,
                                  expectedDispatchDate: dispDate,
                                  approvedBy: staffAssignee,
                                });
                                triggerToast(
                                  `Approved ${cpo.cpoNumber} and generated internal Supplier PO ${spo.spoNumber}!`
                                );
                              }}
                              className="w-full font-bold"
                            >
                              Approve Customer PO & Issue Supplier PO (PS-SPO)
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 8: FULFILMENT, DELIVERY & POD MANAGEMENT (STEP 10)              */}
      {/* =================================================================== */}
      {subTab === 'fulfilment_delivery' && (
        <div className="space-y-6">
          <Card className="p-6 border-slate-200 bg-white space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Step 10: 6-Stage Order Fulfilment, Logistics Coordination & POD Desk
              </h3>
              <p className="text-xs text-slate-500">
                Coordinate third-party logistics or supplier direct dispatch, update the 6 customer-visible milestones, and upload Delivery Notes (`DN`) & Proof of Delivery (`POD`).
              </p>
            </div>

            {orderFulfilments.map((ful) => {
              const stages: { id: FulfilmentStage; label: string }[] = [
                { id: 'order_confirmed', label: '1. Order Confirmed' },
                { id: 'procurement_processing', label: '2. Procurement Processing' },
                { id: 'supplier_confirmed', label: '3. Supplier Confirmed' },
                { id: 'ready_for_dispatch', label: '4. Ready for Dispatch' },
                { id: 'in_transit', label: '5. In Transit' },
                { id: 'delivered', label: '6. Delivered' },
              ];
              const currentIdx = stages.findIndex((s) => s.id === ful.currentStage);
              const edit = logisticsEdit[ful.id] || {
                provider: ful.logisticsProvider || 'Coordinated UAE Flatbed & Crane Partner',
                contact: ful.deliveryContactName || 'Rashid (Dispatch Coordinator)',
                phone: ful.deliveryContactPhone || '+971 52 991 4020',
                tracking: ful.trackingReference || 'PS-TRK-DXB-90014',
                summary: ful.deliveredItemsSummary || 'Full BOQ Order Lot',
                isPartial: ful.isPartialDelivery,
              };
              const docs = deliveryDocuments.filter((d) => d.cpoId === ful.cpoId);

              return (
                <div
                  key={ful.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-4 text-xs"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="font-mono font-black text-sm text-[#9e1c2e]">
                        Customer PO: {ful.cpoNumber}
                      </span>
                      {ful.spoNumber && (
                        <span className="ml-2 font-mono font-bold text-slate-700">
                          • Linked Supplier PO: {ful.spoNumber}
                        </span>
                      )}
                      <div className="text-slate-500 mt-0.5">
                        Destination: <strong>{ful.deliveryAddress}</strong> • Mode:{' '}
                        <strong>
                          {ful.fulfilmentMode === 'procuresouq_arranged'
                            ? 'ProcureSouq-Arranged Pickup & Delivery'
                            : 'Supplier Direct Delivery Coordinated by ProcureSouq'}
                        </strong>
                      </div>
                    </div>
                    {ful.customerAcknowledged && (
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold border border-emerald-300">
                        ✓ Customer Acknowledged Receipt on Site
                      </span>
                    )}
                  </div>

                  {/* 6-Stage Progress Stepper */}
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                    {stages.map((st, idx) => {
                      const done = idx <= currentIdx;
                      return (
                        <button
                          key={st.id}
                          onClick={() => {
                            updateFulfilmentStage(ful.id, st.id, {
                              logisticsProvider: edit.provider,
                              deliveryContactName: edit.contact,
                              deliveryContactPhone: edit.phone,
                              trackingReference: edit.tracking,
                              deliveredItemsSummary: edit.summary,
                              isPartialDelivery: edit.isPartial,
                            });
                            triggerToast(`Updated ${ful.cpoNumber} stage to "${st.label}"`);
                          }}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            done
                              ? 'bg-emerald-600 text-white border-emerald-700 font-bold shadow-sm'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          <div className="text-[11px] font-extrabold">{st.label}</div>
                          {ful.stageTimestamps[st.id] && (
                            <div className="text-[9px] opacity-85 mt-0.5">
                              {new Date(ful.stageTimestamps[st.id]!).toLocaleDateString()}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Logistics Details & Document Upload */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200">
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Logistics Provider</label>
                      <input
                        type="text"
                        value={edit.provider}
                        onChange={(e) =>
                          setLogisticsEdit((prev) => ({
                            ...prev,
                            [ful.id]: { ...edit, provider: e.target.value },
                          }))
                        }
                        className="w-full p-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Delivery Contact & Phone</label>
                      <input
                        type="text"
                        value={`${edit.contact} (${edit.phone})`}
                        onChange={(e) =>
                          setLogisticsEdit((prev) => ({
                            ...prev,
                            [ful.id]: { ...edit, contact: e.target.value },
                          }))
                        }
                        className="w-full p-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Tracking Reference</label>
                      <input
                        type="text"
                        value={edit.tracking}
                        onChange={(e) =>
                          setLogisticsEdit((prev) => ({
                            ...prev,
                            [ful.id]: { ...edit, tracking: e.target.value },
                          }))
                        }
                        className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          uploadDeliveryDocument({
                            cpoId: ful.cpoId,
                            spoId: ful.spoId,
                            documentType: 'proof_of_delivery',
                            documentNumber: `POD-${ful.cpoNumber}`,
                            fileName: `Signed_POD_${ful.cpoNumber}.pdf`,
                            fileUrl: `#pod-${ful.cpoNumber}.pdf`,
                            uploadedByRole: 'admin',
                            uploadedByName: staffAssignee,
                            visibleToBuyer: true,
                          });
                          triggerToast(`Uploaded Proof of Delivery (POD) for ${ful.cpoNumber}`);
                        }}
                        className="w-full"
                      >
                        + Upload Signed POD / DN
                      </Button>
                    </div>
                  </div>

                  {/* Attached Delivery Documents */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-600">Official Order & Delivery Documents:</span>
                    {docs.map((d) => (
                      <span
                        key={d.id}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-semibold text-slate-800 flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#9e1c2e]" />
                        <span>
                          {d.documentType.toUpperCase()}: {d.fileName}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 9: BUYER & SUPPLIER HUB-AND-SPOKE MESSAGING DESK                */}
      {/* =================================================================== */}
      {subTab === 'messages_desk' && (() => {
        // Build unified list of Buyer & Supplier companies that Admin can communicate with
        const companyDirectoryMap = new Map<
          string,
          { id: string; name: string; role: 'buyer' | 'supplier'; emirate?: string }
        >();

        // 1. Add buyers from RFQs
        rfqs.forEach((r) => {
          if (r.buyerCompanyId && r.buyerCompanyName) {
            companyDirectoryMap.set(r.buyerCompanyId, {
              id: r.buyerCompanyId,
              name: r.buyerCompanyName,
              role: 'buyer',
              emirate: r.deliveryEmirate,
            });
          }
        });

        // 2. Add registered companies from companies state
        companies.forEach((c) => {
          if (c.id !== 'procuresouq-admin') {
            companyDirectoryMap.set(c.id, {
              id: c.id,
              name: c.name,
              role: c.companyType === 'buyer' ? 'buyer' : 'supplier',
              emirate: c.emirate,
            });
          }
        });

        // 3. Add any company that has sent a message in messages
        messages.forEach((m) => {
          if (
            m.senderCompanyId &&
            m.senderCompanyId !== 'procuresouq-admin' &&
            m.senderRole !== 'admin'
          ) {
            companyDirectoryMap.set(m.senderCompanyId, {
              id: m.senderCompanyId,
              name: m.senderCompanyName || 'Platform User',
              role: m.senderRole === 'supplier' ? 'supplier' : 'buyer',
            });
          }
        });

        const allCounterparties = Array.from(companyDirectoryMap.values()).filter((cp) =>
          msgRoleFilter === 'all' ? true : cp.role === msgRoleFilter
        );

        // Sort counterparties so those with recent messages appear at the top
        allCounterparties.sort((a, b) => {
          const aCount = messages.filter(
            (m) => m.senderCompanyId === a.id || m.recipientCompanyId === a.id
          ).length;
          const bCount = messages.filter(
            (m) => m.senderCompanyId === b.id || m.recipientCompanyId === b.id
          ).length;
          return bCount - aCount;
        });

        const activePartner =
          allCounterparties.find((cp) => cp.id === selectedMsgCompanyId) ||
          allCounterparties[0] ||
          null;

        const partnerMessages = activePartner
          ? messages.filter(
              (m) =>
                m.id !== 'msg-1' &&
                m.id !== 'msg-2-voice' &&
                (m.senderCompanyId === activePartner.id ||
                  m.recipientCompanyId === activePartner.id)
            )
          : [];

        const handleSendAdminReply = (e: React.FormEvent) => {
          e.preventDefault();
          if (!activePartner || !adminReplyText.trim()) return;

          const matchedRfq = rfqs.find((r) => r.id === adminReplyChannelId);
          const channelRfqId = matchedRfq ? matchedRfq.id : 'procuresouq-general-support';
          const channelRfqNumber = matchedRfq ? matchedRfq.rfqNumber : 'PS-SUPPORT';

          sendMessage({
            rfqId: channelRfqId,
            rfqNumber: channelRfqNumber,
            senderId: 'admin-ops-desk',
            senderName: 'ProcureSouq Operations Desk',
            senderCompanyId: 'procuresouq-admin',
            senderCompanyName:
              activePartner.role === 'supplier'
                ? 'ProcureSouq Supplier Operations Desk'
                : 'ProcureSouq Procurement & Customer Support Desk',
            senderRole: 'admin',
            recipientCompanyId: activePartner.id,
            recipientCompanyName: activePartner.name,
            messageText: adminReplyText.trim(),
          });

          setAdminReplyText('');
          triggerToast(
            `Sent official ProcureSouq reply to ${activePartner.name} (${activePartner.role.toUpperCase()}) on ${channelRfqNumber}.`
          );
        };

        return (
          <div className="space-y-6">
            <Card className="p-5 border-slate-200 bg-white space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                      Anti-Circumvention Hub-and-Spoke Messaging
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Buyer & Supplier Manual Support & Clarification Desk
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Buyers and Suppliers never communicate directly with each other. All Buyer questions and Supplier questions arrive here at ProcureSouq’s central desk for manual response.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
                  {(['all', 'buyer', 'supplier'] as const).map((filterRole) => (
                    <button
                      key={filterRole}
                      type="button"
                      onClick={() => setMsgRoleFilter(filterRole)}
                      className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                        msgRoleFilter === filterRole
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {filterRole === 'all'
                        ? 'All Threads'
                        : filterRole === 'buyer'
                        ? 'Buyers (Clients)'
                        : 'Suppliers (Vendors)'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[480px]">
                {/* Left Column: Buyer & Supplier Directory / Threads */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden flex flex-col">
                  <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-extrabold text-slate-700">
                    <span>Counterparty Accounts</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[10px]">
                      {allCounterparties.length} Accounts
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 overflow-y-auto max-h-[440px]">
                    {allCounterparties.map((cp) => {
                      const isSelected = activePartner?.id === cp.id;
                      const threadMsgs = messages.filter(
                        (m) =>
                          m.id !== 'msg-1' &&
                          m.id !== 'msg-2-voice' &&
                          (m.senderCompanyId === cp.id || m.recipientCompanyId === cp.id)
                      );
                      const lastMsg = threadMsgs[threadMsgs.length - 1];

                      return (
                        <button
                          key={cp.id}
                          type="button"
                          onClick={() => setSelectedMsgCompanyId(cp.id)}
                          className={`w-full text-left p-3.5 transition-colors flex items-start justify-between gap-2 cursor-pointer ${
                            isSelected
                              ? 'bg-rose-50/80 border-l-4 border-[#9e1c2e]'
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                  cp.role === 'buyer'
                                    ? 'bg-sky-100 text-sky-800'
                                    : 'bg-amber-100 text-amber-900'
                                }`}
                              >
                                {cp.role}
                              </span>
                              <span className="text-xs font-extrabold text-slate-900 truncate">
                                {cp.name}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-1">
                              {lastMsg
                                ? `${lastMsg.senderRole === 'admin' ? 'You: ' : ''}${lastMsg.messageText}`
                                : 'No messages yet — Click to message'}
                            </p>
                          </div>
                          {threadMsgs.length > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-[#9e1c2e] text-white text-[10px] font-extrabold shrink-0">
                              {threadMsgs.length}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Conversation Thread & Manual Reply Box */}
                <div className="md:col-span-2 border border-slate-200 rounded-2xl flex flex-col justify-between overflow-hidden">
                  {activePartner ? (
                    <>
                      <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                activePartner.role === 'buyer'
                                  ? 'bg-sky-500 text-white'
                                  : 'bg-amber-400 text-slate-950'
                              }`}
                            >
                              {activePartner.role === 'buyer'
                                ? 'BUYER / CUSTOMER'
                                : 'VERIFIED SUPPLIER'}
                            </span>
                            <h4 className="text-sm font-extrabold">{activePartner.name}</h4>
                          </div>
                          <p className="text-[11px] text-slate-300 mt-0.5">
                            Isolated 1-on-1 Channel with ProcureSouq Desk • Counterparty cannot see other {activePartner.role === 'buyer' ? 'suppliers' : 'buyers'}.
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-bold text-slate-300 uppercase">
                            Tag Channel:
                          </label>
                          <select
                            value={adminReplyChannelId}
                            onChange={(e) => setAdminReplyChannelId(e.target.value)}
                            className="bg-slate-800 text-white text-xs font-bold p-1.5 rounded-lg border border-slate-700"
                          >
                            <option value="procuresouq-general-support">
                              PS-SUPPORT (General Support Desk)
                            </option>
                            {rfqs.map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.rfqNumber} — {r.title.slice(0, 28)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Messages History */}
                      <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[340px] bg-slate-50">
                        {partnerMessages.length > 0 ? (
                          partnerMessages.map((m) => {
                            const isAdminSender =
                              m.senderRole === 'admin' ||
                              m.senderCompanyId === 'procuresouq-admin';
                            return (
                              <div
                                key={m.id}
                                className={`flex flex-col ${
                                  isAdminSender ? 'items-end' : 'items-start'
                                }`}
                              >
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1">
                                  <span className="font-mono font-bold text-[#9e1c2e]">
                                    [{m.rfqNumber || 'PS-SUPPORT'}]
                                  </span>
                                  <span className="font-bold text-slate-700">
                                    {isAdminSender
                                      ? 'ProcureSouq Desk (You)'
                                      : `${m.senderName} (${activePartner.name})`}
                                  </span>
                                  <span>•</span>
                                  <span>{formatDate(m.createdAt)}</span>
                                </div>
                                <div
                                  className={`p-3 rounded-2xl max-w-md text-xs leading-relaxed ${
                                    isAdminSender
                                      ? 'bg-[#9e1c2e] text-white rounded-br-none'
                                      : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none shadow-2xs'
                                  }`}
                                >
                                  {m.voiceNoteUrl ? `🎤 ${m.messageText}` : m.messageText}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-14 text-slate-400 text-xs">
                            No messages exchanged with <strong>{activePartner.name}</strong> yet. Send a message below to initiate contact from ProcureSouq’s Desk.
                          </div>
                        )}
                      </div>

                      {/* Manual Reply Input */}
                      <form
                        onSubmit={handleSendAdminReply}
                        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
                      >
                        <input
                          type="text"
                          value={adminReplyText}
                          onChange={(e) => setAdminReplyText(e.target.value)}
                          placeholder={`Type manual response from ProcureSouq Team to ${activePartner.name}...`}
                          className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#9e1c2e]"
                        />
                        <Button
                          type="submit"
                          variant="primary"
                          size="sm"
                          leftIcon={<Send className="w-3.5 h-3.5" />}
                        >
                          Send Reply
                        </Button>
                      </form>
                    </>
                  ) : (
                    <div className="p-12 text-center text-xs text-slate-400">
                      Select a Buyer or Supplier account on the left to view or send messages.
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        );
      })()}

      {/* =================================================================== */}
      {/* TAB 10: PROFITABILITY & APPROVAL AUDIT TRAIL                        */}
      {/* =================================================================== */}
      {subTab === 'profitability' && (
        <div className="space-y-6">
          <Card className="p-6 border-slate-200 bg-white space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">
              Internal Deal Profitability & Margin Breakdown (Confidential Admin Ledger)
            </h3>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 text-white text-[10px] uppercase">
                    <th className="py-2.5 px-3">RFQ / Offer</th>
                    <th className="py-2.5 px-3 text-right">Supplier Cost (Ex-VAT)</th>
                    <th className="py-2.5 px-3 text-right">Freight & Other Cost</th>
                    <th className="py-2.5 px-3 text-right">ProcureSouq Margin</th>
                    <th className="py-2.5 px-3 text-right">Customer Selling (Ex-VAT)</th>
                    <th className="py-2.5 px-3 text-right">5% UAE VAT</th>
                    <th className="py-2.5 px-3 text-right">Customer Landed Total</th>
                    <th className="py-2.5 px-3 text-right">Gross Margin %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {internalCosts.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                        {c.customerOfferId || c.quotationId}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">{formatAED(c.supplierCostExVatAED)}</td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        {formatAED(c.freightDeliveryCostAED + c.otherProcurementCostAED)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-extrabold text-emerald-700">
                        +{formatAED(c.calculatedMarginAED)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">
                        {formatAED(c.customerSellingPriceBeforeVatAED)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">{formatAED(c.customerVatAED)}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-black text-[#9e1c2e]">
                        {formatAED(c.customerLandedTotalAED)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                        {c.grossMarginPercent}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-6 border-slate-200 bg-white space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-[#9e1c2e]" />
              <span>Approval & Governance Audit Trail</span>
            </h3>
            <div className="space-y-2">
              {approvalHistory.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-[#9e1c2e] mr-2">{rec.action}</span>
                    <span className="text-slate-700">{rec.notes}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 shrink-0">
                    {rec.approvedBy} • {formatDate(rec.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 10: COMMERCIAL & LEGAL CONFIGURATION                            */}
      {/* =================================================================== */}
      {subTab === 'commercial_settings' && (
        <Card className="p-6 border-slate-200 bg-white space-y-5 max-w-4xl">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Commercial, Legal & Contracting Entity Configuration
            </h3>
            <p className="text-xs text-slate-500">
              Do not automatically assume ProcureSouq is legally authorized to sell, invoice, collect payments, or act as a principal reseller until administrator commercial approval is enabled below.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Commercial Operating Model</label>
              <select
                value={commercialSettings.operatingModel}
                onChange={(e) =>
                  updateCommercialSettings({ operatingModel: e.target.value as any })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
              >
                <option value="managed_intermediary">
                  Managed Procurement Intermediary (Default Hybrid Model)
                </option>
                <option value="principal_reseller">
                  Principal Reseller (Buy & Resell Under ProcureSouq Entity)
                </option>
                <option value="hybrid_configurable">
                  Hybrid Configurable (Per Deal Approval)
                </option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Configurable Contracting Entity Name
              </label>
              <input
                type="text"
                value={commercialSettings.contractingEntityName}
                onChange={(e) =>
                  updateCommercialSettings({ contractingEntityName: e.target.value })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                UAE TRN (Tax Registration Number)
              </label>
              <input
                type="text"
                value={commercialSettings.trnNumber}
                onChange={(e) => updateCommercialSettings({ trnNumber: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Default Procurement Markup (%)
              </label>
              <input
                type="number"
                step="0.5"
                value={commercialSettings.defaultMarkupPercent}
                onChange={(e) =>
                  updateCommercialSettings({ defaultMarkupPercent: Number(e.target.value) })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-200 text-xs">
            <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
              <div>
                <div className="font-extrabold text-slate-900">
                  Administrator Approval for Commercial & Legal Configuration
                </div>
                <div className="text-slate-500">
                  Required before enabling legally binding platform-generated Purchase Orders or Tax Invoices.
                </div>
              </div>
              <input
                type="checkbox"
                checked={commercialSettings.isCommercialConfigApproved}
                onChange={(e) =>
                  updateCommercialSettings({
                    isCommercialConfigApproved: e.target.checked,
                    allowBindingPoGeneration: e.target.checked,
                  })
                }
                className="w-5 h-5 accent-[#9e1c2e]"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
              <div>
                <div className="font-extrabold text-slate-900">
                  Disclose Underlying Supplier Identity on Customer Offers
                </div>
                <div className="text-slate-500">
                  Keep OFF (Recommended) so customers see only ProcureSouq Offer 1..5 without confidential supplier contact details.
                </div>
              </div>
              <input
                type="checkbox"
                checked={commercialSettings.discloseSupplierIdentityToBuyer}
                onChange={(e) =>
                  updateCommercialSettings({
                    discloseSupplierIdentityToBuyer: e.target.checked,
                  })
                }
                className="w-5 h-5 accent-[#9e1c2e]"
              />
            </label>
          </div>
        </Card>
      )}
    </div>
  );
};
