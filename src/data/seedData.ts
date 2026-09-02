import { Company, Category, RFQ, Quotation, PurchaseOrder, Message, Review, VerificationRequest, QuickBundle } from '../types';

export const initialCategories: Category[] = [
  {
    id: 'cat-cables',
    vertical: 'Construction',
    name: 'LV & MV Power Cables & Wires',
    slug: 'power-cables-wires',
    description: 'Armoured XLPE/SWA/PVC copper cables, single core building wires (2.5mm²-16mm²), flexible rubber cables & fire-rated FP200 cables',
    icon: 'Zap',
    itemCount: 240,
    isBeachhead: true,
    subcategories: [
      '4-Core Copper Armoured XLPE/SWA/PVC (16mm² - 300mm²)',
      'Single Core PVC Building Wires (1.5mm², 2.5mm², 4mm², 6mm², 10mm²)',
      'Fire-Resistant & LSZH FP200 Certified Cables',
      'Flexible Rubber Submersible & H07RN-F Cables',
      'Control, Screened & Instrumentation Cables',
      'Solar DC PV Cables (4mm² / 6mm² TÜV Certified)'
    ]
  },
  {
    id: 'cat-switchgear',
    vertical: 'Construction',
    name: 'Switchgear, MCBs & Distribution Boards',
    slug: 'switchgear-mcb-db',
    description: 'Miniature circuit breakers (10kA), MCCBs, ELCBs, isolator switches, 3-phase final DB panels, and main sub-distribution panels (SMDB)',
    icon: 'Layers',
    itemCount: 185,
    isBeachhead: true,
    subcategories: [
      '1-Pole, 2-Pole & 3-Pole MCBs (6A - 63A, 10kA Type C)',
      'Molded Case Circuit Breakers (MCCB 100A - 800A)',
      'Residual Current Circuit Breakers (RCCB / ELCB 30mA/100mA/300mA)',
      'Surface & Flush Mounted 3-Phase Distribution Boards (4-way to 24-way)',
      'Rotary Weatherproof Isolators (20A, 32A, 45A, 63A IP65)',
      'Magnetic Contactors & Motor Starter Overload Relays'
    ]
  },
  {
    id: 'cat-lighting',
    vertical: 'Facility Management',
    name: 'Commercial LED Lighting & Fixtures',
    slug: 'commercial-led-lighting',
    description: '60x60 recessed LED panels, LED downlights, high-bay warehouse lights, waterproof battens, and Civil Defense exit lights',
    icon: 'Sparkles',
    itemCount: 160,
    isBeachhead: true,
    subcategories: [
      '60x60 & 30x120 Recessed LED Panels (40W / 4000K & 6500K)',
      'Commercial LED Downlights (10W - 30W IP44/IP54)',
      'IP65 Waterproof LED Tri-Proof Battens (4ft & 5ft)',
      'UFO LED High Bay Warehouse Fixtures (100W, 150W, 200W)',
      'Civil Defense Approved Self-Contained Emergency Exit Luminaires',
      'Exterior LED Floodlights & Architectural Facade Washers'
    ]
  },
  {
    id: 'cat-containment',
    vertical: 'Construction',
    name: 'Conduits, Trays & Cable Containment',
    slug: 'conduits-trays-containment',
    description: 'GI perforated cable trays, cable ladders, Decoduct PVC conduits, flexible liquid-tight metallic conduits & unistrut channels',
    icon: 'ShieldCheck',
    itemCount: 195,
    subcategories: [
      'Hot-Dip Galvanized (HDG) & Pre-Galvanized Cable Trays (50mm - 600mm)',
      'Heavy Duty Return Flange GI Cable Ladders',
      'Decoduct High Impact Rigid PVC Conduits (20mm, 25mm, 32mm)',
      'Flexible PVC Coated Metallic Conduits & Brass Adaptors',
      'Slotted Steel Unistrut Channels & 8mm/10mm Threaded Rods',
      'Galvanized GI Adaptable Junction Boxes & Conduit Accessories'
    ]
  }
];

export const initialQuickBundles: QuickBundle[] = [
  {
    id: 'bundle-commercial-cables',
    title: 'Commercial Fit-Out Power Cable & DB Pack',
    category: 'LV & MV Power Cables & Wires',
    description: 'Full electrical fit-out pack: Ducab 4Cx16mm² armoured cable, 3-Phase 12-Way DB panel, and 40x Schneider 20A MCBs.',
    icon: 'Zap',
    badge: 'DEWA Approved Standard',
    estimatedTotalAED: 24500,
    items: [
      {
        description: '4C x 16mm² XLPE/SWA/PVC 0.6/1kV Copper Armoured Cable',
        specification: 'BS 5467 standard, stranded copper conductor, XLPE insulated, steel wire armoured (DEWA approved)',
        preferredBrand: 'Ducab / Oman Cables',
        quantity: 500,
        unit: 'm'
      },
      {
        description: '3-Phase 12-Way Flush Mounted Distribution Board (DB)',
        specification: '125A Incomer capacity, IP41 rated, complete with copper busbar and neutral/earth terminals',
        preferredBrand: 'Schneider Electric / ABB / Hager',
        quantity: 4,
        unit: 'pcs'
      },
      {
        description: '20A Single Pole Miniature Circuit Breaker (MCB) 10kA Type C',
        specification: 'IEC/EN 60898-1, 10kA breaking capacity, DIN rail mounted',
        preferredBrand: 'Schneider Electric Acti9 / ABB',
        quantity: 50,
        unit: 'pcs'
      },
      {
        description: 'Decoduct 25mm High Impact Rigid PVC Conduit (3m Length)',
        specification: 'BS 4607, Class 4 heavy gauge, flame retardant (Pack of 25 pipes)',
        preferredBrand: 'Decoduct / EGA / Falcon',
        quantity: 40,
        unit: 'coils'
      }
    ]
  },
  {
    id: 'bundle-led-office-lighting',
    title: '60x60 LED Panel & Commercial Lighting Pack',
    category: 'Commercial LED Lighting & Fixtures',
    description: 'Bulk 100x 60x60 LED ceiling panels 40W 4000K, 20x emergency exit running man lights, and mounting accessories.',
    icon: 'Sparkles',
    badge: 'High Efficiency UGR<19',
    estimatedTotalAED: 11800,
    items: [
      {
        description: '60x60 Recessed LED Panel Light 40W 4000K Neutral White',
        specification: '4000 Lumens, CRI > 80, UGR < 19 low glare, flicker-free certified electronic driver',
        preferredBrand: 'Philips CoreLine / Osram / Opple',
        quantity: 100,
        unit: 'pcs'
      },
      {
        description: '3-Hour Self-Contained Emergency Exit Luminaire (Running Man)',
        specification: 'LED surface/suspended, 3hr Ni-Cd battery backup, Civil Defense approved certificate',
        preferredBrand: 'Cooper / Stanilite / Olympia',
        quantity: 20,
        unit: 'pcs'
      },
      {
        description: '6-Inch Commercial Recessed LED Downlight 18W 4000K',
        specification: 'Die-cast aluminum heat sink, 1600 Lumens, IP44 rated',
        preferredBrand: 'Philips / Opple',
        quantity: 40,
        unit: 'pcs'
      }
    ]
  },
  {
    id: 'bundle-containment-trays',
    title: 'Galvanized GI Cable Tray & Containment Pack',
    category: 'Conduits, Trays & Cable Containment',
    description: 'Pre-galvanized perforated cable trays (150mm & 300mm), 41x41 slotted channels, and 10mm threaded rods.',
    icon: 'ShieldCheck',
    badge: 'Heavy Duty Return Flange',
    estimatedTotalAED: 14200,
    items: [
      {
        description: 'Pre-Galvanized Perforated Cable Tray 300mm x 50mm x 3m (1.5mm Thk)',
        specification: 'BS EN 61537 standard, return flange heavy duty type, 3-meter length with fish plates',
        preferredBrand: 'Profab / Decoduct / National Cable Trays',
        quantity: 80,
        unit: 'm'
      },
      {
        description: 'Pre-Galvanized Perforated Cable Tray 150mm x 50mm x 3m (1.2mm Thk)',
        specification: 'BS EN 61537, return flange, 3-meter length with couplers & bolts',
        quantity: 100,
        unit: 'm'
      },
      {
        description: '41x41x2.5mm Slotted Unistrut Channel (3m Length)',
        specification: 'Hot dip galvanized cold formed steel strut channel',
        quantity: 50,
        unit: 'pcs'
      },
      {
        description: 'M10 High Tensile Zinc Plated Threaded Rods (3m Length)',
        specification: 'Grade 4.8 zinc electroplated with nuts and washers',
        quantity: 80,
        unit: 'pcs'
      }
    ]
  },
  {
    id: 'bundle-villa-first-fix',
    title: 'Residential Villa First-Fix Wiring & Earthing Pack',
    category: 'LV & MV Power Cables & Wires',
    description: 'Single-core copper wiring coils (2.5mm², 4mm², 6mm²), copper earth rods, and flush GI metal back boxes.',
    icon: 'Layers',
    badge: 'Fast Turnaround Stock',
    estimatedTotalAED: 9600,
    items: [
      {
        description: 'Single Core 2.5mm² PVC Insulated Copper Wire (100m Coil - Red/Yellow/Blue/Black/Green)',
        specification: 'BS 6004, 450/750V, annealed copper conductor (DEWA/SEWA approved)',
        preferredBrand: 'Ducab / Oman Cables',
        quantity: 30,
        unit: 'coils'
      },
      {
        description: 'Single Core 4.0mm² PVC Insulated Copper Wire (100m Coil)',
        specification: 'BS 6004 standard, 450/750V copper building wire',
        preferredBrand: 'Ducab / Oman Cables',
        quantity: 15,
        unit: 'coils'
      },
      {
        description: 'Copperbonded Earth Rod 5/8 Inch x 8 Feet (2.4m) with Clamp',
        specification: '99.9% Electrolytic copper bonded to high strength steel core, 254 micron coating',
        preferredBrand: 'Furse / Wallis / Erico',
        quantity: 8,
        unit: 'pcs'
      },
      {
        description: '1-Gang & 2-Gang 35mm Deep Galvanized GI Flush Back Boxes',
        specification: 'BS 4662 standard, with brass earth terminal and adjustable lug',
        quantity: 200,
        unit: 'pcs'
      }
    ]
  }
];

export const initialCompanies: Company[] = [];
export const initialRFQs: RFQ[] = [];
export const initialQuotations: Quotation[] = [];
export const initialPurchaseOrders: PurchaseOrder[] = [];
export const initialMessages: Message[] = [];
export const initialReviews: Review[] = [];
export const initialVerifications: VerificationRequest[] = [];
