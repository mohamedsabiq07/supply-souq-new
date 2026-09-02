import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Emirate } from '../../types';
import { 
  Building2, 
  Store, 
  ShieldCheck, 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle,
  Lock,
  Phone,
  Mail,
  MapPin,
  User
} from 'lucide-react';

interface RegisterPageProps {
  onSuccess: (targetView?: string) => void;
  onNavigateToLogin?: () => void;
}

const CATEGORY_OPTIONS = [
  'LV Power Cables & Building Wires',
  'MV & HV Power Cables (11kV - 132kV)',
  'Switchgear, DBs & Circuit Breakers',
  'Conduits, Trays & Cable Containment',
  'Fire-Resistant, LSZH & Instrument Cables',
  'Earthing & Lightning Protection Systems',
  'Commercial, Industrial & Emergency Lighting',
  'Wiring Accessories, Sockets & Industrial Plugs',
  'Transformers, Substations & RMU Units',
  'Solar PV Equipment, Inverters & UPS Power'
];

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSuccess, onNavigateToLogin }) => {
  const { signUpBuyer, signUpSupplier } = useAuth();
  const [accountType, setAccountType] = useState<'buyer' | 'supplier'>('buyer');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Buyer Form States
  const [buyerCompany, setBuyerCompany] = useState('');
  const [procurementEngineer, setProcurementEngineer] = useState('');
  const [buyerUsername, setBuyerUsername] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('+971 ');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [buyerEmirate, setBuyerEmirate] = useState<Emirate>('Dubai');
  const [buyerPassword, setBuyerPassword] = useState('');

  // Supplier Form States
  const [supplierCompany, setSupplierCompany] = useState('');
  const [supplierLegalName, setSupplierLegalName] = useState('');
  const [supplierUsername, setSupplierUsername] = useState('');
  const [tradeLicenseNumber, setTradeLicenseNumber] = useState('');
  const [tradeLicenseFileName, setTradeLicenseFileName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [supplierPhone, setSupplierPhone] = useState('+971 ');
  const [supplierEmail, setSupplierEmail] = useState('');
  const [supplierEmirate, setSupplierEmirate] = useState<Emirate>('Dubai');
  const [industrialZone, setIndustrialZone] = useState('Al Quoz Industrial Area 3');
  const [supplierAddress, setSupplierAddress] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'LV & MV Power Cables & Wires',
    'Switchgear, MCBs & Distribution Boards'
  ]);
  const [supplierPassword, setSupplierPassword] = useState('');

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTradeLicenseFileName(e.target.files[0].name);
    }
  };

  const handleSubmitBuyer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerUsername.trim()) {
      setErrorMsg('Please choose a username for your account.');
      return;
    }
    if (!buyerPassword || buyerPassword.length < 6) {
      setErrorMsg('Please enter a password with at least 6 characters.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const res = await signUpBuyer({
      companyName: buyerCompany,
      procurementEngineerName: procurementEngineer,
      username: buyerUsername.trim().toLowerCase(),
      phone: buyerPhone,
      email: buyerEmail,
      address: buyerAddress,
      emirate: buyerEmirate,
      password: buyerPassword,
    });

    setLoading(false);
    if (res.success) {
      onSuccess('buyer-dashboard');
    } else {
      setErrorMsg(res.error || 'Failed to create account');
    }
  };

  const handleSubmitSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierUsername.trim()) {
      setErrorMsg('Please choose a username for your sales desk.');
      return;
    }
    if (!tradeLicenseNumber) {
      setErrorMsg('Trade License Number is mandatory for supplier safety and verification.');
      return;
    }
    if (!supplierPassword || supplierPassword.length < 6) {
      setErrorMsg('Please enter a password with at least 6 characters.');
      return;
    }
    if (selectedCategories.length === 0) {
      setErrorMsg('Please select at least one material category you supply.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const res = await signUpSupplier({
      companyName: supplierCompany,
      legalName: supplierLegalName || supplierCompany,
      username: supplierUsername.trim().toLowerCase(),
      tradeLicenseNumber: tradeLicenseNumber,
      tradeLicenseDocUrl: tradeLicenseFileName ? `/docs/${tradeLicenseFileName}` : '/docs/trade-license.pdf',
      contactPersonName: contactPerson,
      phone: supplierPhone,
      email: supplierEmail,
      address: supplierAddress,
      emirate: supplierEmirate,
      industrialZone: industrialZone,
      categories: selectedCategories,
      password: supplierPassword,
    });

    setLoading(false);
    if (res.success) {
      onSuccess('supplier-dashboard');
    } else {
      setErrorMsg(res.error || 'Failed to register supplier');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Card className="p-6 sm:p-8 space-y-6 shadow-xl border-slate-200">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1 rounded-full border border-brand-200">
            <ShieldCheck className="w-4 h-4 text-brand-600" /> UAE Verified B2B Network (Dubai • Sharjah • Ajman)
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create Your Corporate Account
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Connect directly with verified UAE electrical, plumbing, HVAC & MEP stockists and contractors.
          </p>
        </div>

        {/* Role Toggle */}
        <div className="grid grid-cols-2 gap-3 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setAccountType('buyer');
              setErrorMsg('');
            }}
            className={`py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
              accountType === 'buyer'
                ? 'bg-white shadow-md text-brand-700 font-extrabold border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-brand-600" />
            <span>Buyer / Contractor / MEP</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAccountType('supplier');
              setErrorMsg('');
            }}
            className={`py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
              accountType === 'supplier'
                ? 'bg-white shadow-md text-amber-900 font-extrabold border border-amber-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store className="w-4 h-4 text-amber-600" />
            <span>Verified Stockist / Supplier</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ---------------- BUYER SIGNUP FORM ---------------- */}
        {accountType === 'buyer' ? (
          <form onSubmit={handleSubmitBuyer} className="space-y-4 text-xs">
            <div className="bg-brand-50/50 p-3 rounded-xl border border-brand-100 flex items-center gap-2 text-brand-800">
              <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
              <span>Free Buyer Plan: Compare up to <strong>5 Live Quotations</strong> per RFQ with instant price benchmark.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex MEP & Contracting LLC"
                  value={buyerCompany}
                  onChange={(e) => setBuyerCompany(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Procurement Engineer / Contact Person *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eng. Tariq Mansour"
                  value={procurementEngineer}
                  onChange={(e) => setProcurementEngineer(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> UAE Mobile / Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+971 5X XXX XXXX"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Work / Corporate Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="procurement@company.ae"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Primary Operating Emirate *</label>
                <select
                  value={buyerEmirate}
                  onChange={(e) => setBuyerEmirate(e.target.value as Emirate)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Dubai">Dubai</option>
                  <option value="Sharjah">Sharjah</option>
                  <option value="Ajman">Ajman</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Office / Site Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Office 402, Business Bay, Dubai"
                  value={buyerAddress}
                  onChange={(e) => setBuyerAddress(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-brand-600" /> Username for Login *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. sabiq or sabiq07"
                  value={buyerUsername}
                  onChange={(e) => setBuyerUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ''))}
                  className="w-full p-2.5 rounded-lg border-2 border-brand-300 focus:ring-2 focus:ring-brand-500 font-bold text-slate-900 bg-brand-50/20"
                />
                <p className="text-[10px] text-slate-500 mt-0.5">Choose a unique username to easily login.</p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-slate-400" /> Account Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={buyerPassword}
                  onChange={(e) => setBuyerPassword(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 font-medium"
                />
                <p className="text-[10px] text-slate-500 mt-0.5">Use this same password for your portal login.</p>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full py-3 text-sm font-bold bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-600/20"
            >
              {loading ? 'Registering Buyer Account...' : 'Complete Buyer Registration (Free)'}
            </Button>
          </form>
        ) : (
          /* ---------------- SUPPLIER SIGNUP FORM ---------------- */
          <form onSubmit={handleSubmitSupplier} className="space-y-4 text-xs">
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 flex items-center gap-2 text-amber-900">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
              <span><strong>Supplier Safety & Authenticity:</strong> Valid UAE Trade License verification ensures high trust and direct contractor PO awards.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Company Trading Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Al Noor Electrical Trading LLC"
                  value={supplierCompany}
                  onChange={(e) => setSupplierCompany(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Company Legal Name (on Trade License)</label>
                <input
                  type="text"
                  placeholder="e.g. Al Noor Electrical & Lighting LLC"
                  value={supplierLegalName}
                  onChange={(e) => setSupplierLegalName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1 text-amber-900 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-amber-600" /> UAE Trade License Number * (Mandatory)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TL-551029 or CN-1094821"
                  value={tradeLicenseNumber}
                  onChange={(e) => setTradeLicenseNumber(e.target.value)}
                  className="w-full p-2.5 rounded-lg border-2 border-amber-300 focus:ring-2 focus:ring-amber-500 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Trade License Copy / Certificate</label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                  />
                  <div className="w-full p-2.5 rounded-lg border border-dashed border-slate-300 bg-slate-50 flex items-center justify-between text-slate-600">
                    <span className="truncate">{tradeLicenseFileName || 'Upload PDF or Image'}</span>
                    <UploadCloud className="w-4 h-4 text-amber-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Authorized Person Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Kumar (Sales Manager)"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> UAE Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+971 5X XXX XXXX"
                  value={supplierPhone}
                  onChange={(e) => setSupplierPhone(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Emirate *</label>
                <select
                  value={supplierEmirate}
                  onChange={(e) => setSupplierEmirate(e.target.value as Emirate)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800"
                >
                  <option value="Dubai">Dubai</option>
                  <option value="Sharjah">Sharjah</option>
                  <option value="Ajman">Ajman</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Industrial Zone / Area *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Al Quoz 3 / Industrial Area 12"
                  value={industrialZone}
                  onChange={(e) => setIndustrialZone(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Sales Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="sales@supplier.ae"
                  value={supplierEmail}
                  onChange={(e) => setSupplierEmail(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Warehouse Address / Street *</label>
              <input
                type="text"
                required
                placeholder="e.g. Street 8, Warehouse 12, Al Quoz Industrial 3, Dubai"
                value={supplierAddress}
                onChange={(e) => setSupplierAddress(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 font-medium"
              />
            </div>

            {/* Material Categories Checklist */}
            <div>
              <label className="font-bold text-slate-700 block mb-2">Material Categories Handled *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                {CATEGORY_OPTIONS.map((cat) => {
                  const isChecked = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`text-left p-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                        isChecked
                          ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span className="truncate">{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-amber-600" /> Username for Sales Desk Login *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. alnoor_sales or sabiq"
                  value={supplierUsername}
                  onChange={(e) => setSupplierUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ''))}
                  className="w-full p-2.5 rounded-lg border-2 border-amber-300 focus:ring-2 focus:ring-amber-500 font-bold text-slate-900 bg-amber-50/30"
                />
                <p className="text-[10px] text-slate-500 mt-0.5">Choose a unique username for easy login.</p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-slate-400" /> Account Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={supplierPassword}
                  onChange={(e) => setSupplierPassword(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 font-medium"
                />
                <p className="text-[10px] text-slate-500 mt-0.5">Use this same password for your portal login.</p>
              </div>
            </div>

            <Button
              type="submit"
              variant="amber"
              disabled={loading}
              className="w-full py-3 text-sm font-extrabold shadow-lg shadow-amber-500/20"
            >
              {loading ? 'Registering Supplier...' : 'Submit Supplier Account for Verification'}
            </Button>
          </form>
        )}

        {/* Footer info */}
        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => {
              if (onNavigateToLogin) onNavigateToLogin();
              else onSuccess();
            }}
            className="text-brand-600 font-bold hover:underline"
          >
            Login to your portal
          </button>
        </div>
      </Card>
    </div>
  );
};