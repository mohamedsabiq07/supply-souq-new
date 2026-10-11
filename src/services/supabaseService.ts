import { supabase } from '../lib/supabase';
import { 
  RFQ, 
  Quotation, 
  PurchaseOrder, 
  Company, 
  Message, 
  VerificationRequest,
  UserProfile,
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
  adminStatus: row.admin_status || 'submitted_to_ops',
  assignedStaffId: row.assigned_staff_id || undefined,
  assignedStaffName: row.assigned_staff_name || undefined,
  clarificationRequest: row.clarification_request || undefined,
  internalOpsNotes: row.internal_ops_notes || undefined,
  supplierQuoteDeadline: row.supplier_quote_deadline || undefined,
  specialRequirements: row.special_requirements || undefined,
  publishedOffersCount: Number(row.published_offers_count) || 0,
  authorityApproval: row.authority_approval || 'DEWA Approved (Dubai Standard)',
  consultantName: row.consultant_name || '',
  offloadingRequired: Boolean(row.offloading_required),
  paymentTermsPreference: row.payment_terms_preference || 'PDC 30 Days Credit',
  notes: row.notes,
  photoUploadUrl: row.photo_upload_url,
  isQuickTemplate: row.is_quick_template,
  items: Array.isArray(row.items) ? row.items : [],
  documents: Array.isArray(row.documents) ? row.documents : [],
  quotesCount: Number(row.quotes_count) || 0,
  invitedCount: Number(row.invited_count) || 0,
  targetSupplierId: row.target_supplier_id,
  targetSupplierName: row.target_supplier_name,
  matchedSupplierCompanyIds: Array.isArray(row.matched_supplier_company_ids) ? row.matched_supplier_company_ids : [],
  matchedSupplierNames: Array.isArray(row.matched_supplier_names) ? row.matched_supplier_names : [],
  deadline24h: row.deadline_24h,
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
  admin_status: r.adminStatus || 'submitted_to_ops',
  assigned_staff_id: r.assignedStaffId || null,
  assigned_staff_name: r.assignedStaffName || null,
  clarification_request: r.clarificationRequest || null,
  internal_ops_notes: r.internalOpsNotes || null,
  supplier_quote_deadline: r.supplierQuoteDeadline || null,
  special_requirements: r.specialRequirements || null,
  published_offers_count: r.publishedOffersCount || 0,
  authority_approval: r.authorityApproval,
  consultant_name: r.consultantName,
  offloading_required: r.offloadingRequired,
  payment_terms_preference: r.paymentTermsPreference,
  notes: r.notes,
  photo_upload_url: r.photoUploadUrl,
  is_quick_template: r.isQuickTemplate,
  items: r.items,
  documents: r.documents,
  quotes_count: r.quotesCount,
  invited_count: r.invitedCount,
  target_supplier_id: r.targetSupplierId,
  target_supplier_name: r.targetSupplierName,
  matched_supplier_company_ids: r.matchedSupplierCompanyIds,
  matched_supplier_names: r.matchedSupplierNames,
  deadline_24h: r.deadline24h,
  created_at: r.createdAt,
  updated_at: r.updatedAt
});

export const mapQuotationFromDB = (row: any): Quotation => ({
  id: row.id,
  quotationNumber: row.quotation_number || ('QT-' + row.id.replace('quote-', '')),
  quoteReference: row.quote_reference || row.quotation_number,
  rfqId: row.rfq_id,
  rfqNumber: row.rfq_number,
  rfqTitle: row.rfq_title || '',
  buyerCompanyId: row.buyer_company_id,
  buyerCompanyName: row.buyer_company_name,
  supplierCompanyId: row.supplier_company_id,
  supplierCompanyName: row.supplier_company_name,
  supplierEmirate: row.supplier_emirate || 'Dubai',
  supplierZone: row.supplier_zone || '',
  supplierRating: Number(row.supplier_rating) || 5.0,
  supplierVerified: Boolean(row.supplier_verified),
  items: Array.isArray(row.items) ? row.items : [],
  subtotalAED: Number(row.subtotal_aed) || 0,
  discountAED: Number(row.discount_aed) || 0,
  vatTreatment: row.vat_treatment || 'standard_5_percent',
  vatAED: Number(row.vat_aed) || 0,
  deliveryChargeAED: Number(row.delivery_charge_aed) || 0,
  grandTotalAED: Number(row.total_amount_aed || row.grand_total_aed) || 0,
  stockAvailability: row.stock_availability || 'In Stock',
  leadTimeDays: Number(row.delivery_days || row.lead_time_days) || 3,
  leadTimeDisplay: row.lead_time_display || row.delivery_terms || '3 Business Days',
  warrantyPeriod: row.warranty_period || '1 Year Standard Manufacturer Warranty',
  paymentTerms: row.payment_terms || '30 Days Credit',
  validityDate: row.valid_until || row.validity_date || '2026-10-30',
  notes: row.notes,
  quotationPdfUrl: row.quotation_pdf_url,
  isPartialQuote: Boolean(row.is_partial_quote),
  quotedItemsCount: row.quoted_items_count ? Number(row.quoted_items_count) : undefined,
  totalRfqItemsCount: row.total_rfq_items_count ? Number(row.total_rfq_items_count) : undefined,
  technicalComplianceStatus: row.technical_compliance_status || 'pending_review',
  deviationNotes: row.deviation_notes || undefined,
  adminReviewStatus: row.admin_review_status || 'pending',
  manualUploadByAdmin: Boolean(row.manual_upload_by_admin),
  status: (row.status as any) || 'submitted',
  submittedAt: row.submitted_at || new Date().toISOString(),
  deliveryMethod: row.delivery_method || 'supplier_fleet',
  deliveryDetails: row.delivery_details || undefined,
  buyerRating: row.buyer_rating ? Number(row.buyer_rating) : undefined,
  buyerRatingFeedback: row.buyer_rating_feedback || undefined,
  buyerRatedAt: row.buyer_rated_at || undefined,
});

export const mapQuotationToDB = (q: Quotation) => ({
  id: q.id,
  quotation_number: q.quotationNumber,
  quote_reference: q.quoteReference || q.quotationNumber,
  rfq_id: q.rfqId,
  rfq_number: q.rfqNumber,
  rfq_title: q.rfqTitle,
  buyer_company_id: q.buyerCompanyId,
  buyer_company_name: q.buyerCompanyName,
  supplier_company_id: q.supplierCompanyId,
  supplier_company_name: q.supplierCompanyName,
  supplier_emirate: q.supplierEmirate,
  supplier_zone: q.supplierZone,
  supplier_rating: q.supplierRating,
  supplier_verified: q.supplierVerified,
  items: q.items,
  subtotal_aed: q.subtotalAED,
  discount_aed: q.discountAED || 0,
  vat_treatment: q.vatTreatment || 'standard_5_percent',
  vat_aed: q.vatAED,
  delivery_charge_aed: q.deliveryChargeAED || 0,
  total_amount_aed: q.grandTotalAED,
  grand_total_aed: q.grandTotalAED,
  stock_availability: q.stockAvailability || 'In Stock',
  delivery_days: q.leadTimeDays,
  lead_time_days: q.leadTimeDays,
  delivery_terms: q.leadTimeDisplay,
  lead_time_display: q.leadTimeDisplay,
  warranty_period: q.warrantyPeriod,
  payment_terms: q.paymentTerms,
  valid_until: q.validityDate,
  validity_date: q.validityDate,
  notes: q.notes,
  quotation_pdf_url: q.quotationPdfUrl || null,
  is_partial_quote: Boolean(q.isPartialQuote),
  quoted_items_count: q.quotedItemsCount || q.items.length,
  total_rfq_items_count: q.totalRfqItemsCount || q.items.length,
  technical_compliance_status: q.technicalComplianceStatus || 'pending_review',
  deviation_notes: q.deviationNotes || null,
  admin_review_status: q.adminReviewStatus || 'pending',
  manual_upload_by_admin: Boolean(q.manualUploadByAdmin),
  status: q.status,
  submitted_at: q.submittedAt,
  delivery_method: q.deliveryMethod || 'supplier_fleet',
  delivery_details: q.deliveryDetails || null,
  buyer_rating: q.buyerRating || null,
  buyer_rating_feedback: q.buyerRatingFeedback || null,
  buyer_rated_at: q.buyerRatedAt || null,
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

export const mapUserFromDB = (row: any): UserProfile => ({
  id: row.id,
  companyId: row.company_id,
  companyName: row.company_name,
  fullName: row.full_name,
  username: row.username,
  email: row.email,
  phone: row.phone,
  password: row.password,
  role: row.role as any,
  jobTitle: row.job_title || (row.role === 'buyer' ? 'Procurement Engineer' : 'Sales Representative'),
  tradeLicenseNumber: row.trade_license_number,
  tradeLicenseDocUrl: row.trade_license_doc_url,
  emirate: row.emirate || 'Dubai',
  address: row.address,
  industrialZone: row.industrial_zone,
  verificationStatus: row.verification_status || 'verified',
  avatarUrl: row.avatar_url,
  createdAt: row.created_at || new Date().toISOString()
});

export const mapUserToDB = (u: UserProfile) => ({
  id: u.id,
  company_id: u.companyId,
  company_name: u.companyName,
  full_name: u.fullName,
  username: u.username,
  email: u.email,
  phone: u.phone,
  password: u.password,
  role: u.role,
  job_title: u.jobTitle,
  trade_license_number: u.tradeLicenseNumber,
  trade_license_doc_url: u.tradeLicenseDocUrl,
  emirate: u.emirate,
  address: u.address,
  industrial_zone: u.industrialZone,
  verification_status: u.verificationStatus,
  avatar_url: u.avatarUrl,
  created_at: u.createdAt
});

// Database Operations
export const supabaseService = {
  // Fetch All
  async fetchAll() {
    try {
      const [companiesRes, rfqsRes, quotesRes, posRes, messagesRes, verificationsRes, usersRes] = await Promise.all([
        supabase.from('companies').select('*'),
        supabase.from('rfqs').select('*'),
        supabase.from('quotations').select('*'),
        supabase.from('purchase_orders').select('*'),
        supabase.from('messages').select('*'),
        supabase.from('verifications').select('*'),
        supabase.from('users').select('*')
      ]);

      return {
        companies: (companiesRes.data || []).map(mapCompanyFromDB),
        rfqs: (rfqsRes.data || []).map(mapRFQFromDB),
        quotations: (quotesRes.data || []).map(mapQuotationFromDB),
        purchaseOrders: (posRes.data || []).map(mapPOFromDB),
        messages: (messagesRes.data || []).map(mapMessageFromDB),
        verifications: (verificationsRes.data || []).map(mapVerificationFromDB),
        users: (usersRes.data || []).map(mapUserFromDB),
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

  // Insert or Upsert RFQ
  async createRFQ(rfq: RFQ) {
    try {
      const { data, error } = await supabase.from('rfqs').upsert([mapRFQToDB(rfq)]).select();
      if (error) console.error('Error creating RFQ in Supabase:', error);
      else console.log('Successfully persisted RFQ to Supabase:', rfq.id);
      return data;
    } catch (e) {
      console.error('Exception creating RFQ in Supabase:', e);
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

  // Insert or Upsert Quotation
  async submitQuotation(quote: Quotation) {
    try {
      const { data, error } = await supabase.from('quotations').upsert([mapQuotationToDB(quote)]).select();
      if (error) console.error('Error submitting quote in Supabase:', error);
      else console.log('Successfully persisted quotation to Supabase:', quote.id);
      return data;
    } catch (e) {
      console.error('Exception submitting quote in Supabase:', e);
    }
  },

  // Insert or Upsert Purchase Order
  async createPurchaseOrder(po: PurchaseOrder) {
    try {
      const { data, error } = await supabase.from('purchase_orders').upsert([mapPOToDB(po)]).select();
      if (error) console.error('Error creating PO in Supabase:', error);
      else console.log('Successfully persisted PO to Supabase:', po.id);
      return data;
    } catch (e) {
      console.error('Exception creating PO in Supabase:', e);
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

  // Insert or Upsert Message
  async sendMessage(msg: Message) {
    try {
      const { data, error } = await supabase.from('messages').upsert([mapMessageToDB(msg)]).select();
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
  },

  // Register New User & Company
  async registerUser(userData: {
    user: UserProfile;
    company: Company;
    verification?: VerificationRequest;
  }) {
    try {
      // 1. Insert Company
      await supabase.from('companies').upsert([mapCompanyToDB(userData.company)]);
      
      // 2. Insert User
      await supabase.from('users').upsert([mapUserToDB(userData.user)]);

      // 3. If supplier, insert Verification Request
      if (userData.verification) {
        await supabase.from('verifications').upsert([mapVerificationToDB(userData.verification)]);
      }

      return { success: true };
    } catch (e) {
      console.error('Failed to register user to Supabase:', e);
      return { success: false, error: e };
    }
  },

  // Fetch Users
  async fetchUsers(): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (error) throw error;
      return (data || []).map(mapUserFromDB);
    } catch (e) {
      console.error('Error fetching users from Supabase:', e);
      return [];
    }
  },

  // Find a user by username or email directly from Supabase
  async findUserByIdentifier(identifier: string): Promise<{ user: UserProfile; company?: Company } | null> {
    try {
      const clean = (identifier || '').trim().toLowerCase();
      if (!clean) return null;

      // Query Supabase for users matching email or username
      let { data, error } = await supabase
        .from('users')
        .select('*')
        .or(`email.ilike.${clean},username.ilike.${clean}`)
        .limit(1);

      // Fallback exact ilike queries if .or has parsing nuances
      if (!data || data.length === 0) {
        const byEmail = await supabase.from('users').select('*').ilike('email', clean).limit(1);
        if (byEmail.data && byEmail.data.length > 0) {
          data = byEmail.data;
        } else {
          const byUser = await supabase.from('users').select('*').ilike('username', clean).limit(1);
          if (byUser.data && byUser.data.length > 0) {
            data = byUser.data;
          }
        }
      }

      if (!data || data.length === 0) return null;

      const user = mapUserFromDB(data[0]);
      let company: Company | undefined;

      if (user.companyId) {
        const compRes = await supabase.from('companies').select('*').eq('id', user.companyId).limit(1);
        if (compRes.data && compRes.data.length > 0) {
          company = mapCompanyFromDB(compRes.data[0]);
        }
      }

      return { user, company };
    } catch (e) {
      console.error('Error finding user by identifier from Supabase:', e);
      return null;
    }
  },

  // Update Company Overall Rating & Review Count
  async updateCompanyRating(companyId: string, rating: number, reviewCount: number) {
    try {
      await supabase.from('companies').update({
        rating,
        review_count: reviewCount,
      }).eq('id', companyId);
    } catch (e) {
      console.error('Error updating company rating in Supabase:', e);
    }
  },

  // Update Quotation Rating
  async updateQuotationRating(quotationId: string, rating: number, feedback?: string) {
    try {
      await supabase.from('quotations').update({
        buyer_rating: rating,
        buyer_rating_feedback: feedback || null,
        buyer_rated_at: new Date().toISOString(),
      }).eq('id', quotationId);
    } catch (e) {
      console.error('Error updating quotation rating in Supabase:', e);
    }
  },

  // --- PROCURESOUQ V2 MANAGED PROCUREMENT PERSISTENCE ---
  async upsertRFQAdminDetails(rfq: RFQ) {
    try {
      await supabase.from('rfqs').upsert([mapRFQToDB(rfq)]);
    } catch (e) {
      console.error('Error upserting V2 RFQ admin details:', e);
    }
  },

  async upsertCommercialSettings(settings: any) {
    try {
      await supabase.from('commercial_settings').upsert([{
        id: settings.id || 'default',
        operating_model: settings.operatingModel,
        contracting_entity_name: settings.contractingEntityName,
        legal_entity_address: settings.legalEntityAddress,
        trn_number: settings.trnNumber,
        vat_rate_percent: settings.vatRatePercent,
        default_markup_type: settings.defaultMarkupType,
        default_markup_percent: settings.defaultMarkupPercent,
        default_service_fee_aed: settings.defaultServiceFeeAED,
        is_commercial_config_approved: settings.isCommercialConfigApproved,
        allow_binding_po_generation: settings.allowBindingPoGeneration,
        allow_binding_invoicing: settings.allowBindingInvoicing,
        disclose_supplier_identity_to_buyer: settings.discloseSupplierIdentityToBuyer,
        require_admin_po_approval: settings.requireAdminPoApproval,
        updated_at: new Date().toISOString(),
      }]);
    } catch (e) {
      console.error('Error upserting commercial_settings:', e);
    }
  },

  async upsertSupplierInvitation(inv: any) {
    try {
      await supabase.from('supplier_rfq_invitations').upsert([{
        id: inv.id,
        rfq_id: inv.rfqId,
        rfq_number: inv.rfqNumber,
        supplier_company_id: inv.supplierCompanyId,
        supplier_company_name: inv.supplierCompanyName,
        supplier_email: inv.supplierEmail || null,
        invitation_channel: inv.invitationChannel,
        status: inv.status,
        quotation_deadline: inv.quotationDeadline || null,
        invited_by: inv.invitedBy,
        responded_at: inv.respondedAt || null,
        notes: inv.notes || null,
        created_at: inv.createdAt,
      }]);
    } catch (e) {
      console.error('Error upserting supplier_rfq_invitations:', e);
    }
  },

  async upsertQuotationEvaluation(ev: any) {
    try {
      await supabase.from('quotation_evaluations').upsert([{
        id: ev.id,
        rfq_id: ev.rfqId,
        quotation_id: ev.quotationId,
        evaluator_name: ev.evaluatorName,
        technical_compliance: ev.technicalCompliance,
        brand_compatibility: ev.brandCompatibility,
        quantity_verified: ev.quantityVerified,
        availability_verified: ev.availabilityVerified,
        delivery_feasible: ev.deliveryFeasible,
        pricing_accurate: ev.pricingAccurate,
        supplier_reliability_score: ev.supplierReliabilityScore,
        has_deviation: ev.hasDeviation,
        deviation_notes: ev.deviationNotes || null,
        approved_for_comparison: ev.approvedForComparison,
        offer_slot_assigned: ev.offerSlotAssigned || null,
        evaluated_at: ev.evaluatedAt,
      }]);
    } catch (e) {
      console.error('Error upserting quotation_evaluations:', e);
    }
  },

  async upsertInternalCost(cost: any) {
    try {
      await supabase.from('internal_costs').upsert([{
        id: cost.id,
        rfq_id: cost.rfqId,
        quotation_id: cost.quotationId,
        customer_offer_id: cost.customerOfferId || null,
        supplier_cost_ex_vat_aed: cost.supplierCostExVatAED,
        freight_delivery_cost_aed: cost.freightDeliveryCostAED,
        other_procurement_cost_aed: cost.otherProcurementCostAED,
        other_cost_description: cost.otherCostDescription || null,
        markup_type: cost.markupType,
        markup_percent: cost.markupPercent,
        fixed_fee_aed: cost.fixedFeeAED,
        calculated_margin_aed: cost.calculatedMarginAED,
        customer_selling_price_before_vat_aed: cost.customerSellingPriceBeforeVatAED,
        vat_rate_percent: cost.vatRatePercent,
        customer_vat_aed: cost.customerVatAED,
        customer_landed_total_aed: cost.customerLandedTotalAED,
        gross_profit_aed: cost.grossProfitAED,
        gross_margin_percent: cost.grossMarginPercent,
        created_by: cost.createdBy,
        created_at: cost.createdAt,
        updated_at: cost.updatedAt,
      }]);
    } catch (e) {
      console.error('Error upserting internal_costs:', e);
    }
  },

  async upsertCustomerOffer(offer: any) {
    try {
      await supabase.from('customer_offers').upsert([{
        id: offer.id,
        offer_number: offer.offerNumber,
        offer_slot: offer.offerSlot,
        rfq_id: offer.rfqId,
        rfq_number: offer.rfqNumber,
        buyer_company_id: offer.buyerCompanyId,
        source_quotation_id: offer.sourceQuotationId,
        offer_label: offer.offerLabel,
        brand_offered: offer.brandOffered,
        technical_compliance: offer.technicalCompliance,
        has_deviation: offer.hasDeviation,
        deviation_warning: offer.deviationWarning || null,
        is_partial_offer: offer.isPartialOffer,
        quoted_items_count: offer.quotedItemsCount,
        total_rfq_items_count: offer.totalRfqItemsCount,
        items: offer.items,
        selling_subtotal_aed: offer.sellingSubtotalAED,
        delivery_fee_aed: offer.deliveryFeeAED,
        vat_aed: offer.vatAED,
        estimated_landed_total_aed: offer.estimatedLandedTotalAED,
        lead_time_days: offer.leadTimeDays,
        lead_time_display: offer.leadTimeDisplay,
        availability_status: offer.availabilityStatus,
        warranty_terms: offer.warrantyTerms,
        payment_terms: offer.paymentTerms,
        validity_date: offer.validityDate,
        rule_recommendations: offer.ruleRecommendations,
        disclosed_supplier_name: offer.disclosedSupplierName || null,
        status: offer.status,
        published_at: offer.publishedAt,
      }]);
    } catch (e) {
      console.error('Error upserting customer_offers:', e);
    }
  },

  async upsertCustomerPO(cpo: any) {
    try {
      await supabase.from('customer_purchase_orders').upsert([{
        id: cpo.id,
        cpo_number: cpo.cpoNumber,
        rfq_id: cpo.rfqId,
        rfq_number: cpo.rfqNumber,
        rfq_title: cpo.rfqTitle,
        customer_offer_id: cpo.customerOfferId,
        offer_number: cpo.offerNumber,
        buyer_company_id: cpo.buyerCompanyId,
        buyer_company_name: cpo.buyerCompanyName,
        buyer_contact_name: cpo.buyerContactName,
        buyer_phone: cpo.buyerPhone,
        contracting_entity_name: cpo.contractingEntityName,
        ordering_method: cpo.orderingMethod,
        customer_po_reference: cpo.customerPoReference || null,
        uploaded_po_url: cpo.uploadedPoUrl || null,
        uploaded_po_file_name: cpo.uploadedPoFileName || null,
        items: cpo.items,
        selling_subtotal_aed: cpo.sellingSubtotalAED,
        delivery_fee_aed: cpo.deliveryFeeAED,
        vat_aed: cpo.vatAED,
        total_payable_aed: cpo.totalPayableAED,
        payment_terms: cpo.paymentTerms,
        delivery_address: cpo.deliveryAddress,
        delivery_emirate: cpo.deliveryEmirate,
        estimated_delivery_date: cpo.estimatedDeliveryDate,
        terms_accepted: cpo.termsAccepted,
        terms_accepted_at: cpo.termsAcceptedAt,
        commercial_approval_status: cpo.commercialApprovalStatus,
        is_legally_binding: cpo.isLegallyBinding,
        order_status: cpo.orderStatus,
        cancellation_reason: cpo.cancellationReason || null,
        notes: cpo.notes || null,
        created_at: cpo.createdAt,
        updated_at: cpo.updatedAt,
      }]);
    } catch (e) {
      console.error('Error upserting customer_purchase_orders:', e);
    }
  },

  async upsertSupplierPO(spo: any) {
    try {
      await supabase.from('supplier_purchase_orders').upsert([{
        id: spo.id,
        spo_number: spo.spoNumber,
        cpo_id: spo.cpoId,
        cpo_number: spo.cpoNumber,
        rfq_id: spo.rfqId,
        rfq_number: spo.rfqNumber,
        source_quotation_id: spo.sourceQuotationId,
        supplier_company_id: spo.supplierCompanyId,
        supplier_company_name: spo.supplierCompanyName,
        supplier_phone: spo.supplierPhone,
        items: spo.items,
        supplier_subtotal_aed: spo.supplierSubtotalAED,
        freight_cost_aed: spo.freightCostAED,
        vat_aed: spo.vatAED,
        supplier_total_aed: spo.supplierTotalAED,
        payment_terms: spo.paymentTerms,
        fulfilment_mode: spo.fulfilmentMode,
        delivery_destination: spo.deliveryDestination,
        expected_dispatch_date: spo.expectedDispatchDate,
        supplier_confirmation_status: spo.supplierConfirmationStatus,
        supplier_confirmed_at: spo.supplierConfirmedAt || null,
        status: spo.status,
        internal_notes: spo.internalNotes || null,
        created_at: spo.createdAt,
        updated_at: spo.updatedAt,
      }]);
    } catch (e) {
      console.error('Error upserting supplier_purchase_orders:', e);
    }
  },

  async upsertFulfilment(ful: any) {
    try {
      await supabase.from('order_fulfilments').upsert([{
        id: ful.id,
        cpo_id: ful.cpoId,
        cpo_number: ful.cpoNumber,
        spo_id: ful.spoId || null,
        spo_number: ful.spoNumber || null,
        rfq_id: ful.rfqId,
        buyer_company_id: ful.buyerCompanyId,
        supplier_company_id: ful.supplierCompanyId || null,
        fulfilment_mode: ful.fulfilmentMode,
        current_stage: ful.currentStage,
        stage_timestamps: ful.stageTimestamps,
        logistics_provider: ful.logisticsProvider || null,
        delivery_contact_name: ful.deliveryContactName || null,
        delivery_contact_phone: ful.deliveryContactPhone || null,
        tracking_reference: ful.trackingReference || null,
        delivery_address: ful.deliveryAddress,
        is_partial_delivery: ful.isPartialDelivery,
        delivered_items_summary: ful.deliveredItemsSummary || null,
        has_delivery_issue: ful.hasDeliveryIssue,
        delivery_issue_notes: ful.deliveryIssueNotes || null,
        customer_acknowledged: ful.customerAcknowledged,
        customer_acknowledged_at: ful.customerAcknowledgedAt || null,
        customer_acknowledgement_notes: ful.customerAcknowledgementNotes || null,
        created_at: ful.createdAt,
        updated_at: ful.updatedAt,
      }]);
    } catch (e) {
      console.error('Error upserting order_fulfilments:', e);
    }
  },

  async upsertDeliveryRecord(del: any) {
    try {
      await supabase.from('delivery_records').upsert([{
        id: del.id,
        fulfilment_id: del.fulfilmentId,
        cpo_id: del.cpoId,
        cpo_number: del.cpoNumber,
        delivery_number: del.deliveryNumber,
        fulfilment_mode: del.fulfilmentMode,
        status: del.status,
        logistics_provider: del.logisticsProvider || null,
        driver_or_contact_name: del.driverOrContactName || null,
        contact_phone: del.contactPhone || null,
        tracking_reference: del.trackingReference || null,
        delivery_note_ref: del.deliveryNoteRef || null,
        is_partial: del.isPartial,
        items_delivered_summary: del.itemsDeliveredSummary,
        dispatched_at: del.dispatchedAt || null,
        delivered_at: del.deliveredAt || null,
        customer_acknowledged: del.customerAcknowledged,
        issue_reported: del.issueReported || null,
        notes: del.notes || null,
        created_at: del.createdAt,
      }]);
    } catch (e) {
      console.error('Error upserting delivery_records:', e);
    }
  },

  async upsertDeliveryDocument(doc: any) {
    try {
      await supabase.from('delivery_documents').upsert([{
        id: doc.id,
        cpo_id: doc.cpoId,
        spo_id: doc.spoId || null,
        delivery_record_id: doc.deliveryRecordId || null,
        document_type: doc.documentType,
        document_number: doc.documentNumber,
        file_name: doc.fileName,
        file_url: doc.fileUrl,
        uploaded_by_role: doc.uploadedByRole,
        uploaded_by_name: doc.uploadedByName,
        visible_to_buyer: doc.visibleToBuyer,
        created_at: doc.createdAt,
      }]);
    } catch (e) {
      console.error('Error upserting delivery_documents:', e);
    }
  },

  async insertApprovalHistory(rec: any) {
    try {
      await supabase.from('approval_history').upsert([{
        id: rec.id,
        entity_type: rec.entityType,
        entity_id: rec.entityId,
        action: rec.action,
        approved_by: rec.approvedBy,
        role: rec.role,
        previous_state: rec.previousState || null,
        new_state: rec.newState || null,
        notes: rec.notes || null,
        created_at: rec.createdAt,
      }]);
    } catch (e) {
      console.error('Error inserting approval_history:', e);
    }
  },
};

