import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Emirate, UserRole } from '../../types';
import { 
  User, 
  Building2, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Edit3, 
  Save, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Eye, 
  EyeOff, 
  Calendar,
  FolderOpen,
  Camera,
  Trash2
} from 'lucide-react';

const EMIRATES: Emirate[] = ['Dubai', 'Sharjah', 'Ajman'];

const INDUSTRIAL_ZONES = [
  'Al Quoz Industrial Area',
  'Sharjah Industrial Area 1-18',
  'Rolla / Sabkha Market',
  'Ras Al Khor Industrial Area',
  'Jebel Ali Free Zone (JAFZA)',
  'Dubai Industrial City (DIC)',
  'Ajman Industrial Area 1 & 2',
  'Al Jurf Industrial, Ajman',
  'Business Bay / Downtown Commercial',
  'Deira Wholesale Market',
  'Dubai Silicon Oasis (DSO)',
];

const AVAILABLE_CATEGORIES = [
  'LV & MV Power Cables & Wires',
  'Switchgear, MCBs & Distribution Boards',
  'Cable Containment, GI Trays & Ladders',
  'Commercial LED Lighting & Fixtures',
  'Earthing, Lightning & Surge Protection',
  'Wiring Accessories & Industrial Sockets',
  'Transformers & Substation Switchgear',
  'Fire Alarm & Life Safety Systems',
];

export const ProfilePage: React.FC = () => {
  const { currentUser, currentCompany, role, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'company' | 'security'>('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    // User fields
    fullName: currentUser.fullName || '',
    jobTitle: currentUser.jobTitle || '',
    email: currentUser.email || '',
    phone: currentUser.phone || '',
    username: currentUser.username || '',
    avatarUrl: currentUser.avatarUrl || '',
    password: currentUser.password || '',
    
    // Company fields
    companyName: currentCompany.name || '',
    legalName: currentCompany.legalName || currentCompany.name || '',
    tradeLicenseNumber: currentCompany.tradeLicenseNumber || '',
    emirate: (currentCompany.emirate || 'Dubai') as Emirate,
    industrialZone: currentCompany.industrialZone || INDUSTRIAL_ZONES[0],
    address: currentCompany.address || '',
    companyPhone: currentCompany.phone || '',
    companyEmail: currentCompany.email || '',
    website: currentCompany.website || '',
    yearsInBusiness: currentCompany.yearsInBusiness || 1,
    categories: currentCompany.categories || [],
  });

  // Keep form in sync when auth user changes
  useEffect(() => {
    setFormData({
      fullName: currentUser.fullName || '',
      jobTitle: currentUser.jobTitle || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      username: currentUser.username || '',
      avatarUrl: currentUser.avatarUrl || '',
      password: currentUser.password || '',
      companyName: currentCompany.name || '',
      legalName: currentCompany.legalName || currentCompany.name || '',
      tradeLicenseNumber: currentCompany.tradeLicenseNumber || '',
      emirate: (currentCompany.emirate || 'Dubai') as Emirate,
      industrialZone: currentCompany.industrialZone || INDUSTRIAL_ZONES[0],
      address: currentCompany.address || '',
      companyPhone: currentCompany.phone || '',
      companyEmail: currentCompany.email || '',
      website: currentCompany.website || '',
      yearsInBusiness: currentCompany.yearsInBusiness || 1,
      categories: currentCompany.categories || [],
    });
  }, [currentUser, currentCompany]);

  // Derive initials for avatar monogram
  const userInitials = (formData.fullName || currentUser.fullName || 'User')
    .trim()
    .split(/\s+/)
    .map((w: string) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageUploadError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setImageUploadError('Selected image is larger than 10MB. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const optimized = canvas.toDataURL('image/jpeg', 0.85);
          handleInputChange('avatarUrl', optimized);
        } else {
          handleInputChange('avatarUrl', readerEvent.target?.result as string);
        }
      };
      img.src = readerEvent.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemovePhoto = () => {
    handleInputChange('avatarUrl', '');
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleCategory = (cat: string) => {
    setFormData(prev => {
      const exists = prev.categories.includes(cat);
      if (exists) {
        return { ...prev, categories: prev.categories.filter(c => c !== cat) };
      } else {
        return { ...prev, categories: [...prev.categories, cat] };
      }
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    // Basic validation
    if (!formData.fullName.trim()) {
      setStatusMessage({ type: 'error', text: 'Full Name is required.' });
      return;
    }
    if (!formData.email.trim()) {
      setStatusMessage({ type: 'error', text: 'Corporate Email is required.' });
      return;
    }
    if (!formData.companyName.trim()) {
      setStatusMessage({ type: 'error', text: 'Company Trade Name is required.' });
      return;
    }

    setIsSaving(true);

    try {
      const result = await updateProfile(
        {
          fullName: formData.fullName.trim(),
          jobTitle: formData.jobTitle.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          username: formData.username.trim().toLowerCase(),
          avatarUrl: formData.avatarUrl,
          password: formData.password || currentUser.password,
          address: formData.address.trim(),
          emirate: formData.emirate,
          industrialZone: formData.industrialZone,
        },
        {
          name: formData.companyName.trim(),
          legalName: formData.legalName.trim() || formData.companyName.trim(),
          tradeLicenseNumber: formData.tradeLicenseNumber.trim(),
          emirate: formData.emirate,
          industrialZone: formData.industrialZone,
          address: formData.address.trim(),
          phone: formData.companyPhone.trim() || formData.phone.trim(),
          email: formData.companyEmail.trim() || formData.email.trim(),
          website: formData.website.trim(),
          yearsInBusiness: Number(formData.yearsInBusiness) || 1,
          categories: formData.categories,
        }
      );

      if (result.success) {
        setStatusMessage({ type: 'success', text: 'Profile & company details successfully saved and updated!' });
        setIsEditing(false);
      } else {
        setStatusMessage({ type: 'error', text: result.error || 'Failed to update profile.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'Unexpected error occurred.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: currentUser.fullName || '',
      jobTitle: currentUser.jobTitle || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      username: currentUser.username || '',
      avatarUrl: currentUser.avatarUrl || '',
      password: currentUser.password || '',
      companyName: currentCompany.name || '',
      legalName: currentCompany.legalName || currentCompany.name || '',
      tradeLicenseNumber: currentCompany.tradeLicenseNumber || '',
      emirate: (currentCompany.emirate || 'Dubai') as Emirate,
      industrialZone: currentCompany.industrialZone || INDUSTRIAL_ZONES[0],
      address: currentCompany.address || '',
      companyPhone: currentCompany.phone || '',
      companyEmail: currentCompany.email || '',
      website: currentCompany.website || '',
      yearsInBusiness: currentCompany.yearsInBusiness || 1,
      categories: currentCompany.categories || [],
    });
    setIsEditing(false);
    setStatusMessage(null);
  };

  const roleLabel = role === 'buyer' 
    ? 'Contractor Buyer' 
    : role === 'supplier' 
    ? 'Verified UAE Stockist' 
    : 'Marketplace Operations Admin';

  const roleBadgeColor = role === 'buyer' 
    ? 'bg-brand-500/10 text-brand-600 border-brand-200' 
    : role === 'supplier' 
    ? 'bg-amber-500/10 text-amber-700 border-amber-200' 
    : 'bg-emerald-500/10 text-emerald-700 border-emerald-200';

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Banner & Header */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 p-6 sm:p-8 text-white shadow-xl overflow-hidden border border-slate-700/60">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="relative group">
              {formData.avatarUrl ? (
                <img
                  src={formData.avatarUrl}
                  alt={formData.fullName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-white/10 shadow-lg border border-slate-600"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-slate-900 text-white font-extrabold text-2xl sm:text-3xl flex items-center justify-center ring-4 ring-white/10 shadow-lg border border-slate-600 tracking-wider select-none">
                  {userInitials}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1.5 -right-1.5 p-2 rounded-xl bg-slate-900 hover:bg-brand-600 text-white shadow-lg border border-slate-700 transition-all hover:scale-105 cursor-pointer"
                title="Choose photo from gallery or folders"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {formData.fullName || 'User Profile'}
                </h1>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${roleBadgeColor} bg-white/90`}>
                  {roleLabel}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {currentCompany.verificationStatus === 'verified' ? 'DET Verified' : 'Compliance Review'}
                </span>
              </div>

              <p className="text-sm text-slate-300 font-medium flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-brand-400 shrink-0" />
                <span>{formData.companyName}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{formData.jobTitle || 'Representative'}</span>
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {formData.emirate}, UAE
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {formData.email}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Member since {currentCompany.createdAt ? new Date(currentCompany.createdAt).getFullYear() : '2024'}
                </span>
              </div>
            </div>
          </div>

          <div className="shrink-0 w-full sm:w-auto flex sm:flex-col gap-2">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-all hover:scale-[1.02]"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all hover:scale-[1.02] disabled:opacity-50"
                >
                  {isSaving ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Notifications */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between gap-3 text-xs font-semibold animate-fadeIn ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-red-50 text-red-900 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl p-1.5 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab('personal')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'personal'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Personal Account</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('company')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'company'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>UAE Company & Commercial</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'security'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Security & Credentials</span>
        </button>
      </div>

      <form onSubmit={handleSave}>
        {/* TAB 1: PERSONAL ACCOUNT */}
        {activeTab === 'personal' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-600" />
                  <span>Personal & Contact Information</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your direct contact details used for official RFQ notifications, quotations, and procurement correspondence.
                </p>
              </div>

              {/* Profile Photo from Device / Gallery */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {formData.avatarUrl ? (
                      <img
                        src={formData.avatarUrl}
                        alt={formData.fullName}
                        className="w-16 h-16 rounded-xl object-cover ring-2 ring-brand-500/40 shadow-sm border border-slate-300"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-600 to-slate-900 text-white font-extrabold text-xl flex items-center justify-center border border-slate-700 select-none">
                        {userInitials}
                      </div>
                    )}
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">Profile Picture</h3>
                      <p className="text-[11px] text-slate-500">
                        Choose your photo directly from your device folders or mobile gallery.
                      </p>
                      {imageUploadError && (
                        <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{imageUploadError}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>{formData.avatarUrl ? 'Change from Folders / Gallery' : 'Upload from Folders / Gallery'}</span>
                    </button>

                    {formData.avatarUrl && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs border border-red-200 transition-colors cursor-pointer"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-[10px] text-slate-400">
                  Select JPG, PNG, or WEBP from your local PC storage or mobile camera roll. No stock or AI generated pictures.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      placeholder="e.g. Eng. Tariq Mansour"
                    />
                  ) : (
                    <p className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900">
                      {formData.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Job Title / Designation
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.jobTitle}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      placeholder="e.g. Senior Procurement Engineer"
                    />
                  ) : (
                    <p className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800">
                      {formData.jobTitle || 'Not specified'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Corporate Email Address <span className="text-red-500">*</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      placeholder="e.g. procurement@apexcontracting.ae"
                    />
                  ) : (
                    <p className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formData.email}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    UAE Mobile / WhatsApp
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      placeholder="e.g. +971 50 492 8812"
                    />
                  ) : (
                    <p className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formData.phone || 'Not specified'}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Platform Login Username
                  </label>
                  <p className="px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-700">
                    @{formData.username || 'user'}
                  </p>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Unique identifier assigned at registration
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Account Role & Permissions
                  </label>
                  <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{roleLabel}</span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                      Standard
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMPANY & COMMERCIAL DETAILS */}
        {activeTab === 'company' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-brand-600" />
                  <span>UAE Commercial Registration & Business Profile</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official UAE trade license details, industrial territory, and material sourcing categories.
                </p>
              </div>

              {/* Trade License Status Banner */}
              <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-extrabold text-sm text-white">
                        {currentCompany.tradeLicenseNumber || 'TL-REGISTERED'}
                      </p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {currentCompany.verificationStatus === 'verified' ? 'Verified by DET Dubai' : 'Review In Progress'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {currentCompany.name} • Registered in {currentCompany.emirate}, UAE
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-300 font-medium">Compliance:</span>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800">
                    2026 UAE Trade Standards
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Company Trade Name <span className="text-red-500">*</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      placeholder="e.g. Apex MEP & General Contracting LLC"
                    />
                  ) : (
                    <p className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900">
                      {formData.companyName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Official Legal Name (as on Trade License)
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.legalName}
                      onChange={(e) => handleInputChange('legalName', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      placeholder="e.g. Apex MEP Contracting (L.L.C.)"
                    />
                  ) : (
                    <p className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800">
                      {formData.legalName || formData.companyName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    UAE Trade License Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.tradeLicenseNumber}
                      onChange={(e) => handleInputChange('tradeLicenseNumber', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      placeholder="e.g. CN-1092837 or TL-551029"
                    />
                  ) : (
                    <p className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900">
                      {formData.tradeLicenseNumber || 'Not specified'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Registered Emirate
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.emirate}
                      onChange={(e) => handleInputChange('emirate', e.target.value as Emirate)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
                    >
                      {EMIRATES.map((em) => (
                        <option key={em} value={em}>{em}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900">
                      {formData.emirate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Industrial Zone / Business Hub
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.industrialZone}
                      onChange={(e) => handleInputChange('industrialZone', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
                    >
                      {INDUSTRIAL_ZONES.map((zone) => (
                        <option key={zone} value={zone}>{zone}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800">
                      {formData.industrialZone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Years in UAE Business
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={formData.yearsInBusiness}
                      onChange={(e) => handleInputChange('yearsInBusiness', parseInt(e.target.value) || 1)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    />
                  ) : (
                    <p className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900">
                      {formData.yearsInBusiness} Years
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Physical Warehouse / Office Address
                  </label>
                  {isEditing ? (
                    <textarea
                      rows={2}
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      placeholder="e.g. Street 8, Warehouse 12, Al Quoz 3, Dubai, UAE"
                    />
                  ) : (
                    <p className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <span>{formData.address || 'Address not listed'}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Corporate Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.companyPhone}
                      onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      placeholder="e.g. +971 4 290 8822"
                    />
                  ) : (
                    <p className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800">
                      {formData.companyPhone || 'Not listed'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Website URL
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      placeholder="e.g. https://apexcontracting.ae"
                    />
                  ) : (
                    <p className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formData.website || 'No website listed'}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Material Categories Scope */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      {role === 'supplier' ? 'Registered Supply Categories' : 'Primary Procurement Scope'}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {role === 'supplier' 
                        ? 'Select the categories of electrical wholesale materials your stockist carries.' 
                        : 'Select the categories your project team procures most frequently.'}
                    </p>
                  </div>
                  {isEditing && (
                    <span className="text-[11px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                      {formData.categories.length} Selected
                    </span>
                  )}
                </div>

                {isEditing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {AVAILABLE_CATEGORIES.map((cat) => {
                      const isSelected = formData.categories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-brand-50/80 border-brand-300 text-brand-900 shadow-xs'
                              : 'bg-slate-50/60 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <span>{cat}</span>
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                            isSelected ? 'bg-brand-600 text-white' : 'border border-slate-300'
                          }`}>
                            {isSelected ? '✓' : ''}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {formData.categories.length > 0 ? (
                      formData.categories.map((cat, idx) => (
                        <span key={idx} className="bg-brand-50 text-brand-800 font-semibold text-xs px-3 py-1.5 rounded-lg border border-brand-200">
                          ✓ {cat}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No specific categories specified.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SECURITY & PASSWORD */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-brand-600" />
                  <span>Security & Access Credentials</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your account password and manage authenticated session preferences.
                </p>
              </div>

              <div className="max-w-md space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Account Username
                  </label>
                  <p className="px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-700">
                    @{formData.username}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Change Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      disabled={!isEditing}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder={isEditing ? 'Enter new password' : '••••••••••••'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:bg-slate-50"
                    />
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                  {!isEditing && (
                    <p className="text-[11px] text-slate-400 mt-1">
                      Click "Edit Profile" at the top to modify your account password.
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Two-Factor Authentication (2FA) Readiness</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Your corporate account is linked to UAE Pass and official phone validation. All quotes and purchase orders require SMS confirmation.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Bar when editing */}
        {isEditing && (
          <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-300 shadow-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="font-semibold">Unsaved edits present</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all hover:scale-[1.02] flex items-center gap-1.5"
              >
                {isSaving ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isSaving ? 'Saving Changes...' : 'Save All Changes'}</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
