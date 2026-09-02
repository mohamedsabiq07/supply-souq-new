import { Company, Category, RFQ, Quotation, PurchaseOrder, Message, Review, VerificationRequest, QuickBundle } from '../types';

export const initialCategories: Category[] = [
  {
    id: 'cat-lv-cables',
    vertical: 'Power & Cables',
    name: 'LV Power Cables & Building Wires',
    slug: 'lv-cables-wires',
    description: '0.6/1kV Copper Armoured XLPE/SWA/PVC cables, Single Core PVC building wires (1.5mm²-16mm²), and flexible rubber cables',
    icon: 'Zap',
    itemCount: 280,
    isBeachhead: true,
    subcategories: [
      '4-Core Copper Armoured XLPE/SWA/PVC (16mm² - 300mm²)',
      'Single Core PVC Building Wires (1.5mm², 2.5mm², 4mm², 6mm², 10mm², 16mm²)',
      'Single Core XLPE / High-Temperature Flexible Copper Wires',
      'Flexible Rubber Submersible & H07RN-F Heavy Duty Cables',
      'Multi-Core Flexible Unarmoured Control Cables (YY / CY / SY)',
      'Ducab / Oman Cables / Riyadh Cables Certified Drums'
    ]
  },
  {
    id: 'cat-mv-hv-cables',
    vertical: 'Power & Cables',
    name: 'MV & HV Power Cables (11kV - 132kV)',
    slug: 'mv-hv-power-cables',
    description: '11kV, 22kV, 33kV & 132kV Medium & High Voltage underground XLPE armoured power cables, joint kits & terminations',
    icon: 'Zap',
    itemCount: 145,
    isBeachhead: true,
    subcategories: [
      '11kV & 33kV 3-Core Copper XLPE/SWA/PVC Armoured MV Cables',
      '11kV & 33kV Single Core XLPE/AWA/PVC Armoured Cables',
      '132kV Extra High Voltage (EHV) Lead Sheathed Power Cables',
      'MV Heat Shrink & Cold Shrink Straight Joints & Terminations (Raychem / 3M)',
      'DEWA / SEWA / FEWA Approved Medium Voltage Cable Drums'
    ]
  },
  {
    id: 'cat-switchgear',
    vertical: 'Switchgear & DBs',
    name: 'Switchgear, DBs & Circuit Breakers',
    slug: 'switchgear-mcb-db',
    description: 'MDB, SMDB, 3-Phase Final Distribution Boards, ACBs, MCCBs, MCBs (10kA), RCCBs, Contactors & IP65 Isolators',
    icon: 'Layers',
    itemCount: 320,
    isBeachhead: true,
    subcategories: [
      'Main Distribution Boards (MDB) & Sub-Main Panels (SMDB)',
      '3-Phase Flush & Surface Final Distribution Boards (4-Way to 24-Way)',
      'Air Circuit Breakers (ACB 800A - 4000A Fixed & Drawout)',
      'Molded Case Circuit Breakers (MCCB 16A - 800A 36kA/50kA/70kA)',
      'Miniature Circuit Breakers (MCB 1P/2P/3P 6A - 63A 10kA Type C/D)',
      'Residual Current Devices (RCCB / ELCB / RCBO 30mA, 100mA, 300mA)',
      'Rotary Weatherproof IP65/IP66 Isolators & Changeover Switches',
      'Magnetic Contactors, Thermal Overload Relays & Motor Starters'
    ]
  },
  {
    id: 'cat-containment',
    vertical: 'Containment & Conduits',
    name: 'Conduits, Trays & Cable Containment',
    slug: 'conduits-trays-containment',
    description: 'Hot-dip galvanized perforated cable trays, cable ladders, Decoduct PVC conduits, GI conduits & unistrut channels',
    icon: 'ShieldCheck',
    itemCount: 260,
    isBeachhead: true,
    subcategories: [
      'Hot-Dip Galvanized (HDG) & Pre-Galvanized Cable Trays (50mm - 900mm)',
      'Heavy Duty Return Flange GI Cable Ladders & Unistrut Channels',
      'Stainless Steel (SS316 / SS304) Wire Mesh Cable Trays',
      'Decoduct / EGA High Impact Rigid PVC Conduits (20mm, 25mm, 32mm, 50mm)',
      'Galvanized Steel GI Class 4 Heavy Gauge Rigid Conduits & Fittings',
      'Flexible Liquid-Tight PVC-Coated Metallic Conduits & Brass Glands',
      'Galvanized Adaptable Junction Boxes, Couplers, Bends & Reducers'
    ]
  },
  {
    id: 'cat-fire-special-cables',
    vertical: 'Power & Cables',
    name: 'Fire-Resistant, LSZH & Instrument Cables',
    slug: 'fire-resistant-instrument-cables',
    description: 'Fire-Resistant FP200/CWZ cables, Low Smoke Zero Halogen (LSZH) alarm cables, BMS signal, RS485 & Cat6 data cables',
    icon: 'Zap',
    itemCount: 190,
    subcategories: [
      'Fire-Resistant FP200 Gold / CWZ Category C-W-Z Cables (BS 6387 / PH120)',
      'Low Smoke Zero Halogen (LSZH) Fire Survival Power & Alarm Cables',
      'Screened Instrumentation & Twisted Pair BMS Signal Cables',
      'RS485 Modbus, KNX, BacNet & Industrial Automation Cables',
      'Cat6 / Cat6A UTP/STP Structured Data Cabling & Patch Panels',
      'Coaxial RG6 / RG11 & Belden Equivalent Shielded Cables'
    ]
  },
  {
    id: 'cat-earthing-lightning',
    vertical: 'Earthing & Lightning',
    name: 'Earthing & Lightning Protection Systems',
    slug: 'earthing-lightning-protection',
    description: 'Pure copperbonded earth rods, bare copper tape, earth inspection pits, exothermic welding & lightning air terminals',
    icon: 'Zap',
    itemCount: 175,
    subcategories: [
      'Pure Electrolytic Copperbonded Earth Rods (5/8" & 3/4" x 8ft / 10ft)',
      'High-Conductivity Bare Annealed Copper Tape & Stranded Conductors',
      'Heavy-Duty Concrete & Polypropylene Earth Inspection Pits',
      'Exothermic Welding Molds, Weld Metal Powders & Igniters (Cadweld / Furse)',
      'Early Streamer Emission (ESE) Lightning Air Terminals & Surge Arresters (SPD)',
      'Earth Clamps, Rod-to-Tape Couplers, Test Clamps & Earth Bars'
    ]
  },
  {
    id: 'cat-lighting',
    vertical: 'Lighting & Controls',
    name: 'Commercial, Industrial & Emergency Lighting',
    slug: 'commercial-industrial-lighting',
    description: '60x60 recessed LED panels, LED downlights, high-bay warehouse fixtures, waterproof battens & Civil Defense exit lights',
    icon: 'Sparkles',
    itemCount: 230,
    subcategories: [
      '60x60 & 30x120 Recessed LED Panels (40W / 4000K & 6500K UGR<19)',
      'Commercial Architectural Recessed LED Downlights & Track Spotlights',
      'IP65 / IP66 Waterproof LED Tri-Proof Battens (4ft & 5ft Corrosive Proof)',
      'UFO LED High-Bay Warehouse & Factory Luminaires (100W, 150W, 200W)',
      'Civil Defense Approved Self-Contained Emergency Exit Luminaires',
      'Exterior Heavy-Duty LED Floodlights & Architectural Facade Luminaires'
    ]
  },
  {
    id: 'cat-wiring-accessories',
    vertical: 'Lighting & Controls',
    name: 'Wiring Accessories, Sockets & Industrial Plugs',
    slug: 'wiring-accessories-sockets',
    description: '13A UK switched sockets, light switches, IP66 weatherproof industrial plugs, metal back boxes & floor pop-up boxes',
    icon: 'Layers',
    itemCount: 210,
    subcategories: [
      '13A 1-Gang & 2-Gang Switched Sockets (BS 1363 UK Standard - White / Metal Clad)',
      '10AX 1-Way, 2-Way, Intermediate & Grid Light Switches',
      'IP66 / IP67 Weatherproof Industrial Plugs, Sockets & Interlocked Outlets',
      '20A & 45A DP Water Heater & AC Switches with Neon Indicator',
      'Galvanized Steel GI Flush Back Boxes (1-Gang, 2-Gang 35mm / 47mm Deep)',
      'Floor Pop-Up Boxes, Power Grommets & Desktop Socket Modules'
    ]
  },
  {
    id: 'cat-transformers-substations',
    vertical: 'Power Equipment',
    name: 'Transformers, Substations & RMU Units',
    slug: 'transformers-substations-rmu',
    description: 'Oil-immersed & cast resin dry-type transformers (500kVA-2500kVA), 11kV/33kV Ring Main Units (RMU) & packaged substations',
    icon: 'Zap',
    itemCount: 85,
    subcategories: [
      'Oil-Immersed Distribution Transformers (500kVA, 1000kVA, 1500kVA, 2000kVA)',
      'Cast Resin Dry-Type Fire-Safe Transformers (Class F/H Insulation)',
      '11kV & 33kV SF6 / Vacuum Ring Main Units (RMU 3-Way, 4-Way Extensible)',
      'Packaged Unit Substation Enclosures (DEWA / SEWA Spec Compliant)',
      'Automatic Voltage Regulators (AVR) & Power Factor Correction (PFC) Panels'
    ]
  },
  {
    id: 'cat-solar-backup',
    vertical: 'Power Equipment',
    name: 'Solar PV Equipment, Inverters & UPS Power',
    slug: 'solar-pv-inverters-ups',
    description: 'TÜV certified 1500V solar DC cables, on-grid/hybrid solar inverters, DC combiner boxes, industrial UPS & diesel generators',
    icon: 'Zap',
    itemCount: 130,
    subcategories: [
      'TÜV / IEC Certified 4mm² & 6mm² Solar DC Cables (1500V UV Resistant)',
      'On-Grid & Hybrid Solar Inverters (5kW to 100kW 3-Phase String Inverters)',
      'DC Solar Combiner Boxes with 1000V/1500V DC Fuses & DC Isolators',
      'Type 1 + Type 2 DC & AC Surge Protection Devices (SPD)',
      'True Online Double-Conversion Industrial UPS Systems (10kVA - 500kVA)',
      'Silent Diesel Generator Sets (20kVA to 1500kVA Cummins / Perkins / Volvo)'
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
