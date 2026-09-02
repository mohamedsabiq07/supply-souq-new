import { supabase } from '../lib/supabase';
import { 
  RFQ, 
  Quotation, 
  PurchaseOrder, 
  Company, 
  Message, 
  VerificationRequest,
  RFQStatus,
  OrderStatus,
  VerificationStatus
} from '../types';

// Map database snake_case to app camelCase
export const mapCompanyFromDB = (row: any): Company => ({
  id: row.id,
  name: row.name,
  legalName: row.legal_name || row.name,
  tradeLicenseNumber: row.trade_license_number || '',
  tradeLicenseDocUrl: row.trade_license_doc_url,
  companyType: row.company_type || 'supplier',
  emirate: row.emirate || 'Dubai',
  industrialZone: row.industrial_zone || 'Al Quoz Industrial Area',
  address: row.address || '',
  phone: row.phone || '',
  email: row.email || '',
  website: row.website,
  categories: Array.isArray(row.categories) ? row.categories : [],
  serviceEmirates: Array.isArray(row.service_emirates) ? row.service_emirates : ['Dubai', 'Sharjah', 'Ajman'],
  verificationStatus: row.verification_status || 'verified',
  verificationNotes: row.verification_notes,
  rating: Number(row.rating) || 5.0,
  reviewCount: Number(row.review_count) || 0,
  responseRatePercent: Number(row.response_rate_percent) || 95,
  averageResponseHours: Number(row.average_response_hours) || 2.0,
  yearsInBusiness: Number(row.years_in_business) || 1,
  badge: row.badge,
  logoUrl: row.logo_url,
  createdAt: row.created_at || new Date().toISOString()
});

export const mapCompanyToDB = (c: Company) => ({
  id: c.id,
  name: c.name,
  legal_name: c.legalName,
  trade_license_number: c.tradeLicenseNumber,
  trade_license_doc_url: c.tradeLicenseDocUrl,
  company_type: c.companyType,
  emirate: c.emirate,
  industrial_zone: c.industrialZone,
  address: c.address,
  phone: c.phone,
  email: c.email,
  website: c.website,
  categories: c.categories,
  service_emirates: c.serviceEmirates,
  verification_status: c.verificationStatus,
  verification_notes: c.verificationNotes,
  rating: c.rating,
  review_count: c.reviewCount,
  response_rate_percent: c.responseRatePercent,
  average_response_hours: c.averageResponseHours,
  years_in_business: c.yearsInBusiness,
  badge: c.badge,
  logo_url: c.logoUrl,
  created_at: c.createdAt
});

export const mapRFQFromDB = (row: any): RFQ => ({
  id: row.id,
  rfqNumber: row.rfq_number,
  buyerCompanyId: row.buyer_company_id,
  buyerCompanyName: row.buyer_company_name,
  buyerContactName: row.buyer_contact_name,
  buyerPhone: row.buyer_phone,
  buyerEmail: row.buyer_email,
  title: row.title,
  projectName: row.project_name || '',
  projectLocation: row.project_location || '',
  deliveryEmirate: row.delivery_emirate || 'Dubai',
  deliveryAddress: row.delivery_address || '',
  category: row.category || 'LV & MV Power Cables & Wires',
  requiredDeliveryDate: row.required_delivery_date || '',
  closingDate: row.closing_date || '',
  priority: row.priority || 'normal',
  targetSupplierScope: row.target_supplier_scope || 'all_verified',
  status: (row.status as RFQStatus) || 'published',
  notes: row.notes,
  photoUploadUrl: row.photo_upload_url,
  isQuickTemplate: row.is_quick_template,
  items: Array.isArray(row.items) ? row.items : [],
  documents: Array.isArray(row.documents) ? row.documents : [],
  quotesCount: Number(row.quotes_count) || 0,
  invitedCount: Number(row.invited_count) || 0,
  awardedQuotationId: row.awarded_quotation_id,
  createdAt: row.created_at || new Date().toISOString(),
  updatedAt: row.updated_at || new Date().toISOString()
});

export const mapRFQToDB = (r: RFQ) => ({
  id: r.id,
  rfq_number: r.rfqNumber,
  buyer_company_id: r.buyerCompanyId,
  buyer_company_name: r.buyerCompanyName,
  buyer_contact_name: r.buyerContactName,
  buyer_phone: r.buyerPhone,
  buyer_email: r.buyerEmail,
  title: r.title,
  project_name: r.projectName,
  project_location: r.projectLocation,
  delivery_emirate: r.deliveryEmirate,
  delivery_address: r.deliveryAddress,
  category: r.category,
  required_delivery_date: r.requiredDeliveryDate,
  closing_date: r.closingDate,
  priority: r.priority,
  target_supplier_scope: r.targetSupplierScope,
  status: r.status,
  notes: r.notes,
  photo_upload_url: r.photoUploadUrl,
  is_quick_template: r.isQuickTemplate,
  items: r.items,
  documents: r.documents,
  quotes_count: r.quotesCount,
  invited_count: r.invitedCount,
  created_at: r.createdAt,
  updated_at: r.updatedAt
});

export const mapQuotationFromDB = (row: any): Quotation => ({
  id: row.id,
  quotationNumber: row.quotation_number || ('QT-' + row.id.replace('quote-', '')),
  rfqId: row.rfq_id,
  rfqNumber: row.rfq_number,
  rfqTitle: row.rfq_title || '',
  supplierCompanyId: row.supplier_company_id,
  supplierCompanyName: row.supplier_company_name,
  supplierEmirate: row.supplier_emirate || 'Dubai',
  supplierZone: row.supplier_zone || '',
  supplierRating: Number(row.supplier_rating) || 5.0,
  supplierVerified: Boolean(row.supplier_verified),
  items: Array.isArray(row.items) ? row.items : [],
  subtotalAED: Number(row.subtotal_aed) || 0,
  discountAED: Number(row.discount_aed) || 0,
  vatAED: Number(row.vat_aed) || 0,
  deliveryChargeAED: Number(row.delivery_charge_aed) || 0,
  grandTotalAED: Number(row.total_amount_aed || row.grand_total_aed) || 0,
  leadTimeDays: Number(row.delivery_days || row.lead_time_days) || 3,
  leadTimeDisplay: row.lead_time_display || '3 Business Days',
  warrantyPeriod: row.warranty_period || '1 Year Standard Manufacturer Warranty',
  paymentTerms: row.payment_terms || '30 Days Credit',
  validityDate: row.valid_until || row.validity_date || '2026-09-30',
  notes: row.notes,
  quotationPdfUrl: row.quotation_pdf_url,
  status: (row.status as any) || 'submitted',
  submittedAt: row.submitted_at || new Date().toISOString()
});

export const mapQuotationToDB = (q: Quotation) => ({
  id: q.id,
  rfq_id: q.rfqId,
  rfq_number: q.rfqNumber,
  supplier_company_id: q.supplierCompanyId,
  supplier_company_name: q.supplierCompanyName,
  supplier_emirate: q.supplierEmirate,
  supplier_zone: q.supplierZone,
  supplier_rating: q.supplierRating,
  supplier_verified: q.supplierVerified,
  items: q.items,
  subtotal_aed: q.subtotalAED,
  vat_aed: q.vatAED,
  total_amount_aed: q.grandTotalAED,
  delivery_days: q.leadTimeDays,
  delivery_terms: q.leadTimeDisplay,
  payment_terms: q.paymentTerms,
  valid_until: q.validityDate,
  notes: q.notes,
  status: q.status,
  submitted_at: q.submittedAt
});

export const mapPOFromDB = (row: any): PurchaseOrder => ({
  id: row.id,
  poNumber: row.po_number,
  rfqId: row.rfq_id,
  rfqNumber: row.rfq_number,
  rfqTitle: row.rfq_title || '',
  quotationId: row.quotation_id,
  quotationNumber: row.quotation_number || '',
  buyerCompanyId: row.buyer_company_id,
  buyerCompanyName: row.buyer_company_name,
  buyerContactName: row.buyer_contact_name || '',
  buyerPhone: row.buyer_phone || '',
  supplierCompanyId: row.supplier_company_id,
  supplierCompanyName: row.supplier_company_name,
  supplierPhone: row.supplier_phone || '+971 4 340 7788',
  items: Array.isArray(row.items) ? row.items : [],
  subtotalAED: Number(row.subtotal_aed) || Number(row.total_amount_aed) || 0,
  vatAED: Number(row.vat_aed) || 0,
  deliveryChargeAED: Number(row.delivery_charge_aed) || 0,
  totalAmountAED: Number(row.total_amount_aed) || 0,
  status: (row.status as OrderStatus) || 'po_created',
  deliveryAddress: row.delivery_location || row.delivery_address || '',
  deliveryEmirate: row.delivery_emirate || 'Dubai',
  expectedDeliveryDate: row.expected_delivery_date || '',
  paymentTerms: row.payment_terms || '30 Days Credit',
  trackingNotes: row.tracking_notes,
  reviewedByBuyer: Boolean(row.reviewed_by_buyer),
  createdAt: row.created_at || new Date().toISOString(),
  updatedAt: row.updated_at || new Date().toISOString()
});

export const mapPOToDB = (po: PurchaseOrder) => ({
  id: po.id,
  po_number: po.poNumber,
  rfq_id: po.rfqId,
  rfq_number: po.rfqNumber,
  quotation_id: po.quotationId,
  buyer_company_id: po.buyerCompanyId,
  buyer_company_name: po.buyerCompanyName,
  supplier_company_id: po.supplierCompanyId,
  supplier_company_name: po.supplierCompanyName,
  items: po.items,
  total_amount_aed: po.totalAmountAED,
  status: po.status,
  delivery_location: po.deliveryAddress,
  expected_delivery_date: po.expectedDeliveryDate,
  payment_terms: po.paymentTerms,
  tracking_notes: po.trackingNotes,
  created_at: po.createdAt
});

export const mapMessageFromDB = (row: any): Message => ({
  id: row.id,
  rfqId: row.rfq_id,
  rfqNumber: row.rfq_number || '',
  senderId: row.sender_company_id,
  senderName: row.sender_name,
  senderRole: row.sender_role || 'buyer',
  senderCompanyId: row.sender_company_id,
  senderCompanyName: row.sender_company_name || row.sender_name,
  recipientCompanyId: row.recipient_company_id,
  recipientCompanyName: row.recipient_company_name || 'Recipient Company',
  messageText: row.content || '',
  createdAt: row.created_at || new Date().toISOString(),
  isRead: Boolean(row.is_read)
});

export const mapMessageToDB = (m: Message) => ({
  id: m.id,
  rfq_id: m.rfqId,
  sender_company_id: m.senderCompanyId,
  sender_name: m.senderName,
  sender_role: m.senderRole,
  recipient_company_id: m.recipientCompanyId,
  content: m.messageText,
  is_read: m.isRead,
  created_at: m.createdAt
});

export const mapVerificationFromDB = (row: any): VerificationRequest => ({
  id: row.id,
  companyId: row.company_id,
  companyName: row.company_name,
  tradeLicenseNumber: row.trade_license_number || '',
  emirate: row.emirate || 'Dubai',
  industrialZone: row.industrial_zone || 'Al Quoz Industrial Area',
  docUrl: row.document_url || '',
  status: row.status || 'pending',
  submittedAt: row.submitted_at || new Date().toISOString(),
  notes: row.notes
});

export const mapVerificationToDB = (v: VerificationRequest) => ({
  id: v.id,
  company_id: v.companyId,
  company_name: v.companyName,
  trade_license_number: v.tradeLicenseNumber,
  document_url: v.docUrl,
  status: v.status,
  submitted_at: v.submittedAt,
  notes: v.notes
});

// Database Operations
export const supabaseService = {
  // Fetch All
  async fetchAll() {
    try {
      const [companiesRes, rfqsRes, quotesRes, posRes, messagesRes, verificationsRes] = await Promise.all([
        supabase.from('companies').select('*'),
        supabase.from('rfqs').select('*'),
        supabase.from('quotations').select('*'),
        supabase.from('purchase_orders').select('*'),
        supabase.from('messages').select('*'),
        supabase.from('verifications').select('*')
      ]);

      return {
        companies: (companiesRes.data || []).map(mapCompanyFromDB),
        rfqs: (rfqsRes.data || []).map(mapRFQFromDB),
        quotations: (quotesRes.data || []).map(mapQuotationFromDB),
        purchaseOrders: (posRes.data || []).map(mapPOFromDB),
        messages: (messagesRes.data || []).map(mapMessageFromDB),
        verifications: (verificationsRes.data || []).map(mapVerificationFromDB),
        error: companiesRes.error || rfqsRes.error || quotesRes.error
      };
    } catch (err) {
      console.error('Failed to fetch from Supabase:', err);
      return { error: err };
    }
  },

  // Seed Data to Supabase
  async seedInitialData(data: {
    companies: Company[];
    rfqs: RFQ[];
    quotations: Quotation[];
    purchaseOrders: PurchaseOrder[];
    messages: Message[];
    verifications: VerificationRequest[];
  }) {
    try {
      if (data.companies.length > 0) {
        await supabase.from('companies').upsert(data.companies.map(mapCompanyToDB));
      }
      if (data.rfqs.length > 0) {
        await supabase.from('rfqs').upsert(data.rfqs.map(mapRFQToDB));
      }
      if (data.quotations.length > 0) {
        await supabase.from('quotations').upsert(data.quotations.map(mapQuotationToDB));
      }
      if (data.purchaseOrders.length > 0) {
        await supabase.from('purchase_orders').upsert(data.purchaseOrders.map(mapPOToDB));
      }
      if (data.messages.length > 0) {
        await supabase.from('messages').upsert(data.messages.map(mapMessageToDB));
      }
      if (data.verifications.length > 0) {
        await supabase.from('verifications').upsert(data.verifications.map(mapVerificationToDB));
      }
      console.log('Successfully seeded initial data to Supabase!');
    } catch (e) {
      console.error('Error seeding data to Supabase:', e);
    }
  },

  // Insert RFQ
  async createRFQ(rfq: RFQ) {
    try {
      const { data, error } = await supabase.from('rfqs').insert([mapRFQToDB(rfq)]).select();
      if (error) console.error('Error creating RFQ in Supabase:', error);
      return data;
    } catch (e) {
      console.error(e);
    }
  },

  // Update RFQ Status
  async updateRFQStatus(rfqId: string, status: RFQStatus) {
    try {
      const { error } = await supabase.from('rfqs').update({ status, updated_at: new Date().toISOString() }).eq('id', rfqId);
      if (error) console.error('Error updating RFQ status in Supabase:', error);
    } catch (e) {
      console.error(e);
    }
  },

  // Insert Quotation
  async submitQuotation(quote: Quotation) {
    try {
      const { data, error } = await supabase.from('quotations').insert([mapQuotationToDB(quote)]).select();
      if (error) console.error('Error submitting quote in Supabase:', error);
      return data;
    } catch (e) {
      console.error(e);
    }
  },

  // Insert Purchase Order
  async createPurchaseOrder(po: PurchaseOrder) {
    try {
      const { data, error } = await supabase.from('purchase_orders').insert([mapPOToDB(po)]).select();
      if (error) console.error('Error creating PO in Supabase:', error);
      return data;
    } catch (e) {
      console.error(e);
    }
  },

  // Update PO Status
  async updateOrderStatus(orderId: string, status: OrderStatus, trackingNotes?: string) {
    try {
      const updateData: any = { status };
      if (trackingNotes) updateData.tracking_notes = trackingNotes;
      const { error } = await supabase.from('purchase_orders').update(updateData).eq('id', orderId);
      if (error) console.error('Error updating PO status in Supabase:', error);
    } catch (e) {
      console.error(e);
    }
  },

  // Insert Message
  async sendMessage(msg: Message) {
    try {
      const { data, error } = await supabase.from('messages').insert([mapMessageToDB(msg)]).select();
      if (error) console.error('Error sending message in Supabase:', error);
      return data;
    } catch (e) {
      console.error(e);
    }
  },

  // Update Verification Status
  async updateVerificationStatus(companyId: string, status: VerificationStatus, notes?: string) {
    try {
      const updateData: any = { status, reviewed_at: new Date().toISOString() };
      if (notes) updateData.notes = notes;
      await supabase.from('verifications').update(updateData).eq('company_id', companyId);
      await supabase.from('companies').update({ verification_status: status, verification_notes: notes }).eq('id', companyId);
    } catch (e) {
      console.error(e);
    }
  }
};
