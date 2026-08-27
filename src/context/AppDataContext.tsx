import React, { createContext, useContext, useState, useEffect } from 'react';
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
import { calculateUAEVAT } from '../lib/utils';

interface AppDataContextType {
  rfqs: RFQ[];
  quotations: Quotation[];
  purchaseOrders: PurchaseOrder[];
  companies: Company[];
  categories: Category[];
  messages: Message[];
  reviews: Review[];
  verifications: VerificationRequest[];
  
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

const STORAGE_KEY = 'supplysouq_multi_category_v7';

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Wipe out legacy cache keys if present
  useEffect(() => {
    try {
      ['supplysouq_app_data_v1', 'supplysouq_app_data_v2', 'supplysouq_electrical_v1', 'supplysouq_electrical_v6_5quotes'].forEach(prefix => {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith(prefix)) {
            localStorage.removeItem(key);
          }
        });
      });
    } catch (e) {}
  }, []);

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

  // Sync to LocalStorage for persistence across tab switches
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
    const newRFQ: RFQ = {
      ...newRFQData,
      id: `rfq-${Date.now()}`,
      rfqNumber: `SS-${randomNum}`,
      status: 'published',
      invitedCount: 8, // simulated matched verified suppliers
      quotesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRfqs(prev => [newRFQ, ...prev]);
    return newRFQ;
  };

  const updateRFQStatus = (rfqId: string, status: RFQStatus) => {
    setRfqs(prev =>
      prev.map(r => (r.id === rfqId ? { ...r, status, updatedAt: new Date().toISOString() } : r))
    );
  };

  const getRFQById = (rfqId: string) => {
    return rfqs.find(r => r.id === rfqId || r.rfqNumber === rfqId);
  };

  const submitQuotation = (quoteData: Omit<Quotation, 'id' | 'quotationNumber' | 'submittedAt' | 'status'>): Quotation => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newQuote: Quotation = {
      ...quoteData,
      id: `quote-${Date.now()}`,
      quotationNumber: `QT-${randomNum}`,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    };

    setQuotations(prev => [newQuote, ...prev]);

    // Update quote count and status on RFQ
    setRfqs(prev =>
      prev.map(r => {
        if (r.id === quoteData.rfqId) {
          const newCount = (r.quotesCount || 0) + 1;
          return {
            ...r,
            quotesCount: newCount,
            status: r.status === 'published' ? 'receiving_quotes' : r.status,
            updatedAt: new Date().toISOString(),
          };
        }
        return r;
      })
    );

    return newQuote;
  };

  const getQuotesForRFQ = (rfqId: string) => {
    return quotations.filter(q => q.rfqId === rfqId || q.rfqNumber === rfqId);
  };

  const getQuotationsForSupplier = (supplierCompanyId: string) => {
    return quotations.filter(q => q.supplierCompanyId === supplierCompanyId);
  };

  const awardQuotation = (rfqId: string, quotationId: string): PurchaseOrder => {
    const targetRFQ = rfqs.find(r => r.id === rfqId || r.rfqNumber === rfqId);
    const targetQuote = quotations.find(q => q.id === quotationId || q.quotationNumber === quotationId);

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
    setPurchaseOrders(prev => [newPO, ...prev]);

    // Mark RFQ as awarded
    setRfqs(prev =>
      prev.map(r => (r.id === targetRFQ.id ? { ...r, status: 'awarded', awardedQuotationId: targetQuote.id } : r))
    );

    // Update Quotation statuses
    setQuotations(prev =>
      prev.map(q => {
        if (q.rfqId === targetRFQ.id) {
          return q.id === targetQuote.id ? { ...q, status: 'awarded' } : { ...q, status: 'declined' };
        }
        return q;
      })
    );

    return newPO;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, trackingNotes?: string) => {
    setPurchaseOrders(prev =>
      prev.map(po => {
        if (po.id === orderId || po.poNumber === orderId) {
          return {
            ...po,
            status,
            trackingNotes: trackingNotes || po.trackingNotes,
            actualDeliveryDate: status === 'delivered' || status === 'completed' ? new Date().toISOString().split('T')[0] : po.actualDeliveryDate,
            updatedAt: new Date().toISOString(),
          };
        }
        return po;
      })
    );
  };

  const getOrderById = (orderId: string) => {
    return purchaseOrders.find(po => po.id === orderId || po.poNumber === orderId);
  };

  const sendMessage = (msg: Omit<Message, 'id' | 'createdAt' | 'isRead'>): Message => {
    const newMsg: Message = {
      ...msg,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setMessages(prev => [...prev, newMsg]);
    return newMsg;
  };

  const getMessagesForRFQ = (rfqId: string) => {
    return messages.filter(m => m.rfqId === rfqId || m.rfqNumber === rfqId);
  };

  const submitReview = (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setReviews(prev => [newReview, ...prev]);

    // Mark PO as reviewed
    setPurchaseOrders(prev =>
      prev.map(po => (po.id === reviewData.purchaseOrderId ? { ...po, reviewedByBuyer: true } : po))
    );

    // Update supplier average rating & review count
    setCompanies(prev =>
      prev.map(comp => {
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
    setCompanies(prev =>
      prev.map(comp => (comp.id === companyId ? { ...comp, verificationStatus: status, verificationNotes: notes } : comp))
    );
    setVerifications(prev =>
      prev.map(v => (v.companyId === companyId ? { ...v, status, notes } : v))
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
