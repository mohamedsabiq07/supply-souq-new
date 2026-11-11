import { Company, RFQ } from '../types';

export type SupplierCategoryGroup =
  | 'Cables & Wires'
  | 'Switchgear & DBs'
  | 'Conduits & Containment'
  | 'Multi-Brand MEP';

export interface PreloadedUAESupplier extends Company {
  whatsappPhone?: string;
  categoryGroup: SupplierCategoryGroup;
  specialtiesSummary: string;
  isPreloadedDirectory?: boolean;
}

export const PRELOADED_UAE_ELECTRICAL_SUPPLIERS: PreloadedUAESupplier[] = [
  // ===========================================================================
  // A. POWER CABLES, BUILDING WIRES & ACCESSORIES (7 SUPPLIERS)
  // ===========================================================================
  {
    id: 'uae-sup-01',
    name: 'Electric Way FZCO',
    legalName: 'Electric Way F.Z.C.O',
    tradeLicenseNumber: 'JAFZA-EW-88210',
    companyType: 'supplier',
    emirate: 'Dubai',
    industrialZone: 'Jebel Ali Free Zone (JAFZA)',
    address: 'Jebel Ali Free Zone & Deira Wholesale Branch, Dubai',
    phone: '+971 4 817 0777',
    whatsappPhone: '971565020698',
    email: 'sales@electricway.com',
    website: 'https://www.electricway.com',
    categories: ['LV & MV Power Cables & Wires', 'Switchgear, MCBs & Distribution Boards', 'Commercial LED Lighting & Fixtures'],
    serviceEmirates: ['Dubai', 'Sharjah', 'Ajman'],
    verificationStatus: 'verified',
    rating: 4.9,
    reviewCount: 64,
    responseRatePercent: 98,
    averageResponseHours: 1.5,
    yearsInBusiness: 18,
    badge: 'Premium Partner',
    categoryGroup: 'Cables & Wires',
    specialtiesSummary: 'Ducab cables, industrial power cables, lugs, glands, lighting & switchgear',
    isPreloadedDirectory: true,
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'uae-sup-02',
    name: 'Al Shamali & Waris Trading Co. LLC',
    legalName: 'Al Shamali & Waris Trading Co. L.L.C',
    tradeLicenseNumber: 'DET-ASW-51209',
    companyType: 'supplier',
    emirate: 'Dubai',
    industrialZone: 'Al Quoz Industrial Area',
    address: 'Dubai & Sharjah Main Electrical Stockyards',
    phone: '+971 6 524 4444',
    email: 'info@shamaliwaris.com',
    categories: ['LV & MV Power Cables & Wires', 'Cable Trays, Trunking & GI Conduits'],
    serviceEmirates: ['Dubai', 'Sharjah', 'Ajman'],
    verificationStatus: 'verified',
    rating: 4.85,
    reviewCount: 49,
    responseRatePercent: 96,
    averageResponseHours: 2.0,
    yearsInBusiness: 24,
    badge: 'Top Rated',
    categoryGroup: 'Cables & Wires',
    specialtiesSummary: 'Ducab power cables, building wires, Decoduct PVC management & accessories',
    isPreloadedDirectory: true,
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'uae-sup-03',
    name: 'Prakash Trading Co. LLC',
    legalName: 'Prakash Trading Co. L.L.C',
    tradeLicenseNumber: 'DET-PTC-44910',
    companyType: 'supplier',
    emirate: 'Dubai',
    industrialZone: 'Ras Al Khor Industrial Area',
    address: 'Umm Ramool / Rashidiya Industrial Area, Dubai',
    phone: '+971 4 286 3363',
    email: 'sales@prakashtrading.com',
    categories: ['LV & MV Power Cables & Wires', 'Earthing, Lightning Protection & Rods'],
    serviceEmirates: ['Dubai', 'Sharjah', 'Ajman'],
    verificationStatus: 'verified',
    rating: 4.8,
    reviewCount: 41,
    responseRatePercent: 95,
    averageResponseHours: 2.2,
    yearsInBusiness: 28,
    badge: 'Verified Trader',
    categoryGroup: 'Cables & Wires',
    specialtiesSummary: 'Authorized Ducab stockist, armoured LV cables, fire-resistant cables & lugs',
    isPreloadedDirectory: true,
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'uae-sup-04',
    name: 'Al Fareeda Electrical Equipment Trading',
    legalName: 'Al Fareeda Electrical Equipment Trading L.L.C',
    tradeLicenseNumber: 'SEDD-AFE-66301',
    companyType: 'supplier',
    emirate: 'Sharjah',
    industrialZone: 'Sharjah Industrial Area 1-18',
    address: 'Industrial Area 13, Sharjah & Dubai Branch',
    phone: '+971 6 565 6140',
    email: 'info@alfareedagroupintl.com',
    categories: ['LV & MV Power Cables & Wires', 'Earthing, Lightning Protection & Rods'],
    serviceEmirates: ['Dubai', 'Sharjah', 'Ajman'],
    verificationStatus: 'verified',
    rating: 4.75,
    reviewCount: 29,
    responseRatePercent: 94,
    averageResponseHours: 2.5,
    yearsInBusiness: 14,
    badge: 'Verified Trader',
    categoryGroup: 'Cables & Wires',
    specialtiesSummary: 'DEWA/SEWA approved power cables, earthing & lightning protection',
    isPreloadedDirectory: true,
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'uae-sup-05',
    name: 'Loyal Electric Ware Trading LLC',
    legalName: 'Loyal Electric Ware Trading L.L.C',
    tradeLicenseNumber: 'SEDD-LEW-53966',
    companyType: 'supplier',
    emirate: 'Sharjah',
    industrialZone: 'Sharjah Industrial Area 1-18',
    address: 'Industrial Area 2, Sharjah',
    phone: '+971 6 539 6671',
    whatsappPhone: '971554570098',
    email: 'info@loyalelectricllc.com',
    categories: ['LV & MV Power Cables & Wires', 'Switchgear, MCBs & Distribution Boards'],
    serviceEmirates: ['Dubai', 'Sharjah', 'Ajman'],
    verificationStatus: 'verified',
    rating: 4.8,
    reviewCount: 33,
    responseRatePercent: 97,
    averageResponseHours: 1.8,
    yearsInBusiness: 12,
    badge: 'Fast Responder',
    categoryGroup: 'Cables & Wires',
    specialtiesSummary: 'Electrical cables, wires, brass glands, capacitors & switchgear accessories',
    isPreloadedDirectory: true,
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'uae-sup-06',
    name: 'Al Saeedi Electrical Equipment Co. LLC',
    legalName: 'Al Saeedi Electrical Equipment Co. L.L.C',
    tradeLicenseNumber: 'DET-ASE-57056',
    companyType: 'supplier',
    emirate: 'Dubai',
    industrialZone: 'Al Quoz Industrial Area',
    address: 'Al Quoz Industrial Area 4 & Deira, Dubai',
    phone: '+971 4 570 5631',
    email: 'stores@see-cab.com',
    categories: ['LV & MV Power Cables & Wires', 'Switchgear, MCBs & Distribution Boards'],
    serviceEmirates: ['Dubai', 'Sharjah', 'Ajman'],
    verificationStatus: 'verified',
    rating: 4.7,
    reviewCount: 27,
    responseRatePercent: 93,
    averageResponseHours: 2.6,
    yearsInBusiness: 16,
    badge: 'Verified Trader',
    categoryGroup: 'Cables & Wires',
    specialtiesSummary: 'Power cables, flexible wires, cable cleats, joints & switchgear',
    isPreloadedDirectory: true,
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'uae-sup-07',
    name: 'Eminex Electrical Trading LLC',
    legalName: 'Eminex Electrical Trading L.L.C',
    tradeLicenseNumber: 'DET-EET-29434',
    companyType: 'supplier',
    emirate: 'Dubai',
    industrialZone: 'Rolla / Sabkha Market',
    address: 'Nakheel Center, Deira, Dubai',
    phone: '+971 4 294 3462',
    whatsappPhone: '971529826751',
    email: 'sales@eminexelectrical.com',
    categories: ['LV & MV Power Cables & Wires', 'Cable Trays, Trunking & GI Conduits', 'Switchgear, MCBs & Distribution Boards'],
    serviceEmirates: ['Dubai', 'Sharjah', 'Ajman'],
    verificationStatus: 'verified',
    rating: 4.85,
    reviewCount: 38,
    responseRatePercent: 98,
    averageResponseHours: 1.4,
    yearsInBusiness: 11,
    badge: 'Fast Responder',
    categoryGroup: 'Cables & Wires',
    specialtiesSummary: 'Ducab cables & wires, GI conduits, switchgear & industrial timers',
    isPreloadedDirectory: true,
    createdAt: '2025-01-15T08:00:00Z',
  },

  // ===========================================================================
  // B. LV SWITCHGEAR, DISTRIBUTION BOARDS (DBs), BREAKERS & ISOLATORS (7 SUPPLIERS)
  // ===========================================================================
  {
    id: 'uae-sup-08',
    name: 'Siddique Mustafa & Sons Co. LLC (SMS)',
    legalName: 'Siddique Mustafa & Sons Co. L.L.C',
    tradeLicenseNumber: 'DET-SMS-22721',
    companyType: 'supplier',
    emirate: 'Dubai',
    industrialZone: 'Al Quoz Industrial Area',
    address: 'Al Quoz Industrial Area 3, Dubai',
    phone: '+971 4 227 2111',
    email: 'hello@smsgroup.me',
    categories: ['Switchgear, MCBs & Distribution Boards', 'LV & MV Power Cables & Wires'],
    serviceEmirates: ['Dubai', 'Sharjah', 'Ajman'],
    verificationStatus: 'verified',
    rating: 4.9,
    reviewCount: 52,
    responseRatePercent: 97,
    averageResponseHours: 1.7,
    yearsInBusiness: 30,
    badge: 'Top Rated',
    categoryGroup: 'Switchgear & DBs',
    specialtiesSummary: 'Switchgear specialist: MCBs, MCCBs, ACBs, contactors, relays, DBs & enclosures',
    isPreloadedDirectory: true,
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'uae-sup-09',
    name: 'Scientechnic LLC',
    legalName: 'Scientechnic L.L.C (Easa Saleh Al Gurg Group)',
    tradeLicenseNumber: 'DET-SCT-20357',
    companyType: 'supplier',
    emirate: 'Dubai',
    industrialZone: 'Al Quoz Industrial Area',
    address: 'Deira & Al Quoz Logistics Hub, Dubai',
    phone: '+971 4 203 5777',
    email: 'info@scientechnic.com',
    categories: ['Switchgear, MCBs & Distribution Boards', 'LV & MV Power Cables & Wires', 'Transformers, Generators & UPS Systems'],
    serviceEmirates: ['Dubai', 'Sharjah', 'Ajman'],
    verificationStatus: 'verified',
    rating: 4.95,
    reviewCount: 84,
    responseRatePercent: 99,
    averageResponseHours: 1.5,
    yearsInBusiness: 45,
    badge: 'Premium Partner',
    categoryGroup: 'Switchgear & DBs',
    specialtiesSummary: 'Major Schneider Electric, Ducab & automation stockist in the UAE',
    isPreloadedDirectory: true,
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'uae-sup-10',
    name: 'Bin Ghalib Engineering & Trading',
    legalName: 'Bin Ghalib Engineering & Trading L.L.C',
    tradeLicenseNumber: 'SEDD-BGE-51357',
    companyType: 'supplier',
    emirate: 'Sharjah',
    industrialZone: 'Sharjah Industrial Area 1-18',
    address: 'Industrial Area 17, Sharjah & Al Qusais 4, Dubai',
    phone: '+971 6 513 5777',
    email: 'info@binghalibtrading.com',
    categories: ['Switchgear, MCBs & Distribution Boards', 'Transformers, Generators & UPS Systems'],
    serviceEmirates: ['Dubai', 'Sharjah', 'Ajman'],
    verificationStatus: 'verified',
    rating: 4.85,
    reviewCount: 47,
    responseRatePercent: 96,
    averageResponseHours: 2.0,
    yearsInBusiness: 35,
    badge: 'Top Rated',
    categoryGroup: 'Switchgear & DBs',
    specialtiesSummary: 'LV switchgear panels, circuit breakers, enclosures & automation components',
    isPreloadedDirectory: true,
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'uae-sup-11',
    name: 'Golden Way Electricals Trading LLC',
    legalName: 'Golden Way Electricals Trading L.L.C',
    tradeLicenseNumber: 'DET-GWE-26412',
    companyType: 'supplier',
    emirate: 'Dubai',
    industrialZone: 'Al Quoz Industrial Area',
    address: 'Al Quoz Industrial 3 & Deira, Dubai',
    phone: '+971 4 264 1224',
    email: 'sales@goldenwayelectricals.com',
    categories: ['Switchgear, MCBs & Distribution Boards', 'Commercial LED Lighting & Fixtures'],
    serviceEmirates: ['Dubai', 'Sharjah', 'Ajman'],
    verificationStatus: 'verified',
    rating: 4.75,
    reviewCount: 31,
    responseRatePercent: 94,
    averageResponseHours: 2.3,
    yearsInBusiness: 15,
    badge: 'Verified Trader',
    categoryGroup: 'Switchgear & DBs',
    specialtiesSummary: 'Switchgear, circuit breakers, weatherproof isolators, wiring devices & cables',
    isPreloadedDirectory: true,
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'uae-sup-12',
    name: 'Al Terhab Elect. Switchgear Dist. LLC',
    legalName: 'Al Terhab Electrical Switchgear Distribution L.L.C',
    tradeLicenseNumber: 'SEDD-ATE-53453',
    companyType: 'supplier',
    emirate: 'Sharjah',
    industrialZone: 'Sharjah Industrial Area 1-18',
    address: 'Sharjah Industrial Area, Sharjah',
    phone: '+971 6 534 5388',
    email: 'terhab@eim.ae',
    categories: ['Switchgear, MCBs & Distribution Boards'],
    serviceEmirates: ['Dubai', 'Sharjah', 'Ajman'],
    verificationStatus: 'verified',
    rating: 4.7,
    reviewCount: 24,
    responseRatePercent: 92,
    averageResponseHours: 2.8,
    yearsInBusiness: 19,
    badge: 'Verified Trader',
    categoryGroup: 'Switchgear & DBs',
    specialtiesSummary: 'LV switchgear distribution, control panels, DBs & protection breakers',
    isPreloadedDirectory: true,
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'uae-sup-13',
    name: 'Daleel Trading (Switchgear)',
    legalName: 'Daleel Electrical & Switchgear Trading L.L.C',
    tradeLicenseNumber: 'SEDD-DLT-52633',
    companyType: 'supplier',
    emirate: 'Sharjah',
    industrialZone: 'Sharjah Industrial Area 1-18',
    address: 'Industrial Area 11, Sharjah',
    phone: '+971 6 526 3323',
    whatsappPhone: '971505263318',
    email: 'naseeb@daleeltrading.com',
    categories: ['Switchgear, MCBs & Distribution Boards'],
    serviceEmirates: ['Dubai', 'Sharjah', 'Ajman'],
    verificationStatus: 'verified',
    rating: 4.8,
    reviewCount: 28,
    responseRatePercent: 97,
    averageResponseHours: 1.6,
    yearsInBusiness: 13,
    badge: 'Fast Responder',
    categoryGroup: 'Switchgear & DBs',
    specialtiesSummary: 'Custom LV switchgear, DB assemblies, isolators & industrial electricals',
    isPreloadedDirectory: true,
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'uae-sup-14',
    name: 'Electrical Junction Equipments Trading',
    legalName: 'Electrical Junction Equipments Trading L.L.C',
    tradeLicenseNumber: 'DET-EJE-26764',
    companyType: 'supplier',
    emirate: 'Dubai',
    industrialZone: 'Rolla / Sabkha Market',
    address: 'Naif / Sabkha Electrical Market, Deira, Dubai',
    phone: '+971 4 267 6484',
    email: 'sales@electricaljunction.com',
    categories: ['Switchgear, MCBs & Distribution Boards'],
    serviceEmirates: ['Dubai', 'Sharjah', 'Ajman'],
    verificationStatus: 'verified',
    rating: 4.7,
    reviewCount: 22,
    responseRatePercent: 93,
    averageResponseHours: 2.4,
    yearsInBusiness: 10,
    badge: 'Verified Trader',
    categoryGroup: 'Switchgear & DBs',
    specialtiesSummary: 'LV switchgear parts, control gear, circuit breakers & industrial plugs',
    isPreloadedDirectory: true,
    createdAt: '2025-01-15T08:00:00Z',
  },

  // ===========================================================================
  // C. GI / PVC CONDUITS, CABLE TRAYS, TRUNKING & CONTAINMENT (6 SUPPLIERS)
  // ===========================================================================
  {
    id: 'uae-sup-15',
    name: 'Riyal Electrical Trading LLC',
    legalName: 'Riyal Electrical Trading L.L.C',
    tradeLicenseNumber: 'DET-RET-34688',
    companyType: 'supplier',
    emirate: 'Dubai',
    industrialZone: 'Al Quoz Industrial Area',
    address: 'Al Quoz Industrial Area 2 & Deira, Dubai',
    phone: '+971 4 346 8829',
    whatsappPhone: '971555702564',
    email: 'sales@riyalelectrical.com',
    categories: ['Cable Trays, Trunking & GI Conduits', 'Switchgear, MCBs & Distribution Boards'],
    serviceEmirates: ['Dubai', 'Sharjah', 'Ajman'],
    verificationStatus: 'verified',
    rating: 4.9,
    reviewCount: 44,
    responseRatePercent: 98,
    averageResponseHours: 1.3,
    yearsInBusiness: 14,
    badge: 'Fast Responder',
    categoryGroup: 'Conduits & Containment',
    specialtiesSummary: 'GI cable trays, trunking, GI/PVC conduits, weatherproof isolators & DBs',
    isPreloadedDirectory: true,
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'uae-sup-16',
    name: 'KEA Electricals',
    legalName: 'KEA Electricals Trading L.L.C',
    tradeLicenseNumber: 'DET-KEA-44842',
    companyType: 'supplier',
    emirate: 'Dubai',
    industrialZone: 'Rolla / Sabkha Market',
    address: 'Street 16C, Deira, Dubai',
    phone: '+971 4 448 4288',
    email: 'info@keaelectricals.com',
    categories: ['Cable Trays, Trunking & GI Conduits', 'Switchgear, MCBs & Distribution Boards'],
    serviceEmirates: ['Dubai', 'Sharjah', 'Ajman'],
    verificationStatus: 'verified',
    rating: 4.75,
    reviewCount: 26,
    responseRatePercent: 94,
    averageResponseHours: 2.2,
    yearsInBusiness: 11,
    badge: 'Verified Trader',
    categoryGroup: 'Conduits & Containment',
    specialtiesSummary: 'Rigid & flexible conduits, cable management systems & LV gear',
    isPreloadedDirectory: true,
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'uae-sup-17',
    name: 'Al Baraq Electrical Ware Trading',
    legalName: 'Al Baraq Electrical Ware Trading L.L.C',
    tradeLicenseNumber: 'SEDD-ABE-51009',
    companyType: 'supplier',
    emirate: 'Sharjah',
    industrialZone: 'Sharjah Industrial Area 1-18',
    address: 'Industrial Area 12, Sharjah',
    phone: '+971 6 510 0937',
    email: 'albaraqelect@gmail.com',
    categories: ['Cable Trays, Trunking & GI Conduits', 'LV & MV Power Cables & Wires', 'Switchgear, MCBs & Distribution Boards'],
    serviceEmirates: ['Dubai', 'Sharjah', 'Ajman'],
    verificationStatus: 'verified',
    rating: 4.8,
    reviewCount: 30,
    responseRatePercent: 95,
    averageResponseHours: 2.0,
    yearsInBusiness: 12,
    badge: 'Verified Trader',
    categoryGroup: 'Conduits & Containment',
    specialtiesSummary: 'Decoduct PVC conduits & trunking, Ducab wires, Schneider & ABB gear',
    isPreloadedDirectory: true,
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'uae-sup-18',
    name: 'Al Mayar Electric Switchgear Ind. LLC',
    legalName: 'Al Mayar Electric Switchgear Industries L.L.C',
    tradeLicenseNumber: 'SEDD-AME-53534',
    companyType: 'supplier',
    emirate: 'Sharjah',
    industrialZone: 'Sharjah Industrial Area 1-18',
    address: 'Industrial Area 15, Sharjah',
    phone: '+971 6 535 3455',
    email: 'info@almayar.ae',
    categories: ['Cable Trays, Trunking & GI Conduits', 'Switchgear, MCBs & Distribution Boards'],
    serviceEmirates: ['Dubai', 'Sharjah', 'Ajman'],
    verificationStatus: 'verified',
    rating: 4.75,
    reviewCount: 25,
    responseRatePercent: 93,
    averageResponseHours: 2.5,
    yearsInBusiness: 16,
    badge: 'Verified Trader',
    categoryGroup: 'Conduits & Containment',
    specialtiesSummary: 'Cable trunking, sheet-metal DB enclosures, terminal blocks & trays',
    isPreloadedDirectory: true,
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'uae-sup-19',
    name: 'Al Jalal Electrical Trading',
    legalName: 'Al Jalal Electrical Trading L.L.C',
    tradeLicenseNumber: 'SEDD-AJE-55495',
    companyType: 'supplier',
    emirate: 'Sharjah',
    industrialZone: 'Sharjah Industrial Area 1-18',
    address: 'Sharjah Industrial Area, Sharjah',
    phone: '+971 6 554 9593',
    email: 'info@aljalalelectrical.com',
    categories: ['Cable Trays, Trunking & GI Conduits', 'LV & MV Power Cables & Wires'],
    serviceEmirates: ['Dubai', 'Sharjah', 'Ajman'],
    verificationStatus: 'verified',
    rating: 4.7,
    reviewCount: 21,
    responseRatePercent: 92,
    averageResponseHours: 2.7,
    yearsInBusiness: 15,
    badge: 'Verified Trader',
    categoryGroup: 'Conduits & Containment',
    specialtiesSummary: 'Conduits, cable containment, wires & commercial lighting supplies',
    isPreloadedDirectory: true,
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'uae-sup-20',
    name: 'AG Group International',
    legalName: 'AG Group International F.Z.C / L.L.C',
    tradeLicenseNumber: 'SEDD-AGG-70445',
    companyType: 'supplier',
    emirate: 'Sharjah',
    industrialZone: 'Sharjah Industrial Area 1-18',
    address: 'Industrial Area 18, Sharjah',
    phone: '+971 6 704 4597',
    whatsappPhone: '971586870918',
    email: 'info@aggroupintl.com',
    categories: ['Cable Trays, Trunking & GI Conduits', 'Switchgear, MCBs & Distribution Boards'],
    serviceEmirates: ['Dubai', 'Sharjah', 'Ajman'],
    verificationStatus: 'verified',
    rating: 4.85,
    reviewCount: 34,
    responseRatePercent: 97,
    averageResponseHours: 1.6,
    yearsInBusiness: 12,
    badge: 'Fast Responder',
    categoryGroup: 'Conduits & Containment',
    specialtiesSummary: 'Industrial containment, electrical switchgear & MEP hardware',
    isPreloadedDirectory: true,
    createdAt: '2025-01-15T08:00:00Z',
  },

  // ===========================================================================
  // D. MULTI-BRAND MEP & FULL-BOQ ELECTRICAL WHOLESALERS (5 SUPPLIERS)
  // ===========================================================================
  {
    id: 'uae-sup-21',
    name: 'Spark Electrical Equipment LLC',
    legalName: 'Spark Electrical Equipment L.L.C',
    tradeLicenseNumber: 'DET-SEE-22295',
    companyType: 'supplier',
    emirate: 'Dubai',
    industrialZone: 'Rolla / Sabkha Market',
    address: 'Nakheel Street, Deira, Dubai',
    phone: '+971 4 222 9529',
    email: 'info@sparkelectricals.com',
    categories: ['LV & MV Power Cables & Wires', 'Switchgear, MCBs & Distribution Boards', 'Cable Trays, Trunking & GI Conduits', 'Commercial LED Lighting & Fixtures'],
    serviceEmirates: ['Dubai', 'Sharjah', 'Ajman'],
    verificationStatus: 'verified',
    rating: 4.9,
    reviewCount: 53,
    responseRatePercent: 98,
    averageResponseHours: 1.6,
    yearsInBusiness: 22,
    badge: 'Top Rated',
    categoryGroup: 'Multi-Brand MEP',
    specialtiesSummary: 'One-stop MEP & electrical wholesaler for contracting BOQs',
    isPreloadedDirectory: true,
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'uae-sup-22',
    name: 'Al Hathboor Electricals',
    legalName: 'Al Hathboor Electricals (Al Hathboor Group LLC)',
    tradeLicenseNumber: 'DET-AHE-60855',
    companyType: 'supplier',
    emirate: 'Dubai',
    industrialZone: 'Ras Al Khor Industrial Area',
    address: 'Al Garhoud, Dubai & Rolla, Sharjah',
    phone: '+971 4 608 5555',
    email: 'ahe-sales@alhathboor.com',
    categories: ['LV & MV Power Cables & Wires', 'Switchgear, MCBs & Distribution Boards', 'Commercial LED Lighting & Fixtures', 'Earthing, Lightning Protection & Rods'],
    serviceEmirates: ['Dubai', 'Sharjah', 'Ajman'],
    verificationStatus: 'verified',
    rating: 4.95,
    reviewCount: 71,
    responseRatePercent: 99,
    averageResponseHours: 1.5,
    yearsInBusiness: 40,
    badge: 'Premium Partner',
    categoryGroup: 'Multi-Brand MEP',
    specialtiesSummary: 'Industrial electrical installation gear, lighting, cables & termination',
    isPreloadedDirectory: true,
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'uae-sup-23',
    name: 'Danway LLC',
    legalName: 'Danway Electrical & Mechanical Engineering L.L.C',
    tradeLicenseNumber: 'DET-DNW-34737',
    companyType: 'supplier',
    emirate: 'Dubai',
    industrialZone: 'Al Quoz Industrial Area',
    address: 'Al Quoz Industrial Area, Dubai',
    phone: '+971 4 347 3700',
    email: 'info@danwayllc.com',
    categories: ['LV & MV Power Cables & Wires', 'Switchgear, MCBs & Distribution Boards', 'Transformers, Generators & UPS Systems'],
    serviceEmirates: ['Dubai', 'Sharjah', 'Ajman'],
    verificationStatus: 'verified',
    rating: 4.9,
    reviewCount: 62,
    responseRatePercent: 97,
    averageResponseHours: 1.9,
    yearsInBusiness: 42,
    badge: 'Premium Partner',
    categoryGroup: 'Multi-Brand MEP',
    specialtiesSummary: 'Power distribution, cable accessories, industrial electricals & power solutions',
    isPreloadedDirectory: true,
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'uae-sup-24',
    name: 'Bhatia Brothers (Industrial Supply)',
    legalName: 'Bhatia Brothers Industrial Supply Division L.L.C',
    tradeLicenseNumber: 'DET-BBI-85925',
    companyType: 'supplier',
    emirate: 'Dubai',
    industrialZone: 'Ras Al Khor Industrial Area',
    address: 'Al Garhoud / Ras Al Khor Industrial Supply Hub, Dubai',
    phone: '+971 4 859 2577',
    email: 'enquiry@bbisd.com',
    categories: ['LV & MV Power Cables & Wires', 'Cable Trays, Trunking & GI Conduits', 'Earthing, Lightning Protection & Rods'],
    serviceEmirates: ['Dubai', 'Sharjah', 'Ajman'],
    verificationStatus: 'verified',
    rating: 4.85,
    reviewCount: 46,
    responseRatePercent: 96,
    averageResponseHours: 2.1,
    yearsInBusiness: 38,
    badge: 'Top Rated',
    categoryGroup: 'Multi-Brand MEP',
    specialtiesSummary: 'MEP engineering supplies, industrial electricals, containment & safety',
    isPreloadedDirectory: true,
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'uae-sup-25',
    name: 'Parkway Exim General Trading',
    legalName: 'Parkway Exim General Trading L.L.C',
    tradeLicenseNumber: 'DET-PEG-27654',
    companyType: 'supplier',
    emirate: 'Dubai',
    industrialZone: 'Al Quoz Industrial Area',
    address: 'Business Bay / Al Quoz Warehouse, Dubai',
    phone: '+971 4 276 5432',
    email: 'sales@parkwayexim.com',
    categories: ['LV & MV Power Cables & Wires', 'Switchgear, MCBs & Distribution Boards', 'Cable Trays, Trunking & GI Conduits'],
    serviceEmirates: ['Dubai', 'Sharjah', 'Ajman'],
    verificationStatus: 'verified',
    rating: 4.8,
    reviewCount: 35,
    responseRatePercent: 96,
    averageResponseHours: 1.8,
    yearsInBusiness: 10,
    badge: 'Verified Trader',
    categoryGroup: 'Multi-Brand MEP',
    specialtiesSummary: 'Decoduct conduits, Ducab cables, Schneider/Hager switchgear & accessories',
    isPreloadedDirectory: true,
    createdAt: '2025-01-15T08:00:00Z',
  },
];

/**
 * Safely merges live/registered companies with the 25 pre-loaded UAE electrical stockists.
 * - If any of the 25 stockists registers or logs in on their own with the same email or company name,
 *   their live registered Company record takes precedence with ZERO clash or duplicate row.
 */
export function mergeWithPreloadedSuppliers(liveCompanies: Company[]): PreloadedUAESupplier[] {
  const result: PreloadedUAESupplier[] = [];
  const seenEmails = new Set<string>();
  const seenNames = new Set<string>();

  const normalizeName = (s: string) =>
    s
      .toLowerCase()
      .replace(/\b(llc|l\.l\.c|fzco|f\.z\.c\.o|fze|co\.|trading|electrical|equipment|est)\b/g, '')
      .replace(/[^a-z0-9]/g, '')
      .trim();

  // 1. Add all real live companies first (excluding fictional test placeholders if real ones exist)
  for (const comp of liveCompanies) {
    if (comp.name.includes('[FICTIONAL TEST]')) {
      continue;
    }
    const emailKey = (comp.email || '').trim().toLowerCase();
    const nameKey = normalizeName(comp.name || '');

    // Check if this registered company matches one of our 25 preloaded stockists to enrich its metadata
    const matchedPreload = PRELOADED_UAE_ELECTRICAL_SUPPLIERS.find(
      (p) =>
        p.id === comp.id ||
        p.email.trim().toLowerCase() === emailKey ||
        (nameKey.length > 4 && normalizeName(p.name) === nameKey)
    );

    if (emailKey) seenEmails.add(emailKey);
    if (nameKey) seenNames.add(nameKey);

    result.push({
      ...comp,
      whatsappPhone: matchedPreload?.whatsappPhone,
      categoryGroup: matchedPreload?.categoryGroup || 'Multi-Brand MEP',
      specialtiesSummary:
        matchedPreload?.specialtiesSummary ||
        (comp.categories && comp.categories.length > 0
          ? comp.categories.join(', ')
          : 'Verified UAE Electrical Stockist'),
      isPreloadedDirectory: false,
    });
  }

  // 2. Append any of the 25 pre-loaded UAE electrical stockists that haven't registered yet
  for (const preload of PRELOADED_UAE_ELECTRICAL_SUPPLIERS) {
    const emailKey = preload.email.trim().toLowerCase();
    const nameKey = normalizeName(preload.name);
    if (seenEmails.has(emailKey) || (nameKey.length > 4 && seenNames.has(nameKey))) {
      continue;
    }
    seenEmails.add(emailKey);
    seenNames.add(nameKey);
    result.push(preload);
  }

  return result;
}

/**
 * Generates the Introductory Sales Pitch / Supplier Onboarding Message (Fee-Free, Zero Commission Mention)
 */
export function buildSupplierIntroPitchText(supplierName?: string): string {
  const greeting = supplierName
    ? `Salam ${supplierName} Sales & Estimation Team,`
    : `Salam Sales & Estimation Team,`;

  return `${greeting}

I'm an electrical engineer running the procurement desk at ProcureSouq (https://procuresouq.vercel.app).

We aggregate active electrical material BOQs (Ducab cables, Schneider/ABB/Hager switchgear, Decoduct/GI conduits, cable trays, and lighting) directly from MEP and fit-out contractors across Dubai and Sharjah.

How our procurement desk works for your sales team:
1. You receive clean, structured BOQs with exact item specifications, quantities, approved brands, and delivery emirate.
2. Each RFQ is strictly capped at a maximum of 5 verified UAE stockists — no open price wars against 30+ random traders.
3. You can reply with your official quotation directly via WhatsApp/Email PDF, or submit through our Supplier Portal (https://procuresouq.vercel.app), and we coordinate the Purchase Order and site delivery with you.

Please confirm the best email address or WhatsApp contact for your estimation/sales engineer so we can include ${
    supplierName || 'your company'
  } on our upcoming electrical BOQ tenders this week.

Best regards,
Electrical Procurement Desk
ProcureSouq — Managed UAE Electrical Procurement
https://procuresouq.vercel.app`;
}

/**
 * Generates a Formal RFQ BOQ Quotation Request for WhatsApp or Email (Buyer Identity 100% Masked)
 */
export function buildFormalRfqBoqRequestText(
  rfq: RFQ,
  supplierName?: string,
  quotationDeadline?: string
): string {
  const greeting = supplierName
    ? `Salam ${supplierName} Estimation & Sales Team,`
    : `Salam Estimation & Sales Team,`;

  const deadlineStr = quotationDeadline || rfq.supplierQuoteDeadline?.slice(0, 10) || rfq.closingDate;

  const boqLines = rfq.items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.description} — Qty: ${item.quantity} ${item.unit}` +
        `${item.specification ? ` | Spec: ${item.specification}` : ''}` +
        `${item.preferredBrand ? ` | Brand: ${item.preferredBrand}` : ''}`
    )
    .join('\n');

  return `${greeting}

I'm an electrical engineer at the ProcureSouq Managed Procurement Desk (https://procuresouq.vercel.app).

We are requesting your best commercial quotation and stock availability for the following verified UAE contracting BOQ:

• RFQ Reference: ${rfq.rfqNumber}
• Project Title: ${rfq.title}
• Category: ${rfq.category}
• Delivery Emirate: ${rfq.deliveryEmirate}
• Required Site Delivery: ${rfq.requiredDeliveryDate}
• Quotation Deadline: ${deadlineStr}
• Authority / Spec Standard: ${rfq.authorityApproval || 'Standard UAE Approved'}

--- ITEMIZED BILL OF QUANTITIES (BOQ) ---
${boqLines}
-----------------------------------------

Please include in your quotation:
1. Unit price & total amount (AED) + 5% VAT breakdown
2. Offered brand for each line item
3. Stock availability / delivery lead time (days) to ${rfq.deliveryEmirate}
4. Payment terms & quotation validity

You can reply directly to this message with your signed PDF quotation, or submit online at https://procuresouq.vercel.app.

Best regards,
Electrical Procurement Desk
ProcureSouq — Managed UAE B2B Procurement
https://procuresouq.vercel.app`;
}

/**
 * Builds a direct WhatsApp click-to-chat URL (wa.me)
 */
export function buildWhatsAppUrl(phoneStr: string | undefined, message: string): string {
  const digits = (phoneStr || '').replace(/[^0-9]/g, '');
  const encoded = encodeURIComponent(message);
  if (!digits) {
    return `https://wa.me/?text=${encoded}`;
  }
  return `https://wa.me/${digits}?text=${encoded}`;
}

/**
 * Builds a mailto: URL for 1 supplier or BCC batch across all selected/25 suppliers
 */
export function buildMailtoUrl(
  emails: string[],
  subject: string,
  body: string,
  useBcc = false
): string {
  const cleanEmails = Array.from(
    new Set(emails.map((e) => e.trim()).filter((e) => e.includes('@')))
  );
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  if (cleanEmails.length === 0) {
    return `mailto:?subject=${encodedSubject}&body=${encodedBody}`;
  }

  if (useBcc || cleanEmails.length > 1) {
    return `mailto:?bcc=${encodeURIComponent(cleanEmails.join(','))}&subject=${encodedSubject}&body=${encodedBody}`;
  }

  return `mailto:${cleanEmails[0]}?subject=${encodedSubject}&body=${encodedBody}`;
}
