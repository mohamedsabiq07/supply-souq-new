import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { RFQItem, RFQDocument, Emirate, QuickBundle } from '../../types';
import { initialQuickBundles } from '../../data/seedData';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Search,
  FileText, 
  Zap, 
  ArrowRight, 
  ArrowLeft,
  Camera,
  MapPin,
  Clock,
  ShieldCheck,
  Building2,
  Tag,
  Check,
  X
} from 'lucide-react';

// Master list of UAE electrical brands for search autocomplete
export const MASTER_ELECTRICAL_BRANDS = [
  'Ducab',
  'Riyadh Cables',
  'Oman Cables',
  'Elsewedy Electric',
  'BICC Cables',
  'Brugg Cables',
  'Prysmian Group',
  'Schneider Electric',
  'ABB',
  'Siemens',
  'Hager',
  'Legrand',
  'Eaton',
  'Decoduct',
  'Dietzel Univolt',
  'Marshall Tufflex',
  'Profab GI',
  'National Plastic',
  'EGA',
  'Furse (ABB)',
  'Wallis',
  'Kumwell',
  'Erico / nVent',
  'Kingsmill',
  'Philips / Signify',
  'Osram / Ledvance',
  'Tridonic',
  'Thorn Lighting',
  'Zumtobel',
  'Cooper Lighting',
  'MK (Honeywell)',
  'Crabtree',
  'Mennekes',
  'Lucy Electric',
  'Federal Transformers',
  'Belden',
  'Cavicel',
  'Pirelli'
];

// Realistic Initial UAE Electrical Items with clean empty brand lists
export const DEFAULT_ELECTRICAL_ITEMS: RFQItem[] = [
  {
    id: 'item-elec-1',
    itemNumber: 1,
    description: '4C x 16mm² XLPE/SWA/PVC 0.6/1kV Copper Armoured Cable',
    specification: 'Stranded copper conductor, XLPE insulated, steel wire armoured, black PVC outer sheath (DEWA compliant)',
    preferredBrands: [],
    preferredBrand: '',
    allowAlternatives: true,
    quantity: 500,
    unit: 'm',
    notes: 'Drum length 500m preferred. Factory test certificate required.'
  },
  {
    id: 'item-elec-2',
    itemNumber: 2,
    description: '3-Phase 12-Way Flush Mounted Distribution Board (DB)',
    specification: '125A Incomer capacity, IP41 rated, complete with copper busbar, neutral & earth bars, DIN rail',
    preferredBrands: [],
    preferredBrand: '',
    allowAlternatives: true,
    quantity: 4,
    unit: 'pcs',
    notes: 'Include 100A 4P isolator & 12x 20A 1P MCBs'
  },
  {
    id: 'item-elec-3',
    itemNumber: 3,
    description: '25mm High-Impact Rigid PVC Conduit (Class 4 Heavy Duty)',
    specification: 'BS 4607 / BS EN 61386 standard, 3-meter length pipes, black UV-stabilized, high impact',
    preferredBrands: [],
    preferredBrand: '',
    allowAlternatives: true,
    quantity: 50,
    unit: 'lengths',
    notes: 'Standard 3m pipes for underground and ceiling slab containment'
  }
];

interface RFQWizardProps {
  buyerCompany: {
    id: string;
    name: string;
    contactName: string;
    phone: string;
    email: string;
    emirate: Emirate;
  };
  initialBundle?: QuickBundle | null;
  targetSupplier?: any;
  initialCategory?: string;
  onPublish: (rfqData: any) => void;
  onCancel: () => void;
}

export const RFQWizard: React.FC<RFQWizardProps> = ({ 
  buyerCompany, 
  initialBundle,
  targetSupplier,
  initialCategory,
  onPublish, 
  onCancel 
}) => {
  const { companies } = useAppData();
  const verifiedSuppliers = companies.filter(c => c.companyType === 'supplier');

  const [wizardMode, setWizardMode] = useState<'photo_upload' | 'detailed_boq'>('detailed_boq');
  const [step, setStep] = useState(1);

  // Target Supplier State
  const [selectedTargetSupplier, setSelectedTargetSupplier] = useState<any>(targetSupplier || null);

  // Step 1: Core Details
  const [title, setTitle] = useState(
    initialBundle 
      ? initialBundle.title 
      : targetSupplier 
        ? `Material Requirement for ${targetSupplier.name}`
        : 'LV Copper Power Cables & Switchgear Requirement'
  );
  const [deliveryEmirate, setDeliveryEmirate] = useState<Emirate>('Dubai');
  const [deliveryAddress, setDeliveryAddress] = useState('Al Quoz Industrial Loading Bay 3, Dubai');
  const [category, setCategory] = useState(
    initialBundle 
      ? initialBundle.category 
      : initialCategory 
        ? initialCategory 
        : targetSupplier && targetSupplier.categories?.length > 0 
          ? targetSupplier.categories[0] 
          : 'LV Power Cables & Building Wires'
  );
  const [requiredDeliveryDate, setRequiredDeliveryDate] = useState('2026-08-30');
  const [closingDate, setClosingDate] = useState('2026-08-26');
  const [priority, setPriority] = useState<'low' | 'normal' | 'urgent'>('normal');

  // Authority Compliance & Payment Terms
  const [authorityApproval, setAuthorityApproval] = useState('DEWA Approved (Dubai Standard)');
  const [paymentTermsPreference, setPaymentTermsPreference] = useState('PDC 30 Days Credit');

  // Photo Mode state
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Search input query state per item index
  const [brandSearchQueries, setBrandSearchQueries] = useState<Record<number, string>>({});
  const [activeDropdownIndex, setActiveDropdownIndex] = useState<number | null>(null);

  // Line Items
  const [items, setItems] = useState<RFQItem[]>(() => {
    if (initialBundle) {
      return initialBundle.items.map((it, idx) => ({
        id: 'item-init-' + idx,
        itemNumber: idx + 1,
        description: it.description,
        specification: it.specification,
        preferredBrand: it.preferredBrand || '',
        preferredBrands: it.preferredBrand ? it.preferredBrand.split('/').map(b => b.trim()) : [],
        allowAlternatives: true,
        quantity: it.quantity,
        unit: it.unit as any,
      }));
    }
    return DEFAULT_ELECTRICAL_ITEMS;
  });

  const [documents, setDocuments] = useState<RFQDocument[]>([]);
  const [targetScope, setTargetScope] = useState<'all_verified' | 'local_emirate_only' | 'preferred_only'>('all_verified');
  const [notes, setNotes] = useState('All materials must be genuine factory-sealed with valid mill test certificates and UAE authority compliance.');

  // Add brand to item
  const handleAddBrand = (itemIndex: number, brandName: string) => {
    const cleanBrand = brandName.trim();
    if (!cleanBrand) return;

    const next = [...items];
    const currentBrands = next[itemIndex].preferredBrands || [];
    if (!currentBrands.some(b => b.toLowerCase() === cleanBrand.toLowerCase())) {
      const updatedBrands = [...currentBrands, cleanBrand];
      next[itemIndex] = {
        ...next[itemIndex],
        preferredBrands: updatedBrands,
        preferredBrand: updatedBrands.join(' / ')
      };
      setItems(next);
    }
    // Clear search input
    setBrandSearchQueries(prev => ({ ...prev, [itemIndex]: '' }));
    setActiveDropdownIndex(null);
  };

  // Remove brand from item
  const handleRemoveBrand = (itemIndex: number, brandNameToRemove: string) => {
    const next = [...items];
    const currentBrands = next[itemIndex].preferredBrands || [];
    const updatedBrands = currentBrands.filter(b => b !== brandNameToRemove);
    next[itemIndex] = {
      ...next[itemIndex],
      preferredBrands: updatedBrands,
      preferredBrand: updatedBrands.join(' / ')
    };
    setItems(next);
  };

  // Quick Bundle Preset loader
  const handleSelectBundlePreset = (bundle: QuickBundle) => {
    setTitle(bundle.title);
    setCategory(bundle.category);
    setItems(
      bundle.items.map((it, idx) => ({
        id: 'item-bundle-' + idx,
        itemNumber: idx + 1,
        description: it.description,
        specification: it.specification,
        preferredBrand: it.preferredBrand || '',
        preferredBrands: it.preferredBrand ? it.preferredBrand.split('/').map(b => b.trim()) : [],
        allowAlternatives: true,
        quantity: it.quantity,
        unit: it.unit as any,
      }))
    );
  };

  const handleSimulatePhotoUpload = () => {
    setPhotoPreview('https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=600&auto=format&fit=crop&q=80');
    setTitle('Electrical Material List RFQ - ' + deliveryEmirate);
    setCategory('LV Power Cables & Building Wires');
    setItems([
      {
        id: 'item-photo-1',
        itemNumber: 1,
        description: 'Items as specified in attached handwritten electrical schedule',
        specification: 'Refer to attached high-resolution list image',
        preferredBrands: [],
        preferredBrand: '',
        allowAlternatives: true,
        quantity: 1,
        unit: 'sets',
        notes: 'Attached photo list'
      }
    ]);
  };

  const handleAddItem = () => {
    const newItem: RFQItem = {
      id: 'item-' + Date.now(),
      itemNumber: items.length + 1,
      description: '',
      specification: '',
      preferredBrand: '',
      preferredBrands: [],
      allowAlternatives: true,
      quantity: 100,
      unit: 'm',
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index: number, field: keyof RFQItem, val: any) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: val };
    setItems(next);
  };

  const handleFinalPublish = () => {
    const payload = {
      buyerCompanyId: buyerCompany.id,
      buyerCompanyName: buyerCompany.name,
      buyerContactName: buyerCompany.contactName,
      buyerPhone: buyerCompany.phone,
      buyerEmail: buyerCompany.email,
      title,
      projectName: title,
      projectLocation: deliveryAddress + ', ' + deliveryEmirate,
      deliveryEmirate,
      deliveryAddress,
      category,
      requiredDeliveryDate,
      closingDate,
      priority,
      authorityApproval,
      paymentTermsPreference,
      targetSupplierScope: targetScope,
      targetSupplierId: selectedTargetSupplier?.id,
      targetSupplierName: selectedTargetSupplier?.name,
      notes: notes + (photoPreview ? ' [Includes photo attachment]' : ''),
      photoUploadUrl: photoPreview || undefined,
      isQuickTemplate: false,
      items,
      documents,
    };
    onPublish(payload);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Method Selector */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-md space-y-3">
        <div>
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
            Choose How You Want to Create Your RFQ
          </span>
          <h3 className="text-base font-bold text-white">High-Speed UAE Electrical Procurement</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setWizardMode('detailed_boq');
              setStep(1);
            }}
            className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
              wizardMode === 'detailed_boq'
                ? 'bg-brand-600 text-white border-brand-400 shadow-md font-bold'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700/60'
            }`}
          >
            <FileText className="w-5 h-5 text-sky-300 shrink-0 mt-0.5" />
            <div>
              <span className="block font-bold">Custom Electrical Line-Item BOQ</span>
              <span className="text-[10px] text-slate-300 font-normal">Search and select approved brands, specs, and quantities</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setWizardMode('photo_upload');
              setStep(1);
            }}
            className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
              wizardMode === 'photo_upload'
                ? 'bg-brand-600 text-white border-brand-400 shadow-md font-bold'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700/60'
            }`}
          >
            <Camera className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
            <div>
              <span className="block font-bold">Snap Photo of BOQ / Previous Invoice</span>
              <span className="text-[10px] text-slate-300 font-normal">Handwritten cable schedule, single-line diagram, or paper bill</span>
            </div>
          </button>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-subtle flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
            {step}
          </span>
          <span className="font-bold text-slate-900">
            {step === 1 ? '1. Material Requirement & Delivery Details' : '2. Review & Broadcast to Verified Stockists'}
          </span>
        </div>
        <span className="text-slate-400 font-medium">Step {step} of 2</span>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <Card className="animate-in fade-in duration-150">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {wizardMode === 'photo_upload' ? 'Upload Photo & Delivery Site' : 'Select Package & Delivery Site'}
                </h3>
                <p className="text-xs text-slate-500">
                  {wizardMode === 'photo_upload'
                    ? 'Take a photo of your paper material list or existing supplier invoice to get competing wholesale bids.'
                    : 'Enter your project details and material items.'}
                </p>
              </div>

              {/* 1-Click Fast Bundle Presets */}
              {wizardMode !== 'photo_upload' && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Fast Presets:</span>
                  {initialQuickBundles.slice(0, 3).map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => handleSelectBundlePreset(b)}
                      className="text-[10px] font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 px-2 py-1 rounded-md border border-brand-200 transition-colors"
                    >
                      + {b.title.split(' ')[0]} {b.title.split(' ')[1]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6 text-xs">

            {/* Photo Upload Mode */}
            {wizardMode === 'photo_upload' && (
              <div className="space-y-3">
                <label className="font-bold text-slate-800 block">
                  Photo of Handwritten List or Previous Invoice:
                </label>

                {photoPreview ? (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                    <img
                      src={photoPreview}
                      alt="Handwritten RFQ"
                      className="w-36 h-28 object-cover rounded-xl border border-slate-300 shadow-sm"
                    />
                    <div className="space-y-1 text-xs flex-1">
                      <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Photo Attached Successfully</span>
                      </div>
                      <p className="text-slate-500 text-[11px]">
                        Suppliers will view this photo directly to submit itemized line prices.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPhotoPreview(null)}
                      >
                        Change Photo
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={handleSimulatePhotoUpload}
                    className="border-2 border-dashed border-brand-400 hover:border-brand-600 p-8 rounded-2xl text-center bg-brand-50/40 hover:bg-brand-50/70 transition-all cursor-pointer"
                  >
                    <Camera className="w-10 h-10 text-brand-600 mx-auto mb-2" />
                    <h4 className="font-bold text-slate-900 text-sm">Click to Snap or Upload Photo of Material List</h4>
                    <p className="text-slate-500 text-xs mt-1">Supports JPEG, PNG from mobile camera or invoice scans</p>
                    <div className="mt-3">
                      <span className="inline-block bg-brand-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                        📸 Tap to Upload Photo List
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Section A: Title, Category & Authority Approval */}
            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-700 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> Requirement & Specification Standards
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="font-semibold text-slate-700 block mb-1">RFQ Title / Requirement Name *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-brand-500 bg-white"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="font-semibold text-slate-700 block mb-1">Procurement Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-brand-500 bg-white"
                  >
                    <option value="LV Power Cables & Building Wires">⚡ LV Power Cables & Building Wires</option>
                    <option value="MV & HV Power Cables (11kV - 132kV)">⚡ MV & HV Power Cables (11kV - 132kV)</option>
                    <option value="Switchgear, DBs & Circuit Breakers">🔌 Switchgear, DBs & Circuit Breakers</option>
                    <option value="Conduits, Trays & Cable Containment">🛡️ Conduits, Trays & Cable Containment</option>
                    <option value="Fire-Resistant, LSZH & Instrument Cables">🔥 Fire-Resistant, LSZH & Instrument Cables</option>
                    <option value="Earthing & Lightning Protection Systems">⚡ Earthing & Lightning Protection Systems</option>
                    <option value="Commercial, Industrial & Emergency Lighting">💡 Commercial, Industrial & Emergency Lighting</option>
                    <option value="Wiring Accessories, Sockets & Industrial Plugs">🔌 Wiring Accessories, Sockets & Industrial Plugs</option>
                    <option value="Transformers, Substations & RMU Units">⚡ Transformers, Substations & RMU Units</option>
                    <option value="Solar PV Equipment, Inverters & UPS Power">☀️ Solar PV Equipment, Inverters & UPS Power</option>
                  </select>
                </div>

                <div className="sm:col-span-1">
                  <label className="font-semibold text-slate-700 block mb-1">
                    Authority Compliance *
                  </label>
                  <select
                    value={authorityApproval}
                    onChange={(e) => setAuthorityApproval(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-bold text-brand-700 focus:ring-2 focus:ring-brand-500 bg-white"
                  >
                    <option value="DEWA Approved (Dubai Standard)">🏛️ DEWA Approved (Dubai)</option>
                    <option value="SEWA Approved (Sharjah Standard)">🏛️ SEWA Approved (Sharjah)</option>
                    <option value="FEWA Approved (Northern Emirates)">🏛️ FEWA Approved (Northern Emirates)</option>
                    <option value="ADDC / AADC Approved (Abu Dhabi)">🏛️ ADDC / AADC Approved (Abu Dhabi)</option>
                    <option value="Civil Defense Approved (DCD)">🔥 Civil Defense Approved (DCD)</option>
                    <option value="Standard Commercial Spec">📦 Standard Commercial Spec</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section B: Delivery Location & Terms */}
            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Delivery Location & Commercial Terms
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Delivery Emirate *</label>
                  <select
                    value={deliveryEmirate}
                    onChange={(e) => setDeliveryEmirate(e.target.value as Emirate)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-bold text-brand-700 focus:ring-2 focus:ring-brand-500 bg-white"
                  >
                    <option value="Dubai">Dubai</option>
                    <option value="Sharjah">Sharjah</option>
                    <option value="Ajman">Ajman</option>
                  </select>
                </div>

                <div className="lg:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Delivery Site / Gate Address *</label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="e.g. Al Quoz Industrial Loading Bay 3, Dubai"
                    className="w-full p-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Required Delivery Date *</label>
                  <input
                    type="date"
                    required
                    value={requiredDeliveryDate}
                    onChange={(e) => setRequiredDeliveryDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-brand-500 bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Turnaround Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-brand-500 bg-white"
                  >
                    <option value="normal">Normal (Standard 48h quotation)</option>
                    <option value="urgent">⚡ Urgent (Express 24h quotation)</option>
                  </select>
                </div>
              </div>

              {/* Payment Terms Preference */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Payment Terms Preference</label>
                <select
                  value={paymentTermsPreference}
                  onChange={(e) => setPaymentTermsPreference(e.target.value)}
                  className="w-full sm:w-80 p-2.5 rounded-lg border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-brand-500 bg-white"
                >
                  <option value="PDC 30 Days Credit">PDC 30 Days Credit</option>
                  <option value="PDC 60 Days Credit">PDC 60 Days Credit</option>
                  <option value="100% Advance Payment (Maximum Discount)">100% Advance Payment (Maximum Discount)</option>
                  <option value="Cash Against Delivery (CAD)">Cash Against Delivery (CAD)</option>
                  <option value="Letter of Credit (LC)">Letter of Credit (LC)</option>
                </select>
              </div>
            </div>

            {/* Section C: Material Line Items with Searchable Multi-Brand Selection */}
            {wizardMode !== 'photo_upload' && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Material Items Included ({items.length}):
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Search and select one or multiple approved brands for each material item.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddItem}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                    className="font-bold"
                  >
                    Add Item
                  </Button>
                </div>

                <div className="space-y-3.5">
                  {items.map((item, idx) => {
                    const selectedBrands = item.preferredBrands || [];
                    const searchVal = brandSearchQueries[idx] || '';
                    const isDropdownOpen = activeDropdownIndex === idx && searchVal.trim().length > 0;

                    // Filter master brand list matching typed query
                    const filteredBrands = MASTER_ELECTRICAL_BRANDS.filter(
                      b => b.toLowerCase().includes(searchVal.toLowerCase()) && !selectedBrands.includes(b)
                    );

                    return (
                      <div 
                        key={item.id || idx} 
                        className="p-4 bg-white rounded-2xl border border-slate-200 shadow-subtle hover:border-slate-300 transition-all space-y-3"
                      >
                        {/* Item Card Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-brand-50 text-brand-700 font-extrabold text-[11px] flex items-center justify-center border border-brand-200">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-slate-800 text-xs">Line Item #{idx + 1}</span>
                          </div>

                          {items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              className="text-slate-400 hover:text-rose-600 p-1 flex items-center gap-1 text-[11px] font-semibold transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Remove
                            </button>
                          )}
                        </div>

                        {/* Row 1: Description, Quantity & Electrical Unit */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                          <div className="sm:col-span-6">
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Material Description / Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={item.description}
                              onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                              placeholder="e.g. 4C x 16mm² XLPE/SWA/PVC Copper Armoured Cable..."
                              className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-500"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Quantity *
                            </label>
                            <input
                              type="number"
                              min="1"
                              required
                              value={item.quantity}
                              onChange={(e) => handleItemChange(idx, 'quantity', parseFloat(e.target.value) || 1)}
                              className="w-full p-2 rounded-lg border border-slate-200 text-xs font-black text-center focus:ring-2 focus:ring-brand-500"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Electrical Unit *
                            </label>
                            <select
                              value={item.unit}
                              onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                              className="w-full p-2 rounded-lg border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-brand-500 bg-white"
                            >
                              <option value="m">Meters (m)</option>
                              <option value="pcs">Pieces (pcs)</option>
                              <option value="lengths">Lengths (3m / 6m)</option>
                              <option value="coils">Coils / Rolls</option>
                              <option value="drums">Wooden Cable Drums</option>
                              <option value="sets">Complete Sets</option>
                              <option value="boxes">Boxes / Cartons</option>
                              <option value="tons">Metric Tons</option>
                            </select>
                          </div>
                        </div>

                        {/* Row 2: Technical Specifications & Sizing */}
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Technical Specification & Sizing
                          </label>
                          <input
                            type="text"
                            value={item.specification}
                            onChange={(e) => handleItemChange(idx, 'specification', e.target.value)}
                            placeholder="e.g. BS 5467, 600/1000V, stranded annealed copper, galvanized steel wire armoured..."
                            className="w-full p-2 rounded-lg border border-slate-200 text-xs text-slate-700 focus:ring-1 focus:ring-brand-500"
                          />
                        </div>

                        {/* Row 3: Searchable Multi-Brand Selection (No pre-built suggested buttons) */}
                        <div className="bg-slate-50/90 p-3 rounded-xl border border-slate-200 space-y-2.5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                            <label className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                              <Tag className="w-3.5 h-3.5 text-brand-600" />
                              <span>Search & Select Brand(s):</span>
                            </label>

                            {/* Equal & Approved Alternatives Toggle */}
                            <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={item.allowAlternatives ?? true}
                                onChange={(e) => handleItemChange(idx, 'allowAlternatives', e.target.checked)}
                                className="w-3.5 h-3.5 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                              />
                              <span className="text-[11px] font-semibold text-slate-700">
                                Equal & Approved Equivalents Welcome
                              </span>
                            </label>
                          </div>

                          {/* Selected Brand Badges */}
                          {selectedBrands.length > 0 ? (
                            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                              {selectedBrands.map((brandName) => (
                                <span
                                  key={brandName}
                                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-brand-600 text-white border border-brand-700 shadow-sm inline-flex items-center gap-1.5"
                                >
                                  <Check className="w-3 h-3 stroke-[3]" />
                                  <span>{brandName}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveBrand(idx, brandName)}
                                    className="hover:text-rose-200 transition-colors ml-0.5"
                                    title="Remove this brand"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-400 italic">
                              No specific brand selected yet. Type below to search and add one or multiple brands.
                            </p>
                          )}

                          {/* Searchable Brand Input & Add Button */}
                          <div className="relative pt-0.5">
                            <div className="flex items-center gap-2 max-w-md">
                              <div className="relative flex-1">
                                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                                <input
                                  type="text"
                                  value={searchVal}
                                  onChange={(e) => {
                                    setBrandSearchQueries(prev => ({ ...prev, [idx]: e.target.value }));
                                    setActiveDropdownIndex(idx);
                                  }}
                                  onFocus={() => setActiveDropdownIndex(idx)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleAddBrand(idx, searchVal);
                                    }
                                  }}
                                  placeholder="Search brand name... (e.g. Ducab, Schneider, Decoduct)"
                                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-brand-500"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddBrand(idx, searchVal)}
                                className="text-xs font-bold py-1.5 px-3 h-8 shrink-0"
                              >
                                + Add Brand
                              </Button>
                            </div>

                            {/* Autocomplete Dropdown List - ONLY appears when user is searching */}
                            {isDropdownOpen && filteredBrands.length > 0 && (
                              <div className="absolute z-20 mt-1 w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden py-1 max-h-48 overflow-y-auto">
                                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100">
                                  Matching Brands:
                                </div>
                                {filteredBrands.map((b) => (
                                  <button
                                    key={b}
                                    type="button"
                                    onClick={() => handleAddBrand(idx, b)}
                                    className="w-full text-left px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-brand-50 hover:text-brand-700 transition-colors flex items-center justify-between"
                                  >
                                    <span>{b}</span>
                                    <span className="text-[10px] font-bold text-brand-600">+ Select</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Row 4: Optional Notes */}
                        <div>
                          <input
                            type="text"
                            value={item.notes || ''}
                            onChange={(e) => handleItemChange(idx, 'notes', e.target.value)}
                            placeholder="Special instructions: e.g. Drum length 500m preferred, test certificate required..."
                            className="w-full p-1.5 rounded-lg border border-slate-200 text-[11px] text-slate-500 italic bg-white"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* General Commercial Instructions */}
            <div className="pt-2">
              <label className="font-semibold text-slate-700 block mb-1">
                General Commercial Instructions to Stockists
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 text-xs text-slate-700 focus:ring-2 focus:ring-brand-500"
              />
            </div>

          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button 
              variant="primary" 
              size="lg" 
              onClick={() => setStep(2)} 
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="font-bold"
            >
              Continue to Supplier Matching
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 2: Review & Publish */}
      {step === 2 && (
        <Card className="animate-in fade-in duration-150">
          <CardHeader>
            <div>
              <h3 className="text-base font-bold text-slate-900">Step 2: Confirm & Broadcast to Verified UAE Stockists</h3>
              <p className="text-xs text-slate-500">Your RFQ will be distributed to verified traders matching {category} in {deliveryEmirate}.</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 text-xs">
            
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-extrabold text-base shrink-0">
                  5
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950 text-sm">
                    {selectedTargetSupplier 
                      ? `Delivering Directly to ${selectedTargetSupplier.name} + 4 Matched Stockists`
                      : `5 Verified UAE Stockists Ready to Compete`}
                  </h4>
                  <p className="text-emerald-700 text-xs">
                    Stockists in {deliveryEmirate} & Sharjah Industrial will receive your RFQ immediately on their sales desk under the <strong className="font-bold">Fastest 5 Bids Rule</strong>.
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 shrink-0">
                ⚡ 24h Quoting SLA
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block font-medium">RFQ Title:</span>
                <strong className="text-slate-900 text-sm">{title}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Delivery Destination:</span>
                <strong className="text-slate-900">{deliveryAddress} ({deliveryEmirate})</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Authority Compliance:</span>
                <span className="font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200 inline-block">
                  {authorityApproval}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Payment Terms:</span>
                <strong className="text-slate-800">{paymentTermsPreference}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Target Category:</span>
                <span className="font-semibold text-brand-700">{category}</span>
              </div>
            </div>

            {photoPreview ? (
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-3">
                <img src={photoPreview} alt="Attached list" className="w-16 h-14 object-cover rounded-lg border" />
                <div>
                  <span className="font-bold text-slate-800">Handwritten List Photo Attached</span>
                  <p className="text-[11px] text-slate-500">Suppliers will price directly against this photo.</p>
                </div>
              </div>
            ) : (
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Material Items & Approved Brands Summary ({items.length}):</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">#</th>
                        <th className="p-2.5">Description</th>
                        <th className="p-2.5">Approved Brands</th>
                        <th className="p-2.5">Quantity & Unit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5 font-mono text-slate-400">{idx + 1}</td>
                          <td className="p-2.5 font-semibold text-slate-900">
                            {item.description}
                            {item.specification && (
                              <p className="text-[11px] text-slate-500 font-normal">{item.specification}</p>
                            )}
                          </td>
                          <td className="p-2.5">
                            <div className="flex flex-wrap gap-1">
                              {(item.preferredBrands && item.preferredBrands.length > 0) ? (
                                item.preferredBrands.map(b => (
                                  <span key={b} className="bg-brand-50 text-brand-700 border border-brand-200 font-bold px-2 py-0.5 rounded text-[10px]">
                                    {b}
                                  </span>
                                ))
                              ) : (
                                <span className="bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded text-[10px]">
                                  {item.preferredBrand || 'Open Spec (Any Brand)'}
                                </span>
                              )}
                              {item.allowAlternatives && (
                                <span className="text-[10px] text-emerald-700 font-bold self-center">
                                  (Equiv. OK)
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-2.5 font-bold text-slate-800">{item.quantity} {item.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                100% Free for Buyers. The first 5 stockists to submit itemized prices will deliver directly to your dashboard within 24 hours.
              </span>
            </div>

          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="outline" onClick={() => setStep(1)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Edit
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleFinalPublish}
              leftIcon={<Zap className="w-5 h-5 text-amber-300 fill-amber-300" />}
              className="bg-brand-600 hover:bg-brand-700 shadow-md font-bold px-6"
            >
              Broadcast RFQ to Suppliers
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};