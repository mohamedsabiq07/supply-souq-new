import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  RFQ,
  Quotation,
  PurchaseOrder,
  Company,
  Category,
  Message,
  Review,
  VerificationRequest,
  DeclineRFQRecord,
  RFQStatus,
  OrderStatus,
  VerificationStatus,
  TelemetryItem,
  CommercialSettings,
  SupplierRFQInvitation,
  QuotationEvaluation,
  PricingRule,
  InternalCostBreakdown,
  CustomerOffer,
  CustomerPurchaseOrder,
  SupplierPurchaseOrder,
  OrderFulfilment,
  FulfilmentStage,
  FulfilmentMode,
  DeliveryRecord,
  DeliveryDocument,
  ApprovalHistoryRecord,
  PlatformNotification,
} from '../types';
import {
  initialRFQs,
  initialQuotations,
  initialPurchaseOrders,
  initialCompanies,
  initialCategories,
  initialMessages,
  initialReviews,
  initialVerifications,
  defaultCommercialSettings,
  defaultPricingRules,
  v2TestInvitations,
  v2TestEvaluations,
  v2TestInternalCosts,
  v2TestCustomerOffers,
  v2TestCustomerPOs,
  v2TestSupplierPOs,
  v2TestFulfilments,
  v2TestDeliveries,
  v2TestDeliveryDocuments,
  v2TestApprovalHistory,
  v2TestNotifications,
} from '../data/seedData';
import { supabase } from '../lib/supabase';
import { 
  supabaseService, 
  mapRFQFromDB, 
  mapQuotationFromDB, 
  mapPOFromDB, 
  mapMessageFromDB 
} from '../services/supabaseService';

interface AppDataContextType {
  rfqs: RFQ[];
  quotations: Quotation[];
  purchaseOrders: PurchaseOrder[];
  companies: Company[];
  categories: Category[];
  messages: Message[];
  reviews: Review[];
  verifications: VerificationRequest[];
  declinedRFQs: DeclineRFQRecord[];
  isSupabaseConnected: boolean;
  isSyncing: boolean;

  // --- PROCURESOUQ V2 MANAGED PROCUREMENT ENTITIES ---
  commercialSettings: CommercialSettings;
  pricingRules: PricingRule[];
  supplierInvitations: SupplierRFQInvitation[];
  quotationEvaluations: QuotationEvaluation[];
  internalCosts: InternalCostBreakdown[];
  customerOffers: CustomerOffer[];
  customerPOs: CustomerPurchaseOrder[];
  supplierPOs: SupplierPurchaseOrder[];
  orderFulfilments: OrderFulfilment[];
  deliveryRecords: DeliveryRecord[];
  deliveryDocuments: DeliveryDocument[];
  approvalHistory: ApprovalHistoryRecord[];
  notifications: PlatformNotification[];
  
  // RFQ Methods
  createRFQ: (newRFQ: Omit<RFQ, 'id' | 'rfqNumber' | 'createdAt' | 'updatedAt' | 'quotesCount' | 'invitedCount'>) => RFQ;
  updateRFQStatus: (rfqId: string, status: RFQStatus) => void;
  getRFQById: (rfqId: string) => RFQ | undefined;
  cancelRFQByBuyer: (rfqId: string, reason: string, notes?: string) => void;
  deleteRFQ: (rfqId: string) => void;
  declineRFQ: (rfqId: string, supplierCompanyId: string, supplierCompanyName: string, reason: string, notes?: string) => void;
  isRFQDeclinedBySupplier: (rfqId: string, supplierCompanyId: string) => boolean;
  
  // Quotation Methods
  submitQuotation: (quoteData: Omit<Quotation, 'id' | 'quotationNumber' | 'submittedAt' | 'status'>) => Quotation;
  getQuotesForRFQ: (rfqId: string) => Quotation[];
  getQuotationsForSupplier: (supplierCompanyId: string) => Quotation[];
  getRFQQuoteCapacity: (rfqId: string) => { currentCount: number; maxAllowed: number; spotsLeft: number; isCapped: boolean };
  canSupplierQuote: (rfqId: string, supplierCompanyId: string) => { canQuote: boolean; reason?: 'already_quoted' | 'capacity_full' | 'rfq_cancelled' | 'rfq_declined'; spotsLeft: number; maxAllowed: number; currentCount: number };
  hasSupplierQuoted: (rfqId: string, supplierCompanyId: string) => boolean;
  
  // Awarding & Orders
  awardQuotation: (rfqId: string, quotationId: string) => PurchaseOrder;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNotes?: string) => void;
  getOrderById: (orderId: string) => PurchaseOrder | undefined;

  // --- PROCURESOUQ V2 MANAGED PROCUREMENT METHODS ---
  updateCommercialSettings: (updates: Partial<CommercialSettings>, approvedBy?: string) => void;
  updateRFQAdminWorkflow: (rfqId: string, updates: Partial<RFQ>, actorName?: string) => void;
  inviteSuppliersToRFQ: (rfqId: string, supplierIds: string[], channel: 'portal' | 'email' | 'whatsapp_future' | 'manual_admin', deadline?: string, invitedBy?: string) => SupplierRFQInvitation[];
  uploadManualSupplierQuote: (quoteData: Omit<Quotation, 'id' | 'quotationNumber' | 'submittedAt' | 'status'>) => Quotation;
  evaluateSupplierQuote: (evalData: Omit<QuotationEvaluation, 'id' | 'evaluatedAt'>) => QuotationEvaluation;
  calculateAndSaveInternalCost: (params: {
    rfqId: string;
    quotationId: string;
    freightDeliveryCostAED: number;
    otherProcurementCostAED: number;
    otherCostDescription?: string;
    markupType: 'percentage' | 'fixed_fee' | 'hybrid';
    markupPercent: number;
    fixedFeeAED: number;
    createdBy?: string;
  }) => InternalCostBreakdown;
  publishCustomerOffersForRFQ: (rfqId: string, selectedQuoteIds: string[], actorName?: string) => CustomerOffer[];
  getCustomerOffersForRFQ: (rfqId: string) => CustomerOffer[];
  selectOfferAndCreateCustomerPO: (params: {
    rfqId: string;
    customerOfferId: string;
    orderingMethod: 'uploaded_po' | 'platform_generated_po';
    customerPoReference?: string;
    uploadedPoFileName?: string;
    uploadedPoUrl?: string;
    notes?: string;
  }) => CustomerPurchaseOrder;
  approveCustomerPOAndCreateSupplierPO: (params: {
    cpoId: string;
    fulfilmentMode: FulfilmentMode;
    expectedDispatchDate: string;
    internalNotes?: string;
    approvedBy?: string;
  }) => SupplierPurchaseOrder;
  requestCustomerPOCancellation: (cpoId: string, reason: string, requestedByRole: 'buyer' | 'admin') => void;
  confirmSupplierPO: (spoId: string, status: 'confirmed' | 'rejected_or_delayed', notes?: string) => void;
  updateFulfilmentStage: (fulfilmentId: string, stage: FulfilmentStage, updates?: Partial<OrderFulfilment>, actorName?: string) => void;
  uploadDeliveryDocument: (doc: Omit<DeliveryDocument, 'id' | 'createdAt'>) => DeliveryDocument;
  acknowledgeDeliveryReceipt: (fulfilmentId: string, notes?: string) => void;
  reportDeliveryIssue: (fulfilmentId: string, issueNotes: string) => void;
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: (role: string, companyId?: string) => void;
  
  // Messaging
  sendMessage: (msg: Omit<Message, 'id' | 'createdAt' | 'isRead'>) => Message;
  getMessagesForRFQ: (rfqId: string) => Message[];
  
  // Reviews & Quotation Ratings
  submitReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  rateQuotation: (rfqId: string, quotationId: string, rating: number, feedback?: string) => void;
  
  // Admin Verification
  updateVerificationStatus: (companyId: string, status: VerificationStatus, notes?: string) => void;

  // Extended Quotations Paywall (5 quotes limit + 5 more for AED 49)
  unlockedRFQIds: string[];
  unlockExtendedQuotes: (rfqId: string) => void;
  isRFQExtendedUnlocked: (rfqId: string) => boolean;
  
  // Live Telemetry & Market Intelligence
  telemetryItems: TelemetryItem[];
  updateTelemetryItem: (id: string, updates: Partial<TelemetryItem>) => void;
  addTelemetryItem: (item: Omit<TelemetryItem, 'id'>) => TelemetryItem;
  deleteTelemetryItem: (id: string) => void;
  toggleTelemetryActive: (id: string) => void;
  resetTelemetryToDefaults: () => void;
  isMicroTickActive: boolean;
  setIsMicroTickActive: (active: boolean) => void;
  computedPlatformMetrics: {
    avgSavingsPercent: number;
    verifiedStockistsCount: number;
    slaCompliancePercent: number;
    totalQuotesCount: number;
  };

  // Reset
  resetToDefaults: () => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

const STORAGE_KEY = 'procuresouq_v2_managed_v1';

export const defaultTelemetryItems: TelemetryItem[] = [
  {
    id: 'lme-copper',
    label: 'LME COPPER SPOT',
    value: '$9,245.50 / MT',
    change: '+1.18%',
    isPositive: true,
    category: 'metal',
    source: 'financial_feed',
    isActive: true,
    basePrice: 9245.5,
    currency: 'USD',
    unit: 'MT',
    lastUpdated: '2026-09-12T10:00:00Z',
  },
  {
    id: 'lme-aluminum',
    label: 'LME ALUMINUM SPOT',
    value: '$2,380.00 / MT',
    change: '+0.65%',
    isPositive: true,
    category: 'metal',
    source: 'financial_feed',
    isActive: true,
    basePrice: 2380.0,
    currency: 'USD',
    unit: 'MT',
    lastUpdated: '2026-09-12T10:00:00Z',
  },
  {
    id: 'emirates-steel-rebar',
    label: 'EMIRATES STEEL REBAR (12-32mm)',
    value: 'AED 2,450 / MT',
    change: 'STABLE',
    isPositive: true,
    category: 'building',
    source: 'admin_manual',
    isActive: true,
    basePrice: 2450,
    currency: 'AED',
    unit: 'MT',
    lastUpdated: '2026-09-12T10:00:00Z',
  },
  {
    id: 'ducab-cable',
    label: 'DUCAB CABLE INDEX (CU/XLPE)',
    value: 'AED 28.40 / M',
    change: 'STABLE',
    isPositive: true,
    category: 'electrical',
    source: 'admin_manual',
    isActive: true,
    basePrice: 28.4,
    currency: 'AED',
    unit: 'M',
    lastUpdated: '2026-09-12T10:00:00Z',
  },
  {
    id: 'national-opc-cement',
    label: 'OPC CEMENT 50KG (NATIONAL)',
    value: 'AED 14.20 / BAG',
    change: '+0.70%',
    isPositive: true,
    category: 'building',
    source: 'admin_manual',
    isActive: true,
    basePrice: 14.2,
    currency: 'AED',
    unit: 'BAG',
    lastUpdated: '2026-09-12T10:00:00Z',
  },
  {
    id: 'commercial-diesel',
    label: 'COMMERCIAL DIESEL (ENOC)',
    value: 'AED 3.12 / L',
    change: '-0.95%',
    isPositive: false,
    category: 'energy',
    source: 'admin_manual',
    isActive: true,
    basePrice: 3.12,
    currency: 'AED',
    unit: 'L',
    lastUpdated: '2026-09-12T10:00:00Z',
  },
  {
    id: 'platform-savings',
    label: 'CONTRACTOR AVERAGE SAVINGS',
    value: '18.4% SAVED',
    change: 'VERIFIED',
    isPositive: true,
    category: 'platform',
    source: 'dynamic_platform',
    isActive: true,
    lastUpdated: '2026-09-12T10:00:00Z',
  },
  {
    id: 'platform-sla',
    label: 'CONTRACTOR 24H SLA RATE',
    value: '100% ON-TIME',
    change: 'GUARANTEED',
    isPositive: true,
    category: 'sla',
    source: 'dynamic_platform',
    isActive: true,
    lastUpdated: '2026-09-12T10:00:00Z',
  },
  {
    id: 'platform-stockists',
    label: 'UAE VERIFIED STOCKISTS',
    value: '32 ACTIVE IN DUBAI & SHARJAH',
    change: 'DET LICENSED',
    isPositive: true,
    category: 'platform',
    source: 'dynamic_platform',
    isActive: true,
    lastUpdated: '2026-09-12T10:00:00Z',
  },
];

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Initialize from LocalStorage or seed data
  const [rfqs, setRfqs] = useState<RFQ[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_rfqs`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {}
    return initialRFQs;
  });

  const [quotations, setQuotations] = useState<Quotation[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_quotes`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {}
    return initialQuotations;
  });

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_pos`);
      return saved ? JSON.parse(saved) : initialPurchaseOrders;
    } catch (e) {
      return initialPurchaseOrders;
    }
  });

  const [companies, setCompanies] = useState<Company[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_companies`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {}
    return initialCompanies;
  });

  const [categories] = useState<Category[]>(initialCategories);

  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_msgs`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((m: any) => m.id !== 'msg-1' && m.id !== 'msg-2-voice');
        }
      }
      return initialMessages;
    } catch (e) {
      return initialMessages;
    }
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_revs`);
      return saved ? JSON.parse(saved) : initialReviews;
    } catch (e) {
      return initialReviews;
    }
  });

  const [verifications, setVerifications] = useState<VerificationRequest[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_verifications`);
      return saved ? JSON.parse(saved) : initialVerifications;
    } catch (e) {
      return initialVerifications;
    }
  });

  const [declinedRFQs, setDeclinedRFQs] = useState<DeclineRFQRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_declined_rfqs`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [unlockedRFQIds, setUnlockedRFQIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_unlocked_rfqs`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // --- PROCURESOUQ V2 MANAGED PROCUREMENT STATES ---
  const [commercialSettings, setCommercialSettings] = useState<CommercialSettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_commercial_settings`);
      return saved ? JSON.parse(saved) : defaultCommercialSettings;
    } catch (e) {
      return defaultCommercialSettings;
    }
  });

  const [pricingRules, setPricingRules] = useState<PricingRule[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_pricing_rules`);
      return saved ? JSON.parse(saved) : defaultPricingRules;
    } catch (e) {
      return defaultPricingRules;
    }
  });

  const [supplierInvitations, setSupplierInvitations] = useState<SupplierRFQInvitation[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_supplier_invitations`);
      return saved ? JSON.parse(saved) : v2TestInvitations;
    } catch (e) {
      return v2TestInvitations;
    }
  });

  const [quotationEvaluations, setQuotationEvaluations] = useState<QuotationEvaluation[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_quote_evaluations`);
      return saved ? JSON.parse(saved) : v2TestEvaluations;
    } catch (e) {
      return v2TestEvaluations;
    }
  });

  const [internalCosts, setInternalCosts] = useState<InternalCostBreakdown[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_internal_costs`);
      return saved ? JSON.parse(saved) : v2TestInternalCosts;
    } catch (e) {
      return v2TestInternalCosts;
    }
  });

  const [customerOffers, setCustomerOffers] = useState<CustomerOffer[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_customer_offers`);
      return saved ? JSON.parse(saved) : v2TestCustomerOffers;
    } catch (e) {
      return v2TestCustomerOffers;
    }
  });

  const [customerPOs, setCustomerPOs] = useState<CustomerPurchaseOrder[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_customer_pos`);
      return saved ? JSON.parse(saved) : v2TestCustomerPOs;
    } catch (e) {
      return v2TestCustomerPOs;
    }
  });

  const [supplierPOs, setSupplierPOs] = useState<SupplierPurchaseOrder[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_supplier_pos`);
      return saved ? JSON.parse(saved) : v2TestSupplierPOs;
    } catch (e) {
      return v2TestSupplierPOs;
    }
  });

  const [orderFulfilments, setOrderFulfilments] = useState<OrderFulfilment[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_order_fulfilments`);
      return saved ? JSON.parse(saved) : v2TestFulfilments;
    } catch (e) {
      return v2TestFulfilments;
    }
  });

  const [deliveryRecords, setDeliveryRecords] = useState<DeliveryRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_delivery_records`);
      return saved ? JSON.parse(saved) : v2TestDeliveries;
    } catch (e) {
      return v2TestDeliveries;
    }
  });

  const [deliveryDocuments, setDeliveryDocuments] = useState<DeliveryDocument[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_delivery_documents`);
      return saved ? JSON.parse(saved) : v2TestDeliveryDocuments;
    } catch (e) {
      return v2TestDeliveryDocuments;
    }
  });

  const [approvalHistory, setApprovalHistory] = useState<ApprovalHistoryRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_approval_history`);
      return saved ? JSON.parse(saved) : v2TestApprovalHistory;
    } catch (e) {
      return v2TestApprovalHistory;
    }
  });

  const [notifications, setNotifications] = useState<PlatformNotification[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
      return saved ? JSON.parse(saved) : v2TestNotifications;
    } catch (e) {
      return v2TestNotifications;
    }
  });

  const unlockExtendedQuotes = (rfqId: string) => {
    setUnlockedRFQIds((prev) => {
      if (prev.includes(rfqId)) return prev;
      const next = [...prev, rfqId];
      try {
        localStorage.setItem(`${STORAGE_KEY}_unlocked_rfqs`, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const isRFQExtendedUnlocked = (rfqId: string) => {
    return unlockedRFQIds.includes(rfqId);
  };

  const isRFQDeclinedBySupplier = (rfqId: string, supplierCompanyId: string) => {
    return declinedRFQs.some(d => d.rfqId === rfqId && d.supplierCompanyId === supplierCompanyId);
  };

  // Live Telemetry Items State
  const [telemetryItems, setTelemetryItems] = useState<TelemetryItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_telemetry_items`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultTelemetryItems;
  });

  const [isMicroTickActive, setIsMicroTickActiveState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_microtick_active`);
      if (saved !== null) return saved === 'true';
    } catch (e) {}
    return true;
  });

  const setIsMicroTickActive = (active: boolean) => {
    setIsMicroTickActiveState(active);
    try {
      localStorage.setItem(`${STORAGE_KEY}_microtick_active`, String(active));
    } catch (e) {}
  };

  // Computed dynamic platform metrics based on real platform RFQs, quotes & stockists
  const computedPlatformMetrics = React.useMemo(() => {
    // 1. Verified stockists count
    const verifiedSuppliers = companies.filter(
      (c) => (c.companyType === 'supplier' || c.companyType === 'both') && c.verificationStatus === 'verified'
    );
    const verifiedStockistsCount = verifiedSuppliers.length > 0 ? verifiedSuppliers.length : 32;

    // 2. Average Contractor Savings %
    let totalSavingsPercent = 0;
    let rfqsWithMultipleQuotes = 0;

    rfqs.forEach((r) => {
      const rfqQuotes = quotations.filter((q) => q.rfqId === r.id);
      if (rfqQuotes.length >= 2) {
        const totals = rfqQuotes.map((q) => q.grandTotalAED).sort((a, b) => a - b);
        const lowest = totals[0];
        const highest = totals[totals.length - 1];
        if (highest > 0 && lowest > 0) {
          const savings = ((highest - lowest) / highest) * 100;
          totalSavingsPercent += savings;
          rfqsWithMultipleQuotes++;
        }
      }
    });

    const avgSavingsPercent = rfqsWithMultipleQuotes > 0 
      ? Number((totalSavingsPercent / rfqsWithMultipleQuotes).toFixed(1))
      : 18.4;

    // 3. SLA Compliance %
    const totalRFQs = rfqs.length;
    const rfqsWithQuotes = rfqs.filter((r) => quotations.some((q) => q.rfqId === r.id)).length;
    const slaCompliancePercent = totalRFQs > 0 ? Math.round((rfqsWithQuotes / totalRFQs) * 100) : 100;

    return {
      avgSavingsPercent,
      verifiedStockistsCount,
      slaCompliancePercent: Math.max(98, slaCompliancePercent),
      totalQuotesCount: quotations.length,
    };
  }, [rfqs, quotations, companies]);

  // Synchronize dynamic platform telemetry items with live calculations
  useEffect(() => {
    setTelemetryItems((prev) => {
      let changed = false;
      const updated = prev.map((item) => {
        if (item.id === 'platform-savings' && item.source === 'dynamic_platform') {
          const newVal = `${computedPlatformMetrics.avgSavingsPercent}% SAVED`;
          if (item.value !== newVal) {
            changed = true;
            return { ...item, value: newVal, lastUpdated: new Date().toISOString() };
          }
        }
        if (item.id === 'platform-stockists' && item.source === 'dynamic_platform') {
          const newVal = `${computedPlatformMetrics.verifiedStockistsCount} ACTIVE IN DUBAI & SHARJAH`;
          if (item.value !== newVal) {
            changed = true;
            return { ...item, value: newVal, lastUpdated: new Date().toISOString() };
          }
        }
        if (item.id === 'platform-sla' && item.source === 'dynamic_platform') {
          const newVal = `${computedPlatformMetrics.slaCompliancePercent}% ON-TIME`;
          if (item.value !== newVal) {
            changed = true;
            return { ...item, value: newVal, lastUpdated: new Date().toISOString() };
          }
        }
        return item;
      });
      return changed ? updated : prev;
    });
  }, [computedPlatformMetrics]);

  // Micro-Tick Engine: Subtle realistic fluctuations on global financial feed items
  useEffect(() => {
    if (!isMicroTickActive) return;

    const interval = setInterval(() => {
      setTelemetryItems((prev) => {
        const feedItems = prev.filter((item) => item.source === 'financial_feed' && item.isActive && item.basePrice);
        if (feedItems.length === 0) return prev;

        const targetIndex = Math.floor(Math.random() * feedItems.length);
        const targetItem = feedItems[targetIndex];

        // Micro-tick: -0.15% to +0.20%
        const deltaPercent = (Math.random() * 0.35 - 0.15) / 100;
        const currentPrice = targetItem.basePrice || 1000;
        const newPrice = Number((currentPrice * (1 + deltaPercent)).toFixed(2));
        const changePercentVal = Number(((newPrice - currentPrice) / currentPrice * 100).toFixed(2));
        const isPos = changePercentVal >= 0;
        const sign = isPos ? '+' : '';
        const changeStr = `${sign}${changePercentVal.toFixed(2)}%`;

        let formattedValue = '';
        if (targetItem.currency === 'USD') {
          formattedValue = `$${newPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ${targetItem.unit || 'MT'}`;
        } else {
          formattedValue = `AED ${newPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ${targetItem.unit || 'MT'}`;
        }

        return prev.map((item) => {
          if (item.id === targetItem.id) {
            return {
              ...item,
              basePrice: newPrice,
              value: formattedValue,
              change: changeStr,
              isPositive: isPos,
              lastUpdated: new Date().toISOString(),
            };
          }
          return item;
        });
      });
    }, 14000);

    return () => clearInterval(interval);
  }, [isMicroTickActive]);

  const saveTelemetryItems = (items: TelemetryItem[]) => {
    setTelemetryItems(items);
    try {
      localStorage.setItem(`${STORAGE_KEY}_telemetry_items`, JSON.stringify(items));
    } catch (e) {
      console.error('Error saving telemetry items to localStorage:', e);
    }
  };

  const updateTelemetryItem = (id: string, updates: Partial<TelemetryItem>) => {
    setTelemetryItems((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          return { ...item, ...updates, lastUpdated: new Date().toISOString() };
        }
        return item;
      });
      try {
        localStorage.setItem(`${STORAGE_KEY}_telemetry_items`, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const addTelemetryItem = (itemData: Omit<TelemetryItem, 'id'>): TelemetryItem => {
    const newItem: TelemetryItem = {
      ...itemData,
      id: `telemetry-${Date.now()}`,
      lastUpdated: new Date().toISOString(),
    };
    setTelemetryItems((prev) => {
      const updated = [newItem, ...prev];
      try {
        localStorage.setItem(`${STORAGE_KEY}_telemetry_items`, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    return newItem;
  };

  const deleteTelemetryItem = (id: string) => {
    setTelemetryItems((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      try {
        localStorage.setItem(`${STORAGE_KEY}_telemetry_items`, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const toggleTelemetryActive = (id: string) => {
    setTelemetryItems((prev) => {
      const updated = prev.map((i) => (i.id === id ? { ...i, isActive: !i.isActive } : i));
      try {
        localStorage.setItem(`${STORAGE_KEY}_telemetry_items`, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const resetTelemetryToDefaults = () => {
    saveTelemetryItems(defaultTelemetryItems);
  };

  // Helper to merge local and remote entities, with newer timestamps winning
  const mergeEntities = useCallback(<T extends { id: string; updatedAt?: string; createdAt?: string; submittedAt?: string }>(
    localList: T[],
    remoteList: T[]
  ): T[] => {
    const map = new Map<string, T>();
    localList.forEach(item => map.set(item.id, item));
    remoteList.forEach(remoteItem => {
      const existing = map.get(remoteItem.id);
      if (!existing) {
        map.set(remoteItem.id, remoteItem);
      } else {
        const existingTs = new Date(existing.updatedAt || existing.submittedAt || existing.createdAt || 0).getTime();
        const remoteTs = new Date(remoteItem.updatedAt || remoteItem.submittedAt || remoteItem.createdAt || 0).getTime();
        if (remoteTs >= existingTs) {
          map.set(remoteItem.id, remoteItem);
        }
      }
    });
    return Array.from(map.values());
  }, []);

  // Broadcast sync trigger to update all open tabs instantly
  const broadcastSync = useCallback(() => {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('supplysouq_realtime_sync');
        bc.postMessage({ type: 'SYNC_NOW', timestamp: Date.now() });
        bc.close();
      }
    } catch (e) {}
  }, []);

  // Real-time synchronization with Supabase cloud
  const initSupabase = useCallback(async (isInitial = false) => {
    if (isInitial) setIsSyncing(true);
    try {
      const result = await supabaseService.fetchAll();
      if (!result.error) {
        setIsSupabaseConnected(true);

        // 1. Merge Companies
        if (result.companies && result.companies.length > 0) {
          setCompanies((prev) => mergeEntities(prev, result.companies));
        }

        // 2. Merge RFQs
        if (result.rfqs && result.rfqs.length > 0) {
          setRfqs((prev) => mergeEntities(prev, result.rfqs));
        }

        // 3. Merge Quotations
        if (result.quotations && result.quotations.length > 0) {
          setQuotations((prev) => mergeEntities(prev, result.quotations));
        }

        // 4. Merge Purchase Orders
        if (result.purchaseOrders && result.purchaseOrders.length > 0) {
          setPurchaseOrders((prev) => mergeEntities(prev, result.purchaseOrders));
        }

        // 5. Merge Messages
        if (result.messages && result.messages.length > 0) {
          const cleanMsgs = result.messages.filter(m => m.id !== 'msg-1' && m.id !== 'msg-2-voice');
          setMessages((prev) => mergeEntities(prev, cleanMsgs));
        }

        // 6. Merge Verifications
        if (result.verifications && result.verifications.length > 0) {
          setVerifications((prev) => mergeEntities(prev, result.verifications));
        }
      }
    } catch (err) {
      console.warn('Realtime sync heartbeat check:', err);
    } finally {
      if (isInitial) setIsSyncing(false);
    }
  }, [mergeEntities]);

  // Initial load and Realtime Listeners across browser tabs and devices
  useEffect(() => {
    initSupabase(true);

    // 1. BroadcastChannel listener for instant cross-tab zero-latency updates
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('supplysouq_realtime_sync');
        bc.onmessage = () => {
          initSupabase(false);
        };
      }
    } catch (e) {}

    // 2. Storage event listener (fires when other tabs update localStorage)
    const handleStorage = (e: StorageEvent) => {
      if (e.key && e.key.startsWith(STORAGE_KEY)) {
        initSupabase(false);
      }
    };
    window.addEventListener('storage', handleStorage);

    // 3. Window focus and visibility listeners (instant sync when user switches tabs)
    const handleFocus = () => initSupabase(false);
    window.addEventListener('focus', handleFocus);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        initSupabase(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // 4. Smooth 3-second background heartbeat polling
    const heartbeat = setInterval(() => {
      initSupabase(false);
    }, 3000);

    return () => {
      if (bc) bc.close();
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(heartbeat);
    };
  }, [initSupabase]);

  // Supabase Realtime Subscriptions via WebSockets
  useEffect(() => {
    const channel = supabase
      .channel('supplysouq_realtime_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rfqs' }, (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const newRfq = mapRFQFromDB(payload.new);
          setRfqs((prev) => [newRfq, ...prev.filter((r) => r.id !== newRfq.id)]);
        } else if (payload.eventType === 'DELETE') {
          setRfqs((prev) => prev.filter((r) => r.id !== payload.old.id));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quotations' }, (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const newQuote = mapQuotationFromDB(payload.new);
          setQuotations((prev) => [newQuote, ...prev.filter((q) => q.id !== newQuote.id)]);
          // Also update the parent RFQ in memory
          setRfqs((prev) =>
            prev.map((r) => {
              if (r.id === newQuote.rfqId || r.rfqNumber === newQuote.rfqNumber) {
                return {
                  ...r,
                  quotesCount: (r.quotesCount || 0) + 1,
                  status: 'receiving_quotes',
                  updatedAt: new Date().toISOString()
                };
              }
              return r;
            })
          );
        } else if (payload.eventType === 'DELETE') {
          setQuotations((prev) => prev.filter((q) => q.id !== payload.old.id));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'purchase_orders' }, (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const newPo = mapPOFromDB(payload.new);
          setPurchaseOrders((prev) => [newPo, ...prev.filter((p) => p.id !== newPo.id)]);
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newMsg = mapMessageFromDB(payload.new);
          if (newMsg.id !== 'msg-1' && newMsg.id !== 'msg-2-voice') {
            setMessages((prev) => [...prev.filter((m) => m.id !== newMsg.id), newMsg]);
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Save to LocalStorage for instant offline persistence
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_rfqs`, JSON.stringify(rfqs));
  }, [rfqs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_quotes`, JSON.stringify(quotations));
  }, [quotations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_pos`, JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_companies`, JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_msgs`, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_revs`, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_verifs`, JSON.stringify(verifications));
  }, [verifications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_commercial_settings`, JSON.stringify(commercialSettings));
  }, [commercialSettings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_pricing_rules`, JSON.stringify(pricingRules));
  }, [pricingRules]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_supplier_invitations`, JSON.stringify(supplierInvitations));
  }, [supplierInvitations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_quote_evaluations`, JSON.stringify(quotationEvaluations));
  }, [quotationEvaluations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_internal_costs`, JSON.stringify(internalCosts));
  }, [internalCosts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_customer_offers`, JSON.stringify(customerOffers));
  }, [customerOffers]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_customer_pos`, JSON.stringify(customerPOs));
  }, [customerPOs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_supplier_pos`, JSON.stringify(supplierPOs));
  }, [supplierPOs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_order_fulfilments`, JSON.stringify(orderFulfilments));
  }, [orderFulfilments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_delivery_records`, JSON.stringify(deliveryRecords));
  }, [deliveryRecords]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_delivery_documents`, JSON.stringify(deliveryDocuments));
  }, [deliveryDocuments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_approval_history`, JSON.stringify(approvalHistory));
  }, [approvalHistory]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
  }, [notifications]);

  const createRFQ = (newRFQData: Omit<RFQ, 'id' | 'rfqNumber' | 'createdAt' | 'updatedAt' | 'quotesCount' | 'invitedCount'>): RFQ => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    
    // 1. Get all registered suppliers in the system
    const supplierPool = companies.filter((c) => c.companyType === 'supplier');
    const categoryQuery = (newRFQData.category || '').toLowerCase();
    const itemQuery = (newRFQData.items || []).map(i => (i.description || '').toLowerCase()).join(' ');

    // 2. Check if buyer targeted a specific supplier
    const targetSupplier = newRFQData.targetSupplierId 
      ? supplierPool.find(s => s.id === newRFQData.targetSupplierId || s.name.toLowerCase() === newRFQData.targetSupplierName?.toLowerCase())
      : null;

    // 3. Find ALL registered vendors whose categories match the RFQ category
    const matchingSuppliers = supplierPool.filter((supplier) => {
      if (targetSupplier && supplier.id === targetSupplier.id) return true;
      const supplierCats = (supplier.categories || []).map(c => c.toLowerCase());
      return supplierCats.some(c => 
        categoryQuery.includes(c) || 
        c.includes(categoryQuery) ||
        (itemQuery && (itemQuery.includes(c) || c.includes(itemQuery)))
      );
    });

    // 4. Combine target supplier + all matching vendors under this category
    const allRecipients = targetSupplier && !matchingSuppliers.some(s => s.id === targetSupplier.id)
      ? [targetSupplier, ...matchingSuppliers]
      : matchingSuppliers.length > 0
        ? matchingSuppliers
        : targetSupplier 
          ? [targetSupplier] 
          : [];

    const matchedSupplierCompanyIds = allRecipients.map(s => s.id);
    const matchedSupplierNames = allRecipients.map(s => s.name);
    const deadline24h = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const newRFQ: RFQ = {
      ...newRFQData,
      id: `rfq-${Date.now()}`,
      rfqNumber: `PS-RFQ-2026-${randomNum}`,
      targetSupplierId: targetSupplier?.id || newRFQData.targetSupplierId,
      targetSupplierName: targetSupplier?.name || newRFQData.targetSupplierName,
      status: 'submitted_to_ops',
      adminStatus: 'submitted_to_ops',
      publishedOffersCount: 0,
      invitedCount: allRecipients.length || 5,
      quotesCount: 0,
      matchedSupplierCompanyIds,
      matchedSupplierNames,
      deadline24h,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRfqs((prev) => [newRFQ, ...prev]);

    // Add Admin & Buyer Notifications for Managed Procurement Intake
    const adminNotif: PlatformNotification = {
      id: `notif-${Date.now()}-admin`,
      recipientRole: 'admin',
      title: `New Incoming RFQ: ${newRFQ.rfqNumber}`,
      message: `${newRFQ.buyerCompanyName} submitted "${newRFQ.title}" (${newRFQ.items.length} BOQ items) for managed sourcing.`,
      category: 'rfq',
      relatedEntityId: newRFQ.id,
      targetView: 'admin-dashboard',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    const buyerNotif: PlatformNotification = {
      id: `notif-${Date.now()}-buyer`,
      recipientRole: 'buyer',
      recipientCompanyId: newRFQ.buyerCompanyId,
      title: `RFQ ${newRFQ.rfqNumber} Received by ProcureSouq Desk`,
      message: `Our procurement engineers are reviewing your BOQ and sourcing up to 5 competitive supplier quotations.`,
      category: 'rfq',
      relatedEntityId: newRFQ.id,
      targetView: 'buyer-dashboard',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [adminNotif, buyerNotif, ...prev]);

    // Deliver ProcureSouq Managed Desk confirmation message to Buyer
    const sysMsg: Message = {
      id: `msg-${Date.now()}-managed`,
      rfqId: newRFQ.id,
      rfqNumber: newRFQ.rfqNumber,
      senderId: 'procuresouq-ops',
      senderName: 'ProcureSouq Managed Procurement Desk',
      senderCompanyId: 'procuresouq-ops',
      senderCompanyName: 'ProcureSouq Managed Procurement Desk',
      senderRole: 'admin',
      recipientCompanyId: newRFQ.buyerCompanyId,
      recipientCompanyName: newRFQ.buyerCompanyName,
      messageText: `[ProcureSouq Managed Desk] Your RFQ #${newRFQ.rfqNumber} ("${newRFQ.title}") has been received. Our procurement engineering team is validating specifications and sourcing competitive quotations from verified UAE stockists. You will be notified once up to 5 qualified offers are ready for comparison.`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setMessages((prev) => [...prev, sysMsg]);

    // Persist to Supabase in background
    supabaseService.createRFQ(newRFQ).catch(console.error);
    broadcastSync();

    return newRFQ;
  };

  const updateRFQStatus = (rfqId: string, status: RFQStatus) => {
    setRfqs((prev) =>
      prev.map((r) => (r.id === rfqId ? { ...r, status, updatedAt: new Date().toISOString() } : r))
    );

    // Persist to Supabase
    supabaseService.updateRFQStatus(rfqId, status).catch(console.error);
    broadcastSync();
  };

  const getRFQById = (rfqId: string) => {
    return rfqs.find((r) => r.id === rfqId || r.rfqNumber === rfqId);
  };

  const declineRFQ = (rfqId: string, supplierCompanyId: string, supplierCompanyName: string, reason: string, notes?: string) => {
    const targetRFQ = rfqs.find((r) => r.id === rfqId || r.rfqNumber === rfqId);
    const newRecord: DeclineRFQRecord = {
      id: `dec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      rfqId: targetRFQ?.id || rfqId,
      rfqNumber: targetRFQ?.rfqNumber || rfqId,
      supplierCompanyId,
      supplierCompanyName,
      reason,
      notes,
      declinedAt: new Date().toISOString(),
    };

    setDeclinedRFQs((prev) => {
      const filtered = prev.filter((d) => !(d.rfqId === newRecord.rfqId && d.supplierCompanyId === supplierCompanyId));
      const next = [newRecord, ...filtered];
      try {
        localStorage.setItem(`${STORAGE_KEY}_declined_rfqs`, JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    // Send a real-time notification message to the Buyer
    if (targetRFQ) {
      const declineMsg: Message = {
        id: `msg-${Date.now()}`,
        rfqId: targetRFQ.id,
        rfqNumber: targetRFQ.rfqNumber,
        senderId: supplierCompanyId,
        senderName: supplierCompanyName,
        senderCompanyId: supplierCompanyId,
        senderCompanyName: supplierCompanyName,
        senderRole: 'supplier',
        recipientCompanyId: targetRFQ.buyerCompanyId,
        recipientCompanyName: targetRFQ.buyerCompanyName,
        messageText: `[RFQ Declined] ${supplierCompanyName} passed on RFQ #${targetRFQ.rfqNumber}. Reason: ${reason}${notes ? ` - "${notes}"` : ''}`,
        createdAt: new Date().toISOString(),
        isRead: false,
      };

      setMessages((prev) => [declineMsg, ...prev]);
    }

    broadcastSync();
  };

  const cancelRFQByBuyer = (rfqId: string, reason: string, notes?: string) => {
    const targetRFQ = rfqs.find((r) => r.id === rfqId || r.rfqNumber === rfqId);
    if (!targetRFQ) return;

    setRfqs((prev) =>
      prev.map((r) =>
        r.id === targetRFQ.id
          ? { ...r, status: 'cancelled' as RFQStatus, updatedAt: new Date().toISOString() }
          : r
      )
    );

    // Notify all quoting or targeted suppliers
    const relatedQuotes = quotations.filter((q) => q.rfqId === targetRFQ.id || q.rfqNumber === targetRFQ.rfqNumber);
    const notifiedCompanyIds = new Set<string>();

    relatedQuotes.forEach((quote) => {
      if (!notifiedCompanyIds.has(quote.supplierCompanyId)) {
        notifiedCompanyIds.add(quote.supplierCompanyId);
        const cancelAlertMsg: Message = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          rfqId: targetRFQ.id,
          rfqNumber: targetRFQ.rfqNumber,
          senderId: targetRFQ.buyerCompanyId,
          senderName: targetRFQ.buyerCompanyName,
          senderCompanyId: targetRFQ.buyerCompanyId,
          senderCompanyName: targetRFQ.buyerCompanyName,
          senderRole: 'buyer',
          recipientCompanyId: quote.supplierCompanyId,
          recipientCompanyName: quote.supplierCompanyName,
          messageText: `[RFQ Cancelled by Contractor] RFQ #${targetRFQ.rfqNumber} ("${targetRFQ.title}") has been cancelled by the buyer. Reason: ${reason}${notes ? ` - "${notes}"` : ''}`,
          createdAt: new Date().toISOString(),
          isRead: false,
        };
        setMessages((prev) => [cancelAlertMsg, ...prev]);
      }
    });

    supabaseService.updateRFQStatus(targetRFQ.id, 'cancelled').catch(console.error);
    broadcastSync();
  };

  const deleteRFQ = (rfqId: string) => {
    setRfqs((prev) => prev.filter((r) => r.id !== rfqId && r.rfqNumber !== rfqId));
    setQuotations((prev) => prev.filter((q) => q.rfqId !== rfqId && q.rfqNumber !== rfqId));
    broadcastSync();
  };

  const getRFQQuoteCapacity = (rfqId: string) => {
    const targetRFQ = rfqs.find((r) => r.id === rfqId || r.rfqNumber === rfqId);
    const rfqQuotes = quotations.filter((q) => q.rfqId === (targetRFQ?.id || rfqId) || q.rfqNumber === (targetRFQ?.rfqNumber || rfqId));
    const currentCount = Math.max(rfqQuotes.length, targetRFQ?.quotesCount || 0);
    const maxAllowed = isRFQExtendedUnlocked(targetRFQ?.id || rfqId) ? 10 : 5;
    const spotsLeft = Math.max(0, maxAllowed - currentCount);
    const isCapped = currentCount >= maxAllowed;

    return {
      currentCount,
      maxAllowed,
      spotsLeft,
      isCapped,
    };
  };

  const hasSupplierQuoted = (rfqId: string, supplierCompanyId: string): boolean => {
    const targetRFQ = rfqs.find((r) => r.id === rfqId || r.rfqNumber === rfqId);
    return quotations.some(
      (q) =>
        (q.rfqId === (targetRFQ?.id || rfqId) || q.rfqNumber === (targetRFQ?.rfqNumber || rfqId)) &&
        q.supplierCompanyId === supplierCompanyId
    );
  };

  const canSupplierQuote = (
    rfqId: string,
    supplierCompanyId: string
  ): {
    canQuote: boolean;
    reason?: 'already_quoted' | 'capacity_full' | 'rfq_cancelled' | 'rfq_declined';
    spotsLeft: number;
    maxAllowed: number;
    currentCount: number;
  } => {
    const targetRFQ = rfqs.find((r) => r.id === rfqId || r.rfqNumber === rfqId);
    const capacity = getRFQQuoteCapacity(rfqId);

    if (!targetRFQ || targetRFQ.status === 'cancelled') {
      return { canQuote: false, reason: 'rfq_cancelled', ...capacity };
    }

    if (isRFQDeclinedBySupplier(targetRFQ.id, supplierCompanyId)) {
      return { canQuote: false, reason: 'rfq_declined', ...capacity };
    }

    if (hasSupplierQuoted(targetRFQ.id, supplierCompanyId)) {
      return { canQuote: false, reason: 'already_quoted', ...capacity };
    }

    if (capacity.isCapped) {
      return { canQuote: false, reason: 'capacity_full', ...capacity };
    }

    return { canQuote: true, ...capacity };
  };

  const submitQuotation = (quoteData: Omit<Quotation, 'id' | 'quotationNumber' | 'submittedAt' | 'status'>): Quotation => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const targetRFQ = rfqs.find((r) => r.id === quoteData.rfqId || r.rfqNumber === quoteData.rfqId);

    if (!targetRFQ) {
      throw new Error('RFQ not found');
    }

    if (targetRFQ.status === 'cancelled') {
      throw new Error('This RFQ has been cancelled by the buyer and is closed for quotations.');
    }

    // Enforce First 5 Suppliers Capacity Rule
    const capacity = getRFQQuoteCapacity(targetRFQ.id);
    const alreadyQuoted = hasSupplierQuoted(targetRFQ.id, quoteData.supplierCompanyId);

    if (capacity.isCapped && !alreadyQuoted) {
      throw new Error(`Quotation capacity full (${capacity.maxAllowed}/${capacity.maxAllowed} slots filled). Only the first ${capacity.maxAllowed} stockists can submit.`);
    }

    const currentQuoteCount = (targetRFQ.quotesCount || 0) + 1;
    const isNowCapped = currentQuoteCount >= capacity.maxAllowed;

    const newQuote: Quotation = {
      ...quoteData,
      id: `quote-${Date.now()}`,
      quotationNumber: `QT-${randomNum}`,
      buyerCompanyId: targetRFQ.buyerCompanyId || (quoteData as any).buyerCompanyId,
      buyerCompanyName: targetRFQ.buyerCompanyName || (quoteData as any).buyerCompanyName,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    };

    setQuotations((prev) => [newQuote, ...prev]);

    // Update quote count and status on RFQ, and move RFQ to the absolute top of the list!
    setRfqs((prev) => {
      const target = prev.find((r) => r.id === quoteData.rfqId || r.rfqNumber === quoteData.rfqId);
      if (!target) return prev;
      const updatedRFQ: RFQ = {
        ...target,
        quotesCount: currentQuoteCount,
        status: isNowCapped ? 'evaluating' : 'receiving_quotes',
        updatedAt: new Date().toISOString(),
      };
      return [updatedRFQ, ...prev.filter(r => r.id !== target.id)];
    });

    // Send direct notification message from Supplier to the specific Buyer
    const quoteMsg: Message = {
      id: `msg-${Date.now()}`,
      rfqId: targetRFQ.id,
      rfqNumber: targetRFQ.rfqNumber,
      senderId: quoteData.supplierCompanyId,
      senderName: quoteData.supplierCompanyName,
      senderCompanyId: quoteData.supplierCompanyId,
      senderCompanyName: quoteData.supplierCompanyName,
      senderRole: 'supplier',
      recipientCompanyId: targetRFQ.buyerCompanyId,
      recipientCompanyName: targetRFQ.buyerCompanyName,
      messageText: `[Slot #${currentQuoteCount}/${capacity.maxAllowed}] Commercial Quotation ${newQuote.quotationNumber} submitted for AED ${newQuote.grandTotalAED.toLocaleString()} (Lead Time: ${newQuote.leadTimeDisplay || newQuote.leadTimeDays + ' Days'}).`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setMessages((prev) => [...prev, quoteMsg]);
    supabaseService.sendMessage(quoteMsg).catch(console.error);
    supabaseService.updateRFQStatus(targetRFQ.id, isNowCapped ? 'evaluating' : 'receiving_quotes').catch(console.error);

    // Persist to Supabase
    supabaseService.submitQuotation(newQuote).catch(console.error);
    broadcastSync();

    return newQuote;
  };

  const getQuotesForRFQ = (rfqId: string) => {
    return quotations.filter((q) => q.rfqId === rfqId || q.rfqNumber === rfqId);
  };

  const getQuotationsForSupplier = (supplierCompanyId: string) => {
    return quotations.filter((q) => q.supplierCompanyId === supplierCompanyId);
  };

  const awardQuotation = (rfqId: string, quotationId: string): PurchaseOrder => {
    const targetRFQ = rfqs.find((r) => r.id === rfqId || r.rfqNumber === rfqId);
    const targetQuote = quotations.find((q) => q.id === quotationId || q.quotationNumber === quotationId);

    if (!targetRFQ || !targetQuote) {
      throw new Error('RFQ or Quotation not found');
    }

    const year = new Date().getFullYear();
    const poRandom = Math.floor(1000 + Math.random() * 9000);
    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber: `PO-${year}-${poRandom}`,
      rfqId: targetRFQ.id,
      rfqNumber: targetRFQ.rfqNumber,
      rfqTitle: targetRFQ.title,
      quotationId: targetQuote.id,
      quotationNumber: targetQuote.quotationNumber,
      buyerCompanyId: targetRFQ.buyerCompanyId,
      buyerCompanyName: targetRFQ.buyerCompanyName,
      buyerContactName: targetRFQ.buyerContactName,
      buyerPhone: targetRFQ.buyerPhone,
      supplierCompanyId: targetQuote.supplierCompanyId,
      supplierCompanyName: targetQuote.supplierCompanyName,
      supplierPhone: '+971 4 340 7788',
      items: targetQuote.items,
      subtotalAED: targetQuote.subtotalAED,
      vatAED: targetQuote.vatAED,
      deliveryChargeAED: targetQuote.deliveryChargeAED,
      totalAmountAED: targetQuote.grandTotalAED,
      status: 'po_created',
      deliveryAddress: targetRFQ.deliveryAddress,
      deliveryEmirate: targetRFQ.deliveryEmirate,
      paymentTerms: targetQuote.paymentTerms,
      expectedDeliveryDate: targetRFQ.requiredDeliveryDate,
      reviewedByBuyer: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update PO list
    setPurchaseOrders((prev) => [newPO, ...prev]);

    // Mark RFQ as awarded
    setRfqs((prev) =>
      prev.map((r) => (r.id === targetRFQ.id ? { ...r, status: 'awarded', awardedQuotationId: targetQuote.id } : r))
    );

    // Update Quotation statuses
    setQuotations((prev) =>
      prev.map((q) => {
        if (q.rfqId === targetRFQ.id) {
          return q.id === targetQuote.id ? { ...q, status: 'awarded' } : { ...q, status: 'declined' };
        }
        return q;
      })
    );

    // Persist to Supabase
    supabaseService.createPurchaseOrder(newPO).catch(console.error);
    supabaseService.updateRFQStatus(targetRFQ.id, 'awarded').catch(console.error);
    broadcastSync();

    return newPO;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, trackingNotes?: string) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => {
        if (po.id === orderId || po.poNumber === orderId) {
          return {
            ...po,
            status,
            trackingNotes: trackingNotes || po.trackingNotes,
          };
        }
        return po;
      })
    );

    // Persist to Supabase
    supabaseService.updateOrderStatus(orderId, status, trackingNotes).catch(console.error);
    broadcastSync();
  };

  const getOrderById = (orderId: string) => {
    return purchaseOrders.find((po) => po.id === orderId || po.poNumber === orderId);
  };

  const sendMessage = (msg: Omit<Message, 'id' | 'createdAt' | 'isRead'>): Message => {
    const newMsg: Message = {
      ...msg,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setMessages((prev) => [...prev, newMsg]);

    // Persist to Supabase
    supabaseService.sendMessage(newMsg).catch(console.error);
    broadcastSync();

    return newMsg;
  };

  const getMessagesForRFQ = (rfqId: string) => {
    return messages.filter((m) => m.rfqId === rfqId);
  };

  const submitReview = (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [newReview, ...prev]);

    // Update supplier average rating & review count
    setCompanies((prev) =>
      prev.map((comp) => {
        if (comp.id === reviewData.supplierCompanyId) {
          const newCount = comp.reviewCount + 1;
          const newRating = Number(((comp.rating * comp.reviewCount + reviewData.rating) / newCount).toFixed(1));
          return { ...comp, rating: newRating, reviewCount: newCount };
        }
        return comp;
      })
    );
  };

  const rateQuotation = (rfqId: string, quotationId: string, rating: number, feedback?: string) => {
    const cleanRating = Math.max(1, Math.min(5, Math.round(rating * 10) / 10));

    // 1. Locate the target quotation
    const targetQuote = quotations.find((q) => q.id === quotationId);
    if (!targetQuote) return;

    const oldRating = targetQuote.buyerRating;
    const isInitialRating = oldRating === undefined || oldRating === null;

    // 2. Update Supplier Company Overall Rating & Review Count
    let updatedSupplierOverallRating = targetQuote.supplierRating || 5.0;
    setCompanies((prev) =>
      prev.map((comp) => {
        if (comp.id === targetQuote.supplierCompanyId) {
          let newCount = comp.reviewCount || 0;
          let newRating = comp.rating || 5.0;

          if (isInitialRating) {
            newCount = newCount + 1;
            newRating = Number(((comp.rating * (comp.reviewCount || 0) + cleanRating) / newCount).toFixed(1));
          } else {
            const diff = cleanRating - oldRating;
            newRating = Number(((comp.rating * (comp.reviewCount || 1) + diff) / (comp.reviewCount || 1)).toFixed(1));
          }

          newRating = Math.max(1.0, Math.min(5.0, newRating));
          updatedSupplierOverallRating = newRating;

          let newBadge = comp.badge;
          if (newRating >= 4.8 && newCount >= 2) {
            newBadge = 'Top Rated';
          }

          // Persist to Supabase
          supabaseService.updateCompanyRating(comp.id, newRating, newCount).catch(console.error);

          return {
            ...comp,
            rating: newRating,
            reviewCount: newCount,
            badge: newBadge,
          };
        }
        return comp;
      })
    );

    // 3. Update Quotations state (both the rated quote and all supplier quotes' display rating)
    setQuotations((prev) =>
      prev.map((q) => {
        if (q.supplierCompanyId === targetQuote.supplierCompanyId) {
          const isThisQuote = q.id === quotationId;
          return {
            ...q,
            supplierRating: updatedSupplierOverallRating,
            ...(isThisQuote
              ? {
                  buyerRating: cleanRating,
                  buyerRatingFeedback: feedback !== undefined ? feedback : q.buyerRatingFeedback,
                  buyerRatedAt: new Date().toISOString(),
                }
              : {}),
          };
        }
        return q;
      })
    );

    // 4. Send Notification Message to the Supplier
    const targetRFQ = rfqs.find((r) => r.id === rfqId || r.rfqNumber === rfqId);
    const rfqNum = targetRFQ?.rfqNumber || targetQuote.rfqNumber || 'RFQ';
    const alertMsg: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      rfqId: targetQuote.rfqId,
      rfqNumber: rfqNum,
      senderId: targetRFQ?.buyerCompanyId || 'buyer',
      senderName: targetRFQ?.buyerCompanyName || 'Verified Contractor',
      senderCompanyId: targetRFQ?.buyerCompanyId || 'buyer',
      senderCompanyName: targetRFQ?.buyerCompanyName || 'Verified Contractor',
      senderRole: 'buyer',
      recipientCompanyId: targetQuote.supplierCompanyId,
      recipientCompanyName: targetQuote.supplierCompanyName,
      messageText: `[⭐ Quotation Rating Received] A buyer rated your quotation on RFQ #${rfqNum} with ${cleanRating} / 5 Stars${
        feedback ? ` ("${feedback}")` : ''
      }! Your updated supplier rating is now ${updatedSupplierOverallRating} ★. Maintain high ratings to stay at the top of the supplier list!`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setMessages((prev) => [alertMsg, ...prev]);

    // 5. Persist to Supabase and storage
    supabaseService.updateQuotationRating(quotationId, cleanRating, feedback).catch(console.error);
    supabaseService.sendMessage(alertMsg).catch(console.error);
    broadcastSync();
  };

  const updateVerificationStatus = (companyId: string, status: VerificationStatus, notes?: string) => {
    setCompanies((prev) =>
      prev.map((comp) => (comp.id === companyId ? { ...comp, verificationStatus: status, verificationNotes: notes } : comp))
    );
    setVerifications((prev) =>
      prev.map((v) => (v.companyId === companyId ? { ...v, status, notes } : v))
    );

    // Persist to Supabase
    supabaseService.updateVerificationStatus(companyId, status, notes).catch(console.error);
  };

  // --- PROCURESOUQ V2 MANAGED PROCUREMENT METHODS ---

  const recordApprovalAction = (
    entityType: ApprovalHistoryRecord['entityType'],
    entityId: string,
    action: string,
    approvedBy: string,
    role: 'admin' | 'buyer' | 'supplier',
    previousState?: string,
    newState?: string,
    notes?: string
  ) => {
    const rec: ApprovalHistoryRecord = {
      id: `appr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      entityType,
      entityId,
      action,
      approvedBy,
      role,
      previousState,
      newState,
      notes,
      createdAt: new Date().toISOString(),
    };
    setApprovalHistory((prev) => [rec, ...prev]);
    supabaseService.insertApprovalHistory(rec).catch(console.error);
  };

  const updateCommercialSettings = (updates: Partial<CommercialSettings>, approvedBy = 'Admin Commercial Desk') => {
    setCommercialSettings((prev) => {
      const next: CommercialSettings = {
        ...prev,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      supabaseService.upsertCommercialSettings(next).catch(console.error);
      recordApprovalAction(
        'commercial_settings',
        next.id,
        'COMMERCIAL_SETTINGS_UPDATED',
        approvedBy,
        'admin',
        prev.operatingModel,
        next.operatingModel,
        `Contracting Entity: ${next.contractingEntityName} | Binding PO Approved: ${next.isCommercialConfigApproved}`
      );
      return next;
    });
    broadcastSync();
  };

  const updateRFQAdminWorkflow = (rfqId: string, updates: Partial<RFQ>, actorName = 'ProcureSouq Admin Desk') => {
    setRfqs((prev) =>
      prev.map((r) => {
        if (r.id === rfqId || r.rfqNumber === rfqId) {
          const updated: RFQ = {
            ...r,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
          supabaseService.upsertRFQAdminDetails(updated).catch(console.error);
          recordApprovalAction(
            'rfq',
            r.id,
            'RFQ_ADMIN_WORKFLOW_UPDATED',
            actorName,
            'admin',
            r.adminStatus || r.status,
            updated.adminStatus || updated.status,
            updates.clarificationRequest || updates.internalOpsNotes || `Assigned to ${updated.assignedStaffName || 'Ops'}`
          );
          return updated;
        }
        return r;
      })
    );
    broadcastSync();
  };

  const inviteSuppliersToRFQ = (
    rfqId: string,
    supplierIds: string[],
    channel: 'portal' | 'email' | 'whatsapp_future' | 'manual_admin',
    deadline?: string,
    invitedBy = 'Eng. Khalid Al-blooshi (ProcureSouq Ops)'
  ): SupplierRFQInvitation[] => {
    const targetRFQ = rfqs.find((r) => r.id === rfqId || r.rfqNumber === rfqId);
    if (!targetRFQ) return [];

    const createdInvitations: SupplierRFQInvitation[] = [];
    const now = new Date().toISOString();

    supplierIds.forEach((supId) => {
      const supComp = companies.find((c) => c.id === supId);
      if (!supComp) return;
      const existing = supplierInvitations.find(
        (inv) => inv.rfqId === targetRFQ.id && inv.supplierCompanyId === supId
      );
      const inv: SupplierRFQInvitation = existing
        ? {
            ...existing,
            invitationChannel: channel,
            quotationDeadline: deadline || existing.quotationDeadline,
            invitedBy,
          }
        : {
            id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            rfqId: targetRFQ.id,
            rfqNumber: targetRFQ.rfqNumber,
            supplierCompanyId: supComp.id,
            supplierCompanyName: supComp.name,
            supplierEmail: supComp.email,
            invitationChannel: channel,
            status: 'invited',
            quotationDeadline: deadline || targetRFQ.supplierQuoteDeadline || targetRFQ.closingDate,
            invitedBy,
            createdAt: now,
          };
      createdInvitations.push(inv);
      supabaseService.upsertSupplierInvitation(inv).catch(console.error);

      // Notify supplier
      const supNotif: PlatformNotification = {
        id: `notif-${Date.now()}-${supComp.id}`,
        recipientRole: 'supplier',
        recipientCompanyId: supComp.id,
        title: `New ProcureSouq RFQ Assigned: ${targetRFQ.rfqNumber}`,
        message: `ProcureSouq Sourcing Desk invited your team to quote on "${targetRFQ.title}" (${targetRFQ.items.length} BOQ items).`,
        category: 'rfq',
        relatedEntityId: targetRFQ.id,
        targetView: 'supplier-inbox',
        isRead: false,
        createdAt: now,
      };
      setNotifications((prev) => [supNotif, ...prev]);
    });

    setSupplierInvitations((prev) => {
      const map = new Map<string, SupplierRFQInvitation>();
      prev.forEach((i) => map.set(`${i.rfqId}_${i.supplierCompanyId}`, i));
      createdInvitations.forEach((i) => map.set(`${i.rfqId}_${i.supplierCompanyId}`, i));
      return Array.from(map.values());
    });

    // Update RFQ matchedSupplierCompanyIds & invitedCount
    setRfqs((prev) =>
      prev.map((r) => {
        if (r.id === targetRFQ.id) {
          const mergedSupIds = Array.from(new Set([...(r.matchedSupplierCompanyIds || []), ...supplierIds]));
          const updated: RFQ = {
            ...r,
            status: r.status === 'submitted_to_ops' ? 'sourcing_suppliers' : r.status,
            adminStatus: 'sourcing_suppliers',
            invitedCount: mergedSupIds.length,
            matchedSupplierCompanyIds: mergedSupIds,
            supplierQuoteDeadline: deadline || r.supplierQuoteDeadline,
            updatedAt: now,
          };
          supabaseService.upsertRFQAdminDetails(updated).catch(console.error);
          return updated;
        }
        return r;
      })
    );

    broadcastSync();
    return createdInvitations;
  };

  const uploadManualSupplierQuote = (
    quoteData: Omit<Quotation, 'id' | 'quotationNumber' | 'submittedAt' | 'status'>
  ): Quotation => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const targetRFQ = rfqs.find((r) => r.id === quoteData.rfqId || r.rfqNumber === quoteData.rfqId);
    if (!targetRFQ) throw new Error('Target RFQ not found');

    const quotedCount = quoteData.items.filter((i) => i.isQuoted !== false && i.unitPriceAED > 0).length;
    const totalCount = targetRFQ.items.length || quoteData.items.length;

    const newQuote: Quotation = {
      ...quoteData,
      id: `quote-manual-${Date.now()}`,
      quotationNumber: `PS-SQ-2026-${randomNum}`,
      quoteReference: quoteData.quoteReference || `MANUAL-REF-${randomNum}`,
      buyerCompanyId: targetRFQ.buyerCompanyId,
      buyerCompanyName: targetRFQ.buyerCompanyName,
      isPartialQuote: quotedCount < totalCount,
      quotedItemsCount: quotedCount,
      totalRfqItemsCount: totalCount,
      manualUploadByAdmin: true,
      adminReviewStatus: 'under_review',
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    };

    setQuotations((prev) => [newQuote, ...prev]);

    // Update RFQ quotesCount
    setRfqs((prev) =>
      prev.map((r) => {
        if (r.id === targetRFQ.id) {
          const nextCount = quotations.filter((q) => q.rfqId === targetRFQ.id).length + 1;
          const updated: RFQ = {
            ...r,
            quotesCount: nextCount,
            status: 'receiving_quotes',
            adminStatus: 'receiving_quotes',
            updatedAt: new Date().toISOString(),
          };
          supabaseService.upsertRFQAdminDetails(updated).catch(console.error);
          return updated;
        }
        return r;
      })
    );

    supabaseService.submitQuotation(newQuote).catch(console.error);
    broadcastSync();
    return newQuote;
  };

  const evaluateSupplierQuote = (evalData: Omit<QuotationEvaluation, 'id' | 'evaluatedAt'>): QuotationEvaluation => {
    const existing = quotationEvaluations.find((e) => e.quotationId === evalData.quotationId);
    const evaluation: QuotationEvaluation = {
      ...evalData,
      id: existing?.id || `eval-${Date.now()}`,
      evaluatedAt: new Date().toISOString(),
    };

    setQuotationEvaluations((prev) => [
      evaluation,
      ...prev.filter((e) => e.quotationId !== evalData.quotationId),
    ]);

    setQuotations((prev) =>
      prev.map((q) => {
        if (q.id === evalData.quotationId) {
          const updated: Quotation = {
            ...q,
            technicalComplianceStatus: evalData.technicalCompliance,
            deviationNotes: evalData.deviationNotes,
            adminReviewStatus: evalData.approvedForComparison ? 'approved_for_comparison' : 'rejected',
            status: evalData.approvedForComparison ? 'approved_for_comparison' : 'rejected_by_admin',
          };
          supabaseService.submitQuotation(updated).catch(console.error);
          return updated;
        }
        return q;
      })
    );

    supabaseService.upsertQuotationEvaluation(evaluation).catch(console.error);
    recordApprovalAction(
      'supplier_quote',
      evalData.quotationId,
      evalData.approvedForComparison ? 'SUPPLIER_QUOTE_APPROVED_FOR_COMPARISON' : 'SUPPLIER_QUOTE_FLAGGED_OR_REJECTED',
      evalData.evaluatorName,
      'admin',
      'pending',
      evalData.technicalCompliance,
      evalData.deviationNotes
    );
    broadcastSync();
    return evaluation;
  };

  const calculateAndSaveInternalCost = (params: {
    rfqId: string;
    quotationId: string;
    freightDeliveryCostAED: number;
    otherProcurementCostAED: number;
    otherCostDescription?: string;
    markupType: 'percentage' | 'fixed_fee' | 'hybrid';
    markupPercent: number;
    fixedFeeAED: number;
    createdBy?: string;
  }): InternalCostBreakdown => {
    const quote = quotations.find((q) => q.id === params.quotationId);
    const supplierCostExVatAED = quote ? quote.subtotalAED - (quote.discountAED || 0) : 0;
    const vatRate = commercialSettings.vatRatePercent || 5.0;

    let calculatedMarginAED = 0;
    if (params.markupType === 'percentage') {
      calculatedMarginAED = Math.round(supplierCostExVatAED * (params.markupPercent / 100) * 100) / 100;
    } else if (params.markupType === 'fixed_fee') {
      calculatedMarginAED = params.fixedFeeAED;
    } else {
      calculatedMarginAED =
        Math.round(supplierCostExVatAED * (params.markupPercent / 100) * 100) / 100 + params.fixedFeeAED;
    }

    const customerSellingPriceBeforeVatAED =
      Math.round(
        (supplierCostExVatAED +
          params.freightDeliveryCostAED +
          params.otherProcurementCostAED +
          calculatedMarginAED) *
          100
      ) / 100;
    const customerVatAED = Math.round(customerSellingPriceBeforeVatAED * (vatRate / 100) * 100) / 100;
    const customerLandedTotalAED = Math.round((customerSellingPriceBeforeVatAED + customerVatAED) * 100) / 100;
    const grossProfitAED = calculatedMarginAED;
    const grossMarginPercent =
      customerSellingPriceBeforeVatAED > 0
        ? Math.round((grossProfitAED / customerSellingPriceBeforeVatAED) * 10000) / 100
        : 0;

    const existing = internalCosts.find((c) => c.quotationId === params.quotationId);
    const now = new Date().toISOString();

    const record: InternalCostBreakdown = {
      id: existing?.id || `cost-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      rfqId: params.rfqId,
      quotationId: params.quotationId,
      customerOfferId: existing?.customerOfferId,
      supplierCostExVatAED,
      freightDeliveryCostAED: params.freightDeliveryCostAED,
      otherProcurementCostAED: params.otherProcurementCostAED,
      otherCostDescription: params.otherCostDescription,
      markupType: params.markupType,
      markupPercent: params.markupPercent,
      fixedFeeAED: params.fixedFeeAED,
      calculatedMarginAED,
      customerSellingPriceBeforeVatAED,
      vatRatePercent: vatRate,
      customerVatAED,
      customerLandedTotalAED,
      grossProfitAED,
      grossMarginPercent,
      createdBy: params.createdBy || 'Eng. Khalid Al-blooshi',
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };

    setInternalCosts((prev) => [record, ...prev.filter((c) => c.quotationId !== params.quotationId)]);
    supabaseService.upsertInternalCost(record).catch(console.error);
    broadcastSync();
    return record;
  };

  const publishCustomerOffersForRFQ = (
    rfqId: string,
    selectedQuoteIds: string[],
    actorName = 'Eng. Khalid Al-blooshi (ProcureSouq Ops)'
  ): CustomerOffer[] => {
    const targetRFQ = rfqs.find((r) => r.id === rfqId || r.rfqNumber === rfqId);
    if (!targetRFQ) return [];

    // Cap at maximum 5 offers; never invent missing offers
    const cappedQuoteIds = selectedQuoteIds.slice(0, 5);
    const validQuotes = cappedQuoteIds
      .map((id) => quotations.find((q) => q.id === id))
      .filter((q): q is Quotation => Boolean(q));

    if (validQuotes.length === 0) return [];

    const now = new Date().toISOString();
    const defaultMarkupPct = commercialSettings.defaultMarkupPercent || 5.0;
    const vatRate = commercialSettings.vatRatePercent || 5.0;

    // Build draft offers
    const builtOffers: CustomerOffer[] = validQuotes.map((q, idx) => {
      const slot = idx + 1;
      const existingEval = quotationEvaluations.find((e) => e.quotationId === q.id);
      const existingCost = internalCosts.find((c) => c.quotationId === q.id);

      const markupMultiplier =
        existingCost && existingCost.supplierCostExVatAED > 0
          ? (existingCost.supplierCostExVatAED + existingCost.calculatedMarginAED) /
            existingCost.supplierCostExVatAED
          : 1 + defaultMarkupPct / 100;

      const offerId = `offer-${targetRFQ.id}-${slot}`;
      const offerItems = q.items.map((item, itemIdx) => {
        const isIncluded = item.isQuoted !== false && item.unitPriceAED > 0;
        const customerUnit = isIncluded ? Math.round(item.unitPriceAED * markupMultiplier * 100) / 100 : 0;
        return {
          id: `${offerId}-item-${itemIdx + 1}`,
          customerOfferId: offerId,
          rfqItemId: item.rfqItemId,
          itemNumber: itemIdx + 1,
          description: item.itemDescription,
          offeredBrand: item.offeredBrand,
          specificationCompliance: (!isIncluded
            ? 'Not Quoted'
            : item.isAlternative
            ? 'Alternative'
            : 'Compliant') as any,
          isIncluded,
          isAlternative: item.isAlternative,
          quantity: item.quantity,
          unit: item.unit,
          customerUnitPriceAED: customerUnit,
          customerLineTotalAED: isIncluded ? Math.round(customerUnit * item.quantity * 100) / 100 : 0,
          availability: isIncluded ? q.stockAvailability || 'In Stock (UAE)' : 'Not Quoted',
          leadTimeDays: isIncluded ? q.leadTimeDays : 0,
          deviationNote: item.isAlternative ? item.remarks : undefined,
        };
      });

      const sellingSubtotalAED =
        existingCost
          ? existingCost.supplierCostExVatAED + existingCost.calculatedMarginAED
          : Math.round(offerItems.reduce((sum, i) => sum + i.customerLineTotalAED, 0) * 100) / 100;
      const deliveryFeeAED =
        existingCost
          ? existingCost.freightDeliveryCostAED + existingCost.otherProcurementCostAED
          : q.deliveryChargeAED || 0;
      const vatAED = Math.round((sellingSubtotalAED + deliveryFeeAED) * (vatRate / 100) * 100) / 100;
      const estimatedLandedTotalAED = Math.round((sellingSubtotalAED + deliveryFeeAED + vatAED) * 100) / 100;

      const quotedItemsCount = offerItems.filter((i) => i.isIncluded).length;
      const totalRfqItemsCount = targetRFQ.items.length || offerItems.length;
      const isPartialOffer = Boolean(q.isPartialQuote || quotedItemsCount < totalRfqItemsCount);
      const hasDeviation = Boolean(
        isPartialOffer ||
          existingEval?.hasDeviation ||
          q.technicalComplianceStatus === 'minor_deviation' ||
          offerItems.some((i) => i.isAlternative)
      );

      const uniqueBrands = Array.from(
        new Set(offerItems.filter((i) => i.isIncluded && i.offeredBrand).map((i) => i.offeredBrand))
      ).join(' / ');

      const techLabel = isPartialOffer
        ? 'Partial Coverage'
        : existingEval?.technicalCompliance === 'minor_deviation' || offerItems.some((i) => i.isAlternative)
        ? 'Approved Equivalent'
        : '100% Compliant to BOQ';

      return {
        id: offerId,
        offerNumber: `PS-OFFER-2026-${Math.floor(100 + Math.random() * 899)}`,
        offerSlot: slot,
        rfqId: targetRFQ.id,
        rfqNumber: targetRFQ.rfqNumber,
        buyerCompanyId: targetRFQ.buyerCompanyId,
        sourceQuotationId: q.id,
        offerLabel: `Offer ${slot}`,
        brandOffered: uniqueBrands || 'Approved UAE Specification',
        technicalCompliance: techLabel as any,
        hasDeviation,
        deviationWarning: existingEval?.deviationNotes || q.deviationNotes,
        isPartialOffer,
        quotedItemsCount,
        totalRfqItemsCount,
        items: offerItems,
        sellingSubtotalAED,
        deliveryFeeAED,
        vatAED,
        estimatedLandedTotalAED,
        leadTimeDays: q.leadTimeDays,
        leadTimeDisplay: q.leadTimeDisplay || `${q.leadTimeDays} Business Days`,
        availabilityStatus: q.stockAvailability || 'In Stock (UAE)',
        warrantyTerms: q.warrantyPeriod || '1 Year Manufacturer Warranty',
        paymentTerms: q.paymentTerms || '30 Days Credit',
        validityDate: q.validityDate,
        ruleRecommendations: [],
        disclosedSupplierName: commercialSettings.discloseSupplierIdentityToBuyer
          ? q.supplierCompanyName
          : undefined,
        status: 'published',
        publishedAt: now,
      };
    });

    // Transparent Rule-Based Recommendations (computed only across full-coverage offers if available)
    const fullCoverageOffers = builtOffers.filter((o) => !o.isPartialOffer);
    const pool = fullCoverageOffers.length > 0 ? fullCoverageOffers : builtOffers;

    const minPrice = Math.min(...pool.map((o) => o.estimatedLandedTotalAED));
    const minLead = Math.min(...pool.map((o) => o.leadTimeDays));

    builtOffers.forEach((offer) => {
      const recs: CustomerOffer['ruleRecommendations'] = [];
      if (!offer.isPartialOffer && offer.estimatedLandedTotalAED === minPrice) {
        recs.push('Lowest Price');
      }
      if (!offer.isPartialOffer && offer.leadTimeDays === minLead) {
        recs.push('Fastest Delivery');
      }
      if (!offer.isPartialOffer && !offer.hasDeviation && offer.technicalCompliance === '100% Compliant to BOQ') {
        recs.push('Best Technical Match');
      }
      if (recs.length >= 2) {
        recs.unshift('Best Overall Value');
      }
      offer.ruleRecommendations = recs;
      supabaseService.upsertCustomerOffer(offer).catch(console.error);
    });

    // Save Customer Offers for this RFQ
    setCustomerOffers((prev) => [
      ...builtOffers,
      ...prev.filter((o) => o.rfqId !== targetRFQ.id),
    ]);

    // Update RFQ status to 'offers_published'
    setRfqs((prev) =>
      prev.map((r) => {
        if (r.id === targetRFQ.id) {
          const updated: RFQ = {
            ...r,
            status: 'offers_published',
            adminStatus: 'offers_published',
            publishedOffersCount: builtOffers.length,
            updatedAt: now,
          };
          supabaseService.upsertRFQAdminDetails(updated).catch(console.error);
          return updated;
        }
        return r;
      })
    );

    // Notify Buyer
    const buyerNotif: PlatformNotification = {
      id: `notif-${Date.now()}-offers`,
      recipientRole: 'buyer',
      recipientCompanyId: targetRFQ.buyerCompanyId,
      title: `${builtOffers.length} Qualified Offers Ready — ${targetRFQ.rfqNumber}`,
      message: `ProcureSouq has completed technical evaluation and published ${builtOffers.length} customer offer(s) for comparison.`,
      category: 'offer',
      relatedEntityId: targetRFQ.id,
      targetView: 'buyer-compare',
      isRead: false,
      createdAt: now,
    };
    setNotifications((prev) => [buyerNotif, ...prev]);

    recordApprovalAction(
      'customer_offer',
      targetRFQ.id,
      'CUSTOMER_OFFERS_PUBLISHED',
      actorName,
      'admin',
      targetRFQ.adminStatus,
      'offers_published',
      `Published ${builtOffers.length} verified ProcureSouq customer offer(s) for ${targetRFQ.rfqNumber}.`
    );

    broadcastSync();
    return builtOffers;
  };

  const getCustomerOffersForRFQ = (rfqId: string): CustomerOffer[] => {
    const targetRFQ = rfqs.find((r) => r.id === rfqId || r.rfqNumber === rfqId);
    const idToMatch = targetRFQ?.id || rfqId;
    const numToMatch = targetRFQ?.rfqNumber || rfqId;
    return customerOffers
      .filter((o) => o.rfqId === idToMatch || o.rfqNumber === numToMatch)
      .sort((a, b) => a.offerSlot - b.offerSlot);
  };

  const selectOfferAndCreateCustomerPO = (params: {
    rfqId: string;
    customerOfferId: string;
    orderingMethod: 'uploaded_po' | 'platform_generated_po';
    customerPoReference?: string;
    uploadedPoFileName?: string;
    uploadedPoUrl?: string;
    notes?: string;
  }): CustomerPurchaseOrder => {
    const targetRFQ = rfqs.find((r) => r.id === params.rfqId || r.rfqNumber === params.rfqId);
    const selectedOffer = customerOffers.find((o) => o.id === params.customerOfferId);
    if (!targetRFQ || !selectedOffer) {
      throw new Error('Target RFQ or Customer Offer not found');
    }

    const seq = String(customerPOs.length + 1).padStart(4, '0');
    const cpoNumber = `PS-CPO-2026-${seq}`;
    const now = new Date().toISOString();

    const isLegallyBinding = Boolean(
      commercialSettings.isCommercialConfigApproved &&
        (params.orderingMethod === 'uploaded_po' || commercialSettings.allowBindingPoGeneration)
    );
    const commercialApprovalStatus = commercialSettings.requireAdminPoApproval
      ? 'pending_admin_approval'
      : 'approved';

    const newCPO: CustomerPurchaseOrder = {
      id: `cpo-${Date.now()}`,
      cpoNumber,
      rfqId: targetRFQ.id,
      rfqNumber: targetRFQ.rfqNumber,
      rfqTitle: targetRFQ.title,
      customerOfferId: selectedOffer.id,
      offerNumber: `${selectedOffer.offerNumber} (${selectedOffer.offerLabel})`,
      buyerCompanyId: targetRFQ.buyerCompanyId,
      buyerCompanyName: targetRFQ.buyerCompanyName,
      buyerContactName: targetRFQ.buyerContactName,
      buyerPhone: targetRFQ.buyerPhone,
      contractingEntityName: commercialSettings.contractingEntityName,
      orderingMethod: params.orderingMethod,
      customerPoReference: params.customerPoReference || cpoNumber,
      uploadedPoUrl: params.uploadedPoUrl,
      uploadedPoFileName: params.uploadedPoFileName,
      items: selectedOffer.items,
      sellingSubtotalAED: selectedOffer.sellingSubtotalAED,
      deliveryFeeAED: selectedOffer.deliveryFeeAED,
      vatAED: selectedOffer.vatAED,
      totalPayableAED: selectedOffer.estimatedLandedTotalAED,
      paymentTerms: selectedOffer.paymentTerms,
      deliveryAddress: targetRFQ.deliveryAddress,
      deliveryEmirate: targetRFQ.deliveryEmirate,
      estimatedDeliveryDate: targetRFQ.requiredDeliveryDate,
      termsAccepted: true,
      termsAcceptedAt: now,
      commercialApprovalStatus,
      isLegallyBinding,
      orderStatus: commercialApprovalStatus === 'approved' ? 'confirmed' : 'awaiting_admin_approval',
      notes: params.notes,
      createdAt: now,
      updatedAt: now,
    };

    setCustomerPOs((prev) => [newCPO, ...prev]);
    supabaseService.upsertCustomerPO(newCPO).catch(console.error);

    // Mark selected offer
    setCustomerOffers((prev) =>
      prev.map((o) => {
        if (o.rfqId === targetRFQ.id) {
          const updated: CustomerOffer = {
            ...o,
            status: o.id === selectedOffer.id ? 'selected' : o.status,
          };
          supabaseService.upsertCustomerOffer(updated).catch(console.error);
          return updated;
        }
        return o;
      })
    );

    // Update RFQ status
    setRfqs((prev) =>
      prev.map((r) => {
        if (r.id === targetRFQ.id) {
          const updated: RFQ = {
            ...r,
            status: 'customer_po_issued',
            adminStatus: 'customer_po_submitted',
            awardedQuotationId: selectedOffer.sourceQuotationId,
            updatedAt: now,
          };
          supabaseService.upsertRFQAdminDetails(updated).catch(console.error);
          return updated;
        }
        return r;
      })
    );

    // Create initial OrderFulfilment at stage 1 (order_confirmed)
    const initialFulfilment: OrderFulfilment = {
      id: `ful-${Date.now()}`,
      cpoId: newCPO.id,
      cpoNumber: newCPO.cpoNumber,
      rfqId: targetRFQ.id,
      buyerCompanyId: targetRFQ.buyerCompanyId,
      fulfilmentMode: 'procuresouq_arranged',
      currentStage: 'order_confirmed',
      stageTimestamps: {
        order_confirmed: now,
      },
      deliveryAddress: targetRFQ.deliveryAddress,
      isPartialDelivery: selectedOffer.isPartialOffer,
      deliveredItemsSummary: `${selectedOffer.quotedItemsCount} of ${selectedOffer.totalRfqItemsCount} BOQ items scheduled`,
      hasDeliveryIssue: false,
      customerAcknowledged: false,
      createdAt: now,
      updatedAt: now,
    };
    setOrderFulfilments((prev) => [initialFulfilment, ...prev]);
    supabaseService.upsertFulfilment(initialFulfilment).catch(console.error);

    // Save PO document record if uploaded
    if (params.uploadedPoFileName) {
      const poDoc: DeliveryDocument = {
        id: `ddoc-${Date.now()}`,
        cpoId: newCPO.id,
        documentType: 'customer_po',
        documentNumber: newCPO.cpoNumber,
        fileName: params.uploadedPoFileName,
        fileUrl: params.uploadedPoUrl || `#${params.uploadedPoFileName}`,
        uploadedByRole: 'buyer',
        uploadedByName: targetRFQ.buyerContactName,
        visibleToBuyer: true,
        createdAt: now,
      };
      setDeliveryDocuments((prev) => [poDoc, ...prev]);
      supabaseService.upsertDeliveryDocument(poDoc).catch(console.error);
    }

    // Notify Admin & Buyer
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}-cpo-admin`,
        recipientRole: 'admin',
        title: `New Customer PO Submitted: ${newCPO.cpoNumber}`,
        message: `${newCPO.buyerCompanyName} selected ${selectedOffer.offerLabel} (AED ${newCPO.totalPayableAED.toLocaleString()}) for ${targetRFQ.rfqNumber}. Ready for Supplier PO generation.`,
        category: 'order',
        relatedEntityId: newCPO.id,
        targetView: 'admin-dashboard',
        isRead: false,
        createdAt: now,
      },
      {
        id: `notif-${Date.now()}-cpo-buyer`,
        recipientRole: 'buyer',
        recipientCompanyId: newCPO.buyerCompanyId,
        title: `Order Placed — ${newCPO.cpoNumber}`,
        message: `Your order for ${selectedOffer.offerLabel} (AED ${newCPO.totalPayableAED.toLocaleString()} incl. VAT) has been registered with ProcureSouq.`,
        category: 'order',
        relatedEntityId: newCPO.id,
        targetView: 'buyer-orders',
        isRead: false,
        createdAt: now,
      },
      ...prev,
    ]);

    recordApprovalAction(
      'customer_po',
      newCPO.id,
      'CUSTOMER_ISSUED_PO',
      targetRFQ.buyerContactName,
      'buyer',
      'offers_published',
      newCPO.orderStatus,
      `Customer selected ${selectedOffer.offerLabel} via ${params.orderingMethod}. Ref: ${newCPO.cpoNumber}`
    );

    broadcastSync();
    return newCPO;
  };

  const approveCustomerPOAndCreateSupplierPO = (params: {
    cpoId: string;
    fulfilmentMode: FulfilmentMode;
    expectedDispatchDate: string;
    internalNotes?: string;
    approvedBy?: string;
  }): SupplierPurchaseOrder => {
    const targetCPO = customerPOs.find((c) => c.id === params.cpoId || c.cpoNumber === params.cpoId);
    if (!targetCPO) throw new Error('Customer PO not found');

    const selectedOffer = customerOffers.find((o) => o.id === targetCPO.customerOfferId);
    const sourceQuote = quotations.find((q) => q.id === selectedOffer?.sourceQuotationId);
    if (!sourceQuote) throw new Error('Source Supplier Quotation not found for this Customer Offer');

    const seq = String(supplierPOs.length + 1).padStart(4, '0');
    const spoNumber = `PS-SPO-2026-${seq}`;
    const now = new Date().toISOString();

    const supplierSubtotalAED = sourceQuote.subtotalAED - (sourceQuote.discountAED || 0);
    const freightCostAED = sourceQuote.deliveryChargeAED || 0;
    const vatAED = sourceQuote.vatAED || Math.round((supplierSubtotalAED + freightCostAED) * 0.05 * 100) / 100;
    const supplierTotalAED = Math.round((supplierSubtotalAED + freightCostAED + vatAED) * 100) / 100;

    const newSPO: SupplierPurchaseOrder = {
      id: `spo-${Date.now()}`,
      spoNumber,
      cpoId: targetCPO.id,
      cpoNumber: targetCPO.cpoNumber,
      rfqId: targetCPO.rfqId,
      rfqNumber: targetCPO.rfqNumber,
      sourceQuotationId: sourceQuote.id,
      supplierCompanyId: sourceQuote.supplierCompanyId,
      supplierCompanyName: sourceQuote.supplierCompanyName,
      supplierPhone: '+971 4 320 4455',
      items: sourceQuote.items,
      supplierSubtotalAED,
      freightCostAED,
      vatAED,
      supplierTotalAED,
      paymentTerms: sourceQuote.paymentTerms,
      fulfilmentMode: params.fulfilmentMode,
      deliveryDestination: `${targetCPO.deliveryAddress} (Coordinated by ProcureSouq Desk)`,
      expectedDispatchDate: params.expectedDispatchDate,
      supplierConfirmationStatus: 'pending_confirmation',
      status: 'issued_to_supplier',
      internalNotes:
        params.internalNotes ||
        `Linked to Customer PO ${targetCPO.cpoNumber}. Customer Selling Total: AED ${targetCPO.totalPayableAED.toLocaleString()} | Supplier Cost Total: AED ${supplierTotalAED.toLocaleString()}.`,
      createdAt: now,
      updatedAt: now,
    };

    setSupplierPOs((prev) => [newSPO, ...prev]);
    supabaseService.upsertSupplierPO(newSPO).catch(console.error);

    // Update Customer PO status to procurement_processing
    setCustomerPOs((prev) =>
      prev.map((c) => {
        if (c.id === targetCPO.id) {
          const updated: CustomerPurchaseOrder = {
            ...c,
            commercialApprovalStatus: 'approved',
            isLegallyBinding: true,
            orderStatus: 'procurement_processing',
            updatedAt: now,
          };
          supabaseService.upsertCustomerPO(updated).catch(console.error);
          return updated;
        }
        return c;
      })
    );

    // Update OrderFulfilment to link SPO and advance stage to procurement_processing
    setOrderFulfilments((prev) =>
      prev.map((ful) => {
        if (ful.cpoId === targetCPO.id) {
          const updated: OrderFulfilment = {
            ...ful,
            spoId: newSPO.id,
            spoNumber: newSPO.spoNumber,
            supplierCompanyId: newSPO.supplierCompanyId,
            fulfilmentMode: params.fulfilmentMode,
            currentStage: 'procurement_processing',
            stageTimestamps: {
              ...ful.stageTimestamps,
              order_confirmed: ful.stageTimestamps.order_confirmed || now,
              procurement_processing: now,
            },
            updatedAt: now,
          };
          supabaseService.upsertFulfilment(updated).catch(console.error);
          return updated;
        }
        return ful;
      })
    );

    // Notify Supplier & Buyer
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}-spo-sup`,
        recipientRole: 'supplier',
        recipientCompanyId: newSPO.supplierCompanyId,
        title: `New Purchase Order Received: ${newSPO.spoNumber}`,
        message: `ProcureSouq Operations issued Supplier PO ${newSPO.spoNumber} (AED ${newSPO.supplierTotalAED.toLocaleString()}) against your quotation ${sourceQuote.quotationNumber}. Please confirm stock & dispatch readiness.`,
        category: 'order',
        relatedEntityId: newSPO.id,
        targetView: 'supplier-orders',
        isRead: false,
        createdAt: now,
      },
      ...prev,
    ]);

    recordApprovalAction(
      'supplier_po',
      newSPO.id,
      'CUSTOMER_PO_APPROVED_AND_SPO_ISSUED',
      params.approvedBy || 'Admin Commercial Desk',
      'admin',
      'pending_admin_approval',
      'issued_to_supplier',
      `Approved ${targetCPO.cpoNumber} and generated linked internal Supplier PO ${newSPO.spoNumber}.`
    );

    broadcastSync();
    return newSPO;
  };

  const requestCustomerPOCancellation = (
    cpoId: string,
    reason: string,
    requestedByRole: 'buyer' | 'admin'
  ) => {
    const now = new Date().toISOString();
    setCustomerPOs((prev) =>
      prev.map((c) => {
        if (c.id === cpoId || c.cpoNumber === cpoId) {
          const updated: CustomerPurchaseOrder = {
            ...c,
            orderStatus: requestedByRole === 'admin' ? 'cancelled' : 'cancellation_requested',
            cancellationReason: reason,
            updatedAt: now,
          };
          supabaseService.upsertCustomerPO(updated).catch(console.error);
          return updated;
        }
        return c;
      })
    );
    broadcastSync();
  };

  const confirmSupplierPO = (
    spoId: string,
    status: 'confirmed' | 'rejected_or_delayed',
    notes?: string
  ) => {
    const now = new Date().toISOString();
    const targetSPO = supplierPOs.find((s) => s.id === spoId || s.spoNumber === spoId);
    if (!targetSPO) return;

    setSupplierPOs((prev) =>
      prev.map((s) => {
        if (s.id === targetSPO.id) {
          const updated: SupplierPurchaseOrder = {
            ...s,
            supplierConfirmationStatus: status,
            supplierConfirmedAt: status === 'confirmed' ? now : undefined,
            status: status === 'confirmed' ? 'supplier_confirmed' : s.status,
            internalNotes: notes ? `${s.internalNotes || ''} | Supplier Note: ${notes}` : s.internalNotes,
            updatedAt: now,
          };
          supabaseService.upsertSupplierPO(updated).catch(console.error);
          return updated;
        }
        return s;
      })
    );

    if (status === 'confirmed') {
      updateFulfilmentStage(
        targetSPO.cpoId,
        'supplier_confirmed',
        {},
        targetSPO.supplierCompanyName
      );
    }
    broadcastSync();
  };

  const updateFulfilmentStage = (
    fulfilmentOrCpoId: string,
    stage: FulfilmentStage,
    updates: Partial<OrderFulfilment> = {},
    actorName = 'ProcureSouq Fulfilment Desk'
  ) => {
    const now = new Date().toISOString();
    const targetFul = orderFulfilments.find(
      (f) => f.id === fulfilmentOrCpoId || f.cpoId === fulfilmentOrCpoId || f.cpoNumber === fulfilmentOrCpoId
    );
    if (!targetFul) return;

    const updatedFul: OrderFulfilment = {
      ...targetFul,
      ...updates,
      currentStage: stage,
      stageTimestamps: {
        ...targetFul.stageTimestamps,
        [stage]: now,
      },
      updatedAt: now,
    };

    setOrderFulfilments((prev) => prev.map((f) => (f.id === targetFul.id ? updatedFul : f)));
    supabaseService.upsertFulfilment(updatedFul).catch(console.error);

    // Sync CPO status
    setCustomerPOs((prev) =>
      prev.map((c) => {
        if (c.id === targetFul.cpoId) {
          const nextOrderStatus: CustomerPurchaseOrder['orderStatus'] =
            stage === 'delivered'
              ? 'completed'
              : stage === 'in_transit' || stage === 'ready_for_dispatch'
              ? 'in_fulfilment'
              : 'procurement_processing';
          const updatedCPO: CustomerPurchaseOrder = {
            ...c,
            orderStatus: nextOrderStatus,
            updatedAt: now,
          };
          supabaseService.upsertCustomerPO(updatedCPO).catch(console.error);
          return updatedCPO;
        }
        return c;
      })
    );

    // Sync SPO status
    if (targetFul.spoId) {
      setSupplierPOs((prev) =>
        prev.map((s) => {
          if (s.id === targetFul.spoId) {
            const nextSpoStatus: SupplierPurchaseOrder['status'] =
              stage === 'delivered'
                ? 'delivered'
                : stage === 'in_transit'
                ? 'dispatched'
                : stage === 'ready_for_dispatch'
                ? 'ready_for_dispatch'
                : stage === 'supplier_confirmed'
                ? 'supplier_confirmed'
                : s.status;
            const updatedSPO: SupplierPurchaseOrder = {
              ...s,
              status: nextSpoStatus,
              updatedAt: now,
            };
            supabaseService.upsertSupplierPO(updatedSPO).catch(console.error);
            return updatedSPO;
          }
          return s;
        })
      );
    }

    // Create or update DeliveryRecord when in_transit or delivered
    if (stage === 'in_transit' || stage === 'delivered') {
      const existingDel = deliveryRecords.find((d) => d.fulfilmentId === targetFul.id);
      const delRecord: DeliveryRecord = existingDel
        ? {
            ...existingDel,
            status: updatedFul.isPartialDelivery
              ? 'partially_delivered'
              : stage === 'delivered'
              ? 'delivered'
              : 'in_transit',
            logisticsProvider: updatedFul.logisticsProvider || existingDel.logisticsProvider,
            driverOrContactName: updatedFul.deliveryContactName || existingDel.driverOrContactName,
            contactPhone: updatedFul.deliveryContactPhone || existingDel.contactPhone,
            trackingReference: updatedFul.trackingReference || existingDel.trackingReference,
            isPartial: updatedFul.isPartialDelivery,
            itemsDeliveredSummary:
              updatedFul.deliveredItemsSummary || existingDel.itemsDeliveredSummary,
            dispatchedAt: existingDel.dispatchedAt || now,
            deliveredAt: stage === 'delivered' ? now : existingDel.deliveredAt,
          }
        : {
            id: `del-${Date.now()}`,
            fulfilmentId: targetFul.id,
            cpoId: targetFul.cpoId,
            cpoNumber: targetFul.cpoNumber,
            deliveryNumber: `PS-DN-2026-${String(deliveryRecords.length + 1).padStart(4, '0')}`,
            fulfilmentMode: updatedFul.fulfilmentMode,
            status: stage === 'delivered' ? 'delivered' : 'in_transit',
            logisticsProvider: updatedFul.logisticsProvider || 'Coordinated UAE Flatbed Partner',
            driverOrContactName: updatedFul.deliveryContactName || 'ProcureSouq Dispatch Desk',
            contactPhone: updatedFul.deliveryContactPhone || '+971 52 991 4020',
            trackingReference: updatedFul.trackingReference || `PS-TRK-${Math.floor(10000 + Math.random() * 89999)}`,
            deliveryNoteRef: `DN-${targetFul.cpoNumber}`,
            isPartial: updatedFul.isPartialDelivery,
            itemsDeliveredSummary: updatedFul.deliveredItemsSummary || 'Full BOQ Order Lot',
            dispatchedAt: now,
            deliveredAt: stage === 'delivered' ? now : undefined,
            customerAcknowledged: false,
            createdAt: now,
          };

      setDeliveryRecords((prev) => [
        delRecord,
        ...prev.filter((d) => d.id !== delRecord.id),
      ]);
      supabaseService.upsertDeliveryRecord(delRecord).catch(console.error);
    }

    // Notify Buyer
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}-ful`,
        recipientRole: 'buyer',
        recipientCompanyId: targetFul.buyerCompanyId,
        title: `Order ${targetFul.cpoNumber} Update: ${stage.replace(/_/g, ' ').toUpperCase()}`,
        message: `Fulfilment status for ${targetFul.cpoNumber} is now "${stage.replace(/_/g, ' ')}" (${actorName}).`,
        category: 'delivery',
        relatedEntityId: targetFul.cpoId,
        targetView: 'buyer-orders',
        isRead: false,
        createdAt: now,
      },
      ...prev,
    ]);

    broadcastSync();
  };

  const uploadDeliveryDocument = (
    docData: Omit<DeliveryDocument, 'id' | 'createdAt'>
  ): DeliveryDocument => {
    const newDoc: DeliveryDocument = {
      ...docData,
      id: `ddoc-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      createdAt: new Date().toISOString(),
    };
    setDeliveryDocuments((prev) => [newDoc, ...prev]);
    supabaseService.upsertDeliveryDocument(newDoc).catch(console.error);
    broadcastSync();
    return newDoc;
  };

  const acknowledgeDeliveryReceipt = (fulfilmentId: string, notes?: string) => {
    const now = new Date().toISOString();
    setOrderFulfilments((prev) =>
      prev.map((f) => {
        if (f.id === fulfilmentId || f.cpoId === fulfilmentId) {
          const updated: OrderFulfilment = {
            ...f,
            customerAcknowledged: true,
            customerAcknowledgedAt: now,
            customerAcknowledgementNotes: notes || 'Materials received and verified on site.',
            updatedAt: now,
          };
          supabaseService.upsertFulfilment(updated).catch(console.error);
          return updated;
        }
        return f;
      })
    );
    setDeliveryRecords((prev) =>
      prev.map((d) => {
        if (d.fulfilmentId === fulfilmentId || d.cpoId === fulfilmentId) {
          const updated = { ...d, customerAcknowledged: true };
          supabaseService.upsertDeliveryRecord(updated).catch(console.error);
          return updated;
        }
        return d;
      })
    );
    broadcastSync();
  };

  const reportDeliveryIssue = (fulfilmentId: string, issueNotes: string) => {
    const now = new Date().toISOString();
    setOrderFulfilments((prev) =>
      prev.map((f) => {
        if (f.id === fulfilmentId || f.cpoId === fulfilmentId) {
          const updated: OrderFulfilment = {
            ...f,
            hasDeliveryIssue: true,
            deliveryIssueNotes: issueNotes,
            updatedAt: now,
          };
          supabaseService.upsertFulfilment(updated).catch(console.error);
          return updated;
        }
        return f;
      })
    );
    broadcastSync();
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = (role: string, companyId?: string) => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.recipientRole === role && (!companyId || !n.recipientCompanyId || n.recipientCompanyId === companyId)) {
          return { ...n, isRead: true };
        }
        return n;
      })
    );
  };

  const resetToDefaults = () => {
    setRfqs(initialRFQs);
    setQuotations(initialQuotations);
    setPurchaseOrders(initialPurchaseOrders);
    setCompanies(initialCompanies);
    setMessages(initialMessages);
    setReviews(initialReviews);
    setVerifications(initialVerifications);
    setCommercialSettings(defaultCommercialSettings);
    setPricingRules(defaultPricingRules);
    setSupplierInvitations(v2TestInvitations);
    setQuotationEvaluations(v2TestEvaluations);
    setInternalCosts(v2TestInternalCosts);
    setCustomerOffers(v2TestCustomerOffers);
    setCustomerPOs(v2TestCustomerPOs);
    setSupplierPOs(v2TestSupplierPOs);
    setOrderFulfilments(v2TestFulfilments);
    setDeliveryRecords(v2TestDeliveries);
    setDeliveryDocuments(v2TestDeliveryDocuments);
    setApprovalHistory(v2TestApprovalHistory);
    setNotifications(v2TestNotifications);
    localStorage.clear();
  };

  return (
    <AppDataContext.Provider
      value={{
        rfqs,
        quotations,
        purchaseOrders,
        companies,
        categories,
        messages,
        reviews,
        verifications,
        declinedRFQs,
        isSupabaseConnected,
        isSyncing,
        commercialSettings,
        pricingRules,
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
        notifications,
        createRFQ,
        updateRFQStatus,
        getRFQById,
        cancelRFQByBuyer,
        deleteRFQ,
        declineRFQ,
        isRFQDeclinedBySupplier,
        submitQuotation,
        getQuotesForRFQ,
        getQuotationsForSupplier,
        getRFQQuoteCapacity,
        canSupplierQuote,
        hasSupplierQuoted,
        awardQuotation,
        updateOrderStatus,
        getOrderById,
        updateCommercialSettings,
        updateRFQAdminWorkflow,
        inviteSuppliersToRFQ,
        uploadManualSupplierQuote,
        evaluateSupplierQuote,
        calculateAndSaveInternalCost,
        publishCustomerOffersForRFQ,
        getCustomerOffersForRFQ,
        selectOfferAndCreateCustomerPO,
        approveCustomerPOAndCreateSupplierPO,
        requestCustomerPOCancellation,
        confirmSupplierPO,
        updateFulfilmentStage,
        uploadDeliveryDocument,
        acknowledgeDeliveryReceipt,
        reportDeliveryIssue,
        markNotificationRead,
        markAllNotificationsRead,
        sendMessage,
        getMessagesForRFQ,
        submitReview,
        rateQuotation,
        updateVerificationStatus,
        unlockedRFQIds,
        unlockExtendedQuotes,
        isRFQExtendedUnlocked,
        telemetryItems,
        updateTelemetryItem,
        addTelemetryItem,
        deleteTelemetryItem,
        toggleTelemetryActive,
        resetTelemetryToDefaults,
        isMicroTickActive,
        setIsMicroTickActive,
        computedPlatformMetrics,
        resetToDefaults,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};
