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
  emirate?: Emirate;
  address?: string;
  industrialZone?: string;
  verificationStatus?: VerificationStatus;
  avatarUrl?: string;
  createdAt?: string;
}

export interface Category {
  id: string;
  vertical: 'Facility Management' | 'Construction' | 'Hygiene & Cleaning' | 'Safety & Tools';
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
  quantity: number;
  unit: 'm' | 'pcs' | 'sets' | 'coils' | 'tons' | 'sqm' | 'rolls' | 'boxes' | 'kg' | 'drums' | 'gallons' | 'cartons';
  notes?: string;
}

export interface RFQDocument {
  id: string;
  fileName: string;
  fileType: string;
  fileSizeBytes: number;
  fileUrl: string;
  documentCategory: 'boq' | 'drawing' | 'spec_sheet' | 'photo' | 'invoice' | 'other';
  uploadedAt: string;
}

export type RFQStatus = 
  | 'draft' 
  | 'published' 
  | 'receiving_quotes' 
  | 'evaluating' 
  | 'awarded' 
  | 'closed' 
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
  notes?: string;
  photoUploadUrl?: string;
  isQuickTemplate?: boolean;
  items: RFQItem[];
  documents: RFQDocument[];
  invitedCount: number;
  quotesCount: number;
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
  isAlternative: boolean;
  totalPriceAED: number;
  remarks?: string;
}

export type QuotationStatus = 'submitted' | 'under_review' | 'awarded' | 'declined' | 'expired';

export interface Quotation {
  id: string;
  quotationNumber: string;
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
  vatAED: number;
  deliveryChargeAED: number;
  grandTotalAED: number;
  leadTimeDays: number;
  leadTimeDisplay: string;
  warrantyPeriod: string;
  paymentTerms: string;
  validityDate: string;
  notes?: string;
  quotationPdfUrl?: string;
  status: QuotationStatus;
  items: QuotationItem[];
  submittedAt: string;
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
}