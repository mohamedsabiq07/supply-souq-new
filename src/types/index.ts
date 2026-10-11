export type UserRole = 'buyer' | 'supplier' | 'admin';

export type Emirate = 
  | 'Dubai' 
  | 'Sharjah' 
  | 'Ajman';

export type IndustrialZone = 
  | 'Al Quoz Industrial Area'
  | 'Sharjah Industrial Area 1-18'
  | 'Rolla / Sabkha Market'
  | 'Ras Al Khor Industrial Area'
  | 'Jebel Ali Free Zone (JAFZA)'
  | 'Dubai Industrial City (DIC)'
  | 'Ajman Industrial Area 1 & 2'
  | 'Al Jurf Industrial, Ajman';

export type VerificationStatus = 'verified' | 'pending' | 'rejected' | 'suspended';

export interface Company {
  id: string;
  name: string;
  legalName: string;
  tradeLicenseNumber: string;
  tradeLicenseDocUrl?: string;
  companyType: 'buyer' | 'supplier' | 'both';
  emirate: Emirate;
  industrialZone: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  categories: string[];
  serviceEmirates: Emirate[];
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  rating: number;
  reviewCount: number;
  responseRatePercent: number;
  averageResponseHours: number;
  yearsInBusiness: number;
  badge?: 'Top Rated' | 'Fast Responder' | 'Verified Trader' | 'Premium Partner';
  logoUrl?: string;
  tradeLicenseExpiryDate?: string;
  licenseActivities?: string[];
  trnNumber?: string;
  creditRiskTier?: 'low' | 'moderate' | 'high_risk';
  creditLimitAED?: number;
  paymentRestriction?: 'standard' | 'upfront_cod_only';
  isSuspended?: boolean;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  companyId: string;
  companyName: string;
  fullName: string;
  username?: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  jobTitle: string;
  tradeLicenseNumber?: string;
  tradeLicenseDocUrl?: string;
  tradeLicenseExpiryDate?: string;
  emirate?: Emirate;
  address?: string;
  industrialZone?: string;
  verificationStatus?: VerificationStatus;
  isSuspended?: boolean;
  avatarUrl?: string;
  createdAt?: string;
}

export interface Category {
  id: string;
  vertical: 'Power & Cables' | 'Switchgear & DBs' | 'Containment & Conduits' | 'Lighting & Controls' | 'Earthing & Lightning' | 'Power Equipment';
  name: string;
  slug: string;
  description: string;
  icon: string;
  itemCount: number;
  subcategories: string[];
  isBeachhead?: boolean;
}

export interface QuickBundle {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  badge: string;
  estimatedTotalAED: number;
  items: Array<{
    description: string;
    specification: string;
    preferredBrand?: string;
    quantity: number;
    unit: 'm' | 'pcs' | 'sets' | 'coils' | 'tons' | 'sqm' | 'rolls' | 'boxes' | 'kg' | 'drums' | 'gallons' | 'cartons';
  }>;
}

export interface RFQItem {
  id: string;
  itemNumber: number;
  description: string;
  specification: string;
  preferredBrand?: string;
  preferredBrands?: string[];
  allowAlternatives?: boolean;
  quantity: number;
  unit: 'm' | 'pcs' | 'sets' | 'coils' | 'tons' | 'sqm' | 'rolls' | 'boxes' | 'kg' | 'drums' | 'gallons' | 'cartons' | 'lengths';
  notes?: string;
}

export interface RFQDocument {
  id: string;
  fileName: string;
  fileType: string;
  fileSizeBytes: number;
  fileUrl: string;
  documentCategory: 'boq' | 'pdf_quotation_request' | 'technical_spec' | 'drawing' | 'spec_sheet' | 'photo' | 'invoice' | 'other';
  uploadedAt: string;
}

export type RFQStatus = 
  | 'draft' 
  | 'submitted_to_ops'
  | 'under_admin_review'
  | 'clarification_requested'
  | 'sourcing_suppliers'
  | 'published' 
  | 'receiving_quotes' 
  | 'evaluating' 
  | 'offers_published'
  | 'customer_po_issued'
  | 'awarded' 
  | 'closed' 
  | 'cancelled';

export type AdminRFQStatus =
  | 'submitted_to_ops'
  | 'under_review'
  | 'clarification_needed'
  | 'clarification_requested'
  | 'sourcing_suppliers'
  | 'receiving_quotes'
  | 'evaluating_quotes'
  | 'offers_published'
  | 'customer_po_submitted'
  | 'order_placed'
  | 'completed'
  | 'cancelled';

export interface RFQ {
  id: string;
  rfqNumber: string;
  buyerCompanyId: string;
  buyerCompanyName: string;
  buyerContactName: string;
  buyerPhone: string;
  buyerEmail: string;
  title: string;
  projectName: string;
  projectLocation: string;
  deliveryEmirate: Emirate;
  deliveryAddress: string;
  category: string;
  requiredDeliveryDate: string;
  closingDate: string;
  priority: 'low' | 'normal' | 'urgent';
  targetSupplierScope: 'all_verified' | 'local_emirate_only' | 'preferred_only';
  status: RFQStatus;
  adminStatus?: AdminRFQStatus;
  assignedStaffId?: string;
  assignedStaffName?: string;
  clarificationRequest?: string;
  internalOpsNotes?: string;
  supplierQuoteDeadline?: string;
  specialRequirements?: string;
  publishedOffersCount?: number;
  authorityApproval?: string;
  consultantName?: string;
  offloadingRequired?: boolean;
  paymentTermsPreference?: string;
  notes?: string;
  photoUploadUrl?: string;
  isQuickTemplate?: boolean;
  items: RFQItem[];
  documents: RFQDocument[];
  invitedCount: number;
  quotesCount: number;
  targetSupplierId?: string;
  targetSupplierName?: string;
  matchedSupplierCompanyIds?: string[];
  matchedSupplierNames?: string[];
  deadline24h?: string;
  awardedQuotationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuotationItem {
  id: string;
  rfqItemId: string;
  itemDescription: string;
  quantity: number;
  unit: string;
  unitPriceAED: number;
  offeredBrand: string;
  offeredSpecification?: string;
  isQuoted?: boolean;
  isAlternative: boolean;
  stockStatus?: 'In Stock' | 'Partial Stock' | 'Backorder / Factory Lead' | 'Not Quoted';
  leadTimeDays?: number;
  totalPriceAED: number;
  remarks?: string;
}

export type QuotationStatus = 'submitted' | 'under_review' | 'shortlisted' | 'approved_for_comparison' | 'rejected_by_admin' | 'awarded' | 'declined' | 'expired';

export interface Quotation {
  id: string;
  quotationNumber: string;
  quoteReference?: string;
  rfqId: string;
  rfqNumber: string;
  rfqTitle: string;
  buyerCompanyId?: string;
  buyerCompanyName?: string;
  supplierCompanyId: string;
  supplierCompanyName: string;
  supplierEmirate: Emirate;
  supplierZone: string;
  supplierRating: number;
  supplierVerified: boolean;
  subtotalAED: number;
  discountAED: number;
  vatTreatment?: 'standard_5_percent' | 'zero_rated' | 'exempt';
  vatAED: number;
  deliveryChargeAED: number;
  grandTotalAED: number;
  stockAvailability?: string;
  leadTimeDays: number;
  leadTimeDisplay: string;
  warrantyPeriod: string;
  paymentTerms: string;
  validityDate: string;
  notes?: string;
  quotationPdfUrl?: string;
  isPartialQuote?: boolean;
  quotedItemsCount?: number;
  totalRfqItemsCount?: number;
  technicalComplianceStatus?: 'pending_review' | 'compliant' | 'minor_deviation' | 'non_compliant';
  deviationNotes?: string;
  adminReviewStatus?: 'pending' | 'under_review' | 'shortlisted' | 'approved_for_comparison' | 'rejected';
  manualUploadByAdmin?: boolean;
  deliveryMethod?: 'supplier_fleet' | 'supplysouq_managed';
  deliveryDetails?: {
    pickupZone: string;
    deliveryAddress: string;
    estimatedDistanceKm: number;
    vehicleType: string;
    spotDeliveryFeeAED: number;
  };
  status: QuotationStatus;
  items: QuotationItem[];
  submittedAt: string;
  buyerRating?: number;
  buyerRatingFeedback?: string;
  buyerRatedAt?: string;
}

export type OrderStatus = 
  | 'po_created' 
  | 'accepted' 
  | 'processing' 
  | 'dispatched' 
  | 'delivered' 
  | 'completed' 
  | 'cancelled';

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  rfqId: string;
  rfqNumber: string;
  rfqTitle: string;
  quotationId: string;
  quotationNumber: string;
  buyerCompanyId: string;
  buyerCompanyName: string;
  buyerContactName: string;
  buyerPhone: string;
  supplierCompanyId: string;
  supplierCompanyName: string;
  supplierPhone: string;
  items: QuotationItem[];
  subtotalAED: number;
  vatAED: number;
  deliveryChargeAED: number;
  totalAmountAED: number;
  status: OrderStatus;
  deliveryAddress: string;
  deliveryEmirate: Emirate;
  paymentTerms: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  trackingNotes?: string;
  reviewedByBuyer: boolean;
  commissionRatePercent?: number;
  commissionAmountAED?: number;
  commissionStatus?: 'pending' | 'invoiced' | 'collected' | 'overdue';
  taxInvoiceNumber?: string;
  taxInvoiceIssuedAt?: string;
  paymentMethodType?: 'bank_transfer' | 'pdc_cheque' | 'credit_card' | 'escrow';
  pdcMaturityDate?: string;
  pdcBankName?: string;
  payoutStatus?: 'held_in_escrow' | 'released_to_supplier' | 'disputed';
  podUrl?: string;
  podStatus?: 'pending' | 'approved' | 'rejected';
  deliveryMethod?: 'supplier_fleet' | 'supplysouq_managed';
  assignedVehicleType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  rfqId: string;
  rfqNumber: string;
  purchaseOrderId?: string;
  senderId: string;
  senderName: string;
  senderCompanyId: string;
  senderCompanyName: string;
  senderRole: UserRole;
  recipientCompanyId: string;
  recipientCompanyName: string;
  messageText: string;
  voiceNoteUrl?: string;
  voiceDurationSeconds?: number;
  attachmentUrl?: string;
  createdAt: string;
  isRead: boolean;
}

export interface Review {
  id: string;
  purchaseOrderId: string;
  poNumber: string;
  buyerCompanyId: string;
  buyerCompanyName: string;
  supplierCompanyId: string;
  supplierCompanyName: string;
  rating: number;
  deliverySpeedRating: number;
  materialQualityRating: number;
  comment: string;
  createdAt: string;
}

export interface VerificationRequest {
  id: string;
  companyId: string;
  companyName: string;
  tradeLicenseNumber: string;
  emirate: Emirate;
  industrialZone: string;
  docUrl: string;
  submittedAt: string;
  status: VerificationStatus;
  notes?: string;
  tradeLicenseExpiryDate?: string;
  licenseActivities?: string[];
  creditRiskTier?: 'low' | 'moderate' | 'high_risk';
}

export interface DeclineRFQRecord {
  id: string;
  rfqId: string;
  rfqNumber: string;
  supplierCompanyId: string;
  supplierCompanyName: string;
  reason: string;
  notes?: string;
  declinedAt: string;
}

export interface DisputeRecord {
  id: string;
  purchaseOrderId: string;
  poNumber: string;
  rfqNumber: string;
  buyerCompanyName: string;
  supplierCompanyName: string;
  issueType: 'spec_mismatch' | 'damaged_goods' | 'delayed_site_access' | 'missing_items' | 'other';
  description: string;
  disputedAmountAED: number;
  status: 'open' | 'under_investigation' | 'resolved_credit_note' | 'resolved_replacement' | 'refunded';
  createdAt: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  operatorName: string;
  action: string;
  targetType: 'rfq' | 'quote' | 'user' | 'order' | 'verification' | 'dispute' | 'security';
  targetId: string;
  details: string;
  severity: 'info' | 'warning' | 'critical';
}

export type AdminRole = 'super_admin' | 'procurement_ops' | 'verification_officer' | 'finance_officer';

export type TelemetrySource = 'admin_manual' | 'dynamic_platform' | 'financial_feed';
export type TelemetryCategory = 'metal' | 'building' | 'sla' | 'platform' | 'energy' | 'electrical';

export interface TelemetryItem {
  id: string;
  label: string;
  value: string;
  change: string; // e.g. "+1.18%", "-0.5%", "STABLE", "ACTIVE"
  isPositive: boolean;
  category: TelemetryCategory;
  source: TelemetrySource;
  isActive: boolean;
  lastUpdated?: string;
  basePrice?: number;
  currency?: string;
  unit?: string;
}

// ============================================================================
// PROCURESOUQ V2 — MANAGED B2B PROCUREMENT PLATFORM INTERFACES
// ============================================================================

export type OperatingCommercialModel = 'managed_intermediary' | 'principal_reseller' | 'introductory_agent';

export interface CommercialSettings {
  id: string;
  operatingModel: OperatingCommercialModel;
  contractingEntityName: string;
  legalEntityAddress: string;
  trnNumber: string;
  vatRatePercent: number;
  defaultMarkupType: 'percentage' | 'fixed_fee' | 'hybrid';
  defaultMarkupPercent: number;
  defaultServiceFeeAED: number;
  isCommercialConfigApproved: boolean;
  allowBindingPoGeneration: boolean;
  allowBindingInvoicing: boolean;
  discloseSupplierIdentityToBuyer: boolean;
  requireAdminPoApproval: boolean;
  approvedBy?: string;
  approvedAt?: string;
  updatedAt: string;
}

export interface SupplierRFQInvitation {
  id: string;
  rfqId: string;
  rfqNumber: string;
  supplierCompanyId: string;
  supplierCompanyName: string;
  supplierEmail?: string;
  invitationChannel: 'portal' | 'email' | 'pdf_manual' | 'whatsapp' | 'whatsapp_future' | 'manual_admin';
  status: 'invited' | 'viewed' | 'quoted' | 'declined' | 'expired';
  quotationDeadline: string;
  invitedBy: string;
  notes?: string;
  respondedAt?: string;
  createdAt: string;
}

export interface QuotationEvaluation {
  id: string;
  rfqId: string;
  quotationId: string;
  evaluatorName: string;
  technicalCompliance: 'compliant' | 'minor_deviation' | 'non_compliant';
  brandCompatibility: 'exact_match' | 'approved_equivalent' | 'alternative_proposed' | 'mismatch';
  quantityVerified: boolean;
  availabilityVerified: boolean;
  deliveryFeasible: boolean;
  pricingAccurate: boolean;
  supplierReliabilityScore: number;
  hasDeviation: boolean;
  deviationNotes?: string;
  approvedForComparison: boolean;
  offerSlotAssigned?: number;
  evaluatedAt: string;
}

export interface PricingRule {
  id: string;
  ruleName: string;
  category: string;
  markupType: 'percentage' | 'fixed_fee' | 'hybrid';
  markupPercent: number;
  fixedServiceFeeAED: number;
  vatRatePercent: number;
  isActive: boolean;
  updatedAt: string;
}

export interface InternalCostBreakdown {
  id: string;
  rfqId: string;
  quotationId: string;
  customerOfferId?: string;
  supplierCostExVatAED: number;
  freightDeliveryCostAED: number;
  otherProcurementCostAED: number;
  otherCostDescription?: string;
  markupType: 'percentage' | 'fixed_fee' | 'hybrid';
  markupPercent: number;
  fixedFeeAED: number;
  calculatedMarginAED: number;
  overrideSellingPriceAED?: number;
  overrideApprovedBy?: string;
  overrideReason?: string;
  customerSellingPriceBeforeVatAED: number;
  vatRatePercent: number;
  customerVatAED: number;
  customerLandedTotalAED: number;
  grossProfitAED: number;
  grossMarginPercent: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerOfferItem {
  id: string;
  customerOfferId: string;
  rfqItemId: string;
  itemNumber: number;
  description: string;
  offeredBrand: string;
  specificationCompliance: 'Compliant' | 'Minor Deviation' | 'Alternative' | 'Not Quoted';
  isIncluded: boolean;
  isAlternative: boolean;
  quantity: number;
  unit: string;
  customerUnitPriceAED: number;
  customerLineTotalAED: number;
  availability: string;
  leadTimeDays: number;
  deviationNote?: string;
}

export type RuleRecommendationBadge =
  | 'Lowest Price'
  | 'Fastest Delivery'
  | 'Best Technical Match'
  | 'Best Overall Value';

export interface CustomerOffer {
  id: string;
  offerNumber: string; // e.g., PS-OFFER-2026-001
  offerSlot: number; // 1 to 5
  rfqId: string;
  rfqNumber: string;
  buyerCompanyId: string;
  sourceQuotationId: string; // Internal reference
  offerLabel: string; // e.g., "Offer 1"
  brandOffered: string;
  technicalCompliance: '100% Compliant to BOQ' | 'Minor Specification Deviation' | 'Approved Equivalent' | 'Partial Coverage';
  hasDeviation: boolean;
  deviationWarning?: string;
  isPartialOffer: boolean;
  quotedItemsCount: number;
  totalRfqItemsCount: number;
  items: CustomerOfferItem[];
  sellingSubtotalAED: number;
  deliveryFeeAED: number;
  vatAED: number;
  estimatedLandedTotalAED: number;
  leadTimeDays: number;
  leadTimeDisplay: string;
  availabilityStatus: string;
  warrantyTerms: string;
  paymentTerms: string;
  validityDate: string;
  ruleRecommendations: RuleRecommendationBadge[];
  disclosedSupplierName?: string; // Only populated if Admin explicitly enables disclosure
  status: 'published' | 'selected' | 'expired' | 'withdrawn';
  publishedAt: string;
}

export type FulfilmentMode = 'procuresouq_arranged' | 'supplier_direct_coordinated';

export type FulfilmentStage =
  | 'order_confirmed'
  | 'procurement_processing'
  | 'supplier_confirmed'
  | 'ready_for_dispatch'
  | 'in_transit'
  | 'delivered';

export interface CustomerPurchaseOrder {
  id: string;
  cpoNumber: string; // e.g., PS-CPO-2026-0001
  rfqId: string;
  rfqNumber: string;
  rfqTitle: string;
  customerOfferId: string;
  offerNumber: string;
  buyerCompanyId: string;
  buyerCompanyName: string;
  buyerContactName: string;
  buyerPhone: string;
  contractingEntityName: string;
  orderingMethod: 'uploaded_po' | 'platform_generated' | 'platform_generated_po';
  customerPoReference?: string;
  uploadedPoUrl?: string;
  uploadedPoFileName?: string;
  items: CustomerOfferItem[];
  sellingSubtotalAED: number;
  deliveryFeeAED: number;
  vatAED: number;
  totalPayableAED: number;
  paymentTerms: string;
  deliveryAddress: string;
  deliveryEmirate: Emirate;
  estimatedDeliveryDate: string;
  termsAccepted: boolean;
  termsAcceptedAt: string;
  commercialApprovalStatus: 'pending_admin_approval' | 'approved' | 'provisional_only' | 'rejected';
  isLegallyBinding: boolean;
  orderStatus: FulfilmentStage | 'confirmed' | 'awaiting_admin_approval' | 'in_fulfilment' | 'cancellation_requested' | 'completed' | 'cancelled';
  cancellationRequested?: boolean;
  cancellationReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierPurchaseOrder {
  id: string;
  spoNumber: string; // e.g., PS-SPO-2026-0001
  cpoId: string;
  cpoNumber: string;
  rfqId: string;
  rfqNumber: string;
  sourceQuotationId: string;
  supplierCompanyId: string;
  supplierCompanyName: string;
  supplierPhone?: string;
  items: QuotationItem[];
  supplierSubtotalAED: number;
  freightCostAED: number;
  vatAED: number;
  supplierTotalAED: number;
  paymentTerms: string;
  fulfilmentMode: FulfilmentMode;
  deliveryDestination: string;
  expectedDispatchDate: string;
  supplierConfirmationStatus: 'pending_confirmation' | 'confirmed' | 'rejected_or_cancelled' | 'rejected_or_delayed';
  supplierConfirmedAt?: string;
  status: 'draft' | 'issued_to_supplier' | 'supplier_confirmed' | 'processing' | 'ready_for_dispatch' | 'dispatched' | 'delivered' | 'cancelled';
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryDocument {
  id: string;
  cpoId: string;
  spoId?: string;
  deliveryRecordId?: string;
  documentType: 'delivery_note' | 'proof_of_delivery' | 'customer_po' | 'supplier_po' | 'packing_list' | 'test_certificate';
  documentNumber: string;
  fileName: string;
  fileUrl: string;
  uploadedByRole: UserRole;
  uploadedByName: string;
  visibleToBuyer: boolean;
  createdAt: string;
}

export interface DeliveryRecord {
  id: string;
  fulfilmentId: string;
  cpoId: string;
  cpoNumber: string;
  deliveryNumber: string;
  fulfilmentMode: FulfilmentMode;
  status: 'scheduled' | 'ready_for_dispatch' | 'in_transit' | 'partially_delivered' | 'delivered' | 'delayed' | 'issue_reported';
  logisticsProvider: string;
  driverOrContactName: string;
  contactPhone: string;
  trackingReference: string;
  deliveryNoteRef: string;
  isPartial: boolean;
  itemsDeliveredSummary: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  customerAcknowledged: boolean;
  issueReported?: string;
  notes?: string;
  createdAt: string;
}

export interface OrderFulfilment {
  id: string;
  cpoId: string;
  cpoNumber: string;
  spoId?: string;
  spoNumber?: string;
  rfqId: string;
  buyerCompanyId: string;
  supplierCompanyId?: string;
  fulfilmentMode: FulfilmentMode;
  currentStage: FulfilmentStage;
  stageTimestamps: Partial<Record<FulfilmentStage, string>>;
  logisticsProvider?: string;
  deliveryContactName?: string;
  deliveryContactPhone?: string;
  trackingReference?: string;
  deliveryAddress: string;
  isPartialDelivery: boolean;
  deliveredItemsSummary?: string;
  hasDeliveryIssue: boolean;
  deliveryIssueDetails?: string;
  deliveryIssueNotes?: string;
  customerAcknowledged: boolean;
  customerAcknowledgedAt?: string;
  customerAcknowledgementNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalHistoryRecord {
  id: string;
  entityType: 'commercial_settings' | 'rfq' | 'quotation' | 'supplier_quote' | 'pricing_override' | 'customer_offer' | 'customer_po' | 'supplier_po';
  entityId: string;
  action: string;
  approvedBy: string;
  role: UserRole;
  previousState?: string;
  newState?: string;
  notes?: string;
  createdAt: string;
}

export interface PlatformNotification {
  id: string;
  recipientRole: UserRole;
  recipientCompanyId?: string;
  title: string;
  message: string;
  category: 'rfq' | 'quote' | 'offer' | 'order' | 'delivery' | 'system';
  relatedEntityId?: string;
  targetView?: string;
  isRead: boolean;
  createdAt: string;
}