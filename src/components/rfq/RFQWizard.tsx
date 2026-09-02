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
  UploadCloud, 
  FileText, 
  Zap, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Camera,
  Layers,
  MapPin,
  Clock,
  ShieldCheck,
  Building2,
  X
} from 'lucide-react';

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

  // Step 1: Details
  const [title, setTitle] = useState(
    initialBundle 
      ? initialBundle.title 
      : targetSupplier 
        ? `Material Requirement for ${targetSupplier.name}`
        : 'LV Copper Power Cables & Switchgear Requirement'
  );
  const [projectName, setProjectName] = useState('Commercial Fit-Out Project');
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

  // Photo Mode state
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Step 2: Line Items
  const [items, setItems] = useState<RFQItem[]>(() => {
    if (initialBundle) {
      return initialBundle.items.map((it, idx) => ({
        id: 'item-init-' + idx,
        itemNumber: idx + 1,
        description: it.description,
        specification: it.specification,
        preferredBrand: it.preferredBrand || '',
        quantity: it.quantity,
        unit: it.unit as any,
      }));
    }
    return [
      {
        id: 'item-new-1',
        itemNumber: 1,
        description: 'Neutral Floor Cleaner & Sanitizer (5L Drum)',
        specification: 'Concentrated neutral lavender fragrance floor cleaner',
        preferredBrand: 'Diversey / Clorox Pro / Purex',
        quantity: 40,
        unit: 'drums',
        notes: 'Monthly replenishment'
      },
      {
        id: 'item-new-2',
        itemNumber: 2,
        description: 'Jumbo Toilet Paper Rolls 2-Ply 300m (6 Rolls/Carton)',
        specification: '100% Virgin wood pulp, 2-ply embossed',
        preferredBrand: 'Fine / Kleenex / Al Khaleej',
        quantity: 80,
        unit: 'cartons',
        notes: 'Carton pack'
      },
      {
        id: 'item-new-3',
        itemNumber: 3,
        description: 'Heavy Duty Black Trash Bags 50 Gallon (80x110cm)',
        specification: '50 Micron heavy grade LDPE, roll pack',
        preferredBrand: 'Falcon / Hotpack',
        quantity: 500,
        unit: 'pcs',
        notes: 'Rolls of 50'
      }
    ];
  });

  const [documents, setDocuments] = useState<RFQDocument[]>([]);
  const [targetScope, setTargetScope] = useState<'all_verified' | 'local_emirate_only' | 'preferred_only'>('all_verified');
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [notes, setNotes] = useState('Standard UAE wholesale commercial terms. Material Safety Data Sheets (MSDS) or test certificates required with delivery.');

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
        quantity: it.quantity,
        unit: it.unit as any,
      }))
    );
  };

  const handleSimulatePhotoUpload = () => {
    setPhotoPreview('https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=600&auto=format&fit=crop&q=80');
    setTitle('Handwritten Supply List RFQ - ' + deliveryEmirate);
    setCategory('FM & Cleaning Chemicals');
    setItems([
      {
        id: 'item-photo-1',
        itemNumber: 1,
        description: 'Items as specified in attached handwritten photo list',
        specification: 'Refer to attached high-resolution list image',
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
      quantity: 10,
      unit: 'pcs',
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
      projectName,
      projectLocation: deliveryAddress + ', ' + deliveryEmirate,
      deliveryEmirate,
      deliveryAddress,
      category,
      requiredDeliveryDate,
      closingDate,
      priority,
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
          <h3 className="text-base font-bold text-white">Super-Simple 30-Second Procurement</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
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
              <span className="block font-bold">Snap Photo of List / Invoice</span>
              <span className="text-[10px] text-slate-300 font-normal">Handwritten material list, PDF schedule, or paper bill</span>
            </div>
          </button>

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
              <span className="block font-bold">Custom Line-Item BOQ</span>
              <span className="text-[10px] text-slate-300 font-normal">Type material specs, preferred brands & quantities</span>
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
            {step === 1 ? '1. Material Requirement & Delivery Location' : '2. Review & Broadcast to Verified Suppliers'}
          </span>
        </div>
        <span className="text-slate-400">Step {step} of 2</span>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <Card className="animate-in fade-in duration-150">
          <CardHeader>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {wizardMode === 'photo_upload' ? 'Upload Photo & Delivery Site' : 'Select Package & Delivery Site'}
              </h3>
              <p className="text-xs text-slate-500">
                {wizardMode === 'photo_upload'
                  ? 'Take a photo of your paper list or existing supplier invoice to get competing wholesale quotes.'
                  : 'Enter your project details and material items.'}
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 text-xs">

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

            {/* Title & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">RFQ Title / Requirement Name *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
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
            </div>

            {/* Target Supplier Recipient / Optional Selection */}
            <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                      Target Supplier Recipient:
                    </span>
                    <strong className="text-slate-900 text-xs">
                      {selectedTargetSupplier 
                        ? `${selectedTargetSupplier.name} (${selectedTargetSupplier.industrialZone || selectedTargetSupplier.emirate})`
                        : 'Broadcast to Top 5 Verified UAE Stockists'}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedTargetSupplier?.id || ''}
                    onChange={(e) => {
                      const found = verifiedSuppliers.find(s => s.id === e.target.value);
                      setSelectedTargetSupplier(found || null);
                      if (found && found.categories && found.categories.length > 0) {
                        setCategory(found.categories[0]);
                      }
                    }}
                    className="p-1.5 rounded-lg border border-amber-300 bg-white text-xs font-semibold text-slate-800"
                  >
                    <option value="">-- Auto-Match 5 Best Stockists --</option>
                    {verifiedSuppliers.map((sup) => (
                      <option key={sup.id} value={sup.id}>
                        {sup.name} ({sup.emirate})
                      </option>
                    ))}
                  </select>
                  {selectedTargetSupplier && (
                    <button
                      type="button"
                      onClick={() => setSelectedTargetSupplier(null)}
                      className="text-slate-400 hover:text-slate-600 p-1"
                      title="Clear targeted supplier"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Location & Emirate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Delivery Emirate *</label>
                <select
                  value={deliveryEmirate}
                  onChange={(e) => setDeliveryEmirate(e.target.value as Emirate)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-bold text-brand-700 focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Dubai">Dubai</option>
                  <option value="Sharjah">Sharjah</option>
                  <option value="Ajman">Ajman</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Delivery Site / Gate Address *</label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="e.g. Loading Bay 2, Downtown Dubai"
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Required Date & Urgency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Required Delivery Date *</label>
                <input
                  type="date"
                  required
                  value={requiredDeliveryDate}
                  onChange={(e) => setRequiredDeliveryDate(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Turnaround Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-brand-500"
                >
                  <option value="normal">Normal (Standard 48h quotation)</option>
                  <option value="urgent">⚡ Urgent (Express 24h quotation needed)</option>
                </select>
              </div>
            </div>

            {/* Items List for Quick Bundle & Detailed BOQ */}
            {wizardMode !== 'photo_upload' && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800">
                    Material Items Included ({items.length}):
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddItem}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Add Item
                  </Button>
                </div>

                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={item.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-6 gap-2 items-center">
                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          required
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          placeholder="Item description / chemical / spec..."
                          className="w-full p-1.5 rounded-lg border border-slate-200 text-xs font-semibold focus:ring-1 focus:ring-brand-500"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', parseFloat(e.target.value) || 1)}
                          className="w-full p-1.5 rounded-lg border border-slate-200 text-xs font-bold text-center focus:ring-1 focus:ring-brand-500"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <select
                          value={item.unit}
                          onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                          className="w-full p-1.5 rounded-lg border border-slate-200 text-xs font-semibold focus:ring-1 focus:ring-brand-500"
                        >
                          <option value="drums">Drums (5L Canister)</option>
                          <option value="cartons">Cartons</option>
                          <option value="boxes">Boxes</option>
                          <option value="pcs">Pieces</option>
                          <option value="m">Meters</option>
                          <option value="sets">Sets</option>
                        </select>
                      </div>
                      <div className="sm:col-span-1 flex justify-end">
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button variant="primary" size="lg" onClick={() => setStep(2)} rightIcon={<ArrowRight className="w-4 h-4" />}>
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
              <h3 className="text-base font-bold text-slate-900">Step 2: Confirm & Broadcast to Verified UAE Suppliers</h3>
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
                      : `5 Verified UAE Suppliers Ready to Bid`}
                  </h4>
                  <p className="text-emerald-700 text-xs">
                    Stockists in {deliveryEmirate} & Sharjah Industrial will receive your RFQ immediately on their sales desk.
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
                <span className="text-slate-400 block font-medium">Target Supplier:</span>
                <strong className="text-brand-700 font-bold">
                  {selectedTargetSupplier ? selectedTargetSupplier.name : 'Top 5 Auto-Matched Stockists'}
                </strong>
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
                <h4 className="font-bold text-slate-900 mb-2">Material Items Summary ({items.length}):</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">#</th>
                        <th className="p-2.5">Description</th>
                        <th className="p-2.5">Quantity & Unit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-2.5 font-mono text-slate-400">{idx + 1}</td>
                          <td className="p-2.5 font-semibold text-slate-900">{item.description}</td>
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
                100% Free for Buyers. You will receive notification when verified suppliers submit prices.
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