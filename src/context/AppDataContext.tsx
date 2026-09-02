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
  RFQStatus,
  OrderStatus,
  VerificationStatus,
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
  isSupabaseConnected: boolean;
  isSyncing: boolean;
  
  // RFQ Methods
  createRFQ: (newRFQ: Omit<RFQ, 'id' | 'rfqNumber' | 'createdAt' | 'updatedAt' | 'quotesCount' | 'invitedCount'>) => RFQ;
  updateRFQStatus: (rfqId: string, status: RFQStatus) => void;
  getRFQById: (rfqId: string) => RFQ | undefined;
  
  // Quotation Methods
  submitQuotation: (quoteData: Omit<Quotation, 'id' | 'quotationNumber' | 'submittedAt' | 'status'>) => Quotation;
  getQuotesForRFQ: (rfqId: string) => Quotation[];
  getQuotationsForSupplier: (supplierCompanyId: string) => Quotation[];
  
  // Awarding & Orders
  awardQuotation: (rfqId: string, quotationId: string) => PurchaseOrder;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNotes?: string) => void;
  getOrderById: (orderId: string) => PurchaseOrder | undefined;
  
  // Messaging
  sendMessage: (msg: Omit<Message, 'id' | 'createdAt' | 'isRead'>) => Message;
  getMessagesForRFQ: (rfqId: string) => Message[];
  
  // Reviews
  submitReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  
  // Admin Verification
  updateVerificationStatus: (companyId: string, status: VerificationStatus, notes?: string) => void;
  
  // Reset
  resetToDefaults: () => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

const STORAGE_KEY = 'supplysouq_supabase_live_v8';

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Initialize from LocalStorage or seed data
  const [rfqs, setRfqs] = useState<RFQ[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_rfqs`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((r: RFQ) => r.rfqNumber === 'SS-10284')) {
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
        if (Array.isArray(parsed) && parsed.filter((q: Quotation) => q.rfqNumber === 'SS-10284').length >= 5) {
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
        if (Array.isArray(parsed) && parsed.length >= 8) {
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
      const saved = localStorage.getItem(`${STORAGE_KEY}_verifs`);
      return saved ? JSON.parse(saved) : initialVerifications;
    } catch (e) {
      return initialVerifications;
    }
  });

  // Sync with Supabase on Initial Load
  const initSupabase = useCallback(async () => {
    setIsSyncing(true);
    try {
      const result = await supabaseService.fetchAll();
      if (!result.error) {
        setIsSupabaseConnected(true);

        // If companies exist in Supabase, sync them down
        if (result.companies && result.companies.length > 0) {
          setCompanies(result.companies);
        } else {
          // If Supabase is empty, seed initial data to the database
          await supabaseService.seedInitialData({
            companies: initialCompanies,
            rfqs: initialRFQs,
            quotations: initialQuotations,
            purchaseOrders: initialPurchaseOrders,
            messages: initialMessages,
            verifications: initialVerifications,
          });
        }

        if (result.rfqs && result.rfqs.length > 0) {
          setRfqs(result.rfqs);
        }

        if (result.quotations && result.quotations.length > 0) {
          setQuotations(result.quotations);
        }

        if (result.purchaseOrders && result.purchaseOrders.length > 0) {
          setPurchaseOrders(result.purchaseOrders);
        }

        if (result.messages && result.messages.length > 0) {
          setMessages(result.messages);
        }

        if (result.verifications && result.verifications.length > 0) {
          setVerifications(result.verifications);
        }
      } else {
        console.warn('Supabase fetch issue, using local storage cache:', result.error);
      }
    } catch (err) {
      console.error('Failed connecting to Supabase, running in local cached mode:', err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    initSupabase();
  }, [initSupabase]);

  // Supabase Realtime Subscriptions
  useEffect(() => {
    const channel = supabase
      .channel('supplysouq_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rfqs' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newRfq = mapRFQFromDB(payload.new);
          setRfqs((prev) => (prev.some((r) => r.id === newRfq.id) ? prev : [newRfq, ...prev]));
        } else if (payload.eventType === 'UPDATE') {
          const updated = mapRFQFromDB(payload.new);
          setRfqs((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quotations' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newQuote = mapQuotationFromDB(payload.new);
          setQuotations((prev) => (prev.some((q) => q.id === newQuote.id) ? prev : [newQuote, ...prev]));
        } else if (payload.eventType === 'UPDATE') {
          const updated = mapQuotationFromDB(payload.new);
          setQuotations((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'purchase_orders' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newPo = mapPOFromDB(payload.new);
          setPurchaseOrders((prev) => (prev.some((p) => p.id === newPo.id) ? prev : [newPo, ...prev]));
        } else if (payload.eventType === 'UPDATE') {
          const updated = mapPOFromDB(payload.new);
          setPurchaseOrders((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newMsg = mapMessageFromDB(payload.new);
          setMessages((prev) => (prev.some((m) => m.id === newMsg.id) ? prev : [...prev, newMsg]));
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
    
    // Intelligent 5-Supplier Matchmaking Engine based on Category & Industrial Zone
    const supplierPool = companies.filter((c) => c.companyType === 'supplier');
    const categoryQuery = (newRFQData.category || '').toLowerCase();
    const itemQuery = (newRFQData.items || []).map(i => (i.description || '').toLowerCase()).join(' ');

    const scoredSuppliers = supplierPool.map((supplier) => {
      let score = 0;
      const supplierCats = (supplier.categories || []).map(c => c.toLowerCase());
      
      if (supplierCats.some(c => categoryQuery.includes(c) || c.includes(categoryQuery))) {
        score += 10;
      }
      if (supplierCats.some(c => itemQuery.includes(c) || c.includes(itemQuery))) {
        score += 5;
      }
      if (supplier.emirate === newRFQData.deliveryEmirate) {
        score += 3;
      }
      if (supplier.verificationStatus === 'verified') {
        score += 2;
      }
      return { supplier, score };
    });

    scoredSuppliers.sort((a, b) => b.score - a.score);
    const top5 = (scoredSuppliers.length >= 5 ? scoredSuppliers.slice(0, 5) : scoredSuppliers).map(s => s.supplier);
    const final5 = top5.length > 0 ? top5 : supplierPool.slice(0, 5);

    const matchedSupplierCompanyIds = final5.map(s => s.id);
    const matchedSupplierNames = final5.map(s => s.name);
    const deadline24h = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const newRFQ: RFQ = {
      ...newRFQData,
      id: `rfq-${Date.now()}`,
      rfqNumber: `SS-${randomNum}`,
      status: 'published',
      invitedCount: final5.length || 5,
      quotesCount: 0,
      matchedSupplierCompanyIds,
      matchedSupplierNames,
      deadline24h,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRfqs((prev) => [newRFQ, ...prev]);

    // Create automated dispatch message/notification for the 5 matched stockists
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      rfqId: newRFQ.id,
      rfqNumber: newRFQ.rfqNumber,
      senderId: 'system-matchmaker',
      senderName: 'SupplySouq Dispatch Engine',
      senderCompanyId: newRFQ.buyerCompanyId,
      senderCompanyName: newRFQ.buyerCompanyName,
      senderRole: 'buyer',
      recipientCompanyId: 'all-matched-suppliers',
      recipientCompanyName: '5 Matched Verified UAE Stockists',
      messageText: `[Automated Matchmaking Dispatch] RFQ #${newRFQ.rfqNumber} for "${newRFQ.title}" has been delivered to 5 verified stockists: ${matchedSupplierNames.join(', ')}. Quotation SLA: 24 Hours.`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setMessages((prev) => [...prev, newMsg]);

    // Persist to Supabase in background
    supabaseService.createRFQ(newRFQ).catch(console.error);

    return newRFQ;
  };

  const updateRFQStatus = (rfqId: string, status: RFQStatus) => {
    setRfqs((prev) =>
      prev.map((r) => (r.id === rfqId ? { ...r, status, updatedAt: new Date().toISOString() } : r))
    );

    // Persist to Supabase
    supabaseService.updateRFQStatus(rfqId, status).catch(console.error);
  };

  const getRFQById = (rfqId: string) => {
    return rfqs.find((r) => r.id === rfqId || r.rfqNumber === rfqId);
  };

  const submitQuotation = (quoteData: Omit<Quotation, 'id' | 'quotationNumber' | 'submittedAt' | 'status'>): Quotation => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const targetRFQ = rfqs.find((r) => r.id === quoteData.rfqId || r.rfqNumber === quoteData.rfqId);

    const newQuote: Quotation = {
      ...quoteData,
      id: `quote-${Date.now()}`,
      quotationNumber: `QT-${randomNum}`,
      buyerCompanyId: targetRFQ?.buyerCompanyId || (quoteData as any).buyerCompanyId,
      buyerCompanyName: targetRFQ?.buyerCompanyName || (quoteData as any).buyerCompanyName,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    };

    setQuotations((prev) => [newQuote, ...prev]);

    // Update quote count and status on RFQ
    setRfqs((prev) =>
      prev.map((r) => {
        if (r.id === quoteData.rfqId) {
          const newCount = (r.quotesCount || 0) + 1;
          return {
            ...r,
            quotesCount: newCount,
            status: 'receiving_quotes',
            updatedAt: new Date().toISOString(),
          };
        }
        return r;
      })
    );

    // Send direct notification message from Supplier to the specific Buyer
    if (targetRFQ) {
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
        messageText: `Commercial Quotation ${newQuote.quotationNumber} submitted for AED ${newQuote.grandTotalAED.toLocaleString()} (Lead Time: ${newQuote.leadTimeDisplay || newQuote.leadTimeDays + ' Days'}).`,
        createdAt: new Date().toISOString(),
        isRead: false,
      };
      setMessages((prev) => [...prev, quoteMsg]);
    }

    // Persist to Supabase
    supabaseService.submitQuotation(newQuote).catch(console.error);

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
        isSupabaseConnected,
        isSyncing,
        createRFQ,
        updateRFQStatus,
        getRFQById,
        submitQuotation,
        getQuotesForRFQ,
        getQuotationsForSupplier,
        awardQuotation,
        updateOrderStatus,
        getOrderById,
        sendMessage,
        getMessagesForRFQ,
        submitReview,
        updateVerificationStatus,
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
