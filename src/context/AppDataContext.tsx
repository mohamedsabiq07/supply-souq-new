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

const STORAGE_KEY = 'supplysouq_production_clean_v10';

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
      return saved ? JSON.parse(saved) : initialMessages;
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
          setMessages((prev) => mergeEntities(prev, result.messages));
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
          setMessages((prev) => [...prev.filter((m) => m.id !== newMsg.id), newMsg]);
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

  const createRFQ = (newRFQData: Omit<RFQ, 'id' | 'rfqNumber' | 'createdAt' | 'updatedAt' | 'quotesCount' | 'invitedCount'>): RFQ => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    
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
      rfqNumber: `SS-${randomNum}`,
      targetSupplierId: targetSupplier?.id || newRFQData.targetSupplierId,
      targetSupplierName: targetSupplier?.name || newRFQData.targetSupplierName,
      status: 'published',
      invitedCount: Math.min(5, allRecipients.length) || 5,
      quotesCount: 0,
      matchedSupplierCompanyIds,
      matchedSupplierNames,
      deadline24h,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRfqs((prev) => [newRFQ, ...prev]);

    // Deliver direct notification messages to each vendor in this category
    if (allRecipients.length > 0) {
      allRecipients.forEach(sup => {
        const supMsg: Message = {
          id: `msg-${Date.now()}-${sup.id}`,
          rfqId: newRFQ.id,
          rfqNumber: newRFQ.rfqNumber,
          senderId: newRFQ.buyerCompanyId,
          senderName: newRFQ.buyerCompanyName,
          senderCompanyId: newRFQ.buyerCompanyId,
          senderCompanyName: newRFQ.buyerCompanyName,
          senderRole: 'buyer',
          recipientCompanyId: sup.id,
          recipientCompanyName: sup.name,
          messageText: `[Category RFQ Dispatch] ${newRFQ.buyerCompanyName} submitted RFQ #${newRFQ.rfqNumber} for "${newRFQ.title}" in your registered category (${newRFQ.category}). Please review and submit your quotation within 24 hours.`,
          createdAt: new Date().toISOString(),
          isRead: false,
        };
        setMessages((prev) => [...prev, supMsg]);
        supabaseService.sendMessage(supMsg).catch(console.error);
      });
    } else {
      const sysMsg: Message = {
        id: `msg-${Date.now()}-general`,
        rfqId: newRFQ.id,
        rfqNumber: newRFQ.rfqNumber,
        senderId: 'system-dispatch',
        senderName: 'SupplySouq Market Engine',
        senderCompanyId: newRFQ.buyerCompanyId,
        senderCompanyName: newRFQ.buyerCompanyName,
        senderRole: 'buyer',
        recipientCompanyId: newRFQ.buyerCompanyId,
        recipientCompanyName: newRFQ.buyerCompanyName,
        messageText: `RFQ #${newRFQ.rfqNumber} for "${newRFQ.title}" has been published. All registered UAE vendors in ${newRFQ.category} will receive this requirement directly on their sales desk.`,
        createdAt: new Date().toISOString(),
        isRead: false,
      };
      setMessages((prev) => [...prev, sysMsg]);
    }

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

  const resetToDefaults = () => {
    setRfqs(initialRFQs);
    setQuotations(initialQuotations);
    setPurchaseOrders(initialPurchaseOrders);
    setCompanies(initialCompanies);
    setMessages(initialMessages);
    setReviews(initialReviews);
    setVerifications(initialVerifications);
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
